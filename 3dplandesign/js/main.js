import { projects } from '../data/projects.js';
const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('#site-nav');
function closeMenu(){nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}
toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';nav.classList.toggle('open',open);toggle.setAttribute('aria-expanded',String(open));});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){closeMenu();toggle.focus();}});
document.addEventListener('click',e=>{if(!e.target.closest('.site-header'))closeMenu();});
nav.addEventListener('click',e=>{if(e.target.closest('a'))closeMenu();});
matchMedia('(min-width:851px)').addEventListener('change',closeMenu);
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const root=new URL('../',import.meta.url);
const localPath=value=>new URL(value,root).href;
function renderProjects(filter='all'){
 document.querySelectorAll('[data-projects]').forEach(host=>{
 const filtered=projects.filter(p=>filter==='all'||p.category===filter);const visible=filtered.slice(0,Number(host.dataset.limit)||filtered.length);host.replaceChildren();
 visible.forEach(p=>{const card=document.createElement('article');card.className='project-card';const link=document.createElement('a');link.href=localPath(p.url);const img=document.createElement('img');img.src=localPath(p.thumbnail||'assets/images/birley-viewer.webp');img.alt=p.alt||`${p.title} property preview`;img.width=1280;img.height=720;img.loading='lazy';img.addEventListener('error',()=>{const fallback=document.createElement('div');fallback.className='empty-state';fallback.textContent='Preview unavailable — open the project to explore.';img.replaceWith(fallback);},{once:true});const caption=document.createElement('div');caption.className='project-card-caption';const info=document.createElement('div');for(const [tag,text]of[['small',p.categoryLabel],['h3',p.title],['p',p.summary]]){const el=document.createElement(tag);el.textContent=text;info.append(el);}const arrow=document.createElement('span');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');caption.append(info,arrow);link.append(img,caption);card.append(link);host.append(card);});
 const count=document.querySelector('.result-count');if(count)count.textContent=`${filtered.length} project${filtered.length===1?'':'s'}`;const empty=document.querySelector('.empty-state');if(empty)empty.hidden=filtered.length>0;
 });
}
renderProjects();
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});renderProjects(button.dataset.filter);}));
for(const shell of document.querySelectorAll('[data-viewer]')){
 const button=shell.querySelector('.load-viewer'),stage=shell.querySelector('.viewer-stage'),message=shell.querySelector('.viewer-message');
 button.addEventListener('click',()=>{
 let context;try{const test=document.createElement('canvas');context=test.getContext('webgl2');context?.getExtension('WEBGL_lose_context')?.loseContext();}catch{}
 if(!context){message.textContent='3D is not available in this browser. You can still see the preview and read the project details. Try another browser or device.';return;}
 button.disabled=true;button.textContent='Loading the property…';message.textContent='Loading the interactive model. This may take a moment.';
 const frame=document.createElement('iframe');frame.title=shell.dataset.viewerTitle||'Interactive 3D property viewer';frame.allow='fullscreen';frame.allowFullscreen=true;frame.src=shell.dataset.viewer;
 let ready=false;const timer=setTimeout(()=>{if(!ready){message.textContent='The viewer is taking longer than expected. Try the full-screen link above, or reload the page.';button.disabled=false;button.textContent='Retry viewer';frame.remove();window.removeEventListener('message',onReady);}},20000);
 function onReady(event){if(event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.type!=='birley-ready')return;ready=true;clearTimeout(timer);stage.querySelectorAll('img,.viewer-cover').forEach(el=>el.hidden=true);frame.hidden=false;message.textContent='Ready. Drag to rotate, choose a floor, or start a walkthrough. Dimensions are approximate.';window.removeEventListener('message',onReady);}
 window.addEventListener('message',onReady);frame.hidden=true;stage.append(frame);
 });
}
const form=document.querySelector('#quote-form');
if(form){form.querySelector('[type=submit]').disabled=false;const requested=new URLSearchParams(location.search).get('service');if(['plan','interactive','walkthrough','developer','unsure'].includes(requested))form.elements.service.value=requested;
 form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const labels={name:'Name',email:'Email',telephone:'Telephone',company:'Company',propertyType:'Property type',service:'Service',floors:'Floors',bedrooms:'Approximate bedrooms',description:'Project description',reference:'Reference link',deadline:'Preferred deadline'};const lines=['3DPlanDesign — Project brief','Prepared '+new Date().toLocaleDateString('en-GB'),'This brief has not been sent. Keep a copy until an enquiry address is available.',''];for(const [name,value]of new FormData(form)){lines.push(labels[name]+': '+(name==='service'?form.elements.service.selectedOptions[0].text:value||'Not supplied'));}lines.push('','Floor plans: attach separately when contacting the business.');const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'}),url=URL.createObjectURL(blob),link=document.createElement('a');link.href=url;link.download='3dplandesign-project-brief.txt';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);document.querySelector('#form-status').textContent='Your brief is ready to download. No enquiry has been sent. Your entries remain here while this page stays open.';});
}
