import Svg, { Circle, Path } from 'react-native-svg';

// ชุดไอคอนเส้นหนา 2.2 ขนาด 24 ชุดเดียวทั้งแอป (แผน: ไม่ใช้อีโมจิเป็นไอคอน)
const PATHS = {
  home: ['M3.5 10.6 12 3.6l8.5 7V19.5a1.5 1.5 0 0 1-1.5 1.5H5a1.5 1.5 0 0 1-1.5-1.5z'],
  book: ['M12 6v14', 'M3.5 5h5A3.5 3.5 0 0 1 12 8.5 3.5 3.5 0 0 1 15.5 5h5v13h-5.5A2.5 2.5 0 0 0 12 20.5 2.5 2.5 0 0 0 9.5 18H3.5z'],
  pot: ['M3 12h18', 'M19.5 12v6.5a2 2 0 0 1-2 2h-11a2 2 0 0 1-2-2V12', 'M9.5 9V8.5a2.5 2.5 0 0 1 5 0V9'],
  user: ['M4.5 20.5a7.5 7.5 0 0 1 15 0'],
  back: ['M15 5l-7 7 7 7'],
  next: ['M9 5l7 7-7 7'],
  close: ['M6 6l12 12', 'M18 6L6 18'],
  chat: ['M4 5.5h16v10H9l-5 4z'],
  alert: ['M12 4 2.5 20h19z', 'M12 10v4.5', 'M12 17.2v.3'],
  check: ['M5 12.5l4.5 4.5L19 7.5'],
  flame: ['M12 21c-4 0-6.5-2.6-6.5-6 0-3.5 3-5.5 3.5-9 2.5 1.5 3.5 4 3.5 5.5 1-1 1.5-2.2 1.5-3.5 2 1.5 4.5 4 4.5 7 0 3.4-2.5 6-6.5 6z'],
  clock: ['M12 7v5l3 2'],
  search: ['M16 16l4.5 4.5'],
  plus: ['M12 5v14', 'M5 12h14'],
  minus: ['M5 12h14'],
} as const;
const CIRCLES: Partial<Record<keyof typeof PATHS, [number, number, number]>> = { user: [12, 8.5, 4], clock: [12, 12, 8.5], search: [11, 11, 6.5] };

export type IconName = keyof typeof PATHS;

export function Icon({ name, color, size = 24 }: { name: IconName; color: string; size?: number }) {
  const c = CIRCLES[name];
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" accessible={false}>
      {PATHS[name].map((d) => <Path key={d} d={d} />)}
      {c && <Circle cx={c[0]} cy={c[1]} r={c[2]} />}
    </Svg>
  );
}
