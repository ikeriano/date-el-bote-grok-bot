// Motor común de los concursos de Iker (three.js r170). Estilo «Ahora Caigo»: plató 3D, personajes
// redondeados, cámara de TV, bocadillo del presentador con voz Piper pregrabada, menú y créditos.
import * as THREE from './three.module.min.js';
export { THREE };
const $ = s => document.querySelector(s);
export const M = { THREE, opts: JSON.parse(localStorage.getItem('opc_' + location.pathname) || '{"mus":70,"sfx":80,"voz":100,"cal":"auto"}') };
M.guardarOpc = () => localStorage.setItem('opc_' + location.pathname, JSON.stringify(M.opts));
M.esperar = ms => new Promise(r => setTimeout(r, ms / (M.turbo || 1)));
M.rnd = (a, b) => a + Math.random() * (b - a);
M.pick = a => a[Math.floor(Math.random() * a.length)];
M.mezclar = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };
M.euros = n => Math.round(n).toLocaleString('es-ES').replace(/,/g, '.') + ' €';
export function hash(t) { let h = 5381; for (const c of t) h = ((h * 33) ^ c.codePointAt(0)) >>> 0; return h.toString(36); }

// ---------------------------------------------------------------- render
const params = new URLSearchParams(location.search);
M.demo = params.get('demo'); M.turbo = +(params.get('turbo') || 1);
let renderer, scene, camera, clock = new THREE.Clock(), anims = [], camTw = null;
M.init = function (cfg) {
  M.cfg = cfg;
  const cv = $('#gl');
  const low = M.opts.cal === 'baja' || (M.opts.cal === 'auto' && (navigator.hardwareConcurrency || 4) <= 8 && Math.min(screen.width, screen.height) < 800);
  M.low = low;
  renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: !low, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, low ? 1 : 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  scene = new THREE.Scene(); scene.background = new THREE.Color(cfg.fondo || 0x080818);
  camera = new THREE.PerspectiveCamera(45, 16 / 9, 0.1, 300);
  camera.position.set(0, 4, 14); M.mira = new THREE.Vector3(0, 1.5, 0);
  scene.add(new THREE.HemisphereLight(0xffffff, 0x445566, 1.6));
  const d = new THREE.DirectionalLight(0xffffff, 1.4); d.position.set(4, 10, 8); scene.add(d);
  M.scene = scene; M.camera = camera; M.renderer = renderer;
  const rs = () => { const w = innerWidth, h = innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  addEventListener('resize', rs); rs();
  let last = 0, acc = 0;
  renderer.setAnimationLoop(t => {
    const dt = Math.min(clock.getDelta(), 0.1); M.t = t / 1000;
    if (low) { acc += dt; if (acc < 1 / 31) return; acc = 0; } // ~30 fps en móviles sencillos
    for (let i = anims.length - 1; i >= 0; i--) if (anims[i](dt, M.t) === false) anims.splice(i, 1);
    if (camTw) { camTw.k = Math.min(1, camTw.k + dt / camTw.d); const e = camTw.k < .5 ? 2 * camTw.k * camTw.k : 1 - Math.pow(-2 * camTw.k + 2, 2) / 2; camera.position.lerpVectors(camTw.p0, camTw.p1, e); M.mira.lerpVectors(camTw.l0, camTw.l1, e); if (camTw.k >= 1) { const r = camTw.r; camTw = null; r(); } }
    camera.position.x += Math.sin(M.t * .4) * .0015; // pequeña respiración de cámara de TV
    camera.lookAt(M.mira);
    renderer.render(M.escenaActiva || scene, M.camActiva || camera);
  });
};
M.anim = f => anims.push(f);
M.cam = (pos, look, dur = 1.2) => new Promise(r => { if (dur <= 0 || M.turbo > 5) { camera.position.set(...pos); M.mira.set(...look); return r(); } camTw = { p0: camera.position.clone(), p1: new THREE.Vector3(...pos), l0: M.mira.clone(), l1: new THREE.Vector3(...look), d: dur / (M.turbo || 1), k: 0, r }; });
M.mat = (c, e) => new THREE.MeshLambertMaterial({ color: c, emissive: e || 0x000000 });
M.basic = c => new THREE.MeshBasicMaterial({ color: c });
M.caja = (w, h, d, c, x = 0, y = 0, z = 0, par = scene) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), typeof c === 'object' ? c : M.mat(c)); m.position.set(x, y, z); par.add(m); return m; };
M.cil = (rt, rb, h, c, x = 0, y = 0, z = 0, seg = 32, par = scene) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), typeof c === 'object' ? c : M.mat(c)); m.position.set(x, y, z); par.add(m); return m; };
M.aro = (r, t, c, x = 0, y = 0, z = 0, par = scene, arc = Math.PI * 2) => { const m = new THREE.Mesh(new THREE.TorusGeometry(r, t, 8, 48, arc), typeof c === 'object' ? c : M.basic(c)); m.position.set(x, y, z); par.add(m); return m; };
M.esfera = (r, c, x = 0, y = 0, z = 0, par = scene) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), typeof c === 'object' ? c : M.mat(c)); m.position.set(x, y, z); par.add(m); return m; };
// textura de texto/dibujo en canvas
M.tex = (w, h, dib) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); dib(g, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 2; t.userData = { c, g, dib }; return t; };
M.panel = (w, h, tw, th, dib, x = 0, y = 0, z = 0, par = scene) => { const t = M.tex(tw, th, dib); const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: t, transparent: true })); m.position.set(x, y, z); par.add(m); m.redib = f => { const { c, g } = t.userData; g.clearRect(0, 0, c.width, c.height); (f || t.userData.dib)(g, c.width, c.height); t.needsUpdate = true; }; return m; };

