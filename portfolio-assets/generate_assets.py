from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT = Path('portfolio-assets')
OUT.mkdir(exist_ok=True)

W, H = 1600, 900
BG = '#0b1020'
TOP = '#101936'
BOTTOM = '#0d1428'
PANEL = '#121a33'
PANEL2 = '#182446'
TEXT = '#f5f7ff'
MUTED = '#a9b6da'
ACCENT = '#7c9cff'
ACCENT2 = '#33d1ff'
GREEN = '#3ddc97'
YELLOW = '#ffd166'
PINK = '#ff6fae'
ORANGE = '#f78c6c'
BORDER = '#2b3b73'
DARK = '#08101f'

BOLD = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REG = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'

def font(size, bold=False):
    return ImageFont.truetype(BOLD if bold else REG, size)

H1 = font(54, True)
H2 = font(34, True)
H3 = font(24, True)
BODY = font(22)
SMALL = font(18)
TINY = font(15)


def canvas():
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 220), fill=TOP)
    d.rectangle((0, H - 170, W, H), fill=BOTTOM)
    return im, d


def rr(d, box, fill, outline=BORDER, width=2, r=24):
    d.rounded_rectangle(box, radius=r, fill=fill, outline=outline, width=width)


def text_block(d, x, y, text, fnt, fill, max_width, line_gap=8):
    words = text.split()
    lines = []
    current = ''
    for word in words:
        trial = word if not current else current + ' ' + word
        if d.textbbox((0, 0), trial, font=fnt)[2] <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    cy = y
    for line in lines:
        d.text((x, cy), line, font=fnt, fill=fill)
        cy += (d.textbbox((0, 0), line, font=fnt)[3] - d.textbbox((0, 0), line, font=fnt)[1]) + line_gap
    return cy


def fit_text_block(d, x, y, text, sizes, fill, max_width, line_gap=8):
    for size in sizes:
        fnt = font(size)
        words = text.split()
        lines = []
        current = ''
        ok = True
        for word in words:
            trial = word if not current else current + ' ' + word
            if d.textbbox((0, 0), trial, font=fnt)[2] <= max_width:
                current = trial
            else:
                if current:
                    lines.append(current)
                current = word
                if d.textbbox((0, 0), word, font=fnt)[2] > max_width:
                    ok = False
                    break
        if current:
            lines.append(current)
        if ok:
            cy = y
            for line in lines:
                d.text((x, cy), line, font=fnt, fill=fill)
                cy += (d.textbbox((0, 0), line, font=fnt)[3] - d.textbbox((0, 0), line, font=fnt)[1]) + line_gap
            return cy
    return text_block(d, x, y, text, font(sizes[-1]), fill, max_width, line_gap)


def title(d, heading, subtitle):
    d.text((90, 68), heading, font=H1, fill=TEXT)
    text_block(d, 90, 142, subtitle, BODY, MUTED, 1380)


def bullet_list(d, x, y, items, width, gap=14, color=ACCENT2, fnt=BODY):
    cy = y
    for item in items:
        d.ellipse((x, cy + 8, x + 12, cy + 20), fill=color)
        cy = text_block(d, x + 24, cy, item, fnt, TEXT, width, 6) + gap
    return cy


def footer(d, text='ashishssoni / LaunchKit • SaaS backend showcase'):
    d.line((90, H - 82, W - 90, H - 82), fill=BORDER, width=2)
    d.text((90, H - 58), text, font=SMALL, fill=MUTED)


def chip(d, x, y, label, fill, fg=DARK):
    bb = d.textbbox((0, 0), label, font=SMALL)
    w = bb[2] - bb[0] + 28
    h = 38
    rr(d, (x, y, x + w, y + h), fill=fill, outline=fill, width=1, r=18)
    d.text((x + 14, y + 8), label, font=SMALL, fill=fg)
    return w


# 0. Thumbnail (safe-center for Upwork crop)
thumb_w, thumb_h = 1280, 720
thumb = Image.new('RGB', (thumb_w, thumb_h), BG)
td = ImageDraw.Draw(thumb)
td.rectangle((0, 0, thumb_w, thumb_h), fill=BG)
td.rectangle((0, 0, thumb_w, 180), fill='#0f1730')
td.rectangle((0, 560, thumb_w, thumb_h), fill='#0d1428')

