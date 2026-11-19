export type Lang = 'th' | 'en';
/** ข้อความเนื้อหาสองภาษา ใช้กับข้อมูลสูตรและบทพูดมาสคอต */
export type L = { th: string; en: string };

const th = {
  'tab.home': 'ร้าน', 'tab.recipes': 'สูตร', 'tab.cook': 'ทำอาหาร', 'tab.me': 'ฉัน',
  'home.title': 'ร้านของทีมเชฟ', 'home.today': 'เมนูแนะนำวันนี้', 'home.resume': 'ทำต่อจากที่ค้างไว้',
  'home.resumeStep': 'ทำถึงขั้นที่ {n} จาก {total}', 'home.cooked': 'เมนูที่ทำแล้ว', 'home.next': 'อีกบทพูด', 'home.chef': 'เชฟช้าง',
  'recipes.title': 'วันนี้ทำอะไรดี?', 'recipes.sample': 'ราคาและแคลอรี่เป็นตัวเลขตัวอย่าง',
  'recipes.search': 'ค้นหาเมนู เช่น กะเพรา', 'recipes.all': 'ทั้งหมด', 'recipes.fast': 'ไม่เกิน 15 นาที',
  'recipes.cheap': 'ไม่เกิน {price}', 'recipes.light': 'แคลน้อย', 'recipes.count': 'ทำได้เลย {ready} เมนู · กำลังจะมา {soon} เมนู',
  'recipes.soon': 'กำลังจะมา เร็วๆ นี้', 'recipes.empty': 'ยังไม่มีเมนูที่ตรงเลย', 'recipes.emptyHint': 'ลองคำค้นอื่น หรือล้างตัวกรองดู',
  'recipes.clear': 'ล้างตัวกรอง', 'recipes.fridge': 'มีอะไรในตู้เย็น?', 'recipes.fridgeHint': 'แตะของที่มี เชฟจะเรียงเมนูที่ทำได้ให้',
  'recipes.pick': 'เลือกของ', 'recipes.close': 'ปิด', 'recipes.sorted': 'เรียงตามของที่คุณมี {n} อย่าง',
  'recipes.haveAll': 'ของครบ ทำได้เลย', 'recipes.missing': 'ขาด {items}', 'recipes.minutes': '{n} นาที',
  'recipes.made': 'ทำแล้ว {n} ครั้ง · ดีสุด {best} ดาว', 'recipes.kcal': 'ราว {n} แคล',
  'detail.back': 'กลับไปรายการสูตร', 'detail.adapt': 'ให้เชฟปรับสูตร', 'detail.ingredients': 'วัตถุดิบ',
  'detail.haveHint': 'แตะของที่มีอยู่แล้ว จะไม่ถูกนับในราคา', 'detail.have': 'มีแล้ว', 'detail.toBuy': 'ต้องซื้อเพิ่ม (ราคาตัวอย่าง)',
  'detail.start': 'เริ่มทำ', 'detail.kcal': '{n} แคล', 'detail.easy': 'ง่าย',
  'cook.step': 'ขั้นที่ {n} จาก {total}', 'cook.ask': 'ถามเชฟ', 'cook.done': 'เสร็จแล้ว ไปต่อ', 'cook.finish': 'เสร็จแล้ว ไปชิม',
  'cook.back': 'ย้อนงานก่อนหน้า', 'cook.see': 'สังเกต', 'cook.lesson': 'ทำแล้วได้อะไร', 'cook.gather': 'ของที่ต้องใช้',
  'cook.timer': 'จับเวลา', 'cook.timerStart': 'เริ่มจับเวลา {t}', 'cook.timerLeft': 'เหลือ {t}', 'cook.timerDone': 'ครบเวลาแล้ว ดูว่าได้ที่หรือยัง',
  'cook.timerNotify': 'ครบเวลาแล้ว', 'cook.heat0': 'ปิดไฟ', 'cook.heat1': 'ไฟกลาง', 'cook.heat2': 'ไฟแรง',
  'cook.exitTitle': 'ออกจากครัวก่อนไหม?', 'cook.exitBody': 'เชฟช้างจะจำไว้ว่าทำถึงไหน กลับมาทำต่อได้',
  'cook.exitStay': 'ทำต่อเลย', 'cook.exitLeave': 'ออกจากครัว', 'cook.close': 'ออกจากครัว',
  'ask.title': 'ถามเชฟช้าง', 'ask.often': 'คำถามที่คนมักถามตอนทำขั้นนี้', 'ask.back': 'กลับไปทำต่อ',
  'ask.typeSoon': 'พิมพ์หรือพูดถามเองจะเปิดเมื่อเชื่อม AI แล้ว คำถามด้านบนใช้ได้เลยแม้ไม่มีเน็ต',
  'ask.emergency': 'เหตุฉุกเฉินในครัว',
  'taste.title': 'นักชิมหนูจี๊ดขอชิมหน่อย', 'taste.intro': 'หนูจี๊ดชิมผ่านจอไม่ได้ เลยจะถามคุณ 3 ข้อ แล้วให้คะแนนพร้อมคำแนะนำ',
  'taste.submit': 'ให้หนูจี๊ดให้คะแนน', 'taste.result': 'นักชิมหนูจี๊ดให้คะแนน', 'taste.outOf': 'เต็ม 5',
  'taste.again': 'ทำเมนูอื่นต่อ', 'taste.home': 'กลับหน้าร้าน', 'taste.good': 'ดีแล้ว: {text}',
  'cookTab.title': 'ทำอาหาร', 'cookTab.pick': 'เลือกเมนูที่จะทำ', 'cookTab.hint': 'ระหว่างทำ หน้าจอจะไม่ดับเอง และปุ่มใหญ่กดง่ายแม้มือเปื้อน',
  'me.title': 'ครัวของฉัน', 'me.cooked': 'เมนูที่ทำแล้ว', 'me.avg': 'คะแนนเฉลี่ย', 'me.recent': 'ทำล่าสุด',
  'me.none': 'ยังไม่ได้ทำเมนูไหน ทำเสร็จแล้วคะแนนจากนักชิมหนูจี๊ดจะมาอยู่ตรงนี้', 'me.settings': 'ตั้งค่า',
  'me.lang': 'ภาษา', 'me.country': 'ประเทศและสกุลเงิน', 'me.countryHint': 'ใช้กับราคาและเมนูแนะนำ', 'me.dark': 'โหมดมืด',
  'me.darkSystem': 'ตามเครื่อง', 'me.stars': '{n} ดาว',
  'country.TH': 'ไทย', 'country.JP': 'ญี่ปุ่น', 'country.US': 'สหรัฐฯ',
  'common.close': 'ปิด',
};

