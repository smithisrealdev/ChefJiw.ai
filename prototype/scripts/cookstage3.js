class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { phase: 0, screen: 'recipe', serv: 1, have: {}, ti: 0, at: 'door', arrived: false, walking: false, face: 1, p: {}, fin: false, note: '', heat: 0, sec: 0, k: 0, stars: 0 };
  }
  componentWillUnmount() { clearInterval(this.tick); clearTimeout(this.t1); clearTimeout(this.t2); clearTimeout(this.t3); clearTimeout(this.t4); }
  tasks() {
    const T = (step, st, t, kind, o) => Object.assign({ step, st, t, kind }, o);
    return [
      T(0, 'fridge', 'หยิบของจากตู้เย็น', 'pick', { go: 'เดินไปเปิดตู้เย็น', hint: 'หยิบหมูสับ ไข่ กะเพรา กระเทียม และพริก', fin: 'ได้ของครบแล้ว', items: [['pork', 'หมูสับ', 1], ['egg', 'ไข่ไก่', 1], ['basil', 'กะเพรา', 1], ['garlic', 'กระเทียม', 1], ['chili', 'พริก', 1], ['morning', 'ผักบุ้ง', 0, 'ผักบุ้งเก็บไว้ทำเมนูอื่นนะ']] }),
      T(0, 'board', 'วางเขียง', 'seq', { go: 'เดินไปที่เคาน์เตอร์', hint: 'หยิบเขียงมาวางบนเคาน์เตอร์', fin: 'เขียงพร้อมแล้ว', acts: [['board', 'หยิบเขียง', 'board', 1]] }),
      T(0, 'rack', 'เลือกมีด', 'pick', { go: 'ไปที่ราวแขวนมีด', hint: 'เลือกมีดที่เหมาะกับการสับกระเทียม', fin: 'มีดเชฟ ใช้ได้เกือบทุกงาน', items: [['knife_cleaver', 'ปังตอ', 0, 'ปังตอหนักไปสำหรับงานนี้'], ['knife_chef', 'มีดเชฟ', 1], ['knife_paring', 'มีดปอก', 0, 'มีดปอกเล็กไป สับไม่ถนัด']] }),
      T(0, 'board', 'สับกระเทียมกับพริก', 'seq', { go: 'กลับไปที่เขียง', hint: 'จับมีดให้มั่น แล้วสับตามจังหวะ', fin: 'สับเสร็จ สวยเลย', acts: [['garlic', 'สับกระเทียม', 'garlic', 4], ['chili', 'สับพริก', 'chili', 4]] }),
      T(0, 'sink', 'ล้างใบกะเพรา', 'seq', { go: 'เดินไปที่อ่างล้างจาน', hint: 'เปิดน้ำ ล้างใบกะเพราแล้วสะบัดให้หมาด', fin: 'สะอาดแล้ว', acts: [['wash', 'เปิดน้ำล้าง', 'water', 3]] }),
      T(1, 'stove', 'เปิดเตาแก๊ส', 'seq', { go: 'เดินไปที่เตา', hint: 'กดลูกบิดค้างไว้แล้วบิด จนไฟติด', fin: 'ไฟติดแล้ว', acts: [['knob', 'กดแล้วบิด', 'knob', 1]] }),
      T(1, 'stove', 'หรี่ไฟเป็นกลาง', 'heat', { target: 1, hint: 'ไฟแรงไปไข่จะไหม้ หรี่ลงเป็นไฟกลาง', fin: 'ไฟกำลังดี' }),
      T(1, 'stove', 'ทอดไข่ดาว', 'seq', { hint: 'เทน้ำมัน รอให้ร้อน แล้วตอกไข่ลงไป', fin: 'ฉ่า! รอให้ขอบกรอบ', acts: [['oil', 'เทน้ำมัน', 'oil', 1], ['egg', 'ตอกไข่', 'egg', 1]] }),
      T(1, 'stove', 'ตักไข่ขึ้นพัก', 'seq', { hint: 'ราว 2 นาที ขอบกรอบเหลืองแล้วค่อยตัก', fin: 'ไข่ดาวสวยมาก', acts: [['scoop', 'ตักไข่ขึ้น', 'spatula', 1]] }),
      T(2, 'stove', 'ผัดกระเทียมพริก', 'seq', { hint: 'ใส่กระเทียมพริกที่สับไว้ แล้วผัดจนหอม', fin: 'หอมแล้ว', acts: [['mix', 'ใส่กระเทียมพริก', 'garlic', 1], ['stir', 'ผัด', 'spatula', 5]] }),
      T(3, 'stove', 'เร่งไฟแรง', 'heat', { target: 2, hint: 'หมูต้องใช้ไฟแรง เร่งไฟขึ้นเลย', fin: 'ไฟแรงแล้ว' }),
      T(3, 'stove', 'ผัดหมูสับ', 'seq', { hint: 'ใส่หมู กดยีให้แตก ผัดจนไม่เหลือสีชมพู', fin: 'หมูสุกทั่วแล้ว', acts: [['pork', 'ใส่หมูสับ', 'pork', 1], ['stir', 'ยีและผัด', 'spatula', 8]] }),
      T(4, 'shelf', 'หยิบเครื่องปรุง', 'pick', { go: 'เดินไปที่ชั้นเครื่องปรุง', hint: 'หยิบซอสหอย ซีอิ๊วขาว น้ำปลา และน้ำตาล', fin: 'เครื่องปรุงครบ', items: [['oyster', 'ซอสหอย', 1], ['soy', 'ซีอิ๊วขาว', 1], ['fish', 'น้ำปลา', 1], ['sugar', 'น้ำตาล', 1], ['oil', 'น้ำมัน', 0, 'น้ำมันใส่ไปแล้วนะ']] }),
      T(4, 'sink', 'รองน้ำ', 'seq', { go: 'เดินไปที่ก๊อกน้ำ', hint: 'รองน้ำเปล่าไว้ 2 ช้อนโต๊ะ', fin: 'ได้น้ำแล้ว', acts: [['water', 'รองน้ำ', 'water', 2]] }),
      T(4, 'stove', 'ปรุงรส', 'seq', { go: 'กลับไปที่เตา', hint: 'ใส่เครื่องปรุง เติมน้ำ แล้วผัดให้เข้ากัน', fin: 'ชิมดู เค็มไปเติมน้ำ จืดไปเติมน้ำปลา', acts: [['season', 'ใส่เครื่องปรุง', 'oyster', 1], ['addwater', 'เติมน้ำ', 'water', 1], ['stir', 'ผัด', 'spatula', 4]] }),
      T(5, 'stove', 'ปิดไฟ', 'heat', { target: 0, hint: 'ปิดไฟก่อนใส่กะเพรา ใบจะเขียวและหอม', fin: 'ปิดไฟแล้ว' }),
      T(5, 'stove', 'ใส่กะเพรา', 'seq', { hint: 'ใส่ใบกะเพรา ผัดเร็วๆ พอใบสลด', fin: 'หอมมาก', acts: [['basil', 'ใส่กะเพรา', 'basil', 1], ['stir', 'ผัด', 'spatula', 3]] }),
      T(5, 'stove', 'จัดจาน', 'seq', { hint: 'ตักราดข้าว แล้ววางไข่ดาวไว้ข้างบน', fin: 'เสร็จแล้ว!', acts: [['plate', 'ตักใส่จาน', 'rice', 1]] }),
    ];
  }
  chefX(at) { return ({ out: -120, door: 150, fridge: 14, shelf: 108, sink: 108, rack: 198, board: 198, stove: 288 })[at]; }
  startCook() {
    clearInterval(this.tick); clearTimeout(this.t1); clearTimeout(this.t2); clearTimeout(this.t3); clearTimeout(this.t4);
    const calm = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm) { this.enterKitchen(true); return; }
    this.setState({ screen: 'enter', phase: 0 });
    this.t3 = setTimeout(() => this.setState({ phase: 1 }), 80);
    this.t4 = setTimeout(() => this.enterKitchen(false), 1800);
  }
  enterKitchen(instant) {
    clearTimeout(this.t3); clearTimeout(this.t4); clearTimeout(this.t1);
    this.setState({ screen: 'cook', ti: 0, at: instant ? 'door' : 'out', arrived: false, walking: !instant, face: 1, p: {}, fin: false, note: '', heat: 0, sec: 0 });
    if (instant) return;
    this.t3 = setTimeout(() => this.setState({ at: 'door' }), 80);
    this.t1 = setTimeout(() => this.setState({ walking: false }), 900);
  }
  go(id) {
    const s = this.state, t = this.tasks()[s.ti];
    if (s.fin || s.walking) return;
    if (id !== t.st) { this.setState({ note: 'ตอนนี้ยังไม่ต้องไปตรงนั้นนะ', k: s.k + 1 }); return; }
    if (s.arrived) return;
    const from = this.chefX(s.at), to = this.chefX(id);
    this.setState({ at: id, walking: true, face: to < from ? -1 : 1, note: '' });
    clearTimeout(this.t1);
    this.t1 = setTimeout(() => this.setState({ walking: false, arrived: true, face: 1 }), to === from ? 80 : 760);
  }
  finish() {
    this.setState({ fin: true, note: '' });
    clearTimeout(this.t2);
    this.t2 = setTimeout(() => this.nextTask(), 900);
  }
  nextTask() {
    clearTimeout(this.t1); clearTimeout(this.t2);
    const s = this.state, all = this.tasks(), t = all[s.ti], ni = s.ti + 1;
    let heat = s.heat;
    if (t.kind === 'heat') heat = t.target;
    if (s.ti === 5) heat = 2;
    if (ni >= all.length) { clearInterval(this.tick); this.setState({ screen: 'done', fin: false, heat: 0 }); return; }
    if (ni !== 8) clearInterval(this.tick);
    this.setState({ ti: ni, p: {}, fin: false, note: '', heat, walking: false, arrived: all[ni].st === s.at });
  }
  doAct(t, a) {
    const s = this.state, id = a[0], n = s.p[id] || 0;
    if (s.fin || n >= a[3]) return;
    const p = Object.assign({}, s.p, { [id]: n + 1 });
    const patch = { p, k: s.k + 1, note: '' };
    if (id === 'knob') patch.heat = 2;
    if (id === 'egg') { clearInterval(this.tick); patch.sec = 0; this.tick = setInterval(() => this.setState({ sec: this.state.sec + 1 }), 1000); }
    if (id === 'scoop') clearInterval(this.tick);
    this.setState(patch);
    if (t.acts.every((x) => (p[x[0]] || 0) >= x[3])) this.finish();
  }
  doPick(t, it) {
    const s = this.state;
    if (s.fin) return;
    if (!it[2]) { this.setState({ note: it[3], k: s.k + 1 }); return; }
    const p = Object.assign({}, s.p, { [it[0]]: 1 });
    this.setState({ p, k: s.k + 1, note: '' });
    if (t.items.every((x) => !x[2] || p[x[0]])) this.finish();
  }
  setHeat(t, i) {
    if (this.state.fin) return;
    this.setState({ heat: i, k: this.state.k + 1, note: '' });
    if (t.kind === 'heat' && i === t.target) this.finish();
  }
  renderVals() {
    const s = this.state;
    const IMG = __IMG__;
    const X = __X__;
    const base = [
      { id: 'pork', name: 'หมูสับ', q: 120, u: 'กรัม', p: 22 },
      { id: 'basil', name: 'ใบกะเพรา', q: 1, u: 'กำมือ', p: 5 },
      { id: 'garlic', name: 'กระเทียม', q: 4, u: 'กลีบ', p: 2 },
      { id: 'chili', name: 'พริกขี้หนู', q: 4, u: 'เม็ด', p: 2 },
      { id: 'egg', name: 'ไข่ไก่', q: 1, u: 'ฟอง', p: 5 },
      { id: 'rice', name: 'ข้าวสวย', q: 1, u: 'จาน', p: 7 },
      { id: 'oil', name: 'น้ำมันพืช', q: 2, u: 'ช้อนโต๊ะ', p: 2 },
      { id: 'oyster', name: 'ซอสหอยนางรม', q: 1, u: 'ช้อนโต๊ะ', p: 2 },
      { id: 'soy', name: 'ซีอิ๊วขาว', q: 1, u: 'ช้อนชา', p: 1 },
      { id: 'fish', name: 'น้ำปลา', q: 1, u: 'ช้อนชา', p: 1 },
      { id: 'sugar', name: 'น้ำตาลทราย', q: 0.5, u: 'ช้อนชา', p: 1 },
    ];
    const num = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
    let total = 0;
    const items = base.map((it) => {
      const have = !!s.have[it.id];
      const price = it.p * s.serv;
      if (!have) total += price;
      return {
        name: it.name, img: IMG[it.id], have, qtyText: num(it.q * s.serv) + ' ' + it.u,
        priceText: have ? 'มีแล้ว' : '฿' + price, priceColor: have ? '#4A7443' : '#3B2A22',
        boxBg: have ? '#5E8F57' : '#F6E6CF',
        toggle: () => this.setState({ have: Object.assign({}, s.have, { [it.id]: !have }) }),
      };
    });
    const all = this.tasks(), ti = s.ti, t = all[ti];
    const c = (id) => s.p[id] || 0;
    const pic = (k) => X[k] || IMG[k];
    const HN = ['ปิดไฟ', 'ไฟกลาง', 'ไฟแรง'];
    const SOFT = '#F5F3FC', GREEN = '#C9F2CF', RING = '0 0 0 3px #24212B';
    const goText = t.go || 'เดินไปที่เตา';
    let btns;
    if (!s.arrived) {
      btns = [{ label: goText, img: X.walk, count: 'แตะเพื่อเดินไป', bg: SOFT, ring: RING, op: 1, disabled: s.walking, tap: () => this.go(t.st) }];
    } else if (t.kind === 'pick') {
      btns = t.items.map((it) => {
        const got = c(it[0]) > 0;
        return { label: it[1], img: pic(it[0]), count: got ? 'หยิบแล้ว' : 'แตะ', bg: got ? GREEN : SOFT, ring: 'none', op: 1, disabled: got || s.fin, tap: () => this.doPick(t, it) };
      });
    } else if (t.kind === 'heat') {
      btns = [0, 1, 2].map((i) => ({ label: HN[i], img: X['heat' + i], count: s.heat === i ? 'ตอนนี้' : 'แตะ', bg: s.heat === i ? '#FFE66D' : SOFT, ring: i === t.target && s.heat !== i ? RING : 'none', op: 1, disabled: s.fin, tap: () => this.setHeat(t, i) }));
    } else {
      let first = -1;
      t.acts.forEach((a, i) => { if (first < 0 && c(a[0]) < a[3]) first = i; });
      btns = t.acts.map((a, i) => {
        const n = c(a[0]), fin = n >= a[3], cur = i === first && !s.fin;
        return { stir: a[0] === 'stir', label: a[1], img: pic(a[2]), count: fin ? 'เรียบร้อย' : a[3] > 1 ? n + ' / ' + a[3] : 'แตะ', bg: fin ? GREEN : SOFT, ring: cur ? RING : 'none', op: fin || cur ? 1 : 0.55, disabled: !cur, tap: () => this.doAct(t, a) };
      });
    }
    const cuType = !s.arrived ? '' : t.st === 'board' ? (ti === 1 ? 'counter' : 'board') : t.st;
    const LAY = { fridge: [84, [[30, 36], [153, 36], [276, 36], [30, 150], [153, 150], [276, 150]]], rack: [124, [[10, 84], [133, 84], [256, 84]]], shelf: [74, [[6, 132], [82, 132], [158, 132], [234, 132], [310, 132]]], counter: [180, [[105, 70]]], board: [104, [[66, 58], [224, 58]]], sink: [116, [[18, 150]]], stove: [84, [[8, 4], [102, 4], [196, 4], [290, 4]]] };
    const loose = cuType === 'fridge' || cuType === 'rack' || cuType === 'shelf';
    let slot = 0;
    const objs = !cuType ? [] : btns.map((b) => {
      const w = b.stir ? 76 : LAY[cuType][0];
      const xy = b.stir ? [306, 190] : LAY[cuType][1][slot++];
      const taken = loose && b.bg === GREEN;
      return { x: xy[0], y: xy[1], w, img: b.img, label: b.label, badge: b.count, bg: loose ? 'transparent' : b.bg === SOFT ? '#FFFFFF' : b.bg, ring: b.ring, op: taken ? 0.3 : b.op, disabled: b.disabled, tap: b.tap };
    });
    const ORG = { fridge: '14% 45%', shelf: '39% 35%', sink: '39% 52%', rack: '63% 35%', counter: '63% 50%', board: '63% 50%', stove: '87% 48%' };
    const cu = { on: !!cuType, origin: ORG[cuType] || '50% 50%', fridge: cuType === 'fridge', rack: cuType === 'rack', shelf: cuType === 'shelf', counter: cuType === 'counter', board: cuType === 'board', sink: cuType === 'sink', stove: cuType === 'stove' };
    const hex = (a, b, r) => '#' + [1, 3, 5].map((i) => { const x = parseInt(a.substr(i, 2), 16), y = parseInt(b.substr(i, 2), 16); return ('0' + Math.round(x + (y - x) * Math.min(1, r)).toString(16)).slice(-2); }).join('');
    const plated = ti === 17 && c('plate') > 0;
    const pan = {
      oil: !plated && ((ti === 7 && c('oil') > 0) || ti > 7),
      egg: (ti === 7 && c('egg') > 0) || (ti === 8 && c('scoop') === 0),
      aroma: !plated && ((ti === 9 && c('mix') > 0) || ti > 9),
      pork: !plated && ((ti === 11 && c('pork') > 0) || ti > 11),
      basil: !plated && ((ti === 16 && c('basil') > 0) || ti === 17),
    };
    const sc = {
      fridge: ti === 0 && s.arrived,
      board: ti > 1 || (ti === 1 && c('board') > 0),
      knife: ti > 2 || (ti === 2 && c('knife_chef') > 0),
      bits: ti < 10 && (ti > 3 || (ti === 3 && c('garlic') > 0)),
      water: (ti === 4 || ti === 13) && s.arrived && !s.fin,
      low: s.heat === 1, high: s.heat === 2,
      eggplate: !plated && (ti > 8 || (ti === 8 && c('scoop') > 0)),
      food: pan.pork,
      fume: s.heat > 0 && ti >= 7,
    };
    const P = [[14, 20], [34, 34], [20, 52], [46, 18], [40, 60], [10, 40], [52, 44], [28, 74], [12, 66], [50, 70], [32, 14], [56, 28]];
    const bits = [];
    P.slice(0, c('garlic') * 3).forEach(([x, y], i) => bits.push({ x: 62 + x * 1.7, y: 196 + y * 1.2, w: 18, h: 12, c: '#FFFDF4', r: i * 37 }));
    P.slice(0, c('chili') * 3).forEach(([x, y], i) => bits.push({ x: 196 + x * 1.2, y: 196 + y * 1.2, w: 20, h: 8, c: '#F0584A', r: i * 53 }));
    const SP = [['fridge', 'ตู้เย็น', 8, 84, 90, 234], ['shelf', 'ชั้นเครื่องปรุง', 106, 136, 96, 52], ['sink', 'อ่างล้างจานและก๊อกน้ำ', 106, 192, 96, 126], ['rack', 'ราวแขวนมีด', 206, 132, 80, 62], ['board', 'เคาน์เตอร์และเขียง', 206, 198, 82, 120], ['stove', 'เตาแก๊ส', 292, 184, 96, 134]];
    const spots = SP.map(([id, label, x, y, w, h]) => {
      const target = id === t.st && !s.arrived && !s.fin && !s.walking;
      return { aria: 'เดินไปที่' + label, x, y, w, h, target, cls: target ? 'spot pulse' : 'spot', ring: target ? '0 0 0 4px #24212B, 0 0 0 9px #FFE66D' : 'none', tap: () => this.go(id) };
    });
    const mm = Math.floor(s.sec / 60), ss = s.sec % 60;
    const timing = (ti === 7 && c('egg') > 0) || ti === 8;
    const notes = ['', 'ต้องฝึกอีกนิด ครั้งหน้าดีขึ้นแน่', 'พอกินได้ ลองปรับรสดูนะ', 'ใช้ได้เลย', 'อร่อยมาก', 'ระดับเชฟแล้ว! ได้ 40 แต้มประสบการณ์'];
    return {
      isRecipe: s.screen === 'recipe', isCook: s.screen === 'cook', isDone: s.screen === 'done',
      serv: s.serv, items, totalText: '฿' + total,
      less: () => this.setState({ serv: Math.max(1, s.serv - 1) }),
      more: () => this.setState({ serv: Math.min(4, s.serv + 1) }),
      start: () => this.startCook(),
      toRecipe: () => { clearInterval(this.tick); clearTimeout(this.t1); clearTimeout(this.t2); clearTimeout(this.t3); clearTimeout(this.t4); this.setState({ screen: 'recipe' }); },
      isEnter: s.screen === 'enter', skipEnter: () => this.enterKitchen(true),
      enterT: s.phase ? 'translate(147px, 196px) scale(0.72)' : 'translate(147px, 560px) scale(1.4)',
      skip: () => this.nextTask(),
      stepNo: t.step + 1, stepCount: 6,
      bars: [0, 1, 2, 3, 4, 5].map((i) => ({ bg: i <= t.step ? '#C2512E' : '#FFFFFF' })),
      taskTitle: t.t,
      hint: s.note || (s.fin ? t.fin : s.walking ? 'กำลังเดินไป...' : !s.arrived ? goText : t.hint),
      sc, pan, plated, bits, spots, objs, cu, pic: IMG,
      showWalk: !s.arrived, walk: btns[0], showTodo: s.arrived, todo: s.arrived ? btns : [],
      showPan: !plated, timing, timeText: 'ทอดมาแล้ว ' + mm + ':' + (ss < 10 ? '0' : '') + ss,
      sinkBasil: ti === 4, sinkCup: ti === 13, cupFill: Math.min(60, c('water') * 28), waterOn: (c('wash') > 0 || c('water') > 0) && !s.fin,
      chefX: this.chefX(s.at), chefFace: s.face,
      chefCls: 'bot' + (s.walking ? ' walking mood-calm' : s.fin ? ' mood-happy' : s.arrived ? ' back pose-' + (t.kind === 'pick' ? 'reach' : t.kind === 'heat' || ti === 1 || ti === 5 ? 'knob' : t.st === 'sink' ? 'wash' : ti === 3 ? 'chop' : 'stir') + ' act' + (s.k % 2) : ' mood-calm'),
      porkColor: ti === 11 ? hex('#F4A7A0', '#B5714A', c('stir') / 8) : ti < 14 ? '#B5714A' : ti === 14 ? hex('#B5714A', '#96583A', c('season')) : '#96583A',
      shakeCls: s.k % 2 ? 'shake1' : 'shake0', chopCls: s.k % 2 ? 'chop1' : 'chop0',
      stars: [1, 2, 3, 4, 5].map((n) => ({ on: n <= s.stars, fill: n <= s.stars ? '#F2C14E' : '#FFFFFF', label: 'ให้ ' + n + ' ดาว', pick: () => this.setState({ stars: n }) })),
      rateNote: s.stars ? notes[s.stars] : 'แตะดาวเพื่อให้คะแนนเมนูนี้',
      again: () => this.setState({ screen: 'recipe', stars: 0 }),
    };
  }
}
