// ข้อมูลสูตรย้ายมาจากต้นแบบหน้าทำอาหาร ปรับข้อความให้เป็นการ์ดทีละขั้น (ไม่มีฉากให้แตะ)
// สูตรทั้งหมดยังเป็นสถานะ "ยังไม่ลอง" ตามแผน ต้องลองทำจริงก่อนเปิดให้คนใช้
import type { L } from '../lib/i18n.ts';

export type ImgKey =
  | 'pork' | 'egg' | 'garlic' | 'chili' | 'rice' | 'morning-glory' | 'chicken' | 'basil' | 'oil'
  | 'oyster-sauce' | 'soy-sauce' | 'sugar' | 'fish'
  | 'dish-kaprao' | 'dish-omelet' | 'dish-fried-rice' | 'dish-morning-glory' | 'dish-tom-yum' | 'dish-green-curry'
  | 'dish-moo-palo' | 'dish-prik-khing';

export type Heat = 0 | 1 | 2;
export type Step = { id: string; phase: number; title: L; do: L; see: L; why: L; heat?: Heat; timer?: number; gather?: L[] };
export type Option = { label: L; note: L };
export type Ingredient = { id: string; img?: ImgKey; name: L; q: number; unit: L; baht: number; why: L };
export type Sense = { label: L; options: [L, L, L]; tips: [L, L]; good: L };
export type QA = [L, L];
export type Recipe = {
  id: string; name: L; img: ImgKey; mins: number; phases: number; kcal: number;
  g1: { title: L; opts: Option[] }; g2: { title: L; opts: Option[] };
  adapts: { id: string; label: L }[]; adaptNotes: L[];
  ingredients: Ingredient[]; steps: Step[]; qa: (step: Step) => QA[]; senses: Sense[];
};

const l = (th: string, en: string): L => ({ th, en });
const fmt = (n: number) => (n === 0.5 ? l('ครึ่ง', 'half a') : l(String(n), String(n)));
const U = {
  g: l('กรัม', 'g'), egg: l('ฟอง', 'eggs'), clove: l('กลีบ', 'cloves'), chili: l('เม็ด', 'chilies'),
  tbsp: l('ช้อนโต๊ะ', 'tbsp'), tsp: l('ช้อนชา', 'tsp'), plate: l('จาน', 'plate'), handful: l('กำมือ', 'handful'),
  ml: l('มล.', 'ml'), piece: l('ลูก', 'pieces'), leaf: l('ใบ', 'leaves'), plates: l('จาน', 'plates'), root: l('ราก', 'roots'),
};

export const SAFETY: QA[] = [
  [l('น้ำมันลุกไฟ', 'Oil fire'), l('ปิดเตา เอาฝาหรือถาดโลหะครอบกระทะ ห้ามราดน้ำ และห้ามยกกระทะหนี', "Turn off the stove and cover the pan with a lid or metal tray. Never pour water on it, and don't carry the pan away.")],
  [l('โดนลวกหรือน้ำมันกระเด็น', 'Burn or oil splash'), l('เปิดน้ำก๊อกไหลผ่านแผล 10 ถึง 20 นาที ไม่ทายาสีฟันหรือน้ำปลา แผลพองกว้างให้ไปหาหมอ', 'Run tap water over the burn for 10 to 20 minutes. No toothpaste or fish sauce. See a doctor if it blisters widely.')],
  [l('ได้กลิ่นแก๊ส', 'Smell gas'), l('ปิดวาล์วถัง เปิดประตูหน้าต่าง ห้ามจุดไฟและห้ามกดสวิตช์ไฟ แล้วออกไปนอกห้อง', "Close the tank valve and open doors and windows. Don't light anything or touch light switches, then leave the room.")],
];

// คำตอบที่เตรียมไว้ต่อขั้น ไม่ต้องใช้เน็ตและไม่นับโควตา
const QA_BANK: Record<string, QA[]> = {
  fridge: [
    [l('ไม่มีกะเพรา ใช้อะไรแทนได้', 'No holy basil. What can I use?'), l('ใช้โหระพาแทนได้ กลิ่นจะหวานกว่า หรือกลับไปหน้าสูตรแล้วกด "ไม่มีกะเพรา" เชฟจะปรับให้ทั้งสูตร', 'Thai basil works and smells sweeter. Or go back to the recipe and tap "No holy basil" so the chef adapts the whole recipe.')],
    [l('เนื้อยังแช่แข็งอยู่ ทำยังไง', 'The meat is still frozen. What do I do?'), l('แช่ทั้งถุงในน้ำอุณหภูมิห้อง 10 ถึง 15 นาที อย่าใช้น้ำร้อน ผิวนอกจะสุกก่อนและเนื้อเสียรส', "Soak the sealed bag in room-temperature water for 10 to 15 minutes. Don't use hot water or the outside starts to cook.")],
  ],
  chop: [
    [l('ใช้ครกตำแทนสับได้ไหม', 'Can I pound it in a mortar instead?'), l('ได้ และหอมกว่าด้วย ตำแค่หยาบๆ พอแตก อย่าตำจนแหลก', "Yes, and it smells even better. Pound just until cracked, not to a paste.")],
    [l('จับพริกแล้วแสบมือ', 'My hands burn from the chilies'), l('ล้างมือด้วยสบู่ ถูน้ำมันพืชเล็กน้อยก่อนล้างจะช่วยได้ และอย่าขยี้ตา', "Wash with soap. Rubbing on a little cooking oil first helps. Don't rub your eyes.")],
  ],
  fry: [
    [l('น้ำมันกระเด็นโดนมือ', 'Hot oil splashed my hand'), l('หรี่ไฟก่อน แล้วเปิดน้ำเย็นไหลผ่านจุดที่โดน 20 นาที อย่าทาครีม น้ำมัน หรือเนย ถ้าแผลใหญ่ ลึก หรืออยู่ที่หน้า ให้ไปโรงพยาบาล', "Lower the heat, then run cool water over it for 20 minutes. No cream, oil or butter. If it's large, deep or on your face, go to a hospital.")],
    [l('ชอบไข่แดงสุก ทำยังไง', 'I like a firm yolk'), l('ตักน้ำมันร้อนราดบนไข่แดง หรือกลับด้านแล้วทอดต่ออีกราวครึ่งนาที', 'Spoon hot oil over the yolk, or flip it and fry about 30 seconds more.')],
  ],
  scoop: [[l('ไข่ติดกระทะ แซะไม่ออก', 'The egg is stuck'), l('รอให้ขอบกรอบก่อนแล้วค่อยแซะ ถ้ายังติด เติมน้ำมันอีกนิดแล้วเอียงกระทะให้น้ำมันไหลเข้าใต้ไข่', 'Wait for the edges to crisp before lifting. Still stuck? Add a little oil and tilt the pan so it runs under the egg.')]],
  aroma: [
    [l('กระเทียมไหม้แล้ว ทำยังไง', 'My garlic burnt. What now?'), l('ถ้าดำและมีกลิ่นขม ให้ตักทิ้งแล้วเริ่มผัดใหม่ เพราะรสขมจะติดทั้งจาน ถ้าแค่น้ำตาลเข้ม ใส่เนื้อลงไปได้เลยเพื่อหยุดความร้อน', "If it's black and bitter, scoop it out and start again, or the whole dish tastes bitter. If it's just dark brown, add the meat now to stop the heat.")],
    [l('ควันฉุนจนไอ', 'The smoke makes me cough'), l('เป็นปกติของพริกที่โดนน้ำมันร้อน เปิดพัดลมดูดควันหรือหน้าต่าง แล้วหรี่ไฟลงเล็กน้อย', 'Normal for chilies in hot oil. Turn on the hood or open a window, and lower the heat a little.')],
  ],
  pork: [
    [l('เนื้อออกน้ำเยอะ แฉะ', 'The meat is watery'), l('กระทะยังไม่ร้อนพอ หรือใส่เนื้อเยอะไป เร่งไฟแล้วเกลี่ยให้กระจาย ปล่อยให้น้ำระเหย อย่าเพิ่งใส่เครื่องปรุง', "The pan isn't hot enough or it's too full. Turn up the heat, spread the meat out and let the water cook off before seasoning.")],
    [l('รู้ได้ยังไงว่าสุกแล้ว', 'How do I know it is cooked?'), l('ไม่เหลือสีชมพูทั้งชิ้น และน้ำที่ออกมาใส ไม่ขุ่นแดง', 'No pink left anywhere and the juices run clear, not cloudy red.')],
  ],
  season: [
    [l('เค็มไปแล้ว แก้ยังไง', 'Too salty. How do I fix it?'), l('เติมน้ำเปล่า 1 ถึง 2 ช้อนโต๊ะกับน้ำตาลหยิบมือ ผัดต่ออีกครู่ หรือกินกับข้าวเพิ่มและเจาะไข่แดงคลุก', 'Add 1 to 2 tbsp water and a pinch of sugar and stir a bit longer. Or eat it with more rice and mix in the yolk.')],
    [l('ไม่มีซอสหอย ใช้อะไรแทน', 'No oyster sauce. What instead?'), l('ใช้ซีอิ๊วขาวเพิ่มอีก 1 ช้อนชากับน้ำตาลอีกหยิบมือแทนได้ รสจะกลมน้อยกว่าเล็กน้อย', 'Use 1 more tsp light soy sauce and another pinch of sugar. It tastes a little less rounded.')],
  ],
  basil: [[l('ใส่ตอนไฟยังเปิดได้ไหม', 'Can I add it with the heat on?'), l('ได้ แต่ผัดไม่เกิน 10 วินาที นานกว่านั้นใบจะดำและกลิ่นหาย', 'Yes, but stir no more than 10 seconds or the leaves turn black and lose their smell.')]],
  mix: [
    [l('เปลือกไข่ตกลงไปในชาม', 'Eggshell fell in the bowl'), l('ใช้เปลือกไข่ครึ่งซีกตักออก จะตักง่ายกว่าใช้นิ้วหรือช้อน', 'Scoop it out with half an eggshell. Easier than a finger or spoon.')],
    [l('ใส่ผักเพิ่มได้ไหม', 'Can I add vegetables?'), l('ได้ ต้นหอมหรือหอมแดงซอย 1 ช้อนโต๊ะกำลังดี ใส่มากไปไข่จะไม่เกาะเป็นแผ่น', "Yes, 1 tbsp sliced spring onion or shallot is right. Too much and the egg won't hold together.")],
  ],
  whisk: [[l('ต้องตีนานแค่ไหนถึงจะฟู', 'How long until it gets fluffy?'), l('ตีเร็วๆ ราวครึ่งนาทีจนขึ้นฟองละเอียด เอียงชามแล้วตีให้อากาศเข้า', 'Beat fast for about 30 seconds until fine bubbles form. Tilt the bowl to get air in.')]],
  oil: [[l('รู้ได้ยังไงว่าน้ำมันร้อนพอ', 'How do I know the oil is hot?'), l('น้ำมันมีควันบางๆ และสั่นเบาๆ เมื่อเอียงกระทะ หรือหยดไข่ลงไปนิดเดียวแล้วฟูทันที', 'A thin wisp of smoke and the oil shimmers when you tilt the pan. Or drop in a bit of egg: it should puff up at once.')]],
  pour: [[l('ไข่ไม่ฟูเลย', "The egg didn't puff up"), l('น้ำมันยังไม่ร้อนพอหรือน้อยไป ครั้งนี้ทอดต่อได้ จะได้ไข่แบบนุ่ม ครั้งหน้ารอให้น้ำมันร้อนกว่านี้และเทจากที่สูง', 'The oil was not hot enough or too little. Keep frying for a soft omelet. Next time wait for hotter oil and pour from higher up.')]],
  flip: [[l('กลับด้านแล้วแผ่นขาด', 'It broke when I flipped it'), l('ไม่เป็นไร ดันกลับมาต่อกันในกระทะได้ ครั้งหน้ารอให้ด้านล่างเซ็ตตัวก่อน และใช้ตะหลิวสองอันช่วยพลิก', "That's fine, push it back together in the pan. Next time let the bottom set first and use two spatulas.")]],
  'gc-fridge': [
    [l('ไม่มีมะเขือเปราะ ใช้อะไรแทนได้', 'No Thai eggplant. What instead?'), l('ใช้มะเขือยาว หน่อไม้ หรือฟักทองหั่นชิ้นแทนได้ ใส่ตอนเดียวกัน ฟักทองต้องเคี่ยวนานขึ้นราว 3 นาที', 'Long eggplant, bamboo shoots or pumpkin chunks all work, added at the same point. Pumpkin needs about 3 minutes longer.')],
    [l('ใช้อกไก่แทนสะโพกได้ไหม', 'Can I use breast instead of thigh?'), l('ได้ แต่ใส่ทีหลังและเคี่ยวแค่พอสุก อกไก่ที่เคี่ยวนานหรืออุ่นซ้ำจะแห้ง', 'Yes, but add it later and simmer only until done. Breast dries out with long simmering or reheating.')],
  ],
  'gc-cream': [[l('หัวกะทิไม่แตกมันเลย', 'The cream will not separate'), l('กะทิกล่องบางยี่ห้อแตกมันยาก เคี่ยวต่ออีก 1 ถึง 2 นาที ถ้ายังไม่แตก ใส่น้ำมันพืช 1 ช้อนโต๊ะแล้วผัดพริกแกงต่อได้เลย', 'Some boxed coconut milk barely separates. Give it 1 to 2 more minutes. Still nothing? Add 1 tbsp oil and go on with the paste.')]],
  'gc-paste': [
    [l('พริกแกงติดก้นหม้อ', 'The paste is sticking'), l('หรี่ไฟ เติมกะทิ 1 ถึง 2 ช้อนโต๊ะแล้วคนต่อ อย่าปล่อยจนไหม้ เพราะรสขมจะติดทั้งหม้อ', 'Lower the heat, add 1 to 2 tbsp coconut milk and keep stirring. Do not let it burn or the whole pot turns bitter.')],
    [l('ควันแสบตาแสบจมูก', 'The fumes sting my eyes'), l('เป็นปกติของพริกแกงที่โดนความร้อน เปิดพัดลมดูดควันหรือหน้าต่าง', 'Normal for curry paste in hot fat. Turn on the hood or open a window.')],
  ],
  'gc-simmer': [
    [l('กะทิแตกเป็นเม็ดแล้ว', 'The coconut milk split'), l('หรี่ไฟลงทันที รสยังเหมือนเดิม แค่หน้าตาไม่เนียน ครั้งหน้าเคี่ยวไฟกลางค่อนอ่อน', 'Turn the heat down at once. It tastes the same, it just looks less smooth. Next time keep it at a gentle simmer.')],
    [l('รู้ได้ยังไงว่าไก่สุก', 'How do I know the chicken is done?'), l('ผ่าชิ้นที่ใหญ่ที่สุดดู ข้างในขาวทั้งชิ้น ไม่มีสีชมพู', 'Cut the biggest piece open: white all the way through, no pink.')],
  ],
  'gc-season': [
    [l('เค็มไปแล้ว แก้ยังไง', 'Too salty. How do I fix it?'), l('เติมกะทิหรือน้ำเปล่าครึ่งถ้วยแล้วเคี่ยวต่อ หรือเติมน้ำตาลอีกนิด', 'Add half a cup of coconut milk or water and simmer a little longer, or a pinch more sugar.')],
    [l('เผ็ดเกินไป', 'Too spicy'), l('เติมกะทิอีกครึ่งกล่อง ความมันจะช่วยลดเผ็ด', 'Add another half box of coconut milk. The fat softens the heat.')],
  ],
  'gc-store': [
    [l('อุ่นซ้ำยังไงให้ไม่แตกมัน', 'How do I reheat it without splitting?'), l('อุ่นไฟกลางค่อนอ่อน คนเป็นระยะจนเดือดทั่วหม้อ หรือเข้าไมโครเวฟทีละกล่อง 2 ถึง 3 นาที คนครั้งหนึ่งระหว่างนั้น', 'Reheat on medium-low, stirring now and then, until it bubbles all through. Or microwave one box for 2 to 3 minutes, stirring once.')],
    [l('แช่แข็งได้ไหม', 'Can I freeze it?'), l('ได้ราว 1 เดือน มะเขือจะนิ่มลง ละลายในตู้เย็นข้ามคืนแล้วอุ่นให้เดือด', 'Yes, for about a month. The eggplant gets softer. Thaw overnight in the fridge and reheat until it boils.')],
  ],
  'mp-fridge': [
    [l('ไม่มีผงพะโล้ ใช้อะไรแทนได้', 'No five-spice powder. What instead?'), l('ใช้โป๊ยกั๊ก 2 ดอกกับอบเชย 1 แท่ง ใส่ตอนเติมน้ำ กลิ่นจะใกล้เคียงกัน', 'Use 2 star anise and 1 cinnamon stick, added with the water. The smell is close.')],
    [l('ไม่มีน้ำตาลปี๊บ', 'No palm sugar'), l('ใช้น้ำตาลทรายแดงหรือน้ำตาลทรายเท่ากันได้ น้ำตาลทรายขาวเป็นคาราเมลเร็วกว่า ต้องดูให้ดี', 'Brown or white sugar works, same amount. White sugar caramelizes faster, so watch it.')],
  ],
  'mp-eggs': [[l('ปอกแล้วไข่ขาวขาดเป็นแผ่น', 'The whites tear when I peel'), l('ไข่ที่สดมากจะปอกยาก ใช้ไข่ที่ซื้อมาแล้ว 3 ถึง 4 วัน แช่น้ำเย็นให้นานพอ แล้วปอกใต้น้ำไหล', 'Very fresh eggs peel badly. Use eggs bought 3 to 4 days ago, cool them long enough and peel under running water.')]],
  'mp-caramel': [
    [l('น้ำตาลไหม้ดำแล้ว', 'The sugar burnt black'), l('ล้างหม้อแล้วเริ่มใหม่ เพราะความขมจะติดทั้งหม้อ ครั้งหน้าใช้ไฟกลางค่อนอ่อน และไปขั้นต่อไปทันทีที่เป็นสีทอง', 'Wash the pot and start again, or the bitterness spreads to everything. Next time use medium-low heat and move on as soon as it turns golden.')],
    [l('น้ำตาลจับเป็นก้อน ไม่ละลาย', 'The sugar clumped and will not melt'), l('คนต่อไปเรื่อยๆ บนไฟกลาง ก้อนจะค่อยๆ ละลาย หรือเติมน้ำ 1 ช้อนโต๊ะช่วย', 'Keep stirring on medium heat and the lumps will melt. A tablespoon of water helps.')],
  ],
  'mp-braise': [
    [l('น้ำงวดเร็วไป', 'The liquid is drying up'), l('เติมน้ำร้อนให้ท่วมเนื้อ หรี่ไฟให้อ่อนลงอีก แล้วปิดฝาให้สนิท', 'Top up with hot water to cover the meat, turn the heat lower and close the lid.')],
    [l('ครบเวลาแล้วเนื้อยังเหนียว', 'The meat is still tough'), l('เคี่ยวต่อครั้งละ 10 นาทีจนส้อมจิ้มเข้าง่าย เนื้อแต่ละร้านนุ่มเร็วไม่เท่ากัน', 'Keep simmering 10 minutes at a time until a fork goes in easily. Meat from different shops softens at different speeds.')],
  ],
  'mp-store': [
    [l('อุ่นซ้ำยังไง', 'How do I reheat it?'), l('อุ่นในหม้อจนเดือดทั่ว หรือเข้าไมโครเวฟทีละกล่องจนร้อนทั่ว ถ้าน้ำงวดเติมน้ำนิดหน่อย', 'Bring it to a boil in a pot, or microwave one box at a time until hot all through. Add a splash of water if it has reduced.')],
    [l('แช่แข็งได้ไหม', 'Can I freeze it?'), l('เนื้อแช่แข็งได้ราว 1 เดือน แต่ไข่ต้มแช่แข็งแล้วจะเหนียวเป็นยาง กินไข่ให้หมดภายใน 4 วัน', 'The meat freezes for about a month, but boiled eggs turn rubbery in the freezer. Eat the eggs within 4 days.')],
  ],
  'pk-fridge': [
    [l('ไม่มีพริกแกงเผ็ด ใช้อะไรแทนได้', 'No red curry paste. What instead?'), l('พริกแกงพริกขิงสำเร็จรูปดีที่สุด หรือใช้พริกแกงเขียวหวานก็ได้ รสจะต่างไปเล็กน้อย', 'Ready-made prik khing paste is best, or use green curry paste for a slightly different taste.')],
    [l('ไม่มีถั่วฝักยาว', 'No long beans'), l('ใช้ถั่วแขกหรือถั่วลันเตาแทนได้ หั่นและผัดเวลาเท่ากัน', 'Green beans or snow peas work. Cut and cook them the same way.')],
  ],
  'pk-paste': [
    [l('พริกแกงติดกระทะ', 'The paste is sticking'), l('หรี่ไฟ เติมน้ำ 1 ช้อนโต๊ะแล้วผัดต่อ อย่าปล่อยจนไหม้ เพราะจะขมทั้งจาน', 'Lower the heat, add a tablespoon of water and keep stirring. Do not let it burn or the whole dish turns bitter.')],
    [l('ควันแสบตาแสบจมูก', 'The fumes sting my eyes'), l('เป็นปกติของพริกแกงที่โดนน้ำมันร้อน เปิดพัดลมดูดควันหรือหน้าต่าง', 'Normal for curry paste in hot oil. Turn on the hood or open a window.')],
  ],
  'pk-meat': [
    [l('เนื้อออกน้ำ แฉะ', 'The meat went watery'), l('ไฟยังไม่แรงพอหรือใส่เนื้อเยอะไป เร่งไฟแล้วผัดต่อจนน้ำระเหย เครื่องแกงจะกลับมาเกาะ', 'The heat is too low or the wok too full. Turn it up and keep going until the liquid evaporates and the paste clings again.')],
    [l('รู้ได้ยังไงว่าสุกแล้ว', 'How do I know it is cooked?'), l('ไม่เหลือสีชมพูทั้งชิ้น และน้ำที่ออกมาใส', 'No pink left anywhere and the juices run clear.')],
  ],
  'pk-beans': [[l('ถั่วยังแข็งอยู่', 'The beans are still hard'), l('เติมน้ำอีก 2 ช้อนโต๊ะ ปิดฝา 1 นาทีให้ไอน้ำช่วย', 'Add 2 more tbsp water and cover for a minute so the steam finishes them.')]],
  'pk-season': [
    [l('เค็มไปแล้ว แก้ยังไง', 'Too salty. How do I fix it?'), l('เติมน้ำตาลอีกนิดกับน้ำ 1 ถึง 2 ช้อนโต๊ะ หรือเพิ่มถั่วฝักยาว', 'Add a little more sugar and 1 to 2 tbsp water, or more beans.')],
    [l('เผ็ดเกินไป', 'Too spicy'), l('เติมน้ำตาลอีกนิด กินกับไข่ต้มหรือไข่เจียว ครั้งหน้าลดพริกแกงลง 1 ช้อนโต๊ะ', 'Add a little sugar and eat it with a boiled egg or an omelet. Next time use 1 tbsp less paste.')],
  ],
  'pk-store': [[l('อุ่นซ้ำยังไง', 'How do I reheat it?'), l('ผัดในกระทะไฟกลางกับน้ำ 1 ช้อนโต๊ะจนร้อนทั่ว หรือเข้าไมโครเวฟทีละกล่อง', 'Toss in a pan over medium heat with a tablespoon of water until hot, or microwave one box at a time.')]],
  lift: [[l('ไข่อมน้ำมัน', 'The omelet is greasy'), l('ตักขึ้นพักบนกระดาษซับน้ำมันหรือตะแกรง ครั้งหน้าให้น้ำมันร้อนกว่านี้ก่อนเทไข่ ไข่จะอมน้ำมันน้อยลง', 'Rest it on paper towel or a rack. Next time heat the oil more before pouring and it soaks up less.')]],
};
const STOVE_QA: QA = [l('ใช้เตาไฟฟ้าหรือเตาแม่เหล็กไฟฟ้าได้ไหม', 'Can I use an electric or induction stove?'), l('ได้ ไฟกลางคือระดับกลางของเตา ไฟแรงคือระดับสูงสุดหรือรองลงมา เตาไฟฟ้าร้อนและเย็นช้ากว่าแก๊ส ให้ปรับล่วงหน้าราวครึ่งนาที', 'Yes. Medium heat is the middle setting, high heat is the top or one below. Electric stoves react slower than gas, so adjust about 30 seconds early.')];
const PAUSE_QA: QA = [l('ขอพักก่อน ทิ้งไว้ได้ไหม', 'I need a break. Can I leave it?'), l('ได้ แต่ถ้าจะออกจากครัวแม้แป๊บเดียว ให้ปิดเตาก่อน อาหารรอได้ กระทะร้อนบนไฟรอไม่ได้', "Yes, but turn off the stove before you leave, even briefly. Food can wait, a hot pan on the flame can't.")];

