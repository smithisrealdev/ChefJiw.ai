import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import * as Notifications from 'expo-notifications';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, AppState, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';

import { Icon } from '@/components/icon';
import { kitchenActs, KitchenStage, type Taps } from '@/components/kitchen-stage';
import { ApiNotice, Button, Card, Float, IconButton, Mascot, mmss, Sheet, Skeleton, T } from '@/components/ui';
import { finalScore, kitchenPenalty, nextAct } from '@/data/kitchen';
import { buildRecipe, MENU, SAFETY, tasteScore, type Heat, type Recipe, type Step } from '@/data/recipes';
import { api, ApiError, type ApiErrorKind } from '@/lib/api';
import { BETA } from '@/lib/beta';
import { FREE_PER_DAY, freeLeft, localDay, spendOne } from '@/lib/quota';
import { cancelTimer, putProgress, useSettings, type Progress } from '@/lib/settings';
import { fonts, onPastel, radius, space, type, vivid } from '@/theme/tokens';

const RING = 196, RING_R = RING / 2 - 10, RING_C = 2 * Math.PI * RING_R;

export default function Cook() {
  useKeepAwake(); // หน้าจอไม่ดับเองตลอดการทำอาหาร
  const { id } = useLocalSearchParams<{ id: string }>();
  const { progress, set, t, colors } = useSettings();
  const p: Progress = progress.find((x) => x.recipe === id) ?? { recipe: id, o1: 1, o2: 0, adapt: [], step: 0, total: 0 };
  const r = buildRecipe(id, p.o1, p.o2, p.adapt);
  const [taste, setTaste] = useState(false);
  if (!r) return null;
  // อ่านค่าล่าสุดจาก state ทุกครั้ง เพราะเปลี่ยนขั้นกับเริ่มจับเวลาอาจเกิดติดกัน
  const change = (f: (cur: Progress) => Partial<Progress>) =>
    set((prev) => { const cur = prev.progress.find((x) => x.recipe === id) ?? p; return { progress: putProgress(prev.progress, id, { ...cur, ...f(cur) }) }; });
  const update = (patch: Partial<Progress>) => change(() => patch);
  return taste ? <Taste key={id} r={r} /> : <Steps key={id} r={r} p={p} start={Math.min(p.step, r.steps.length - 1)} onFinish={() => setTaste(true)}
    onStep={(step) => { cancelTimer(p); update({ step, total: r.steps.length, timer: undefined }); }}
    onTimer={(timer) => update({ timer })} t={t} colors={colors}
    onMiss={() => change((cur) => ({ miss: (cur.miss ?? 0) + 1 }))}
    onSkip={(sid) => change((cur) => ({ skip: [...new Set([...(cur.skip ?? []), sid])] }))} />;
}

