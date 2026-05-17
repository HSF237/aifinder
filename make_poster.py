from PIL import Image, ImageDraw, ImageFont
import os

# ─── Canvas ───────────────────────────────────────────────────────────────────
W, H = 2480, 3508          # A4 at 300 dpi
img  = Image.new("RGB", (W, H), "#0A0A12")
d    = ImageDraw.Draw(img)

FONTS = r"C:\Users\HI\AppData\Roaming\Claude\local-agent-mode-sessions\skills-plugin\5fbe131d-a1d4-4e91-97c0-26f06fa44286\5140ed67-f4e6-4d91-a36d-949f51358320\skills\canvas-design\canvas-fonts"

def font(name, size):
    return ImageFont.truetype(os.path.join(FONTS, name), size)

f_title   = font("BigShoulders-Bold.ttf",   220)
f_sub     = font("Tektur-Medium.ttf",        80)
f_label   = font("GeistMono-Regular.ttf",    58)
f_mono    = font("JetBrainsMono-Regular.ttf",52)
f_tiny    = font("DMMono-Regular.ttf",        46)
f_tag     = font("Outfit-Bold.ttf",           62)
f_section = font("IBMPlexMono-Bold.ttf",      70)

# ─── Palette ──────────────────────────────────────────────────────────────────
BG      = "#0A0A12"
PURPLE  = "#7C3AED"
VIOLET  = "#A855F7"
CYAN    = "#22D3EE"
MINT    = "#34D399"
WARM    = "#F59E0B"
PINK    = "#EC4899"
DIM     = "#4B5563"
LIGHT   = "#E5E7EB"
WHITE   = "#FFFFFF"
CARD_BG = "#111827"
BORDER  = "#1F2937"