// ---------------------------------------------------------------- personajes (estilo Ahora Caigo: formas redondeadas tipo muñeco)
const geo = { cab: new THREE.SphereGeometry(.24, 18, 14), cuerpo: new THREE.CapsuleGeometry(.24, .5, 4, 12), brazo: new THREE.CapsuleGeometry(.075, .48, 3, 8), pierna: new THREE.CapsuleGeometry(.095, .62, 3, 8), ojo: new THREE.SphereGeometry(.035, 8, 6), mano: new THREE.SphereGeometry(.08, 8, 6) };
const cacheMat = {}; const cm = c => cacheMat[c] || (cacheMat[c] = M.mat(c));
M.persona = function (o = {}) {
  const g = new THREE.Group(), s = o.altura || 1;
  const piel = cm(o.piel || 0xf1c6a0), cam = cm(o.camisa || 0xffffff), pan = cm(o.pantalon || 0x223355), pel = cm(o.pelo || 0x2a1a10);
  const torso = new THREE.Mesh(geo.cuerpo, o.chaqueta ? cm(o.chaqueta) : cam); torso.position.y = 1.18; torso.scale.set(1, 1, .75); g.add(torso);
  if (o.chaqueta) { const pe = M.caja(.16, .5, .02, cam, 0, 1.3, .19, g); if (o.corbata) M.caja(.05, .38, .03, o.corbata, 0, 1.28, .205, g); }
  if (o.vaquera) { M.caja(.5, .02, .02, 0x8fb3d9, 0, 1.45, .19, g); }
  if (o.vestido) { const f = M.cil(.24, .42, .55, o.camisa, 0, .78, 0, 16, g); }
  const cab = new THREE.Group(); cab.position.y = 1.78; g.add(cab);
  const cabeza = new THREE.Mesh(geo.cab, piel); cabeza.scale.set(1, 1.08, 1); cab.add(cabeza);
  M.cil(.08, .09, .14, piel, 0, -.24, 0, 8, cab);
  for (const x of [-.085, .085]) { const e = new THREE.Mesh(geo.ojo, cm(0x1a1a1a)); e.position.set(x, .03, .215); cab.add(e); const ce = M.caja(.09, .018, .02, o.cejas || o.pelo || 0x2a1a10, x, .11, .215, cab); }
  const boca = M.caja(.11, .025, .02, 0x9a3b3b, 0, -.1, .22, cab); g.userData.boca = boca;
  M.esfera(.04, piel, 0, -.01, .24, cab); // nariz
  // pelo
  const pz = o.peinado || 'corto';
  if (pz !== 'calvo') { const top = new THREE.Mesh(new THREE.SphereGeometry(.25, 18, 10, 0, Math.PI * 2, 0, pz === 'tupe' ? 1.5 : 1.25), pel); top.position.y = .03; top.scale.set(1.04, pz === 'tupe' ? 1.25 : 1.05, 1.04); cab.add(top); if (pz === 'tupe') top.rotation.x = -.25; }
  else { const r = new THREE.Mesh(new THREE.TorusGeometry(.2, .05, 6, 16, Math.PI), pel); r.rotation.set(Math.PI / 2, 0, Math.PI); r.position.set(0, 0, -.03); cab.add(r); }
  if (pz === 'largo' || pz === 'melena') { const l = M.caja(.5, pz === 'largo' ? .62 : .4, .2, pel, 0, pz === 'largo' ? -.22 : -.12, -.13, cab); }
  if (pz === 'rizado') for (let i = 0; i < 10; i++) M.esfera(.1, pel, Math.cos(i * .7) * .22, .12 + Math.sin(i) * .06, Math.sin(i * .7) * .2 - .03, cab);
  if (pz === 'coleta') M.esfera(.12, pel, 0, 0, -.3, cab);
  if (o.barba) { const b = new THREE.Mesh(new THREE.SphereGeometry(.25, 16, 8, 0, Math.PI, Math.PI * .68, Math.PI * .32), cm(o.barba)); b.rotation.y = 0; b.position.set(0, -.01, .01); b.scale.set(1, 1.08, 1); b.rotation.y = 0; b.rotation.x = 0; cab.add(b); boca.position.z = .25; }
  if (o.gafas) for (const x of [-.09, .09]) { const a = M.aro(.05, .01, o.gafas, x, .03, .23, cab); }
  if (o.gorra) { M.cil(.26, .26, .1, o.gorra, 0, .17, 0, 16, cab); M.caja(.3, .02, .2, o.gorra, 0, .13, .22, cab); }
  const mk = (gm, m, x, y) => { const p = new THREE.Group(); p.position.set(x, y, 0); const me = new THREE.Mesh(gm, m); me.position.y = -gm.parameters.length / 2 - .05; p.add(me); g.add(p); return p; };
  const bi = mk(geo.brazo, o.chaqueta ? cm(o.chaqueta) : (o.mangaCorta ? piel : cam), -.33, 1.5), bd = mk(geo.brazo, o.chaqueta ? cm(o.chaqueta) : (o.mangaCorta ? piel : cam), .33, 1.5);
  for (const b of [bi, bd]) { const h = new THREE.Mesh(geo.mano, piel); h.position.y = -.62; b.add(h); }
  const pi = mk(geo.pierna, o.vestido ? piel : pan, -.12, .88), pd = mk(geo.pierna, o.vestido ? piel : pan, .12, .88);
  for (const p of [pi, pd]) M.caja(.15, .08, .26, o.zapatos || 0x222222, 0, -.82, .05, p);
  g.scale.setScalar(s); g.userData = { ...g.userData, bi, bd, pi, pd, cab, hablando: 0, gesto: 0, ph: Math.random() * 6, andar: 0 };
  if (o.nombre) { const et = M.panel(.9, .26, 256, 72, (c, w, h) => { c.fillStyle = o.colorNombre || '#1b2a7a'; c.beginPath(); c.roundRect(2, 2, w - 4, h - 4, 30); c.fill(); c.fillStyle = '#fff'; c.font = 'bold 40px Jost, sans-serif'; c.textAlign = 'center'; c.fillText(o.nombre, w / 2, 50); }, 0, 2.3, 0, g); et.userData.billboard = 1; g.userData.et = et; }
  M.anim((dt, t) => {
    const u = g.userData; const ph = t * 2 + u.ph;
    u.cab.rotation.y = Math.sin(ph * .3) * .12 + (u.mirarY || 0); u.cab.position.y = 1.78 + Math.sin(ph) * .008;
    if (u.hablando > 0) { u.boca.scale.y = 1 + Math.abs(Math.sin(t * 18)) * 3; u.bd.rotation.x = -.4 + Math.sin(t * 3) * .3; u.bd.rotation.z = .2; }
    else { u.boca.scale.y = 1; u.bd.rotation.x *= .9; u.bd.rotation.z = .08; }
    u.bi.rotation.z = -.08; 
    if (u.gesto) { u.bi.rotation.z = -2.6 + Math.sin(t * 10) * .3; u.bd.rotation.z = 2.6 - Math.sin(t * 10) * .3; }
    if (u.andar) { const a = Math.sin(t * 9) * .5; u.pi.rotation.x = a; u.pd.rotation.x = -a; u.bi.rotation.x = -a * .7; u.bd.rotation.x = a * .7; }
    else { u.pi.rotation.x *= .8; u.pd.rotation.x *= .8; if (!u.hablando) u.bi.rotation.x *= .8; }
    if (u.et) u.et.quaternion.copy(camera.quaternion);
  });
  return g;
};
M.andar = (p, x, z, vel = 2.2) => new Promise(r => { const u = p.userData; u.andar = 1; const tx = x, tz = z; M.anim(dt => { const dx = tx - p.position.x, dz = tz - p.position.z, d = Math.hypot(dx, dz); if (d < .05 || M.turbo > 5) { p.position.x = tx; p.position.z = tz; u.andar = 0; r(); return false; } const st = Math.min(d, vel * dt * (M.turbo || 1)); p.position.x += dx / d * st; p.position.z += dz / d * st; p.rotation.y = Math.atan2(dx, dz); }); });
M.girar = (p, ry) => { p.rotation.y = ry; };
M.celebrar = (p, ms = 1800) => { p.userData.gesto = 1; setTimeout(() => p.userData.gesto = 0, ms); };
// público con InstancedMesh (barato para Redmi A2)
M.publico = function (filas, porFila, radio0, arcIni, arcFin, cy = 0) {
  const n = filas * porFila; const gC = new THREE.CapsuleGeometry(.2, .3, 2, 6), gH = new THREE.SphereGeometry(.17, 8, 6);
  const mc = new THREE.MeshLambertMaterial(), mh = new THREE.MeshLambertMaterial();
  const ic = new THREE.InstancedMesh(gC, mc, n), ih = new THREE.InstancedMesh(gH, mh, n); const o = new THREE.Object3D(), col = new THREE.Color();
  const pal = [0xe94b4b, 0x3b7be9, 0x3bbf6b, 0xf2c230, 0xffffff, 0x9b59b6, 0xff8a3d, 0x222222, 0x47c9d8, 0xf06292]; const pieles = [0xf1c6a0, 0xd9a47a, 0x9a6a46, 0xf5d5b8];
  const base = [];
  let i = 0; for (let f = 0; f < filas; f++) for (let k = 0; k < porFila; k++) {
    const a = arcIni + (arcFin - arcIni) * (k + .5) / porFila, r = radio0 + f * .9, y = cy + f * .45 + .75;
    o.position.set(Math.sin(a) * r, y, Math.cos(a) * r); o.rotation.set(0, a + Math.PI, 0); o.updateMatrix(); ic.setMatrixAt(i, o.matrix); ic.setColorAt(i, col.setHex(pal[(i * 7 + f) % pal.length]));
    o.position.y = y + .45; o.updateMatrix(); ih.setMatrixAt(i, o.matrix); ih.setColorAt(i, col.setHex(pieles[(i * 3) % 4])); base.push([o.position.x, y, o.position.z, a]); i++;
  }
  scene.add(ic, ih); M._pub = { ic, ih, base, o, aplauso: 0 };
  M.anim((dt, t) => { const P = M._pub; if (P.aplauso <= 0 && Math.floor(t * 10) % 3) return; P.aplauso -= dt; const amp = P.aplauso > 0 ? .12 : .015; for (let j = 0; j < base.length; j++) { const b = base[j]; const h = Math.max(0, Math.sin(t * (P.aplauso > 0 ? 14 : 2) + j)) * amp; o.position.set(b[0], b[1] + h, b[2]); o.rotation.set(0, b[3] + Math.PI, 0); o.updateMatrix(); ic.setMatrixAt(j, o.matrix); o.position.y += .45; o.updateMatrix(); ih.setMatrixAt(j, o.matrix); } ic.instanceMatrix.needsUpdate = ih.instanceMatrix.needsUpdate = true; });
};
M.aplaudir = (s = 2.5) => { if (M._pub) M._pub.aplauso = s; M.sfx('aplauso', s); };
// focos móviles
M.focos = function (cols, y = 12) { const arr = []; for (let i = 0; i < cols.length; i++) { const m = new THREE.Mesh(new THREE.ConeGeometry(1.6, 12, 16, 1, true), new THREE.MeshBasicMaterial({ color: cols[i], transparent: true, opacity: .13, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })); m.geometry.translate(0, -6, 0); m.position.set(-10 + i * 20 / (cols.length - 1 || 1), y, -4); scene.add(m); arr.push(m); } M.anim((dt, t) => arr.forEach((m, i) => { m.rotation.z = Math.sin(t * .6 + i) * .45; m.rotation.x = Math.cos(t * .5 + i * 2) * .3; })); return arr; };