function Steps({ r, p, start, onStep, onTimer, onFinish, onMiss, onSkip, t, colors }: { r: Recipe; p: Progress; start: number; onStep: (i: number) => void; onTimer: (timer: Progress['timer']) => void; onFinish: () => void; onMiss: () => void; onSkip: (step: string) => void; t: ReturnType<typeof useSettings>['t']; colors: ReturnType<typeof useSettings>['colors'] }) {
  const { pick, isDark } = useSettings();
  const insets = useSafeAreaInsets();
  const [i, setI] = useState(start);
  const [askOpen, setAskOpen] = useState(false);
  const [taps, setTaps] = useState<Taps>({ step: start, n: [] });
  const step = r.steps[i], prev = i > 0 ? r.steps[i - 1] : null, last = i === r.steps.length - 1;
  const heat = currentHeat(r.steps, i);
  const ink = isDark ? colors.ink : onPastel.ink;

  const go = (n: number) => { setI(n); onStep(n); };
  const exit = () => {
    const leave = () => (router.canGoBack() ? router.back() : router.replace('/cook'));
    if (Platform.OS === 'web') { if (window.confirm(`${t('cook.exitTitle')}\n${t('cook.exitBody')}`)) leave(); return; }
    Alert.alert(t('cook.exitTitle'), t('cook.exitBody'), [{ text: t('cook.exitStay'), style: 'cancel' }, { text: t('cook.exitLeave'), onPress: leave }]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.header.cookFlow }}>
      <View style={[s.top, { paddingTop: insets.top + space.sm }]}>
        <IconButton icon="close" label={t('cook.close')} onPress={exit} onPastelBg />
        <T v="subheading" style={{ color: ink, flex: 1, textAlign: 'center' }}>{t('cook.step', { n: step.phase, total: r.phases })}</T>
        {/* ปุ่มถามเชฟอยู่ที่เดิมทุกขั้น */}
        <Pressable accessibilityRole="button" onPress={() => setAskOpen(true)} style={[s.ask, { backgroundColor: isDark ? colors.surface : '#FFFFFF' }]}>
          <Icon name="chat" color={ink} size={20} />
          <T v="smallBold" style={{ color: ink }}>{t('cook.ask')}</T>
        </Pressable>
      </View>
      <View style={s.bar} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {Array.from({ length: r.phases }, (_, k) => <View key={k} style={[s.seg, { backgroundColor: k < step.phase ? ink : 'rgba(36,33,43,0.18)' }]} />)}
      </View>
      <OtherTimers current={r.id} ink={ink} />
      <KitchenStage r={r} i={i} taps={taps} setTaps={setTaps} onMiss={onMiss}
        onStir={() => { if (step.timer && p.timer?.step !== step.id) void beginTimer(step.timer, pick(r.name), t, (endAt, note) => onTimer({ step: step.id, endAt, note })); }} />

      <View style={[s.sheet, { backgroundColor: colors.bg }]}>
        <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.md, paddingBottom: space.xl }}>
          {prev && (
            <Card tone="done">
              <T v="smallBold" tone="pastelMuted">{t('cook.lesson')} · {pick(prev.title)}</T>
              <T tone="pastel">{pick(prev.why)}</T>
            </Card>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.sm, flexWrap: 'wrap' }}>
            <T v="heading" style={{ flex: 1 }} accessibilityRole="header">{pick(step.title)}</T>
            {heat !== null && <HeatBadge heat={heat} t={t} />}
          </View>
          <T v="step">{pick(step.do)}</T>
          {step.gather && (
            <Card>
              <T v="smallBold" tone="muted">{t('cook.gather')}</T>
              {step.gather.map((g) => <T key={g.th} v="bodyBold">• {pick(g)}</T>)}
            </Card>
          )}
          <Card tone="note">
            <T v="smallBold" tone="pastelMuted">{t('cook.see')}</T>
            <T v="bodyBold" tone="pastel">{pick(step.see)}</T>
          </Card>
          {step.timer && <Timer key={step.id} seconds={step.timer} name={pick(r.name)} endAt={p.timer?.step === step.id ? p.timer.endAt : null}
            onStart={(endAt, note) => onTimer({ step: step.id, endAt, note })} t={t} />}
        </ScrollView>
        {/* ปุ่มหลักปุ่มเดียวต่อขั้น ครึ่งล่างของจอ ไม่มีการปัดเปลี่ยนขั้น */}
        <View style={[s.foot, { paddingBottom: Math.max(insets.bottom, space.md), borderTopColor: colors.line }]}>
          <Button size="cook" label={last ? t('cook.finish') : t('cook.done')} onPress={() => {
            Haptics.selectionAsync().catch(() => {});
            // กดผ่านทั้งที่ยังแตะในครัวไม่ครบ นับเป็นข้ามขั้น (หักคะแนนตอนชิม เหมือนต้นแบบ)
            const acts = kitchenActs(r, i);
            if (acts.length && nextAct(acts, taps.step === i ? taps.n : []) >= 0) onSkip(step.id);
            if (last) onFinish(); else go(i + 1);
          }} />
          {i > 0 && <Pressable accessibilityRole="button" onPress={() => go(i - 1)} style={s.link}><T v="bodyBold" tone="muted">{t('cook.back')}</T></Pressable>}
        </View>
      </View>

      <AskSheet key={step.id} visible={askOpen} onClose={() => setAskOpen(false)} r={r} step={step} />
    </View>
  );
}

function currentHeat(steps: Step[], i: number): Heat | null {
  for (let k = i; k >= 0; k--) if (steps[k].heat !== undefined) return steps[k].heat as Heat;
  return null;
}

