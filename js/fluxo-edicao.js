// Regras do fluxo de edições: ordem, numeração e conferência antes de publicar.
// (módulo separado para poder ser testado sem o Firebase)
export const ROTULO_FASE = {
  rascunho: 'Rascunho (não indexado)', em_revisao: 'Aguardando aprovação', devolvido: 'Reprovado',
  aprovado: 'Aprovado', indexado: 'Aprovado', publicado: 'Publicado'
};
const FASES_CONHECIDAS = ['rascunho', 'em_revisao', 'devolvido', 'aprovado', 'indexado', 'publicado'];
const num = v => (typeof v === 'number' && !isNaN(v)) ? v : 99;
const textoPuro = h => String(h || '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim();

// Matéria de capa sempre primeiro; depois pela ordem escolhida; empate: por título.
export function ordenarMaterias(lista) {
  return lista.slice().sort((a, b) =>
    (b.materiaCapa ? 1 : 0) - (a.materiaCapa ? 1 : 0)
    || (num(a.ordemEdicao) - num(b.ordemEdicao))
    || String(a.titulo || '').localeCompare(String(b.titulo || ''), 'pt-BR'));
}

// Próximo número da sequência (edições especiais também entram na contagem).
export function proximoNumero(edicoes) {
  const nums = edicoes.map(e => Number(e.numero)).filter(n => Number.isFinite(n) && n > 0);
  return (nums.length ? Math.max(...nums) : 0) + 1;
}
export function nomeEdicao(numero, especial) { return 'Edição ' + numero + (especial ? ' · Especial' : ''); }

// Sobe ou desce um artigo. A matéria de capa não sai do primeiro lugar.
export function mover(ordenada, id, delta) {
  const a = ordenada.slice(), i = a.findIndex(m => m.id === id), j = i + delta;
  if (i < 0 || j < 0 || j >= a.length) return a;
  if (a[i].materiaCapa || a[j].materiaCapa) return a;
  [a[i], a[j]] = [a[j], a[i]];
  return a;
}
// Só devolve o que realmente mudou de posição (1, 2, 3...).
export function renumerar(ordenada) {
  return ordenada.map((m, i) => ({ id: m.id, ordemEdicao: i + 1, antes: m.ordemEdicao })).filter(x => x.antes !== x.ordemEdicao).map(x => ({ id: x.id, ordemEdicao: x.ordemEdicao }));
}

// Confere se a edição pode ser publicada.
export function avaliarPublicacao(materias, ed) {
  const rascunhos = materias.filter(m => !m.status || m.status === 'rascunho');
  const indexadas = materias.filter(m => m.status && m.status !== 'rascunho');
  const titulo = m => '• ' + (m.titulo || '(sem título)') + (m.autorNome ? ' — ' + m.autorNome : '');
  const pendentes = indexadas.filter(m => m.status === 'em_revisao');
  const reprovadas = indexadas.filter(m => m.status === 'devolvido');
  const aprovadas = indexadas.filter(m => m.status === 'aprovado' || m.status === 'indexado');
  const jaPublicadas = indexadas.filter(m => m.status === 'publicado');
  const estranhas = indexadas.filter(m => !FASES_CONHECIDAS.includes(m.status));
  const bloqueios = [], avisos = [];
  if (pendentes.length) bloqueios.push('Aguardando aprovação (' + pendentes.length + '):\n' + pendentes.map(titulo).join('\n'));
  if (reprovadas.length) bloqueios.push('Reprovados, ainda com o autor (' + reprovadas.length + '):\n' + reprovadas.map(titulo).join('\n'));
  if (estranhas.length) bloqueios.push('Situação desconhecida (' + estranhas.length + '):\n' + estranhas.map(titulo).join('\n'));
  if (!aprovadas.length && !jaPublicadas.length && !pendentes.length && !reprovadas.length && !estranhas.length) bloqueios.push('A edição não tem nenhum artigo aprovado.');
  else if (!aprovadas.length && !jaPublicadas.length && !bloqueios.length) bloqueios.push('A edição não tem nenhum artigo aprovado.');
  const capas = indexadas.filter(m => m.materiaCapa);
  if (!capas.length) avisos.push('nenhuma matéria de capa marcada');
  if (capas.length > 1) avisos.push('mais de uma matéria de capa marcada');
  if (!textoPuro(ed && ed.cartaLeitor)) avisos.push('sem carta ao leitor');
  if (!(ed && ed.capaUrl)) avisos.push('sem imagem de capa da edição');
  return { bloqueios, avisos, aprovadas, jaPublicadas, rascunhos, pendentes, reprovadas };
}
