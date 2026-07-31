const fallback = {
  site: { title: "我的日常", eyebrow: "生活存档 · 从今天开始", intro: "这里记录散步时的风、吃到的好东西，以及每一个想留住的瞬间。", quote: "所谓生活，不过是一个又一个值得被记住的今天。", about: "我想把时间走过的痕迹留在这里。不需要多么精彩，只希望许多年后再回来，还能想起那天的天气和心情。" },
  posts: [
    { date:"2026.07.28", category:"散步", title:"傍晚六点半的风", excerpt:"绕着熟悉的小路走了一圈，云被落日染成了温柔的橘色。" },
    { date:"2026.07.25", category:"吃喝", title:"一碗夏天的味道", excerpt:"冰凉的绿豆汤和窗外的蝉鸣，拼成了今天最清晰的记忆。" },
    { date:"2026.07.21", category:"随想", title:"允许日子慢下来", excerpt:"没有完成很多事情，但认真看完了一场雨，也算没有辜负今天。" }
  ],
  photos: [
    {src:"https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1200&q=80",caption:"窗边的绿意"},
    {src:"https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&q=80",caption:"路上的风景"},
    {src:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",caption:"慢慢生活"},
    {src:"https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=800&q=80",caption:"今日黄昏"},
    {src:"https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",caption:"普通一天"}
  ]
};
async function loadData(){
  let data=fallback;
  try{const [site,posts,photos]=await Promise.all(["data/site.json","data/posts.json","data/photos.json"].map(x=>fetch(x).then(r=>r.json())));data={site,posts,photos}}catch(e){}
  document.title=data.site.title;
  ["brand-title","footer-title"].forEach(id=>document.getElementById(id).textContent=data.site.title);
  document.getElementById("eyebrow").textContent=data.site.eyebrow;
  document.getElementById("intro").textContent=data.site.intro;
  document.getElementById("quote").textContent=data.site.quote;
  document.getElementById("about-text").textContent=data.site.about;
  document.getElementById("story-grid").innerHTML=data.posts.map(p=>`<article class="story"><div class="meta"><span>${p.date}</span><span>${p.category}</span></div><h3>${p.title}</h3><p>${p.excerpt}</p><span class="read">记住这一天 →</span></article>`).join("");
  document.getElementById("photo-grid").innerHTML=data.photos.map(p=>`<figure class="photo"><img src="${p.src}" alt="${p.caption}" loading="lazy"><span>${p.caption}</span></figure>`).join("");
}
const now=new Date();document.getElementById("date-day").textContent=String(now.getDate()).padStart(2,"0");document.getElementById("date-month").textContent=now.toLocaleDateString("en-US",{month:"short",year:"numeric"}).toUpperCase();
const menu=document.querySelector(".menu-button"),nav=document.querySelector("nav");menu.addEventListener("click",()=>{nav.classList.toggle("open");menu.setAttribute("aria-expanded",nav.classList.contains("open"))});nav.addEventListener("click",()=>nav.classList.remove("open"));loadData();
