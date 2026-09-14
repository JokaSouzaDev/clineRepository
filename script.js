import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js';

const WHATSAPP_NUMBER = ''; // Ex.: 5511999999999. Deixe vazio no protótipo.

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const header = $('.site-header');
const progress = $('#scrollProgress');
const menuToggle = $('#menuToggle');
const mainNav = $('#mainNav');
const toast = $('#toast');

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

function updateScrollUI() {
  const max = document.documentElement.scrollHeight - innerHeight;
  const pct = max > 0 ? (scrollY / max) * 100 : 0;
  progress.style.width = `${pct}%`;
  header.classList.toggle('scrolled', scrollY > 30);
}
updateScrollUI();
addEventListener('scroll', updateScrollUI, { passive: true });

menuToggle.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
$$('#mainNav a').forEach(a => a.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

document.getElementById('currentYear').textContent = new Date().getFullYear();

if (window.gsap && window.ScrollTrigger && !reducedMotion) {
  gsap.registerPlugin(ScrollTrigger);
  $$('[data-reveal]').forEach((el) => {
    gsap.from(el, {
      y: 42,
      opacity: 0,
      duration: .95,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
  gsap.to('.blueprint-furniture', {
    rotation: 2.5,
    y: -14,
    ease: 'none',
    scrollTrigger: { trigger: '.process', start: 'top bottom', end: 'bottom top', scrub: 1.3 }
  });
  gsap.to('.map-wrap iframe', {
    scale: 1.07,
    ease: 'none',
    scrollTrigger: { trigger: '.location', start: 'top bottom', end: 'bottom top', scrub: 1.2 }
  });
}

if (!reducedMotion && matchMedia('(pointer:fine)').matches) {
  $$('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateX(${-y * 7}deg) rotateY(${x * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('pointerleave', () => card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)');
  });
}

$$('.quote-shortcut').forEach(button => {
  button.addEventListener('click', () => {
    $('#serviceType').value = 'Montagem de móvel novo';
    $('#serviceDetails').value = `${button.dataset.service}. Gostaria de receber um orçamento.`;
    $('#orcamento').scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    setTimeout(() => $('#clientName').focus({ preventScroll: true }), 650);
  });
});

$('#quoteForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = $('#clientName').value.trim();
  const region = $('#clientRegion').value.trim();
  const service = $('#serviceType').value;
  const details = $('#serviceDetails').value.trim();
  const time = $('#preferredTime').value;
  const quantity = $('#quantity').value || '1';

  const message = `Olá! Meu nome é ${name}. Gostaria de um orçamento para montagem de móveis.\n\n` +
    `• Serviço: ${service}\n• Quantidade: ${quantity}\n• Bairro/cidade: ${region}\n• Melhor período: ${time}\n• Detalhes: ${details}\n\n` +
    `Se precisar, posso enviar fotos do móvel por aqui.`;

  if (WHATSAPP_NUMBER) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  try {
    await navigator.clipboard.writeText(message);
    showToast('Mensagem de orçamento copiada. Cadastre o WhatsApp real para abrir direto no app.');
  } catch {
    showToast('Protótipo sem WhatsApp configurado. Cadastre o número em script.js.');
  }
});

const canvas = $('#furniture3d');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
camera.position.set(5.8, 4.4, 8.6);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = !reducedMotion;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const group = new THREE.Group();
group.position.y = -.1;
scene.add(group);

const wood = new THREE.MeshStandardMaterial({ color: 0xb9854d, roughness: .54, metalness: .03 });
const woodDark = new THREE.MeshStandardMaterial({ color: 0x6b4528, roughness: .66, metalness: .02 });
const interior = new THREE.MeshStandardMaterial({ color: 0x2a261f, roughness: .82 });
const metal = new THREE.MeshStandardMaterial({ color: 0xb9b6ae, roughness: .25, metalness: .8 });
const lime = new THREE.MeshStandardMaterial({ color: 0xc8ff62, roughness: .45, emissive: 0x182607, emissiveIntensity: .35 });

function box(w, h, d, material, x=0, y=0, z=0) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w,h,d), material);
  mesh.position.set(x,y,z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);
  return mesh;
}