// ---------------------------------------------------------------- audio
let AC; const ac = () => AC || (AC = new (window.AudioContext || window.webkitAudioContext)());
const bufCache = {};
async function buf(url) { if (bufCache[url]) return bufCache[url]; const r = await fetch(url); if (!r.ok) throw 0; const b = await ac().decodeAudioData(await r.arrayBuffer()); return bufCache[url] = b; }
M.sonar = async (url, vol = 1, loop = false) => { try { const b = await buf(url); const s = ac().createBufferSource(); s.buffer = b; s.loop = loop; const g = ac().createGain(); g.gain.value = vol; s.connect(g).connect(ac().destination); s.start(); return { s, g, dur: b.duration }; } catch (e) { return null; } };
let musica = null;
M.musica = async (url, vol = .5) => { M.pararMusica(); if (!url) return; const k = musica = {}; const r = await M.sonar(url, vol * M.opts.mus / 100, true); if (musica !== k || !r) { r && r.s.stop(); return; } musica = r; };
M.pararMusica = () => { if (musica && musica.s) { const m = musica; try { m.g.gain.setTargetAtTime(0, ac().currentTime, .3); setTimeout(() => m.s.stop(), 900); } catch (e) { } } musica = null; };
M.sfx = (n, dur) => { const v = M.opts.sfx / 100; if (!v) return; const a = ac(), t = a.currentTime, g = a.createGain(); g.connect(a.destination);
  const tono = (f, d, tipo = 'sine', t0 = 0, vol = .25) => { const o = a.createOscillator(); o.type = tipo; o.frequency.setValueAtTime(f, t + t0); const gg = a.createGain(); gg.gain.setValueAtTime(vol * v, t + t0); gg.gain.exponentialRampToValueAtTime(.001, t + t0 + d); o.connect(gg).connect(a.destination); o.start(t + t0); o.stop(t + t0 + d); return o; };
  if (M.cfg.sfx && M.cfg.sfx[n]) return M.sonar(M.cfg.sfx[n], v);
  if (n === 'acierto') { [660, 880, 1320].forEach((f, i) => tono(f, .35, 'triangle', i * .09)); }
  else if (n === 'fallo') { tono(220, .6, 'sawtooth', 0, .18); tono(160, .7, 'sawtooth', .15, .18); }
  else if (n === 'tic') tono(1200, .05, 'square', 0, .08);
  else if (n === 'tap') tono(700, .05, 'triangle', 0, .12);
  else if (n === 'whoosh' || n === 'aplauso') { const d = dur || (n === 'whoosh' ? .6 : 2.5); const b = a.createBuffer(1, a.sampleRate * d, a.sampleRate), x = b.getChannelData(0); for (let i = 0; i < x.length; i++) { const k = i / x.length; x[i] = (Math.random() * 2 - 1) * (n === 'whoosh' ? Math.sin(Math.PI * k) : (Math.random() < .3 ? 1 : .3) * Math.min(1, (1 - k) * 3)); } const s = a.createBufferSource(); s.buffer = b; const f = a.createBiquadFilter(); f.type = n === 'whoosh' ? 'bandpass' : 'highpass'; f.frequency.value = n === 'whoosh' ? 900 : 1500; g.gain.value = (n === 'whoosh' ? .35 : .22) * v; s.connect(f).connect(g); s.start(); }
  else if (n === 'redoble') { for (let i = 0; i < 24; i++) tono(120 + Math.random() * 30, .06, 'triangle', i * .06, .15); }
  else if (n === 'bote') { [523, 659, 784, 1046, 1318].forEach((f, i) => tono(f, .5, 'square', i * .12, .1)); }
  else if (n === 'clave') { tono(392, .2, 'square', 0, .12); tono(523, .4, 'square', .18, .12); }
};
// ---------------------------------------------------------------- voz (Piper pregrabada: voz/<hash>.mp3)
let vozIdx = null, vozAct = null;
M.cargarVoz = async () => { try { vozIdx = await (await fetch('voz/index.json')).json(); } catch (e) { vozIdx = {}; } };
M.decir = async function (texto, quien, opc = {}) {
  M.dichos.push((opc.off ? 'o' : '') + '|' + texto); const b = $('#bocad'); b.querySelector('i').textContent = quien || M.cfg.presentador; b.querySelector('span').textContent = texto; b.classList.remove('oculto'); b.classList.toggle('off', !!opc.off);
  const p = opc.personaje || (opc.off ? null : M.pres); if (p) p.userData.hablando = 1;
  const k = (opc.off ? 'o' : '') + hash(texto); let dur = Math.min(5200, 900 + texto.length * 55);
  if (vozAct) { try { vozAct.s.stop(); } catch (e) { } vozAct = null; }
  if (vozIdx && vozIdx[k] && M.opts.voz > 0 && M.turbo < 5) { const r = await M.sonar('voz/' + k + '.mp3', M.opts.voz / 100); if (r) { vozAct = r; dur = r.dur * 1000 + 250; } }
  await M.esperar(opc.corto ? Math.min(dur, 1200) : dur);
  if (p) p.userData.hablando = 0; if (!opc.queda) b.classList.add('oculto');
};
M.callar = () => { $('#bocad').classList.add('oculto'); if (vozAct) try { vozAct.s.stop(); } catch (e) { } if (M.pres) M.pres.userData.hablando = 0; };