# Keep all meaningful content inside central safe zone: x ~ 180..1100
center_x = thumb_w // 2

# Title
title_txt = 'LaunchKit'
sub_txt = 'SaaS Backend'
title_bb = td.textbbox((0, 0), title_txt, font=font(78, True))
sub_bb = td.textbbox((0, 0), sub_txt, font=font(40, True))
td.text((center_x - (title_bb[2]-title_bb[0]) / 2, 78), title_txt, font=font(78, True), fill=TEXT)
td.text((center_x - (sub_bb[2]-sub_bb[0]) / 2, 172), sub_txt, font=font(40, True), fill=ACCENT2)

# Single centered card to avoid side-crop issues
rr(td, (210, 255, 1070, 500), '#121a33', outline='#2b3b73', width=2, r=30)

# Center API box
rr(td, (540, 285, 740, 355), ACCENT, outline=ACCENT, width=1, r=22)
api_label = 'API'
api_bb = td.textbbox((0, 0), api_label, font=font(36, True))
td.text((640 - (api_bb[2]-api_bb[0]) / 2, 300), api_label, font=font(36, True), fill=DARK)

# Three boxes safely centered underneath
for box in [
    (300, 390, 470, 458, '#ffd6e7', 'Auth'),
    (555, 390, 725, 458, '#d3f9d8', 'Billing'),
    (810, 390, 980, 458, '#fff3bf', 'Multi-Tenant'),
]:
    x1, y1, x2, y2, color, label = box
    rr(td, (x1, y1, x2, y2), color, outline=color, width=1, r=18)
    f = font(24, True) if label != 'Multi-Tenant' else font(22, True)
    bb = td.textbbox((0, 0), label, font=f)
    td.text((x1 + ((x2-x1)-(bb[2]-bb[0]))/2, y1 + ((y2-y1)-(bb[3]-bb[1]))/2 - 2), label, font=f, fill=DARK)

# Connectors
for coords in [((640,355),(385,390)), ((640,355),(640,390)), ((640,355),(895,390))]:
    td.line((coords[0][0], coords[0][1], coords[1][0], coords[1][1]), fill=ACCENT2, width=5)

# Bottom stack chips centered
chip_specs = [('NestJS', PINK), ('PostgreSQL', ACCENT), ('Prisma', ACCENT2), ('Stripe', GREEN)]
chip_widths = []
for txt, color in chip_specs:
    bb = td.textbbox((0, 0), txt, font=SMALL)
    chip_widths.append((bb[2]-bb[0]) + 28)
total_w = sum(chip_widths) + 18 * (len(chip_widths)-1)
start_x = center_x - total_w / 2
x = start_x
for (txt, color), w in zip(chip_specs, chip_widths):
    chip(td, x, 615, txt, color, DARK)
    x += w + 18

thumb.save(OUT / '00-launchkit-thumbnail.png')

# 1. Cover
im, d = canvas()
title(d, 'LaunchKit', 'Production-grade SaaS backend platform for startups, internal tools, and B2B products')
rr(d, (90, 240, 760, 700), PANEL)
d.text((125, 278), 'What it shows', font=H2, fill=TEXT)
bullet_list(d, 130, 338, [
    'JWT authentication with refresh tokens',
    'Multi-tenant workspaces and memberships',
    'RBAC and permission guards',
    'Stripe checkout plus webhook sync',
    'API key management and audit logs',
    'PostgreSQL and Redis architecture',
], 560)

rr(d, (815, 240, 1510, 700), PANEL)
d.text((850, 278), 'Stack', font=H2, fill=TEXT)
chips = [('NestJS', PINK), ('PostgreSQL', ACCENT), ('Prisma', ACCENT2), ('Redis', YELLOW), ('Stripe', GREEN), ('Swagger', ORANGE)]
x, y = 850, 338
for label, color in chips:
    w = chip(d, x, y, label, color)
    if x + w > 1425:
        x, y = 850, y + 54
        w = chip(d, x, y, label, color)
    x += w + 12

d.text((850, 472), 'Client-facing value', font=H2, fill=TEXT)
bullet_list(d, 855, 532, [
    'SaaS-ready backend foundation',
    'Billing and subscription workflows',
    'Secure multi-user product architecture',
    'Clean codebase for fast feature expansion',
], 560, color=GREEN)
footer(d)
im.save(OUT / '01-launchkit-cover.png')