/** ระดับไฟบอกทั้งคำและจำนวนเปลวไฟ ไม่ใช้สีอย่างเดียว */
function HeatBadge({ heat, t }: { heat: Heat; t: ReturnType<typeof useSettings>['t'] }) {
  const { colors } = useSettings();
  return (
    <View style={[s.heat, { backgroundColor: colors.surfaceSoft }]} accessible accessibilityLabel={t(`cook.heat${heat}`)}>
      {heat === 0 ? <Icon name="close" color={colors.muted} size={18} /> : Array.from({ length: heat }, (_, k) => <Icon key={k} name="flame" color={colors.flame} size={18} />)}
      <T v="smallBold">{t(`cook.heat${heat}`)}</T>
    </View>
  );
}

/** ตัวจับเวลาของจานอื่นที่ยังเดินอยู่ เช่น พะโล้ที่เคี่ยวอยู่ระหว่างทำแกง แตะเพื่อสลับไปจานนั้น */
function OtherTimers({ current, ink }: { current: string; ink: string }) {
  const { progress, pick, t, colors, isDark } = useSettings();
  const others = progress.filter((x) => x.recipe !== current && x.timer);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!others.length) return;
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, [others.length]);
  if (!others.length) return null;
  return (
    <View style={s.others}>
      {others.map((x) => {
        const m = MENU.find((d) => d.id === x.recipe);
        const left = Math.ceil((x.timer!.endAt - now) / 1000);
        const label = `${m ? pick(m.name) : x.recipe} · ${left > 0 ? t('cook.timerLeft', { t: mmss(left) }) : t('cook.timerNotify')}`;
        return (
          <Pressable key={x.recipe} accessibilityRole="button" accessibilityLabel={label} onPress={() => router.replace(`/cook/${x.recipe}`)}
            style={[s.pill, { backgroundColor: left > 0 ? (isDark ? colors.surface : '#FFFFFF') : colors.done }]}>
            <Icon name="clock" color={left > 0 ? ink : onPastel.ink} size={18} />
            <T v="smallBold" numberOfLines={1} style={{ color: left > 0 ? ink : onPastel.ink, flexShrink: 1 }}>{label}</T>
          </Pressable>
        );
      })}
    </View>
  );
}

/** เริ่มจับเวลาแล้วตั้งการแจ้งเตือนล่วงหน้า ใช้ทั้งปุ่มในการ์ดจับเวลาและตอนแตะคนกระทะในครัวจำลอง */
async function beginTimer(seconds: number, name: string, t: ReturnType<typeof useSettings>['t'], onStart: (endAt: number, note: string | null) => void) {
  const end = Date.now() + seconds * 1000;
  onStart(end, null);
  if (Platform.OS === 'web') return;
  try {
    const perm = await Notifications.requestPermissionsAsync();
    if (perm.granted) onStart(end, await Notifications.scheduleNotificationAsync({
      content: { title: `${t('cook.timerNotify')}: ${name}`, body: t('cook.timerDone'), sound: true },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds },
    }));
  } catch { /* ไม่มีสิทธิ์แจ้งเตือน ตัวจับเวลาในแอปยังทำงาน */ }
}

/** จับเวลาจากเวลาจริงของเครื่อง เวลาจบเก็บไว้กับจาน จึงเดินต่อแม้ล็อกจอ ออกจากหน้านี้ หรือสลับไปทำจานอื่น และตั้งการแจ้งเตือนไว้ล่วงหน้า */
function Timer({ seconds, name, endAt, onStart, t }: { seconds: number; name: string; endAt: number | null; onStart: (endAt: number, note: string | null) => void; t: ReturnType<typeof useSettings>['t'] }) {
  const [now, setNow] = useState(() => Date.now());
  const left = endAt ? Math.ceil((endAt - now) / 1000) : seconds;
  const done = endAt !== null && left <= 0;

  useEffect(() => {
    if (!endAt || done) return;
    const tick = setInterval(() => setNow(Date.now()), 250);
    const sub = AppState.addEventListener('change', () => setNow(Date.now()));
    return () => { clearInterval(tick); sub.remove(); };
  }, [endAt, done]);
  useEffect(() => { if (done) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {}); }, [done]);

  const startTimer = () => { setNow(Date.now()); void beginTimer(seconds, name, t, onStart); };

  return (
    <Card tone={done ? 'done' : 'ai'} style={{ alignItems: 'center', gap: space.sm }}>
      {/* วงแหวนหดตามเวลาที่เหลือ มองจากไกลก็รู้ว่าเหลือเท่าไร */}
      <View style={{ width: RING, height: RING, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={RING} height={RING} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }} accessible={false}>
          <Circle cx={RING / 2} cy={RING / 2} r={RING_R} stroke="rgba(36,33,43,0.14)" strokeWidth={14} fill="none" />
          <Circle cx={RING / 2} cy={RING / 2} r={RING_R} stroke={done ? onPastel.success : vivid.indigo} strokeWidth={14} strokeLinecap="round" fill="none"
            strokeDasharray={RING_C} strokeDashoffset={RING_C * (1 - Math.max(0, Math.min(1, left / seconds)))} />
        </Svg>
        {done ? <Float motion="jump"><Mascot name="cheer" size={120} /></Float> : <>
          <T v="smallBold" tone="pastelMuted">{t('cook.timer')}</T>
          <T v="hero" tone="pastel" accessibilityRole="header">{mmss(left)}</T>
        </>}
      </View>
      {done ? <T v="bodyBold" tone="pastel">{t('cook.timerDone')}</T>
        : !endAt ? <Button label={t('cook.timerStart', { t: mmss(seconds) })} kind="onPastel" onPress={startTimer} />
        : <T v="bodyBold" tone="pastel" accessibilityLiveRegion="polite">{t('cook.timerLeft', { t: mmss(left) })}</T>}
    </Card>
  );
}

