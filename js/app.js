const $=s=>document.querySelector(s),esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const IC={home:'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',exams:'M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h8',scan:'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16',analysis:'M5 21V10M12 21V4M19 21v-7',settings:'M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M14 4v4M8 10v4M16 16v4'};
const icon=n=>`<svg class="ic" viewBox="0 0 24 24"><path d="${IC[n]}"/></svg>`;
const TABS=['home','exams','scan','analysis','settings'];
let S={exams:[],results:[],prefs:{id:'prefs',lang:'en',institute:''}},tab='home';
const toast=m=>{const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove('on'),1800)};
const fmt=d=>d?new Date(d).toLocaleDateString(LANG==='ar'?'ar-IQ':'en-GB'):'';
const evalCount=id=>S.results.filter(r=>r.examId===id).length;
const status=e=>e.archived?'archived':(e.keyComplete?'ready':'draft');
async function load(){const[ex,rs,st]=await Promise.all([DB.all('exams'),DB.all('results'),DB.all('settings')]);S.exams=ex.sort((a,b)=>b.created-a.created);S.results=rs;const p=st.find(x=>x.id==='prefs');if(p)S.prefs=p}
function applyLang(){LANG=S.prefs.lang;document.documentElement.lang=LANG;document.documentElement.dir=LANG==='ar'?'rtl':'ltr'}
function examCard(e){const n=evalCount(e.id),s=status(e);return `<article class="card ex"><div class="row" style="align-items:start"><div><h3>${esc(e.title)}</h3><div class="meta">${esc(e.subject||'')}${e.subject?' · ':''}${fmt(e.created)}</div></div><span class="chip ${s}" style="flex:none;text-align:center">${t(s)}</span></div>
<div class="meta" style="margin-top:6px">${e.questions} ${t('qs')} · ${n} ${t('evaluated')}</div>
<div class="acts"><button class="btn ghost sm" data-a="edit" data-id="${e.id}">${t('edit')}</button><button class="btn ghost sm" data-a="dup" data-id="${e.id}">${t('duplicate')}</button><button class="btn ghost sm" data-a="arc" data-id="${e.id}">${t(e.archived?'unarchive':'archive')}</button><button class="btn ghost sm" data-a="del" data-id="${e.id}">${t('delete')}</button></div></article>`}
const empty=m=>`<div class="empty">${m}</div>`;
const VIEWS={
home(){const rec=S.exams.filter(e=>!e.archived).slice(0,3),sc=[...S.results].sort((a,b)=>b.scanned-a.scanned).slice(0,3);
return `<p class="hello">${t('welcome')}${S.prefs.institute?'، '+esc(S.prefs.institute):''}</p><p class="sub">${t('welcomeSub')}</p>
<div class="row"><button class="btn" data-a="new">${t('createExam')}</button><button class="btn alt" data-go="scan">${t('scanSheet')}</button></div>
<div class="row" style="margin-top:12px"><div class="card stat"><b>${S.exams.length}</b><span>${t('examsCount')}</span></div><div class="card stat"><b>${S.results.length}</b><span>${t('sheetsEvaluated')}</span></div></div>
<h2>${t('recent')}</h2>${rec.length?rec.map(examCard).join(''):empty(t('noExams'))}
<h2>${t('recentScans')}</h2>${sc.length?sc.map(r=>`<div class="card">${esc(r.studentId||'')} · ${esc((S.exams.find(e=>e.id===r.examId)||{}).title||'')}</div>`).join(''):empty(t('noScans'))}
<button class="btn ghost" data-go="analysis">${t('reports')}</button>`},
exams(){return (S.exams.length?S.exams.map(examCard).join(''):`<div class="empty"><b>${t('noExams')}</b><br>${t('noExamsHint')}</div>`)+`<button class="btn fab" data-a="new">+ ${t('createExam')}</button>`},
scan(){return `<div class="card empty">${icon('scan')}<p>${t('scanSoon')}</p></div>`},
analysis(){return S.results.length?'':`<div class="card empty">${icon('analysis')}<p>${t('analysisSoon')}</p></div>`},
settings(){return `<div class="card"><label for="lg">${t('language')}</label><select id="lg"><option value="en"${LANG==='en'?' selected':''}>English</option><option value="ar"${LANG==='ar'?' selected':''}>العربية</option></select>
<label for="inst">${t('institute')}</label><input id="inst" value="${esc(S.prefs.institute)}"></div>
<h2>${t('data')}</h2><div class="card"><button class="btn alt" data-a="backup">${t('backup')}</button><label for="rf">${t('restore')}</label><input id="rf" type="file" accept="application/json"><p class="meta" id="sto"></p></div>`}};
function render(){applyLang();$('#pageTitle').textContent=t(tab);document.title='ExamFlow · '+t(tab);
$('#tabs').innerHTML=TABS.map(k=>`<a href="#${k}" class="${k===tab?'on':''}" ${k===tab?'aria-current="page"':''}>${icon(k)}${t(k)}</a>`).join('');
$('#view').innerHTML=VIEWS[tab]();if(tab==='settings')storage()}
async function storage(){if(navigator.storage&&navigator.storage.estimate){const{usage}=await navigator.storage.estimate();const el=$('#sto');if(el)el.textContent=t('storage')+': '+(usage/1048576).toFixed(2)+' MB'}}
function form(e){const x=e||{title:'',subject:'',date:'',duration:60,questions:100,options:5};const d=$('#dlg');
d.innerHTML=`<h3>${t(e?'editExam':'newExam')}</h3><label for="f1">${t('title')}</label><input id="f1" value="${esc(x.title)}"><label for="f2">${t('subject')}</label><input id="f2" value="${esc(x.subject)}">
<div class="row"><div><label for="f3">${t('date')}</label><input id="f3" type="date" value="${esc(x.date)}"></div><div><label for="f4">${t('duration')}</label><input id="f4" type="number" min="1" value="${x.duration}"></div></div>
<div class="row"><div><label for="f5">${t('questions')}</label><input id="f5" type="number" min="1" max="300" value="${x.questions}"></div><div><label for="f6">${t('options')}</label><select id="f6">${[2,3,4,5,6,7,8,9,10].map(n=>`<option${n===x.options?' selected':''}>${n}</option>`).join('')}</select></div></div>
<p class="meta" id="err" style="color:var(--bad)"></p><div class="row"><button class="btn ghost" id="c">${t('cancel')}</button><button class="btn" id="s">${t('save')}</button></div>`;
d.showModal();$('#c').onclick=()=>d.close();
$('#s').onclick=async()=>{const q=+$('#f5').value,ti=$('#f1').value.trim();if(!ti||!Number.isInteger(q)||q<1||q>300){$('#err').textContent=t('required');return}
const o=Object.assign({id:DB.uid(),created:Date.now(),keyComplete:false,archived:false},e,{title:ti,subject:$('#f2').value.trim(),date:$('#f3').value,duration:+$('#f4').value||60,questions:q,options:+$('#f6').value});
await DB.put('exams',o);d.close();await load();render();toast(t('saved'))}}
document.addEventListener('click',async ev=>{const b=ev.target.closest('[data-a],[data-go]');if(!b)return;
if(b.dataset.go){location.hash=b.dataset.go;return}
const a=b.dataset.a,e=S.exams.find(x=>x.id===b.dataset.id);
if(a==='new')form();else if(a==='edit')form(e);
else if(a==='dup'){await DB.put('exams',{...e,id:DB.uid(),title:e.title+' ('+t('copy')+')',created:Date.now(),archived:false});await load();render()}
else if(a==='arc'){await DB.put('exams',{...e,archived:!e.archived});await load();render()}
else if(a==='del'){if(confirm(t('confirmDelete'))){for(const r of S.results.filter(r=>r.examId===e.id))await DB.del('results',r.id);await DB.del('exams',e.id);await load();render();toast(t('deleted'))}}
else if(a==='backup'){const u=URL.createObjectURL(new Blob([JSON.stringify(await DB.dump())],{type:'application/json'})),l=document.createElement('a');l.href=u;l.download='examflow-backup-'+new Date().toISOString().slice(0,10)+'.json';l.click();URL.revokeObjectURL(u)}});
document.addEventListener('change',async ev=>{const i=ev.target;
if(i.id==='lg'){S.prefs.lang=i.value;await DB.put('settings',S.prefs);render()}
else if(i.id==='rf'&&i.files[0]){try{const o=JSON.parse(await i.files[0].text());await DB.restore(o);await load();render();toast(t('restored'))}catch(_){toast(t('invalid'))}}});
document.addEventListener('input',async ev=>{if(ev.target.id==='inst'){S.prefs.institute=ev.target.value;await DB.put('settings',S.prefs)}});
function route(){const h=location.hash.slice(1);tab=TABS.includes(h)?h:'home';render();scrollTo(0,0)}
addEventListener('hashchange',route);
(async()=>{await load();route();if('serviceWorker'in navigator)navigator.serviceWorker.register('service-worker.js').catch(()=>{})})();