const en: typeof th = {
  'tab.home': 'Home', 'tab.recipes': 'Recipes', 'tab.cook': 'Cook', 'tab.me': 'Me',
  'home.title': "The chef team's kitchen", 'home.today': "Today's pick", 'home.resume': 'Pick up where you left off',
  'home.resumeStep': 'Step {n} of {total}', 'home.cooked': 'Dishes cooked', 'home.next': 'Another line', 'home.chef': 'Chef Elephant',
  'recipes.title': "What's cooking?", 'recipes.sample': 'Sample prices and calories',
  'recipes.search': 'Search dishes, e.g. basil pork', 'recipes.all': 'All', 'recipes.fast': 'Up to 15 min',
  'recipes.cheap': 'Up to {price}', 'recipes.light': 'Low calorie', 'recipes.count': 'Ready now: {ready} · coming soon: {soon}',
  'recipes.soon': 'Coming soon', 'recipes.empty': 'No matching dishes yet', 'recipes.emptyHint': 'Try another search or clear the filters.',
  'recipes.clear': 'Clear filters', 'recipes.fridge': "What's in your fridge?", 'recipes.fridgeHint': 'Tap what you have and the chef sorts dishes you can make.',
  'recipes.pick': 'Pick items', 'recipes.close': 'Close', 'recipes.sorted': 'Sorted by the {n} items you have',
  'recipes.haveAll': 'You have everything', 'recipes.missing': 'Missing {items}', 'recipes.minutes': '{n} min',
  'recipes.made': 'Made {n} times · best {best} stars', 'recipes.kcal': '~{n} kcal',
  'detail.back': 'Back to recipes', 'detail.adapt': 'Let the chef adapt it', 'detail.ingredients': 'Ingredients',
  'detail.haveHint': "Tap what you already have. It won't count in the price.", 'detail.have': 'Have it', 'detail.toBuy': 'To buy (sample prices)',
  'detail.start': 'Start cooking', 'detail.kcal': '{n} kcal', 'detail.easy': 'Easy',
  'cook.step': 'Step {n} of {total}', 'cook.ask': 'Ask the chef', 'cook.done': 'Done, next', 'cook.finish': 'Done, time to taste',
  'cook.back': 'Back to previous task', 'cook.see': 'Look for', 'cook.lesson': 'What that did', 'cook.gather': 'You need',
  'cook.timer': 'Timer', 'cook.timerStart': 'Start timer {t}', 'cook.timerLeft': '{t} left', 'cook.timerDone': "Time's up. Check if it's ready.",
  'cook.timerNotify': "Time's up", 'cook.heat0': 'Heat off', 'cook.heat1': 'Medium heat', 'cook.heat2': 'High heat',
  'cook.exitTitle': 'Leave the kitchen?', 'cook.exitBody': 'Chef Elephant will remember your step so you can come back to it.',
  'cook.exitStay': 'Keep cooking', 'cook.exitLeave': 'Leave', 'cook.close': 'Leave the kitchen',
  'ask.title': 'Ask Chef Elephant', 'ask.often': 'Questions people often ask at this step', 'ask.back': 'Back to cooking',
  'ask.typeSoon': 'Typing or speaking your own question opens once AI is connected. The questions above work even offline.',
  'ask.emergency': 'Kitchen emergencies',
  'taste.title': 'Taster Mouse wants a bite', 'taste.intro': "Mouse can't taste through the screen, so answer 3 questions for a score and tips.",
  'taste.submit': 'Get my score', 'taste.result': "Taster Mouse's score", 'taste.outOf': 'out of 5',
  'taste.again': 'Cook another dish', 'taste.home': 'Back to Home', 'taste.good': 'Nice: {text}',
  'cookTab.title': 'Cook', 'cookTab.pick': 'Pick a dish to cook', 'cookTab.hint': 'While cooking, the screen stays on and the big buttons work even with messy hands.',
  'me.title': 'My kitchen', 'me.cooked': 'Dishes cooked', 'me.avg': 'Average score', 'me.recent': 'Cooked recently',
  'me.none': "Nothing cooked yet. Taster Mouse's scores will show up here.", 'me.settings': 'Settings',
  'me.lang': 'Language', 'me.country': 'Country and currency', 'me.countryHint': 'Used for prices and suggestions', 'me.dark': 'Dark mode',
  'me.darkSystem': 'Follow device', 'me.stars': '{n} stars',
  'country.TH': 'Thailand', 'country.JP': 'Japan', 'country.US': 'United States',
  'common.close': 'Close',
};

export type Key = keyof typeof th;
const DICT = { th, en };

export function translate(lang: Lang, key: Key, vars?: Record<string, string | number>): string {
  let s: string = DICT[lang][key];
  if (vars) for (const k in vars) s = s.split('{' + k + '}').join(String(vars[k]));
  return s;
}
