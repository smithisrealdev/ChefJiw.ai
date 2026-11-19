// โทเคนดีไซน์จากต้นแบบที่อนุมัติแล้ว (แผน implement หัวข้อ "ระบบดีไซน์") หน้าจอห้ามใส่รหัสสีเอง ให้ใช้จากที่นี่
export type Palette = {
  bg: string; surface: string; surfaceSoft: string; line: string;
  ink: string; muted: string; mutedStrong: string;
  primary: string; onPrimary: string;
  accent: string; onAccent: string; note: string; ai: string; done: string; danger: string;
  success: string; warn: string; flame: string;
  header: { home: string; recipes: string; cook: string; me: string; cookFlow: string; market: string };
};

// ทุกคู่ข้อความ/พื้นผ่าน 4.5:1 ตามที่คำนวณไว้ในแผน พื้นพาสเทล (accent note ai done danger) ใช้ตัวอักษรเข้มเสมอทั้งสองธีม
export const light: Palette = {
  bg: '#FFFFFF', surface: '#FFFFFF', surfaceSoft: '#F5F3FC', line: '#E4E0F2',
  ink: '#24212B', muted: '#6B6777', mutedStrong: '#4F4A5C',
  primary: '#24212B', onPrimary: '#FFFFFF',
  accent: '#FFE66D', onAccent: '#24212B', note: '#FFF3B0', ai: '#E9E6FF', done: '#C9F2CF', danger: '#FFE3D6',
  success: '#1E7A45', warn: '#8A3B12', flame: '#C2512E',
  header: { home: '#FBEBD2', recipes: '#FFA9C6', cook: '#FFC98A', me: '#8FE3CF', cookFlow: '#FFD84D', market: '#8FD8F2' },
};

export const dark: Palette = {
  bg: '#17151D', surface: '#23212C', surfaceSoft: '#2F2C3B', line: '#3D394B',
  ink: '#F3F1FA', muted: '#B9B4C9', mutedStrong: '#CFCADC',
  primary: '#F3F1FA', onPrimary: '#24212B',
  accent: '#FFE66D', onAccent: '#24212B', note: '#FFF3B0', ai: '#E9E6FF', done: '#C9F2CF', danger: '#FFE3D6',
  success: '#7FD9A0', warn: '#FFB38A', flame: '#FF9A6B',
  header: { home: '#17151D', recipes: '#17151D', cook: '#17151D', me: '#17151D', cookFlow: '#17151D', market: '#17151D' },
};

// สีข้อความบนพื้นพาสเทลที่ไม่เปลี่ยนตามธีม
export const onPastel = { ink: '#24212B', muted: '#4F4A5C', success: '#1E7A45', warn: '#8A3B12' };

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 } as const;
export const radius = { sm: 16, lg: 24, pill: 999 } as const;
export const type = { sm: 14, md: 16, lg: 18, xl: 20, xxl: 28 } as const;
export const touch = { min: 44, cook: 56 } as const;

export const fonts = {
  heading: 'Mali_700Bold',
  headingSemi: 'Mali_600SemiBold',
  body: 'IBMPlexSansThaiLooped_400Regular',
  bodySemi: 'IBMPlexSansThaiLooped_600SemiBold',
  bodyBold: 'IBMPlexSansThaiLooped_700Bold',
} as const;