/** คำตอบที่เตรียมไว้ขึ้นทันทีโดยไม่ต้องใช้เน็ต และเหตุฉุกเฉินเข้าถึงได้ในสองแตะ */
function AskSheet({ visible, onClose, r, step }: { visible: boolean; onClose: () => void; r: Recipe; step: Step }) {
  const { t, pick } = useSettings();
  const [open, setOpen] = useState<number | null>(null);
  const [safety, setSafety] = useState(false);
  return (
    <Sheet visible={visible} onClose={onClose} title={t('ask.title')} closeLabel={t('ask.back')}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: safety }} onPress={() => setSafety(!safety)} style={s.safetyBtn}>
        <Icon name="alert" color={onPastel.warn} />
        <T v="bodyBold" style={{ color: onPastel.warn }}>{t('ask.emergency')}</T>
      </Pressable>
      {safety && SAFETY.map(([q, a]) => (
        <Card key={q.th} tone="danger">
          <T v="subheading" style={{ color: onPastel.warn }}>{pick(q)}</T>
          <T v="step" tone="pastel" style={{ fontSize: 18 }}>{pick(a)}</T>
        </Card>
      ))}
      <T v="smallBold" tone="muted" style={{ marginTop: space.sm }}>{t('ask.often')}</T>
      {r.qa(step).map(([q, a], k) => (
        <Card key={q.th} tone={open === k ? 'note' : 'soft'} onPress={() => setOpen(open === k ? null : k)} label={pick(q)}>
          <T v="bodyBold" tone={open === k ? 'pastel' : 'ink'}>{pick(q)}</T>
          {open === k && <T tone="pastel">{pick(a)}</T>}
        </Card>
      ))}
      <TypedAsk r={r} step={step} onLeave={onClose} />
    </Sheet>
  );
}

