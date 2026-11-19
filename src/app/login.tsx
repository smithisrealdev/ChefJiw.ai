import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Icon } from '@/components/icon';
import { ApiNotice, Button, Card, Screen, T } from '@/components/ui';
import { MASCOT } from '@/data/images';
import { api, ApiError, type ApiErrorKind, type Provider } from '@/lib/api';
import { freeLeft, localDay } from '@/lib/quota';
import { useSettings } from '@/lib/settings';
import { space } from '@/theme/tokens';

const PROVIDERS: [Provider, string][] = [['line', 'LINE'], ['google', 'Google'], ['apple', 'Apple']];
const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

export default function Login() {
  const { colors, isDark, t, signedIn, asked, set } = useSettings();
  const [busy, setBusy] = useState<Provider | null>(null);
  const [error, setError] = useState<ApiErrorKind | null>(null);

  const signIn = async (p: Provider) => {
    setBusy(p); setError(null);
    try {
      const { member } = await api.signIn(p);
      set({ signedIn: true, member });
    } catch (e) {
      setError(e instanceof ApiError ? e.kind : 'failed');
    } finally {
      setBusy(null);
    }
  };
  const signOut = async () => { await api.signOut(); set({ signedIn: false, member: false }); };

  return (
    <Screen tint={isDark ? colors.bg : colors.ai} title={signedIn ? t('login.done') : t('login.title')} mascot={MASCOT.elephant} onBack={close} backLabel={t('login.close')}>
      {signedIn ? (
        <>
          <Card tone="done"><T v="subheading" tone="pastel">{t('login.doneBody', { n: freeLeft(asked, localDay()) })}</T></Card>
          <Button size="cook" label={t('login.back')} onPress={close} />
          <Button kind="secondary" label={t('login.signOut')} onPress={signOut} />
        </>
      ) : (
        <>
          <Card><T>{t('login.intro')}</T></Card>
          {[t('login.perk1'), t('login.perk2')].map((p) => (
            <View key={p} style={{ flexDirection: 'row', gap: space.sm, alignItems: 'center' }}>
              <Icon name="check" color={colors.success} />
              <T style={{ flex: 1 }}>{p}</T>
            </View>
          ))}
          {error && <ApiNotice kind={error} />}
          {PROVIDERS.map(([id, name], k) => (
            <Button key={id} size="cook" kind={k === 0 ? 'primary' : 'secondary'} disabled={busy !== null}
              label={busy === id ? t('login.busy') : t('login.with', { p: name })} onPress={() => signIn(id)} />
          ))}
          <Button kind="secondary" label={t('login.later')} onPress={close} />
          <T v="small" tone="muted" style={{ textAlign: 'center' }}>{t('login.terms')}</T>
        </>
      )}
    </Screen>
  );
}
