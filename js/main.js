/* BancoLele · SPA estática para GitHub Pages.
 * CONTRATO PÚBLICO: estos IDs son estables. Si se cambian, deben actualizarse
 * index.html, el menú, los enlaces directos y README.md con autorización.
 */
const TAB_IDS = Object.freeze(['main', 'credit-card', 'payroll', 'fraud', 'blog']);
const TAB_NAMES = Object.freeze({main:'Inicio', 'credit-card':'Tarjeta de crédito', payroll:'Nómina', fraud:'Fraude', blog:'Blog'});
const STORAGE_CASES = 'bancolele-demo-cases-v1';
const STORAGE_COUNTER = 'bancolele-demo-counter-v1';
const STORAGE_LOCK = 'bancolele-demo-card-lock-v1';

const CARD_PRODUCTS = Object.freeze({
  esencial:{name:'Lele Esencial',description:'Ideal para descubrir lo esencial.',fee:'$0 MXN',rate:'49.9%',points:'1 punto / $20',cat:'64.2%'},
  puntos:{name:'Lele Puntos',description:'Recompensas imaginarias para tus planes.',fee:'$650 MXN',rate:'45.9%',points:'2 puntos / $20',cat:'61.4%'},
  raices:{name:'Lele Raíces',description:'Una mirada premium a cada experiencia.',fee:'$1,200 MXN',rate:'42.9%',points:'3 puntos / $20',cat:'58.6%'}
});

const FRAUD_TRANSACTIONS = Object.freeze([
  {id:'BL-TX-104',name:'Tienda Horizonte',date:'2026-10-25',amount:1280},
  {id:'BL-TX-208',name:'Suscripción Nube',date:'2026-10-23',amount:399},
  {id:'BL-TX-312',name:'Café Alameda',date:'2026-10-20',amount:245},
  {id:'BL-TX-419',name:'Compra en línea',date:'2026-10-18',amount:2350}
]);

const SEED_CASES = Object.freeze([
  {id:'BL-DEMO-1048',date:'2026-10-22',type:'Cargo no reconocido',transaction:'BL-TX-104',status:'En revisión',timeline:[{date:'2026-10-22',label:'Reporte recibido (simulación)'},{date:'2026-10-23',label:'Caso marcado en revisión'}]},
  {id:'BL-DEMO-1042',date:'2026-10-18',type:'Suplantación de identidad',transaction:'BL-TX-208',status:'Información adicional requerida',timeline:[{date:'2026-10-18',label:'Reporte recibido (simulación)'},{date:'2026-10-19',label:'Información adicional requerida (ejemplo)'}]},
  {id:'BL-DEMO-1031',date:'2026-10-10',type:'Cobro duplicado',transaction:'BL-TX-312',status:'Resuelto',timeline:[{date:'2026-10-10',label:'Disputa de ejemplo registrada'},{date:'2026-10-11',label:'Caso en revisión'},{date:'2026-10-13',label:'Caso resuelto (simulación)'}]},
  {id:'BL-DEMO-1026',date:'2026-10-06',type:'Phishing o mensaje sospechoso',transaction:'BL-TX-419',status:'Cerrado',timeline:[{date:'2026-10-06',label:'Reporte de ejemplo registrado'},{date:'2026-10-08',label:'Caso cerrado (simulación)'}]}
]);

const MOVEMENT_SEED = [
  {id:'PAY-1',title:'Nómina · Taller Creativo',date:'2026-10-15',amount:12450,type:'income'},
  {id:'PAY-2',title:'Supermercado Jacaranda',date:'2026-10-16',amount:-1185.5,type:'expense'},
  {id:'PAY-3',title:'Librería Papel',date:'2026-10-17',amount:-629,type:'expense'},
  {id:'PAY-4',title:'Cafetería Reforma',date:'2026-10-19',amount:-185,type:'expense'},
  {id:'PAY-5',title:'Servicios digitales',date:'2026-10-21',amount:-349,type:'expense'}
];