/** พิมพ์ถามเอง: ต้องเข้าสู่ระบบ ฟรีวันละ FREE_PER_DAY คำถาม สมาชิกไม่จำกัด คำถามที่ล้มเหลวไม่ถูกนับ */
function TypedAsk({ r, step, onLeave }: { r: Recipe; step: Step; onLeave: () => void }) {
  const { t, lang, colors, signedIn, member, asked, set, pick } = useSettings();
  const [text, setText] = useState('');
  const [state, setState] = useState<{ kind: 'idle' | 'login' | 'quota' | 'loading' | 'answer' | 'error'; q?: string; answer?: string; error?: ApiErrorKind }>({ kind: 'idle' });
  const left = freeLeft(asked, localDay());

  const send = async (question = text.trim()) => {
    if (!question || state.kind === 'loading') return;
    if (!signedIn) return setState({ kind: 'login' });
    if (!member && left <= 0) return setState({ kind: 'quota' });
    setState({ kind: 'loading', q: question }); setText('');
    try {
      const res = await api.askChef(question, { recipe: pick(r.name), step: pick(step.title), lang });
      if (!member) set({ asked: spendOne(asked, localDay()) });
      setState({ kind: 'answer', q: question, answer: res.answer });
    } catch (e) {
      const kind = e instanceof ApiError ? e.kind : 'failed';
      // เซิร์ฟเวอร์เป็นคนตัดสินโควตาและการเข้าสู่ระบบ ให้หน้าจอตามนั้น
      if (kind === 'quota') { set({ asked: { day: localDay(), n: FREE_PER_DAY } }); setState({ kind: 'quota' }); }
      else if (kind === 'unauthorized') { set({ signedIn: false }); setState({ kind: 'login' }); }
      else setState({ kind: 'error', q: question, error: kind });
    }
  };
  const goTo = (path: '/login' | '/paywall') => { onLeave(); router.push(path); };

  return (
    <View style={{ gap: space.sm, marginTop: space.sm }}>
      {state.kind === 'login' && (
        <Card tone="ai"><T v="subheading" tone="pastel">{t('ask.loginTitle')}</T><T tone="pastel">{t('ask.loginBody')}</T>
          <Button kind="onPastel" label={t('me.signIn')} onPress={() => goTo('/login')} style={{ alignSelf: 'flex-start', marginTop: space.sm }} /></Card>
      )}
      {state.kind === 'quota' && (
        <Card tone="soft"><T v="subheading">{t('ask.quotaTitle')}</T><T>{t('ask.quotaBody', { n: FREE_PER_DAY })}</T>
          {!BETA && <Button kind="accent" label={t('ask.seeMember')} onPress={() => goTo('/paywall')} style={{ alignSelf: 'flex-start', marginTop: space.sm }} />}</Card>
      )}
      {state.kind === 'loading' && <Skeleton label={t('ask.thinking')} lines={3} />}
      {state.kind === 'answer' && (
        <Card tone="ai"><T v="smallBold" tone="pastelMuted">{t('ask.aiAnswer')}</T><T v="bodyBold" tone="pastel">{state.q}</T><T tone="pastel">{state.answer}</T>
          <T v="small" tone="pastelMuted">{t('ask.aiNote')}</T></Card>
      )}
      {state.kind === 'error' && state.error && <ApiNotice kind={state.error} onRetry={() => send(state.q)} />}
      <View style={{ flexDirection: 'row', gap: space.sm, alignItems: 'center' }}>
        <TextInput value={text} onChangeText={setText} onSubmitEditing={() => send()} returnKeyType="send"
          placeholder={t('ask.typePlaceholder')} placeholderTextColor={colors.muted} accessibilityLabel={t('ask.typeLabel')}
          style={{ flex: 1, minHeight: 48, paddingHorizontal: space.lg, borderRadius: radius.pill, backgroundColor: colors.surfaceSoft, color: colors.ink, fontFamily: fonts.body, fontSize: type.md }} />
        <IconButton filled icon="next" label={t('ask.send')} onPress={() => send()} />
      </View>
      <T v="small" tone="muted">{member ? t('ask.member') : t('ask.left', { n: left })}</T>
    </View>
  );
}

