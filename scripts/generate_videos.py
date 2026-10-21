import os
import subprocess
from PIL import Image

FE_PUBLIC = "public"
IMG_DIR = os.path.join(FE_PUBLIC, "assets/images")
VID_ASSETS_DIR = os.path.join(FE_PUBLIC, "assets/videos")
VID_CONCIERGE_DIR = os.path.join(FE_PUBLIC, "videos/concierge")

os.makedirs(VID_ASSETS_DIR, exist_ok=True)
os.makedirs(VID_CONCIERGE_DIR, exist_ok=True)

for fn in os.listdir(IMG_DIR):
    if fn.endswith(".webp"):
        im = Image.open(os.path.join(IMG_DIR, fn)).convert("RGB")
        w, h = im.size
        target_ratio = 16 / 9
        if w / h > target_ratio:
            nw = int(h * target_ratio)
            x0 = (w - nw) // 2
            im = im.crop((x0, 0, x0 + nw, h))
        else:
            nh = int(w / target_ratio)
            y0 = (h - nh) // 2
            im = im.crop((0, y0, w, y0 + nh))
        im = im.resize((1280, 720), Image.Resampling.BILINEAR)
        im.save(f"/tmp/{fn}.jpg", quality=92)

JOBS = [
    (os.path.join(VID_ASSETS_DIR, "hero-seabuckthorn.mp4"), "seabuckthorn.webp.jpg"),
    (os.path.join(VID_ASSETS_DIR, "planting-vision.mp4"), "plant tree.webp.jpg"),
    (os.path.join(VID_ASSETS_DIR, "river-stewardship.mp4"), "river free.webp.jpg"),
    (os.path.join(VID_ASSETS_DIR, "community-nourishment.mp4"), "education.webp.jpg"),
    (os.path.join(VID_ASSETS_DIR, "seabuckthorn-botanical.mp4"), "seabuckthorn nature.webp.jpg"),
    (os.path.join(VID_ASSETS_DIR, "charcoal-purification.mp4"), "charcoal.webp.jpg"),
    (os.path.join(VID_ASSETS_DIR, "tulsi-botanical.mp4"), "tulsi.webp.jpg"),
    (os.path.join(VID_ASSETS_DIR, "aloevera-cellular.mp4"), "aloeveradna.webp.jpg"),
    (os.path.join(VID_ASSETS_DIR, "aloe-science-lab.mp4"), "aloeverascience.webp.jpg"),
    (os.path.join(VID_ASSETS_DIR, "niacinamide-actives.mp4"), "niacidamine.webp.jpg"),
    (os.path.join(VID_ASSETS_DIR, "founder-manifesto.mp4"), "foundermanifesto.webp.jpg"),
    (os.path.join(VID_ASSETS_DIR, "unboxing-protection.mp4"), "Promo1.webp.jpg"),
    (os.path.join(VID_CONCIERGE_DIR, "facial_phase_1.mp4"), "aloeveradrop.webp.jpg"),
    (os.path.join(VID_CONCIERGE_DIR, "facial_phase_2.mp4"), "aloeverabeaker.webp.jpg"),
    (os.path.join(VID_CONCIERGE_DIR, "facial_phase_3.mp4"), "aloeverascience.webp.jpg"),
    (os.path.join(VID_CONCIERGE_DIR, "facial_phase_4.mp4"), "seabuckthorn nature.webp.jpg"),
    (os.path.join(VID_CONCIERGE_DIR, "botanical_sea_buckthorn.mp4"), "seabuckthorn.webp.jpg"),
    (os.path.join(VID_CONCIERGE_DIR, "botanical_saffron.mp4"), "Promo3.webp.jpg"),
    (os.path.join(VID_CONCIERGE_DIR, "botanical_kumkumadi.mp4"), "Promo4.webp.jpg"),
    (os.path.join(VID_CONCIERGE_DIR, "botanical_charcoal.mp4"), "charcoal.webp.jpg"),
    (os.path.join(VID_CONCIERGE_DIR, "skin_quiz_diagnostic.mp4"), "aloeveradna.webp.jpg"),
]

for dest, src_jpg in JOBS:
    vf = "zoompan=z='min(zoom+0.0014,1.16)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=100:s=854x480:fps=20,format=yuv420p"
    subprocess.run([
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", f"/tmp/{src_jpg}",
        "-vf", vf,
        "-t", "5",
        "-c:v", "libx264", "-preset", "ultrafast", "-crf", "26",
        "-movflags", "+faststart",
        dest
    ], check=True)
    print(f"Generated {dest} ({os.path.getsize(dest)/1024:.1f} KB)")