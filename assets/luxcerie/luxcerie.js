'use strict';
const PRODUCTS = [
  {id:'puffer',brand:'Saint Laurent',name:'Puffer',detail:'Black chevron leather',material:'Chevron-quilted leather',color:'Black',hardware:'Gold-tone chain',image:'saint-laurent-puffer.webp',ratio:520/343},
  {id:'vuitton',brand:'Louis Vuitton',name:'Leather Crossbody',detail:'Red leather · Silver hardware',material:'Textured leather',color:'Red',hardware:'Silver-tone hardware',image:'louis-vuitton-crossbody.webp',ratio:324/245},
  {id:'prada',brand:'Prada',name:'Saffiano Tote',detail:'Blue leather · Gold hardware',material:'Saffiano leather',color:'Blue',hardware:'Gold-tone hardware',image:'prada-saffiano.webp',ratio:1},
  {id:'sac-de-jour',brand:'Saint Laurent',name:'Sac De Jour Nano',detail:'Magenta leather · Gold lock',material:'Leather',color:'Magenta',hardware:'Gold-tone lock',image:'saint-laurent-sac-de-jour.webp',ratio:363/399},
  {id:'valentino',brand:'Valentino Garavani',name:'Studded Shoulder Bag',detail:'Pink leather · Studded trim',material:'Leather',color:'Pink',hardware:'Metal studded trim',image:'valentino-garavani.webp',ratio:427/240}
];
const ASSET='assets/luxcerie/';
const INSTAGRAM='https://www.instagram.com/luxcerie/';
const $=id=>document.getElementById(id);
const wrap=(value,total)=>((value%total)+total)%total;
const clamp=(value,min,max)=>Math.min(max,Math.max(min,value));
const iconArrow='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg>';
const iconBookmark='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h12v19l-6-5-6 5Z"/></svg>';
const stage=$('stage'),drawer=$('drawer'),content=$('drawer-content');
const motion=matchMedia('(prefers-reduced-motion:reduce)');
let saved=new Set(),selection=new Set();
try{
  const stored=JSON.parse(localStorage.getItem('luxcerie-selection')||'{}');
  const valid=values=>(Array.isArray(values)?values:[]).filter(id=>PRODUCTS.some(p=>p.id===id));
  saved=new Set(valid(stored.saved));selection=new Set(valid(stored.selection));
}catch{}
let p=0,target=0,width=0,height=0,small=false,dirty=true,currentIndex=-1,lastFrame=0,raf=0;
let drawerMode='about',detailId=PRODUCTS[0].id,inquiryType='bag',messageText='',toastTimer;
const objects=PRODUCTS.map((product,index)=>{
  const element=document.createElement('div');element.className='bag-object';element.dataset.index=index;
  const image=document.createElement('img');image.src=ASSET+product.image;image.alt='';image.draggable=false;image.decoding='async';image.addEventListener('load',()=>{dirty=true});element.append(image);$('objects').append(element);
  return {element,ratio:product.ratio};
});
const cards=PRODUCTS.map((product,index)=>{
  const card=document.createElement('article');card.className='product-card';card.dataset.id=product.id;
  card.innerHTML=`<div class="card-header"><span>PIECE ${String(index+1).padStart(2,'0')}</span><button class="save-button" data-save="${product.id}" aria-label="Save ${product.brand} ${product.name}" aria-pressed="false">${iconBookmark}</button></div><button class="product-image" data-detail="${product.id}" aria-label="View ${product.brand} ${product.name}"><img src="${ASSET+product.image}" alt="${product.brand} ${product.name}, ${product.detail}" draggable="false" width="520" height="343"></button><div class="card-meta"><div><h3>${product.brand}</h3><p>${product.name}</p><p class="card-price">Price on inquiry</p></div><button class="card-view" data-detail="${product.id}" aria-label="Discover ${product.brand} ${product.name}">${iconArrow}</button></div>`;
  $('bento').append(card);return card;
});
const steps=PRODUCTS.map((product,index)=>{
  const button=document.createElement('button');button.setAttribute('aria-label',`Show ${product.brand} ${product.name}`);button.setAttribute('aria-pressed',index===0);button.addEventListener('click',()=>goTo(index));$('sequence-steps').append(button);return button;
});
function currentProduct(){return PRODUCTS[wrap(Math.round(p),PRODUCTS.length)]}
function goTo(index){const current=Math.round(target);let delta=wrap(index-current,PRODUCTS.length);if(delta>PRODUCTS.length/2)delta-=PRODUCTS.length;target=current+delta;start()}
function resize(){width=stage.clientWidth;height=stage.clientHeight;small=innerWidth<=900;dirty=true;start()}
// Depth interpolation and exponential easing retain the original template's continuous scroll.
// Bag proportions use their actual cutout dimensions rather than the former figure sprite sheet.
const X=[1.4,.73,.46,.27,.14,.06];
const SIZE=[1.25,1,.60,.38,.24,.12];
const BLUR=[0,0,1,3,6,10];
const OPACITY=[0,1,.78,.47,.22,0];
function paint(){
  const count=PRODUCTS.length;
  const phone=width<600;
  const foremostWidth=phone?width*.64:Math.min(width*(width<720?.42:.48),height*.78);
  const baseline=phone?height-177:height*.77;
  const heroBottom=document.querySelector('.hero').getBoundingClientRect().bottom-stage.getBoundingClientRect().top;
  const phoneMaxHeight=Math.max(95,baseline-heroBottom-16);
  const positions=phone?[1.4,.65,.36,.20,.09,.01]:X;
  objects.forEach((object,index)=>{
    let depth=wrap(index-p,count);if(depth>count-1)depth-=count;
    const stop=clamp(depth+1,0,5),a=Math.floor(stop),b=Math.min(5,a+1),fraction=stop-a;
    const mix=values=>values[a]+(values[b]-values[a])*fraction;
    const naturalWidth=phone?Math.min(foremostWidth,phoneMaxHeight*object.ratio):foremostWidth;
    const w=naturalWidth*mix(SIZE),h=w/object.ratio;
    const x=width*mix(positions)-w/2;
    const y=baseline-h-height*Math.max(0,depth)*.025;
    object.element.style.width=`${foremostWidth}px`;object.element.style.height=`${foremostWidth/object.ratio}px`;
    object.element.style.transform=`translate3d(${x.toFixed(2)}px,${y.toFixed(2)}px,0) scale(${(w/foremostWidth).toFixed(5)})`;
    object.element.style.filter=`blur(${mix(BLUR).toFixed(2)}px)`;object.element.style.opacity=mix(OPACITY).toFixed(3);object.element.style.zIndex=100-Math.round(depth*10);
  });
  const index=wrap(Math.round(p),count);
  if(currentIndex!==index){
    currentIndex=index;const product=PRODUCTS[index];
    $('piece-index').textContent=`${String(index+1).padStart(2,'0')} / 05`;
    $('piece-name').textContent=product.brand;$('piece-name').classList.toggle('long-name',product.brand.length>16);$('piece-detail').textContent=`${product.name} · ${product.detail}`;
    steps.forEach((step,i)=>step.setAttribute('aria-pressed',i===index));cards.forEach((card,i)=>card.classList.toggle('active',i===index));
    $('collection-announcement').textContent=`Piece ${index+1} of 5. ${product.brand} ${product.name}.`;
  }
}
function frame(now){
  const dt=Math.min(50,now-lastFrame)||16;lastFrame=now;
  const previous=p;
  p=motion.matches?target:p+(target-p)*(1-Math.exp(-dt*.0072));
  if(Math.abs(target-p)<.0004)p=target;
  if(previous!==p||dirty){dirty=false;paint()}
  if(p!==target||dragging)raf=requestAnimationFrame(frame);else raf=0;
}
function start(){if(!raf)raf=requestAnimationFrame(frame)}
let dragging=false,dragStart=0,dragTarget=0,moved=0,wheelTimer;
stage.addEventListener('pointerdown',event=>{
  if(event.target.closest('a,button')||event.button>0)return;
  dragging=true;dragStart=event.clientX;dragTarget=target;moved=0;stage.setPointerCapture(event.pointerId);stage.classList.add('dragging');start();
});
stage.addEventListener('pointermove',event=>{
  if(!dragging)return;const dx=event.clientX-dragStart;moved=Math.max(moved,Math.abs(dx));target=dragTarget+dx/Math.max(150,width*.2);start();
});
function release(){if(!dragging)return;dragging=false;stage.classList.remove('dragging');target=Math.round(target);start()}
stage.addEventListener('pointerup',release);stage.addEventListener('pointercancel',release);
stage.addEventListener('wheel',event=>{event.preventDefault();target+=clamp(event.deltaX+event.deltaY,-120,120)/420;clearTimeout(wheelTimer);wheelTimer=setTimeout(()=>{target=Math.round(target);start()},150);start()},{passive:false});
addEventListener('keydown',event=>{
  if(drawer.open||event.target.closest('button,a,input,textarea,select'))return;
  if(['ArrowRight','ArrowDown'].includes(event.key)){event.preventDefault();target=Math.round(target)+1;start()}
  if(['ArrowLeft','ArrowUp'].includes(event.key)){event.preventDefault();target=Math.round(target)-1;start()}
});
$('previous').addEventListener('click',()=>{target=Math.round(target)-1;start()});
$('next').addEventListener('click',()=>{target=Math.round(target)+1;start()});
$('view-piece').addEventListener('click',()=>openDetail(currentProduct().id));
addEventListener('resize',resize);motion.addEventListener('change',()=>{dirty=true;start()});
function toast(message){$('toast').textContent=message;$('toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2400)}
function persist(){try{localStorage.setItem('luxcerie-selection',JSON.stringify({saved:[...saved],selection:[...selection]}))}catch{}updateCounts()}
function updateCounts(){
  $('saved-count').textContent=saved.size;$('selection-count').textContent=selection.size;
  document.querySelectorAll('[data-save]').forEach(button=>{const active=saved.has(button.dataset.save);button.setAttribute('aria-pressed',active);button.setAttribute('aria-label',`${active?'Unsave':'Save'} ${PRODUCTS.find(p=>p.id===button.dataset.save).brand} ${PRODUCTS.find(p=>p.id===button.dataset.save).name}`)});
}
function toggleSave(id){saved.has(id)?saved.delete(id):saved.add(id);persist();toast(saved.has(id)?'Piece saved.':'Piece removed from saved.');if(drawer.open&&drawerMode==='saved')renderList('saved')}
function addSelection(id){selection.add(id);persist();toast('Added to your inquiry list.');openDrawer('selection')}
function setTitle(title){const h=document.createElement('h2');h.id='drawer-title';h.tabIndex=-1;h.textContent=title;content.replaceChildren(h);drawer.scrollTop=0;if(drawer.open)h.focus({preventScroll:true})}
function focusDrawer(){drawer.scrollTop=0;$('drawer-title').focus({preventScroll:true})}
function setNavigation(mode){document.querySelectorAll('.bottom-nav .nav-item').forEach(button=>{const active=button.dataset.action===mode;button.classList.toggle('active',active);if(active)button.setAttribute('aria-current','page');else button.removeAttribute('aria-current')})}
function openDrawer(mode){setNavigation(mode);drawerMode=mode;if(mode==='saved'||mode==='selection')renderList(mode);else if(mode==='about')renderAbout();else if(mode==='inquire')renderInquiry();else if(mode==='perfume'){inquiryType='perfume';renderReview()}if(!drawer.open)drawer.showModal();focusDrawer();updateCounts()}
function openDetail(id){setNavigation('collection');detailId=id;goTo(PRODUCTS.findIndex(p=>p.id===id));drawerMode='detail';renderDetail();if(!drawer.open)drawer.showModal();focusDrawer();updateCounts()}
function renderDetail(){
  const product=PRODUCTS.find(p=>p.id===detailId);setTitle(product.brand);
  content.insertAdjacentHTML('afterbegin',`<img class="detail-photo" src="${ASSET+product.image}" alt="${product.brand} ${product.name}">`);
  content.insertAdjacentHTML('beforeend',`<p class="drawer-description">${product.name}</p><dl class="detail-facts"><dt>Colour</dt><dd>${product.color}</dd><dt>Material</dt><dd>${product.material}</dd><dt>Details</dt><dd>${product.hardware}</dd><dt>Availability</dt><dd>Confirm with @luxcerie</dd><dt>Price</dt><dd>Available on inquiry</dd></dl><p class="drawer-description">Ask us for condition, dimensions, inclusions and authentication details for this piece.</p><div class="drawer-actions"><button class="button solid" data-add="${product.id}">${selection.has(product.id)?'View inquiry list':'Add to inquiry list'} ${iconArrow}</button><button class="button" data-inquire-piece="${product.id}">DM to inquire ${iconArrow}</button><button class="button" data-save="${product.id}" aria-pressed="${saved.has(product.id)}">${saved.has(product.id)?'Remove from saved':'Save this piece'} ${iconBookmark}</button></div>`);
}
function renderList(mode){
  const ids=mode==='saved'?saved:selection;setTitle(mode==='saved'?'Your saved pieces':'Your inquiry list');
  content.insertAdjacentHTML('beforeend',`<p class="drawer-description">${mode==='saved'?'Keep the pieces that catch your eye. Select one to discover its details.':'Review your pieces, then ask Luxcerie about availability and prices.'}</p>`);
  if(!ids.size)content.insertAdjacentHTML('beforeend',`<div class="empty-state"><strong>${mode==='saved'?'A collection of your own.':'Your next piece starts here.'}</strong>${mode==='saved'?'Save a bag from the collection to return to it here.':'Discover a bag and add it to your inquiry list.'}</div><button class="button" data-action="collection">Explore the collection ${iconArrow}</button>`);
  else{
    [...ids].forEach(id=>{const product=PRODUCTS.find(p=>p.id===id);content.insertAdjacentHTML('beforeend',`<article class="list-item"><button data-detail="${id}" aria-label="View ${product.brand} ${product.name}"><img src="${ASSET+product.image}" alt="${product.brand} ${product.name}"></button><div><h3>${product.brand}</h3><p>${product.name}</p></div><button data-remove="${id}" data-list="${mode}">Remove</button></article>`)});
    content.insertAdjacentHTML('beforeend',`<div class="drawer-actions"><button class="button solid" data-action="${mode==='saved'?'saved-to-selection':'review'}">${mode==='saved'?'Add saved pieces to inquiry':'Continue to inquiry'} ${iconArrow}</button><button class="button" data-action="collection">Continue browsing ${iconArrow}</button></div>`);
  }
}
function renderAbout(){
  setTitle('Luxcerie');content.insertAdjacentHTML('afterbegin','<img class="about-logo" src="assets/luxcerie/monogram.svg" alt="Luxcerie gold LC monogram">');
  content.insertAdjacentHTML('beforeend',`<p class="drawer-description">by Cedie Jasen Manlutac<br>Authentic Luxury Bags &amp; Perfume</p><div class="about-trust"><span>ENTRUPY VERIFIED</span><span>Since 2015</span></div><div class="profile-stats"><span><b>531</b>posts</span><span><b>65K</b>followers</span><span><b>3,978</b>following</span></div><p class="drawer-description">San Fernando, Pampanga<br>Find the collection on Instagram: @luxcerie.</p><div class="drawer-actions"><button class="button solid" data-action="inquire">DM to inquire ${iconArrow}</button><a class="button" href="${INSTAGRAM}" target="_blank" rel="noopener noreferrer">Visit @luxcerie ${iconArrow}</a></div><p class="about-disclaimer">Not affiliated with the brands posted.</p>`);
}
function renderInquiry(){
  setTitle('A personal inquiry');content.insertAdjacentHTML('beforeend',`<p class="drawer-description">Choose what you would like to ask about. Your inquiry continues with @luxcerie on Instagram.</p><span class="menu-step">STEP 1 OF 2 · CHOOSE YOUR INQUIRY</span><div class="menu-options"><button class="menu-option" data-topic="selection" ${selection.size?'':'disabled'}><span><strong>My selected bags (${selection.size})</strong><small>Ask about the pieces in your inquiry list.</small></span>${iconArrow}</button><button class="menu-option" data-topic="bag"><span><strong>A bag from the collection</strong><small>Inquire about ${currentProduct().brand} ${currentProduct().name}.</small></span>${iconArrow}</button><button class="menu-option" data-topic="perfume"><span><strong>Luxury perfume</strong><small>Ask about fragrances and current availability.</small></span>${iconArrow}</button><button class="menu-option" data-topic="general"><span><strong>A general inquiry</strong><small>Authentication, appointments and other questions.</small></span>${iconArrow}</button></div>`);
}
function renderReview(){
  drawerMode='review';setTitle('Your inquiry, ready.');
  const selected=inquiryType==='selection'?[...selection].map(id=>PRODUCTS.find(p=>p.id===id)):[PRODUCTS.find(p=>p.id===detailId)||currentProduct()];
  const lines=selected.map(product=>`${product.brand} ${product.name} (${product.color})`).join('; ');
  messageText=inquiryType==='perfume'?'Hello Luxcerie, I would like to inquire about your luxury perfumes. Could you share the available fragrances and prices?':inquiryType==='general'?'Hello Luxcerie, I would like to inquire about your collection and authentication process.':`Hello Luxcerie, I would like to inquire about: ${lines}. Could you share availability, price, condition, inclusions and authentication details?`;
  content.insertAdjacentHTML('beforeend',`<span class="menu-step">STEP 2 OF 2 · REVIEW &amp; OPEN INSTAGRAM</span><p class="drawer-description">Copy your inquiry, then open Instagram and paste it into a DM to @luxcerie. You can edit the message below.</p><textarea class="inquiry-message" id="inquiry-message" aria-label="Your inquiry message"></textarea><div class="drawer-actions"><button class="button" id="copy-inquiry">Copy inquiry ${iconArrow}</button><a class="button solid" href="${INSTAGRAM}" target="_blank" rel="noopener noreferrer">Open Instagram to DM ${iconArrow}</a></div><button class="back-button" data-action="inquire">Back to inquiry menu</button><p class="about-disclaimer">Availability and prices are confirmed directly with Luxcerie. Not affiliated with the brands posted.</p>`);$('inquiry-message').value=messageText;
}
async function copyInquiry(){
  const text=$('inquiry-message').value;
  try{await navigator.clipboard.writeText(text);toast('Inquiry copied. Open Instagram to send your DM.')}catch{const field=$('inquiry-message');field.focus();field.select();let copied=false;try{copied=document.execCommand('copy')}catch{}toast(copied?'Inquiry copied. Open Instagram to send your DM.':'Select and copy the inquiry, then paste it into Instagram.')}
}
document.addEventListener('click',event=>{
  const save=event.target.closest('[data-save]');if(save){toggleSave(save.dataset.save);if(drawerMode==='detail'&&drawer.open){save.innerHTML=`${saved.has(save.dataset.save)?'Remove from saved':'Save this piece'} ${iconBookmark}`}updateCounts();return}
  const detail=event.target.closest('[data-detail]');if(detail){openDetail(detail.dataset.detail);return}
  const addition=event.target.closest('[data-add]');if(addition){addSelection(addition.dataset.add);return}
  const remove=event.target.closest('[data-remove]');if(remove){(remove.dataset.list==='saved'?saved:selection).delete(remove.dataset.remove);persist();renderList(remove.dataset.list);return}
  const pieceInquiry=event.target.closest('[data-inquire-piece]');if(pieceInquiry){selection.add(pieceInquiry.dataset.inquirePiece);persist();inquiryType='selection';renderReview();return}
  const topic=event.target.closest('[data-topic]');if(topic){inquiryType=topic.dataset.topic;if(inquiryType==='bag')detailId=currentProduct().id;renderReview();drawer.scrollTop=0;return}
  if(event.target.closest('#copy-inquiry')){copyInquiry();return}
  const action=event.target.closest('[data-action]');if(!action)return;
  switch(action.dataset.action){
    case 'collection':if(drawer.open)drawer.close();stage.focus();break;
    case 'saved-to-selection':saved.forEach(id=>selection.add(id));persist();openDrawer('selection');break;
    case 'review':inquiryType='selection';renderReview();drawer.scrollTop=0;break;
    default:if(action.dataset.action==='inquire')detailId=currentProduct().id;openDrawer(action.dataset.action);
  }
});
$('close-drawer').addEventListener('click',()=>drawer.close());
drawer.addEventListener('click',event=>{if(event.target===drawer){const rect=drawer.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)drawer.close()}});
drawer.addEventListener('close',()=>setNavigation('collection'));
updateCounts();resize();
