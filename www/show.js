// DATE EL BOTE (ETB2, 2001-2009; Jorge Fernández en 2001 y Carlos Sobera después) · juego de fans de Iker
import M, { THREE } from './motor.js';
import { arrancar, chk, final } from './base.js';
import { CULTURA } from './preguntas.js';
const VAL = 30; const ESC = [30, 60, 90, 120, 150, 180]; const DIAS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes'];
let BANCO = []; const sacar = () => { if (!BANCO.length) BANCO = M.mezclar(CULTURA); return BANCO.pop(); };
// ---------------- semana (bote acumulado de lunes a viernes, guardado en el móvil)
const sem = () => JSON.parse(localStorage.getItem('deb_sem') || '{"dia":0,"acum":0}'); const guardaSem = s => localStorage.setItem('deb_sem', JSON.stringify(s));
// ---------------- plató (ref.: fotogramas de ETB2 en YouTube): verde lima y amarillo, curvas y aros, fondo morado con aros,
// atriles blancos con tapa lima en fila, bolas verdes con el dinero, crono naranja
let P = {};
function plato() {
  const s = M.scene; s.background = new THREE.Color(0x2a0a50); s.fog = new THREE.Fog(0x2a0a50, 30, 60);
  const suelo = new THREE.Mesh(new THREE.CircleGeometry(30, 48), new THREE.MeshLambertMaterial({ color: 0xeaf5c8 })); suelo.rotation.x = -Math.PI / 2; s.add(suelo);
  for (let i = 0; i < 5; i++) M.aro(1.5 + i * 1.7, .09, i % 2 ? 0x9ad400 : 0xffd400, 0, .06, 1, s).rotation.x = Math.PI / 2;
  M.cil(1.4, 1.4, .05, 0x9ad400, 0, .03, 1, 40);
  // pared del fondo morada con aros lima (como en el plató de 2002)
  M.caja(30, 10, .3, M.basic(0x5a1aa0), 0, 5, -10);
  for (let i = -3; i <= 3; i++) { M.aro(1.6, .2, 0xc8ff3a, i * 3.6, 6.4, -9.7); M.aro(1.0, .12, 0xffe23a, i * 3.6 + 1.8, 3.6, -9.7); }
  for (let i = -6; i <= 6; i++) { const b = M.caja(.4, 10, .2, M.basic(i % 2 ? 0xd890ff : 0x8a3ae0), i * 2.4, 5, -9.75); }
  // curvas amarillas y lima a los lados
  for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) { const a = M.aro(2.2 + k * .8, .14, k % 2 ? 0xffd400 : 0x9ad400, sx * 11, 3 + k * .4, -6 + k * 1.4, s, Math.PI * 1.2); a.rotation.y = sx * .9; }
  // público detrás de los atriles
  M.publico(4, 22, 13, Math.PI * .7, Math.PI * 1.3, .4);
  for (const sx of [-1, 1]) M.caja(9, .5, 4, 0xbde05a, sx * 6, .25, -7.3);
  // atriles: chicos a la izquierda, chicas a la derecha (5 + 5)
  P.atriles = [[], []];
  for (let e = 0; e < 2; e++) for (let i = 0; i < 5; i++) { const x = (e ? 1 : -1) * (2.6 + i * 1.25), z = 1.2 - i * .55; const g = new THREE.Group(); g.position.set(x, 0, z); g.rotation.y = (e ? -1 : 1) * .5; s.add(g);
    const pie = M.cil(.42, .5, 1.05, 0xffffff, 0, .52, 0, 20, g); M.cil(.52, .52, .1, 0x9ad400, 0, 1.1, 0, 20, g);
    g.userData.n = M.panel(.62, .3, 128, 64, (c, w, h) => { c.fillStyle = e ? '#ff4fa8' : '#2a7aff'; c.beginPath(); c.roundRect(2, 2, w - 4, h - 4, 20); c.fill(); c.fillStyle = '#fff'; c.font = 'bold 34px Jost'; c.textAlign = 'center'; c.fillText(g.userData.t ?? '', w / 2, 44); }, 0, .7, .52, g);
    g.userData.poner = t => { g.userData.t = t; g.userData.n.redib(); };
    P.atriles[e].push(g); }
  // bolas verdes gigantes con el dinero de cada equipo
  P.bolas = [0, 1].map(e => { const b = M.esfera(1.1, new THREE.MeshLambertMaterial({ color: 0x7ad000, emissive: 0x2a5a00 }), (e ? 1 : -1) * 6.5, 5.2, -6); const p = M.panel(1.8, .9, 256, 128, (c, w, h) => { c.fillStyle = '#fff'; c.font = 'bold 84px Jost'; c.textAlign = 'center'; c.shadowColor = '#000'; c.shadowBlur = 8; c.fillText(P.din ? P.din[e] : 0, w / 2, 96); }, (e ? 1 : -1) * 6.5, 5.2, -4.85); return p; });
  P.rotEq = [0, 1].map(e => M.panel(2.4, .6, 256, 64, (c, w, h) => { c.fillStyle = e ? '#ff4fa8' : '#2a7aff'; c.beginPath(); c.roundRect(2, 2, w - 4, h - 4, 30); c.fill(); c.fillStyle = '#fff'; c.font = 'bold 40px Jost'; c.textAlign = 'center'; c.fillText(e ? 'CHICAS' : 'CHICOS', w / 2, 46); }, (e ? 1 : -1) * 6.5, 3.6, -5));
  // pantalla central con el logo y el bote
  P.pant = M.panel(5, 2.8, 512, 288, (c, w, h) => { const gr = c.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#c6f000'); gr.addColorStop(1, '#3a8a00'); c.fillStyle = gr; c.beginPath(); c.roundRect(0, 0, w, h, 40); c.fill(); if (LOGO.complete) c.drawImage(LOGO, 96, 4, 320, 185); c.fillStyle = '#6a1fb0'; c.beginPath(); c.roundRect(96, 200, 320, 70, 35); c.fill(); c.fillStyle = '#ffd400'; c.font = 'bold 44px Jost'; c.textAlign = 'center'; c.fillText('BOTE ' + M.euros(P.bote || 0), 256, 250); }, 0, 6.2, -8.8);
  M.focos([0xc8ff3a, 0xffd400, 0xd890ff, 0xffffff, 0xc8ff3a]);
  // presentadores: Carlos Sobera (pelo canoso, traje oscuro) y Jorge Fernández (2001: moreno, alto, joven)
  P.sobera = M.persona({ piel: 0xf0c4a0, pelo: 0xcfcfcf, peinado: 'corto', camisa: 0xdfe8ff, chaqueta: 0x2a2f45, corbata: 0x6a1fb0, pantalon: 0x2a2f45, altura: 1.06, nombre: 'Carlos Sobera', colorNombre: '#6a1fb0', cejas: 0x888888 });
  P.jorge = M.persona({ piel: 0xe8b890, pelo: 0x2a1a10, peinado: 'tupe', camisa: 0xffffff, chaqueta: 0x1a1a2a, corbata: 0x9ad400, pantalon: 0x1a1a2a, altura: 1.12, nombre: 'Jorge Fernández', colorNombre: '#6a1fb0' });
  for (const p of [P.sobera, P.jorge]) { p.position.set(0, 0, -.6); s.add(p); }
  ponerEra(M.opts.pres || 'sobera');
}
function ponerEra(e) { P.era = e; P.sobera.visible = e !== 'jorge'; P.jorge.visible = e === 'jorge'; M.pres = e === 'jorge' ? P.jorge : P.sobera; if (M.cfg) M.cfg.presentador = e === 'jorge' ? 'Jorge Fernández' : 'Carlos Sobera'; }
const LOGO = new Image(); LOGO.src = 'logo_deb.png'; LOGO.onload = () => P.pant && P.pant.redib();
// ---------------- equipos
const NOM = [['Asier', 'Jon', 'Mikel', 'Unai', 'Gorka'], ['Ane', 'Leire', 'Maite', 'Nerea', 'Irati']];
let EQ = [], figs = [];
function crearEquipos(miEq) {
  figs.forEach(f => M.scene.remove(f)); figs = [];
  EQ = [0, 1].map(e => ({ nom: e ? 'Chicas' : 'Chicos', din: 0, m: NOM[e].map((n, i) => ({ nombre: n, e, i, p: .55 + Math.random() * .22, yo: e === miEq && i === 0, fuera: false, ac: 0, esc: 0 })) }));
  const yo = EQ[miEq].m[0]; yo.nombre = miEq === 0 ? 'Iker' : 'Tú'; yo.p = 0;
  EQ.forEach((eq, e) => eq.m.forEach((m, i) => { const at = P.atriles[e][i]; const f = M.persona({ nombre: m.nombre + (m.yo ? ' ★' : ''), colorNombre: e ? '#d81b78' : '#1f5fd8', piel: M.pick([0xf1c6a0, 0xe8b48c, 0xd9a47a, 0xf5d5b8]), pelo: M.pick([0x2a1a10, 0x5a3a1a, 0x111111, 0xc89a50, 0x8a4a2a]), peinado: e ? M.pick(['largo', 'melena', 'coleta', 'rizado']) : M.pick(['corto', 'tupe', 'rizado', 'corto']), camisa: m.yo ? 0x9ad400 : M.pick([0xffffff, 0x3b7be9, 0xe94b4b, 0xf2c230, 0x9b59b6, 0x47c9d8, 0x222222]), pantalon: 0x223355, mangaCorta: 1, barba: !e && Math.random() < .3 ? 0x2a1a10 : 0 });
    f.position.set(at.position.x, 0, at.position.z - .55); f.rotation.y = at.rotation.y; M.scene.add(f); m.fig = f; figs.push(f); at.userData.poner(m.nombre); at.visible = true; }));
  P.din = [0, 0]; P.bolas.forEach(b => b.redib());
}
const vivos = e => EQ[e].m.filter(m => !m.fuera);
const sumar = (e, v) => { EQ[e].din += v; P.din = EQ.map(q => q.din); P.bolas.forEach(b => b.redib()); };
// ---------------- HUD: bolas verdes, crono naranja, bote
let CR = null;
function marc(extra = '') { M.hud(`<div class="marcador izq">${EQ[0].din}<small>CHICOS</small></div><div class="marcador der">${EQ[1].din}<small>CHICAS</small></div>${CR != null ? `<div class="crono ${CR <= 10 ? 'rojo' : ''}" id="crono">${fmt(CR)}</div>` : ''}${P.bote != null ? `<div class="botepill">BOTE ${M.euros(P.bote)}</div>` : ''}${extra}`); }
const fmt = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
function crono(seg) { CR = seg; let st = false; const p = new Promise(r => { const it = setInterval(() => { if (st) { clearInterval(it); return r(); } CR--; const e = document.getElementById('crono'); if (e) { e.textContent = fmt(CR); e.classList.toggle('rojo', CR <= 10); } if (CR <= 5 && CR > 0) M.sfx('tic'); if (CR <= 0) { clearInterval(it); r(); } }, 1000 / (M.turbo || 1)); }); p.parar = () => st = true; p.vivo = () => CR > 0 && !st; return p; }
// ---------------- una pregunta de 3 opciones
async function preguntar(m, { leer = true, rapida = false, seg = 10 } = {}) {
  const q = sacar(); const ops = M.mezclar(q.ops); const acc = ops.map((_, i) => 'r' + i);
  const pinta = (sel, ok) => M.ui(`<div class="preg"><div class="quien">${m.nombre} · ${EQ[m.e].nom}</div><div class="q">${q.q}</div><div class="ops">${ops.map((o, i) => `<button class="b ${sel != null && o === q.ok ? 'ok' : ''} ${sel === i && o !== q.ok ? 'mal' : ''}" data-acc="r${i}">${['A', 'B', 'C'][i]}. ${o}</button>`).join('')}</div></div>`);
  pinta(); M.cam([m.fig.position.x * .6, 2.3, m.fig.position.z + 4.6], [m.fig.position.x, 1.5, m.fig.position.z], rapida ? .5 : .8);
  if (leer) M.decir(q.q, null, { corto: 1, queda: 0 });
  let sel;
  if (m.yo && !m.fuera) { if (P.mp) { const k = P.mp; P.mp = null; await M.marca(k); } const a = await M.elegir(acc, seg * 1000); chk(); sel = a == null ? -1 : +a.slice(1); }
  else { await M.esperar(rapida ? 700 : 1500); const bien = Math.random() < m.p; sel = bien ? ops.indexOf(q.ok) : ops.findIndex(o => o !== q.ok); }
  const ok = sel >= 0 && ops[sel] === q.ok; pinta(sel, ok); M.sfx(ok ? 'acierto' : 'fallo'); if (ok) M.celebrar(m.fig, 900);
  await M.esperar(rapida ? 450 : 900); M.ui(''); return ok;
}
// ---------------- FASE 1: duelos cara a cara (chico contra chica, 1 minuto, preguntas alternas, 30 € por acierto)
async function duelos(soloMio) {
  await M.cortinilla('Duelos cara a cara', 'Un chico contra una chica · 1 minuto · 30 € por acierto'); await M.marca('duelos');
  await M.decir('Empezamos con los duelos cara a cara. Un chico contra una chica, durante un minuto, con preguntas alternas. Cada acierto, treinta euros para el equipo.'); chk();
  const mio = EQ.flatMap(e => e.m).find(m => m.yo).i;
  for (let i = 0; i < 5; i++) { if (soloMio && i !== mio) continue; chk();
    const a = EQ[1].m[i], b = EQ[0].m[i]; const conYo = a.yo || b.yo; M.rotulo(`Duelo ${i + 1}: ${b.nombre} contra ${a.nombre}`, conYo ? '¡Te toca! Tienes un minuto' : 'Duelo resumido');
    if (!conYo) { await M.decir(`Duelo de ${b.nombre} y ${a.nombre}.`, null, { corto: 1 }); }
    else await M.decir(`¡Ahora te toca a ti! ${b.nombre} contra ${a.nombre}. Un minuto. ¡Tiempo!`, null, { corto: 1 });
    if (conYo) P.mp = 'duelo_tuyo'; const rel = crono(60); marc(); let t = i % 2; let n = 0; const visibles = conYo ? 999 : 4;
    while (rel.vivo() && n < visibles) { const m = t ? a : b; const ok = await preguntar(m, { leer: conYo, rapida: !conYo }); chk(); if (ok) { sumar(m.e, VAL); m.ac++; } marc(); t = 1 - t; n++; }
    if (!conYo) { rel.parar(); const extra = 12 - n; for (let k = 0; k < extra; k++) { const m = k % 2 ? a : b; if (Math.random() < m.p) { sumar(m.e, VAL); m.ac++; } } CR = 0; marc(); await M.decir(`Final del duelo. Chicos ${EQ[0].din}, chicas ${EQ[1].din}.`, null, { corto: 1 }); }
    else { M.sfx('fallo'); await M.decir('¡Tiempo!', null, { corto: 1 }); }
    CR = null; marc(); }
}
// ---------------- FASE 2: ronda rápida (2 minutos, por turnos, el equipo con menos dinero queda eliminado; empate: otra ronda)
async function rondaRapida(seg = 120) {
  let vuelta = 0;
  while (true) { chk(); vuelta++;
    await M.cortinilla(vuelta === 1 ? 'Ronda rápida' : 'Ronda rápida de desempate', '2 minutos · 30 € por acierto'); await M.marca('ronda_rapida');
    await M.decir(vuelta === 1 ? 'Ronda rápida: dos minutos, los dos equipos por turnos. El equipo que acabe con menos dinero queda eliminado. ¡Vamos!' : '¡Empate! Hay que jugar otra ronda rápida.'); chk();
    P.mp = 'ronda_rapida_tuya'; const rel = crono(seg); marc(); let t = 0, idx = [0, 0], n = 0;
    while (rel.vivo()) { const m = EQ[t].m[idx[t] % 5]; idx[t]++; const ok = await preguntar(m, { leer: m.yo, rapida: !m.yo, seg: 6 }); chk(); if (ok) { sumar(t, VAL); m.ac++; } marc(); t = 1 - t; n++; }
    CR = null; marc(); M.sfx('bote'); await M.decir('¡Date el bote!'); M.aplaudir(2);
    if (EQ[0].din !== EQ[1].din) break; }
  const g = EQ[0].din > EQ[1].din ? 0 : 1; return g;
}
// ---------------- FASE 3: rondas de eliminación (tira de preguntas a 30 € y votación; empate: decide el equipo eliminado)
async function eliminaciones(g, el) {
  for (let r = 1; vivos(g).length > 2; r++) { chk(); const v = vivos(g);
    await M.cortinilla(`Ronda de eliminación ${r}`, `${EQ[g].nom}: ${v.length} concursantes · 30 € por acierto`); await M.marca('eliminacion_' + r);
    await M.decir(`Ronda de eliminación número ${r}. Una tira de preguntas con tres opciones para el equipo de ${EQ[g].nom.toLowerCase()}. Cada acierto suma treinta euros al bote.`); chk();
    v.forEach(m => m.ronda = 0); if (r === 1) P.mp = 'tira_tuya';
    for (let k = 0; k < 2; k++) for (const m of v) { const ok = await preguntar(m, { leer: m.yo, rapida: !m.yo }); chk(); if (ok) { sumar(g, VAL); P.bote = EQ[g].din; m.ac++; m.ronda++; } marc(); }
    // votación
    await M.decir('Ahora tenéis que votar. ¿A qué compañero queréis eliminar?'); chk();
    const votos = new Map(v.map(m => [m, 0]));
    for (const m of v) { let x;
      if (m.yo) { M.ui(`<div class="marco votos"><h2>¿A quién eliminas?</h2><p class="nota">Aciertos en esta ronda: ${v.map(o => `${o.nombre} ${o.ronda}`).join(' · ')}</p>${v.filter(o => o !== m).map(o => M.btn('v_' + o.i, o.nombre)).join('')}</div>`); await M.marca('votacion'); const a = await M.elegir(v.filter(o => o !== m).map(o => 'v_' + o.i)); chk(); M.ui(''); x = v.find(o => 'v_' + o.i === a); }
      else { const otros = v.filter(o => o !== m && !(M.demo && o.yo)); const min = Math.min(...otros.map(o => o.ronda)); x = M.pick(otros.filter(o => o.ronda === min)); }
      votos.set(x, votos.get(x) + 1); }
    const max = Math.max(...votos.values()); let emp = [...votos].filter(([, n]) => n === max).map(([m]) => m);
    M.ui(`<div class="marco"><h2>Resultado de la votación</h2><table class="tabla">${[...votos].map(([m, n]) => `<tr><td>${m.nombre}</td><td>${'🟢'.repeat(n) || '—'}</td></tr>`).join('')}</table></div>`); await M.esperar(2200); M.ui('');
    let fuera = emp[0];
    if (emp.length > 1) { await M.decir(`¡Empate a votos! Decide el equipo eliminado, el de ${EQ[el].nom.toLowerCase()}.`); chk();
      const yoEl = EQ[el].m.some(m => m.yo);
      if (yoEl) { M.ui(`<div class="marco votos"><h2>Desempate: decide tu equipo</h2>${emp.map(o => M.btn('v_' + o.i, o.nombre)).join('')}</div>`); const a = await M.elegir(emp.map(o => 'v_' + o.i)); chk(); M.ui(''); fuera = emp.find(o => 'v_' + o.i === a); }
      else fuera = M.pick(emp); }
    fuera.fuera = true; M.sfx('fallo'); P.atriles[g][fuera.i].userData.poner('—'); M.cam([fuera.fig.position.x * .6, 2.3, fuera.fig.position.z + 4], [fuera.fig.position.x, 1.4, fuera.fig.position.z], .8);
    await M.decir(fuera.yo ? 'Te han eliminado... ¡pero lo has hecho genial! Ahora mira cómo acaba el programa.' : `${fuera.nombre}, lo siento, te vas del juego. ¡Muchas gracias!`); M.scene.remove(fuera.fig); chk(); }
}
// ---------------- FASE 4: el escalado (de 30 a 150 € y la última a 180 €; quien tenga más dinero va a la final)
async function escalado(dos) {
  await M.cortinilla('El escalado', 'De 30 € a 150 €, y la última pregunta vale 180 €'); await M.marca('escalado');
  await M.decir(`¡El escalado! ${dos[0].nombre} y ${dos[1].nombre}, cara a cara. Las preguntas suben de treinta a ciento cincuenta euros y la última vale ciento ochenta. Quien sume más, va a la final.`); chk();
  dos.forEach(m => m.esc = 0); P.mp = 'escalado_tuyo'; const tab = () => `<div class="botepill" style="left:auto;right:2vw;bottom:auto;top:16vh">${dos.map(m => `${m.nombre}: ${m.esc} €`).join(' · ')}</div>`;
  for (let s = 0; s < ESC.length; s++) { M.rotulo(`Pregunta de ${ESC[s]} €`, s === 5 ? '¡La última!' : ''); for (const m of (s % 2 ? [dos[1], dos[0]] : dos)) { marc(tab()); const ok = await preguntar(m, { leer: m.yo }); chk(); if (ok) m.esc += ESC[s]; marc(tab()); } }
  while (dos[0].esc === dos[1].esc) { await M.decir('¡Empate! Pregunta de desempate de ciento ochenta euros.'); for (const m of dos) { const ok = await preguntar(m, { leer: m.yo }); chk(); if (ok) m.esc += 180; marc(tab()); } }
  const w = dos[0].esc > dos[1].esc ? dos[0] : dos[1], l = w === dos[0] ? dos[1] : dos[0]; l.fuera = true; M.scene.remove(l.fig); return w;
}
// ---------------- FASE 5: la final (el superviviente contra el equipo eliminado; gana quien llegue antes a 5 aciertos)
async function laFinal(sup, el, bote) {
  const s = sem(); const viernes = s.dia === 4; const enJuego = viernes ? s.acum + bote : bote;
  await M.cortinilla('La final', `${sup.nombre} contra el equipo de ${EQ[el].nom.toLowerCase()} · el primero en llegar a 5 aciertos`); await M.marca('final');
  P.bote = enJuego; P.pant.redib(); marc();
  await M.decir(`¡La final! ${sup.nombre} se juega ${viernes ? 'el bote acumulado de la semana' : 'el bote del día'}: ${M.euros(enJuego)}. Enfrente, el equipo eliminado. Gana quien llegue antes a cinco aciertos.`); chk();
  let a = 0, b = 0, k = 0; P.mp = 'final_tuya'; const tab = () => `<div class="botepill" style="left:auto;right:2vw;bottom:auto;top:16vh">${sup.nombre}: ${'●'.repeat(a)}${'○'.repeat(Math.max(0, 5 - a))} · ${EQ[el].nom}: ${'●'.repeat(b)}${'○'.repeat(Math.max(0, 5 - b))}</div>`;
  while (true) { chk(); marc(tab()); if (await preguntar(sup, { leer: sup.yo })) a++; marc(tab()); const m = EQ[el].m[k++ % 5]; if (await preguntar(m, { leer: m.yo })) b++; marc(tab());
        if ((a >= 5 || b >= 5) && a !== b) break; }
  const gana = a > b; await M.marca('final_resultado');
  if (gana) { M.sfx('bote'); M.aplaudir(4); M.celebrar(sup.fig, 3500); await M.decir(`¡${sup.nombre}, te llevas ${M.euros(enJuego)}! ¡Te has dado el bote!`); guardaSem({ dia: (s.dia + 1) % 5, acum: viernes ? 0 : s.acum }); }
  else { EQ[el].m.forEach(m => M.celebrar(m.fig, 2500)); M.aplaudir(3);
    if (viernes) { await M.decir(`¡Gana el equipo de ${EQ[el].nom.toLowerCase()}! Es viernes: se reparten el bote acumulado, ${M.euros(enJuego)}. ¡A ${M.euros(enJuego / 5)} cada uno!`); guardaSem({ dia: 0, acum: 0 }); }
    else { await M.decir(`¡Gana el equipo eliminado! El bote de hoy no sale y se acumula para mañana: ${M.euros(s.acum + bote)}.`); guardaSem({ dia: s.dia + 1, acum: s.acum + bote }); } }
  return { gana, enJuego, viernes };
}
// ---------------- PARTIDA
async function partida(era, solo) {
  ponerEra(era); P.bote = null; CR = null;
  M.ui(`<div class="marco"><h2>¿En qué equipo juegas?</h2>${M.btn('eq0', '👦 Chicos', 'largo')}${M.btn('eq1', '👧 Chicas', 'largo')}</div>`, 'sub'); await M.marca('elegir_equipo');
  const miEq = +(await M.elegir(['eq0', 'eq1'])).slice(2); M.ui(''); crearEquipos(miEq); marc();
  const s = sem(); M.musica('audio/sintonia.mp3', .3); await M.cam([0, 5, 13], [0, 2, -2], 1.4); M.rotulo(`Programa del ${DIAS[s.dia]}`, s.acum ? `Bote acumulado de la semana: ${M.euros(s.acum)}` : 'Empieza la semana');
  await M.marca('presentacion');
  if (!solo) { await M.decir(era === 'jorge' ? '¡Buenas tardes! Bienvenidos a Date el bote, el nuevo concurso de ETB dos. Cinco chicos contra cinco chicas.' : '¡Kaixo, buenas tardes! Bienvenidos a Date el bote. Cinco chicos contra cinco chicas, ¡y un bote esperando!'); chk(); }
  M.pararMusica();
  if (solo === 'ronda') { await rondaRapida(60); return volver(); }
  if (solo === 'final') { const sup = EQ[1 - miEq].m[0]; P.bote = 600; await laFinal(sup, miEq, 600); return volver(); }
  await duelos(solo === 'duelos'); if (solo === 'duelos') return volver(); chk();
  const g = await rondaRapida(); const el = 1 - g;
  await M.decir(`Los ${EQ[g].nom.toLowerCase()} siguen con ${EQ[g].din} euros. El equipo de ${EQ[el].nom.toLowerCase()} queda eliminado... ¡pero volverá en la final!`); chk();
  vivos(el).forEach(m => { m.fig.rotation.y += Math.PI * .25; });
  P.bote = EQ[g].din; P.pant.redib(); marc();
  await eliminaciones(g, el); chk(); P.pant.redib();
  const w = await escalado(vivos(g)); chk();
  await M.decir(`¡${w.nombre} gana el escalado y se juega el bote en la final!`); chk();
  const r = await laFinal(w, el, EQ[g].din);
  await final(S, r.gana ? `¡${w.nombre} se da el bote!` : `¡Ganan los ${EQ[el].nom.toLowerCase()}!`, r.gana ? `${M.euros(r.enJuego)} para ${w.nombre}.` : r.viernes ? `El equipo se reparte ${M.euros(r.enJuego)}.` : `El bote se acumula para el próximo programa.`);
  limpiar();
}
async function volver() { M.ui(`<div class="marco"><h2>Fin del entrenamiento</h2>${M.btn('menu2', 'Volver al menú')}</div>`); await M.elegir(['menu2'], M.demo ? 1200 : 0); limpiar(); }
function limpiar() { figs.forEach(f => M.scene.remove(f)); figs = []; P.atriles.flat().forEach(a => a.userData.poner('')); EQ.forEach(e => e.din = 0); P.din = [0, 0]; P.bolas.forEach(b => b.redib()); P.bote = null; P.pant.redib(); CR = null; M.hud(''); }
const LOGOH = `<img src="logo_deb.png" style="width:min(44vw,80vh)">`;
const S = {
  id: 'deb', titulo: 'Date el Bote', cadena: 'ETB2', presentador: 'Carlos Sobera', fondo: 0x2a0a50, logoHTML: LOGOH, sintonia: 'audio/sintonia.mp3',
  construirPlato: plato, camMenu: [[0, 5, 14], [0, 2.5, -3]],
  cab: { fondo: 0x1a40b0, colores: [0xffd400, 0xe0182d, 0x3d9bff, 0xffffff, 0x9ad400], forma: 'bolas', logo: (g, w, h) => { if (LOGO.complete) g.drawImage(LOGO, 212, 50, 600, 347); } },
  modos: [{ id: 'sobera', nombre: '📺 Programa con Carlos Sobera', desc: 'La época más conocida (2002-2009)', fn: () => partida('sobera') }, { id: 'jorge', nombre: '📼 Programa con Jorge Fernández', desc: 'Los comienzos, en 2001', fn: () => partida('jorge') }],
  entreno: [{ id: 'duelos', nombre: 'Solo tu duelo cara a cara', fn: () => partida(M.opts.pres || 'sobera', 'duelos') }, { id: 'ronda', nombre: 'Ronda rápida (1 minuto)', fn: () => partida(M.opts.pres || 'sobera', 'ronda') }, { id: 'final', nombre: 'Solo la final (a 5 aciertos)', fn: () => partida(M.opts.pres || 'sobera', 'final') }],
  opcionesExtra: () => `<div class="op"><span>Presentador</span>${[['sobera', 'Carlos Sobera'], ['jorge', 'Jorge Fernández (2001)']].map(([k, t]) => `<button class="mini ${(M.opts.pres || 'sobera') === k ? 'sel' : ''}" data-acc="o_pres_${k}">${t}</button>`).join('')}</div><div class="op"><span>Semana</span><button class="mini" data-acc="o_semana_0">Empezar semana nueva</button></div>`,
  normasHTML: `<p><b>Dos equipos:</b> cinco chicos contra cinco chicas. Tú juegas en uno de ellos y tus compañeros los maneja el juego.</p>
  <p><b>1. Duelos cara a cara.</b> Un chico contra una chica durante un minuto, con preguntas alternas de tres opciones. Cada acierto da 30 € al equipo.</p>
  <p><b>2. Ronda rápida.</b> Dos minutos, los dos equipos responden por turnos (30 € por acierto). El equipo con menos dinero queda eliminado. Si hay empate, se juega otra ronda rápida. Al acabar, el presentador grita: «¡Date el bote!».</p>
  <p><b>3. Rondas de eliminación.</b> Tres rondas. El equipo que sigue responde una tira de preguntas de tres opciones (30 € cada acierto) y luego vota a un compañero para eliminarlo. Si hay empate, decide el equipo eliminado. Así hasta que quedan dos.</p>
  <p><b>4. El escalado.</b> Los dos últimos responden preguntas que suben de 30 € a 150 €, y la última vale 180 €. Quien suma más dinero va a la final.</p>
  <p><b>5. La final.</b> El superviviente contra el equipo eliminado. Gana quien llegue antes a cinco aciertos. El superviviente se juega el bote del día o, el viernes, el bote acumulado. Si gana el equipo un viernes, se lo reparten.</p>
  <p class="nota">Adaptaciones del juego (no vienen en el texto del programa): los duelos en los que no juegas se ven resumidos; en la tira cada concursante responde dos preguntas; el escalado tiene seis escalones (30, 60, 90, 120, 150 y 180 €) y si hay empate se desempata con preguntas de 180 €; el bote del día es el dinero que ha sumado el equipo superviviente; si gana el equipo eliminado de lunes a jueves, ese bote se acumula para el día siguiente. Las preguntas son de cultura general escritas para este juego, con respuestas reales.</p>`,
  historiaHTML: `<p><b>Date el bote</b> fue un concurso de <b>ETB2</b> (Euskal Telebista) que se emitió entre 2001 y 2009.</p><p>En 2001 lo presentó <b>Jorge Fernández</b> y desde 2002 <b>Carlos Sobera</b>. Enfrentaba a un equipo de cinco chicos contra uno de cinco chicas.</p><p>El programa terminaba con una final en la que un único superviviente se jugaba el bote contra el equipo eliminado, y el viernes podía estar en juego el bote acumulado de varios días.</p>`,
  creditos: ['#Date el Bote · juego de fans', 'Basado en el concurso de ETB2 (2001-2009)', 'Presentado por Carlos Sobera y, en 2001, Jorge Fernández', '#Personajes', 'Carlos Sobera y Jorge Fernández (versiones 3D)', 'Concursantes: personas inventadas', '#Voz', 'Voz del presentador: Piper es_ES-davefx-medium', '#Música', 'Cabecera: Date el bote (ETB, 2002)', '#Plató', 'Recreado en 3D a partir de fotogramas reales de ETB2', 'Motor 3D: three.js', '#Preguntas', 'Cultura general con respuestas reales', '#Programado por', 'Grok Bot para Iker'],
  menuExtra: () => false, demo: {},
};
const _tr = M.tratarOpcion; M.tratarOpcion = acc => { if (acc === 'o_semana_0') { guardaSem({ dia: 0, acum: 0 }); return true; } const r = _tr(acc); if (r && acc.startsWith('o_pres_')) ponerEra(M.opts.pres); return r; };
M.cfg = S;
arrancar(S);
