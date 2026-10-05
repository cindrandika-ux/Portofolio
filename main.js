/* CONFIG — edit data portofolio di sini */
const CONFIG = {
  nama: "Juslianto Suradi",
  roles: ["Cinematographer", "Photographer", "Editor"],
};

import * as THREE from "three";

/* ---------- PRELOADER ---------- */
window.addEventListener("load", () => setTimeout(() => document.getElementById("preloader").classList.add("hide"), 700));
setTimeout(() => document.getElementById("preloader").classList.add("hide"), 3000);

/* ---------- THREE.JS SCENE ---------- */
const canvas = document.getElementById("webgl");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
try {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(innerWidth, innerHeight);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x050505, 0.045);
  const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
  camera.position.set(0, 0, 9);

  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const key = new THREE.DirectionalLight(0xF87171, 1.4); key.position.set(4, 6, 6); scene.add(key);
  const rim = new THREE.PointLight(0xB91C1C, 60, 30); rim.position.set(-6, -2, 2); scene.add(rim);
  const warm = new THREE.PointLight(0xEF4444, 60, 30); warm.position.set(5, -4, 1); scene.add(warm);

  // Objek utama: torus knot
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.6, 0.45, 220, 32),
    new THREE.MeshStandardMaterial({ color: 0xEF4444, metalness: 0.85, roughness: 0.25, wireframe: false })
  );
  knot.position.x = 2.6; scene.add(knot);
  const knotWire = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.65, 0.48, 120, 16),
    new THREE.MeshBasicMaterial({ color: 0xF87171, wireframe: true, transparent: true, opacity: 0.22 })
  );
  knotWire.position.copy(knot.position); scene.add(knotWire);

  // Icosahedron melayang
  const floaters = [];
  const floGeo = new THREE.IcosahedronGeometry(0.35, 0);
  for (let i = 0; i < 14; i++) {
    const m = new THREE.Mesh(floGeo, new THREE.MeshStandardMaterial({
      color: i % 3 === 0 ? 0xB91C1C : 0x1c1917, metalness: 0.9, roughness: 0.25,
      emissive: i % 3 === 0 ? 0x7F1D1D : 0x000000, emissiveIntensity: 0.5
    }));
    m.position.set((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 6 - 1);
    m.userData = { s: 0.4 + Math.random() * 0.8, o: Math.random() * Math.PI * 2 };
    floaters.push(m); scene.add(m);
  }

  // Partikel
  const N = 1100, pos = new Float32Array(N * 3);
  for (let i = 0; i < N * 3; i++) pos[i] = (Math.random() - 0.5) * 26;
  const pGeo = new THREE.BufferGeometry();
  pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  const points = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xFECACA, size: 0.035, transparent: true, opacity: 0.75 }));
  scene.add(points);

  // Grid bawah
  const grid = new THREE.GridHelper(40, 40, 0xEF4444, 0x450a0a);
  grid.position.y = -4.2; grid.material.transparent = true; grid.material.opacity = 0.28; scene.add(grid);

  let mx = 0, my = 0, tx = 0, ty = 0;
  addEventListener("mousemove", e => {
    tx = (e.clientX / innerWidth - 0.5) * 2;
    ty = (e.clientY / innerHeight - 0.5) * 2;
  });
  addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
  // Responsif mobile: geser objek utama ke belakang
  const layout = () => { knot.position.x = innerWidth < 760 ? 0 : 2.6; knotWire.position.x = knot.position.x; knot.position.y = innerWidth < 760 ? 1.6 : 0; knotWire.position.y = knot.position.y; };
  layout(); addEventListener("resize", layout);

  const clock = new THREE.Clock();
  (function tick() {
    requestAnimationFrame(tick);
    const t = clock.getElapsedTime();
    mx += (tx - mx) * 0.04; my += (ty - my) * 0.04;
    const scrollY = scrollY / (document.body.scrollHeight - innerHeight || 1);

    if (!reduceMotion) {
      knot.rotation.x = t * 0.25; knot.rotation.y = t * 0.35 + mx * 0.6;
      knotWire.rotation.copy(knot.rotation);
      knot.position.y += Math.sin(t * 1.2) * 0.0015;
      floaters.forEach((f, i) => {
        f.rotation.x = t * f.userData.s; f.rotation.y = t * f.userData.s * 0.7;
        f.position.y += Math.sin(t * 1.4 + f.userData.o) * 0.0022;
      });
      points.rotation.y = t * 0.02 + mx * 0.15;
      grid.position.z = (t * 0.35) % 1;
    }
    camera.position.x = mx * 1.1;
    camera.position.y = -my * 0.8 - scrollY * 2.2;
    camera.rotation.z = scrollY * 0.25;
    camera.lookAt(0, -scrollY * 2, 0);
    renderer.render(scene, camera);
  })();
} catch (e) { canvas.style.display = "none"; }