const qa = (step: Step): QA[] => [...(QA_BANK[step.id] ?? []), ...(step.heat !== undefined ? [STOVE_QA] : []), PAUSE_QA].slice(0, 3);

const SALT: [L, L, L] = [l('จืดไป', 'Too bland'), l('กำลังดี', 'Just right'), l('เค็มไป', 'Too salty')];

// แทนคำในทุกข้อความเมื่อเลือกปรับสูตร เช่น ไม่กินหมู แทนด้วยไก่
type Swap = { th: [string, string][]; en: [string, string][] };
const SWAPS: Record<string, Swap> = {
  basil: { th: [['ใบกะเพรา', 'ใบโหระพา'], ['กะเพรา', 'โหระพา']], en: [['Holy basil', 'Thai basil'], ['holy basil', 'Thai basil']] },
  pork: { th: [['หมูสับ', 'ไก่สับ'], ['หมู', 'ไก่']], en: [['Minced pork', 'Minced chicken'], ['minced pork', 'minced chicken'], ['Pork', 'Chicken'], ['pork', 'chicken']] },
};
function applySwaps<T>(value: T, swaps: Swap[]): T {
  const fix = (s: string, lang: 'th' | 'en') => swaps.reduce((x, sw) => sw[lang].reduce((y, [a, b]) => y.split(a).join(b), x), s);
  const walk = (v: unknown): unknown => {
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>;
      if (typeof o.th === 'string' && typeof o.en === 'string' && Object.keys(o).length === 2) return { th: fix(o.th, 'th'), en: fix(o.en, 'en') };
      return Object.fromEntries(Object.entries(o).map(([k, x]) => [k, typeof x === 'function' ? x : walk(x)]));
    }
    return v;
  };
  return walk(value) as T;
}