# ─── Helpers ──────────────────────────────────────────────────────────────────
def centered_text(text, y, f, color=WHITE):
    bbox  = d.textbbox((0,0), text, font=f)
    tw    = bbox[2] - bbox[0]
    d.text(((W - tw) // 2, y), text, font=f, fill=color)

def rounded_rect(x1, y1, x2, y2, r, fill, outline=None, ow=0):
    d.rounded_rectangle([x1, y1, x2, y2], radius=r, fill=fill, outline=outline, width=ow)

# ─── Background grid lines ────────────────────────────────────────────────────
for gx in range(0, W, 120):
    d.line([(gx,0),(gx,H)], fill="#0F1322", width=1)
for gy in range(0, H, 120):
    d.line([(0,gy),(W,gy)], fill="#0F1322", width=1)

# ─── Top glow accent ──────────────────────────────────────────────────────────
for i in range(18, 0, -1):
    alpha  = int(255 * (i/18)**2 * 0.18)
    color  = "#{:02x}{:02x}{:02x}".format(
        int(0x7C + (0xA8-0x7C)*i/18),
        int(0x3A * i/18),
        int(0xED + (0xF7-0xED)*i/18)
    )
    d.ellipse([(W//2 - 700 - i*30, -200 - i*20),
               (W//2 + 700 + i*30, 300  + i*20)],
              fill=color if i == 1 else None,
              outline=None)

# Solid purple splash behind title
d.ellipse([(W//2 - 600, -280), (W//2 + 600, 260)], fill="#1a0a3a")

# ─── Header decorative stripe ─────────────────────────────────────────────────
rounded_rect(140, 108, W-140, 120, 4, PURPLE)

# ─── Tag line ─────────────────────────────────────────────────────────────────
centered_text("FOR THE EDITOR", 148, f_sub, VIOLET)

# ─── Main title ───────────────────────────────────────────────────────────────
centered_text("SOUNDTRACK", 280, f_title, WHITE)
# Underline accent
bbox_t = d.textbbox((0,0), "SOUNDTRACK", font=f_title)
tw = bbox_t[2]-bbox_t[0]
tx = (W-tw)//2
d.line([(tx, 510), (tx+tw, 510)], fill=PURPLE, width=8)

centered_text("GUIDE", 510, f_title, VIOLET)

# ─── Sub description ──────────────────────────────────────────────────────────
centered_text("Background music picks for the AI Finder presentation video", 790, f_tiny, DIM)

# ─── Divider ──────────────────────────────────────────────────────────────────
d.line([(140,870),(W-140,870)], fill=BORDER, width=2)

# ─── Music tracks ─────────────────────────────────────────────────────────────
tracks = [
    {
        "num":   "01",
        "title": "Chill Abstract Intention",
        "artist":"Filous / Abstract",
        "vibe":  "Opening credits · dreamy ambient",
        "source":"YouTube Audio Library",
        "tag":   "OPENER",
        "color": PURPLE,
    },
    {
        "num":   "02",
        "title": "Escape",
        "artist":"Sappheiros",
        "vibe":  "Deep-work focus · lo-fi electronic",
        "source":"YouTube Audio Library",
        "tag":   "ANALYSIS SCENE",
        "color": CYAN,
    },
    {
        "num":   "03",
        "title": "Midnight City",
        "artist":"Tokyo Music Walker",
        "vibe":  "Slick tech feel · smooth synthwave",
        "source":"YouTube Audio Library",
        "tag":   "DEMO MOMENT",
        "color": VIOLET,
    },
    {
        "num":   "04",
        "title": "Running",
        "artist":"DayFox",
        "vibe":  "High energy · cinematic build-up",
        "source":"Pixabay  ·  pixabay.com/music",
        "tag":   "RESULTS REVEAL",
        "color": MINT,
    },
    {
        "num":   "05",
        "title": "Sunrise",
        "artist":"Liqwyd",
        "vibe":  "Uplifting close · positive chillhop",
        "source":"YouTube Audio Library",
        "tag":   "OUTRO",
        "color": WARM,
    },
]

card_x1 = 140
card_x2 = W - 140
card_h  = 380
gap     = 38
start_y = 920

for i, t in enumerate(tracks):
    cy = start_y + i * (card_h + gap)
    # Card background
    rounded_rect(card_x1, cy, card_x2, cy+card_h, 22, CARD_BG, t["color"], 2)
    # Left colour accent bar
    rounded_rect(card_x1, cy, card_x1+12, cy+card_h, 6, t["color"])

    # Track number
    d.text((card_x1+58, cy+38), t["num"], font=f_title.__class__.truetype(
        os.path.join(FONTS,"BigShoulders-Bold.ttf"), 160), fill=t["color"])

    # Title
    d.text((card_x1+240, cy+44), t["title"], font=f_tag, fill=WHITE)
    # Artist
    d.text((card_x1+240, cy+118), t["artist"], font=f_tiny, fill=DIM)
    # Vibe line
    d.text((card_x1+240, cy+178), t["vibe"], font=f_mono, fill=LIGHT)
    # Source
    src_label = "▸ " + t["source"]
    d.text((card_x1+240, cy+252), src_label, font=f_tiny, fill=t["color"])

    # Tag pill (right side)
    tag_text  = t["tag"]
    tag_bbox  = d.textbbox((0,0), tag_text, font=f_tiny)
    tag_w     = tag_bbox[2]-tag_bbox[0] + 48
    tag_h2    = tag_bbox[3]-tag_bbox[1] + 24
    tx2       = card_x2 - 60 - tag_w
    ty2       = cy + 44
    rounded_rect(tx2, ty2, tx2+tag_w, ty2+tag_h2, 10,
                 t["color"]+"33", t["color"], 2)
    d.text((tx2+24, ty2+12), tag_text, font=f_tiny, fill=t["color"])

# ─── Tips section ─────────────────────────────────────────────────────────────
tip_y = start_y + len(tracks)*(card_h+gap) + 30
d.line([(140, tip_y),(W-140, tip_y)], fill=BORDER, width=2)
tip_y += 56

centered_text("MIXING TIPS", tip_y, f_section, DIM)
tip_y += 100

tips = [
    ("🔊  Volume",  "Keep at 15–20 % during talking parts, 60–70 % on B-roll"),
    ("✂️  Fade",     "Use 0.5 s fade-in / 1 s fade-out on every cut"),
    ("🔁  Loop",    "All tracks loop cleanly — just cut at the waveform downbeat"),
    ("📖  License",  "All tracks are royalty-free for YouTube & school projects"),
]
for icon_label, desc in tips:
    rounded_rect(140, tip_y, W-140, tip_y+100, 14, "#0D111C", BORDER, 1)
    d.text((200, tip_y+22), icon_label, font=f_label, fill=VIOLET)
    lw = d.textbbox((0,0), icon_label, font=f_label)[2]
    d.text((200 + lw + 40, tip_y+28), desc, font=f_tiny, fill=LIGHT)
    tip_y += 118

# ─── Footer ───────────────────────────────────────────────────────────────────
foot_y = H - 220
d.line([(140, foot_y),(W-140, foot_y)], fill=BORDER, width=2)
centered_text("AI FINDER  ·  Digital Fest 2026", foot_y+54, f_tiny, DIM)
centered_text("aifinder-phi.vercel.app", foot_y+116, f_tiny, PURPLE)

# ─── Bottom gradient bar ──────────────────────────────────────────────────────
for i, col in enumerate([PURPLE, VIOLET, CYAN, MINT, WARM, PINK]):
    bw = (W - 280) // 6
    bx = 140 + i*bw
    rounded_rect(bx, H-56, bx+bw-6, H-16, 6, col)

# ─── Save ─────────────────────────────────────────────────────────────────────
out = r"C:\Users\HI\Desktop\MY CODESPACE\Ai Finder\music_guide.png"
img.save(out, "PNG", dpi=(300,300))
print(f"Saved → {out}")