/* ---------- TYPING ---------- */
const typedEl = document.getElementById("typed");
let ri = 0, ci = 0, del = false;
(function type() {
  const word = CONFIG.roles[ri];
  typedEl.textContent = word.slice(0, ci);
  if (!del && ci < word.length) { ci++; setTimeout(type, 65); }
  else if (!del) { del = true; setTimeout(type, 1400); }
  else if (ci > 0) { ci--; setTimeout(type, 32); }
  else { del = false; ri = (ri + 1) % CONFIG.roles.length; setTimeout(type, 300); }
})();

/* ---------- NAV / SCROLL ---------- */
const nav = document.getElementById("navbar");
const burger = document.getElementById("burger");
const navLinks = document.getElementById("navLinks");
burger.onclick = () => navLinks.classList.toggle("open");
navLinks.querySelectorAll("a").forEach(a => a.onclick = () => navLinks.classList.remove("open"));

const prog = document.getElementById("scrollProgress");
const toTop = document.getElementById("toTop");
addEventListener("scroll", () => {
  const h = document.documentElement;
  prog.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
  // active link
  const secs = ["tentang", "skill", "proyek", "pengalaman", "kontak"];
  let cur = "";
  secs.forEach(id => { const el = document.getElementById(id); if (el && scrollY >= el.offsetTop - 200) cur = id; });
  document.querySelectorAll(".nav-links a").forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
}, { passive: true });
toTop.onclick = () => scrollTo({ top: 0, behavior: "smooth" });

/* ---------- REVEAL + COUNTER + BARS ---------- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("visible");
  e.target.querySelectorAll(".bar i").forEach(b => b.style.width = b.dataset.w + "%");
  const bar = e.target.matches(".bar i") ? e.target : null;
  if (bar) bar.style.width = bar.dataset.w + "%";
  e.target.querySelectorAll(".count").forEach(runCount);
  if (e.target.classList.contains("count")) runCount(e.target);
  io.unobserve(e.target);
}), { threshold: 0.15 });
document.querySelectorAll(".reveal,.bar i,.count").forEach(el => io.observe(el));
function runCount(el) {
  if (el.dataset.done) return; el.dataset.done = 1;
  const target = +el.dataset.target; const t0 = performance.now();
  (function step(t) {
    const p = Math.min((t - t0) / 1400, 1);
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

/* ---------- 3D TILT ---------- */
if (matchMedia("(hover:hover)").matches && !reduceMotion) {
  document.querySelectorAll(".tilt").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => card.style.transform = "");
  });
}

/* ---------- FILTER PROYEK ---------- */
document.querySelectorAll(".chip").forEach(chip => chip.onclick = () => {
  document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  const f = chip.dataset.filter;
  document.querySelectorAll(".proj").forEach(p => {
    const show = f === "all" || p.dataset.cat === f;
    p.classList.toggle("hide", !show);
    if (show) { p.classList.remove("visible"); requestAnimationFrame(() => requestAnimationFrame(() => p.classList.add("visible"))); }
  });
});

/* ---------- CURSOR + MAGNETIC ---------- */
const dot = document.getElementById("cursorDot"), ring = document.getElementById("cursorRing");
let cx = 0, cy = 0, rx = 0, ry = 0;
addEventListener("mousemove", e => { cx = e.clientX; cy = e.clientY; dot.style.left = cx + "px"; dot.style.top = cy + "px"; });
(function loop() {
  rx += (cx - rx) * 0.16; ry += (cy - ry) * 0.16;
  ring.style.left = rx + "px"; ring.style.top = ry + "px";
  requestAnimationFrame(loop);
})();
document.querySelectorAll("[data-hover]").forEach(el => {
  el.addEventListener("mouseenter", () => { ring.style.width = "58px"; ring.style.height = "58px"; ring.style.borderColor = "#EF4444"; });
  el.addEventListener("mouseleave", () => { ring.style.width = "36px"; ring.style.height = "36px"; ring.style.borderColor = "#ffffff44"; });
});
if (matchMedia("(hover:hover)").matches) {
  document.querySelectorAll(".magnetic").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px,${(e.clientY - r.top - r.height / 2) * 0.18}px)`;
    });
    btn.addEventListener("mouseleave", () => btn.style.transform = "");
  });
}

/* ---------- FORM ---------- */
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();
  const f = e.target;
  if (!f.nama.value.trim() || !f.email.value.includes("@") || !f.pesan.value.trim()) {
    f.querySelector("button").textContent = "Lengkapi dulu ya ✋";
    setTimeout(() => f.querySelector("button").textContent = "Kirim Pesan 🚀", 1800);
    return;
  }
  document.getElementById("formOk").classList.add("show");
  const msg = `Halo Juslianto,%0A%0ASaya ${encodeURIComponent(f.nama.value.trim())} (${encodeURIComponent(f.email.value.trim())}).%0A%0A${encodeURIComponent(f.pesan.value.trim())}`;
  window.open(`https://wa.me/6281226950858?text=${msg}`, "_blank", "noopener");
  f.reset();
  setTimeout(() => document.getElementById("formOk").classList.remove("show"), 5000);
});

document.getElementById("year").textContent = new Date().getFullYear();