function kaprao(o1: number, o2: number, adapt: string[]): Recipe {
  const SP = [
    { label: l('เผ็ดน้อย', 'Mild'), n: 1, baht: 1, note: l('พริก 1 เม็ด ได้กลิ่นพริกหอมๆ แทบไม่เผ็ด เด็กก็กินได้', '1 chili. You get the aroma with almost no heat. Kids can eat it.'), why: l('1 เม็ดให้แค่กลิ่นหอม ไม่ทิ้งรสเผ็ด', '1 chili gives aroma, not heat') },
    { label: l('เผ็ดกลาง', 'Medium spicy'), n: 4, baht: 2, note: l('พริก 4 เม็ด เผ็ดพอรู้สึก แบบร้านตามสั่งทั่วไป', '4 chilies. Heat you can feel, like a typical made-to-order shop.'), why: l('4 เม็ดเผ็ดพอรู้สึก ไม่กลบรสหมู', '4 chilies: noticeable heat that does not hide the pork') },
    { label: l('เผ็ดจัด', 'Very spicy'), n: 8, baht: 4, note: l('พริก 8 เม็ด เผ็ดถึงใจ ควรมีไข่ดาวไว้ช่วยตัดเผ็ด', '8 chilies. Seriously hot. The fried egg helps cut the heat.'), why: l('8 เม็ดเผ็ดจัด ไข่แดงจะช่วยตัดเผ็ด', '8 chilies is very hot. The yolk helps cut it') },
  ];
  const ST = [
    { label: l('ผัดแห้ง', 'Dry stir-fry'), water: 1, oil: 2, kcal: 650, note: l('น้ำน้อย ผัดจนเครื่องเกาะหมู หอมกลิ่นกระทะ แบบร้านตามสั่ง', 'Little water. Stir-fried until the seasoning clings to the pork, with a smoky wok aroma.'), waterWhy: l('น้ำแค่ 1 ช้อนโต๊ะช่วยละลายเครื่องปรุงไม่ให้ไหม้ แล้วระเหยหมด ได้ผัดแห้งหอม', 'Just 1 tbsp water dissolves the seasoning so it does not burn, then cooks off for a dry, fragrant stir-fry.') },
    { label: l('ขลุกขลิก', 'Saucy'), water: 4, oil: 2, kcal: 650, note: l('เติมน้ำมากขึ้น ได้น้ำซอสไว้คลุกข้าว กินคล่องคอ', 'More water gives you sauce to mix into the rice.'), waterWhy: l('น้ำ 4 ช้อนโต๊ะกลายเป็นน้ำซอสขลุกขลิก ไว้คลุกข้าวให้ชุ่ม', '4 tbsp water turns into a light sauce for the rice.') },
    { label: l('น้ำมันน้อย', 'Less oil'), water: 2, oil: 1, kcal: 560, note: l('ใช้น้ำมันครึ่งเดียว เบาลงราว 90 แคล แต่ขอบไข่ดาวจะกรอบน้อยกว่า', 'Half the oil, about 90 kcal lighter, but the egg edges are less crisp.'), waterWhy: l('น้ำ 2 ช้อนโต๊ะช่วยให้ผัดลื่น แทนน้ำมันที่ลดลง', '2 tbsp water keeps things moving in place of the missing oil.') },
  ];
  const sp = SP[o1] ?? SP[1], st = ST[o2] ?? ST[0];
  const lowSalt = adapt.includes('salt');
  const sauce = lowSalt ? 0.5 : 1;
  const n = sp.n;
  const ingredients: Ingredient[] = [
    { id: 'pork', name: l('หมูสับ', 'Minced pork'), q: 120, unit: U.g, baht: 22, why: l('ปริมาณนี้กระทะไม่แน่น หมูเลยผัดแห้งหอม ไม่ออกน้ำ', 'This amount does not crowd the pan, so the pork fries dry instead of turning watery') },
    { id: 'basil', name: l('ใบกะเพรา', 'Holy basil'), q: 1, unit: U.handful, baht: 5, why: l('ดูเยอะแต่โดนร้อนแล้วยุบเหลือนิดเดียว', 'Looks like a lot but it wilts down to very little') },
    { id: 'garlic', name: l('กระเทียม', 'Garlic'), q: 4, unit: U.clove, baht: 2, why: l('เป็นกลิ่นหอมพื้นฐาน มากกว่านี้จะกลบกลิ่นกะเพรา', 'The base aroma. More would drown out the holy basil') },
    { id: 'chili', name: l('พริกขี้หนู', "Bird's eye chili"), q: n, unit: U.chili, baht: sp.baht, why: sp.why },
    { id: 'egg', name: l('ไข่ไก่', 'Egg'), q: 1, unit: U.egg, baht: 5, why: l('ไข่แดงเยิ้มๆ ช่วยตัดรสเผ็ดและเค็ม', 'A runny yolk softens the heat and salt') },
    { id: 'rice', name: l('ข้าวสวย', 'Cooked rice'), q: 1, unit: U.plate, baht: 7, why: l('ราวทัพพีครึ่ง พอดีกับหมู 120 กรัม', 'About one and a half scoops, right for 120 g pork') },
    { id: 'oil', name: l('น้ำมันพืช', 'Vegetable oil'), q: st.oil, unit: U.tbsp, baht: st.oil, why: st.oil === 1 ? l('ลดเหลือครึ่งเดียว จานเบาลง แต่ขอบไข่กรอบน้อยลง', 'Half the usual. Lighter, but less crispy egg edges') : l('พอให้ไข่ดาวขอบกรอบ แล้วใช้ที่เหลือผัดต่อ', 'Enough for crisp egg edges, with the rest used for the stir-fry') },
    { id: 'oyster-sauce', name: l('ซอสหอยนางรม', 'Oyster sauce'), q: 1, unit: U.tbsp, baht: 2, why: l('รสหลักของจาน ให้ความกลมกล่อมและสีเงา', 'The main flavor. Gives roundness and a glossy color') },
    { id: 'soy-sauce', name: l('ซีอิ๊วขาว', 'Light soy sauce'), q: sauce, unit: U.tsp, baht: 1, why: lowSalt ? l('ลดลงครึ่งหนึ่งตามที่ขอ ชิมก่อนแล้วค่อยเติม', 'Halved as you asked. Taste before adding more') : l('เติมเค็มหอม ใส่น้อยเพราะซอสหอยเค็มอยู่แล้ว', 'Adds a fragrant saltiness. Use little, oyster sauce is already salty') },
    { id: 'fish', name: l('น้ำปลา', 'Fish sauce'), q: sauce, unit: U.tsp, baht: 1, why: lowSalt ? l('ลดลงครึ่งหนึ่งตามที่ขอ ชิมก่อนแล้วค่อยเติม', 'Halved as you asked. Taste before adding more') : l('ให้กลิ่นแบบไทย มากกว่านี้จะเค็มโดด', 'Gives the Thai aroma. Any more and the salt stands out') },
    { id: 'sugar', name: l('น้ำตาลทราย', 'Sugar'), q: 0.5, unit: U.tsp, baht: 1, why: l('ไม่ได้ให้หวาน แค่ตัดรสเค็มให้กลม', 'Not for sweetness, just to round off the salt') },
  ];
  const s = fmt(sauce);
  const steps: Step[] = [
    { id: 'fridge', phase: 1, title: l('หยิบของจากตู้เย็น', 'Get items from the fridge'), do: l('หยิบของจริงออกมาวางให้ครบก่อนเปิดไฟ', 'Take everything out before you turn on the heat.'),
      gather: [l('หมูสับ 120 กรัม', 'Minced pork, 120 g'), l('ไข่ 1 ฟอง', '1 egg'), l('ใบกะเพรา 1 กำมือ', '1 handful holy basil'), l('กระเทียม 4 กลีบ', '4 garlic cloves'), l(`พริกขี้หนู ${n} เม็ด`, `${n} bird's eye chilies`)],
      see: l('ของสด หมูสีชมพู ใบกะเพราไม่ช้ำ', 'Fresh items: pink pork, unbruised basil leaves'),
      why: l('พอเริ่มผัดทุกอย่างเร็วมาก เตรียมของครบก่อนจะได้ไม่ต้องวิ่งหาของจนกระเทียมไหม้', 'Once you start frying everything moves fast. Having it all ready means the garlic will not burn while you search.') },
    { id: 'chop', phase: 1, title: l('สับกระเทียมกับพริก', 'Chop garlic and chilies'), do: l(`วางเขียงให้นิ่ง ใช้มีดเชฟสับกระเทียม 4 กลีบกับพริก ${n} เม็ดแบบหยาบๆ`, `Steady the cutting board. With a chef's knife, roughly chop 4 garlic cloves and ${n} chilies.`),
      see: l('สับแค่หยาบๆ ยังเห็นเป็นชิ้นเล็ก', 'Just rough, small pieces still visible'),
      why: l('สับหยาบทำให้กระเทียมไม่ไหม้เร็ว และพริกแตกพอให้ความเผ็ดออก ล้างมือหลังจับพริกด้วย', 'A rough chop keeps the garlic from burning fast and cracks the chilies enough to release heat. Wash your hands after.') },
    { id: 'wash', phase: 1, title: l('ล้างใบกะเพรา', 'Wash the holy basil'), do: l('เด็ดใบกะเพรา ล้างน้ำแล้วสะบัดให้หมาด', 'Pick the holy basil leaves, rinse, then shake them dry.'),
      see: l('ใบหมาด ไม่มีน้ำหยด', 'Leaves damp, not dripping'),
      why: l('ล้างฝุ่นและดินออก ใบที่หมาดจะไม่ทำให้น้ำมันกระเด็นตอนลงกระทะ', 'Washes off dust and soil. Dry leaves will not make the oil spit in the pan.') },
    { id: 'stove', phase: 2, heat: 1, title: l('เปิดเตา ไฟกลาง', 'Stove on, medium heat'), do: l('เปิดเตาจริง แล้วหรี่ลงเป็นไฟกลาง วางกระทะให้ร้อน', 'Turn on the stove, lower it to medium and let the wok heat up.'),
      see: l('เปลวไฟสีฟ้า เตี้ย ไม่เลียขอบกระทะ', 'A low blue flame that does not lick the sides of the wok'),
      why: l('กระทะร้อนก่อนใส่น้ำมัน อาหารจะไม่ติด และไฟกลางทำให้ไข่ขาวสุกทันพอดีกับขอบที่กรอบ', 'A hot wok keeps food from sticking, and medium heat cooks the egg white just as the edges crisp.') },
    { id: 'fry', phase: 2, heat: 1, timer: 120, title: l('ทอดไข่ดาว', 'Fry the egg'), do: l(`เทน้ำมัน ${st.oil} ช้อนโต๊ะ รอให้ร้อน แล้วตอกไข่ลงไป ทอดราว 2 นาที`, `Pour in ${st.oil} tbsp oil, let it heat, then crack in the egg. Fry about 2 minutes.`),
      see: l('ขอบไข่เหลืองกรอบ ไข่ขาวขุ่นทั่ว ระวังน้ำมันกระเด็น', 'Golden crispy edges, egg white set all over. Watch for spitting oil'),
      why: st.oil === 1 ? l('น้ำมัน 1 ช้อนโต๊ะพอให้ไข่ไม่ติดกระทะ ขอบจะกรอบน้อยกว่า แต่จานเบาลง', '1 tbsp oil is enough to stop sticking. Less crisp edges, but a lighter dish.') : l('น้ำมันที่ร้อนพอทำให้ขอบไข่ฟูกรอบทันที และเหลือไว้ผัดต่อ', 'Hot enough oil puffs and crisps the edges right away, with some left for the stir-fry.') },
    { id: 'scoop', phase: 2, heat: 1, title: l('ตักไข่ขึ้นพัก', 'Lift out the egg'), do: l('ตักไข่ขึ้นพักไว้ เหลือน้ำมันในกระทะ', 'Lift the egg out to rest. Leave the oil in the wok.'),
      see: l('น้ำมันที่เหลือหอมกลิ่นไข่', 'The leftover oil smells of fried egg'),
      why: l('ตักขึ้นก่อน ไข่จะไม่สุกเกิน ไข่แดงยังเยิ้ม และน้ำมันหอมไข่ไว้ผัดต่อ', 'Lifting it now keeps the yolk runny, and the egg-scented oil flavors the stir-fry.') },
    { id: 'aroma', phase: 3, heat: 1, timer: 20, title: l('ผัดกระเทียมพริก', 'Fry garlic and chilies'), do: l('ใส่กระเทียมพริกลงกระทะ ผัดราว 20 วินาที', 'Add the garlic and chilies and stir about 20 seconds.'),
      see: l('กระเทียมเริ่มเหลืองทอง กลิ่นฉุนขึ้นจมูก', 'Garlic turning golden, a sharp smell rising'),
      why: l('กลิ่นหอมจะละลายลงน้ำมัน แล้วไปเคลือบหมูทุกชิ้น', 'The aroma goes into the oil, which then coats every piece of pork.') },
    { id: 'pork', phase: 4, heat: 2, timer: 120, title: l('เร่งไฟแรง ผัดหมูสับ', 'High heat, fry the pork'), do: l('เร่งเป็นไฟแรง ใส่หมูสับ ยีให้แตกแล้วผัดจนสุก ราว 2 นาที', 'Turn the heat to high, add the pork, break it up and stir-fry until cooked, about 2 minutes.'),
      see: l('หมูเป็นสีน้ำตาล ไม่เหลือสีชมพู', 'Pork browned, no pink left'),
      why: l('ไฟแรงทำให้น้ำจากหมูระเหยเร็ว หมูเลยผัดแห้งหอม ยีให้แตกช่วยให้สุกทั่วและเครื่องปรุงเกาะทุกชิ้น ล้างมือหลังจับหมูดิบด้วย', 'High heat cooks off the pork juices fast so it fries dry. Breaking it up cooks it through and lets the seasoning cling. Wash your hands after raw pork.') },
    { id: 'season', phase: 5, heat: 2, timer: 30, title: l('ปรุงรส', 'Season'),
      do: l(`ใส่ซอสหอย 1 ช้อนโต๊ะ ซีอิ๊วขาว${s.th} ช้อนชา น้ำปลา${s.th} ช้อนชา น้ำตาลครึ่งช้อนชา และน้ำ ${st.water} ช้อนโต๊ะ ผัดให้เข้ากัน`, `Add 1 tbsp oyster sauce, ${s.en} tsp light soy sauce, ${s.en} tsp fish sauce, half a tsp sugar and ${st.water} tbsp water. Stir together.`),
      see: l('ซอสเดือดปุดๆ แล้วเคลือบหมูเป็นเงา ชิมดู เค็มไปเติมน้ำ จืดไปเติมน้ำปลา', 'The sauce bubbles and glazes the pork. Taste: too salty add water, too bland add fish sauce'),
      why: lowSalt ? l('ปรุงตอนหมูสุกแล้ว รสจะเคลือบผิวหมูพอดี สูตรนี้ลดเค็มไว้ ชิมก่อนเติม', 'Seasoning cooked pork coats it evenly. This version is lower in salt, so taste before adding more.') : l('ปรุงตอนหมูสุกแล้ว รสจะเคลือบผิวหมูพอดี และยังชิมปรับรสได้ก่อนปิดไฟ', 'Seasoning cooked pork coats it evenly, and you can still adjust before the heat goes off.'),
      gather: [l('ซอสหอย', 'Oyster sauce'), l('ซีอิ๊วขาว', 'Light soy sauce'), l('น้ำปลา', 'Fish sauce'), l('น้ำตาล', 'Sugar'), l('น้ำเปล่า', 'Water')] },
    { id: 'basil', phase: 6, heat: 0, timer: 10, title: l('ปิดไฟ ใส่กะเพรา', 'Heat off, add holy basil'), do: l('ปิดเตา แล้วใส่ใบกะเพรา ผัดเร็วๆ พอใบสลด', 'Turn off the stove, add the holy basil and toss quickly until it wilts.'),
      see: l('ใบสลดลงแต่ยังเขียวสด', 'Leaves wilted but still bright green'),
      why: l('ความร้อนที่ค้างในกระทะพอให้ใบสลด ใบจะไม่ดำ และกลิ่นยังอยู่ครบ', 'The heat left in the wok is enough to wilt it, so the leaves stay green and keep their smell.') },
    { id: 'plate', phase: 6, title: l('จัดจาน', 'Plate up'), do: l('ตักราดข้างข้าว วางไข่ดาวไว้บนสุด', 'Spoon it next to the rice and put the fried egg on top.'),
      see: l('ไข่ดาวอยู่บนสุด ขอบยังกรอบ', 'Egg on top, edges still crisp'),
      why: l('เจาะไข่แดงคลุกข้าว ช่วยตัดเผ็ดและเค็ม', 'Break the yolk into the rice to soften the heat and salt.') },
  ];
  const r: Recipe = {
    id: 'kaprao', name: l('กะเพราหมูสับไข่ดาว', 'Basil pork & egg'), img: 'dish-kaprao', mins: 15, phases: 6, kcal: st.kcal - (adapt.includes('pork') ? 40 : 0),
    g1: { title: l('ความเผ็ด', 'Spiciness'), opts: SP }, g2: { title: l('สไตล์การผัด', 'Stir-fry style'), opts: ST },
    adapts: [{ id: 'basil', label: l('ไม่มีกะเพรา', 'No holy basil') }, { id: 'pork', label: l('ไม่กินหมู', 'No pork') }, { id: 'salt', label: l('ลดเค็ม', 'Less salty') }],
    adaptNotes: [
      ...(adapt.includes('basil') ? [l('ใช้โหระพาแทนกะเพรา กลิ่นจะหวานกว่า ใส่ตอนปิดไฟเหมือนเดิม', 'Thai basil instead of holy basil. Sweeter smell, still added with the heat off.')] : []),
      ...(adapt.includes('pork') ? [l('ใช้ไก่สับแทนหมูสับ ปริมาณเท่าเดิม ผัดจนขาวขุ่นทั้งชิ้น เบาลงราว 40 แคล', 'Minced chicken instead of pork, same amount. Cook until opaque white. About 40 kcal lighter.')] : []),
      ...(lowSalt ? [l('ลดน้ำปลากับซีอิ๊วขาวเหลืออย่างละครึ่งช้อนชา ชิมก่อนแล้วค่อยเติม', 'Fish sauce and light soy cut to half a tsp each. Taste before adding more.')] : []),
    ],
    ingredients, steps, qa,
    senses: [
      { label: l('รสชาติ', 'Taste'), options: SALT, good: l('เค็มหวานกลมกล่อม', 'Salty-sweet and well rounded'), tips: [l('ครั้งหน้าเพิ่มน้ำปลาอีกครึ่งช้อนชา ครั้งนี้เหยาะน้ำปลาพริกเพิ่มได้', 'Next time add half a tsp more fish sauce. For now, add some chili fish sauce.'), l('ครั้งหน้าลดน้ำปลาเหลือครึ่งช้อนชา ครั้งนี้กินกับข้าวเพิ่มและเจาะไข่แดงคลุกจะช่วย', 'Next time cut the fish sauce to half a tsp. For now, eat with more rice and mix in the yolk.')] },
      { label: l('กลิ่น', 'Aroma'), options: [l('ยังไม่หอม', 'Not fragrant yet'), l('หอมกะเพรา', 'Smells of holy basil'), l('มีกลิ่นไหม้', 'Smells burnt')], good: l('หอมกลิ่นกระทะ กะเพราขึ้นจมูก', 'Smoky wok aroma with holy basil up front'), tips: [l('ครั้งหน้าให้กระทะร้อนก่อนใส่กระเทียม และใส่กะเพราตอนปิดไฟ', 'Next time heat the wok before the garlic, and add the basil with the heat off.'), l('กระเทียมไหม้เร็วมาก ครั้งหน้าหรี่ไฟตอนผัดกระเทียม หรือสับให้หยาบขึ้น', 'Garlic burns fast. Next time lower the heat for the garlic or chop it coarser.')] },
      { label: l('หน้าตา', 'Look'), options: [l('หมูซีด แฉะ', 'Pale, watery pork'), l('สวยน่ากิน', 'Looks delicious'), l('เข้มหรือไหม้', 'Dark or burnt')], good: l('ไข่ดาวขอบกรอบ กะเพรายังเขียว', 'Crispy egg edges, basil still green'), tips: [l('ครั้งหน้าใช้ไฟแรงตอนผัดหมู และอย่าคนบ่อย ให้หมูได้โดนกระทะ', 'Next time use high heat for the pork and stir less so it touches the wok.'), l('ครั้งหน้าลดไฟลงหนึ่งระดับ หรือผัดให้สั้นลง', 'Next time go one heat level lower or fry for less time.')] },
    ],
  };
  const swaps = (['basil', 'pork'] as const).filter((k) => adapt.includes(k)).map((k) => SWAPS[k]);
  return swaps.length ? applySwaps(r, swaps) : r;
}

