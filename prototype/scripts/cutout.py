import sys, json
import numpy as np
from PIL import Image
from rembg import remove, new_session
from scipy import ndimage

src = Image.open('/home/claude/gen/v4/team_lineup.png').convert('RGB')
boxes = {
    'elephant': (10, 160, 480, 830),
    'cat': (455, 240, 805, 830),
    'capybara': (785, 250, 1165, 830),
    'frog': (1165, 380, 1515, 830),
}
session = new_session('isnet-anime')
info = {}
for name, box in boxes.items():
    crop = src.crop(box)
    out = remove(crop, session=session, post_process_mask=True)
    a = np.array(out)
    alpha = a[:, :, 3]
    lab, n = ndimage.label(alpha > 128)
    if n > 1:
        sizes = ndimage.sum(np.ones_like(alpha), lab, range(1, n + 1))
        keep = 1 + int(np.argmax(sizes))
        mask = lab == keep
        mask = ndimage.binary_dilation(mask, iterations=3)
        a[:, :, 3] = np.where(mask, alpha, 0)
    ys, xs = np.where(a[:, :, 3] > 8)
    y0, y1, x0, x1 = ys.min(), ys.max() + 1, xs.min(), xs.max() + 1
    a = a[y0:y1, x0:x1]
    img = Image.fromarray(a, 'RGBA')
    img.save(f'../sprites/{name}_full.png')
    info[name] = {'w': img.width, 'h': img.height, 'components': int(n)}
print(json.dumps(info))
