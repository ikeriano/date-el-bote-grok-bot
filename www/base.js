// Esqueleto común: carga, cabecera 3D, menú (Jugar, Entrenamiento, Opciones, Normas, Créditos, Historia) y final.
import M, { THREE } from './motor.js';
export async function arrancar(S) {
  M.init(S); await M.cargarVoz();
  document.title = S.titulo; S.construirPlato();
  document.getElementById('carga').remove();
  window.__rlAtras = () => { if (M.enMenu) return false; M.salir = true; M.callar(); return true; };
  if (M.demo) { M.opts.voz = 0; M.opts.mus = 0; }
  if (M.demo && S.demo[M.demo]) { await S.demo[M.demo](); window.__listo = 1; return; }
  if (M.demo && /^(modo|ent)_/.test(M.demo)) { // partida automática para pruebas y capturas
    M.demoAuto = accs => { const pref = accs.filter(a => !/^(menu|salir|saltar)/.test(a)); const l = pref.length ? pref : accs; return (window.__elige && window.__elige(l)) || l[Math.floor(Math.random() * l.length)]; };
    const m = [...S.modos.map(x => ({ ...x, k: 'modo_' + x.id })), ...S.entreno.map(x => ({ ...x, k: 'ent_' + x.id }))].find(x => x.k === M.demo);
    await M.marca('menu_previo'); try { await m.fn(); } catch (e) { console.error('ERR', e && e.stack || e); } window.__listo = 1; return; }
  if (M.demo === 'cabecera') { cabecera(S, 60000); setTimeout(() => window.__listo = 1, 2500); return; }
  if (!sessionStorage.getItem('vista_' + S.id)) { await cabecera(S); sessionStorage.setItem('vista_' + S.id, 1); }
  menu(S);
}
export async function cabecera(S, ms = 7000) {
  // escena 3D propia: el logo vuela entre aros y bolas con los colores del programa
  const sc = new THREE.Scene(); sc.background = new THREE.Color(S.cab.fondo); const cam = new THREE.PerspectiveCamera(50, M.camera.aspect, .1, 200);
  sc.add(new THREE.HemisphereLight(0xffffff, 0x333355, 2));
  const grupo = new THREE.Group(); sc.add(grupo); const objs = [];
  for (let i = 0; i < 26; i++) { const c = S.cab.colores[i % S.cab.colores.length]; let m;
    if (S.cab.forma === 'bolas') m = new THREE.Mesh(new THREE.SphereGeometry(.6 + Math.random(), 18, 12), new THREE.MeshLambertMaterial({ color: c, emissive: c, emissiveIntensity: .35 }));
    else m = new THREE.Mesh(new THREE.TorusGeometry(2 + Math.random() * 2, .18, 8, 40), new THREE.MeshBasicMaterial({ color: c }));
    m.position.set((Math.random() - .5) * 16, (Math.random() - .5) * 9, -i * 4); grupo.add(m); objs.push(m); }
  const t = M.tex(1024, 512, S.cab.logo); const logo = new THREE.Mesh(new THREE.PlaneGeometry(8, 4), new THREE.MeshBasicMaterial({ map: t, transparent: true })); logo.position.z = -110; sc.add(logo);
  M.escenaActiva = sc; M.camActiva = cam; cam.aspect = M.camera.aspect; cam.updateProjectionMatrix();
  if (S.sintonia) M.musica(S.sintonia, .8);
  const c = document.getElementById('ui'); c.className = 'cab'; c.innerHTML = `<button class="b saltar" data-acc="saltar">Saltar ⏭</button>`;
  let k = 0, fin = false; const t0 = performance.now();
  M.anim(dt => { if (fin) return false; k = (performance.now() - t0) / ms; cam.position.set(Math.sin(k * 6) * 2, Math.cos(k * 5) * 1, -k * 102); cam.lookAt(0, 0, cam.position.z - 10); objs.forEach((o, i) => { o.rotation.x += dt * (.3 + i % 3 * .2); o.rotation.y += dt * .5; }); logo.lookAt(cam.position); logo.scale.setScalar(1 + Math.max(0, k - .85) * 2); });
  await Promise.race([M.esperar(ms), M.elegir(['saltar'])]); fin = true;
  M.escenaActiva = null; M.camActiva = null; M.pararMusica(); c.innerHTML = '';
}
export function menu(S) {
  M.enMenu = true; M.salir = false; M.hud(''); M.callar(); M.cam(S.camMenu[0], S.camMenu[1], 1.5); if (S.musicaMenu) M.musica(S.musicaMenu, .35);
  const pinta = () => M.ui(`<div id="mlogo">${S.logoHTML}</div><div id="mbot">
    ${M.btn('jugar', '▶ Jugar', 'grande')}${M.btn('entreno', '🎯 Entrenamiento')}${M.btn('opciones', '⚙ Opciones')}${M.btn('normas', '📜 Normas')}${M.btn('creditos', '🎬 Créditos')}${M.btn('historia', '📺 Historia')}</div>
    <div class="ver">v1.0 · ${S.cadena} · juego de fans · Una producción de Iker</div>`, 'menu');
  pinta();
  M.alTocar(async (acc) => {
    if (!M.enMenu) return;
    if (acc === 'jugar') { M.ui(`<div class="marco"><h2>¿Qué programa jugamos?</h2>${S.modos.map(m => M.btn('modo_' + m.id, m.nombre + '<small>' + m.desc + '</small>', 'largo')).join('')}${M.btn('menu', 'Volver')}</div>`, 'sub'); }
    else if (acc.startsWith('modo_')) { const m = S.modos.find(x => 'modo_' + x.id === acc); M.enMenu = false; M.pararMusica(); try { await m.fn(); } catch (e) { if (e !== 'salir') console.error(e); } menu(S); }
    else if (acc === 'entreno') M.ui(`<div class="marco"><h2>Entrenamiento</h2><p>Practica una sola fase, sin presión.</p>${S.entreno.map(m => M.btn('ent_' + m.id, m.nombre, 'largo')).join('')}${M.btn('menu', 'Volver')}</div>`, 'sub');
    else if (acc.startsWith('ent_')) { const m = S.entreno.find(x => 'ent_' + x.id === acc); M.enMenu = false; M.pararMusica(); try { await m.fn(); } catch (e) { if (e !== 'salir') console.error(e); } menu(S); }
    else if (acc === 'opciones' || M.tratarOpcion(acc)) { M.ui(M.cfgOpciones(), 'sub'); }
    else if (acc === 'normas') M.ui(`<div class="marco texto"><h2>Normas</h2>${S.normasHTML}${M.btn('menu', 'Volver')}</div>`, 'sub');
    else if (acc === 'historia') M.ui(`<div class="marco texto"><h2>Historia del programa</h2>${S.historiaHTML}${M.btn('menu', 'Volver')}</div>`, 'sub');
    else if (acc === 'creditos') { M.enMenu = false; await M.creditos(S.creditos); menu(S); }
    else if (acc === 'menu') pinta();
    else if (S.menuExtra && S.menuExtra(acc)) M.ui(M.cfgOpciones(), 'sub');
  });
}
// comprobación de salida (botón atrás de Android durante la partida)
export const chk = () => { if (M.salir) { M.salir = false; throw 'salir'; } };
export async function final(S, titulo, texto) {
  M.hud(''); M.ui(`<div class="marco fin"><h2>${titulo}</h2><p>${texto}</p>${M.btn('seguir', 'Ver los créditos')}</div>`, 'sub'); M.aplaudir(3); if (S.sintonia) M.musica(S.sintonia, .5);
  await M.marca('fin_programa'); await M.elegir(['seguir'], M.demo ? 1500 : 0);
  await M.creditos(S.creditos); M.pararMusica();
}