box(3.45,.14,1.58,woodDark,0,-2.12,0);
box(3.45,.14,1.58,woodDark,0,2.12,0);
box(.14,4.1,1.58,woodDark,-1.66,0,0);
box(.14,4.1,1.58,woodDark,1.66,0,0);
box(.08,3.95,.08,interior,0,0,-.77);
box(.08,3.95,1.45,interior,0,0,0);
box(3.15,.08,1.45,interior,0,.55,0);
box(1.48,.08,1.45,interior,-.78,-.62,0);

const leftDoor = box(1.5,3.86,.12,wood,-.79,.05,.88);
const rightDoor = box(1.5,3.86,.12,wood,.79,.05,.88);
leftDoor.rotation.y = -.05;
rightDoor.rotation.y = .05;

box(.055,.58,.07,metal,-.13,.12,1.02);
box(.055,.58,.07,metal,.13,.12,1.02);

const drawer1 = box(1.36,.42,1.36,wood,-.77,-1.33,.06);
const drawer2 = box(1.36,.42,1.36,wood,-.77,-1.80,.06);
box(.42,.035,.06,metal,-.77,-1.33,.77);
box(.42,.035,.06,metal,-.77,-1.80,.77);

const peg1 = box(.12,.12,.7,lime,2.35,1.35,.1); peg1.rotation.z = .8;
const peg2 = box(.12,.12,.7,metal,-2.4,-1.15,.1); peg2.rotation.x = 1.1;
const board = box(1.05,.12,1.35,wood,2.45,-1.15,.1); board.rotation.z = -.17;

const floor = new THREE.Mesh(new THREE.CircleGeometry(5.4,64), new THREE.MeshStandardMaterial({ color:0x15130f, roughness:.92 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2.24;
floor.receiveShadow = true;
scene.add(floor);

scene.add(new THREE.HemisphereLight(0xffeed5, 0x1d2418, 1.8));
const key = new THREE.DirectionalLight(0xffdfb5, 4.4);
key.position.set(4,7,5); key.castShadow = true; key.shadow.mapSize.set(1024,1024); scene.add(key);
const rim = new THREE.DirectionalLight(0xc8ff62, 1.4); rim.position.set(-5,1,-3); scene.add(rim);
const fill = new THREE.PointLight(0x9ac7ff, 22, 20); fill.position.set(-3,2,4); scene.add(fill);

let pointerX = 0, pointerY = 0;
if (!reducedMotion) {
  addEventListener('pointermove', e => {
    pointerX = (e.clientX / innerWidth - .5) * .36;
    pointerY = (e.clientY / innerHeight - .5) * .2;
  }, { passive:true });
}

function resize3D() {
  const rect = canvas.getBoundingClientRect();
  const width = Math.max(1, rect.width);
  const height = Math.max(1, rect.height);
  renderer.setSize(width, height, false);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
}
resize3D();
addEventListener('resize', resize3D, { passive:true });

let t = 0;
function render() {
  t += .01;
  if (!reducedMotion) {
    const scrollFactor = Math.min(1, Math.max(0, scrollY / Math.max(1, innerHeight * 1.15)));
    const targetRY = -.22 + scrollFactor * 1.15 + pointerX;
    const targetRX = -.06 + pointerY;
    group.rotation.y += (targetRY - group.rotation.y) * .045;
    group.rotation.x += (targetRX - group.rotation.x) * .04;
    group.position.y = -.1 + Math.sin(t * .7) * .025;

    drawer1.position.z = .06 + scrollFactor * .28;
    drawer2.position.z = .06 + scrollFactor * .42;
    peg1.rotation.x += .005;
    peg2.rotation.y += .004;
    board.rotation.y = scrollFactor * .5;
  } else {
    group.rotation.y = .2;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
render();