function omelet(o1: number, o2: number, adapt: string[]): Recipe {
  const SP = [
    { label: l('ไม่เผ็ด', 'Not spicy'), n: 0, note: l('ไม่ใส่พริก รสไข่ล้วน เด็กกินได้', 'No chili, just egg. Fine for kids.') },
    { label: l('เผ็ดนิด', 'A little spicy'), n: 2, note: l('พริกซอย 2 เม็ด เผ็ดปลายลิ้น ตัดเลี่ยนไข่', '2 sliced chilies. A light kick that cuts the richness.') },
    { label: l('เผ็ดจัด', 'Very spicy'), n: 5, note: l('พริกซอย 5 เม็ด เผ็ดทุกคำ เหมาะกินกับข้าวสวยร้อนๆ', '5 sliced chilies. Heat in every bite, great with hot rice.') },
  ];
  const ST = [
    { label: l('ฟูกรอบ', 'Puffy & crisp'), oil: 4, heat: 2 as Heat, kcal: 650, a: 60, b: 45, note: l('น้ำมันเยอะ ไฟแรง เทจากที่สูง ได้ไข่พองฟู ขอบกรอบ แบบร้านข้าวแกง', 'Lots of oil, high heat, poured from high up. Puffy with crisp edges, like a curry-rice shop.') },
    { label: l('นุ่มหนา', 'Soft & thick'), oil: 2, heat: 1 as Heat, kcal: 550, a: 90, b: 60, note: l('ไฟกลาง ตีไข่น้อย ได้แผ่นหนา เนื้อนุ่มชุ่ม ไม่อมน้ำมัน', 'Medium heat, light beating. Thick, soft and moist, not greasy.') },
    { label: l('น้ำมันน้อย', 'Less oil'), oil: 1, heat: 1 as Heat, kcal: 450, a: 90, b: 60, note: l('ใช้น้ำมัน 1 ช้อนโต๊ะ เบาลงราว 100 แคล ควรใช้กระทะเคลือบ ไข่จะไม่ฟู', '1 tbsp oil, about 100 kcal lighter. Use a non-stick pan. It will not puff up.') },
  ];
  const sp = SP[o1] ?? SP[0], st = ST[o2] ?? ST[0], fluffy = o2 === 0, hot = sp.n > 0;
  const lowSalt = adapt.includes('salt'), fishQ = lowSalt ? 0.5 : 1, f = fmt(fishQ);
  const mmss = (s: number) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  const ingredients: Ingredient[] = [
    { id: 'egg', name: l('ไข่ไก่', 'Eggs'), q: 2, unit: U.egg, baht: 10, why: l('2 ฟองได้แผ่นหนาพอดี 1 จาน', '2 eggs make a thick omelet for 1 plate') },
    { id: 'pork', name: l('หมูสับ', 'Minced pork'), q: 50, unit: U.g, baht: 9, why: l('มากกว่านี้ไข่จะไม่เกาะกันเป็นแผ่น', 'Any more and the egg will not hold together') },
    ...(hot ? [{ id: 'chili' as ImgKey, name: l('พริกขี้หนู', "Bird's eye chili"), q: sp.n, unit: U.chili, baht: 1, why: sp.n > 2 ? l('5 เม็ดเผ็ดทุกคำ ลดได้ถ้ากินกับเด็ก', '5 chilies: heat in every bite. Use fewer for kids') : l('2 เม็ดเผ็ดแค่ปลายลิ้น', '2 chilies: just a light kick') }] : []),
    { id: 'fish', name: l('น้ำปลา', 'Fish sauce'), q: fishQ, unit: U.tsp, baht: 1, why: lowSalt ? l('ลดลงครึ่งหนึ่งตามที่ขอ จิ้มซอสเพิ่มทีหลังได้', 'Halved as you asked. Add sauce at the table if needed') : l('เค็มพอดีสำหรับไข่ 2 ฟอง ดึงรสไข่ให้ชัด', 'The right salt for 2 eggs, brings out the egg flavor') },
    { id: 'oil', name: l('น้ำมันพืช', 'Vegetable oil'), q: st.oil, unit: U.tbsp, baht: st.oil, why: fluffy ? l('น้ำมันเยอะและร้อนจัด ไข่ถึงจะพองฟู', 'Lots of very hot oil is what makes it puff') : st.oil === 1 ? l('พอเคลือบกระทะ จานเบาลง แต่ไข่ไม่ฟู', 'Just coats the pan. Lighter, but no puff') : l('พอให้ไข่ไม่ติดกระทะและขอบเหลืองสวย', 'Enough to stop sticking and give golden edges') },
    { id: 'rice', name: l('ข้าวสวย', 'Cooked rice'), q: 1, unit: U.plate, baht: 7, why: l('ข้าวร้อนๆ รับกับไข่เจียวพอดีคำ', 'Hot rice goes perfectly with the omelet') },
  ];
  const heatWord = st.heat === 2 ? l('ไฟแรง', 'high heat') : l('ไฟกลาง', 'medium heat');
  const steps: Step[] = [
    { id: 'fridge', phase: 1, title: l('หยิบของจากตู้เย็น', 'Get items from the fridge'), do: l('หยิบของจริงออกมาวางให้ครบ', 'Take everything out and set it on the counter.'),
      gather: [l('ไข่ 2 ฟอง', '2 eggs'), l('หมูสับ 50 กรัม', 'Minced pork, 50 g'), ...(hot ? [l(`พริกขี้หนู ${sp.n} เม็ด`, `${sp.n} bird's eye chilies`)] : []), l('น้ำปลา', 'Fish sauce')],
      see: l('ไข่เปลือกไม่ร้าว หมูสีชมพูสด', 'No cracked eggs, fresh pink pork'),
      why: l('ไข่ 2 ฟองกับหมูสับ 50 กรัมได้แผ่นหนาพอดี 1 จาน หมูมากกว่านี้ไข่จะไม่เกาะกันเป็นแผ่น', '2 eggs and 50 g pork make one thick omelet. More pork and it falls apart.') },
    ...(hot ? [{ id: 'chop', phase: 1, title: l('ซอยพริก', 'Slice the chilies'), do: l(`วางเขียงให้นิ่ง ใช้มีดเชฟซอยพริก ${sp.n} เม็ดเป็นแว่นบางๆ`, `Steady the cutting board and thinly slice ${sp.n} chilies into rounds with a chef's knife.`),
      see: l('แว่นบาง ขนาดเท่าๆ กัน', 'Thin, even rounds'),
      why: l('ซอยบางให้พริกกระจายทั่วแผ่นไข่ ได้เผ็ดทุกคำ ล้างมือหลังจับพริกด้วย', 'Thin slices spread through the omelet so every bite has heat. Wash your hands after.') } as Step] : []),
    { id: 'mix', phase: 2, title: l('ผสมไข่ในชาม', 'Mix the eggs in a bowl'), do: l(`ตอกไข่ 2 ฟอง ใส่หมูสับกับน้ำปลา${f.th} ช้อนชา${hot ? ' และพริกซอย' : ''}`, `Crack 2 eggs, add the pork and ${f.en} tsp fish sauce${hot ? ', plus the sliced chili' : ''}.`),
      see: l('ไม่มีเศษเปลือกไข่ หมูไม่จับเป็นก้อน', 'No eggshell, no clumps of pork'),
      why: l('ผสมก่อนลงกระทะ ไข่จะสุกเสมอกันทั้งแผ่น และน้ำปลาจะเข้าเนื้อ ล้างมือหลังจับหมูดิบด้วย', 'Mixing first means it cooks evenly and the fish sauce soaks in. Wash your hands after raw pork.') },
    { id: 'whisk', phase: 2, timer: fluffy ? 40 : 20, title: l('ตีไข่', 'Beat the eggs'), do: fluffy ? l('ตีไข่เร็วๆ ให้ขึ้นฟอง', 'Beat fast until foamy.') : l('ตีแค่พอเข้ากัน', 'Beat just until combined.'),
      see: fluffy ? l('ขึ้นฟองละเอียดทั่วชาม', 'Fine bubbles all over') : l('ไข่ขาวกับไข่แดงเข้ากันดี', 'Whites and yolks fully mixed'),
      why: fluffy ? l('ฟองอากาศจะขยายตัวตอนโดนน้ำมันร้อน ไข่เลยฟู', 'The air bubbles expand in hot oil, which makes it puff.') : l('ตีน้อยไข่จะเนื้อแน่นนุ่ม ชุ่มและไม่อมน้ำมัน', 'Light beating gives a dense, soft, moist omelet that is not greasy.') },
    { id: 'stove', phase: 3, heat: st.heat, title: l(`เปิดเตา${heatWord.th}`, `Stove on, ${heatWord.en}`), do: l(`เปิดเตาจริง ตั้ง${heatWord.th} วางกระทะ`, `Turn on the stove to ${heatWord.en} and put the pan on.`),
      see: st.heat === 2 ? l('เปลวไฟสีฟ้าเต็มหัวเตา', 'A full blue flame') : l('เปลวไฟเตี้ย ไม่เลียขอบกระทะ', 'A low flame that does not lick the sides'),
      why: st.heat === 2 ? l('ไฟแรงทำให้ไข่พองฟูทันทีที่ลงกระทะ', 'High heat puffs the egg the moment it hits the pan.') : l('ไฟกลางทำให้ไข่สุกถึงข้างในก่อนผิวจะไหม้ ได้ไข่นุ่มสีเหลืองทอง', 'Medium heat cooks it through before the outside burns, for a soft golden omelet.') },
    { id: 'oil', phase: 3, heat: st.heat, timer: 45, title: l('ตั้งน้ำมันให้ร้อน', 'Heat the oil'), do: l(`เทน้ำมัน ${st.oil} ช้อนโต๊ะ รอให้ร้อนราว 45 วินาที`, `Pour in ${st.oil} tbsp oil and let it heat for about 45 seconds.`),
      see: l('น้ำมันมีควันบางๆ และสั่นเบาๆ เมื่อเอียงกระทะ', 'A wisp of smoke, oil shimmering when you tilt the pan'),
      why: fluffy ? l('น้ำมันที่ร้อนจัดทำให้ไข่พองฟูกรอบทันที ถ้าไม่ร้อนพอ ไข่จะอมน้ำมัน', 'Very hot oil puffs and crisps the egg instantly. If it is not hot enough, the egg soaks up oil.') : l('น้ำมันต้องร้อนก่อนเทไข่ ไม่อย่างนั้นไข่จะอมน้ำมันและติดกระทะ', 'The oil must be hot first, or the egg turns greasy and sticks.') },
    { id: 'pour', phase: 4, heat: st.heat, title: l('เทไข่ลงกระทะ', 'Pour in the egg'), do: fluffy ? l('เทไข่จากที่สูงราวหนึ่งคืบเป็นสาย', 'Pour the egg in a stream from about a hand-span above.') : l('เทไข่ชิดกระทะตรงกลาง', 'Pour the egg close to the middle of the pan.'),
      see: l('ขอบไข่ฟูและเริ่มเซ็ตตัว ระวังน้ำมันกระเด็น', 'Edges puff and start to set. Watch for spitting oil'),
      why: fluffy ? l('เทจากที่สูง ไข่จะโดนอากาศและแตกเป็นเส้น ฟูกรอบกว่า', 'Pouring from high gets air in and breaks it into strands, so it is puffier and crisper.') : l('เทชิดกระทะ ไข่จะเป็นแผ่นหนาเนื้อนุ่ม และน้ำมันไม่กระเด็น', 'Pouring low gives a thick, soft omelet and less splatter.') },
    { id: 'flip', phase: 4, heat: st.heat, timer: st.a, title: l('ทอดแล้วกลับด้าน', 'Fry, then flip'), do: l(`ทอดราว ${mmss(st.a)} นาที พอขอบเหลืองทองให้กลับด้าน`, `Fry about ${mmss(st.a)} min. When the edges are golden, flip it.`),
      see: l('ขอบเหลืองทอง ผิวบนเริ่มไม่เหลว', 'Golden edges, top no longer runny'),
      why: l('กลับตอนด้านล่างเซ็ตตัวแล้ว แผ่นไข่จะไม่ขาด และสองด้านสุกเท่ากัน', 'Flipping once the bottom has set keeps it whole and cooks both sides evenly.') },
    { id: 'lift', phase: 4, heat: st.heat, timer: st.b, title: l('ทอดอีกด้าน แล้วตักขึ้น', 'Fry the other side, then lift'), do: l(`ทอดอีกด้านราว ${mmss(st.b)} นาที แล้วตักขึ้นพักน้ำมัน`, `Fry the other side about ${mmss(st.b)} min, then lift it out to drain.`),
      see: l('เหลืองทองสองด้าน กดกลางแผ่นไม่มีน้ำไข่ไหล', 'Golden on both sides, no runny egg when you press the middle'),
      why: l('หมูสับข้างในต้องสุก กลับแค่ครั้งเดียวและไม่กดแผ่นไข่ ไข่จะไม่แบน', 'The pork inside must cook through. Flip only once and do not press, so it stays puffy.') },
    { id: 'plate', phase: 5, heat: 0, title: l('ปิดไฟ จัดจาน', 'Heat off, plate up'), do: l('ปิดเตา แล้ววางไข่เจียวบนข้าวสวยร้อนๆ', 'Turn off the stove and put the omelet on hot rice.'),
      see: l('วางไข่บนข้าวตอนยังร้อน', 'Plate it while still hot'),
      why: l('ปิดเตาก่อนกันน้ำมันที่เหลือร้อนเกินจนเป็นควัน กินตอนร้อนขอบยังกรอบ', 'Turning off first stops leftover oil from overheating. Eat it hot while the edges are crisp.') },
  ];
  const r: Recipe = {
    id: 'omelet', name: l('ไข่เจียวหมูสับ', 'Thai pork omelet'), img: 'dish-omelet', mins: 10, phases: 5, kcal: st.kcal - (adapt.includes('pork') ? 40 : 0),
    g1: { title: l('ความเผ็ด', 'Spiciness'), opts: SP }, g2: { title: l('เนื้อไข่', 'Texture'), opts: ST },
    adapts: [{ id: 'pork', label: l('ไม่กินหมู', 'No pork') }, { id: 'salt', label: l('ลดเค็ม', 'Less salty') }],
    adaptNotes: [
      ...(adapt.includes('pork') ? [l('ใช้ไก่สับแทนหมูสับ ปริมาณเท่าเดิม ทอดจนขาวขุ่นทั้งชิ้น เบาลงราว 40 แคล', 'Minced chicken instead of pork, same amount. Cook until opaque white. About 40 kcal lighter.')] : []),
      ...(lowSalt ? [l('ลดน้ำปลาเหลือครึ่งช้อนชา จิ้มซอสเพิ่มทีหลังได้', 'Fish sauce cut to half a tsp. Add sauce at the table if needed.')] : []),
    ],
    ingredients, steps, qa,
    senses: [
      { label: l('รสชาติ', 'Taste'), options: SALT, good: l('เค็มกำลังดี รสไข่ชัด', 'Salted right, clear egg flavor'), tips: [l('ครั้งหน้าเพิ่มน้ำปลาอีกครึ่งช้อนชา ครั้งนี้จิ้มน้ำปลาพริกหรือซอสพริกเพิ่มได้', 'Next time add half a tsp more fish sauce. For now, dip in chili fish sauce or chili sauce.'), l('ครั้งหน้าลดน้ำปลาเหลือครึ่งช้อนชา ครั้งนี้กินกับข้าวเพิ่มจะช่วย', 'Next time cut the fish sauce to half a tsp. For now, more rice helps.')] },
      { label: l('กลิ่น', 'Aroma'), options: [l('ยังคาวไข่', 'Still eggy'), l('หอมไข่ทอด', 'Smells of fried egg'), l('มีกลิ่นไหม้', 'Smells burnt')], good: l('หอมไข่ทอด ไม่คาว', 'Smells of fried egg, not raw'), tips: [l('ครั้งหน้าตีไข่ให้นานขึ้น และทอดให้สุกถึงข้างใน กลิ่นคาวจะหาย', 'Next time beat longer and cook it through to lose the eggy smell.'), l('ไฟแรงเกินไป ครั้งหน้าหรี่ไฟลงตอนทอดด้านที่สอง', 'The heat was too high. Next time lower it for the second side.')] },
      { label: l('หน้าตา', 'Look'), options: [l('ซีด อมน้ำมัน', 'Pale and greasy'), l('เหลืองทองสวย', 'Nicely golden'), l('เข้มหรือไหม้', 'Dark or burnt')], good: fluffy ? l('ฟูกรอบ เหลืองทองสวย', 'Puffy, crisp and golden') : l('เหลืองทองเสมอกันทั้งแผ่น', 'Evenly golden all over'), tips: [l('น้ำมันยังไม่ร้อนพอตอนเทไข่ ครั้งหน้ารอให้น้ำมันมีควันบางๆ ก่อน', 'The oil was not hot enough. Next time wait for a wisp of smoke.'), l('ครั้งหน้ากลับด้านเร็วขึ้น หรือลดไฟลงหนึ่งระดับ', 'Next time flip sooner or go one heat level lower.')] },
    ],
  };
  return adapt.includes('pork') ? applySwaps(r, [SWAPS.pork]) : r;
}