# 2. Architecture
im, d = canvas()
title(d, 'LaunchKit Architecture', 'Single-service NestJS SaaS backend with clear module boundaries and startup-friendly complexity')
rr(d, (610, 250, 990, 355), ACCENT, outline=ACCENT, width=1)
api_title = 'LaunchKit API'
api_sub = 'NestJS + Fastify + Swagger'
api_title_bb = d.textbbox((0, 0), api_title, font=H2)
api_sub_bb = d.textbbox((0, 0), api_sub, font=SMALL)
api_title_x = 610 + ((990 - 610) - (api_title_bb[2] - api_title_bb[0])) / 2
api_sub_x = 610 + ((990 - 610) - (api_sub_bb[2] - api_sub_bb[0])) / 2
d.text((api_title_x, 280), api_title, font=H2, fill=DARK)
d.text((api_sub_x, 320), api_sub, font=SMALL, fill=DARK)

nodes = [
    ('Auth', 'JWT + Refresh Tokens', (100, 280), PINK),
    ('Workspaces', 'Tenancy + Memberships', (100, 450), ACCENT2),
    ('Billing', 'Stripe Checkout + Webhooks', (100, 620), YELLOW),
    ('API Keys', 'Integration Credentials', (1140, 280), GREEN),
    ('Audit Logs', 'Security + Billing Trails', (1140, 450), ORANGE),
    ('Notifications', 'Workspace Activity Feed', (1140, 620), ACCENT),
]
for title_txt, sub, (x, y), stripe in nodes:
    rr(d, (x, y, x + 320, y + 105), PANEL)
    d.rectangle((x, y, x + 10, y + 105), fill=stripe)
    d.text((x + 24, y + 22), title_txt, font=H3, fill=TEXT)
    d.text((x + 24, y + 62), sub, font=SMALL, fill=MUTED)
    if x < 610:
        d.line((x + 320, y + 52, 610, 302), fill=ACCENT2, width=3)
    else:
        d.line((x, y + 52, 990, 302), fill=ACCENT2, width=3)

rr(d, (520, 450, 760, 570), PANEL2)
rr(d, (840, 450, 1080, 570), PANEL2)
d.text((580, 485), 'PostgreSQL', font=H3, fill=TEXT)
fit_text_block(d, 545, 522, 'Users • Workspaces • Billing', [16,15,14], MUTED, 190, 4)
d.text((928, 485), 'Redis', font=H3, fill=TEXT)
fit_text_block(d, 872, 522, 'Cache • queues • future scale', [16,15,14], MUTED, 180, 4)
footer(d)
im.save(OUT / '02-launchkit-architecture.png')

# 3. Features
im, d = canvas()
title(d, 'Key SaaS Backend Features', 'The product modules founders commonly need before a SaaS platform can scale')
feature_boxes = [
    ('Authentication', ['Access + refresh tokens', 'Password hashing', 'Session rotation'], ACCENT),
    ('Tenancy', ['Workspace isolation', 'Membership model', 'Role-scoped access'], GREEN),
    ('Billing', ['Stripe checkout', 'Webhook sync', 'Plan upgrades'], YELLOW),
    ('Security', ['API key hashing', 'Audit visibility', 'Protected operations'], PINK),
]
coords = [(90, 260), (830, 260), (90, 510), (830, 510)]
for (name, items, color), (x, y) in zip(feature_boxes, coords):
    rr(d, (x, y, x + 680, y + 180), PANEL)
    d.rectangle((x, y, x + 12, y + 180), fill=color)
    d.text((x + 28, y + 26), name, font=H2, fill=TEXT)
    bullet_list(d, x + 34, y + 78, items, 560, gap=10, color=color, fnt=SMALL)
footer(d)
im.save(OUT / '03-launchkit-features.png')

