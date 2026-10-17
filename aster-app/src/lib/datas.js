const MESES = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const DIAS = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];

export function dataLonga(d) { return DIAS[d.getDay()] + ', ' + d.getDate() + ' de ' + MESES[d.getMonth()]; }
export function dataCurta(d) { return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear(); }
export function dataBonita(iso) {
  const d = new Date(iso);
  if (!iso || isNaN(d.getTime())) return '';
  return d.getDate() + ' de ' + MESES[d.getMonth()] + ' de ' + d.getFullYear();
}
export function diaDoAno(agora) {
  const h = agora || new Date();
  return Math.floor((new Date(h.getFullYear(), h.getMonth(), h.getDate()) - new Date(h.getFullYear(), 0, 1)) / 86400000);
}
export function hhmm(h, m) { return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0'); }