// หม้อละ 4 จาน เก็บตู้เย็นได้ 3 วัน จึงเป็นจานหนึ่งในแผนทำอาหารวันอาทิตย์ด้วย
function greenCurry(o1: number, o2: number, adapt: string[]): Recipe {
  const SP = [
    { label: l('เผ็ดน้อย', 'Mild'), paste: 2, chili: 0, baht: 10, note: l('พริกแกง 2 ช้อนโต๊ะ หอมเครื่องแกงเต็มที่ แต่เผ็ดเบาๆ', '2 tbsp paste. The full curry aroma with gentle heat.') },
    { label: l('เผ็ดกลาง', 'Medium spicy'), paste: 3, chili: 0, baht: 15, note: l('พริกแกง 3 ช้อนโต๊ะ ราว 1 ซอง 50 กรัม เผ็ดแบบร้านข้าวแกงทั่วไป', '3 tbsp paste, about one 50 g pack. As hot as a typical curry shop.') },
    { label: l('เผ็ดจัด', 'Very spicy'), paste: 3, chili: 5, baht: 17, note: l('พริกแกง 3 ช้อนโต๊ะ บวกพริกขี้หนูบุบ 5 เม็ด เผ็ดถึงใจ', "3 tbsp paste plus 5 crushed bird's eye chilies. Seriously hot.") },
  ];
  const ST = [
    { label: l('เข้มข้น', 'Rich'), milk: 500, water: 0, baht: 40, kcal: 610, note: l('กะทิ 2 กล่อง (500 มล.) ไม่ผสมน้ำ น้ำแกงข้นมัน หอมกะทิ', '2 boxes of coconut milk (500 ml), no water. A thick, creamy sauce.') },
    { label: l('น้ำแกงใส', 'Lighter'), milk: 250, water: 250, baht: 20, kcal: 520, note: l('กะทิ 1 กล่อง ผสมน้ำ 1 กล่อง เบาลงราว 90 แคลต่อจาน น้ำแกงใสกว่าแต่ยังหอม', '1 box of coconut milk plus 1 box of water. About 90 kcal lighter a plate, thinner but still fragrant.') },
  ];
  const sp = SP[o1] ?? SP[1], st = ST[o2] ?? ST[0], hot = sp.chili > 0;
  const lowSalt = adapt.includes('salt'), fish = fmt(lowSalt ? 0.5 : 1);
  const milk = st.water ? l(`กะทิ ${st.milk} มล. กับน้ำ ${st.water} มล.`, `${st.milk} ml coconut milk and ${st.water} ml water`) : l(`กะทิ ${st.milk} มล.`, `${st.milk} ml coconut milk`);
  const ingredients: Ingredient[] = [
    { id: 'chicken', name: l('สะโพกไก่ไม่มีกระดูก', 'Boneless chicken thigh'), q: 400, unit: U.g, baht: 60, why: l('สะโพกไม่แห้งเมื่อเคี่ยวและอุ่นซ้ำ เหมาะทำเก็บไว้กินหลายวัน', 'Thigh stays juicy through simmering and reheating, so it keeps for days') },
    { id: 'paste', name: l('พริกแกงเขียวหวาน', 'Green curry paste'), q: sp.paste, unit: U.tbsp, baht: sp.baht, why: l('พริกแกงสำเร็จรูปให้รสคงที่ทุกครั้ง ผัดกับหัวกะทิก่อนเพื่อปลุกกลิ่น', 'Ready-made paste tastes the same every time. Frying it in coconut cream wakes the aroma') },
    { id: 'coconut', name: l('กะทิกล่อง', 'Boxed coconut milk'), q: st.milk, unit: U.ml, baht: st.baht, why: l('ตักส่วนข้นด้านบนไว้ผัดพริกแกง ที่เหลือเป็นน้ำแกง', 'The thick top part fries the paste, the rest becomes the sauce') },
    { id: 'eggplant', name: l('มะเขือเปราะ', 'Thai eggplant'), q: 6, unit: U.piece, baht: 15, why: l('เนื้อมะเขือดูดน้ำแกงไว้ อุ่นวันต่อมาจะยิ่งอร่อย', 'It soaks up the sauce and tastes even better reheated') },
    { id: 'basil', name: l('ใบโหระพา', 'Thai basil'), q: 1, unit: U.handful, baht: 5, why: l('ใส่ตอนปิดไฟ กลิ่นหอมหวานจะไม่หาย', 'Added with the heat off so its sweet aroma stays') },
    { id: 'lime-leaf', name: l('ใบมะกรูด', 'Kaffir lime leaves'), q: 4, unit: U.leaf, baht: 3, why: l('ฉีกก่อนใส่ กลิ่นสดชื่นจะตัดความมันของกะทิ', 'Torn before adding, they give a fresh smell that cuts the coconut richness') },
    ...(hot ? [{ id: 'chili', name: l('พริกขี้หนู', "Bird's eye chili"), q: sp.chili, unit: U.chili, baht: 2, why: l('บุบแล้วผัดพร้อมพริกแกง เผ็ดจะกระจายทั่วหม้อ', 'Crushed and fried with the paste so the heat spreads through the pot') }] : []),
    { id: 'fish', name: l('น้ำปลา', 'Fish sauce'), q: lowSalt ? 0.5 : 1, unit: U.tbsp, baht: 2, why: lowSalt ? l('ลดลงครึ่งหนึ่งตามที่ขอ ชิมก่อนแล้วค่อยเติม', 'Halved as you asked. Taste before adding more') : l('พริกแกงเค็มอยู่แล้ว ใส่น้อยก่อนแล้วชิม', 'The paste is already salty, so start small and taste') },
    { id: 'sugar', name: l('น้ำตาลปี๊บหรือน้ำตาลทราย', 'Palm sugar or white sugar'), q: 1, unit: U.tbsp, baht: 2, why: l('หวานนิดๆ คือจุดเด่นของแกงเขียวหวาน ช่วยให้รสกลม', 'A touch of sweetness is what makes it green "sweet" curry, and it rounds out the salt') },
    { id: 'rice', name: l('ข้าวสวย', 'Cooked rice'), q: 4, unit: U.plates, baht: 28, why: l('แกงหม้อนี้พอดีกับข้าว 4 จาน', 'This pot is right for 4 plates of rice') },
  ];
  const steps: Step[] = [
    { id: 'gc-fridge', phase: 1, title: l('หยิบของออกมาให้ครบ', 'Get everything out'), do: l('หยิบของจริงออกมาวางให้ครบก่อนเปิดไฟ', 'Take everything out before you turn on the heat.'),
      gather: [l('สะโพกไก่ 400 กรัม', 'Chicken thigh, 400 g'), l(`พริกแกงเขียวหวาน ${sp.paste} ช้อนโต๊ะ`, `Green curry paste, ${sp.paste} tbsp`), milk, l('มะเขือเปราะ 6 ลูก', '6 Thai eggplants'), l('ใบโหระพา 1 กำมือ', '1 handful Thai basil'), l('ใบมะกรูด 4 ใบ', '4 kaffir lime leaves'), ...(hot ? [l(`พริกขี้หนู ${sp.chili} เม็ด`, `${sp.chili} bird's eye chilies`)] : []), l('น้ำปลา น้ำตาล', 'Fish sauce, sugar')],
      see: l('กล่องกะทิไม่บวม พริกแกงไม่มีกลิ่นหืน', 'Coconut boxes not swollen, paste does not smell stale'),
      why: l('หม้อนี้ได้ 4 จาน พอเริ่มผัดพริกแกงแล้วต้องคนตลอด จะไม่มีเวลาไปหาของ', 'This pot makes 4 plates. Once the paste is in you have to keep stirring, so there is no time to look for things.') },
    { id: 'gc-cut', phase: 1, title: l('หั่นไก่', 'Cut the chicken'), do: l('หั่นสะโพกไก่เป็นชิ้นพอคำ หนาราว 1 ข้อนิ้ว แล้วล้างมือกับเขียง', 'Cut the thighs into bite-size pieces about a finger joint thick, then wash your hands and the board.'),
      see: l('ชิ้นขนาดใกล้เคียงกัน', 'Pieces about the same size'),
      why: l('ชิ้นเท่ากันสุกพร้อมกัน ไม่มีชิ้นไหนแข็งหรือยังดิบ', 'Even pieces cook at the same pace, so none end up tough or raw.') },
    { id: 'gc-veg', phase: 1, title: l('เตรียมผัก', 'Prep the vegetables'),
      do: l(`ผ่ามะเขือเปราะเป็น 4 ส่วน แช่น้ำเกลือ ฉีกใบมะกรูดออกจากก้านกลาง เด็ดใบโหระพา${hot ? ` บุบพริกขี้หนู ${sp.chili} เม็ด` : ''}`, `Quarter the eggplants and drop them into salted water. Tear the lime leaves off the center stem and pick the basil leaves.${hot ? ` Crush ${sp.chili} chilies.` : ''}`),
      see: l('มะเขือจมน้ำ เนื้อยังขาว', 'Eggplant under water and still white'),
      why: l('น้ำเกลือกันมะเขือดำ ใบมะกรูดที่ฉีกจะส่งกลิ่นได้ดีกว่าทั้งใบ', 'Salted water stops the eggplant browning. Torn lime leaves give off more smell than whole ones.') },
    { id: 'gc-cream', phase: 2, heat: 1, timer: 180, title: l('เคี่ยวหัวกะทิ ไฟกลาง', 'Medium heat, simmer the cream'),
      do: l('เปิดเตาไฟกลาง ตักส่วนข้นด้านบนของกะทิราวครึ่งถ้วย (125 มล.) ใส่หม้อ คนเบาๆ เคี่ยวจนมันแยกตัว ราว 3 นาที', 'Stove on medium. Spoon the thick top of the coconut milk, about half a cup (125 ml), into the pot. Stir gently and simmer until the oil separates, about 3 minutes.'),
      see: l('มีน้ำมันใสลอยเป็นจุด กะทิเดือดปุดๆ และข้นขึ้น', 'Clear oil beading on top, the cream bubbling and thickening'),
      why: l('น้ำมันที่แยกออกมาใช้ผัดพริกแกงแทนน้ำมันพืช และทำให้แกงมีน้ำมันเขียวลอยหน้า', 'The separated oil fries the paste instead of cooking oil, and gives the curry its green sheen.') },
    { id: 'gc-paste', phase: 2, heat: 1, timer: 90, title: l('ผัดพริกแกง', 'Fry the paste'),
      do: l(`ใส่พริกแกง ${sp.paste} ช้อนโต๊ะ${hot ? 'กับพริกที่บุบไว้' : ''} ผัดกับหัวกะทิ คนตลอดราวนาทีครึ่ง อย่าให้ติดก้นหม้อ`, `Add ${sp.paste} tbsp paste${hot ? ' and the crushed chilies' : ''} and fry it in the cream, stirring all the time for about a minute and a half so it does not stick.`),
      see: l('หอมฉุนขึ้นจมูก มีน้ำมันสีเขียวลอยขึ้นมา', 'A strong curry smell and green oil rising'),
      why: l('ผัดให้สุกก่อนจะปลุกกลิ่นเครื่องแกง พริกแกงดิบรสแบน', 'Frying cooks the paste and wakes up the spices. Raw paste tastes flat.') },
    { id: 'gc-chicken', phase: 3, heat: 1, timer: 120, title: l('ใส่ไก่', 'Add the chicken'),
      do: l('ใส่ไก่ลงไปคลุกกับพริกแกงให้ทั่ว ผัดจนผิวไก่ขาวขุ่น ราว 2 นาที', 'Add the chicken and toss it in the paste until coated. Cook until the outside turns white, about 2 minutes.'),
      see: l('ผิวไก่ไม่เหลือสีชมพู', 'No pink left on the outside'),
      why: l('คลุกพริกแกงก่อนเติมกะทิ รสจะเกาะเนื้อไก่ ไม่ลอยอยู่แค่ในน้ำแกง', 'Coating it before the liquid goes in makes the flavor stick to the chicken, not just float in the sauce.') },
    { id: 'gc-simmer', phase: 4, heat: 1, timer: 480, title: l('เติมกะทิ ใส่มะเขือ', 'Add the coconut milk and eggplant'),
      do: l(`เท${st.water ? `กะทิที่เหลือกับน้ำ ${st.water} มล.` : 'กะทิที่เหลือ'} ใส่ใบมะกรูด พอเริ่มเดือดใส่มะเขือที่สะเด็ดน้ำแล้ว เคี่ยวไฟกลางราว 8 นาทีจนมะเขือนิ่ม`, `Pour in the rest of the coconut milk${st.water ? ` and ${st.water} ml water` : ''} and add the lime leaves. When it starts to boil, add the drained eggplant and simmer on medium about 8 minutes until the eggplant is soft.`),
      see: l('เดือดเบาๆ ไม่เดือดพล่าน จิ้มมะเขือด้วยส้อมแล้วเข้าง่าย', 'Gentle bubbles, not a rolling boil. A fork goes into the eggplant easily'),
      why: l('กะทิที่เดือดแรงจะแตกเป็นเม็ด เคี่ยวเบาๆ ไก่จะนุ่มและมะเขือดูดน้ำแกง', 'Coconut milk boiled hard splits and turns grainy. A gentle simmer keeps the chicken tender while the eggplant soaks up the sauce.') },
    { id: 'gc-season', phase: 4, heat: 1, timer: 30, title: l('ปรุงรส', 'Season'),
      do: l(`ใส่น้ำปลา${fish.th} ช้อนโต๊ะ น้ำตาล 1 ช้อนโต๊ะ คนให้ละลาย แล้วชิม`, `Add ${fish.en} tbsp fish sauce and 1 tbsp sugar, stir until dissolved, then taste.`),
      see: l('เค็มนำ หวานตาม แล้วเผ็ดปลายลิ้น', 'Salty first, then sweet, then heat at the end'),
      why: lowSalt ? l('สูตรนี้ลดเค็มไว้ พริกแกงเค็มอยู่แล้ว ชิมก่อนแล้วค่อยเติม', 'This version is less salty. The paste is salty already, so taste before adding more.') : l('พริกแกงเค็มอยู่แล้ว ปรุงตอนท้ายจะได้ไม่เค็มเกิน', 'The paste is already salty, so seasoning last keeps it from getting too salty.'),
      gather: [l('น้ำปลา', 'Fish sauce'), l('น้ำตาล', 'Sugar')] },
    { id: 'gc-basil', phase: 5, heat: 0, timer: 10, title: l('ปิดไฟ ใส่โหระพา', 'Heat off, add the basil'),
      do: l('ปิดเตา ใส่ใบโหระพา คนครั้งเดียวให้จมน้ำแกง', 'Turn off the stove, add the basil and stir once so it sinks into the curry.'),
      see: l('ใบสลดแต่ยังเขียว', 'Leaves wilted but still green'),
      why: l('ความร้อนในหม้อพอให้ใบสลด กลิ่นหอมหวานจะยังอยู่', 'The heat in the pot is enough to wilt them while keeping the sweet smell.') },
    { id: 'gc-store', phase: 5, title: l('ตักกิน แล้วเก็บส่วนที่เหลือ', 'Serve, then store the rest'),
      do: l('ตักราดข้าวกินได้เลย ส่วนที่เหลือพักให้เย็นภายใน 1 ชั่วโมง แบ่งใส่กล่องปิดฝา แล้วเข้าตู้เย็น', 'Serve over rice. Let the rest cool within an hour, portion it into lidded boxes and refrigerate.'),
      see: l('แบ่งกล่องละ 1 จาน', 'One plate per box'),
      why: l('เก็บในตู้เย็นได้ 3 วัน อุ่นให้เดือดทั่วก่อนกินทุกครั้ง พักให้เย็นเร็วและอุ่นให้ร้อนจัดช่วยกันอาหารบูด', 'It keeps 3 days in the fridge. Reheat until it boils every time: cooling fast and reheating hot keeps it safe.') },
  ];
  return {
    id: 'green-curry', name: l('แกงเขียวหวานไก่ (4 จาน)', 'Green curry chicken (serves 4)'), img: 'dish-green-curry', mins: 35, phases: 5, kcal: st.kcal,
    g1: { title: l('ความเผ็ด', 'Spiciness'), opts: SP }, g2: { title: l('น้ำแกง', 'Sauce'), opts: ST },
    adapts: [{ id: 'salt', label: l('ลดเค็ม', 'Less salty') }],
    adaptNotes: lowSalt ? [l('ลดน้ำปลาเหลือครึ่งช้อนโต๊ะ ชิมก่อนแล้วค่อยเติม', 'Fish sauce cut to half a tbsp. Taste, then add more if needed.')] : [],
    ingredients, steps, qa,
    senses: [
      { label: l('รสชาติ', 'Taste'), options: SALT, good: l('เค็มหวานมัน แล้วเผ็ดตาม', 'Salty, sweet and creamy, with heat after'), tips: [l('ครั้งหน้าเติมน้ำปลาอีกครึ่งช้อนโต๊ะตอนปรุง', 'Next time add half a tbsp more fish sauce when seasoning'), l('ครั้งหน้าลดน้ำปลา หรือเติมกะทิช่วยให้เค็มน้อยลง', 'Next time use less fish sauce, or add a splash of coconut milk to soften it')] },
      { label: l('กลิ่น', 'Aroma'), options: [l('ยังไม่หอมเครื่องแกง', 'No curry aroma yet'), l('หอมพริกแกงกับโหระพา', 'Smells of curry paste and basil'), l('มีกลิ่นไหม้', 'Smells burnt')], good: l('หอมพริกแกงผัดกะทิ', 'Fragrant fried paste and coconut'), tips: [l('ครั้งหน้าผัดพริกแกงกับหัวกะทินานขึ้นจนหอมฉุน', 'Next time fry the paste in the cream longer, until it smells strong'), l('ครั้งหน้าหรี่ไฟตอนผัดพริกแกง และคนตลอด', 'Next time lower the heat while frying the paste and keep stirring')] },
      { label: l('หน้าตา', 'Look'), options: [l('กะทิแตกเป็นเม็ด', 'Split and grainy'), l('น้ำแกงเนียน มีน้ำมันเขียวลอย', 'Smooth, with green oil on top'), l('ซีด ไม่มีสี', 'Pale, no color')], good: l('น้ำแกงเนียน สีเขียวนวล', 'A smooth, soft green sauce'), tips: [l('ครั้งหน้าเคี่ยวไฟกลางค่อนอ่อน อย่าให้เดือดพล่าน', 'Next time simmer gently, never a rolling boil'), l('ครั้งหน้าเคี่ยวหัวกะทิจนแตกมันก่อนใส่พริกแกง', 'Next time simmer the cream until the oil separates before adding the paste')] },
    ],
  };
}