const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const $ = (selector, root=document) => root.querySelector(selector);
const money = value => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(value);
const localISODate = (date=new Date()) => new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,10);
const localDateTime = (date=new Date()) => new Date(date.getTime()-date.getTimezoneOffset()*60000).toISOString().slice(0,16);
const dateLabel = iso => { const [y,m,d] = iso.split('-').map(Number); return new Intl.DateTimeFormat('es-MX',{day:'numeric',month:'short',year:'numeric'}).format(new Date(y,m-1,d)); };
const safeHTML = value => String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
function safeRead(key,fallback){try{const value=localStorage.getItem(key);return value===null?fallback:JSON.parse(value);}catch{return fallback;}}
function safeWrite(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
function nextReference(prefix='BL-DEMO'){const next=Math.max(5000,Number(safeRead(STORAGE_COUNTER,5000))||5000)+1;safeWrite(STORAGE_COUNTER,next);return `${prefix}-${next}`;}
function toast(message){const node=$('#toast');node.textContent=message;node.hidden=false;clearTimeout(toast.timeout);toast.timeout=setTimeout(()=>{node.hidden=true;},4000);}

let activeTab='main';
let selectedProduct='esencial';
let selectedDispute='';
let activeCase='BL-DEMO-1048';
let cases=[];
let cardLocked=Boolean(safeRead(STORAGE_LOCK,false));
let payrollBalance=28450.80;
let payrollMovements=[...MOVEMENT_SEED];
let currentMovementFilter='all';

function routeFromHash(){const id=decodeURIComponent(location.hash.slice(1));return TAB_IDS.includes(id)?id:'main';}
function closeMobileMenu(){const nav=$('#primary-nav');nav.classList.remove('is-open');$('#menu-toggle').setAttribute('aria-expanded','false');$('#menu-toggle').setAttribute('aria-label','Abrir menú');}
function activateTab(id,{focus=false,scroll=true}={}){
  const valid=TAB_IDS.includes(id)?id:'main';
  activeTab=valid;
  $$('.view').forEach(section=>{section.hidden=section.id!==valid;});
  $$('[data-tab-link]').forEach(link=>{
    if(link.closest('.primary-nav')){if(link.getAttribute('href')===`#${valid}`)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');}
  });
  document.title=`${TAB_NAMES[valid]} | BancoLele — Demo`;
  closeMobileMenu();
  if(valid==='blog'){resetArticleView();}
  if(scroll){window.scrollTo({top:0,behavior:'auto'});}
  if(focus){const heading=$(`#${valid} h1`);if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}}
}
function navigate(id){
  if(!TAB_IDS.includes(id))return;
  // Un solo cambio de vista síncrono; pushState evita carreras con hashchange.
  if(location.hash!==`#${id}`)history.pushState(null,'',`#${id}`);
  activateTab(id,{focus:true});
}
function installNavigation(){
  document.addEventListener('click',event=>{
    const link=event.target.closest('[data-tab-link]');
    if(!link)return;
    if(event.metaKey||event.ctrlKey||event.shiftKey||event.altKey||event.button!==0)return;
    const id=link.getAttribute('href')?.slice(1);
    if(!TAB_IDS.includes(id))return;
    event.preventDefault();navigate(id);
  });
  window.addEventListener('hashchange',()=>activateTab(routeFromHash(),{focus:true}));
  window.addEventListener('popstate',()=>activateTab(routeFromHash(),{focus:true}));
  const toggle=$('#menu-toggle');toggle.addEventListener('click',()=>{
    const open=$('#primary-nav').classList.toggle('is-open');toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape')closeMobileMenu();});
  activateTab(routeFromHash(),{scroll:false});
}

function openDialog(dialog){if(!dialog)return;$$('dialog[open]').forEach(open=>open.close());dialog.showModal();document.body.classList.add('dialog-open');}
function installDialogs(){
  $$('dialog').forEach(dialog=>{
    dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
    dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();});
  });
  document.addEventListener('click',event=>{const button=event.target.closest('[data-close-dialog]');if(button)button.closest('dialog')?.close();});
}

function installGlobalReport(){
  const template=$('#report-button-template');
  $$('[data-report-slot]').forEach(slot=>slot.appendChild(template.content.cloneNode(true)));
  document.addEventListener('click',event=>{
    if(!event.target.closest('.report-trigger'))return;
    $('#problem-form').reset();$('#problem-success').hidden=true;
    $('#problem-form button[type="submit"]').textContent='Enviar reporte';
    $('#problem-origin').value=TAB_NAMES[activeTab];
    $('#problem-tab-id').value=activeTab;
    $('#problem-datetime').value=localDateTime();
    openDialog($('#problem-dialog'));
  });
  $('#problem-form').addEventListener('submit',event=>{
    event.preventDefault();
    const form=event.currentTarget;if(!form.reportValidity())return;
    const reference=nextReference('BL-PROBLEMA');
    const result=$('#problem-success');result.hidden=false;
    result.textContent=`✓ Reporte local ${reference} creado para ${TAB_NAMES[activeTab]} (ID: ${activeTab}). No se envió información a un banco ni a un servidor.`;
    form.querySelector('button[type="submit"]').textContent='Generar otro reporte';
  });
}

function chooseProduct(id,{scroll=false}={}){
  if(!CARD_PRODUCTS[id])return;
  selectedProduct=id;const item=CARD_PRODUCTS[id];
  $('#comparison-name').textContent=item.name;
  $('#comparison-description').textContent=item.description;
  $('#comparison-fee').textContent=item.fee;
  $('#comparison-rate').textContent=item.rate;
  $('#comparison-points').textContent=item.points;
  $('#comparison-cat').textContent=item.cat;
  $$('[data-choice]').forEach(button=>{const current=button.dataset.choice===id;button.classList.toggle('is-selected',current);button.setAttribute('aria-pressed',String(current));});
  if(scroll)$('#credit-comparison').scrollIntoView({behavior:'smooth',block:'start'});
}
function installCredit(){
  $$('[data-choice]').forEach(button=>button.addEventListener('click',()=>chooseProduct(button.dataset.choice)));
  $$('[data-select-product]').forEach(button=>button.addEventListener('click',()=>chooseProduct(button.dataset.selectProduct,{scroll:true})));
  $('#simulate-card-button').addEventListener('click',()=>{$('#card-choice-name').textContent=CARD_PRODUCTS[selectedProduct].name;openDialog($('#card-dialog'));});
}

function renderPayroll(){
  $('#payroll-balance').textContent=money(payrollBalance).replace('MXN','').trim();
  const target=$('#payroll-movements');target.replaceChildren();
  const items=payrollMovements.filter(item=>currentMovementFilter==='all'||item.type===currentMovementFilter);
  if(!items.length){const empty=document.createElement('p');empty.className='fine-print';empty.style.padding='0 24px';empty.textContent='No hay movimientos en esta categoría.';target.append(empty);return;}
  items.forEach(item=>{
    const row=document.createElement('div');row.className='movement-row';
    row.innerHTML=`<span class="movement-icon ${item.type}" aria-hidden="true">${item.type==='income'?'↘':'↗'}</span><div class="movement-info"><strong>${safeHTML(item.title)}</strong><small>${safeHTML(dateLabel(item.date))} · Movimiento ficticio</small></div><span class="movement-amount ${item.type}">${item.amount>0?'+ ':'− '}${safeHTML(money(Math.abs(item.amount)))}</span>`;
    target.append(row);
  });
}
function installPayroll(){
  renderPayroll();
  $('#simulate-payroll').addEventListener('click',()=>{
    payrollBalance+=12450;
    payrollMovements.unshift({id:`PAY-DEMO-${payrollMovements.length+1}`,title:'Depósito de nómina simulado',date:localISODate(),amount:12450,type:'income'});
    renderPayroll();toast('Depósito de $12,450.00 MXN agregado a la cuenta ficticia.');
  });
  $('#see-movements').addEventListener('click',()=>$('#movements-section').scrollIntoView({behavior:'smooth'}));
  $$('[data-movement-filter]').forEach(button=>button.addEventListener('click',()=>{
    currentMovementFilter=button.dataset.movementFilter;
    $$('[data-movement-filter]').forEach(other=>{const current=other===button;other.classList.toggle('active',current);other.setAttribute('aria-pressed',String(current));});
    renderPayroll();
  }));
}

function loadCases(){
  const stored=safeRead(STORAGE_CASES,null);
  if(!Array.isArray(stored)){cases=structuredClone(SEED_CASES);return;}
  const valid=stored.filter(c=>c&&typeof c.id==='string'&&typeof c.date==='string'&&typeof c.type==='string'&&typeof c.status==='string'&&Array.isArray(c.timeline)).slice(0,50);
  cases=valid.length?valid:structuredClone(SEED_CASES);
}
function persistCases(){if(!safeWrite(STORAGE_CASES,cases))toast('No fue posible guardar casos en este navegador; se mantienen durante esta visita.');}
function transactionById(id){return FRAUD_TRANSACTIONS.find(item=>item.id===id);}
function renderDisputes(){
  const target=$('#dispute-list');target.replaceChildren();
  FRAUD_TRANSACTIONS.forEach(transaction=>{
    const label=document.createElement('label');label.className='dispute-item';
    label.innerHTML=`<input type="radio" name="selected-dispute" value="${safeHTML(transaction.id)}" ${transaction.id===selectedDispute?'checked':''}><span class="dispute-item-info"><strong>${safeHTML(transaction.name)}</strong><small>${safeHTML(dateLabel(transaction.date))} · ${safeHTML(transaction.id)}</small></span><span class="dispute-item-amount">${safeHTML(money(transaction.amount))}</span>`;
    target.append(label);
  });
  $('#open-dispute').disabled=!selectedDispute;
}
function renderCases(){
  const list=$('#case-list');list.replaceChildren();
  cases.forEach(item=>{
    const button=document.createElement('button');button.type='button';button.className='case-list-item';
    button.dataset.caseId=item.id;button.setAttribute('aria-pressed',String(item.id===activeCase));
    button.innerHTML=`<strong>${safeHTML(item.id)}</strong><span>${safeHTML(item.type)}</span><small>${safeHTML(item.status)}</small>`;
    list.append(button);
  });
  const item=cases.find(c=>c.id===activeCase)||cases[0];
  if(!item){$('#case-detail').textContent='No hay casos de demostración.';return;}
  activeCase=item.id;
  const detail=$('#case-detail');detail.innerHTML=`<div class="case-detail-head"><span class="kicker">EXPEDIENTE FICTICIO</span><span class="status-badge" data-state="${safeHTML(item.status)}">● ${safeHTML(item.status)}</span></div><h3>${safeHTML(item.id)}</h3><div class="case-detail-info"><div><span>Fecha de creación</span><strong>${safeHTML(dateLabel(item.date))}</strong></div><div><span>Tipo de incidente</span><strong>${safeHTML(item.type)}</strong></div><div><span>Transacción</span><strong>${safeHTML(item.transaction||'No aplica')}</strong></div><div><span>Estado actual</span><strong>${safeHTML(item.status)}</strong></div></div><h4>Historial de actualizaciones</h4><ol class="timeline">${item.timeline.map(entry=>`<li><strong>${safeHTML(entry.label)}</strong><small>${safeHTML(dateLabel(entry.date))}</small></li>`).join('')}</ol>`;
}
function createCase(type,transaction,date,initialLabel){
  const today=localISODate();
  const item={id:nextReference(),date,type,transaction,status:'Reportado',timeline:[{date:today,label:initialLabel}]};
  cases.unshift(item);activeCase=item.id;persistCases();renderCases();return item;
}
function showFraudResult(target,item,label){
  target.replaceChildren();target.hidden=false;
  const strong=document.createElement('strong');strong.textContent=`✓ ${label}: ${item.id}`;
  const note=document.createElement('span');note.textContent='Caso ficticio creado en este navegador. No se transmitió información real.';
  const button=document.createElement('button');button.type='button';button.className='subtle-button';button.textContent='Consultar seguimiento →';
  button.addEventListener('click',()=>{$('#fraud-cases').scrollIntoView({behavior:'smooth'});});
  target.append(strong,note,document.createElement('br'),button);
}
function installFraud(){
  loadCases();renderCases();renderDisputes();
  const date=$('#fraud-date');date.max=localISODate();date.value=localISODate();
  FRAUD_TRANSACTIONS.forEach(transaction=>{
    const option=document.createElement('option');option.value=transaction.id;option.textContent=`${transaction.name} · ${money(transaction.amount)} · ${transaction.id}`;$('#fraud-transaction').append(option);
  });
  document.addEventListener('click',event=>{const button=event.target.closest('.scroll-module');if(button){const target=document.getElementById(button.dataset.target);if(target)target.scrollIntoView({behavior:'smooth',block:'start'});}});
  $('#fraud-form').addEventListener('submit',event=>{
    event.preventDefault();if(!event.currentTarget.reportValidity())return;
    const incidentDate=date.value;const today=localISODate();
    if(incidentDate>today){date.setCustomValidity('La fecha del incidente no puede ser futura.');date.reportValidity();date.setCustomValidity('');return;}
    const item=createCase($('#fraud-type').value,$('#fraud-transaction').value,incidentDate,'Reporte de fraude registrado (simulación)');
    showFraudResult($('#fraud-success'),item,'Reporte creado');
    event.currentTarget.reset();date.value=today;
  });
  $('#dispute-list').addEventListener('change',event=>{if(event.target.name==='selected-dispute'){selectedDispute=event.target.value;$('#open-dispute').disabled=false;}});
  $('#open-dispute').addEventListener('click',()=>{
    const tx=transactionById(selectedDispute);if(!tx)return;
    $('#dispute-form').reset();$('#dispute-success').hidden=true;
    $('#dispute-selection').textContent=`Movimiento ficticio seleccionado: ${tx.name} · ${money(tx.amount)} · ${tx.id}`;
    openDialog($('#dispute-dialog'));
  });
  $('#dispute-form').addEventListener('submit',event=>{
    event.preventDefault();if(!event.currentTarget.reportValidity())return;
    const tx=transactionById(selectedDispute);if(!tx)return;
    const item=createCase($('#dispute-reason').value,tx.id,localISODate(),'Disputa de transacción creada (simulación)');
    showFraudResult($('#dispute-success'),item,'Disputa creada');
    event.currentTarget.querySelector('button[type="submit"]').disabled=true;
  });
  $('#dispute-dialog').addEventListener('close',()=>{$('#dispute-form button[type="submit"]').disabled=false;});
  $('#case-list').addEventListener('click',event=>{const button=event.target.closest('[data-case-id]');if(button){activeCase=button.dataset.caseId;renderCases();}});
  $('#reset-cases').addEventListener('click',()=>{cases=structuredClone(SEED_CASES);activeCase=cases[0].id;persistCases();renderCases();toast('Se restablecieron los expedientes ficticios.');});
  updateLockUI();
  $('#toggle-card-lock').addEventListener('click',()=>{
    cardLocked=!cardLocked;safeWrite(STORAGE_LOCK,cardLocked);updateLockUI();
    const feedback=$('#security-feedback');feedback.hidden=false;feedback.textContent=cardLocked?'✓ Tarjeta de demostración bloqueada localmente. No se modificó ninguna tarjeta real.':'✓ Tarjeta de demostración desbloqueada localmente. No se modificó ninguna tarjeta real.';
  });
  $('#protect-account').addEventListener('click',()=>openDialog($('#security-dialog')));
  $('#request-assistance').addEventListener('click',()=>{$('#assistance-reference').textContent=nextReference('BL-AYUDA');openDialog($('#assistance-dialog'));});
}
function updateLockUI(){$('#lock-action-title').textContent=cardLocked?'Desbloquear tarjeta demo':'Bloquear tarjeta';$('#lock-action-description').textContent=cardLocked?'Estado actual: bloqueada (solo demo)':'Cambia el estado de una tarjeta ficticia';}

function resetArticleView(){$('#article-reader').hidden=true;$('#blog-list-view').hidden=false;$('#article-content').replaceChildren();}
function installBlog(){
  $$('[data-blog-filter]').forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.blogFilter;
    $$('[data-blog-filter]').forEach(other=>{const active=other===button;other.classList.toggle('active',active);other.setAttribute('aria-pressed',String(active));});
    $$('.article-card').forEach(article=>{article.hidden=filter!=='all'&&article.dataset.category!==filter;});
  }));
  $$('[data-open-article]').forEach(button=>button.addEventListener('click',()=>{
    const template=document.getElementById(`article-${button.dataset.openArticle}`);if(!template)return;
    $('#article-content').replaceChildren(template.content.cloneNode(true));
    $('#blog-list-view').hidden=true;$('#article-reader').hidden=false;
    window.scrollTo({top:120,behavior:'smooth'});
    const heading=$('#article-content h2');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
  }));
  $('#back-to-blog').addEventListener('click',()=>{resetArticleView();window.scrollTo({top:120,behavior:'smooth'});$('#blog-title').tabIndex=-1;$('#blog-title').focus({preventScroll:true});});
}

function init(){
  $('#current-year').textContent=String(new Date().getFullYear());
  installDialogs();installNavigation();installGlobalReport();installCredit();installPayroll();installFraud();installBlog();
}
document.addEventListener('DOMContentLoaded',init);