# 4. Billing flow
im, d = canvas()
title(d, 'Stripe Billing Flow', 'Hosted checkout plus webhook-driven subscription sync for production-style SaaS billing')
steps = [
    ('1. Select plan', 'FREE / PRO / SCALE'),
    ('2. Create checkout', 'Stripe session created'),
    ('3. Complete payment', 'Hosted checkout flow'),
    ('4. Receive webhook', 'Subscription event sync'),
    ('5. Update workspace', 'Plan and billing state saved'),
]
box_w = 230
start_x = 70
for i, (head, sub) in enumerate(steps):
    x = start_x + i * 300
    rr(d, (x, 360, x + box_w, 540), PANEL if i % 2 == 0 else PANEL2)
    fit_text_block(d, x + 18, 395, head, [22,20,18], TEXT, box_w - 36, 4)
    fit_text_block(d, x + 18, 448, sub, [18,17,16], MUTED, box_w - 36, 4)
    if i < len(steps) - 1:
        mid_y = 450
        d.line((x + box_w + 8, mid_y, x + 284, mid_y), fill=ACCENT2, width=5)
        d.polygon([(x + 284, mid_y), (x + 270, mid_y - 9), (x + 270, mid_y + 9)], fill=ACCENT2)

rr(d, (500, 620, 1100, 710), PANEL)
fit_text_block(d, 530, 650, 'Outcome: billing state stays aligned across Stripe, workspace plan, and audit trail.', [18,17,16], TEXT, 540, 4)
footer(d)
im.save(OUT / '04-launchkit-billing-flow.png')

# 5. Data model
im, d = canvas()
title(d, 'Data Model Highlights', 'Relational SaaS modeling designed for auth, billing, permissions, and integration workflows')
entities = [
    ('User', ['email', 'password hash', 'refresh token hash']),
    ('Workspace', ['name', 'slug', 'plan', 'stripe customer id']),
    ('Membership', ['user id', 'workspace id', 'role']),
    ('Subscription', ['workspace id', 'stripe subscription id', 'status']),
    ('ApiKey', ['prefix', 'hashed secret', 'revokedAt']),
    ('AuditLog', ['actor', 'action', 'entity ref', 'metadata']),
]
coords = [(90, 250), (520, 250), (950, 250), (90, 520), (520, 520), (950, 520)]
for (name, fields), (x, y) in zip(entities, coords):
    rr(d, (x, y, x + 360, y + 175), PANEL)
    d.text((x + 24, y + 20), name, font=H2, fill=TEXT)
    fy = y + 68
    for fld in fields:
        fit_text_block(d, x + 24, fy, f'• {fld}', [18,17,16,15], MUTED, 292, 4)
        fy += 29
for x1, y1, x2, y2 in [
    (450, 332, 520, 332),
    (880, 332, 950, 332),
    (270, 415, 270, 520),
    (700, 415, 700, 520),
    (1130, 415, 1130, 520),
]:
    d.line((x1, y1, x2, y2), fill=ACCENT2, width=3)
footer(d)
im.save(OUT / '05-launchkit-data-model.png')

# 6. Swagger-style API screenshot
im, d = canvas()
title(d, 'Swagger / API Docs Preview', 'Client-friendly API surface for auth, workspaces, billing, API keys, audit logs, and notifications')
rr(d, (80, 230, 1520, 760), '#0f1529')
rr(d, (105, 255, 1495, 315), '#1a2548')
d.text((135, 274), 'LaunchKit API Docs', font=H2, fill=TEXT)
chip(d, 1215, 267, 'v1', ACCENT, DARK)
chip(d, 1285, 267, 'Bearer Auth', GREEN, DARK)
sections = [
    ('POST', '/auth/login', '#49cc90'),
    ('POST', '/auth/refresh', '#49cc90'),
    ('GET', '/workspaces', '#61affe'),
    ('GET', '/workspaces/{slug}', '#61affe'),
    ('POST', '/billing/checkout', '#49cc90'),
    ('POST', '/billing/webhooks/stripe', '#fca130'),
    ('GET', '/api-keys', '#61affe'),
    ('POST', '/api-keys', '#49cc90'),
    ('GET', '/audit-logs', '#61affe'),
    ('GET', '/notifications', '#61affe'),
]
y = 340
for method, route, color in sections:
    rr(d, (115, y, 1480, y + 44), PANEL)
    rr(d, (132, y + 7, 228, y + 37), color, outline=color, width=1, r=10)
    method_bb = d.textbbox((0, 0), method, font=SMALL)
    d.text((180 - (method_bb[2]-method_bb[0])/2, y + 12), method, font=SMALL, fill=DARK)
    d.text((255, y + 11), route, font=SMALL, fill=TEXT)
    y += 50