// ---------------------------------------------------------------- toque: un único manejador de puntero, umbral 10 px
let tapCb = null, down = null;
M.alTocar = cb => tapCb = cb;
addEventListener('pointerdown', e => { if (AC && AC.state === 'suspended') AC.resume(); else ac(); const el = e.target.closest('[data-acc]'); down = { x: e.clientX, y: e.clientY, el, id: e.pointerId }; if (el) el.classList.add('pulsado'); }, { passive: true });
addEventListener('pointermove', e => { if (down && down.id === e.pointerId && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) { down.el && down.el.classList.remove('pulsado'); down.mov = 1; } }, { passive: true });
addEventListener('pointerup', e => { const d = down; down = null; if (!d || d.id !== e.pointerId) return; d.el && d.el.classList.remove('pulsado'); if (d.mov || !d.el || d.el.disabled) return; M.sfx('tap'); const acc = d.el.dataset.acc; tapCb && tapCb(acc, d.el); if (M._espera && M._espera[acc]) { const f = M._espera; M._espera = null; f.__r(acc, d.el); } });
addEventListener('pointercancel', () => { down && down.el && down.el.classList.remove('pulsado'); down = null; });
addEventListener('click', e => e.preventDefault(), true);
addEventListener('contextmenu', e => e.preventDefault());
// espera a que se pulse uno de los botones con data-acc dados
M.elegir = (accs, ms) => new Promise(r => { const o = {}; accs.forEach(a => o[a] = 1); let to; o.__r = (a, el) => { clearTimeout(to); r(a); }; M._espera = o; if (ms) to = setTimeout(() => { if (M._espera === o) { M._espera = null; r(null); } }, ms / (M.turbo || 1)); if (M.demoAuto) setTimeout(() => { if (M._espera === o) { M._espera = null; r(M.demoAuto(accs)); } }, 400 / (M.turbo || 1)); });
// ---------------------------------------------------------------- UI
M.ui = (html, cls = '') => { const u = $('#ui'); u.className = cls; u.innerHTML = html; return u; };
M.hud = html => { $('#hud').innerHTML = html; };
M.btn = (acc, txt, cls = '') => `<button class="b ${cls}" data-acc="${acc}">${txt}</button>`;
// cuenta atrás visible; devuelve promesa que se resuelve al llegar a 0
M.reloj = (seg, el = '#reloj') => { let s = seg, stop = false; const n = () => { const e = $(el); if (e) { e.textContent = s; e.classList.toggle('rojo', s <= 5); } };
  n(); const p = new Promise(r => { const it = setInterval(() => { if (stop) { clearInterval(it); return r('parado'); } s--; n(); if (s <= 5 && s > 0) M.sfx('tic'); if (s <= 0) { clearInterval(it); r('fin'); } }, 1000 / (M.turbo || 1)); }); p.parar = () => stop = true; p.queda = () => s; return p; };