// พะโล้เก็บได้ 4 วันและอร่อยขึ้นในวันรุ่งขึ้น เป็นจานแรกของแผนวันอาทิตย์เพราะเคี่ยวนานที่สุด
function mooPalo(o1: number, o2: number, adapt: string[]): Recipe {
  const MEAT = [
    { label: l('หมูสามชั้น', 'Pork belly'), id: 'pork-belly', img: 'pork' as ImgKey, q: 500, baht: 110, simmer: 40, kcal: 620, note: l('มันแทรกเนื้อ เคี่ยวแล้วนุ่มละลายในปาก แบบพะโล้ร้านข้าวแกง', 'The fat between the layers turns meltingly soft, like the curry-shop version.') },
    { label: l('หมูสันคอ', 'Pork collar'), id: 'pork-collar', img: 'pork' as ImgKey, q: 500, baht: 95, simmer: 40, kcal: 540, note: l('มันน้อยกว่าสามชั้น แต่เนื้อยังนุ่มชุ่ม และถูกกว่าเล็กน้อย', 'Leaner than belly but still juicy, and a little cheaper.') },
    { label: l('น่องไก่', 'Chicken drumsticks'), id: 'drumstick', img: 'chicken' as ImgKey, q: 700, baht: 70, simmer: 25, kcal: 520, note: l('ไม่กินหมูก็ทำได้ ราว 6 น่อง เคี่ยวสั้นกว่า 15 นาที', 'No pork needed. About 6 drumsticks, and 15 minutes less simmering.') },
  ];
  const SWEET = [
    { label: l('หวานนำ', 'Sweeter'), sugar: 3, note: l('น้ำตาลปี๊บ 3 ช้อนโต๊ะ หวานเค็มแบบพะโล้ร้านข้าวแกง', '3 tbsp palm sugar. Sweet and salty, like a curry shop.') },
    { label: l('หวานน้อย', 'Less sweet'), sugar: 1.5, note: l('น้ำตาลปี๊บ 1 ช้อนโต๊ะครึ่ง เค็มนำ กลิ่นเครื่องพะโล้ชัดขึ้น', '1½ tbsp palm sugar. Saltier, and the five-spice comes through more.') },
  ];
  const m = MEAT[o1] ?? MEAT[1], sw = SWEET[o2] ?? SWEET[0], chicken = m.id === 'drumstick';
  const lowSalt = adapt.includes('salt'), soy = lowSalt ? 1.5 : 3;
  const ingredients: Ingredient[] = [
    { id: m.id, img: m.img, name: m.label, q: m.q, unit: U.g, baht: m.baht, why: chicken ? l('ทั้งน่อง เคี่ยวแล้วเนื้อนุ่มหลุดกระดูก', 'Whole drumsticks simmer until the meat falls off the bone') : l('หั่นชิ้นใหญ่ราว 3 ซม. เคี่ยวนานแล้วไม่เปื่อยยุ่ย', 'Large 3 cm chunks hold together through the long simmer') },
    { id: 'egg', name: l('ไข่ไก่', 'Eggs'), q: 6, unit: U.egg, baht: 30, why: l('ต้มก่อนแล้วเคี่ยวในน้ำพะโล้ ไข่จะดูดสีและรสจนเข้าเนื้อ', 'Boiled first, then simmered so they soak up the color and flavor') },
    { id: 'garlic', name: l('กระเทียม', 'Garlic'), q: 6, unit: U.clove, baht: 3, why: l('ตำกับรากผักชีและพริกไทยเป็นสามเกลอ คือกลิ่นหลักของพะโล้', 'Pounded with coriander root and pepper, the classic base of the braise') },
    { id: 'coriander-root', name: l('รากผักชี', 'Coriander root'), q: 2, unit: U.root, baht: 3, why: l('ให้กลิ่นหอมลึก ถ้าไม่มีใช้ก้านผักชีแทนได้', 'A deep aroma. Coriander stems work if you have no roots') },
    { id: 'pepper', name: l('พริกไทยขาวเม็ด', 'White peppercorns'), q: 1, unit: U.tsp, baht: 2, why: l('เผ็ดร้อนอุ่นๆ ช่วยตัดความหวาน', 'A warm heat that balances the sweetness') },
    { id: 'five-spice', name: l('ผงพะโล้', 'Five-spice powder'), q: 1, unit: U.tbsp, baht: 5, why: l('กลิ่นอบเชยกับโป๊ยกั๊กที่เป็นเอกลักษณ์ของพะโล้', 'The cinnamon and star anise smell that makes it palo') },
    { id: 'sugar', name: l('น้ำตาลปี๊บ', 'Palm sugar'), q: sw.sugar, unit: U.tbsp, baht: 4, why: l('เคี่ยวเป็นคาราเมลก่อน ให้สีน้ำตาลสวยและหวานหอม', 'Caramelized first for the brown color and a toasty sweetness') },
    { id: 'dark-soy', img: 'soy-sauce', name: l('ซีอิ๊วดำ', 'Dark soy sauce'), q: 1, unit: U.tbsp, baht: 3, why: l('ช่วยให้สีเข้มขึ้น ไม่ได้เค็มมาก', 'Deepens the color without much salt') },
    { id: 'soy-sauce', name: l('ซีอิ๊วขาว', 'Light soy sauce'), q: soy, unit: U.tbsp, baht: 3, why: lowSalt ? l('ลดลงครึ่งหนึ่งตามที่ขอ ชิมก่อนแล้วค่อยเติม', 'Halved as you asked. Taste before adding more') : l('รสเค็มหลักของน้ำพะโล้', 'The main saltiness of the broth') },
    { id: 'oil', name: l('น้ำมันพืช', 'Vegetable oil'), q: 1, unit: U.tbsp, baht: 1, why: l('แค่พอเคี่ยวน้ำตาลไม่ให้ติดหม้อ', 'Just enough to melt the sugar without sticking') },
    { id: 'rice', name: l('ข้าวสวย', 'Cooked rice'), q: 4, unit: U.plates, baht: 28, why: l('พะโล้หม้อนี้พอดีกับข้าว 4 จาน', 'This pot is right for 4 plates of rice') },
  ];
  const meat = chicken ? l('น่องไก่', 'drumsticks') : l('หมู', 'pork');
  const steps: Step[] = [
    { id: 'mp-fridge', phase: 1, title: l('หยิบของออกมาให้ครบ', 'Get everything out'), do: l('หยิบของจริงออกมาวางให้ครบก่อนเปิดไฟ', 'Take everything out before you turn on the heat.'),
      gather: [l(`${m.label.th} ${m.q} กรัม`, `${m.label.en}, ${m.q} g`), l('ไข่ 6 ฟอง', '6 eggs'), l('กระเทียม 6 กลีบ', '6 garlic cloves'), l('รากผักชี 2 ราก', '2 coriander roots'), l('พริกไทยขาวเม็ด 1 ช้อนชา', '1 tsp white peppercorns'), l('ผงพะโล้ 1 ช้อนโต๊ะ', '1 tbsp five-spice powder'), l(`น้ำตาลปี๊บ ${sw.sugar} ช้อนโต๊ะ`, `${sw.sugar} tbsp palm sugar`), l('ซีอิ๊วดำ ซีอิ๊วขาว น้ำเปล่า 1 ลิตร', 'Dark and light soy sauce, 1 litre water')],
      see: l('เนื้อสด ไข่ไม่ร้าว', 'Fresh meat, no cracked eggs'),
      why: l('พอน้ำตาลเป็นคาราเมลแล้ว ทุกอย่างต้องลงหม้อต่อกันเร็ว', 'Once the sugar caramelizes, everything goes in quickly.') },
    { id: 'mp-eggs', phase: 1, heat: 2, timer: 480, title: l('ต้มไข่', 'Boil the eggs'), do: l('ต้มน้ำให้เดือด ค่อยๆ ใส่ไข่ ต้ม 8 นาที แล้วแช่น้ำเย็นและปอกเปลือก', 'Bring water to a boil, lower in the eggs, boil 8 minutes, then cool them in cold water and peel.'),
      see: l('ไข่ขาวเรียบ ปอกง่าย', 'Smooth whites that peel easily'),
      why: l('แช่น้ำเย็นทันทีทำให้ปอกง่าย และไข่แดงไม่เป็นวงสีเขียว', 'Cooling right away makes them peel easily and stops a green ring round the yolk.') },
    { id: 'mp-cut', phase: 1, title: chicken ? l('เตรียมน่องไก่', 'Prep the drumsticks') : l('หั่นหมู', 'Cut the pork'),
      do: chicken ? l('ล้างน่องไก่แล้วซับให้แห้ง ไม่ต้องหั่น แล้วล้างมือกับเขียง', 'Rinse the drumsticks and pat them dry; no cutting needed. Then wash your hands and the board.') : l('หั่นหมูเป็นชิ้นใหญ่ราว 3 ซม. แล้วล้างมือกับเขียง', 'Cut the pork into large pieces, about 3 cm, then wash your hands and the board.'),
      see: l('ชิ้นขนาดใกล้เคียงกัน', 'Pieces about the same size'),
      why: l('ชิ้นใหญ่ไม่เปื่อยยุ่ยตอนเคี่ยวนาน และสุกพร้อมกัน', 'Big, even pieces hold together through a long simmer and cook at the same pace.') },
    { id: 'mp-pound', phase: 1, title: l('ตำสามเกลอ', 'Pound the garlic trio'), do: l('ตำกระเทียม รากผักชี และพริกไทยพอแหลกหยาบ', 'Pound the garlic, coriander root and pepper to a rough paste.'),
      see: l('หยาบๆ ยังเห็นชิ้นกระเทียม', 'Rough, with bits of garlic still visible'),
      why: l('สามเกลอคือกลิ่นหลักของพะโล้ ตำหยาบกลิ่นจะค่อยๆ ออกตลอดการเคี่ยว', 'This trio is the base aroma. A rough pound releases it slowly through the simmer.') },
    { id: 'mp-caramel', phase: 2, heat: 1, timer: 120, title: l('เคี่ยวน้ำตาล ไฟกลาง', 'Medium heat, caramelize the sugar'),
      do: l(`ตั้งหม้อไฟกลาง ใส่น้ำมัน 1 ช้อนโต๊ะกับน้ำตาลปี๊บ ${sw.sugar} ช้อนโต๊ะ คนจนละลายเป็นคาราเมลสีน้ำตาลทอง`, `Pot on medium heat. Add 1 tbsp oil and ${sw.sugar} tbsp palm sugar and stir until it melts into a golden-brown caramel.`),
      see: l('สีน้ำตาลทอง หอมคาราเมล ไม่ดำ', 'Golden brown and smelling of caramel, not black'),
      why: l('คาราเมลให้สีพะโล้ที่สวยและหวานหอม ถ้าไหม้ดำจะขมทั้งหม้อ', 'The caramel gives the braise its color and a toasty sweetness. Burnt black, it turns the whole pot bitter.') },
    { id: 'mp-aroma', phase: 2, heat: 1, timer: 30, title: l('ผัดสามเกลอกับผงพะโล้', 'Fry the garlic trio and five-spice'), do: l('ใส่สามเกลอกับผงพะโล้ ผัดราว 30 วินาทีจนหอม', 'Add the pounded trio and five-spice and fry about 30 seconds until fragrant.'),
      see: l('หอมกระเทียมและเครื่องพะโล้', 'Smells of garlic and five-spice'),
      why: l('ผัดในคาราเมลให้กลิ่นออกก่อนเติมน้ำ', 'Frying in the caramel brings out the aroma before the liquid goes in.') },
    { id: 'mp-sear', phase: 3, heat: 1, timer: 180, title: l(`ใส่${meat.th}`, `Add the ${meat.en}`), do: l(`ใส่${meat.th}ลงไปคลุกกับคาราเมลให้ทั่ว ผัดราว 3 นาทีจนผิวเป็นสีน้ำตาล`, `Add the ${meat.en} and toss it in the caramel. Cook about 3 minutes until browned.`),
      see: l('เนื้อเคลือบสีน้ำตาลทั่วชิ้น', 'The meat coated brown all over'),
      why: l('เคลือบก่อนเติมน้ำ สีและรสจะเข้าเนื้อ', 'Coating it before the water goes in locks the color and flavor into the meat.') },
    { id: 'mp-braise', phase: 4, timer: m.simmer * 60, title: l('เติมน้ำ เคี่ยวไฟอ่อน', 'Add water, simmer low'),
      do: l(`เติมน้ำ 1 ลิตร ซีอิ๊วดำ 1 ช้อนโต๊ะ ซีอิ๊วขาว ${soy} ช้อนโต๊ะ ใส่ไข่ พอเดือดหรี่ไฟอ่อนที่สุด ปิดฝา เคี่ยวราว ${m.simmer} นาที ช้อนฟองทิ้ง`, `Add 1 litre water, 1 tbsp dark soy sauce, ${soy} tbsp light soy sauce and the eggs. When it boils, turn the heat to the lowest, cover and simmer about ${m.simmer} minutes, skimming off the foam.`),
      see: l('เดือดเบาๆ ใต้ฝา น้ำพะโล้สีน้ำตาลใส', 'A gentle bubble under the lid and a clear brown broth'),
      why: l('ไฟอ่อนนานๆ ทำให้เนื้อนุ่ม ช้อนฟองทิ้งให้น้ำใสและไม่คาว', 'A long, gentle simmer makes the meat tender. Skimming keeps the broth clear and clean-tasting.') },
    { id: 'mp-taste', phase: 4, title: l('ชิมแล้วปรับรส', 'Taste and adjust'), do: l('ชิมน้ำพะโล้ เค็มไปเติมน้ำ หวานไปเติมซีอิ๊วขาวทีละช้อนชา', 'Taste the broth. Too salty: add water. Too sweet: add light soy sauce a teaspoon at a time.'),
      see: l('หวานเค็มกลมกล่อม เอาส้อมจิ้มเนื้อแล้วเข้าง่าย', 'Sweet and salty in balance, and a fork goes into the meat easily'),
      why: lowSalt ? l('สูตรนี้ลดเค็มไว้ น้ำพะโล้จะเค็มขึ้นเมื่องวด ชิมก่อนแล้วค่อยเติม', 'This version is less salty. The broth gets saltier as it reduces, so taste before adding.') : l('น้ำพะโล้จะเค็มขึ้นเมื่อเก็บไว้และงวดลง ปรุงให้อ่อนกว่าที่ชอบนิดหน่อย', 'The broth gets saltier as it keeps and reduces, so season it a little lighter than you like.'),
      gather: [l('ซีอิ๊วขาว', 'Light soy sauce'), l('น้ำเปล่า', 'Water')] },
    { id: 'mp-store', phase: 5, title: l('ตักกิน แล้วเก็บส่วนที่เหลือ', 'Serve, then store the rest'), do: l('ตักกินกับข้าว ส่วนที่เหลือพักให้เย็นภายใน 1 ชั่วโมง แบ่งใส่กล่องปิดฝา แล้วเข้าตู้เย็น', 'Serve with rice. Cool the rest within an hour, portion it into lidded boxes and refrigerate.'),
      see: l('แบ่งกล่องละ 1 มื้อ ใส่ไข่กล่องละลูก', 'One meal per box, an egg in each'),
      why: l('เก็บได้ 4 วัน และอร่อยขึ้นในวันรุ่งขึ้น อุ่นให้เดือดทุกครั้งก่อนกิน', 'It keeps 4 days and tastes better the next day. Reheat until it boils every time.') },
  ];
  return {
    id: 'moo-palo', name: chicken ? l('ไก่พะโล้ไข่ (4 จาน)', 'Five-spice chicken & eggs (serves 4)') : l('หมูพะโล้ไข่ (4 จาน)', 'Five-spice pork & eggs (serves 4)'), img: 'dish-moo-palo', mins: m.simmer + 25, phases: 5, kcal: m.kcal,
    g1: { title: l('เนื้อสัตว์', 'Meat'), opts: MEAT }, g2: { title: l('รสชาติ', 'Flavor'), opts: SWEET },
    adapts: [{ id: 'salt', label: l('ลดเค็ม', 'Less salty') }],
    adaptNotes: lowSalt ? [l('ลดซีอิ๊วขาวเหลือ 1 ช้อนโต๊ะครึ่ง ชิมก่อนแล้วค่อยเติม', 'Light soy sauce cut to 1½ tbsp. Taste, then add more if needed.')] : [],
    ingredients, steps, qa,
    senses: [
      { label: l('รสชาติ', 'Taste'), options: SALT, good: l('หวานเค็มกลมกล่อม หอมเครื่องพะโล้', 'Sweet and salty in balance, with five-spice'), tips: [l('ครั้งหน้าเติมซีอิ๊วขาวอีก 1 ช้อนโต๊ะ', 'Next time add 1 tbsp more light soy sauce'), l('ครั้งหน้าลดซีอิ๊วขาว หรือเติมน้ำตอนเคี่ยว', 'Next time use less light soy sauce, or add water while it simmers')] },
      { label: l('กลิ่น', 'Aroma'), options: [l('ยังไม่หอมเครื่องพะโล้', 'No five-spice smell yet'), l('หอมเครื่องพะโล้', 'Smells of five-spice'), l('มีกลิ่นไหม้ขม', 'Smells burnt and bitter')], good: l('หอมพะโล้และกระเทียม', 'Five-spice and garlic'), tips: [l('ครั้งหน้าเพิ่มผงพะโล้อีกครึ่งช้อนโต๊ะ', 'Next time add half a tbsp more five-spice'), l('ครั้งหน้าเคี่ยวน้ำตาลไฟอ่อนลง และไปต่อทันทีที่เป็นสีทอง', 'Next time melt the sugar on lower heat and move on as soon as it turns golden')] },
      { label: l('หน้าตา', 'Look'), options: [l('ซีด สีอ่อน', 'Pale'), l('น้ำตาลเข้มเงา ไข่สีน้ำตาลทั่วลูก', 'Glossy deep brown, eggs brown all over'), l('ดำ ขม', 'Black and bitter')], good: l('สีน้ำตาลเงา', 'A glossy brown'), tips: [l('ครั้งหน้าเคี่ยวคาราเมลให้เข้มขึ้น หรือเพิ่มซีอิ๊วดำ', 'Next time take the caramel darker or add more dark soy sauce'), l('ครั้งหน้าลดซีอิ๊วดำ และเคี่ยวคาราเมลแค่สีทอง', 'Next time use less dark soy sauce and stop the caramel at golden')] },
    ],
  };
}