footer(d, 'ashishssoni / LaunchKit • Swagger-style portfolio visual')
im.save(OUT / '06-launchkit-swagger-preview.png')

# 7. ER diagram
im, d = canvas()
title(d, 'Database ER Diagram', 'Relational data model for authentication, tenancy, billing, API access, and auditability')
entities = [
    ('User', ['id', 'email', 'passwordHash', 'refreshTokenHash'], (80, 250)),
    ('Workspace', ['id', 'name', 'slug', 'plan', 'stripeCustomerId'], (520, 250)),
    ('Membership', ['id', 'userId', 'workspaceId', 'role'], (960, 250)),
    ('Subscription', ['id', 'workspaceId', 'stripeSubscriptionId', 'status'], (80, 530)),
    ('ApiKey', ['id', 'workspaceId', 'prefix', 'hashedSecret'], (520, 530)),
    ('AuditLog', ['id', 'workspaceId', 'actorUserId', 'action'], (960, 530)),
]
for name, fields, (x, y) in entities:
    rr(d, (x, y, x + 360, y + 170), PANEL)
    d.rectangle((x, y, x + 360, y + 42), fill=PANEL2)
    d.text((x + 22, y + 10), name, font=H3, fill=TEXT)
    fy = y + 60
    for fld in fields:
        d.text((x + 22, fy), f'• {fld}', font=SMALL, fill=MUTED)
        fy += 24
# relationships
rels = [
    ((440, 335), (520, 335), '1..n'),
    ((880, 335), (960, 335), '1..n'),
    ((260, 420), (260, 530), '1..1'),
    ((700, 420), (700, 530), '1..n'),
    ((1140, 420), (1140, 530), '1..n'),
]
for (x1, y1), (x2, y2), label in rels:
    d.line((x1, y1, x2, y2), fill=ACCENT2, width=3)
    lx = (x1 + x2) / 2 - 18
    ly = (y1 + y2) / 2 - 18
    rr(d, (lx, ly, lx + 46, ly + 28), '#14203f', outline=ACCENT2, width=1, r=10)
    d.text((lx + 8, ly + 6), label, font=TINY, fill=TEXT)
footer(d, 'ashishssoni / LaunchKit • PostgreSQL relational model')
im.save(OUT / '07-launchkit-er-diagram.png')

# 8. Stripe billing flow diagram
im, d = canvas()
title(d, 'Stripe Billing Flow Diagram', 'Checkout session, payment completion, webhook sync, and SaaS plan activation lifecycle')
flow = [
    ('Workspace selects plan', 'FREE / PRO / SCALE', 70, 360, PANEL),
    ('Backend creates checkout session', 'Stripe Checkout session', 355, 360, PANEL2),
    ('Customer completes payment', 'Hosted Stripe page', 640, 360, PANEL),
    ('Stripe sends webhook', 'subscription.updated / checkout.session.completed', 925, 360, PANEL2),
    ('LaunchKit syncs billing state', 'Workspace plan + subscription saved', 1210, 360, PANEL),
]
for i, (head, sub, x, y, fill) in enumerate(flow):
    rr(d, (x, y, x + 250, y + 180), fill)
    fit_text_block(d, x + 18, y + 28, head, [22,20,18], TEXT, 214, 4)
    fit_text_block(d, x + 18, y + 98, sub, [18,17,16], MUTED, 214, 4)
    if i < len(flow) - 1:
        mid_y = y + 90
        d.line((x + 250 + 8, mid_y, x + 250 + 28, mid_y), fill=ACCENT2, width=5)
        d.polygon([(x + 250 + 28, mid_y), (x + 250 + 14, mid_y - 8), (x + 250 + 14, mid_y + 8)], fill=ACCENT2)
rr(d, (450, 620, 1150, 710), PANEL)
fit_text_block(d, 485, 648, 'Business outcome: billing stays synchronized between Stripe events and internal workspace subscription state.', [20,18,17], TEXT, 630, 4)
footer(d, 'ashishssoni / LaunchKit • Stripe billing architecture visual')
im.save(OUT / '08-launchkit-stripe-billing-diagram.png')

print('Generated portfolio assets in', OUT)
