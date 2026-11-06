# Projeto Aster - liga o ajuste de tons (css/aster-tons.css) e troca "mes" por "semana" no editorial
import glob, re
LINK = '<link rel="stylesheet" href="css/aster-tons.css">'
n = 0
for a in sorted(glob.glob('*.html')):
    s0 = open(a, encoding='utf-8').read(); s = s0
    if 'aster-visual.css' in s and 'aster-tons.css' not in s:
        s = s.replace('</head>', LINK + '\n</head>', 1)
    for ant, novo in (('Editorial do mês', 'Editorial da semana'), ('Cada mês, um tema específico', 'Cada semana, um tema específico'), ('editorial mensal', 'editorial semanal')):
        s = s.replace(ant, novo)
    if s != s0:
        open(a, 'w', encoding='utf-8').write(s); n += 1; print('ok:', a)
print('paginas alteradas:', n)