// ผัดพริกขิงไม่มีน้ำแกง เก็บได้ 3 วัน เป็นจานสุดท้ายของแผนวันอาทิตย์เพราะเร็วที่สุด
function prikKhing(o1: number, o2: number, adapt: string[]): Recipe {
  const SP = [
    { label: l('เผ็ดน้อย', 'Mild'), paste: 2, baht: 10, note: l('พริกแกงเผ็ด 2 ช้อนโต๊ะ หอมเครื่องแกง เผ็ดเบาๆ', '2 tbsp red curry paste. Aromatic with gentle heat.') },
    { label: l('เผ็ดกลาง', 'Medium spicy'), paste: 3, baht: 15, note: l('พริกแกงเผ็ด 3 ช้อนโต๊ะ เผ็ดแบบร้านข้าวแกงทั่วไป', '3 tbsp red curry paste. As hot as a typical curry shop.') },
    { label: l('เผ็ดจัด', 'Very spicy'), paste: 4, baht: 20, note: l('พริกแกงเผ็ด 4 ช้อนโต๊ะ เผ็ดเข้มทุกคำ', '4 tbsp red curry paste. Hot in every bite.') },
  ];
  const MEAT = [
    { label: l('หมูสับ', 'Minced pork'), id: 'pork', img: 'pork' as ImgKey, baht: 60, kcal: 520, note: l('สุกเร็ว เครื่องแกงเกาะทั่วทุกเม็ด', 'Cooks fast and the paste clings to every bit.') },
    { label: l('หมูสันนอก', 'Pork loin'), id: 'pork-loin', img: 'pork' as ImgKey, baht: 70, kcal: 480, note: l('หั่นเส้นบางๆ ได้ชิ้นหมูให้เคี้ยว', 'Sliced thin, for proper bites of pork.') },
    { label: l('อกไก่', 'Chicken breast'), id: 'chicken-breast', img: 'chicken' as ImgKey, baht: 45, kcal: 430, note: l('ไม่กินหมูก็ทำได้ ไขมันน้อยกว่า ผัดแค่พอสุกจะไม่แข็ง', 'No pork needed, and leaner. Cook just until done so it stays tender.') },
  ];
  const sp = SP[o1] ?? SP[1], m = MEAT[o2] ?? MEAT[0], minced = m.id === 'pork', chicken = m.id === 'chicken-breast';
  const lowSalt = adapt.includes('salt'), fish = fmt(lowSalt ? 0.5 : 1);
  const ingredients: Ingredient[] = [
    { id: m.id, img: m.img, name: m.label, q: 300, unit: U.g, baht: m.baht, why: l('ปริมาณนี้ผัดในกระทะใบเดียวได้ไม่แน่นเกินไป', 'This much fits one wok without crowding') },
    { id: 'long-bean', name: l('ถั่วฝักยาว', 'Long beans'), q: 300, unit: U.g, baht: 25, why: l('ผัดแค่พอสุกยังกรอบ และเก็บได้หลายวันกว่าผักใบ', 'Cooked just tender-crisp, and it keeps longer than leafy greens') },
    { id: 'red-paste', name: l('พริกแกงเผ็ด', 'Red curry paste'), q: sp.paste, unit: U.tbsp, baht: sp.baht, why: l('พริกขิงคือพริกแกงผัดน้ำมันจนหอมแห้ง ไม่ใส่กะทิ', 'Prik khing is curry paste fried in oil until dry and fragrant, no coconut milk') },
    { id: 'lime-leaf', name: l('ใบมะกรูด', 'Kaffir lime leaves'), q: 6, unit: U.leaf, baht: 4, why: l('ซอยเป็นเส้นฝอย กลิ่นหอมสดคือเอกลักษณ์ของพริกขิง', 'Shredded fine, their fresh smell is the signature of prik khing') },
    { id: 'oil', name: l('น้ำมันพืช', 'Vegetable oil'), q: 2, unit: U.tbsp, baht: 2, why: l('พอให้พริกแกงไม่ติดกระทะ', 'Enough to fry the paste without sticking') },
    { id: 'fish', name: l('น้ำปลา', 'Fish sauce'), q: lowSalt ? 0.5 : 1, unit: U.tbsp, baht: 2, why: lowSalt ? l('ลดลงครึ่งหนึ่งตามที่ขอ ชิมก่อนแล้วค่อยเติม', 'Halved as you asked. Taste before adding more') : l('พริกแกงเค็มอยู่แล้ว ใส่น้อยก่อนแล้วชิม', 'The paste is already salty, so start small and taste') },
    { id: 'sugar', name: l('น้ำตาลปี๊บหรือน้ำตาลทราย', 'Palm sugar or white sugar'), q: 1.5, unit: U.tbsp, baht: 2, why: l('พริกขิงต้องหวานนำนิดๆ ช่วยตัดความเผ็ด', 'Prik khing leans a little sweet to balance the heat') },
    { id: 'rice', name: l('ข้าวสวย', 'Cooked rice'), q: 4, unit: U.plates, baht: 28, why: l('ผัดกระทะนี้พอดีกับข้าว 4 จาน', 'This wok is right for 4 plates of rice') },
  ];
  const steps: Step[] = [
    { id: 'pk-fridge', phase: 1, title: l('หยิบของออกมาให้ครบ', 'Get everything out'), do: l('หยิบของจริงออกมาวางให้ครบก่อนเปิดไฟ', 'Take everything out before you turn on the heat.'),
      gather: [l(`${m.label.th} 300 กรัม`, `${m.label.en}, 300 g`), l('ถั่วฝักยาว 300 กรัม', 'Long beans, 300 g'), l(`พริกแกงเผ็ด ${sp.paste} ช้อนโต๊ะ`, `Red curry paste, ${sp.paste} tbsp`), l('ใบมะกรูด 6 ใบ', '6 kaffir lime leaves'), l('น้ำมัน น้ำปลา น้ำตาล', 'Oil, fish sauce, sugar')],
      see: l('ถั่วสีเขียวสด หักแล้วดังกรอบ', 'Bright green beans that snap'),
      why: l('ผัดจานนี้ใช้เวลาราว 10 นาที เตรียมของครบก่อนพริกแกงจะได้ไม่ไหม้', 'The stir-fry takes about 10 minutes, so have everything ready or the paste burns.') },
    { id: 'pk-cut', phase: 1, title: l('หั่นถั่วและใบมะกรูด', 'Cut the beans and lime leaves'),
      do: l(`หั่นถั่วฝักยาวยาวราว 4 ซม.${minced ? '' : ' หั่นเนื้อเป็นเส้นบางๆ'} แล้วม้วนใบมะกรูดซอยเป็นเส้นฝอย`, `Cut the beans about 4 cm long.${minced ? '' : ' Slice the meat into thin strips.'} Roll up the lime leaves and shred them fine.`),
      see: l('ใบมะกรูดฝอยเท่าเส้นด้าย', 'Lime leaves shredded thread-thin'),
      why: l('ใบมะกรูดฝอยกระจายกลิ่นทั่วจาน และไม่แข็งเวลาเคี้ยว', 'Fine shreds spread the smell through the dish and are not tough to chew.') },
    { id: 'pk-paste', phase: 2, heat: 1, timer: 60, title: l('ผัดพริกแกง ไฟกลาง', 'Medium heat, fry the paste'),
      do: l(`เปิดไฟกลาง ใส่น้ำมัน 2 ช้อนโต๊ะ แล้วใส่พริกแกง ${sp.paste} ช้อนโต๊ะ ผัดราว 1 นาทีจนหอมและน้ำมันเป็นสีแดง`, `Medium heat, 2 tbsp oil, then ${sp.paste} tbsp paste. Fry about a minute until fragrant and the oil turns red.`),
      see: l('น้ำมันสีแดงส้ม หอมฉุน', 'Red-orange oil and a strong smell'),
      why: l('ผัดพริกแกงในน้ำมันให้สุกก่อน กลิ่นจะหอมและรสไม่ดิบ', 'Frying the paste first cooks out the raw taste and wakes the aroma.') },
    { id: 'pk-meat', phase: 3, heat: 2, timer: chicken ? 150 : 180, title: l('เร่งไฟแรง ใส่เนื้อ', 'High heat, add the meat'),
      do: l(`เร่งไฟแรง ใส่${m.label.th} ผัดคลุกกับพริกแกงจนสุกทั่ว ราว ${chicken ? '2 นาทีครึ่ง' : '3 นาที'}`, `Turn to high heat, add the ${m.label.en.toLowerCase()} and toss it in the paste until cooked through, about ${chicken ? '2½' : '3'} minutes.`),
      see: l('ไม่เหลือสีชมพู เครื่องแกงเกาะเนื้อ', 'No pink left, the paste clinging to the meat'),
      why: l('ไฟแรงทำให้เนื้อไม่ออกน้ำ เครื่องแกงจะเกาะแห้งหอม', 'High heat keeps the meat from going watery, so the paste clings dry and fragrant.') },
    { id: 'pk-beans', phase: 3, heat: 2, timer: 240, title: l('ใส่ถั่วฝักยาว', 'Add the long beans'),
      do: l('ใส่ถั่วฝักยาวกับน้ำ 3 ช้อนโต๊ะ ผัดราว 4 นาทีจนถั่วเขียวสดและยังกรอบ', 'Add the beans and 3 tbsp water and stir-fry about 4 minutes until bright green and still crisp.'),
      see: l('ถั่วสีเขียวสด กัดแล้วยังกรอบนิดๆ', 'Bright green beans with a little bite left'),
      why: l('น้ำเล็กน้อยช่วยให้ถั่วสุกโดยพริกแกงไม่ไหม้ อย่าผัดนานจนถั่วเหี่ยว เพราะจะอุ่นซ้ำอีก', 'A little water cooks the beans without burning the paste. Do not overcook them: they get reheated later.') },
    { id: 'pk-season', phase: 4, heat: 2, timer: 30, title: l('ปรุงรส', 'Season'),
      do: l(`ใส่น้ำปลา${fish.th} ช้อนโต๊ะ น้ำตาล 1 ช้อนโต๊ะครึ่ง ผัดให้เข้ากันแล้วชิม`, `Add ${fish.en} tbsp fish sauce and 1½ tbsp sugar, toss and taste.`),
      see: l('หวานนำ เค็มตาม และเผ็ดหอม', 'Sweet first, then salty, with a fragrant heat'),
      why: lowSalt ? l('สูตรนี้ลดเค็มไว้ พริกแกงเค็มอยู่แล้ว ชิมก่อนแล้วค่อยเติม', 'This version is less salty. The paste is salty already, so taste before adding more.') : l('พริกแกงเค็มอยู่แล้ว ปรุงตอนท้ายจะได้ไม่เค็มเกิน', 'The paste is already salty, so seasoning last keeps it from getting too salty.'),
      gather: [l('น้ำปลา', 'Fish sauce'), l('น้ำตาล', 'Sugar')] },
    { id: 'pk-leaves', phase: 5, heat: 0, timer: 10, title: l('ปิดไฟ ใส่ใบมะกรูด', 'Heat off, add the lime leaves'), do: l('ปิดไฟ ใส่ใบมะกรูดฝอย คลุกให้ทั่ว', 'Turn off the heat, add the shredded lime leaves and toss.'),
      see: l('กลิ่นมะกรูดหอมขึ้นมาทันที', 'The lime leaf smell rises at once'),
      why: l('ใส่ตอนท้ายกลิ่นจะสดที่สุด', 'Added last, the smell is at its freshest.') },
    { id: 'pk-store', phase: 5, title: l('ตักกิน แล้วเก็บส่วนที่เหลือ', 'Serve, then store the rest'), do: l('ตักกินกับข้าว ส่วนที่เหลือพักให้เย็นภายใน 1 ชั่วโมง แบ่งใส่กล่องปิดฝา แล้วเข้าตู้เย็น', 'Serve with rice. Cool the rest within an hour, portion it into lidded boxes and refrigerate.'),
      see: l('แบ่งกล่องละ 1 มื้อ', 'One meal per box'),
      why: l('เก็บได้ 3 วัน ถั่วจะนิ่มลงเล็กน้อย อุ่นในกระทะหรือไมโครเวฟให้ร้อนทั่วก่อนกิน', 'It keeps 3 days; the beans soften a little. Reheat in a pan or microwave until hot all through.') },
  ];
  return {
    id: 'prik-khing', name: chicken ? l('ผัดพริกขิงไก่ถั่วฝักยาว (4 จาน)', 'Prik khing chicken with long beans (serves 4)') : l('ผัดพริกขิงหมูถั่วฝักยาว (4 จาน)', 'Prik khing pork with long beans (serves 4)'), img: 'dish-prik-khing', mins: 25, phases: 5, kcal: m.kcal,
    g1: { title: l('ความเผ็ด', 'Spiciness'), opts: SP }, g2: { title: l('เนื้อสัตว์', 'Meat'), opts: MEAT },
    adapts: [{ id: 'salt', label: l('ลดเค็ม', 'Less salty') }],
    adaptNotes: lowSalt ? [l('ลดน้ำปลาเหลือครึ่งช้อนโต๊ะ ชิมก่อนแล้วค่อยเติม', 'Fish sauce cut to half a tbsp. Taste, then add more if needed.')] : [],
    ingredients, steps, qa,
    senses: [
      { label: l('รสชาติ', 'Taste'), options: SALT, good: l('หวานเค็ม เผ็ดหอม', 'Sweet, salty and fragrantly hot'), tips: [l('ครั้งหน้าเติมน้ำปลาอีกครึ่งช้อนโต๊ะตอนปรุง', 'Next time add half a tbsp more fish sauce when seasoning'), l('ครั้งหน้าลดน้ำปลา และเพิ่มน้ำตาลอีกนิด', 'Next time use less fish sauce and a little more sugar')] },
      { label: l('กลิ่น', 'Aroma'), options: [l('ยังไม่หอมเครื่องแกง', 'No curry aroma yet'), l('หอมพริกแกงกับใบมะกรูด', 'Smells of curry paste and lime leaf'), l('มีกลิ่นไหม้', 'Smells burnt')], good: l('หอมพริกแกงผัดกับใบมะกรูด', 'Fried curry paste and lime leaf'), tips: [l('ครั้งหน้าผัดพริกแกงในน้ำมันนานขึ้นจนน้ำมันแดง', 'Next time fry the paste longer, until the oil turns red'), l('ครั้งหน้าหรี่ไฟตอนผัดพริกแกง และเติมน้ำทีละนิดถ้าเริ่มติด', 'Next time lower the heat for the paste and add a splash of water if it sticks')] },
      { label: l('หน้าตา', 'Look'), options: [l('ถั่วเหี่ยวเละ', 'Limp, mushy beans'), l('ถั่วเขียวสด เคลือบพริกแกงแดง', 'Bright green beans coated in red paste'), l('ถั่วยังดิบแข็ง', 'Beans still raw and hard')], good: l('ถั่วเขียวสด เคลือบพริกแกงทั่ว', 'Bright beans coated all over'), tips: [l('ครั้งหน้าผัดถั่วสั้นลงราว 1 นาที', 'Next time cook the beans about a minute less'), l('ครั้งหน้าเติมน้ำอีก 2 ช้อนโต๊ะแล้วผัดต่ออีก 1 นาที', 'Next time add 2 more tbsp water and cook a minute longer')] },
    ],
  };
}

