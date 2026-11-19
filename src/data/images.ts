import type { ImgKey } from './recipes';

export const IMG: Record<ImgKey, number> = {
  pork: require('@/assets/images/food/pork.png'),
  egg: require('@/assets/images/food/egg.png'),
  garlic: require('@/assets/images/food/garlic.png'),
  chili: require('@/assets/images/food/chili.png'),
  rice: require('@/assets/images/food/rice.png'),
  'morning-glory': require('@/assets/images/food/morning-glory.png'),
  chicken: require('@/assets/images/food/chicken.png'),
  basil: require('@/assets/images/food/basil.png'),
  oil: require('@/assets/images/food/oil.png'),
  'oyster-sauce': require('@/assets/images/food/oyster-sauce.png'),
  'soy-sauce': require('@/assets/images/food/soy-sauce.png'),
  sugar: require('@/assets/images/food/sugar.png'),
  fish: require('@/assets/images/food/fish.png'),
  'dish-kaprao': require('@/assets/images/food/dish-kaprao.png'),
  'dish-omelet': require('@/assets/images/food/dish-omelet.png'),
  'dish-fried-rice': require('@/assets/images/food/dish-fried-rice.png'),
  'dish-morning-glory': require('@/assets/images/food/dish-morning-glory.png'),
  'dish-tom-yum': require('@/assets/images/food/dish-tom-yum.png'),
  'dish-green-curry': require('@/assets/images/food/dish-green-curry.png'),
  'dish-moo-palo': require('@/assets/images/food/dish-moo-palo.png'),
  'dish-prik-khing': require('@/assets/images/food/dish-prik-khing.png'),
};

// พื้นสีสดหลังรูปจาน จานขาวในรูปจะเด่นขึ้น
export const DISH_TINT: Record<string, string> = {
  kaprao: '#FF8F6B', omelet: '#FFD84D', 'fried-rice': '#FFB35C', 'morning-glory': '#7BE0B5', 'tom-yum': '#FF8FA8',
  'green-curry': '#8FDB8A', 'moo-palo': '#A7B0FF', 'prik-khing': '#FFB35C',
};

// เชฟจิ๋ว ตัวละครหลัก หนึ่งท่าต่อหนึ่งจังหวะ ใช้เฉพาะตอนที่ท่านั้นมีความหมาย ไม่แปะทุกหน้า
export const MASCOT = {
  hi: require('@/assets/images/chef/hi.png'), // ทักทาย: หน้าร้าน หน้าแนะนำแอป
  cook: require('@/assets/images/chef/cook.png'), // ยังไม่เคยทำจานไหน
  cheer: require('@/assets/images/chef/cheer.png'), // สำเร็จ: ครบเวลา ทำจบจาน
  think: require('@/assets/images/chef/think.png'), // กำลังรอคำตอบ
  oops: require('@/assets/images/chef/oops.png'), // มีอะไรผิดพลาด
  taste: require('@/assets/images/chef/taste.png'), // ชิมให้คะแนน
  capybara: require('@/assets/images/mascot/capybara.png'),
};
