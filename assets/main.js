/* ===== SETTINGS =====
   SHOW_CV: set to true to show the "CV" links on the website.
   The file cv.pdf stays in the repository either way.              */
const SHOW_CV = false;

const PROFILE = {
  name: "Md. Alif Sheakh",
  email: "sheakhalif26@gmail.com",
  scholar: "https://scholar.google.com/citations?user=RIADH4EAAAAJ&hl=en",
  orcid: "https://orcid.org/0009-0006-5845-5210",
  researchgate: "https://www.researchgate.net/profile/Md-Alif-Sheakh",
  linkedin: "https://www.linkedin.com/in/alifsheakh/",
  ieee: "https://ieeexplore.ieee.org/author/37089849924",
  github: "https://github.com/alifsheakh"
};
const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* theme (light default, remembers choice where storage works) */
/* theme: dark by default; remembers if a visitor switches to light */
(function(){ let t; try{ t = localStorage.getItem("as-theme"); }catch(e){} if(t==="light") document.documentElement.setAttribute("data-theme","light"); })();

(function layout(){
  const here = (location.pathname.split("/").pop() || "index.html").replace(".html","") || "index";
  const pages = [["index","Home"],["research","Research"],["publications","Publications"],["about","About"],["contact","Contact"]];

  const bar = document.createElement("header");
  bar.className = "bar";
  bar.innerHTML = `<div class="wrap">
    <a class="logo" href="index.html"><img src="assets/logo.svg" alt=""><span class="nm">Md. Alif Sheakh<small>MACHINE LEARNING · MEDICAL AI</small></span></a>
    <ul class="links" id="links">${pages.map(([h,t],i)=>`<li><a href="${h}.html" class="${here===h?"active":""}"><sup>0${i+1}</sup>${t}</a></li>`).join("")}</ul>
    <div class="tools">
      <button class="round" id="theme" aria-label="Toggle dark mode"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><path d="M12 7v10a5 5 0 0 0 0-10z" fill="currentColor"/></svg></button>
      ${SHOW_CV ? `<a class="pill-btn" href="cv.pdf" target="_blank" rel="noopener">CV ↗</a>` : `<a class="pill-btn" href="contact.html">Say hello ↗</a>`}
      <button class="round menu-btn" id="menu" aria-label="Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 8h16M4 16h16"/></svg></button>
    </div></div>`;
  document.body.prepend(bar);

  

  const foot = document.createElement("footer");
  foot.className = "foot";
  foot.innerHTML = `<div class="wrap"><span>© ${new Date().getFullYear()} Md. Alif Sheakh · Queensland, Australia</span>
    <nav><a href="${PROFILE.scholar}" target="_blank" rel="noopener">Scholar</a><a href="${PROFILE.orcid}" target="_blank" rel="noopener">ORCID</a><a href="${PROFILE.ieee}" target="_blank" rel="noopener">IEEE Xplore</a><a href="${PROFILE.researchgate}" target="_blank" rel="noopener">ResearchGate</a><a href="${PROFILE.linkedin}" target="_blank" rel="noopener">LinkedIn</a><a href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a></nav></div>`;
  document.body.append(foot);

  if(!SHOW_CV) document.querySelectorAll(".cv-link").forEach(el => el.remove());

  // ambient glow + scroll progress
  const fx = document.createElement("div");
  fx.innerHTML = '<div class="glow-bg"><i></i><i></i></div><div class="progress" id="prog"></div>';
  document.body.prepend(...fx.childNodes);
  const prog = document.getElementById("prog");
  const onScroll = () => { const h = document.documentElement.scrollHeight - innerHeight; prog.style.transform = `scaleX(${h>0 ? scrollY/h : 0})`; };
  addEventListener("scroll", onScroll, {passive:true}); onScroll();

  document.getElementById("menu").onclick = () => document.getElementById("links").classList.toggle("open");
  document.getElementById("theme").onclick = () => {
    const light = document.documentElement.getAttribute("data-theme")==="light";
    if(light) document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme","light");
    try{ localStorage.setItem("as-theme", light ? "dark" : "light"); }catch(e){}
  };

})();

/* reveal on scroll: content stays visible if anything goes wrong */
function reveal(root=document){
  const els = root.querySelectorAll(".rv:not(.in)");
  if(reduce || !("IntersectionObserver" in window)){ els.forEach(e => e.classList.add("in")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), {threshold:0, rootMargin:"0px 0px -8% 0px"});
  els.forEach(el => io.observe(el));
}
if(!reduce) document.documentElement.classList.add("js-reveal");
reveal();
setTimeout(() => document.querySelectorAll(".rv").forEach(e => { const r=e.getBoundingClientRect(); if(r.top < innerHeight) e.classList.add("in"); }), 1200);

/* counter */
function countTo(el, target){
  if(target==null) return;
  if(reduce){ el.textContent = target.toLocaleString(); return; }
  const from = Number(el.dataset.from||0), t0 = performance.now();
  (function tick(t){ const p=Math.min(1,(t-t0)/1500); el.textContent=Math.round(from+(target-from)*(1-Math.pow(1-p,3))).toLocaleString(); if(p<1) requestAnimationFrame(tick); })(t0);
}

/* blur-swap rotating line */
function swapper(box, every=3400){
  if(!box) return;
  const items=[...box.children]; let i=0;
  items[0].classList.add("on");
  if(reduce) return;
  setInterval(() => { items[i].classList.remove("on"); i=(i+1)%items.length; items[i].classList.add("on"); }, every);
}


