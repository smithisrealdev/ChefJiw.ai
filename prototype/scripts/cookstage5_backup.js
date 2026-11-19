class Component extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { recipe: 'kaprao', o1: 1, o2: 0, phase: 0, bad: '', stirring: false, left: 0, total: 0, asking: false, early: false, started: false, screen: 'recipe', serv: 1, have: {}, ti: 0, at: 'door', arrived: false, walking: false, face: 1, p: {}, fin: false, note: '', heat: 0, sec: 0, clock: false, k: 0, miss: { taste: 0, aroma: 0, look: 0 }, skips: {}, tasting: 0, ans: {}, gain: 0 };
    const a0 = props && props.app;
    if (a0 && a0.save && a0.save.pick) { this.state.recipe = a0.save.pick; this.state.o1 = a0.save.pick === 'omelet' ? 0 : 1; }
  }
  componentDidUpdate(pp) {
    // picked on the recipes screen of the app shell: open that recipe fresh
    const a = this.props.app, b = pp.app;
    if (a && a.save && (!b || !b.save || a.save.pickN !== b.save.pickN) && a.save.pickN) this.setRecipe(a.save.pick);
  }
  componentWillUnmount() { this.stopAll(); }
  stopAll() { clearInterval(this.tick); clearInterval(this.auto); this.auto = null; clearTimeout(this.t1); clearTimeout(this.t3); clearTimeout(this.t4); }
  setRecipe(id) {
    this.stopAll();
    this.setState({ recipe: id, o1: id === 'omelet' ? 0 : 1, o2: 0, screen: 'recipe', started: false, asking: false, stirring: false, clock: false, have: {} });
  }
  // ---------- recipes ----------
  spec() {
    const s = this.state, T = (id, step, st, t, kind, o) => Object.assign({ id, step, st, t, kind }, o);
    const W = [300, 184, 80, 50], F = [146, 186, 46, 52], KN = [355, 249, 22, 22];
    const knives = (why) => T('knife', 0, 'rack', 'เลือกมีด', 'pick', { go: 'ไปที่ราวแขวนมีด', hint: 'เลือกมีดที่เหมาะกับงานนี้ หยิบมาแล้วแตะมีดเล่มนั้น', fin: 'มีดเชฟ ใช้ได้เกือบทุกงาน', see: 'มองหาใบมีดกว้าง ยาวพอดีมือ', why, miss: 'look', items: [['knife_cleaver', 'ปังตอ', 0, 'ปังตอหนักไปสำหรับงานนี้', [207, 134, 24, 54]], ['knife_chef', 'มีดเชฟ', 1, '', [235, 134, 22, 58]], ['knife_paring', 'มีดปอก', 0, 'มีดปอกเล็กไป สับไม่ถนัด', [261, 138, 19, 40]]] });
    const board = T('board', 0, 'board', 'วางเขียง', 'seq', { go: 'เดินไปที่เคาน์เตอร์', hint: 'วางเขียงบนเคาน์เตอร์ให้นิ่ง แล้วแตะเขียงในภาพ', fin: 'เขียงพร้อมแล้ว', see: 'วางเขียงให้นิ่ง ไม่โยก', why: 'เขียงที่นิ่งทำให้สับได้ปลอดภัย ของไม่กระเด็น', acts: [['board', 'วางเขียง', 'board', 1, [254, 194, 26, 42]]] });
    const stoveOn = T('on', 0, 'stove', 'เปิดเตาแก๊ส', 'seq', { go: 'เดินไปที่เตา', hint: 'เปิดเตาจริง แล้วแตะลูกบิดบวกในภาพ', fin: 'ไฟติดแล้ว', see: 'เปลวไฟควรเป็นสีฟ้า ติดรอบหัวเตา', why: 'อุ่นกระทะให้ร้อนก่อนใส่น้ำมัน อาหารจะไม่ติดกระทะ', acts: [['knob', 'จุดไฟ', 'knob', 1, KN, 0, { heat: 2 }]] });
    const stoveOff = (step, why) => T('off', step, 'stove', 'ปิดไฟ', 'heat', { target: 0, hint: 'ปิดเตาจริง แล้วแตะลูกบิดลบจนไฟดับ', fin: 'ปิดไฟแล้ว', see: 'เปลวไฟดับสนิท แต่กระทะยังร้อนอยู่', why });
    const saltQ = ['จืดไป', 'กำลังดี', 'เค็มไป'];
    if (s.recipe === 'omelet') {
      const SP = [
        { label: 'ไม่เผ็ด', n: 0, note: 'ไม่ใส่พริก รสไข่ล้วน เด็กกินได้ ข้ามขั้นซอยพริกไปเลย' },
        { label: 'เผ็ดนิด', n: 2, note: 'พริกซอย 2 เม็ด เผ็ดปลายลิ้น ตัดเลี่ยนไข่' },
        { label: 'เผ็ดจัด', n: 5, note: 'พริกซอย 5 เม็ด เผ็ดทุกคำ เหมาะกินกับข้าวสวยร้อนๆ' },
      ];
      const ST = [
        { label: 'ฟูกรอบ', oil: 4, heat: 2, kcal: 650, a: 60, b: 45, note: 'น้ำมันเยอะ ไฟแรง เทจากที่สูง ได้ไข่พองฟู ขอบกรอบ แบบร้านข้าวแกง' },
        { label: 'นุ่มหนา', oil: 2, heat: 1, kcal: 550, a: 90, b: 60, note: 'ไฟกลาง ตีไข่น้อย ได้แผ่นหนา เนื้อนุ่มชุ่ม ไม่อมน้ำมัน' },
        { label: 'น้ำมันน้อย', oil: 1, heat: 1, kcal: 450, a: 90, b: 60, note: 'ใช้น้ำมัน 1 ช้อนโต๊ะ เบาลงราว 100 แคล ควรใช้กระทะเคลือบ ไข่จะไม่ฟู' },
      ];
      const sp = SP[s.o1], st = ST[s.o2], fluffy = s.o2 === 0, hot = sp.n > 0;
      const tasks = [
        T('fridge', 0, 'fridge', 'หยิบของจากตู้เย็น', 'pick', { go: 'เดินไปเปิดตู้เย็น', hint: 'หยิบของจริงออกมาวาง แล้วแตะในตู้เพื่อเช็ก: ไข่ หมูสับ' + (hot ? ' พริก' : ''), fin: 'ได้ของครบแล้ว', see: 'ไข่เปลือกไม่ร้าว หมูสีชมพูสด', why: 'ไข่ 2 ฟองกับหมูสับ 50 กรัมได้แผ่นหนาพอดี 1 จาน หมูมากกว่านี้ไข่จะไม่เกาะกันเป็นแผ่น', miss: 'taste', items: [['pork', 'หมูสับ', 1, '', [14, 182, 22, 22]], ['egg', 'ไข่ไก่', 1, '', [41, 182, 22, 22]], ['basil', 'กะเพรา', 0, 'ไข่เจียวไม่ใส่กะเพรานะ', [68, 182, 22, 22]], ['garlic', 'กระเทียม', 0, 'สูตรนี้ไม่ใช้กระเทียม', [14, 228, 22, 22]], ['chili', 'พริก', hot ? 1 : 0, 'เลือกแบบไม่เผ็ดไว้ ไม่ต้องใช้พริก', [41, 228, 22, 22]], ['morning', 'ผักบุ้ง', 0, 'ผักบุ้งเก็บไว้ทำเมนูอื่นนะ', [68, 228, 22, 22]]] }),
        T('shelf', 0, 'shelf', 'หยิบเครื่องปรุง', 'pick', { go: 'เดินไปที่ชั้นเครื่องปรุง', hint: 'หยิบน้ำปลามาวางข้างเคาน์เตอร์ แล้วแตะขวดในภาพ', fin: 'ได้น้ำปลาแล้ว', see: 'อ่านชื่อบนขวดก่อนหยิบทุกครั้ง', why: 'ไข่เจียวปรุงแค่น้ำปลาก็พอ ความเค็มช่วยดึงรสไข่ ซอสอื่นทำให้สีคล้ำและกลบกลิ่นไข่', miss: 'taste', items: [['oyster', 'ซอสหอย', 0, 'ซอสหอยทำให้ไข่สีคล้ำ ไม่ต้องใช้', [108, 140, 15, 40]], ['soy', 'ซีอิ๊วขาว', 0, 'สูตรนี้ใช้น้ำปลาอย่างเดียว', [126.5, 140, 15, 40]], ['fish', 'น้ำปลา', 1, '', [145, 140, 15, 40]], ['oil', 'น้ำมัน', 0, 'น้ำมันอยู่ข้างเตาแล้ว', [163.5, 140, 15, 40]], ['sugar', 'น้ำตาล', 0, 'ไข่เจียวไม่ต้องใส่น้ำตาล', [182, 156, 18, 24]]] }),
      ];
      if (hot) tasks.push(board, knives('มีดเชฟคมและคุมง่าย ซอยพริกเป็นแว่นบางได้เท่ากันทุกชิ้น'),
        T('chop', 0, 'board', 'ซอยพริก', 'seq', { go: 'กลับไปที่เขียง', hint: 'ซอยพริก ' + sp.n + ' เม็ดเป็นแว่นบางๆ เสร็จแล้วแตะพริกในภาพ', fin: 'ซอยเสร็จแล้ว', see: 'ซอยเป็นแว่นบาง ขนาดเท่าๆ กัน', why: 'ซอยบางให้พริกกระจายทั่วแผ่นไข่ ได้เผ็ดทุกคำ ไม่กัดเจอชิ้นใหญ่ ล้างมือหลังจับพริกด้วย', acts: [['chili', 'ซอยพริก', 'chili', 1, [234, 202, 22, 22], 1]] }));
      const mix = [['egg', 'ตอกไข่ 2 ฟอง', 'egg', 2, [206, 204, 20, 20], 1], ['pork', 'ใส่หมูกับน้ำปลา', 'pork', 1, [264, 204, 20, 20], 1]];
      if (hot) mix.push(['chilin', 'ใส่พริกซอย', 'chili', 1, [228, 204, 34, 22]]);
      tasks.push(
        T('mix', 1, 'board', 'ผสมไข่ในชาม', 'seq', { go: 'เดินไปที่เคาน์เตอร์', hint: 'ตอกไข่ 2 ฟอง ใส่หมูสับกับน้ำปลา 1 ช้อนชา' + (hot ? ' และพริกซอย' : '') + ' แตะตามทีละอย่าง', fin: 'ของครบในชามแล้ว', see: 'ไม่มีเศษเปลือกไข่ หมูไม่จับเป็นก้อน', why: 'ผสมทุกอย่างในชามก่อนลงกระทะ ไข่จะสุกเสมอกันทั้งแผ่น และน้ำปลาที่ใส่ตอนนี้จะเข้าเนื้อ ล้างมือหลังจับหมูดิบด้วย', acts: mix }),
        T('whisk', 1, 'board', 'ตีไข่', 'seq', { hint: 'ตีไข่ในชามจริง แตะชามเพื่อจับเวลา ' + (fluffy ? 'ตีให้ขึ้นฟอง' : 'ตีแค่พอเข้ากัน'), fin: 'ตีไข่เสร็จแล้ว', dur: fluffy ? 40 : 20, stirLabel: 'กำลังตีไข่', see: fluffy ? 'ขึ้นฟองละเอียดทั่วชาม' : 'ไข่ขาวกับไข่แดงเข้ากันดี', why: fluffy ? 'ฟองอากาศที่ตีเข้าไปจะขยายตัวตอนโดนน้ำมันร้อน ไข่เลยฟู' : 'ตีน้อยไข่จะเนื้อแน่นนุ่ม ไม่ฟูมาก แต่ชุ่มและไม่อมน้ำมัน', acts: [['stir', 'ตีไข่', 'egg', 4, [226, 204, 38, 22]]] }),
        Object.assign({}, stoveOn, { step: 2 }));
      if (!fluffy) tasks.push(T('mid', 2, 'stove', 'หรี่ไฟเป็นกลาง', 'heat', { target: 1, hint: 'หรี่ไฟเตาจริงลงเป็นไฟกลาง แล้วแตะลูกบิดลบ', fin: 'ไฟกำลังดี', see: 'เปลวไฟเตี้ยลง ไม่เลียขอบกระทะ', why: 'ไฟกลางทำให้ไข่สุกถึงข้างในก่อนผิวจะไหม้ ได้ไข่นุ่มสีเหลืองทอง' }));
      tasks.push(
        T('oil', 2, 'stove', 'ตั้งน้ำมันให้ร้อน', 'seq', { hint: 'เทน้ำมัน ' + st.oil + ' ช้อนโต๊ะ แตะขวด แล้วแตะกระทะเพื่อจับเวลารอน้ำมันร้อน', fin: 'น้ำมันร้อนได้ที่', dur: 45, stirLabel: 'รอน้ำมันร้อน', wait: true, see: 'น้ำมันมีควันบางๆ และสั่นเบาๆ เมื่อเอียงกระทะ', why: fluffy ? 'น้ำมัน 4 ช้อนโต๊ะที่ร้อนจัดทำให้ไข่พองฟูกรอบทันที ถ้าไม่ร้อนพอ ไข่จะอมน้ำมัน' : 'น้ำมันต้องร้อนก่อนเทไข่ ไม่อย่างนั้นไข่จะอมน้ำมันและติดกระทะ', acts: [['oil', 'เทน้ำมัน', 'oil', 1, [234, 208, 24, 24], 1], ['stir', 'รอให้ร้อน', 'heat' + st.heat, 4, W]] }),
        T('pour', 3, 'stove', 'เทไข่ลงกระทะ', 'seq', { hint: (fluffy ? 'เทไข่จากที่สูงราวหนึ่งคืบเป็นสาย' : 'เทไข่ชิดกระทะตรงกลาง') + ' แล้วแตะไข่ในภาพ', fin: 'ฉ่า! เริ่มจับเวลาแล้ว', see: 'ขอบไข่ฟูและเริ่มเซ็ตตัว ระวังน้ำมันกระเด็น', why: fluffy ? 'เทจากที่สูงเป็นสาย ไข่จะโดนอากาศและแตกเป็นเส้น ฟูกรอบกว่าเทชิดกระทะ' : 'เทชิดกระทะ ไข่จะเป็นแผ่นหนาเนื้อนุ่ม และน้ำมันไม่กระเด็น', goal: st.a, acts: [['pour', 'เทไข่', 'egg', 1, [246, 208, 24, 24], 1, { clock: 'start' }]] }),
        T('flip', 3, 'stove', 'กลับด้าน', 'seq', { hint: 'ทอดราว ' + this.mmss(st.a) + ' นาที พอขอบเหลืองทองให้กลับด้าน แล้วแตะกระทะ', fin: 'กลับด้านแล้ว', see: 'ขอบเหลืองทอง ผิวบนเริ่มไม่เหลว', why: 'กลับตอนด้านล่างเซ็ตตัวแล้ว แผ่นไข่จะไม่ขาด และสองด้านสุกเท่ากัน', goal: st.a, acts: [['flip', 'กลับด้าน', 'spatula', 1, W, 0, { min: st.a, late: st.a + 45, clock: 'restart', miss: 'look' }]] }),
        T('lift', 3, 'stove', 'ตักขึ้นพักน้ำมัน', 'seq', { hint: 'ทอดอีกด้านราว ' + this.mmss(st.b) + ' นาที แล้วตักขึ้น แตะกระทะ', fin: 'ไข่เจียวสุกสวย', see: 'เหลืองทองสองด้าน กดกลางแผ่นไม่มีน้ำไข่ไหล', why: 'หมูสับข้างในต้องสุก จึงทอดด้านที่สองต่ออีกครึ่งถึงหนึ่งนาที กลับแค่ครั้งเดียวและไม่กดแผ่นไข่ ไข่จะไม่แบน', goal: st.b, acts: [['lift', 'ตักขึ้น', 'spatula', 1, W, 0, { min: st.b, late: st.b + 45, clock: 'stop', miss: 'look' }]] }),
        stoveOff(4, 'ปิดเตาก่อนจัดจาน กันน้ำมันที่เหลือร้อนเกินจนเป็นควัน'),
        T('plate', 4, 'stove', 'จัดจาน', 'seq', { hint: 'วางไข่เจียวบนข้าวสวยร้อนๆ แล้วแตะกระทะ', fin: 'เสร็จแล้ว!', see: 'วางไข่บนข้าวตอนยังร้อน', why: 'กินตอนร้อนขอบยังกรอบ จะราดซอสพริกหรือน้ำปลาพริกเพิ่มก็ได้ตามชอบ', acts: [['plate', 'ตักใส่จาน', 'rice', 1, W]] }));
      const base = [
        { id: 'egg', name: 'ไข่ไก่', q: 2, u: 'ฟอง', p: 10, why: '2 ฟองได้แผ่นหนาพอดี 1 จาน' },
        { id: 'pork', name: 'หมูสับ', q: 50, u: 'กรัม', p: 9, why: 'มากกว่านี้ไข่จะไม่เกาะกันเป็นแผ่น' },
        { id: 'fish', name: 'น้ำปลา', q: 1, u: 'ช้อนชา', p: 1, why: 'เค็มพอดีสำหรับไข่ 2 ฟอง ดึงรสไข่ให้ชัด' },
        { id: 'oil', name: 'น้ำมันพืช', q: st.oil, u: 'ช้อนโต๊ะ', p: st.oil, why: fluffy ? 'น้ำมันเยอะและร้อนจัด ไข่ถึงจะพองฟู' : st.oil === 1 ? 'พอเคลือบกระทะ จานเบาลง แต่ไข่ไม่ฟู' : 'พอให้ไข่ไม่ติดกระทะและขอบเหลืองสวย' },
        { id: 'rice', name: 'ข้าวสวย', q: 1, u: 'จาน', p: 7, why: 'ข้าวร้อนๆ รับกับไข่เจียวพอดีคำ' },
      ];
      if (hot) base.splice(2, 0, { id: 'chili', name: 'พริกขี้หนู', q: sp.n, u: 'เม็ด', p: 1, why: sp.n > 2 ? '5 เม็ดเผ็ดทุกคำ ลดได้ถ้ากินกับเด็ก' : '2 เม็ดเผ็ดแค่ปลายลิ้น' });
      return { id: 'omelet', name: 'ไข่เจียวหมูสับ', dish: '/_blob/57d72c67af1ee4e1b933a4afefac4e80', mins: 10, steps: 5, g1: { title: 'ความเผ็ด', opts: SP }, g2: { title: 'เนื้อไข่', opts: ST }, sp, st, kcal: st.kcal, base, tasks,
        sense: { taste: ['fridge', 'shelf', 'mix'], aroma: ['whisk', 'on', 'mid', 'oil', 'off'], look: ['pour', 'flip', 'lift', 'plate', 'board', 'knife', 'chop'] },
        q: { taste: ['รสชาติ', saltQ, ['ครั้งหน้าเพิ่มน้ำปลาอีกครึ่งช้อนชา ครั้งนี้จิ้มน้ำปลาพริกหรือซอสพริกเพิ่มได้', 'ครั้งหน้าลดน้ำปลาเหลือครึ่งช้อนชา ครั้งนี้กินกับข้าวเพิ่มจะช่วย']],
          aroma: ['กลิ่น', ['ยังคาวไข่', 'หอมไข่ทอด', 'มีกลิ่นไหม้'], ['ครั้งหน้าตีไข่ให้นานขึ้น และทอดให้สุกถึงข้างใน กลิ่นคาวจะหาย', 'ไฟแรงเกินไป ครั้งหน้าหรี่ไฟลงตอนทอดด้านที่สอง']],
          look: ['หน้าตา', ['ซีด อมน้ำมัน', 'เหลืองทองสวย', 'เข้มหรือไหม้'], ['น้ำมันยังไม่ร้อนพอตอนเทไข่ ครั้งหน้ารอให้น้ำมันมีควันบางๆ ก่อน', 'ครั้งหน้ากลับด้านเร็วขึ้น หรือลดไฟลงหนึ่งระดับ']] },
        good: { taste: 'เค็มกำลังดี รสไข่ชัด', aroma: 'หอมไข่ทอด ไม่คาว', look: fluffy ? 'ฟูกรอบ เหลืองทองสวย' : 'เหลืองทองเสมอกันทั้งแผ่น' } };
    }
    const SP = [
      { label: 'เผ็ดน้อย', n: 1, p: 1, note: 'พริก 1 เม็ด ได้กลิ่นพริกหอมๆ แทบไม่เผ็ด เด็กก็กินได้', why: '1 เม็ดให้แค่กลิ่นหอม ไม่ทิ้งรสเผ็ด' },
      { label: 'เผ็ดกลาง', n: 4, p: 2, note: 'พริก 4 เม็ด เผ็ดพอรู้สึก แบบร้านตามสั่งทั่วไป', why: '4 เม็ดเผ็ดพอรู้สึก ไม่กลบรสหมู' },
      { label: 'เผ็ดจัด', n: 8, p: 4, note: 'พริก 8 เม็ด เผ็ดถึงใจ ควรมีไข่ดาวไว้ช่วยตัดเผ็ด', why: '8 เม็ดเผ็ดจัด ไข่แดงจะช่วยตัดเผ็ด' },
    ];
    const ST = [
      { label: 'ผัดแห้ง', water: 1, oil: 2, kcal: 650, note: 'น้ำน้อย ผัดจนเครื่องเกาะหมู หอมกลิ่นกระทะ แบบร้านตามสั่ง', waterWhy: 'น้ำแค่ 1 ช้อนโต๊ะช่วยละลายเครื่องปรุงไม่ให้ไหม้ แล้วระเหยหมด ได้ผัดแห้งหอม' },
      { label: 'ขลุกขลิก', water: 4, oil: 2, kcal: 650, note: 'เติมน้ำมากขึ้น ได้น้ำซอสไว้คลุกข้าว กินคล่องคอ', waterWhy: 'น้ำ 4 ช้อนโต๊ะกลายเป็นน้ำซอสขลุกขลิก ไว้คลุกข้าวให้ชุ่ม' },
      { label: 'น้ำมันน้อย', water: 2, oil: 1, kcal: 560, note: 'ใช้น้ำมันครึ่งเดียว เบาลงราว 90 แคล แต่ขอบไข่ดาวจะกรอบน้อยกว่า', waterWhy: 'น้ำ 2 ช้อนโต๊ะช่วยให้ผัดลื่น แทนน้ำมันที่ลดลง' },
    ];
    const sp = SP[s.o1], st = ST[s.o2], n = sp.n, heatWord = [' แค่พอหอม', ' กำลังดี', ' เต็มที่'][s.o1];
    const tasks = [
      T('fridge', 0, 'fridge', 'หยิบของจากตู้เย็น', 'pick', { go: 'เดินไปเปิดตู้เย็น', hint: 'หยิบของจริงออกมาวาง แล้วแตะในตู้เพื่อเช็ก: หมูสับ ไข่ กะเพรา กระเทียม พริก', fin: 'ได้ของครบแล้ว', see: 'ดูว่าของสด หมูสีชมพู ใบกะเพราไม่ช้ำ', why: 'เตรียมของให้ครบก่อนเปิดไฟ พอเริ่มผัดทุกอย่างเร็วมาก จะได้ไม่ต้องวิ่งหาของจนกระเทียมไหม้', miss: 'taste', items: [['pork', 'หมูสับ', 1, '', [14, 182, 22, 22]], ['egg', 'ไข่ไก่', 1, '', [41, 182, 22, 22]], ['basil', 'กะเพรา', 1, '', [68, 182, 22, 22]], ['garlic', 'กระเทียม', 1, '', [14, 228, 22, 22]], ['chili', 'พริก', 1, '', [41, 228, 22, 22]], ['morning', 'ผักบุ้ง', 0, 'ผักบุ้งเก็บไว้ทำเมนูอื่นนะ', [68, 228, 22, 22]]] }),
      board,
      knives('มีดเชฟใบกว้างและหนักกำลังดี สับกระเทียมพริกได้เร็วและคุมง่าย ปังตอหนักไป มีดปอกเล็กไป'),
      T('chop', 0, 'board', 'สับกระเทียมกับพริก', 'seq', { go: 'กลับไปที่เขียง', hint: 'สับกระเทียม 4 กลีบ กับพริก ' + n + ' เม็ดแบบหยาบๆ เสร็จแล้วแตะทีละอย่าง', fin: 'สับเสร็จ สวยเลย', see: 'สับแค่หยาบๆ ยังเห็นเป็นชิ้นเล็ก', why: 'สับหยาบทำให้กระเทียมไม่ไหม้เร็ว และพริก ' + n + ' เม็ดแตกพอให้ความเผ็ดออก' + heatWord, acts: [['garlic', 'สับกระเทียม', 'garlic', 1, [218, 202, 22, 22], 1], ['chili', 'สับพริก', 'chili', 1, [248, 202, 22, 22], 1]] }),
      T('wash', 0, 'sink', 'ล้างใบกะเพรา', 'seq', { go: 'เดินไปที่อ่างล้างจาน', hint: 'เด็ดใบกะเพรา ล้างแล้วสะบัดน้ำ เสร็จแล้วแตะก๊อกน้ำ', fin: 'สะอาดแล้ว', see: 'สะบัดจนใบหมาด ไม่มีน้ำหยด', why: 'ล้างฝุ่นและดินออก ใบที่หมาดจะไม่ทำให้น้ำมันกระเด็นตอนลงกระทะ', acts: [['wash', 'ล้างกะเพรา', 'water', 1, F]] }),
      Object.assign({}, stoveOn, { step: 1 }),
      T('mid', 1, 'stove', 'หรี่ไฟเป็นกลาง', 'heat', { target: 1, hint: 'หรี่ไฟเตาจริงลงเป็นไฟกลาง แล้วแตะลูกบิดลบ', fin: 'ไฟกำลังดี', see: 'เปลวไฟเตี้ยลง ไม่เลียขอบกระทะ', why: 'ไฟกลางทำให้ไข่ขาวสุกทันพอดีกับขอบที่กรอบ ถ้าไฟแรง ขอบจะไหม้ก่อนไข่สุก' }),
      T('fry', 1, 'stove', 'ทอดไข่ดาว', 'seq', { hint: 'เทน้ำมัน ' + st.oil + ' ช้อนโต๊ะ รอให้ร้อน แล้วตอกไข่ลงไป แตะตามทีละอย่าง', fin: 'ฉ่า! เริ่มจับเวลาแล้ว', see: 'น้ำมันร้อนจะเป็นริ้ว ระวังน้ำมันกระเด็น', why: st.oil === 1 ? 'น้ำมัน 1 ช้อนโต๊ะพอให้ไข่ไม่ติดกระทะ ขอบจะกรอบน้อยกว่า แต่จานเบาลง' : 'น้ำมัน 2 ช้อนโต๊ะที่ร้อนพอ ทำให้ขอบไข่ฟูกรอบทันที และเหลือไว้ผัดต่อ', goal: 120, acts: [['oil', 'เทน้ำมัน', 'oil', 1, [234, 208, 24, 24], 1], ['egg', 'ตอกไข่', 'egg', 1, [262, 210, 22, 22], 1, { clock: 'start' }]] }),
      T('scoop', 1, 'stove', 'ตักไข่ขึ้นพัก', 'seq', { hint: 'ทอดราว 2 นาที พอขอบกรอบเหลืองให้ตักขึ้น แล้วแตะกระทะ', fin: 'ไข่ดาวสวยมาก', see: 'ขอบไข่เหลืองกรอบ ไข่ขาวขุ่นทั่ว', why: 'ตักขึ้นพักก่อน ไข่จะไม่สุกเกิน ไข่แดงยังเยิ้ม และน้ำมันในกระทะหอมไข่ไว้ผัดต่อ', goal: 120, acts: [['scoop', 'ตักไข่ขึ้น', 'spatula', 1, W, 0, { min: 120, late: 165, clock: 'stop', miss: 'look' }]] }),
      T('aroma', 2, 'stove', 'ผัดกระเทียมพริก', 'seq', { hint: 'ใส่กระเทียมพริกลงกระทะ แตะเช็ก แล้วแตะกระทะเพื่อจับเวลาผัด', fin: 'หอมแล้ว', dur: 20, see: 'กระเทียมเริ่มเหลืองทอง กลิ่นฉุนขึ้นจมูก', why: 'ผัดกระเทียมพริกในน้ำมันก่อน กลิ่นหอมจะละลายลงน้ำมัน แล้วไปเคลือบหมูทุกชิ้น', acts: [['mix', 'ใส่กระเทียมพริก', 'garlic', 1, [246, 208, 24, 24], 1], ['stir', 'ผัด', 'spatula', 5, W]] }),
      T('high', 3, 'stove', 'เร่งไฟแรง', 'heat', { target: 2, hint: 'เร่งไฟเตาจริงเป็นไฟแรง แล้วแตะลูกบิดบวก', fin: 'ไฟแรงแล้ว', see: 'เปลวไฟสูงขึ้น กระทะมีควันบางๆ', why: 'ไฟแรงทำให้น้ำจากหมูระเหยเร็ว หมูเลยผัดแห้งหอม ไม่ออกน้ำจนแฉะ' }),
      T('pork', 3, 'stove', 'ผัดหมูสับ', 'seq', { hint: 'ใส่หมูสับ แตะเช็ก แล้วแตะกระทะเพื่อจับเวลา ยีให้แตกและผัดจนสุก', fin: 'หมูสุกทั่วแล้ว', dur: 120, see: 'หมูเปลี่ยนเป็นสีน้ำตาล ไม่เหลือสีชมพู', why: 'ยีให้แตกเป็นก้อนเล็ก หมูจะสุกทั่วจนกินได้ปลอดภัย และเครื่องปรุงเกาะได้ทุกชิ้น ล้างมือหลังจับหมูดิบด้วย', acts: [['pork', 'ใส่หมูสับ', 'pork', 1, [246, 208, 24, 24], 1], ['stir', 'ยีและผัด', 'spatula', 8, W]] }),
      T('shelf', 4, 'shelf', 'หยิบเครื่องปรุง', 'pick', { go: 'เดินไปที่ชั้นเครื่องปรุง', hint: 'หยิบเครื่องปรุงมาวางข้างเตา แตะเช็ก: ซอสหอย ซีอิ๊วขาว น้ำปลา น้ำตาล', fin: 'เครื่องปรุงครบ', see: 'อ่านชื่อบนขวดก่อนหยิบทุกครั้ง', why: 'ซอสหอยให้รสกลมและสีเงา ซีอิ๊วกับน้ำปลาให้เค็มหอม น้ำตาลนิดเดียวช่วยตัดเค็มให้กลม', miss: 'taste', items: [['oyster', 'ซอสหอย', 1, '', [108, 140, 15, 40]], ['soy', 'ซีอิ๊วขาว', 1, '', [126.5, 140, 15, 40]], ['fish', 'น้ำปลา', 1, '', [145, 140, 15, 40]], ['oil', 'น้ำมัน', 0, 'น้ำมันใส่ไปแล้วนะ', [163.5, 140, 15, 40]], ['sugar', 'น้ำตาล', 1, '', [182, 156, 18, 24]]] }),
      T('water', 4, 'sink', 'รองน้ำ', 'seq', { go: 'เดินไปที่ก๊อกน้ำ', hint: 'รองน้ำเปล่า ' + st.water + ' ช้อนโต๊ะ แล้วแตะก๊อกน้ำ', fin: 'ได้น้ำแล้ว', see: 'รองแค่ ' + st.water + ' ช้อนโต๊ะ มากไปจะกลายเป็นต้ม', why: st.waterWhy, acts: [['water', 'รองน้ำ', 'water', 1, F]] }),
      T('season', 4, 'stove', 'ปรุงรส', 'seq', { go: 'กลับไปที่เตา', hint: 'ใส่เครื่องปรุงและน้ำ แตะเช็ก แล้วแตะกระทะเพื่อจับเวลาผัด', fin: 'ชิมดู เค็มไปเติมน้ำ จืดไปเติมน้ำปลา', dur: 30, see: 'ซอสเดือดปุดๆ แล้วเคลือบหมูเป็นเงา', why: 'ปรุงตอนหมูสุกแล้ว รสจะเคลือบผิวหมูพอดี และยังชิมปรับรสได้ก่อนปิดไฟ', acts: [['season', 'ใส่เครื่องปรุง', 'oyster', 1, [234, 208, 24, 24], 1], ['addwater', 'เติมน้ำ', 'water', 1, [262, 210, 22, 22], 1], ['stir', 'ผัด', 'spatula', 4, W]] }),
      stoveOff(5, 'ความร้อนที่ค้างในกระทะพอให้กะเพราสลด ใบจะไม่ดำ และกลิ่นไม่ระเหยหายไปกับไฟ'),
      T('basil', 5, 'stove', 'ใส่กะเพรา', 'seq', { hint: 'ใส่ใบกะเพรา แตะเช็ก แล้วแตะกระทะ ผัดเร็วๆ พอใบสลด', fin: 'หอมมาก', dur: 10, see: 'ใบกะเพราสลดลง แต่ยังเขียวสด', why: 'ใส่ท้ายสุด กลิ่นหอมของกะเพรายังอยู่ครบ จานนี้เลยหอมที่สุดตอนตักเสิร์ฟ', acts: [['basil', 'ใส่กะเพรา', 'basil', 1, [246, 208, 24, 24], 1], ['stir', 'ผัด', 'spatula', 3, W]] }),
      T('plate', 5, 'stove', 'จัดจาน', 'seq', { hint: 'ตักราดข้างข้าว วางไข่ดาวไว้บนสุด แล้วแตะกระทะ', fin: 'เสร็จแล้ว!', see: 'ราดข้างข้าว วางไข่ดาวไว้บนสุด', why: 'ไข่ดาววางบนสุดขอบจะยังกรอบ เจาะไข่แดงคลุกข้าว ช่วยตัดเผ็ดและเค็ม', acts: [['plate', 'ตักใส่จาน', 'rice', 1, W]] }),
    ];
    const base = [
      { id: 'pork', name: 'หมูสับ', q: 120, u: 'กรัม', p: 22, why: 'ปริมาณนี้กระทะไม่แน่น หมูเลยผัดแห้งหอม ไม่ออกน้ำ' },
      { id: 'basil', name: 'ใบกะเพรา', q: 1, u: 'กำมือ', p: 5, why: 'ดูเยอะแต่โดนร้อนแล้วยุบเหลือนิดเดียว' },
      { id: 'garlic', name: 'กระเทียม', q: 4, u: 'กลีบ', p: 2, why: 'เป็นกลิ่นหอมพื้นฐาน มากกว่านี้จะกลบกลิ่นกะเพรา' },
      { id: 'chili', name: 'พริกขี้หนู', q: sp.n, u: 'เม็ด', p: sp.p, why: sp.why },
      { id: 'egg', name: 'ไข่ไก่', q: 1, u: 'ฟอง', p: 5, why: 'ไข่แดงเยิ้มๆ ช่วยตัดรสเผ็ดและเค็ม' },
      { id: 'rice', name: 'ข้าวสวย', q: 1, u: 'จาน', p: 7, why: 'ราวทัพพีครึ่ง พอดีกับหมู 120 กรัม' },
      { id: 'oil', name: 'น้ำมันพืช', q: st.oil, u: 'ช้อนโต๊ะ', p: st.oil, why: st.oil === 1 ? 'ลดเหลือครึ่งเดียว จานเบาลง แต่ขอบไข่กรอบน้อยลง' : 'พอให้ไข่ดาวขอบกรอบ แล้วใช้ที่เหลือผัดต่อ' },
      { id: 'oyster', name: 'ซอสหอยนางรม', q: 1, u: 'ช้อนโต๊ะ', p: 2, why: 'รสหลักของจาน ให้ความกลมกล่อมและสีเงา' },
      { id: 'soy', name: 'ซีอิ๊วขาว', q: 1, u: 'ช้อนชา', p: 1, why: 'เติมเค็มหอม ใส่น้อยเพราะซอสหอยเค็มอยู่แล้ว' },
      { id: 'fish', name: 'น้ำปลา', q: 1, u: 'ช้อนชา', p: 1, why: 'ให้กลิ่นแบบไทย มากกว่านี้จะเค็มโดด' },
      { id: 'sugar', name: 'น้ำตาลทราย', q: 0.5, u: 'ช้อนชา', p: 1, why: 'ไม่ได้ให้หวาน แค่ตัดรสเค็มให้กลม' },
    ];
    return { id: 'kaprao', name: 'กะเพราหมูสับไข่ดาว', dish: '/_blob/6c2552b0403b97e680de31c0a2deaa28', mins: 15, steps: 6, g1: { title: 'ความเผ็ด', opts: SP }, g2: { title: 'สไตล์การผัด', opts: ST }, sp, st, kcal: st.kcal, base, tasks,
      sense: { taste: ['fridge', 'shelf', 'water', 'season'], aroma: ['on', 'mid', 'aroma', 'high', 'pork', 'off', 'basil'], look: ['board', 'knife', 'chop', 'wash', 'fry', 'scoop', 'plate'] },
      q: { taste: ['รสชาติ', saltQ, ['ครั้งหน้าเพิ่มน้ำปลาอีกครึ่งช้อนชา ครั้งนี้เหยาะน้ำปลาพริกเพิ่มได้', 'ครั้งหน้าลดน้ำปลาเหลือครึ่งช้อนชา ครั้งนี้กินกับข้าวเพิ่มและเจาะไข่แดงคลุกจะช่วย']],
        aroma: ['กลิ่น', ['ยังไม่หอม', 'หอมกะเพรา', 'มีกลิ่นไหม้'], ['ครั้งหน้าให้กระทะร้อนก่อนใส่กระเทียม และใส่กะเพราตอนปิดไฟ', 'กระเทียมไหม้เร็วมาก ครั้งหน้าหรี่ไฟตอนผัดกระเทียม หรือสับให้หยาบขึ้น']],
        look: ['หน้าตา', ['หมูซีด แฉะ', 'สวยน่ากิน', 'เข้มหรือไหม้'], ['ครั้งหน้าใช้ไฟแรงตอนผัดหมู และอย่าคนบ่อย ให้หมูได้โดนกระทะ', 'ครั้งหน้าลดไฟลงหนึ่งระดับ หรือผัดให้สั้นลง']] },
      good: { taste: 'เค็มหวานกลมกล่อม', aroma: 'หอมกลิ่นกระทะ กะเพราขึ้นจมูก', look: 'ไข่ดาวขอบกรอบ กะเพรายังเขียว' } };
  }
  mmss(n) { return Math.floor(n / 60) + ':' + ('0' + (n % 60)).slice(-2); }
  tasks() { return this.spec().tasks; }
  heatAt(all, i) {
    let h = 0;
    for (let j = 0; j < i; j++) { const t = all[j]; if (t.kind === 'heat') h = t.target; (t.acts || []).forEach((a) => { if (a[6] && a[6].heat != null) h = a[6].heat; }); }
    return h;
  }
  chefX(at) { return ({ out: -120, door: 150, fridge: 88, shelf: 106, sink: 106, rack: 198, board: 198, stove: 262 })[at]; }
  startCook() {
    this.stopAll();
    const calm = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (calm) { this.setState({ started: true, asking: false }); this.enterKitchen(true); return; }
    this.setState({ screen: 'enter', phase: 0, started: true, asking: false });
    this.t3 = setTimeout(() => this.setState({ phase: 1 }), 80);
    this.t4 = setTimeout(() => this.enterKitchen(false), 1800);
  }
  enterKitchen(instant) {
    clearTimeout(this.t3); clearTimeout(this.t4); clearTimeout(this.t1);
    this.setState({ screen: 'cook', ti: 0, at: instant ? 'door' : 'out', arrived: false, walking: !instant, face: 1, p: {}, fin: false, note: '', heat: 0, sec: 0, clock: false, stirring: false, miss: { taste: 0, aroma: 0, look: 0 }, skips: {}, tasting: 0, ans: {}, gain: 0 });
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
    this.t1 = setTimeout(() => this.setState({ walking: false, arrived: true, face: 1 }), to === from ? 60 : 720);
  }
  finish(extra) {
    const s = this.state, skips = Object.assign({}, s.skips);
    delete skips[this.tasks()[s.ti].id];
    this.setState(Object.assign({ fin: true, note: '', bad: '', skips }, extra || {}));
  }
  nextTask(skipped) {
    clearTimeout(this.t1); clearInterval(this.auto); this.auto = null;
    const s = this.state, all = this.tasks(), t = all[s.ti], ni = s.ti + 1;
    const skips = skipped && !s.fin ? Object.assign({}, s.skips, { [t.id]: true }) : s.skips;
    if (ni >= all.length) { clearInterval(this.tick); this.setState({ screen: 'done', fin: false, heat: 0, started: false, skips, tasting: 0, ans: {}, clock: false, stirring: false }); return; }
    const keep = s.clock && all[ni].goal;
    if (!keep) clearInterval(this.tick);
    this.setState({ ti: ni, p: {}, fin: false, note: '', bad: '', stirring: false, early: false, heat: this.heatAt(all, ni), clock: !!keep, skips, walking: false, arrived: all[ni].st === s.at });
  }
  prevTask() {
    const s = this.state;
    if (s.ti === 0) return;
    this.stopAll();
    const all = this.tasks(), ni = s.ti - 1;
    this.setState({ ti: ni, p: {}, fin: false, note: '', bad: '', stirring: false, early: false, sec: 0, clock: false, heat: this.heatAt(all, ni), walking: false, arrived: all[ni].st === s.at });
  }
  resume() { this.setState({ screen: 'cook', asking: false, p: {}, fin: false, note: '', bad: '', stirring: false, early: false, walking: false, arrived: false }); }
  startClock() { clearInterval(this.tick); this.tick = setInterval(() => this.setState({ sec: this.state.sec + 1 }), 1000); }
  doAct(t, a) {
    const s = this.state, id = a[0], n = s.p[id] || 0, o = a[6] || {};
    if (s.fin || n >= a[3]) return;
    if (o.min && s.sec < o.min && !s.early) { this.setState({ early: true, note: 'ยังไม่ถึง ' + this.mmss(o.min) + ' นาที ถ้าได้ที่ตามที่ให้สังเกตแล้ว แตะอีกครั้งได้เลย', k: s.k + 1 }); return; }
    if (id === 'stir') {
      if (this.auto) return;
      const total = (t.dur || 10) * 2;
      this.setState({ stirring: true, bad: '', left: total, total, note: '' });
      this.auto = setInterval(() => this.stirTick(t, a), 500);
      return;
    }
    const p = Object.assign({}, s.p, { [id]: n + 1 });
    const patch = { p, k: s.k + 1, note: '', early: false };
    if (o.heat != null) patch.heat = o.heat;
    if (o.min && (s.sec < o.min || s.sec > o.late)) patch.miss = Object.assign({}, s.miss, { [o.miss]: s.miss[o.miss] + (s.sec < o.min ? 2 : 1), time: s.sec < o.min ? 'early' : 'late' });
    if (o.clock === 'start' || o.clock === 'restart') { patch.sec = 0; patch.clock = true; this.startClock(); }
    if (o.clock === 'stop') { clearInterval(this.tick); patch.clock = false; }
    this.setState(patch);
    if (t.acts.every((x) => (p[x[0]] || 0) >= x[3])) this.finish();
  }
  stirTick(t, a) {
    const s = this.state;
    if (s.fin || s.screen !== 'cook' || !s.stirring) { clearInterval(this.auto); this.auto = null; return; }
    const left = s.left - 1;
    if (left <= 0) { this.stirDone(); return; }
    const n = Math.min(a[3] - 1, Math.floor((1 - left / s.total) * a[3]));
    this.setState({ left, k: s.k + 1, p: Object.assign({}, s.p, { stir: Math.max(s.p.stir || 0, n) }) });
  }
  stirDone() {
    const s = this.state, t = this.tasks()[s.ti], a = t.acts.find((x) => x[0] === 'stir');
    clearInterval(this.auto); this.auto = null;
    if (!a || s.fin) return;
    this.finish({ p: Object.assign({}, s.p, { stir: a[3] }), stirring: false, left: 0, k: s.k + 1 });
  }
  doPick(t, it) {
    const s = this.state;
    if (s.fin) return;
    if (!it[2]) { const key = t.miss || 'taste'; this.setState({ note: it[3], bad: it[0], k: s.k + 1, miss: Object.assign({}, s.miss, { [key]: s.miss[key] + 1 }) }); return; }
    const p = Object.assign({}, s.p, { [it[0]]: 1 });
    this.setState({ p, k: s.k + 1, note: '', bad: '' });
    if (t.items.every((x) => !x[2] || p[x[0]])) this.finish();
  }
  bump(t, d) {
    const s = this.state;
    if (s.fin) return;
    const i = Math.max(0, Math.min(2, s.heat + d));
    const away = t.kind === 'heat' && Math.abs(i - t.target) > Math.abs(s.heat - t.target);
    this.setState({ heat: i, k: s.k + 1, note: away ? 'หมุนผิดทางนะ ดูเป้าหมายไฟด้านล่าง' : '', miss: away ? Object.assign({}, s.miss, { aroma: s.miss.aroma + 1 }) : s.miss });
    if (t.kind === 'heat' && i === t.target) this.finish();
  }
  score(R) {
    const s = this.state, out = {};
    ['taste', 'aroma', 'look'].forEach((k) => {
      const skipped = R.sense[k].filter((id) => s.skips[id]).length;
      const base = s.ans[k] === 1 ? 5 : 3;
      out[k] = Math.max(1.5, Math.min(5, base - 0.5 * s.miss[k] - skipped));
    });
    out.total = (out.taste + out.aroma + out.look) / 3;
    return out;
  }
  judge() {
    const s = this.state, R = this.spec(), sc = this.score(R), gain = sc.total >= 4.5 ? 40 : sc.total >= 3.5 ? 30 : 20;
    this.setState({ tasting: 2, gain });
    const app = this.props.app;
    if (app && app.record) app.record({ id: R.id, name: R.name, score: Number(sc.total.toFixed(1)), opts: R.sp.label + ' · ' + R.st.label, kcal: R.kcal, gain });
  }
  renderVals() {
    const s = this.state, app = this.props.app, inApp = !!(app && app.go);
    const IMG = __IMG__;
    const X = __X__;
    const R = this.spec(), o = R;
    const num = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(1));
    let total = 0;
    const items = R.base.map((it) => {
      const have = !!s.have[it.id];
      const price = it.p * s.serv;
      if (!have) total += price;
      return {
        name: it.name, img: IMG[it.id], have, why: it.why, qtyText: num(it.q * s.serv) + ' ' + it.u,
        priceText: have ? 'มีแล้ว' : '฿' + price, priceColor: have ? '#4A7443' : '#3B2A22',
        boxBg: have ? '#5E8F57' : '#F6E6CF',
        toggle: () => this.setState({ have: Object.assign({}, s.have, { [it.id]: !have }) }),
      };
    });
    const all = R.tasks, ti = Math.min(s.ti, all.length - 1), t = all[ti];
    const c = (id) => s.p[id] || 0;
    const pic = (k) => X[k] || IMG[k];
    const HN = ['ไฟปิดอยู่', 'ไฟกลาง', 'ไฟแรง'];
    const SOFT = '#F5F3FC', GREEN = '#C9F2CF', RING = '0 0 0 1.5px #24212B, 0 0 0 3.5px #FFE66D';
    const goText = t.go || 'เดินไปที่เตา';
    const zoom = s.arrived;
    const hot = (r, x) => Object.assign({ x: r[0], y: r[1], w: r[2], h: r[3], img: '', hasImg: false, op: 1, ring: 'none', disabled: false, cls: 'hot' }, x);
    let hots = [], todo = [];
    if (zoom && t.kind === 'pick') {
      t.items.forEach((it) => {
        const got = c(it[0]) > 0, loose = t.st === 'fridge';
        hots.push(hot(it[4], { img: loose ? pic(it[0]) : '', hasImg: loose, op: got ? 0 : 1, ring: loose || got ? 'none' : 'inset 0 0 0 1px rgba(36,33,43,.45)', disabled: got || s.fin, cls: 'hot' + (s.bad === it[0] ? ' nope' + (s.k % 2) : got ? '' : ' bobs'), aria: 'หยิบ' + it[1], tap: () => this.doPick(t, it) }));
        if (it[2]) todo.push({ img: pic(it[0]), text: got ? 'หยิบแล้ว' : it[1], bg: got ? GREEN : SOFT, op: 1 });
      });
    } else if (zoom && t.kind === 'heat') {
      const need = t.target > s.heat ? 1 : -1;
      hots.push(hot([303, 249, 22, 22], { ring: need < 0 && !s.fin ? RING : 'none', disabled: s.fin, aria: 'หรี่ไฟลง', tap: () => this.bump(t, -1) }));
      hots.push(hot([355, 249, 22, 22], { ring: need > 0 && !s.fin ? RING : 'none', disabled: s.fin, aria: 'เร่งไฟขึ้น', tap: () => this.bump(t, 1) }));
      todo = [0, 1, 2].map((i) => ({ img: X['heat' + i], text: ['ปิด', 'กลาง', 'แรง'][i] + (s.heat === i ? ' · ตอนนี้' : i === t.target ? ' · เป้าหมาย' : ''), bg: s.heat === i ? '#FFE66D' : SOFT, op: 1 }));
    } else if (zoom) {
      let first = -1;
      t.acts.forEach((a, i) => { if (first < 0 && c(a[0]) < a[3]) first = i; });
      t.acts.forEach((a, i) => {
        const n = c(a[0]), fin = n >= a[3], cur = i === first && !s.fin && !s.stirring;
        hots.push(hot(a[4], { img: a[5] ? pic(a[2]) : '', hasImg: !!a[5], op: fin && a[5] ? 0 : 1, ring: cur ? RING : 'none', disabled: !cur, aria: a[1], tap: () => this.doAct(t, a) }));
        todo.push({ img: pic(a[2]), text: fin ? 'เรียบร้อย' : a[3] > 1 && n > 0 && a[0] !== 'stir' ? n + ' / ' + a[3] : a[1], bg: fin ? GREEN : SOFT, op: fin || i === first ? 1 : 0.55 });
      });
    }
    const walk = { label: goText, img: X.walk, disabled: s.walking, tap: () => this.go(t.st) };
    const CAM = { fridge: [2.1, 62, 238], shelf: [3, 154, 190], sink: [2.4, 154, 240], rack: [2.5, 246, 196], board: [2.5, 246, 240], stove: [2.3, 306, 244] };
    let cam = 'translate(0px, 0px) scale(1)';
    if (zoom) {
      const [S, fx, fy] = CAM[t.st];
      const tx = Math.max(390 - 390 * S, Math.min(0, 195 - fx * S)), ty = Math.max(470 - 470 * S, Math.min(0, 235 - fy * S));
      cam = 'translate(' + tx.toFixed(1) + 'px, ' + ty.toFixed(1) + 'px) scale(' + S + ')';
    }
    const hex = (a, b, r) => '#' + [1, 3, 5].map((i) => { const x = parseInt(a.substr(i, 2), 16), y = parseInt(b.substr(i, 2), 16); return ('0' + Math.round(x + (y - x) * Math.min(1, r)).toString(16)).slice(-2); }).join('');
    const idx = (id) => all.findIndex((x) => x.id === id);
    const has = (id) => idx(id) >= 0;
    const past = (id) => has(id) && ti > idx(id);              // that task is behind us
    const took = (act, id) => past(id) || (t.id === id && c(act) > 0);
    const plated = t.id === 'plate' && c('plate') > 0;
    const atStove = t.st === 'stove' && t.kind === 'seq' && s.arrived;
    const stirAct = t.acts && t.acts.find((a) => a[0] === 'stir');
    const om = R.id === 'omelet';
    const sc = {
      fridge: t.id === 'fridge' && s.arrived,
      rkCleaver: true, rkParing: true, rkChef: !took('knife_chef', 'knife'),
      bOyster: !took('oyster', 'shelf'), bSoy: !took('soy', 'shelf'), bFish: !took('fish', 'shelf'), bSugar: !took('sugar', 'shelf'), bOil: true,
      boardLean: has('board') && !took('board', 'board'), board: took('board', 'board'),
      knife: om ? t.id === 'chop' : past('chop') && !past('aroma'), bits: !om && past('chop') && !past('aroma'),
      colander: t.id === 'wash', cup: t.id === 'water',
      water: (t.id === 'wash' && c('wash') > 0) || (t.id === 'water' && c('water') > 0),
      low: s.heat === 1, high: s.heat === 2, pm: true, h0: s.heat === 0, h1: s.heat === 1, h2: s.heat === 2,
      wOil: !plated && (om ? took('oil', 'oil') && !past('pour') && !(t.id === 'pour' && c('pour') > 0) : took('oil', 'fry') && !past('scoop')),
      wEgg: !om && ((t.id === 'fry' && c('egg') > 0) || (t.id === 'scoop' && c('scoop') === 0)),
      wAroma: !om && !plated && took('mix', 'aroma') && !took('pork', 'pork'),
      wPork: !om && !plated && took('pork', 'pork'),
      wBasil: !om && !plated && took('basil', 'basil'),
      eggplate: !om && !plated && took('scoop', 'scoop'),
      bowl: om && (t.id === 'mix' || t.id === 'whisk' || (past('whisk') && !took('pour', 'pour'))),
      bowlMix: om && (took('egg', 'mix')) && !took('pour', 'pour'),
      wOm: om && took('pour', 'pour') && !took('lift', 'lift'),
      omRest: om && took('lift', 'lift') && !plated,
      dish: plated, spat: atStove && !plated && !(t.wait) && (om ? past('pour') || t.id === 'flip' : t.id !== 'fry'),
      fume: s.heat > 0 && !plated && (om ? took('oil', 'oil') : past('mid')),
    };
    const bits = [];
    if (t.id === 'chop') {
      for (let i = 0; i < c('garlic') * 8; i++) bits.push({ x: 216 + (i % 4) * 4.2, y: 219 + Math.floor(i / 4) * 2.4, w: 3.6, h: 2.6, c: '#FFFDF4' });
      for (let i = 0; i < c('chili') * 8; i++) bits.push({ x: (om ? 234 : 246) + (i % 4) * 4.6, y: 219.4 + Math.floor(i / 4) * 2.2, w: 4.2, h: 2, c: '#F0584A' });
    }
    const SPOTS = [['fridge', 'ตู้เย็น', 8, 84, 90, 234], ['shelf', 'ชั้นเครื่องปรุง', 106, 136, 96, 52], ['sink', 'อ่างล้างจานและก๊อกน้ำ', 106, 192, 96, 126], ['rack', 'ราวแขวนมีด', 206, 132, 80, 62], ['board', 'เคาน์เตอร์และเขียง', 206, 198, 82, 120], ['stove', 'เตาแก๊ส', 292, 184, 96, 134]];
    const spots = SPOTS.map(([id, label, x, y, w, h]) => {
      const target = id === t.st && !s.arrived && !s.fin && !s.walking;
      return { aria: 'เดินไปที่' + label, x, y, w, h, target, off: zoom, cls: target ? 'spot pulse' : 'spot', ring: target ? '0 0 0 4px #24212B, 0 0 0 9px #FFE66D' : 'none', tap: () => this.go(id) };
    });
    const goal = t.goal || 0, timing = s.clock && goal > 0 && s.screen === 'cook';
    // ----- the taster's verdict: what the cook reports about the real dish, minus slips made on the way
    const S3 = this.score(R);
    const say = (k) => (s.ans[k] === 1 ? (S3[k] >= 4.5 ? R.good[k] : 'ผลออกมาดี แต่ระหว่างทำยังพลาดบางขั้น') : R.q[k][1][s.ans[k]] + ' ตามที่คุณบอก');
    const off = ['taste', 'aroma', 'look'].find((k) => s.ans[k] != null && s.ans[k] !== 1);
    const slip = ['taste', 'aroma', 'look'].slice().sort((a, b) => S3[a] - S3[b])[0];
    const tipNext = off ? R.q[off][2][s.ans[off] === 0 ? 0 : 1]
      : S3.total >= 4.95 ? 'ทำครบทุกขั้นและผลออกมาดีหมด ครั้งหน้าลองเปลี่ยนตัวเลือกสูตรดู'
      : s.miss.time ? 'ครั้งหน้าดูตามที่ให้สังเกตและเวลาที่จับไว้ก่อนกลับหรือตักขึ้น'
      : slip === 'aroma' ? 'ครั้งหน้าดูเป้าหมายไฟก่อนหมุนลูกบิด และอย่าข้ามขั้นคุมไฟ' : 'ครั้งหน้าลองทำให้ครบทุกขั้น ไม่ข้าม';
    const row = (k, sense) => ({ sense, label: R.q[k][0], score: S3[k].toFixed(1), pct: Math.round((S3[k] / 5) * 100) + '%', say: say(k) });
    const pickBtn = (on) => ({ on, bg: on ? '#24212B' : '#F5F3FC', fg: on ? '#FFFFFF' : '#24212B' });
    const qs = ['taste', 'aroma', 'look'].map((k, qi) => ({ label: ['ลิ้น', 'จมูก', 'ตา'][qi] + ' · ' + R.q[k][0], opts: R.q[k][1].map((label, i) => Object.assign(pickBtn(s.ans[k] === i), { label, pick: () => this.setState({ ans: Object.assign({}, s.ans, { [k]: i }) }) })) }));
    const answered = ['taste', 'aroma', 'look'].every((k) => s.ans[k] != null);
    // level: 200 points each; the app shell keeps the running total, alone we show the sample profile
    const xp = (app && app.save ? app.save.xp : 520 + s.gain), into = xp % 200, level = Math.floor(xp / 200) + 1;
    const leveled = s.tasting === 2 && into < s.gain;
    const nav = (name) => () => app.go(name);
    return {
      inApp, solo: !inApp, go: { Restaurant: inApp ? nav('Restaurant') : null, Recipes: inApp ? nav('Recipes') : null },
      isRecipe: s.screen === 'recipe', isCook: s.screen === 'cook', isDone: s.screen === 'done',
      dishName: R.name, dishImg: R.dish, dishAlt: R.name + 'ที่ทำเสร็จแล้ว', minsText: R.mins + ' นาที',
      menus: [['kaprao', 'กะเพราหมูสับ'], ['omelet', 'ไข่เจียวหมูสับ']].map(([id, label]) => Object.assign(pickBtn(s.recipe === id), { label, pick: () => (s.recipe === id ? null : this.setRecipe(id)) })),
      serv: s.serv, items, totalText: '฿' + total,
      g1Title: R.g1.title, g2Title: R.g2.title,
      spices: R.g1.opts.map((x, i) => Object.assign(pickBtn(s.o1 === i), { label: x.label, pick: () => this.setState({ o1: i }) })),
      styles: R.g2.opts.map((x, i) => Object.assign(pickBtn(s.o2 === i), { label: x.label, pick: () => this.setState({ o2: i }) })),
      spiceNote: R.sp.note, styleNote: R.st.note, kcalText: 'ราว ' + R.kcal + ' แคล', kcalShort: R.kcal + ' แคล',
      choiceText: R.sp.label + ' · ' + R.st.label,
      less: () => this.setState({ serv: Math.max(1, s.serv - 1) }),
      more: () => this.setState({ serv: Math.min(4, s.serv + 1) }),
      start: () => (s.started ? this.resume() : this.startCook()), restart: () => this.startCook(),
      startLabel: s.started ? 'ทำต่อ' : 'เริ่มทำ', canResume: s.started,
      asking: s.asking, stay: () => this.setState({ asking: false }),
      leave: () => { this.stopAll(); this.setState({ screen: 'recipe', asking: false, stirring: false, clock: false }); },
      back: () => this.prevTask(), noBack: ti === 0, backOp: ti === 0 ? 0.4 : 1,
      timerBg: s.sec >= goal ? '#1E7A45' : '#24212B',
      toRecipe: () => this.setState({ asking: true }),
      isEnter: s.screen === 'enter', skipEnter: () => this.enterKitchen(true),
      enterT: s.phase ? 'translate(147px, 196px) scale(0.72)' : 'translate(147px, 560px) scale(1.4)',
      skip: () => this.nextTask(true),
      stepNo: t.step + 1, stepCount: R.steps,
      bars: (() => {
        const tone = (on) => (on ? '#C2512E' : '#FFFFFF');
        const inStep = all.filter((x) => x.step === t.step), pos = inStep.indexOf(t) + (s.fin ? 1 : 0);
        const pct = Math.round((pos / inStep.length) * 100);
        return Array.from({ length: R.steps }, (_, i) => ({ bg: i === t.step ? 'linear-gradient(90deg, ' + tone(1) + ' ' + pct + '%, ' + tone(0) + ' ' + pct + '%)' : tone(i < t.step) }));
      })(),
      taskTitle: t.t,
      hint: s.note || (timing && s.sec >= goal && !s.fin && t.acts && t.acts[0][6] && t.acts[0][6].min ? 'ครบ ' + this.mmss(goal) + ' นาทีแล้ว ถ้าได้ที่ตามที่ให้สังเกต ทำแล้วแตะกระทะได้เลย' : s.walking ? 'กำลังเดินไป...' : !s.arrived ? goText : t.hint),
      sc, plated, bits, spots, hots, todo, walk, cam, showWalk: !zoom && !s.fin, showTodo: zoom && !s.fin && !s.stirring,
      showStir: zoom && !s.fin && s.stirring, stirDone: () => this.stirDone(),
      stirText: (t.stirLabel || 'กำลังผัด') + ' เหลือ ' + this.mmss(Math.ceil(s.left / 2)),
      see: t.see, why: t.why, finTitle: t.fin, showLesson: s.fin, showTask: !s.fin, showFoot: !s.fin, showSee: zoom && !s.fin,
      nextLabel: ti === all.length - 1 ? 'เสิร์ฟให้นักชิมเจี๊ยบ' : 'ต่อไป: ' + all[ti + 1].t, next: () => this.nextTask(false),
      timing, timeText: (s.sec >= goal ? 'ครบเวลาแล้ว ' : 'ทอดมาแล้ว ') + this.mmss(s.sec) + ' / ' + this.mmss(goal),
      showHeat: zoom && t.st === 'stove', heatText: HN[s.heat], cupFill: Math.min(12, c('water') * 10), spatCls: s.k % 2 ? 'spat1' : 'spat0',
      chefX: this.chefX(s.at), chefY: zoom ? -26 : 0, chefFace: s.face,
      chefCls: 'bot' + (s.walking ? ' walking mood-calm' : s.fin ? ' mood-happy' : s.arrived ? ' back pose-' + (t.kind === 'pick' ? 'reach' : t.kind === 'heat' || t.id === 'board' || t.id === 'on' ? 'knob' : t.st === 'sink' ? 'wash' : t.id === 'chop' ? 'chop' : 'stir') + ' act' + (s.k % 2) : ' mood-calm'),
      porkColor: t.id === 'pork' ? hex('#F4A7A0', '#B5714A', c('stir') / 8) : !past('season') && t.id !== 'season' ? '#B5714A' : t.id === 'season' ? hex('#B5714A', '#96583A', c('season')) : '#96583A',
      omColor: took('flip', 'flip') ? '#F2B84B' : '#FFE27A', mixColor: past('mix') && (t.id !== 'whisk' || c('stir') > 0) ? '#FFD95A' : '#FFE9A6',
      // done: serve → report the real result → verdict
      notTasted: s.tasting === 0, asked: s.tasting === 1, tasted: s.tasting === 2,
      taste: () => this.setState({ tasting: 1 }), qs, canJudge: answered, cantJudge: !answered, judgeOp: answered ? 1 : 0.45, judge: () => (answered ? this.judge() : null),
      scoreText: S3.total.toFixed(1), verdict: S3.total >= 4.5 ? 'อร่อยระดับขึ้นเมนูร้านได้เลย' : S3.total >= 3.5 ? 'อร่อยใช้ได้ อีกนิดเดียวก็เป๊ะ' : 'กินได้ แต่ยังต้องฝึกอีกหน่อย',
      rows: [row('taste', 'ลิ้น'), row('aroma', 'จมูก'), row('look', 'ตา')], tipNext,
      catCls: 'bot mood-' + (s.tasting === 2 ? (S3.total >= 3.5 ? 'happy' : 'calm') : s.tasting === 1 ? 'wow' : 'wave'),
      xpTitle: s.tasting === 2 ? (leveled ? 'เลเวลอัป! ตอนนี้เลเวล ' + level : 'ได้ ' + s.gain + ' แต้มประสบการณ์') : 'ชิมเสร็จแล้วจะได้แต้ม',
      xpLeft: 'อีก ' + (200 - into) + ' ถึงเลเวล ' + (level + 1), xpPct: Math.round((into / 200) * 100) + '%', xpAria: 'แต้มประสบการณ์ ' + into + ' จาก 200',
      again: () => this.setState({ screen: 'recipe', started: false, tasting: 0, ans: {}, gain: 0 }),
    };
  }
}
