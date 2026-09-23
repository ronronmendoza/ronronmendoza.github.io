const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

const progress = $("#progress");
const topbar = $("#topbar");

function updateScrollUI(){
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
  topbar.classList.toggle("scrolled", window.scrollY > 18);
}
window.addEventListener("scroll", updateScrollUI, {passive:true});
updateScrollUI();

const menuBtn = $("#menuBtn");
const mobileMenu = $("#mobileMenu");
menuBtn.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  menuBtn.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
});
$$(".mobile-menu a").forEach(a => a.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  menuBtn.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}));

const sections = $$("main section[id]");
const navLinks = $$(".desktop-nav a");
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      navLinks.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
    }
  });
}, {rootMargin:"-35% 0px -55% 0px", threshold:0});
sections.forEach(section => navObserver.observe(section));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold:.12});
$$(".reveal").forEach(el => revealObserver.observe(el));

function openModal(id){
  const modal = document.getElementById(id);
  if(!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden","false");
  const close = $(".modal-close", modal);
  setTimeout(() => close.focus(), 20);
}
function closeModal(modal){
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden","true");
}
$$("[data-modal]").forEach(btn => btn.addEventListener("click", () => openModal(btn.dataset.modal)));
$$(".modal").forEach(modal => {
  $(".modal-close", modal).addEventListener("click", () => closeModal(modal));
  modal.addEventListener("click", e => { if(e.target === modal) closeModal(modal); });
});
document.addEventListener("keydown", e => {
  if(e.key === "Escape") $$(".modal.is-open").forEach(closeModal);
});

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const target = document.querySelector(a.getAttribute("href"));
    if(target){
      e.preventDefault();
      target.scrollIntoView({behavior:"smooth", block:"start"});
    }
  });
});