/** แผนทำอาหารวันอาทิตย์: ทำ 3 จานครั้งเดียว กินทั้งสัปดาห์ด้วยตู้เย็นและช่องแช่แข็ง เรียงตามลำดับที่ควรเริ่ม */
export const SUNDAY_PLAN = {
  meals: 12,
  dishes: [
    { id: 'moo-palo', o1: 1, o2: 0, when: l('เริ่มหมูพะโล้ก่อน เพราะเคี่ยวนานที่สุด ระหว่างเคี่ยวทำจานอื่นต่อได้', 'Start the braised pork first: it simmers longest, and you cook the rest meanwhile.') },
    { id: 'green-curry', o1: 1, o2: 0, when: l('ระหว่างพะโล้เคี่ยว ทำแกงเขียวหวานบนอีกหัวเตา', 'While the pork simmers, make the green curry on the other burner.') },
    { id: 'prik-khing', o1: 1, o2: 0, when: l('ผัดพริกขิงเป็นจานสุดท้าย เร็วที่สุด และถั่วจะยังกรอบ', 'Stir-fry the prik khing last: it is quickest and the beans stay crisp.') },
  ],
};

/** รวมของที่ต้องซื้อของทั้งแผน ของเดียวกันหน่วยเดียวกันรวมเป็นแถวเดียว แล้วคิดต้นทุนต่อมื้อ */
export function planShopping(plan = SUNDAY_PLAN) {
  const items: Ingredient[] = [];
  for (const d of plan.dishes) {
    for (const g of buildRecipe(d.id, d.o1, d.o2)!.ingredients) {
      const same = items.find((x) => x.id === g.id && x.unit.th === g.unit.th);
      if (same) { same.q += g.q; same.baht += g.baht; } else items.push({ ...g });
    }
  }
  const total = items.reduce((sum, g) => sum + g.baht, 0);
  return { items, total, perMeal: Math.round(total / plan.meals) };
}

export function buildRecipe(id: string, o1 = 1, o2 = 0, adapt: string[] = []): Recipe | null {
  if (id === 'kaprao') return kaprao(o1, o2, adapt);
  if (id === 'omelet') return omelet(o1, o2, adapt);
  if (id === 'green-curry') return greenCurry(o1, o2, adapt);
  if (id === 'moo-palo') return mooPalo(o1, o2, adapt);
  if (id === 'prik-khing') return prikKhing(o1, o2, adapt);
  return null;
}
export const DEFAULT_OPTS: Record<string, [number, number]> = { kaprao: [1, 0], omelet: [0, 0], 'green-curry': [1, 0], 'moo-palo': [1, 0], 'prik-khing': [1, 0] };

/** รายการเมนูในหน้าสูตร สองเมนูแรกทำตามได้ทุกขั้น ที่เหลือกำลังจะมา */
export type MenuItem = { id: string; name: L; img: ImgKey; mins: number; easy: boolean; baht: number; kcal: number; ready: boolean; need: string[] };
export const MENU: MenuItem[] = [
  { id: 'kaprao', name: l('กะเพราหมูสับไข่ดาว', 'Basil pork & egg'), img: 'dish-kaprao', mins: 15, easy: true, baht: 50, kcal: 650, ready: true, need: ['pork', 'egg', 'basil', 'garlic', 'chili', 'rice'] },
  { id: 'omelet', name: l('ไข่เจียวหมูสับ', 'Thai pork omelet'), img: 'dish-omelet', mins: 10, easy: true, baht: 30, kcal: 550, ready: true, need: ['egg', 'pork'] },
  { id: 'fried-rice', name: l('ข้าวผัดไข่', 'Egg fried rice'), img: 'dish-fried-rice', mins: 12, easy: true, baht: 35, kcal: 580, ready: false, need: ['rice', 'egg', 'garlic'] },
  { id: 'morning-glory', name: l('ผัดผักบุ้งไฟแดง', 'Stir-fried morning glory'), img: 'dish-morning-glory', mins: 8, easy: true, baht: 25, kcal: 210, ready: false, need: ['morningGlory', 'garlic', 'chili'] },
  { id: 'tom-yum', name: l('ต้มยำกุ้ง', 'Tom yum goong'), img: 'dish-tom-yum', mins: 25, easy: false, baht: 120, kcal: 320, ready: false, need: ['shrimp', 'mushroom', 'chili'] },
  { id: 'green-curry', name: l('แกงเขียวหวานไก่ (4 จาน)', 'Green curry chicken (serves 4)'), img: 'dish-green-curry', mins: 35, easy: false, baht: 170, kcal: 610, ready: true, need: ['chicken', 'coconut', 'thaiBasil'] },
  { id: 'moo-palo', name: l('หมูพะโล้ไข่ (4 จาน)', 'Five-spice pork & eggs (serves 4)'), img: 'dish-moo-palo', mins: 65, easy: false, baht: 177, kcal: 540, ready: true, need: ['pork', 'egg', 'garlic'] },
  { id: 'prik-khing', name: l('ผัดพริกขิงหมูถั่วฝักยาว (4 จาน)', 'Prik khing pork with long beans (serves 4)'), img: 'dish-prik-khing', mins: 25, easy: true, baht: 138, kcal: 520, ready: true, need: ['pork', 'chili'] },
];

export const PANTRY: { id: string; name: L }[] = [
  { id: 'egg', name: l('ไข่', 'Eggs') }, { id: 'pork', name: l('หมูสับ', 'Minced pork') }, { id: 'chicken', name: l('ไก่', 'Chicken') },
  { id: 'shrimp', name: l('กุ้ง', 'Shrimp') }, { id: 'rice', name: l('ข้าวสวย', 'Cooked rice') }, { id: 'garlic', name: l('กระเทียม', 'Garlic') },
  { id: 'chili', name: l('พริก', 'Chili') }, { id: 'basil', name: l('ใบกะเพรา', 'Holy basil') }, { id: 'thaiBasil', name: l('ใบโหระพา', 'Thai basil') },
  { id: 'morningGlory', name: l('ผักบุ้ง', 'Morning glory') }, { id: 'mushroom', name: l('เห็ด', 'Mushrooms') }, { id: 'coconut', name: l('กะทิ', 'Coconut milk') },
];
// ของที่ใช้แทนกันได้ในเมนูที่ทำตามได้ เชฟปรับสูตรให้ในหน้ารายละเอียด
const SUB: Record<string, string> = { basil: 'thaiBasil', pork: 'chicken' };

/** เรียงเมนูตามของที่มี: ขาดน้อยขึ้นก่อน ของที่แทนกันได้นับว่าขาดเบากว่า */
export function fridgeFit(item: MenuItem, have: string[]) {
  const miss = item.need.filter((n) => !have.includes(n));
  const swaps = item.ready ? miss.filter((n) => SUB[n] && have.includes(SUB[n])) : [];
  const hard = miss.filter((n) => !swaps.includes(n));
  return { hard, swaps, rank: hard.length * 10 + swaps.length + (item.ready ? 0 : 0.5) };
}

/** คะแนนนักชิม: ตอบตรงจุดที่ดี 5 ดาว ตอบเพี้ยน 3 ดาว ต่อด้าน แล้วเฉลี่ย */
export function tasteScore(answers: number[]) {
  const per = answers.map((a) => (a === 1 ? 5 : 3));
  return Math.round((per.reduce((s, x) => s + x, 0) / per.length) * 10) / 10;
}
