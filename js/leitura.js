// Projeto Aster – utilidades das páginas públicas de leitura (topo, rodapé, texto seguro)
export function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

export function sanitizar(html){
  const d=new DOMParser().parseFromString('<div>'+(html||'')+'</div>','text/html');
  const raiz=d.body.firstChild;
  raiz.querySelectorAll('script,style,object,embed,form,link,meta,base').forEach(e=>e.remove());
  raiz.querySelectorAll('iframe').forEach(f=>{
    if(!/^https:\/\/(www\.)?youtube\.com\/embed\//.test(f.getAttribute('src')||'')) f.remove();
  });
  raiz.querySelectorAll('*').forEach(e=>{
    Array.from(e.attributes).forEach(a=>{
      const n=a.name.toLowerCase(), v=a.value;
      if(n.indexOf('on')===0) e.removeAttribute(a.name);
      else if((n==='href'||n==='src') && /^\s*(javascript|vbscript):/i.test(v)) e.removeAttribute(a.name);
      else if(n==='src' && /^\s*data:/i.test(v) && !/^\s*data:image\//i.test(v)) e.removeAttribute(a.name);
      else if(n==='style' && /expression|url\(|javascript/i.test(v)) e.removeAttribute(a.name);
    });
    if(e.tagName==='A'){e.setAttribute('target','_blank');e.setAttribute('rel','noopener noreferrer');}
  });
  return raiz.innerHTML;
}

export function dataBonita(v){
  try{
    const d=v&&v.toDate?v.toDate():new Date(v);
    return isNaN(d)?'':d.toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'});
  }catch(e){return '';}
}

export function dataHoraBonita(v){
  try{
    const d=v&&v.toDate?v.toDate():new Date(v);
    if(isNaN(d))return '';
    return d.toLocaleDateString('pt-BR',{day:'numeric',month:'long',year:'numeric'})+' às '+d.toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'});
  }catch(e){return '';}
}

export function montarTopoRodape(){
  const topo=document.createElement('header');
  topo.className='topo';
  topo.innerHTML='<a href="index.html" class="logo-aster"><img class="logo-img" src="img/logo.svg" alt="" width="32" height="32"> Projeto Aster</a>'+
    '<nav class="nav-topo"><a href="biblia.html">Bíblia</a><a href="edicoes.html">Editorial</a><a href="artigos.html">Artigos</a><a href="estudos.html">Estudos</a><a href="biblioteca.html">Biblioteca</a><a href="apoiar.html">Apoie</a><a href="login.html">Entrar</a></nav>';
  document.body.prepend(topo);
  const rod=document.createElement('footer');
  rod.className='rodape';
  rod.innerHTML='<img class="logo-rodape" src="img/logo.svg" alt="" width="18" height="18" style="vertical-align:middle;margin-right:6px"> Projeto Aster · <a href="equipe.html">Nossa Equipe</a> · <a href="termos.html">Termos de uso</a> · <a href="privacidade.html">Privacidade</a>';
  document.body.append(rod);
  import('./site-config.js').then(m=>m.aplicarConfigSite()).catch(()=>{});
}

export function tituloPublico(v){ const m={'editor-chefe':'Editor-chefe','colunista':'Colunista'}; return m[v]||''; }

export function trilhaHTML(partes){
  return '<nav class="trilha">'+partes.map((p,i)=>{
    const sep = i>0 ? '<span class="sep">›</span>' : '';
    const item = p.href ? '<a href="'+esc(p.href)+'">'+esc(p.texto)+'</a>' : '<span class="atual">'+esc(p.texto)+'</span>';
    return sep+item;
  }).join('')+'</nav>';
}