function Taste({ r }: { r: Recipe }) {
  const { t, pick, colors, set, progress, device } = useSettings();
  const insets = useSafeAreaInsets();
  const [ans, setAns] = useState<(number | null)[]>(r.senses.map(() => null));
  const [score, setScore] = useState<number | null>(null);
  // หักคะแนนจากในครัวจำลอง อ่านไว้ก่อน เพราะส่งคะแนนแล้วความคืบหน้าของจานนี้ถูกล้าง
  const [kit] = useState(() => { const cur = progress.find((x) => x.recipe === r.id); return { miss: cur?.miss ?? 0, skip: cur?.skip?.length ?? 0 }; });
  const [raw, setRaw] = useState(0);
  const submit = () => {
    const taste = tasteScore(ans as number[]);
    const sc = finalScore(taste, kit.miss, kit.skip);
    setRaw(taste);
    setScore(sc);
    const id = device || Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
    cancelTimer(progress.find((x) => x.recipe === r.id));
    set((prev) => ({ runs: [...prev.runs, { recipe: r.id, score: sc, at: Date.now() }], progress: putProgress(prev.progress, r.id, null), device: id }));
    void api.logRun(id, r.id, taste); // ผลทดสอบในครัวจริงเก็บคะแนนรสชาติล้วน ไม่รวมการแตะบนจอ
  };
  return (
    <ScrollView style={{ backgroundColor: colors.bg }} contentContainerStyle={{ padding: space.lg, paddingTop: insets.top + space.lg, gap: space.md, paddingBottom: insets.bottom + space.xl }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md }}>
        <View style={{ flex: 1, gap: space.xs }}>
          <T v="title" accessibilityRole="header">{score === null ? t('taste.title') : t('taste.result')}</T>
          {score === null && <T tone="muted">{t('taste.intro')}</T>}
        </View>
        {score !== null && score >= 4 ? <Float motion="jump"><Mascot name="yum" size={120} /></Float>
          : <Mascot name={score === null ? 'sip' : 'hmm'} size={120} />}
      </View>
      {score !== null && (
        <Card tone="accent" style={{ alignItems: 'center' }}>
          <T v="hero" tone="pastel">{score.toFixed(1)}</T>
          <T v="bodyBold" tone="pastel">{t('taste.outOf')}</T>
          {kitchenPenalty(kit.miss, kit.skip) > 0 && <>
            <T v="small" tone="pastel">{t('taste.tasteOnly', { s: raw.toFixed(1) })}</T>
            <T v="small" tone="pastel">{t('taste.penalty', { p: kitchenPenalty(kit.miss, kit.skip).toFixed(1), skip: kit.skip, miss: kit.miss })}</T>
          </>}
        </Card>
      )}
      {r.senses.map((sense, k) => (
        <View key={sense.label.th} style={{ gap: space.sm }}>
          <T v="subheading">{pick(sense.label)}</T>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: space.sm }}>
            {sense.options.map((o, j) => (
              <Pressable key={j} accessibilityRole="radio" accessibilityState={{ checked: ans[k] === j, disabled: score !== null }} disabled={score !== null}
                onPress={() => setAns(ans.map((a, x) => (x === k ? j : a)))}
                style={[s.opt, { backgroundColor: ans[k] === j ? colors.primary : colors.surfaceSoft }]}>
                <T v="bodyBold" style={{ color: ans[k] === j ? colors.onPrimary : colors.ink }}>{pick(o)}</T>
              </Pressable>
            ))}
          </View>
          {score !== null && (
            <Card tone={ans[k] === 1 ? 'done' : 'note'}>
              <T tone="pastel">{ans[k] === 1 ? t('taste.good', { text: pick(sense.good) }) : pick(sense.tips[ans[k] === 0 ? 0 : 1])}</T>
            </Card>
          )}
        </View>
      ))}
      {score === null
        ? <Button size="cook" label={t('taste.submit')} disabled={ans.some((a) => a === null)} onPress={submit} />
        : <>
            <Button size="cook" label={t('taste.again')} onPress={() => router.replace('/recipes')} />
            <Button kind="secondary" label={t('taste.home')} onPress={() => router.replace('/')} />
          </>}
    </ScrollView>
  );
}

const s = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg },
  ask: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, paddingHorizontal: space.md, borderRadius: radius.pill },
  bar: { flexDirection: 'row', gap: 6, paddingHorizontal: space.lg, paddingVertical: space.md },
  seg: { flex: 1, height: 8, borderRadius: radius.pill },
  others: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, paddingHorizontal: space.lg, paddingBottom: space.md },
  pill: { flexDirection: 'row', alignItems: 'center', gap: space.xs, minHeight: 44, paddingHorizontal: space.md, borderRadius: radius.pill, maxWidth: '100%' },
  sheet: { flex: 1, borderTopLeftRadius: radius.lg, borderTopRightRadius: radius.lg, overflow: 'hidden' },
  foot: { paddingHorizontal: space.lg, paddingTop: space.md, gap: space.xs, borderTopWidth: StyleSheet.hairlineWidth },
  link: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  heat: { flexDirection: 'row', alignItems: 'center', gap: 4, minHeight: 36, paddingHorizontal: space.md, borderRadius: radius.pill },
  safetyBtn: { flexDirection: 'row', alignItems: 'center', gap: space.sm, alignSelf: 'flex-start', minHeight: 48, paddingHorizontal: space.lg, borderRadius: radius.pill, backgroundColor: '#FFE3D6' },
  opt: { minHeight: 48, paddingHorizontal: space.lg, borderRadius: radius.pill, justifyContent: 'center' },
});
