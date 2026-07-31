const fallback={
 site:{title:"生活收纳柜",intro:"不急着给每一天下定义。写下来，贴上照片，然后把它好好收起来。",quote:"“不必每天都精彩。普通日子也值得拥有自己的位置。”",about:"这里不是一份需要完成的任务，只是一只慢慢装满的柜子。你可以随手写下一句话，也可以认真保存一整个季节。",heroImage:"https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1000&q=85",heroCaption:"一些日子，需要被好好留下。"},
 posts:[
  {date:"2026-07-30",drawer:"夏天",mood:"轻松",weather:"晚风",body:"傍晚绕着熟悉的小路走了一圈。没有发生什么特别的事，但云被落日染成了温柔的橘色。",quote:"普通的一天，也可以被认真收藏。",cover:"https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1000&q=85",tags:["散步","黄昏"],photos:[]},
  {date:"2026-07-26",drawer:"吃过的东西",mood:"满足",weather:"很热",body:"冰凉的绿豆汤，窗外的蝉鸣，还有被水汽打湿的玻璃杯。\n今天的快乐很具体。",quote:"",cover:"",tags:["夏天","绿豆汤"],photos:[{src:"https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",caption:"今天的味道"}]},
  {date:"2026-07-21",drawer:"暂时不整理",mood:"安静",weather:"雨",body:"没有完成很多事情，但认真看完了一场雨。\n允许生活偶尔没有结论。",quote:"",cover:"",tags:["下雨","慢下来"],photos:[]},
  {date:"2026-07-15",drawer:"喜欢的瞬间",mood:"开心",weather:"晴",body:"阳光落在窗边的植物上，叶子亮得像刚刚被擦过。",quote:"光会替我们记住一些事情。",cover:"https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1000&q=85",tags:["植物","阳光"],photos:[]}
 ]};
let allPosts=[],activeDrawer="全部";
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]));
async function load(){
 let data=fallback;
 try{const [site,posts]=await Promise.all([fetch("data/site.json").then(r=>r.json()),fetch("data/posts.json").then(r=>r.json())]);data={site,posts}}catch(e){}
 allPosts=data.posts.sort((a,b)=>String(b.date).localeCompare(String(a.date)));
 document.title=data.site.title;["site-title","footer-title"].forEach(id=>document.getElementById(id).textContent=data.site.title);
 document.getElementById("site-intro").textContent=data.site.intro;document.getElementById("site-quote").textContent=data.site.quote;document.getElementById("site-about").textContent=data.site.about;
 if(data.site.heroImage)document.getElementById("hero-image").src=data.site.heroImage;document.getElementById("hero-caption").textContent=data.site.heroCaption;
 renderDrawers();renderNotes();
}
function renderDrawers(){
 const counts=allPosts.reduce((m,p)=>(m[p.drawer||"暂时不整理"]=(m[p.drawer||"暂时不整理"]||0)+1,m),{});
 const names=["全部",...Object.keys(counts)];
 document.getElementById("drawer-list").innerHTML=names.map(name=>`<button class="drawer ${name==="全部"?"all ":""}${name===activeDrawer?"active":""}" data-drawer="${esc(name)}"><span class="drawer-label">${esc(name)}</span><span class="drawer-handle"></span><span class="drawer-count">${name==="全部"?allPosts.length:counts[name]} 个日子</span></button>`).join("");
 document.querySelectorAll(".drawer").forEach(btn=>btn.addEventListener("click",()=>{activeDrawer=btn.dataset.drawer;document.getElementById("notes-heading").textContent=activeDrawer==="全部"?"刚刚收好的日子":`抽屉：${activeDrawer}`;renderDrawers();renderNotes();document.getElementById("notes").scrollIntoView({behavior:"smooth"})}));
}
function selectedPosts(){
 const q=document.getElementById("search-input").value.trim().toLowerCase();
 return allPosts.filter(p=>(activeDrawer==="全部"||p.drawer===activeDrawer)&&(!q||JSON.stringify(p).toLowerCase().includes(q)));
}
function renderNotes(){
 const posts=selectedPosts(),wall=document.getElementById("note-wall"),empty=document.getElementById("empty-state");
 empty.hidden=posts.length>0;
 wall.innerHTML=posts.map((p,i)=>`<button class="note-card ${p.cover?"has-cover":""}" data-index="${allPosts.indexOf(p)}">${p.cover?`<img class="note-cover" src="${esc(p.cover)}" alt="">`:""}<span class="fold-corner"></span><div class="note-card-content"><div class="note-meta"><span>${esc(p.date)}</span><span>${esc(p.mood||"")}${p.weather?` · ${esc(p.weather)}`:""}</span></div><p class="note-body-preview">${esc(p.body).slice(0,90)}${p.body.length>90?"…":""}</p><div class="note-tags">${(p.tags||[]).map(t=>`<span>${esc(t)}</span>`).join("")}</div></div></button>`).join("");
 wall.querySelectorAll(".note-card").forEach(card=>card.addEventListener("click",()=>openNote(allPosts[Number(card.dataset.index)])));
}
function openNote(p){
 const photos=(p.photos||[]).filter(x=>x&&x.src);
 document.getElementById("dialog-content").innerHTML=`<div class="dialog-inner"><span class="dialog-date">${esc(p.date)} · 收在「${esc(p.drawer||"暂时不整理")}」</span><h3>${esc(p.mood||"这一天")}</h3><p class="dialog-sub">${esc(p.weather||"")} ${(p.tags||[]).map(t=>` · ${esc(t)}`).join("")}</p><div class="dialog-body">${esc(p.body)}</div>${p.quote?`<div class="dialog-quote">${esc(p.quote)}</div>`:""}${photos.length?`<div class="dialog-photos">${photos.map(x=>`<figure><img src="${esc(x.src)}" alt="${esc(x.caption||"日记照片")}"><figcaption>${esc(x.caption||"")}</figcaption></figure>`).join("")}</div>`:""}</div>`;
 document.getElementById("note-dialog").showModal();
}
document.getElementById("search-input").addEventListener("input",renderNotes);
document.querySelector(".close-dialog").addEventListener("click",()=>document.getElementById("note-dialog").close());
document.getElementById("note-dialog").addEventListener("click",e=>{if(e.target===e.currentTarget)e.currentTarget.close()});
load();