// cortinilla 2D/3D con el logo del programa
M.cortinilla = async (texto, sub = '') => { M.sfx('whoosh'); const c = $('#cort'); c.innerHTML = `<div class="cl">${M.cfg.logoHTML}</div><div class="ct">${texto}</div><div class="cs">${sub}</div>`; c.className = 'on'; await M.esperar(1900); c.className = 'sale'; await M.esperar(500); c.className = ''; };
M.rotulo = (txt, sub = '') => { const r = $('#rotulo'); r.innerHTML = `<b>${txt}</b>${sub ? '<small>' + sub + '</small>' : ''}`; r.className = 'on'; clearTimeout(M._rt); M._rt = setTimeout(() => r.className = '', 3800 / (M.turbo || 1)); };
// créditos finales
M.creditos = async (lineas) => { const c = M.ui(`<div id="cred"><div class="roll">${lineas.map(l => l.startsWith('#') ? `<h3>${l.slice(1)}</h3>` : `<p>${l}</p>`).join('')}<div class="prod">Una producción de Iker</div></div></div><div class="abajo">${M.btn('menu', 'Menú principal')}</div>`, 'cred');
  M.cam([0, 6, 18], [0, 2, 0], 3); if (M.demo) { await new Promise(r => setTimeout(r, 2500)); await M.marca('creditos'); } await M.elegir(['menu'], M.demo ? 3000 : 60000); };
