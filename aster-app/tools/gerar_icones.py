# Gera o ícone, o ícone adaptativo e a imagem de abertura do app Aster (só Python, sem instalar nada).
import math, struct, zlib, os

AZUL = (0x32, 0x55, 0xFF)
AMARELO = (0xFF, 0xFC, 0x72)
CENTRO = (358.4, 367.0)
PONTAS = [(359.0, 221.8), (471.0, 277.2), (499.2, 400.5), (421.5, 498.6), (297.6, 499.2), (220.1, 400.5), (247.6, 276.4)]
LARG = 52.9 / 2  # meia largura do traço
BASE = 720.0

def dist_segmento(px, py, ax, ay, bx, by):
    dx, dy = bx - ax, by - ay
    t = ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)
    t = 0 if t < 0 else 1 if t > 1 else t
    qx, qy = ax + t * dx, ay + t * dy
    return math.hypot(px - qx, py - qy)

def png(caminho, tam, escala, fundo):
    """escala: tamanho do desenho em relação à imagem; fundo: cor (RGB) ou None para transparente."""
    k = tam * escala / BASE
    off = (tam - BASE * k) / 2
    cx, cy = CENTRO
    seg = [((cx * k + off, cy * k + off), (x * k + off, y * k + off)) for x, y in PONTAS]
    r = LARG * k
    cov = bytearray(tam * tam)
    for (a, b) in seg:
        x0 = max(0, int(min(a[0], b[0]) - r - 2)); x1 = min(tam - 1, int(max(a[0], b[0]) + r + 2))
        y0 = max(0, int(min(a[1], b[1]) - r - 2)); y1 = min(tam - 1, int(max(a[1], b[1]) + r + 2))
        for y in range(y0, y1 + 1):
            for x in range(x0, x1 + 1):
                d = dist_segmento(x + 0.5, y + 0.5, a[0], a[1], b[0], b[1])
                c = r + 0.5 - d
                c = 0 if c < 0 else 1 if c > 1 else c
                v = int(c * 255 + 0.5)
                i = y * tam + x
                if v > cov[i]: cov[i] = v
    linhas = bytearray()
    for y in range(tam):
        linhas.append(0)
        for x in range(tam):
            c = cov[y * tam + x]
            if fundo is None:
                linhas += bytes((AMARELO[0], AMARELO[1], AMARELO[2], c))
            else:
                f = c / 255.0
                linhas += bytes(int(round(fundo[j] * (1 - f) + AMARELO[j] * f)) for j in range(3))
    def chunk(t, d): return struct.pack('>I', len(d)) + t + d + struct.pack('>I', zlib.crc32(t + d) & 0xffffffff)
    cab = struct.pack('>IIBBBBB', tam, tam, 8, 6 if fundo is None else 2, 0, 0, 0)
    with open(caminho, 'wb') as f:
        f.write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', cab) + chunk(b'IDAT', zlib.compress(bytes(linhas), 9)) + chunk(b'IEND', b''))

pasta = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'assets')
os.makedirs(pasta, exist_ok=True)
png(os.path.join(pasta, 'icon.png'), 1024, 1.0, AZUL)             # ícone completo (iOS e lojas)
png(os.path.join(pasta, 'adaptive-icon.png'), 1024, 0.62, None)   # Android: só o desenho, na zona segura
png(os.path.join(pasta, 'splash-icon.png'), 512, 0.9, None)       # tela de abertura
print('Ícones gerados em', os.path.normpath(pasta))