/* split the hero name into letters for a staggered entrance */
document.querySelectorAll(".hero h1 .w > span").forEach((sp, li) => {
  if(reduce) return;
  const text = sp.textContent; sp.textContent = "";
  [...text].forEach((ch, i) => { const s = document.createElement("span"); s.className = "ch"; s.textContent = ch === " " ? "\u00a0" : ch; s.style.animationDelay = (0.15 + li*0.35 + i*0.045) + "s"; sp.append(s); });
});

/* section headings: word-by-word reveal */
document.querySelectorAll(".sh h2").forEach(h => {
  if(reduce) return;
  const walk = node => [...node.childNodes].forEach(n => {
    if(n.nodeType === 3){ const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((w, i) => { if(!w) return; if(/^\s+$/.test(w)){ frag.append(w); return; } const s=document.createElement("span"); s.className="wd"; s.textContent=w; frag.append(s); });
      n.replaceWith(frag); }
    else if(n.nodeType === 1) walk(n);
  });
  walk(h);
  h.querySelectorAll(".wd").forEach((w,i) => w.style.transitionDelay = (i*0.06)+"s");
});
(function(){
  const heads = document.querySelectorAll(".sh");
  if(!("IntersectionObserver" in window) || reduce){ heads.forEach(h=>h.classList.add("in")); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } }), {rootMargin:"0px 0px -10% 0px"});
  heads.forEach(h => io.observe(h));
  setTimeout(() => heads.forEach(h => { if(h.getBoundingClientRect().top < innerHeight) h.classList.add("in"); }), 1200);
})();

/* magnetic buttons + tilt photo + card spotlight (mouse only) */
if(!reduce && matchMedia("(hover:hover)").matches){
  document.querySelectorAll(".btn, .pill-btn").forEach(b => {
    b.addEventListener("pointermove", e => { const r=b.getBoundingClientRect(); b.style.transform=`translate(${(e.clientX-r.left-r.width/2)*.18}px,${(e.clientY-r.top-r.height/2)*.25}px)`; });
    b.addEventListener("pointerleave", () => b.style.transform="");
  });
  const t = document.querySelector(".tilt");
  if(t){ const host = t.closest(".hv") || t;
    host.addEventListener("pointermove", e => { const r=host.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5; t.style.transform=`perspective(900px) rotateY(${x*8}deg) rotateX(${-y*8}deg)`; });
    host.addEventListener("pointerleave", () => t.style.transform=""); }
  document.addEventListener("pointermove", e => { const c=e.target.closest && e.target.closest(".lc"); if(c){ const r=c.getBoundingClientRect(); c.style.setProperty("--mx",(e.clientX-r.left)+"px"); c.style.setProperty("--my",(e.clientY-r.top)+"px"); } }, {passive:true});
}

/* ---- cursor: glowing dot, smooth ring, trail, labels and click ripples (mouse only) ---- */
(function cursor(){
  if(reduce || !matchMedia("(hover:hover) and (pointer:fine)").matches) return;
  const mk = cls => { const d=document.createElement("div"); d.className=cls; document.body.append(d); return d; };
  const dot=mk("cur"), ring=mk("cur-ring"), label=mk("cur-label");
  const trail=Array.from({length:8},()=>mk("cur-trail"));
  let mx=-100,my=-100, rx=mx, ry=my; const pts=trail.map(()=>({x:mx,y:my}));
  addEventListener("pointermove", e => {
    if(e.pointerType!=="mouse") return;
    document.documentElement.classList.add("has-cursor");
    mx=e.clientX; my=e.clientY;
    dot.style.transform=`translate(${mx}px,${my}px)`;
    label.style.transform=`translate(${mx}px,${my}px)`;
  }, {passive:true});
  document.addEventListener("mouseleave", () => document.documentElement.classList.remove("has-cursor"));
  (function loop(){
    rx+=(mx-rx)*.16; ry+=(my-ry)*.16;
    ring.style.transform=`translate(${rx}px,${ry}px)`;
    let px=mx, py=my;
    pts.forEach((p,i) => { p.x+=(px-p.x)*.35; p.y+=(py-p.y)*.35; px=p.x; py=p.y;
      const t=trail[i]; t.style.transform=`translate(${p.x}px,${p.y}px) scale(${1-i/10})`; t.style.opacity = document.documentElement.classList.contains("has-cursor") ? (.35-i*.04) : 0; });
    requestAnimationFrame(loop);
  })();
  document.addEventListener("pointerover", e => {
    const t=e.target.closest && e.target.closest("a,button,.lc,.fp,.row,.bd,input,select");
    ring.classList.toggle("hover", !!t);
    const card=e.target.closest && e.target.closest(".lc,.fp,.bd,.pe h3 a");
    const row=e.target.closest && e.target.closest(".row");
    label.textContent = card ? "Read" : row ? "Explore" : "";
    label.classList.toggle("show", !!(card||row));
  });
  addEventListener("pointerdown", e => { ring.classList.add("down"); const r=document.createElement("div"); r.className="ripple"; r.style.left=e.clientX+"px"; r.style.top=e.clientY+"px"; document.body.append(r); setTimeout(()=>r.remove(),650); });
  addEventListener("pointerup", () => ring.classList.remove("down"));
})();