M.cfgOpciones = () => `<div class="marco"><h2>Opciones</h2>
  ${['mus:Música', 'sfx:Efectos', 'voz:Voz del presentador'].map(s => { const [k, t] = s.split(':'); return `<div class="op"><span>${t}</span>${[0, 40, 70, 100].map(v => `<button class="mini ${M.opts[k] == v ? 'sel' : ''}" data-acc="o_${k}_${v}">${v ? v + '%' : 'No'}</button>`).join('')}</div>`; }).join('')}
  <div class="op"><span>Gráficos</span>${['auto:Auto', 'baja:Baja (Redmi)', 'alta:Alta'].map(s => { const [k, t] = s.split(':'); return `<button class="mini ${M.opts.cal == k ? 'sel' : ''}" data-acc="o_cal_${k}">${t}</button>`; }).join('')}</div>
  ${M.cfg.opcionesExtra ? M.cfg.opcionesExtra() : ''}
  <p class="nota">Los cambios de gráficos se aplican al volver a abrir la app.</p>${M.btn('menu', 'Volver')}</div>`;
M.tratarOpcion = acc => { const m = /^o_([a-z]+)_(.+)$/.exec(acc); if (!m) return false; M.opts[m[1]] = isNaN(+m[2]) ? m[2] : +m[2]; M.guardarOpc(); return true; };
window.__M = M;
export default M;
M.marca = async n => { window.__marca = n; const k = window.__marcas = (window.__marcas || 0) + 1; if (M.demo) { const t0 = Date.now(); while ((window.__ack || 0) < k && Date.now() - t0 < 6000) await new Promise(r => setTimeout(r, 50)); } };
M.demoAuto = null; M.dichos = [];
