import json
import numpy as np
from PIL import Image
from scipy import ndimage

def clean(path_in, path_out):
    im = Image.open(path_in).convert('RGBA')
    a = np.array(im)
    al = a[:, :, 3]
    lab, n = ndimage.label(al > 128)
    if n > 1:
        sizes = ndimage.sum(np.ones_like(al), lab, range(1, n + 1))
        keep = 1 + int(np.argmax(sizes))
        mask = ndimage.binary_dilation(lab == keep, iterations=3)
        a[:, :, 3] = np.where(mask, al, 0)
    ys, xs = np.where(a[:, :, 3] > 8)
    a = a[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    out = Image.fromarray(a, 'RGBA')
    out.save(path_out)
    return out

# cat from u2net, others from isnet-anime
sprites = {
    'elephant': clean('sprites/elephant_full.png', 'sprites/elephant.png'),
    'cat': clean('cat_u2net.png', 'sprites/cat.png'),
    'capybara': clean('sprites/capybara_full.png', 'sprites/capybara.png'),
    'frog': clean('sprites/frog_full.png', 'sprites/frog.png'),
}

info = {}
for name, im in sprites.items():
    a = np.array(im).astype(float)
    rgb, al = a[:, :, :3], a[:, :, 3]
    lum = 0.2126 * rgb[:, :, 0] + 0.7152 * rgb[:, :, 1] + 0.0722 * rgb[:, :, 2]
    h, w = al.shape
    dark = (lum < 70) & (al > 200)
    dark[int(h * 0.62):, :] = False
    lab, n = ndimage.label(dark)
    blobs = []
    for i in range(1, n + 1):
        ys, xs = np.where(lab == i)
        area = len(ys)
        bw, bh = xs.max() - xs.min() + 1, ys.max() - ys.min() + 1
        if 60 <= area <= 900 and 0.5 <= bw / bh <= 2.0:
            cx, cy = xs.mean(), ys.mean()
            r = max(bw, bh) / 2
            yy, xx = np.ogrid[:h, :w]
            d = np.sqrt((xx - cx) ** 2 + (yy - cy) ** 2)
            ring = (d > r + 3) & (d < r + 8) & (lum > 90) & (al > 200)
            col = rgb[ring].mean(axis=0) if ring.sum() else np.array([200, 200, 200])
            blobs.append({'cx': cx / w, 'cy': cy / h, 'rw': bw / w, 'rh': bh / h, 'area': area,
                          'skin': '#%02x%02x%02x' % tuple(int(v) for v in col)})
    blobs.sort(key=lambda b: -b['area'])
    info[name] = {'w': w, 'h': h, 'eyes': sorted(blobs[:2], key=lambda b: b['cx'])}
    im.save(f'sprites/{name}.webp', 'WEBP', quality=90, method=6)

Image.open('room_raw.png').convert('RGB').save('room.webp', 'WEBP', quality=86, method=6)
print(json.dumps(info, indent=1))
