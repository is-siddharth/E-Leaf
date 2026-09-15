const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
function show(el){el?.classList.remove('hidden')}
function hide(el){el?.classList.add('hidden')}
function initials(name){return (name||'L').split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function escapeHtml(value){return String(value??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]))}
