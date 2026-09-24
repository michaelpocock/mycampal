import * as THREE from 'three';

const stage = document.querySelector('three-d-stage');
const { } = await stage.ready;

const M = {
  ply:      new THREE.MeshStandardMaterial({ color: 0xa9a7a2, roughness: 0.78, metalness: 0.02 }),
  ply_dark: new THREE.MeshStandardMaterial({ color: 0x7d7b77, roughness: 0.8,  metalness: 0.02 }),
  accent:   new THREE.MeshStandardMaterial({ color: 0x1b1a19, roughness: 0.5, metalness: 0.06 }),
  badge:    new THREE.MeshStandardMaterial({ color: 0x000000, roughness: 0.5, metalness: 0.06 }),   /* fridge fronts, matched to the badge ground */
  steel:    new THREE.MeshStandardMaterial({ color: 0xb9b7b2, roughness: 0.35, metalness: 0.35 }),
  cushion:  new THREE.MeshStandardMaterial({ color: 0xd2d0cb, roughness: 0.95, metalness: 0.0 }),
  cushion_face: new THREE.MeshStandardMaterial({ color: 0x555f80, roughness: 0.95, metalness: 0.0 }),
  skin:     new THREE.MeshStandardMaterial({ color: 0xe3b795, roughness: 0.8, metalness: 0.0 }),
  hair:     new THREE.MeshStandardMaterial({ color: 0x8d7256, roughness: 0.9, metalness: 0.0 }),
  tee:      new THREE.MeshStandardMaterial({ color: 0x232323, roughness: 0.9, metalness: 0.0 }),
  shorts:   new THREE.MeshStandardMaterial({ color: 0x8b8567, roughness: 0.9, metalness: 0.0 }),
  sweat:    new THREE.MeshStandardMaterial({ color: 0xc7cad1, roughness: 0.95, metalness: 0.0 }),
  jeans:    new THREE.MeshStandardMaterial({ color: 0x5b7098, roughness: 0.9, metalness: 0.0 }),
  eye:      new THREE.MeshStandardMaterial({ color: 0x2b2724, roughness: 0.4, metalness: 0.0 }),
  mouth:    new THREE.MeshStandardMaterial({ color: 0xa8635c, roughness: 0.7, metalness: 0.0 }),
  card:     new THREE.MeshStandardMaterial({ color: 0xf2efe6, roughness: 0.6, metalness: 0.0 }),
  wine:     new THREE.MeshStandardMaterial({ color: 0x6d1f33, roughness: 0.25, metalness: 0.0 }),
  crystal:  new THREE.MeshStandardMaterial({ color: 0xdfe6e8, roughness: 0.1, metalness: 0.1, transparent: true, opacity: 0.45 }),
  cushion_edge: new THREE.MeshStandardMaterial({ color: 0xb3ab73, roughness: 0.95, metalness: 0.0 }),
  stove:    new THREE.MeshStandardMaterial({ color: 0x24211f, roughness: 0.45, metalness: 0.3 }),
  latch:    new THREE.MeshStandardMaterial({ color: 0x2f5fd0, roughness: 0.4, metalness: 0.15 }),
  worktop:  new THREE.MeshStandardMaterial({ color: 0x2e2b28, roughness: 0.7,  metalness: 0.1 }),
  carpet:   new THREE.MeshStandardMaterial({ color: 0x37373a, roughness: 0.98, metalness: 0.0 }),
  trim:     new THREE.MeshStandardMaterial({ color: 0x8a867e, roughness: 0.88, metalness: 0.02 }),
  trim_clear: new THREE.MeshStandardMaterial({ color: 0x8a867e, roughness: 0.88, metalness: 0.02, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide }),
  trim_dk:  new THREE.MeshStandardMaterial({ color: 0x55524d, roughness: 0.85, metalness: 0.03 }),
  glass:    new THREE.MeshStandardMaterial({ color: 0x8fa2a8, roughness: 0.15, metalness: 0.1, transparent: true, opacity: 0.28 }),
  seat:     new THREE.MeshStandardMaterial({ color: 0x26262a, roughness: 0.92, metalness: 0.0 }),
};
M.door = M.trim.clone();
M.door.transparent = true; M.door.depthWrite = false;
M.door_dk = M.trim_dk.clone();
M.door_dk.transparent = true; M.door_dk.depthWrite = false;
for (const [k, v] of Object.entries(M)) v.name = k;

const model = new THREE.Group();
model.name = 'camping_box';

function box(name, w, h, d, x, y, z, mat, parent = model) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.name = name;
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}
function tube(name, r, len, x, y, z, mat, parent = model, axis = 'x') {
  const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, len, 24), mat);
  m.name = name;
  if (axis === 'x') m.rotation.z = Math.PI / 2;
  if (axis === 'z') m.rotation.x = Math.PI / 2;
  m.position.set(x, y, z);
  parent.add(m);
  return m;
}

/* ---- dimensions (metres). +z = towards the tailgate, -z = towards the cab ---- */
const W = 1.20, D = 0.715, H = 0.59, T = 0.018;   /* folded, the stack overhangs the fore face by ~55 mm — accepted, so the bed keeps its 2000 mm length */   /* W capped at 1200 mm (was 1370) — clears the arches with room to spare  /* old: 1390 mm between the arches, less 10 mm clearance */
const BOXZ = 0.0075;   /* rear face stays butted to the tailgate end at z 0.295 */
const POST_HOLE_Z = -D / 2 + 0.10;   /* far enough aft that the bedside foot plate sits wholly inside the carcass base */
const POST_HOLE_Z2 = 0;   /* (retired) the old centre socket in the hatch bay */
/* the bedside table's two sockets sit on the top of the box, one over each drawer
   bay, towards the cab end — flush plates let into the top deck */
const SOCK_X = (W - 4 * T) / 3 + T;
const SOCK_DX = 0.09;   /* both sockets sit 90 mm right of their deck centres */
const SOCK_XL = -SOCK_X + SOCK_DX, SOCK_XR = SOCK_X + SOCK_DX;

/* ---- van: load bay of a Tourneo Custom, seen from the tailgate ---- */
const VW = 1.59, VWA = 1.22, VH = 1.32, TAIL = 0.42, CAB = -2.32;

const SEATZ = -1.06;   /* seats removed — kept as the datum the bed reaches over */

/* ---- solid version of the same load bay ---- */
const vanSolid = new THREE.Group(); vanSolid.name = 'van_solid'; model.add(vanSolid);
const S = (n, w, h, d, x, y, z, mat) => box(n, w, h, d, x, y, z, mat, vanSolid);

S('load_floor', VW, 0.02, TAIL - CAB, 0, -0.011, (TAIL + CAB) / 2, M.carpet);
for (let i = 0; i < 6; i++) {
  const x = -0.75 + i * 0.30;
  S('floor_rail_' + (i + 1), 0.075, 0.014, (TAIL - 0.12) - (CAB + 0.20), x, 0.005, ((TAIL - 0.12) + (CAB + 0.20)) / 2, M.trim_dk);
}
for (const [side, sx] of [['left', -1], ['right', 1]]) {
  const wx = sx * (VW / 2 - 0.01);
  S('side_panel_' + side, 0.02, 0.86, TAIL - CAB, wx, 0.43, (TAIL + CAB) / 2, M.trim_clear);
  S('side_glass_' + side, 0.014, VH - 0.90, TAIL - CAB - 0.20, wx, 0.90 + (VH - 0.90) / 2, (TAIL + CAB) / 2 - 0.10, M.glass);
  const aw = VW / 2 - VWA / 2;
  /* the offside casing runs all the way back to the tailgate */
  const aL = sx > 0 ? (TAIL - 0.02) - (-0.67) : 0.86;
  const aZ = sx > 0 ? ((TAIL - 0.02) + (-0.67)) / 2 : -0.24;
  S('arch_box_' + side, aw, 0.30, aL, sx * (VWA / 2 + aw / 2), 0.15, aZ, M.trim);
  S('arch_top_' + side, aw, 0.02, aL, sx * (VWA / 2 + aw / 2), 0.30, aZ, M.trim_dk);
}
/* ---- nearside rear air-conditioning housing: a trimmed box over the arch at the
   tailgate end, with a louvred return-air panel on its inboard face. Sits flush
   with the arch, so the camping box still clears it. ---- */
{
  const acW = VW / 2 - VWA / 2, acH = 0.72, acL = 0.60;
  const acX = -(VWA / 2 + acW / 2), acZ = TAIL - 0.02 - acL / 2;
  S('ac_housing', acW, acH, acL, acX, acH / 2, acZ, M.trim);
  S('ac_housing_top', acW, 0.02, acL, acX, acH + 0.01, acZ, M.trim_dk);
  /* louvred vent panel, inboard face */
  const vx = -(VWA / 2) + 0.006;
  S('ac_vent_frame', 0.012, 0.30, 0.34, vx, 0.46, acZ, M.trim_dk);
  for (let i = 0; i < 7; i++) {
    S('ac_vent_slat_' + (i + 1), 0.016, 0.022, 0.32, vx - 0.002, 0.34 + i * 0.040, acZ, M.trim);
  }
}
/* ---- Julia and Mike, stood on the ground behind the tailgate, carrying the box in ---- */
const GROUND = -0.55;   /* the load floor sits this far above the tarmac */
const lifters = new THREE.Group(); lifters.name = 'box_lifters';
lifters.visible = false; vanSolid.add(lifters);
function lifter(tag, sx, kit) {
  const g = new THREE.Group(); g.name = 'lifter_' + tag; lifters.add(g);
  const hip = GROUND + 0.88, sh = GROUND + 1.40;
  for (const lx of [-0.085, 0.085]) {
    box('lifter_' + tag + '_leg' + (lx < 0 ? '_l' : '_r'), 0.13, hip - GROUND, 0.17, lx, GROUND + (hip - GROUND) / 2, 0, kit.legs, g);
  }
  box('lifter_' + tag + '_torso', 0.34, sh - hip, 0.20, 0, (hip + sh) / 2, 0, kit.top, g);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.105, 20, 14), kit.skin);
  head.name = 'lifter_' + tag + '_head'; head.position.set(0, sh + 0.13, 0); g.add(head);
  if (kit.hair) {
    const h = new THREE.Mesh(new THREE.SphereGeometry(0.112, 20, 14, 0, Math.PI * 2, 0, 1.5), M.hair);
    h.name = 'lifter_' + tag + '_hair'; h.position.set(0, sh + 0.135, 0); g.add(h);
    const fall = new THREE.Mesh(new THREE.SphereGeometry(0.10, 22, 18), M.hair);
    fall.name = 'lifter_' + tag + '_hair_fall';
    fall.position.set(0, sh - 0.02, 0.075);
    fall.scale.set(1.05, 1.9, 0.55);   /* long, down her back */
    g.add(fall);
  }
  /* arms reach forward and down to the box's rear edge; the whole arm group
     travels with the box as it is lifted and set down */
  const armsG = new THREE.Group(); armsG.name = 'lifter_' + tag + '_arms'; g.add(armsG);
  /* both arms reach out forward and down to the box, shoulder to grip */
  const reachY = sh - (GROUND + 0.78), reachZ = 0.34;
  const armL = Math.hypot(reachY, reachZ), armA = Math.atan2(reachZ, reachY);
  for (const [side, ax] of [['in', -0.18], ['out', 0.18]]) {
    const arm = new THREE.Group();
    arm.name = 'lifter_' + tag + '_arm_' + side;
    arm.position.set(ax, sh, -0.02);
    arm.rotation.x = armA;
    armsG.add(arm);
    box('lifter_' + tag + '_arm_' + side + '_limb', 0.095, armL, 0.10, 0, -armL / 2, 0, kit.top, arm);
    box('lifter_' + tag + '_hand_' + side, 0.105, 0.10, 0.10, 0, -armL - 0.04, 0, kit.skin, arm);
  }
  return { g, armsG };
}
const mikeL = lifter('mike', -1, { top: M.tee, legs: M.shorts, skin: M.skin });
const juliaR = lifter('julia', 1, { top: M.sweat, legs: M.jeans, skin: M.skin, hair: true });
const lifterL = mikeL.g, lifterR = juliaR.g;
S('bulkhead_panel', VW, VH, 0.03, 0, VH / 2, CAB + 0.015, M.trim);
S('rear_sill_step', 1.60, 0.05, 0.18, 0, -0.025, TAIL + 0.09, M.trim_dk);
/* the sill the tailgate shuts down onto — tall enough to close the gap under the door */
S('rear_sill_trim', 1.60, 0.04, 0.05, 0, 0.02, TAIL + 0.02, M.trim);
for (const sx of [-1, 1]) {
  S('d_pillar_' + (sx < 0 ? 'left' : 'right'), 0.10, VH, 0.06, sx * 0.77, VH / 2, TAIL + 0.03, M.trim);
}
S('header_rail', 1.47, 0.10, 0.06, 0, VH - 0.05, TAIL + 0.03, M.trim);

/* ---- tailgate, hinged at the roof ---- */
const tailgate = new THREE.Group(); tailgate.name = 'tailgate';
tailgate.position.set(0, VH, TAIL + 0.03); vanSolid.add(tailgate);
box('tailgate_skin', 1.45, VH - 0.04, 0.05, 0, -(VH - 0.04) / 2, 0, M.door, tailgate);
box('tailgate_glass', 1.27, 0.46, 0.018, 0, -0.30, 0.036, M.glass, tailgate);
box('tailgate_handle', 0.22, 0.05, 0.05, 0, -0.66, 0.045, M.door_dk, tailgate);
box('tailgate_trim', 1.45, 0.06, 0.06, 0, -(VH - 0.07), 0.01, M.door_dk, tailgate);

/* ---- sliding side doors, one each side ---- */
const DZ0 = -1.22, DZ1 = -2.30, DZC = (DZ0 + DZ1) / 2, DL = DZ0 - DZ1;
const doorGroups = [];
for (const [side, sx] of [['left', -1], ['right', 1]]) {
  const dx = sx * (VW / 2 + 0.012);
  const dg = new THREE.Group(); dg.name = 'slide_door_' + side; vanSolid.add(dg);
  doorGroups.push(dg);

  box('slide_door_skin_' + side, 0.024, 0.84, DL, dx, 0.44, DZC, M.door, dg);
  box('slide_door_glass_' + side, 0.016, VH - 0.96, DL - 0.10, dx, 0.94 + (VH - 0.96) / 2, DZC, M.glass, dg);
  box('slide_door_waist_' + side, 0.032, 0.06, DL, dx, 0.89, DZC, M.door_dk, dg);
  box('slide_door_handle_' + side, 0.026, 0.05, 0.20, sx * (VW / 2 + 0.030), 0.83, DZ1 + 0.22, M.door_dk, dg);

}

/* ---- removable pedestal table between the two left-hand seats ---- */
const TBLZ = -1.22, TBLX = -0.46, TBL_H = 0.62;
const TBL_W = 1.36, LEGDX = 0.34;   /* as wide as the three seats it faces, on two posts */
const tableUnit = new THREE.Group(); tableUnit.name = 'pedestal_table'; model.add(tableUnit);
const tableBoard = new THREE.Group(); tableBoard.name = 'table_floor_board'; tableUnit.add(tableBoard);
const baseBoard = roundPlate('table_base_board', TBL_W, 0.34, 0.018, 0.085, M.ply, tableBoard);
baseBoard.position.set(0, 0.015, TBLZ);
for (const dx of [-0.34, 0.34]) {
  box('velcro_strip_' + (dx < 0 ? 'left' : 'right'), 0.075, 0.006, 0.30, dx, 0.003, TBLZ, M.stove, tableBoard);
}
/* the halves and their posts lift off the board */
const tableParts = new THREE.Group(); tableParts.name = 'table_post_and_top';
tableParts.position.set(TBLX, 0, TBLZ); tableUnit.add(tableParts);
const TOPDX = 0.46;   /* the joint between the halves, on the van's centreline */
const HALF_W = TBL_W / 2, POST_LEN = TBL_H - 0.05;
const TBL_H_HI = 0.70;   /* the pedestal is adjustable — dining height with the bed folded */
const TBL_H_BED = H - 0.020;   /* top level with the overlay board's underside, so the panels rest on it */
let tblH = TBL_H_HI, tblHTarget = TBL_H_HI;
const FOLD_PROUD = 0.027;   /* folded leaves stand this far above the open table top */
const HALF_DX = TOPDX - HALF_W / 2;   /* centre of half A */

/* the top is a teardrop in plan: a 200 mm round nose at the outboard end, swelling
   to a 380 mm round tail, so the narrow end lets you swing past into the seats and
   there is no square corner anywhere on it. tdW(x) is the half-depth at distance x
   along the full 1360 mm top — two tangent arcs joined by a straight run. */
const TD_L = TBL_W, TD_R = 0.19, TD_NOSE = 0.10;
const TD_cx = TD_L - TD_R, TD_cn = TD_NOSE;
const TD_g = Math.asin((TD_R - TD_NOSE) / (TD_cx - TD_cn));
const TD_xn = TD_cn - TD_NOSE * Math.sin(TD_g), TD_wn = TD_NOSE * Math.cos(TD_g);
const TD_xf = TD_cx - TD_R * Math.sin(TD_g), TD_wf = TD_R * Math.cos(TD_g);
function tdW(x) {
  x = Math.min(Math.max(x, 0), TD_L);
  if (x <= TD_xn) return Math.sqrt(Math.max(0, TD_NOSE * TD_NOSE - (x - TD_cn) * (x - TD_cn)));
  if (x >= TD_xf) return Math.sqrt(Math.max(0, TD_R * TD_R - (x - TD_cx) * (x - TD_cx)));
  return TD_wn + (TD_wf - TD_wn) * (x - TD_xn) / (TD_xf - TD_xn);
}
/* the split is a curve too, not a straight cut: half A ends in a shallow convex
   tongue and half B in the matching concave socket, so neither half has a straight
   edge on its own and the two still close to the same teardrop */
const TD_W0 = tdW(TBL_W / 2), TD_BOW = 0.055;
const jointOff = (z) => TD_BOW * (1 - (z / TD_W0) * (z / TD_W0));
function roundPlate(name, w, d, thk, r, mat, parent) {
  const s = new THREE.Shape(), hw = w / 2 - r, hd = d / 2 - r;
  s.moveTo(-hw - r, -hd);
  s.lineTo(-hw - r, hd);
  s.absarc(-hw, hd, r, Math.PI, Math.PI / 2, true);
  s.lineTo(hw, hd + r);
  s.absarc(hw, hd, r, Math.PI / 2, 0, true);
  s.lineTo(hw + r, -hd);
  s.absarc(hw, -hd, r, 0, -Math.PI / 2, true);
  s.lineTo(-hw, -hd - r);
  s.absarc(-hw, -hd, r, -Math.PI / 2, -Math.PI, true);
  const geo = new THREE.ExtrudeGeometry(s, { depth: thk, bevelEnabled: false, curveSegments: 8 });
  geo.rotateX(-Math.PI / 2); geo.translate(0, -thk / 2, 0);
  const m = new THREE.Mesh(geo, mat); m.name = name;
  parent.add(m);
  return m;
}
function teardropTop(name, x0, x1, thk, mat, parent) {
  const N = 40, M = 20, up = [], dn = [], jt = [];
  const nose = x0 < 0.001;   /* half A carries the nose; half B the tail */
  const a = nose ? x0 : TBL_W / 2, b = nose ? TBL_W / 2 : x1;
  for (let i = 0; i <= N; i++) {
    const x = a + (b - a) * i / N, w = tdW(x);
    up.push(new THREE.Vector2(x - x0, w));
    if (w > 1e-4) dn.push(new THREE.Vector2(x - x0, -w));
  }
  for (let i = 1; i < M; i++) {
    const z = TD_W0 - 2 * TD_W0 * i / M;
    jt.push(new THREE.Vector2(TBL_W / 2 + jointOff(z) - x0, z));
  }
  const shape = new THREE.Shape(nose ? up.concat(jt, dn.reverse())
    : up.concat(dn.reverse(), jt.reverse()));
  const geo = new THREE.ExtrudeGeometry(shape, { depth: thk, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2); geo.translate(0, -thk / 2, 0);
  const m = new THREE.Mesh(geo, mat); m.name = name;
  parent.add(m);
  return m;
}

/* the top is two loose halves, not a hinged leaf: 8 mm dowels align them and
   two over-centre toggle latches under the joint pull them together, so the
   surface stays flat and half B lifts off to work alone as a bedside table */
function tableHalf(tag) {
  const g = new THREE.Group(); g.name = 'table_half_' + tag; tableParts.add(g);
  const x0 = tag === 'a' ? 0 : HALF_W;
  const top = teardropTop('table_top_' + tag, x0, x0 + HALF_W, 0.018, M.ply, g);
  const plate = box('table_top_plate_' + tag, 0.18, 0.012, 0.18, HALF_W / 2, -0.015, 0, M.steel, g);
  const hw = new THREE.Group(); hw.name = 'table_joint_' + tag; g.add(hw);
  for (const dz of [-0.10, 0.10]) {
    const s = dz < 0 ? 'front' : 'rear';
    if (tag === 'b') tube('table_joint_dowel_' + s, 0.004, 0.060, jointOff(dz), 0, dz, M.steel, hw, 'x');
  }
  for (const dz of [-0.055, 0.055]) {
    const s = dz < 0 ? 'front' : 'rear';
    if (tag === 'b') {
      box('table_toggle_latch_' + s, 0.052, 0.014, 0.026, jointOff(dz) + 0.034, -0.017, dz, M.latch, hw);
      box('table_toggle_lever_' + s, 0.032, 0.008, 0.010, jointOff(dz) + 0.074, -0.021, dz, M.latch, hw);
    } else {
      box('table_latch_keeper_' + s, 0.024, 0.012, 0.022, HALF_W + jointOff(dz) - 0.014, -0.016, dz, M.latch, hw);
    }
  }
  return { g, top, plate, hw };
}
const halfA = tableHalf('a'), halfB = tableHalf('b');

/* ---- alternate top: the fold-out leaf table. The centre panel is fixed to the
   two posts and a leaf each side folds up and over onto it, the pair meeting on
   the centreline when packed. Same footprint deployed as the tier-drop top. ---- */
const FL_D = 0.76, FL_T = 0.018, FL_S = FL_D / 2, FL_LS = FL_D / 4;   /* fixed centre, with a half-width leaf hinged along each long edge */
function slab(name, len, d, r0, r1, thk, mat, parent) {
  const hd = d / 2, sh = new THREE.Shape();
  sh.moveTo(r0, -hd);
  sh.lineTo(len - r1, -hd);
  sh.absarc(len - r1, -hd + r1, r1, -Math.PI / 2, 0, false);
  sh.lineTo(len, hd - r1);
  sh.absarc(len - r1, hd - r1, r1, 0, Math.PI / 2, false);
  sh.lineTo(r0, hd);
  sh.absarc(r0, hd - r0, r0, Math.PI / 2, Math.PI, false);
  sh.lineTo(0, -hd + r0);
  sh.absarc(r0, -hd + r0, r0, Math.PI, Math.PI * 1.5, false);
  const geo = new THREE.ExtrudeGeometry(sh, { depth: thk, bevelEnabled: false, curveSegments: 16 });
  geo.rotateX(-Math.PI / 2); geo.translate(0, -thk / 2, 0);
  const m = new THREE.Mesh(geo, mat); m.name = name;
  m.castShadow = m.receiveShadow = true;
  parent.add(m);
  return m;
}
const leafTop = new THREE.Group(); leafTop.name = 'leaf_table'; tableParts.add(leafTop);
/* it also splits across the width on the centreline: each half is a whole table
   in itself, its own post under it, so half can stand alone when the second row
   of seats is out. The folds run the length — a strip hinged along each long
   edge of the fixed centre, flipping up and over onto it. */
const FL_HALF = TBL_W / 2;
const leafHinges = [];
function leafHalf(tag, sx) {
  const g = new THREE.Group(); g.name = 'leaf_table_half_' + tag; leafTop.add(g);
  const x0 = sx < 0 ? -FL_HALF : 0;
  const rNose = sx < 0 ? 0.055 : 0.012, rTail = sx < 0 ? 0.012 : 0.03;
  const c = slab('leaf_table_centre_' + tag, FL_HALF, FL_S, rNose, rTail, FL_T, M.ply, g);
  c.position.x = x0;
  box('leaf_table_top_plate_' + tag, 0.18, 0.012, 0.11, sx * LEGDX, -0.015, 0, M.steel, g);
  for (const sz of [-1, 1]) {
    const nm = tag + '_' + (sz < 0 ? 'front' : 'rear');
    const h = new THREE.Group(); h.name = 'leaf_table_hinge_' + nm;
    h.position.set(0, FL_T / 2, sz * FL_S / 2);
    g.add(h);
    const arm = new THREE.Group(); arm.name = 'leaf_table_leaf_' + nm;
    arm.position.y = -FL_T / 2;
    h.add(arm);
    const bd = slab('leaf_table_leaf_board_' + nm, FL_HALF, FL_LS, rNose, rTail, FL_T, M.ply, arm);
    bd.position.set(x0, 0, sz * FL_LS / 2);
    for (const dx of [0.16, 0.52]) {
      tube('leaf_table_knuckle_' + nm + '_' + Math.round(dx * 100),
           0.008, 0.10, x0 + dx, 0.006, 0, M.steel, arm, 'x');
    }
    leafHinges.push({ h, sz });
  }
  return g;
}
const leafHalfA = leafHalf('a', -1), leafHalfB = leafHalf('b', 1);
/* the two halves pull together on a pair of over-centre toggle latches screwed
   to the underside of the fixed centres, clear of the leaves above */
const leafLatch = new THREE.Group(); leafLatch.name = 'leaf_table_latch';
leafTop.add(leafLatch);
for (const dz of [-0.09, 0.09]) {
  const sfx = dz < 0 ? 'front' : 'rear';
  box('leaf_table_latch_body_' + sfx, 0.060, 0.016, 0.030, -0.040, -FL_T / 2 - 0.008, dz, M.latch, leafLatch);
  box('leaf_table_latch_lever_' + sfx, 0.036, 0.009, 0.012, -0.086, -FL_T / 2 - 0.013, dz, M.latch, leafLatch);
  box('leaf_table_latch_keeper_' + sfx, 0.026, 0.014, 0.024, 0.018, -FL_T / 2 - 0.007, dz, M.latch, leafLatch);
  tube('leaf_table_latch_dowel_' + sfx, 0.004, 0.056, 0, -FL_T / 2 - 0.002, dz + 0.035, M.steel, leafLatch, 'x');
}
let leafMode = true, leafFolded = false, foldP = 0;
var foldBtn = null;
const tPost = tube('table_post', 0.030, POST_LEN, 0, 0, 0, M.steel, tableParts, 'y');
const tFoot = roundPlate('table_foot_plate', 0.16, 0.16, 0.012, 0.045, M.steel, tableParts);
const tPost2 = tube('table_post_2', 0.030, POST_LEN, 0, 0, 0, M.steel, tableParts, 'y');
const tFoot2 = roundPlate('table_foot_plate_2', 0.16, 0.16, 0.012, 0.045, M.steel, tableParts);
/* the posts lift out; the plates they socket into stay screwed to the floor board */

/* poses: set up on its board, stowed behind the seats, or — for half B alone —
   up on the wheel-arch top as a bedside table when the lounger is out */
const STOW_Z = -2.26 - TBLZ, POST_X = -0.75 - TBLX, POST_Z = -2.14 - TBLZ;
const BEDSIDE_TOP_Y = 0.88;
const BS_X1 = SOCK_XL - TBLX, BS_X2 = SOCK_XR - TBLX, BS_Z = (POST_HOLE_Z + BOXZ) - TBLZ;   /* left and right sockets, cab end of the top deck */
const BS_BASE_Y = H - 0.012;   /* foot plate let in flush with the top deck — the bed panels still lie flat over it */
const BS_LEN = BEDSIDE_TOP_Y - 0.026 - BS_BASE_Y;
const lerp = (a, b, t) => a + (b - a) * t;

/* the bedside table is its own piece — a small top and a single post that stow
   flat against the aft face of the camping box until the lounger is set up */
const bsTable = new THREE.Group(); bsTable.name = 'bedside_table'; tableParts.add(bsTable);
roundPlate('bedside_top', 0.42, 0.34, 0.018, 0.06, M.ply, bsTable);
box('bedside_top_plate', 0.20, 0.008, 0.26, 0, -0.013, 0, M.stove, bsTable);   /* slide plate the arm clamps under */
/* swivel-arm leg: a square post that drops into a bracket on the cab-end rail of the
   hatch bay, with a horizontal arm that swings on the post head and carries the top */
const BSL_POST = 0.47, BSL_ARM = 0.30;
const BSL_PX = (W - 4 * T) / 6 - 0.06;   /* post centre, just inboard of the right-hand divider (bayW / 2 − 60 mm; bayW is declared later) */
const BSL_X = BSL_PX - TBLX, BSL_Z = (POST_HOLE_Z + BOXZ) - TBLZ, BSL_Y = BEDSIDE_TOP_Y - 0.067 - BSL_POST;
const bsLeg = new THREE.Group(); bsLeg.name = 'bedside_leg'; tableParts.add(bsLeg);
box('bedside_leg_post', 0.04, BSL_POST, 0.04, 0, BSL_POST / 2, 0, M.stove, bsLeg);
box('bedside_leg_post_cap', 0.044, 0.006, 0.044, 0, 0.003, 0, M.stove, bsLeg);
const bsArm = new THREE.Group(); bsArm.name = 'bedside_leg_swivel'; bsArm.position.y = BSL_POST; bsLeg.add(bsArm);
tube('bedside_leg_swivel_hub', 0.03, 0.05, 0, 0.025, 0, M.stove, bsArm, 'y');
tube('bedside_leg_swivel_knob', 0.014, 0.012, 0, 0.056, 0, M.steel, bsArm, 'y');
box('bedside_leg_arm', 0.04, 0.05, BSL_ARM + 0.06, 0, 0.025, BSL_ARM / 2, M.stove, bsArm);
box('bedside_leg_swivel_lever', 0.08, 0.02, 0.02, -0.06, 0.03, 0.012, M.stove, bsArm);
tube('bedside_leg_swivel_lever_grip', 0.013, 0.03, -0.105, 0.03, 0.012, M.stove, bsArm, 'x');
box('bedside_leg_slide_lever', 0.02, 0.02, 0.10, -0.032, 0.014, BSL_ARM * 0.6, M.stove, bsArm);
tube('bedside_leg_slide_lever_grip', 0.013, 0.026, -0.032, 0.014, BSL_ARM * 0.6 - 0.06, M.stove, bsArm, 'x');
/* stowed, the leg lies flat along the cab-end face: post across the middle bay,
   arm swung down beside the stowed top */
const BSL_STOW_X = 0.30 - TBLX, BSL_STOW_Y = 0.50;
/* stowed: clipped flat to the cab-end face of the box, on the drawer-bay side,
   portrait so it stays inside the bay width; the leg stands beside it, collapsed */
const FORE_FACE = BOXZ - D / 2;
const BSS_X = -0.410 - TBLX, BSS_Y = 0.290, BSS_Z = (FORE_FACE - 0.011) - TBLZ;
const BSL_STOW_Z = (FORE_FACE - 0.035) - TBLZ;

let tblStow = false, tblBedside = false, remP = 0, bsP = 0, bs2P = 0, stowP = 0;
var bsHideStowed = true;   /* the van starts empty, so the stowed bedside table is hidden */
var fitOffY = 0, fitOffZ = 0;   /* the box's own travel, so the stowed table rides with it */
function poseTable() {
  tableBoard.visible = true;
  poseLeafTop();
  tFoot.visible = tFoot2.visible = true;   /* screwed to the board */
  const away = stowP;   /* tweened, so it is seen coming apart and going away */
  /* it goes over the seat backs, not through them: it lifts clear first, carries
     across at height, and only then comes down into the space behind the cab */
  const carry = tblCarry, rise = tblRise;
  /* --- half A: stays on the board unless the whole table is put away --- */
  const a = away;
  halfA.g.rotation.x = -Math.PI / 2 * a;
  halfA.g.position.set(lerp(TOPDX - HALF_W, TOPDX - HALF_W + 0.02, a),
    lerp(tblH, 0.30, a) + rise(a), lerp(0, STOW_Z, carry(a)));
  halfA.plate.visible = a < 0.5;
  const pLen = tblH - 0.05, pScale = pLen / POST_LEN;
  tPost.scale.y = pScale;
  tPost.position.set(lerp(TOPDX - LEGDX, POST_X, a),
    lerp(0.036 + pLen / 2, 0.32, a) + rise(a) * 0.5, lerp(0, POST_Z, carry(a)));
  /* --- half B: fitted, or lifted out and stowed --- */
  const s = Math.max(away, remP);
  let bx, by, bz, brx, px, py, pz, psx, psy;
  {
    bx = lerp(TOPDX, TOPDX + 0.02, s);
    by = lerp(tblH, 0.30, s) + rise(s);
    bz = lerp(0, STOW_Z, carry(s)); brx = -Math.PI / 2 * s;
    px = lerp(TOPDX + LEGDX, POST_X + 0.09, s);
    py = lerp(0.036 + pLen / 2, 0.32, s) + rise(s) * 0.5;
    pz = lerp(0, POST_Z, carry(s));
    psx = 1; psy = pScale;
  }
  halfB.g.rotation.x = brx; halfB.g.position.set(bx, by, bz);
  halfB.plate.visible = brx > -0.1;
  tPost2.scale.set(psx, psy, psx); tPost2.position.set(px, py, pz);
  /* --- the bedside table: lifts off the cab-end face, rises over the bed, drops
     its post into the hatch-bay bracket, and swings on the arm --- */
  const b2 = bsP, ride = 1 - b2;
  const th = (bs2P - 0.5) * Math.PI;   /* swivel: 0 left · 0.5 aft · 1 right */
  bsArm.rotation.y = th;
  const r = tblSm(b2 / 0.35), m = tblSm((b2 - 0.25) / 0.5), d = tblSm((b2 - 0.75) / 0.25);
  const upY = BSL_Y + 0.62;   /* held clear above the bed until it is over the bracket */
  const legY = lerp(BSL_STOW_Y, upY, r) - (upY - BSL_Y) * d;
  bsLeg.rotation.z = Math.PI / 2 * (1 - m);
  bsLeg.position.set(lerp(BSL_STOW_X, BSL_X, m), legY + fitOffY * ride, lerp(BSL_STOW_Z, BSL_Z, m) + fitOffZ * ride);
  const tx = BSL_X + Math.sin(th) * BSL_ARM, tz = BSL_Z + Math.cos(th) * BSL_ARM, ty = legY + BSL_POST + 0.067;
  bsTable.rotation.x = -Math.PI / 2 * (1 - m);
  bsTable.rotation.y = lerp(-Math.PI / 2, th, m);
  bsTable.position.set(lerp(BSS_X, tx, m), lerp(lerp(BSS_Y, BSS_Y + 0.70, r), ty, m) + fitOffY * ride,
    lerp(BSS_Z, tz, m) + fitOffZ * ride);
  /* stowed on the box's cab-end face — not shown at all while the box is out of the van.
     Read from a hoisted flag, so poseTable never reaches forward to a later binding. */
  const hideBs = b2 < 0.02 && bsHideStowed;
  bsTable.visible = !hideBs;
  bsLeg.visible = !hideBs;
}
/* the leaf top lives in the same place as the tier-drop one and rides the same
   posts, so only one of the two is ever in the van */
function tblSm(v) { v = Math.min(1, Math.max(0, v)); return v * v * (3 - 2 * v); }
function tblCarry(p) { return tblSm((p - 0.40) / 0.48); }   /* the run forward, finished before it drops */
function tblRise(p) {
  /* up over the seat backs, held at full height for the whole run, down only
     once it is past them — the slab is ~380 mm tall on edge, so the lift has to
     keep its underside above the tallest back */
  const up = tblSm(Math.min(1, p / 0.34)), dn = tblSm(Math.max(0, (p - 0.92) / 0.08));
  return 1.12 * up * (1 - dn);
}
function poseLeafTop() {
  leafTop.visible = leafMode;
  halfA.g.visible = halfB.g.visible = !leafMode;
  if (!leafMode) return;
  const t = stowP;
  /* a trifold: the outboard leaf comes over onto the centre first, the inboard
     one folds on top of it */
  const cl = v => Math.min(1, Math.max(0, v)), sm = v => v * v * (3 - 2 * v);
  /* both leaves come over together and butt on the centreline */
  const f1 = sm(cl(foldP)), arc = Math.sin(Math.PI * f1);
  /* the knuckles ride up a little as the leaves swing over, then settle flat on
     the centre so the folded pack is two boards thick */
  for (const { h, sz } of leafHinges) {
    h.rotation.x = -sz * Math.PI * f1;
    h.position.y = FL_T / 2 + 0.012 * arc;
  }
  /* with the second row of seats out, only half the table stands, on one post */
  leafHalfB.visible = remP < 0.5;
  leafLatch.visible = leafHalfB.visible;   /* nothing to latch to with one half out */
  leafTop.rotation.x = -Math.PI / 2 * t;
  leafTop.position.set(lerp(TOPDX, TOPDX + 0.02, t),
    lerp(tblH, 0.30, t) + tblRise(t), lerp(0, STOW_Z, tblCarry(t)));
}
function setTableFold(p) { foldP = p; poseTable(); }
var tstowTrack = null;   /* wired up once the animation tracks exist */
function setTableStowed(stowed, bedside) {
  tblStow = stowed; tblBedside = bedside;
  if (tstowTrack) tstowTrack.target = stowed ? 1 : 0;
  else stowP = stowed ? 1 : 0;
  poseTable();
}
function setTableTravel(p) { stowP = p; poseTable(); }
function setHalfBOut(p) { remP = p; poseTable(); }        /* lifted off for the two-seat layout */
function setBedsideMove(p) { bsP = p; poseTable(); }      /* half B travelling to the bedside pose */
function setBedsidePos(p) { bs2P = p; poseTable(); }     /* arm swivel: 0 left · 0.5 aft · 1 right */
tFoot.position.set(TOPDX - LEGDX, 0.036, 0);
tFoot2.position.set(TOPDX + LEGDX, 0.036, 0);

setTableStowed(false);

/* ---- six fixed seats, two rows of three, facing the cab ---- */
const ROWS = [['row2', -0.79], ['row1', -1.65]];   /* moved back to meet the shallower box */
const seatPivots = [];
const seatGroups = {};
const SEATX = [-0.46, 0, 0.46];
/* the two left-hand seats, one in each row, are trimmed in red */
const M_SEAT_RED = new THREE.MeshStandardMaterial({ color: 0x8e2a2a, roughness: 0.92, metalness: 0.0 });

function seat(tag, x, z, reversed) {
  const n = 'seat_' + tag;
  const gs = new THREE.Group(); gs.name = n; gs.position.set(x, 0, z); vanSolid.add(gs);
  seatGroups[tag] = gs;
  if (reversed) gs.rotation.y = Math.PI;
  const sm = x < 0 ? M_SEAT_RED : M.seat;

  box(n + '_frame', 0.42, 0.40, 0.46, 0, 0.20, 0, M.trim_dk, gs);
  box(n + '_squab', 0.46, 0.10, 0.50, 0, 0.45, 0, sm, gs);
  const ps = new THREE.Group(); ps.name = n + '_back_pivot'; ps.position.set(0, 0.52, 0.24); gs.add(ps);   /* folded, the back tops out at 570 mm */
  box(n + '_back', 0.46, 0.50, 0.10, 0, 0.25, 0, sm, ps);   /* upright: 1040 mm overall */
  box(n + '_headrest', 0.24, 0.15, 0.10, 0, 0.45, -0.04, sm, ps);
  seatPivots.push(ps);
  box(n + '_belt_stalk', 0.05, 0.10, 0.05, 0.19, 0.50, 0.16, M.trim_dk, gs);

}
for (const [row, z] of ROWS) SEATX.forEach((x, i) => seat(row + '_' + (i + 1), x, z, row === 'row1'));

/* ---- two adult bikes, front wheels off, stood on their rear wheels leaning against the
       bulkhead in the space the front pair of seats leaves ---- */
const bikes = new THREE.Group(); bikes.name = 'bikes'; bikes.visible = false; vanSolid.add(bikes);
function strut(name, x1, y1, x2, y2, th, mat, parent) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
  const m = box(name, len, th, th, (x1 + x2) / 2, (y1 + y2) / 2, 0, mat, parent);
  m.rotation.z = Math.atan2(dy, dx);
  return m;
}
function bike(tag, z, frameMat) {
  const g = new THREE.Group(); g.name = 'bike_' + tag;
  g.position.set(-0.06, 0.574, z); g.rotation.z = -0.9599;   /* 55° lean, rear wheel on the floor */
  bikes.add(g);
  for (const [side, wx] of [['rear', 0.525]]) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(0.315, 0.022, 12, 40), M.trim_dk);
    t.name = 'bike_' + tag + '_tyre_' + side; t.position.set(wx, 0.337, 0); g.add(t);
    const r = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.009, 8, 36), M.steel);
    r.name = 'bike_' + tag + '_rim_' + side; r.position.set(wx, 0.337, 0); g.add(r);
    tube('bike_' + tag + '_hub_' + side, 0.016, 0.09, wx, 0.337, 0, M.steel, g, 'z');
  }
  const BB = [0.18, 0.27], SD = [0.34, 0.72], HD = [-0.30, 0.70];
  strut('bike_' + tag + '_seat_tube', BB[0], BB[1], SD[0], SD[1], 0.028, frameMat, g);
  strut('bike_' + tag + '_top_tube', SD[0], SD[1], HD[0], HD[1], 0.026, frameMat, g);
  strut('bike_' + tag + '_down_tube', BB[0], BB[1], HD[0] + 0.02, HD[1] - 0.10, 0.030, frameMat, g);
  strut('bike_' + tag + '_chain_stay', BB[0], BB[1], 0.525, 0.337, 0.020, frameMat, g);
  strut('bike_' + tag + '_seat_stay', SD[0], SD[1], 0.525, 0.337, 0.018, frameMat, g);
  strut('bike_' + tag + '_fork', HD[0], HD[1], -0.525, 0.337, 0.024, M.steel, g);
  box('bike_' + tag + '_saddle', 0.20, 0.035, 0.10, 0.37, 0.755, 0, M.seat, g);
  tube('bike_' + tag + '_bars', 0.016, 0.28, HD[0] - 0.03, HD[1] + 0.02, 0, M.steel, g, 'z');
  tube('bike_' + tag + '_crank', 0.015, 0.13, BB[0], BB[1], 0, M.steel, g, 'z');
  const cr = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.010, 8, 28), M.steel);
  cr.name = 'bike_' + tag + '_chainring'; cr.position.set(BB[0], BB[1], 0.07); g.add(cr);
  return g;
}
bike('one', -1.76, M.latch);
bike('two', -2.08, M.trim_dk);


const bayW = (W - 4 * T) / 3;   /* thirds: drawer · open space · drawer */
const divX = bayW / 2 + T / 2;

/* ---- carcass ---- */
const carcass = new THREE.Group(); carcass.name = 'carcass'; model.add(carcass);
box('carcass_floor', W, T, D, 0, T / 2, 0, M.ply, carcass);
/* hand-sized carry slots, two high two low at each end of both side panels */
const SLOT_L = 0.12, SLOT_H = 0.034, SLOT_INSET = 0.055;
/* cable exits for the fridge: round holes in the right-hand side at fridge-bay
   height, one fore and one aft, so the lead reaches whichever way the drawer runs */
const CABLE_R = 0.014;
const CABLE_HOLES = [-0.13, 0.13];
function sidePanel(name, sx, cableHoles) {
  const h = H - T, r = SLOT_H / 2;
  const sh = new THREE.Shape();
  sh.moveTo(-D / 2, -h / 2); sh.lineTo(D / 2, -h / 2); sh.lineTo(D / 2, h / 2);
  sh.lineTo(-D / 2, h / 2); sh.closePath();
  for (const zc of [-(D / 2 - 0.26), D / 2 - 0.26]) {
    for (const yc of [h / 2 - SLOT_INSET, -h / 2 + SLOT_INSET]) {
      const a = SLOT_L / 2 - r, p = new THREE.Path();
      p.absarc(zc - a, yc, r, Math.PI / 2, Math.PI * 1.5, false);
      p.absarc(zc + a, yc, r, Math.PI * 1.5, Math.PI / 2, false);
      p.closePath();
      sh.holes.push(p);
    }
  }
  const cy = 0.205 - (T + h / 2);   /* fridge-bay height, in panel-local terms */
  for (const zc of (cableHoles || [])) {
    const p = new THREE.Path();
    p.absarc(zc, cy, CABLE_R, 0, Math.PI * 2, true);
    sh.holes.push(p);
  }
  const geo = new THREE.ExtrudeGeometry(sh, { depth: T, bevelEnabled: false });
  geo.rotateY(Math.PI / 2); geo.translate(-T / 2, 0, 0);
  const m = new THREE.Mesh(geo, M.ply); m.name = name; m.castShadow = m.receiveShadow = true;
  m.position.set(sx * (W / 2 - T / 2), T + (H - T) / 2, 0);
  carcass.add(m);
  /* rubber grommet in each cable hole, so the lead does not chafe on the ply */
  for (const zc of (cableHoles || [])) {
    const g = new THREE.Mesh(new THREE.CylinderGeometry(CABLE_R, CABLE_R, T + 0.006, 20, 1, true), M.stove);
    g.name = name + '_cable_grommet_' + (zc < 0 ? 'fore' : 'aft');
    g.rotation.z = Math.PI / 2;
    g.position.set(m.position.x, 0.205, zc);
    carcass.add(g);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(CABLE_R + 0.004, 0.004, 8, 22), M.stove);
    ring.name = name + '_cable_ring_' + (zc < 0 ? 'fore' : 'aft');
    ring.rotation.y = Math.PI / 2;
    ring.position.set(sx * (W / 2 + 0.001), 0.205, zc);
    carcass.add(ring);
  }
}
sidePanel('carcass_side_left', -1);
sidePanel('carcass_side_right', 1, CABLE_HOLES);
/* the two bay dividers are the internal sides of the hatch opening */
const WEB_SLOT_D = 0.045;            /* where the webbing crosses, in from the front edge */
const WEB_SLOT_R = 0.016;
function dividerPanel(name, sx) {
  const h = H - T;
  const sh = new THREE.Shape();
  sh.moveTo(-D / 2, -h / 2); sh.lineTo(D / 2, -h / 2); sh.lineTo(D / 2, h / 2);
  sh.lineTo(-D / 2, h / 2);
  sh.lineTo(-D / 2, -h / 2);
  sh.closePath();
  const geo = new THREE.ExtrudeGeometry(sh, { depth: T, bevelEnabled: false });
  geo.rotateY(Math.PI / 2); geo.translate(-T / 2, 0, 0);
  const m = new THREE.Mesh(geo, M.ply); m.name = name; m.castShadow = m.receiveShadow = true;
  m.position.set(sx * divX, T + (H - T) / 2, 0);
  carcass.add(m);
}
dividerPanel('carcass_divider_left', -1);
dividerPanel('carcass_divider_right', 1);
/* elastic webbing anchored to the divider faces, crossing over between them, so
   the load is held in at the cab end of the bay */
{
  const h = H - T, y0 = T + h / 2;
  const ys = [-h / 2 + 0.105, 0, h / 2 - 0.105].map(y => y0 + y);
  const zc = -D / 2 + WEB_SLOT_D - WEB_SLOT_R;
  const ax = bayW / 2 + 0.003;
  const cord = (name, a, b) => {
    const dir = new THREE.Vector3().subVectors(b, a);
    const m = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, dir.length(), 10), M.stove);
    m.name = name; m.castShadow = true;
    m.position.copy(a).addScaledVector(dir, 0.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    carcass.add(m);
  };
  const L = i => new THREE.Vector3(-ax, ys[i], zc), R = i => new THREE.Vector3(ax, ys[i], zc);
  /* a D-ring screwed to each divider face at every anchor point */
  for (const [i, y] of ys.entries()) {
    for (const [side, sx] of [['left', -1], ['right', 1]]) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.013, 0.0035, 8, 20), M.steel);
      ring.name = 'bay_web_ring_' + side + '_' + (i + 1);
      ring.rotation.y = Math.PI / 2;
      ring.position.set(sx * (bayW / 2 - 0.012), y, zc);
      carcass.add(ring);
      const plate = box('bay_web_ring_plate_' + side + '_' + (i + 1), 0.004, 0.030, 0.030,
                        sx * (bayW / 2 - 0.002), y, zc, M.steel, carcass);
      plate.castShadow = false;
    }
  }
  /* and a karabiner on each cord end, so the webbing unclips in one go */
  const karabiner = (name, at, dir) => {
    const k = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.0035, 8, 18, Math.PI * 1.75), M.latch);
    k.name = name; k.castShadow = true;
    k.position.copy(at).addScaledVector(dir, 0.016);
    k.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    carcass.add(k);
  };
  for (const [a, b] of [[0, 1], [1, 0], [1, 2], [2, 1]]) {
    const p = L(a), q = R(b);
    cord('bay_webbing_' + (a + 1) + '_' + (b + 1), p, q);
    const dir = new THREE.Vector3().subVectors(q, p).normalize();
    karabiner('bay_web_clip_l' + (a + 1) + '_r' + (b + 1) + '_a', p, dir);
    karabiner('bay_web_clip_l' + (a + 1) + '_r' + (b + 1) + '_b', q, dir.clone().negate());
  }
}
/* the van-side panel closes the left bay full height; the middle bay is open
   front and back so gear can pass through from the cab side. On the right it
   closes only above the fridge bay: the drawer runs out off the tailgate only,
   but its cab end is left open so the fridge can be lifted out from inside the van. */
box('carcass_front_panel_left', bayW, H - T, T, -(bayW + T), T + (H - T) / 2, -D / 2 + T / 2, M.ply_dark, carcass);
const FRIDGE_BAY_TOP = 0.416;   /* underside of the shelf over drawer 4 */
box('carcass_front_panel_right', bayW, H - FRIDGE_BAY_TOP, T, (bayW + T),
    FRIDGE_BAY_TOP + (H - FRIDGE_BAY_TOP) / 2, -D / 2 + T / 2, M.ply_dark, carcass);
/* the top deck is fixed over the two drawer bays; the strip over the middle bay
   is a lift-out panel, taken away in the lounger pose */
const DECK_W = (W - bayW) / 2;
for (const [side, sx] of [['left', -1], ['right', 1]]) {
  box('carcass_top_deck_' + side, DECK_W, T, D, sx * (W + bayW) / 4, H - T / 2, 0, M.ply, carcass);
}
const topPanel = new THREE.Group(); topPanel.name = 'carcass_top_panel_removable';
topPanel.position.set(0, H - T / 2, 0); carcass.add(topPanel);
/* the hatch carries a bored hole on the cushion joint so the bedside post can
   drop through it — the table fits with the panel still in place */
const POST_HOLE_R = 0.030;
{
  const w = bayW - 0.004, d = D - 0.004;
  const sh = new THREE.Shape();
  sh.moveTo(-w / 2, -d / 2); sh.lineTo(w / 2, -d / 2); sh.lineTo(w / 2, d / 2);
  sh.lineTo(-w / 2, d / 2); sh.closePath();
  /* bored over the bedside leg bracket, so the post drops through with the panel fitted */
  const hp = new THREE.Path(); hp.absarc(BSL_PX, -POST_HOLE_Z, POST_HOLE_R, 0, Math.PI * 2, true); sh.holes.push(hp);
  const geo = new THREE.ExtrudeGeometry(sh, { depth: T, bevelEnabled: false, curveSegments: 24 });
  geo.rotateX(-Math.PI / 2); geo.translate(0, -T / 2, 0);
  const p = new THREE.Mesh(geo, M.ply_dark); p.name = 'top_panel'; topPanel.add(p);
  const lin = new THREE.Mesh(new THREE.CylinderGeometry(POST_HOLE_R, POST_HOLE_R, T + 0.002, 28, 1, true), M.steel);
  lin.name = 'top_panel_post_liner'; lin.position.set(BSL_PX, 0, POST_HOLE_Z); topPanel.add(lin);
}
box('top_panel_finger_slot', 0.09, 0.008, 0.022, 0, T / 2 - 0.003, D / 2 - 0.07, M.stove, topPanel);
/* no rear rail over the drawer bays — the drawer fronts close the face there, and a
   rail in the same plane flickered through their tops. Over the middle bay the rail
   sits back behind the hatch door and its cleats so the two never share a face. */
const hatchRail = box('carcass_rear_rail_middle', bayW, 0.05, T, 0, H - T - 0.025, D / 2 - T - 0.024 - T / 2, M.ply_dark, carcass);
/* cross bar on the cab-end face, standing proud of the carcass — the unfolded
   bed panels land on it once they are run out over the drawers */
/* notched at the two leg positions so the folded legs can stand down through it */
{
  const bz = -D / 2 - 0.03 + T, bw = W - 0.02, lw = 0.28, legX = bw / 4, notch = lw / 2 + 0.01;   /* legs match the backrest props: 280 mm wide, centred at bedW/4 (BED_W is declared later) */
  const spans = [[-W / 2, -legX - notch], [-legX + notch, legX - notch], [legX + notch, W / 2]];
  for (let i = 0; i < spans.length; i++) {
    const [a, b2] = spans[i];
    box('carcass_bed_support_bar' + (i === 1 ? '' : '_' + (i === 0 ? 'left' : 'right')),
        b2 - a, 0.05, 0.06, (a + b2) / 2, H - 0.025, bz, M.ply, carcass);
  }
}
for (const sx of [-1, 1]) {
  box('bed_support_bracket_' + (sx < 0 ? 'left' : 'right'), 0.04, 0.10, 0.014,
      sx * (W / 2 - 0.05), H - 0.05, -D / 2 + T + 0.007, M.steel, carcass);
}
/* floor-mount cleats */
box('cleat_left',  0.05, 0.03, D - 0.10, -W / 2 + 0.06, 0.0155, 0, M.steel, carcass);
/* shelf between the stacked drawers in each side bay */
for (const [side, sx] of [['left', -1], ['right', 1]]) {
  box('carcass_shelf_' + side, bayW, T, D, sx * (bayW + T), side === 'left' ? 0.283 : 0.416, 0, M.ply, carcass);
}
box('cleat_right', 0.05, 0.03, D - 0.10,  W / 2 - 0.06, 0.0155, 0, M.steel, carcass);

/* ---- clips for the stowed lounger table, on the cab-end face ----
   the top hangs portrait over the left bay and the leg stands beside it,
   both kept clear of the open middle bay */
{
  const faceZ = -D / 2, panelOut = faceZ - 0.022;
  for (const [lvl, cy] of [['upper', 0.455], ['lower', 0.125]]) {
    for (const [edge, ex] of [['outer', -0.580], ['inner', -0.240]]) {
      box('table_stow_clip_' + lvl + '_' + edge, 0.026, 0.030, 0.022,
        ex, cy, faceZ - 0.011, M.steel, carcass);
      box('table_stow_catch_' + lvl + '_' + edge, 0.034, 0.018, 0.008,
        ex, cy, panelOut - 0.004, M.latch, carcass);
    }
  }
  /* cradle clips for the swivel leg lying across the face: one on the post over the right bay, one on the arm */
  for (const [tag, cx, cy] of [['post_right', 0.25, 0.50], ['arm', -0.198, 0.26]]) {
    box('table_stow_leg_clip_' + tag, 0.022, 0.024, 0.058, cx, cy, faceZ - 0.029, M.steel, carcass);
    box('table_stow_leg_catch_' + tag, 0.016, 0.060, 0.008, cx, cy, faceZ - 0.062, M.latch, carcass);
  }
}
/* ---- bedside leg bracket: bolted to the inner face of the right-hand divider at the
   cab end of the hatch bay, so the bay stays fully open front and back ---- */
{
  const wx = bayW / 2, px = BSL_PX;
  box('bedside_bracket_plate', 0.008, 0.20, 0.09, wx - 0.004, 0.46, POST_HOLE_Z, M.stove, carcass);
  const armW = (wx - 0.008) - (px + 0.028);
  for (const [tag, cy] of [['upper', 0.53], ['lower', 0.39]]) {
    box('bedside_bracket_arm_' + tag, armW, 0.035, 0.04, px + 0.028 + armW / 2, cy, POST_HOLE_Z, M.stove, carcass);
    box('bedside_bracket_collar_' + tag, 0.056, 0.035, 0.056, px, cy, POST_HOLE_Z, M.stove, carcass);
  }
  box('bedside_bracket_clamp_lever', 0.018, 0.075, 0.014, px - 0.012, 0.35, POST_HOLE_Z - 0.036, M.stove, carcass);
  box('bedside_bracket_clamp_bolt', 0.014, 0.014, 0.03, px - 0.012, 0.39, POST_HOLE_Z - 0.03, M.steel, carcass);
}

/* ---- drawers ---- */
const dW = bayW - 0.03, dD = D - 0.06;
/* [baseY, height] per drawer — the right-hand bottom drawer is a deep 380 mm box */
const BAYS = {
  drawer_left_upper:  [0.300, 0.240],
  drawer_left_lower:  [0.025, 0.240],
  drawer_right_upper: [0.427, 0.125],
  drawer_right_lower: [0.025, 0.380],
};

const logoTex = new THREE.TextureLoader().load('uploads/pasted-1788457834817-0.png');
logoTex.colorSpace = THREE.SRGBColorSpace;
const logoMat = new THREE.MeshBasicMaterial({ map: logoTex, transparent: true });
logoMat.name = 'campal_logo';

/* engraved badge on the fridge fronts: white line art on a black plaque, so it
   reads against the front whichever way the drawer is facing */
const engraveTex = new THREE.TextureLoader().load('assets/badge-inverted.png');
engraveTex.colorSpace = THREE.SRGBColorSpace;
engraveTex.anisotropy = 8;
/* lit the same way as the front it sits on, so the plaque ground disappears into it */
const engraveMat = new THREE.MeshStandardMaterial({
  map: engraveTex, roughness: 0.5, metalness: 0.06,
  polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2,
});
engraveMat.name = 'chasing_tides_engraving';
function engrave(name, size, parent, y, z) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), engraveMat);
  m.name = name; m.position.set(0, y, z + 0.002); m.renderOrder = 2;
  parent.add(m);
  return m;
}

function pillPlate(name, w, h, thick, holeW, holeH, hcx, hcy, mat, parent) {
  const shp = new THREE.Shape();
  shp.moveTo(-w / 2, 0); shp.lineTo(w / 2, 0); shp.lineTo(w / 2, h); shp.lineTo(-w / 2, h); shp.lineTo(-w / 2, 0);
  const r = holeH / 2, hp = new THREE.Path();
  hp.moveTo(hcx - holeW / 2 + r, hcy - r);
  hp.lineTo(hcx + holeW / 2 - r, hcy - r);
  hp.absarc(hcx + holeW / 2 - r, hcy, r, -Math.PI / 2, Math.PI / 2, false);
  hp.lineTo(hcx - holeW / 2 + r, hcy + r);
  hp.absarc(hcx - holeW / 2 + r, hcy, r, Math.PI / 2, Math.PI * 1.5, false);
  hp.closePath();
  shp.holes.push(hp);
  const mesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shp, { depth: thick, bevelEnabled: false }), mat);
  mesh.name = name;
  parent.add(mesh);
  return mesh;
}

/* drawer front with a hand-sized slot near the top edge, used as the pull */
const DS_W = 0.110, DS_H = 0.032, DS_TOP = 0.060;   /* slot size and its drop from the top edge — clear of the 50 mm carcass rail behind the top of each front */
function slottedFront(name, w, h, thk, mat, parent) {
  const sh = new THREE.Shape();
  sh.moveTo(-w / 2, -h); sh.lineTo(w / 2, -h); sh.lineTo(w / 2, 0); sh.lineTo(-w / 2, 0); sh.closePath();
  const r = DS_H / 2, hx = DS_W / 2 - r, cy = -DS_TOP - r;
  const hole = new THREE.Path();
  hole.moveTo(-hx, cy - r); hole.lineTo(hx, cy - r);
  hole.absarc(hx, cy, r, -Math.PI / 2, Math.PI / 2, false);
  hole.lineTo(-hx, cy + r);
  hole.absarc(-hx, cy, r, Math.PI / 2, Math.PI * 1.5, false);
  sh.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(sh, { depth: thk, bevelEnabled: false, curveSegments: 10 });
  geo.translate(0, 0, -thk / 2);
  /* the slot sits close to the top edge, so the cap triangulates into long slivers
     whose computed normals are noisy — that shows as flickering streaks. Snap every
     cap triangle's normals to straight out / straight in. */
  const pos = geo.attributes.position, nrm = geo.attributes.normal;
  for (let i = 0; i < pos.count; i += 3) {
    const z0 = pos.getZ(i);
    if (Math.abs(pos.getZ(i + 1) - z0) < 1e-6 && Math.abs(pos.getZ(i + 2) - z0) < 1e-6) {
      const nz = z0 > 0 ? 1 : -1;
      for (let k = 0; k < 3; k++) nrm.setXYZ(i + k, 0, 0, nz);
    }
  }
  nrm.needsUpdate = true;
  const m = new THREE.Mesh(geo, mat);
  /* the slot's long, thin cap triangles show shadow acne as hatched streaks along
     the top edge, so the fronts cast shadows but don't receive them */
  m.name = name; m.castShadow = true; m.receiveShadow = false; m.userData.noReceive = true;
  parent.add(m);
  return m;
}

function drawer(name, cx, out, kitchen) {
  const [baseY, dh] = BAYS[name];
  const g = new THREE.Group(); g.name = name;
  g.position.set(cx, baseY, out);
  const y = dh / 2;
  box(name + '_base', dW, T, dD, 0, T / 2, 0, M.ply, g);
  const crate = name === 'drawer_left_lower';
  if (crate) {
    /* the outboard side keeps its hand-hole; the inboard side is cut away so the
       crate can be reached from across the tailgate with the cooker drawer out
       above it, with elastic webbing across the opening to hold the load in */
    const CUT_W = 0.34, CUT_H = 0.15, CUT_Z = 0.02, CUT_Y = 0.112;
    for (const sx of [-1, 1]) {
      const side2 = sx < 0 ? 'left' : 'right';
      const big = sx > 0;
      const p = big
        ? pillPlate(name + '_side_' + side2, dD, dh, T, CUT_W, CUT_H, CUT_Z, CUT_Y, M.ply, g)
        : pillPlate(name + '_side_' + side2, dD, dh, T, 0.13, 0.05, -0.06, dh - 0.055, M.ply, g);
      p.rotation.y = Math.PI / 2;
      p.position.set(sx < 0 ? -dW / 2 : dW / 2 - T, 0, 0);
    }
    {
      const px = dW / 2 - T / 2;
      /* three shock cords, hooked to anchor tabs just past each end of the cutout */
      for (const [tag, dy] of [['upper', 0.048], ['middle', 0], ['lower', -0.048]]) {
        tube(name + '_webbing_' + tag, 0.006, CUT_W - 0.02, px, CUT_Y + dy, CUT_Z, M.stove, g, 'z');
      }
      for (const [tag, sz] of [['fore', -1], ['aft', 1]]) {
        box(name + '_webbing_anchor_' + tag, T, CUT_H + 0.03, 0.016,
            px, CUT_Y, CUT_Z + sz * (CUT_W / 2 - 0.004), M.steel, g);
      }
    }
    const bk = pillPlate(name + '_back', dW - 2 * T, dh, T, 0.16, 0.05, 0, dh - 0.055, M.ply, g);
    bk.position.set(0, 0, -dD / 2);
  } else {
    /* the fridge drawer's sides stand only 150 mm, so the fridge is easy to reach */
    const sh = name === 'drawer_right_lower' ? 0.15 : dh, sy = sh / 2;
    box(name + '_side_left',  T, sh, dD, -dW / 2 + T / 2, sy, 0, M.ply, g);
    box(name + '_side_right', T, sh, dD,  dW / 2 - T / 2, sy, 0, M.ply, g);
    if (name !== 'drawer_right_lower') box(name + '_back', dW - 2 * T, sh, T, 0, sy, -dD / 2 + T / 2, M.ply, g);
    else {
      /* the fridge drawer's back is loose: it drops into a pair of vertical channels,
         one on each side wall, so it lifts out to get the fridge out from the cab end */
      const bz = -dD / 2 + 0.008 + 0.004 + T / 2, cw = 0.008;
      for (const [side, sx] of [['left', -1], ['right', 1]])
        for (const [tag, dz] of [['outer', -1], ['inner', 1]])
          box(name + '_back_channel_' + side + '_' + tag, cw, sh, cw,
              sx * (dW / 2 - T - cw / 2), sy, bz + dz * (T / 2 + 0.001 + cw / 2), M.ply_dark, g);
      box(name + '_back', dW - 2 * T - 0.004, sh, T, 0, sy, bz, M.ply, g);
    }
  }
  /* each front sits inside its carcass opening with a 3 mm shadow gap all round —
     openings in carcass coords, [bottom, top], between floor / shelf / top deck */
  const OPENINGS = {
    drawer_left_lower:  [T, 0.274],
    drawer_left_upper:  [0.274 + T, H - T],
    drawer_right_lower: [T, 0.407],
    drawer_right_upper: [0.407 + T, H - T],
  };
  const FG = 0.003, [oLo, oHi] = OPENINGS[name];
  const fTop = oHi - FG - baseY, fh = (oHi - oLo) - 2 * FG, fW = bayW - 2 * FG;
  const frontPivot = new THREE.Group(); frontPivot.name = name + '_front_hinge';
  frontPivot.position.set(0, fTop, D / 2 - 0.011 + 0.002); g.add(frontPivot);   /* 2 mm proud so the face doesn't z-fight the carcass shelf edges it overlaps */   /* hinged along its top edge; shut, the face sits flush with the carcass edge */
  slottedFront(name + '_front', fW, fh, 0.022,
      name === 'drawer_right_lower' ? M.badge : M.accent, frontPivot);
  /* two small blue latches near the bottom edge, as in the reference photo */
  for (const sx of [-1, 1]) {
    const side2 = sx < 0 ? 'left' : 'right';
    box(name + '_latch_' + side2, 0.052, 0.036, 0.016, sx * (bayW / 2 - 0.03), -fh + 0.026, -0.019, M.latch, frontPivot);
    tube(name + '_latch_lever_' + side2, 0.009, 0.036, sx * (bayW / 2 - 0.03), -fh + 0.026, -0.030, M.latch, frontPivot);
  }
  /* folding stays, which drop under the panel once it is a table */
  const stays = name === 'drawer_left_upper';
  for (const sx of stays ? [-1, 1] : []) {
    const stay = box(name + '_table_stay_' + (sx < 0 ? 'left' : 'right'), 0.014, 0.20, 0.014,
      sx * (bayW / 2 - 0.05), -0.11, -0.055, M.steel, frontPivot);
    stay.rotation.x = 0.20;
  }
  if (name === 'drawer_left_lower') {
    const lw = Math.min(0.30, bayW - 0.10), lh = lw * 84 / 568;
    const logo = new THREE.Mesh(new THREE.PlaneGeometry(lw, lh), logoMat);
    logo.name = name + '_logo';
    logo.position.set(0, -(fh + DS_TOP + DS_H) / 2, 0.0125);
    frontPivot.add(logo);
  }
  /* --- drawer 4: slide-out compressor fridge with a top-opening lid --- */
  let fridgeLid = null;
  if (name === 'drawer_right_lower') {
    const WW = 0.02;   /* wheel width — the body is narrowed so the wheels fit beside it inside the drawer */
    const fw = dW - 2 * T - 0.006 - 2 * (WW + 0.002), fd = 0.48, fhh = 0.33;
    /* centred in the drawer: dual access, so it has to clear the carcass whichever way it runs out */
    const fz = 0;
    /* four black wheels on the long sides, two each side near the corners; the body rides just clear of the base */
    const WR = 0.035, WH = 0.008;
    box(name + '_fridge_body', fw, fhh - WH, fd, 0, T + WH + (fhh - WH) / 2, fz, M.trim, g);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.05 });
    for (const [tx, sx] of [['l', -1], ['r', 1]])
      for (const [tz, sz] of [['fore', -1], ['aft', 1]])
        tube(name + '_fridge_wheel_' + tx + '_' + tz, WR, WW, sx * (fw / 2 + 0.001 + WW / 2), T + WR, fz + sz * (fd / 2 - WR - 0.015), wheelMat, g, 'x');
    box(name + '_fridge_liner', fw - 0.06, fhh - 0.05, fd - 0.08, 0, T + fhh / 2 + 0.03, fz, M.cushion, g);
    box(name + '_fridge_panel', 0.16, 0.06, 0.014, -0.09, T + 0.24, fz + fd / 2 + 0.004, M.stove, g);
    for (const dx of [-0.03, 0.03]) {
      box(name + '_fridge_led_' + (dx < 0 ? 'a' : 'b'), 0.018, 0.014, 0.008, -0.09 + dx, T + 0.24, fz + fd / 2 + 0.012, M.latch, g);
    }
    /* wire basket in the near half */
    const bw = fw - 0.10, bd = 0.24, by = T + fhh - 0.11;
    for (const sx of [-1, 1]) box(name + '_basket_side_' + (sx < 0 ? 'l' : 'r'), 0.006, 0.10, bd, sx * bw / 2, by, fz + 0.14, M.steel, g);
    for (const sz of [-1, 1]) box(name + '_basket_end_' + (sz < 0 ? 'a' : 'b'), bw, 0.10, 0.006, 0, by, fz + 0.14 + sz * bd / 2, M.steel, g);
    box(name + '_basket_floor', bw, 0.006, bd, 0, by - 0.05, fz + 0.14, M.steel, g);
    /* lid, hinged along the van-side edge */
    fridgeLid = new THREE.Group(); fridgeLid.name = name + '_fridge_lid';
    fridgeLid.position.set(-fw / 2, T + fhh, fz); g.add(fridgeLid);   /* hinged lengthways, on the left edge */
    box(name + '_lid', fw, 0.026, fd, fw / 2, 0.013, 0, M.cushion, fridgeLid);
    box(name + '_lid_seal', fw - 0.03, 0.008, fd - 0.03, fw / 2, -0.004, 0, M.stove, fridgeLid);
    box(name + '_lid_catch', 0.03, 0.03, 0.10, fw - 0.02, 0.02, 0, M.steel, fridgeLid);
    engrave(name + '_engraving', Math.min(fh - 0.03 - (DS_TOP + DS_H + 0.01), 0.26), frontPivot, -(fh + DS_TOP + DS_H) / 2, 0.0125);
  }
  model.add(g);
  if (name === 'drawer_right_upper') {
    /* two lift-off ply lids close the drawer: plain ply one way up as a chopping
       board, steel bars on the reverse as a trivet for hot pans */
    const lw = dW - 2 * T - 0.006, ld = (dD - 2 * T - 0.018) / 2, lt = 0.014;
    const lidY = dh - lt / 2;
    const lids = [];
    for (const [tag, sz] of [['aft', 1], ['fore', -1]]) {
      const pv = new THREE.Group(); pv.name = name + '_lid_' + tag + '_pivot';
      pv.position.set(0, lidY, sz * (ld / 2 + 0.005)); g.add(pv);
      box(name + '_lid_' + tag, lw, lt, ld, 0, 0, 0, M.ply, pv);
      box(name + '_lid_' + tag + '_face', lw - 0.014, 0.003, ld - 0.014, 0, lt / 2 + 0.001, 0, M.stove, pv);
      /* finger slot at the outer edge */
      box(name + '_lid_' + tag + '_slot', 0.07, 0.004, 0.012, 0, lt / 2 + 0.002, sz * (ld / 2 - 0.022), M.trim_dk, pv);
      /* trivet bars, on the underside */
      for (const bx of [-1, 1]) {
        tube(name + '_lid_' + tag + '_trivet_' + (bx < 0 ? 'a' : 'b'), 0.007, ld - 0.05,
             bx * lw * 0.22, -lt / 2 - 0.007, 0, M.steel, pv, 'z');
      }
      lids.push(pv);
    }
    box(name + '_lid_ledge_left',  0.012, 0.010, dD - 2 * T, -dW / 2 + T + 0.006, lidY - lt / 2 - 0.005, 0, M.ply_dark, g);
    box(name + '_lid_ledge_right', 0.012, 0.010, dD - 2 * T,  dW / 2 - T - 0.006, lidY - lt / 2 - 0.005, 0, M.ply_dark, g);
    /* under the lids: two loose cross dividers, each dropped between a pair of
       cleats on the side walls, and three mugs stood in the middle compartment */
    const iW3 = dW - 2 * T, dvH = 0.07, dvT = T * 0.7;
    for (const [tag, dz] of [['fore', -0.105], ['aft', 0.105]]) {
      box(name + '_divider_' + tag, iW3 - 0.004, dvH, dvT, 0, T + dvH / 2, dz, M.ply_dark, g);
      for (const sx of [-1, 1]) for (const sz of [-1, 1])
        box(name + '_divider_' + tag + '_cleat_' + (sx < 0 ? 'l' : 'r') + (sz < 0 ? 'a' : 'b'), 0.008, dvH, 0.008,
            sx * (iW3 / 2 - 0.004), T + dvH / 2, dz + sz * (dvT / 2 + 0.005), M.ply, g);
    }
    const MUG_R = 0.037, MUG_H = 0.085;
    for (const [i, mx, mat] of [[0, -0.105, M.latch], [1, -0.005, M.cushion], [2, 0.095, M.worktop]]) {
      tube(name + '_mug_' + (i + 1), MUG_R, MUG_H, mx - 0.01, T + MUG_H / 2, 0, mat, g, 'y');
      const hd = new THREE.Mesh(new THREE.TorusGeometry(0.014, 0.006, 8, 16, Math.PI), mat);
      hd.name = name + '_mug_' + (i + 1) + '_handle';
      hd.rotation.z = -Math.PI / 2;
      hd.position.set(mx - 0.01 + MUG_R, T + MUG_H / 2 + 0.005, 0);
      g.add(hd);
    }
    box(name + '_tray_stop', dW - 2 * T, 0.02, T, 0, dh - 0.01, -dD / 2 + T, M.ply_dark, g);
    return { g, frontPivot, fridgeLid, lids };
  }
  if (crate) {
    /* the crate takes a removable cross divider: it spans the drawer width and
       drops between cleats at any of three depths */
    const cdW = dW - 2 * T - 0.004, cdH = dh - 0.06, cdT = T * 0.7;
    const cdY = cdH / 2 + T;
    const slotZ = [dD / 4 - T / 2, 0, -(dD / 4 - T / 2)];   /* aft · middle · cab end */
    for (const [i, z] of slotZ.entries()) {
      for (const sx of [-1, 1]) {
        for (const sz of [-1, 1]) {
          box(name + '_divider_cleat_' + (i + 1) + (sx < 0 ? '_l' : '_r') + (sz < 0 ? 'a' : 'b'),
              0.010, cdH, 0.010, sx * (dW / 2 - T - 0.005), cdY, z + sz * (cdT / 2 + 0.005), M.ply_dark, g);
        }
      }
    }
    const mkDivider = (tag, z) => {
      const grp = new THREE.Group();
      grp.name = name + '_cross_divider' + tag;
      grp.position.set(0, cdY, z);
      g.add(grp);
      box(name + '_cross_divider' + tag + '_board', cdW, cdH, cdT, 0, 0, 0, M.ply_dark, grp);
      /* grip strip along the top edge, so it lifts straight out by hand */
      box(name + '_cross_divider' + tag + '_grip', 0.07, 0.010, cdT + 0.006, 0, cdH / 2 - 0.005, 0, M.latch, grp);
      return grp;
    };
    const crossDivider = mkDivider('', slotZ[0]);
    /* a second board of the same size, dropped into the middle cleat pair */
    const crossDivider2 = mkDivider('_2', slotZ[1]);
    return { g, frontPivot, fridgeLid, crossDivider, crossDivider2, cdSlots: slotZ, cdLift: cdH * 1.05 };
  }
  if (!kitchen) {
    if (name !== 'drawer_right_lower') box(name + '_tray_divider', T * 0.7, dh - 0.06, dD - 2 * T, -0.06, (dh - 0.06) / 2 + T, 0, M.ply_dark, g);
    return { g, frontPivot, fridgeLid };
  }

  /* --- stove plinth over a storage locker, van-end half of the drawer --- */
  const pz0 = -dD / 2 + T, pz1 = -0.02, pDepth = pz1 - pz0, pzC = (pz0 + pz1) / 2;
  const deckY = 0.088, iW = dW - 2 * T;   /* low plinth — the fit-out must clear the deck when shut */

  const shp = new THREE.Shape();
  shp.moveTo(-iW / 2, T); shp.lineTo(iW / 2, T); shp.lineTo(iW / 2, deckY); shp.lineTo(-iW / 2, deckY);
  const hole = new THREE.Path();
  hole.moveTo(-0.040, T); hole.lineTo(-0.040, 0.048);
  hole.absarc(0, 0.048, 0.040, Math.PI, 0, true);
  hole.lineTo(0.040, T); hole.closePath();
  shp.holes.push(hole);
  const archMesh = new THREE.Mesh(new THREE.ExtrudeGeometry(shp, { depth: 0.015, bevelEnabled: false }), M.ply);
  archMesh.name = name + '_locker_face';
  archMesh.position.set(0, 0, pz1 - 0.015);
  g.add(archMesh);

  box(name + '_stove_deck', iW, 0.015, pDepth, 0, deckY + 0.0075, pzC, M.ply, g);

  /* --- lower level: a tray that runs out sideways once the main drawer is fully
     extended and clear of the van --- */
  const sideTray = new THREE.Group(); sideTray.name = name + '_side_tray'; g.add(sideTray);
  const stz0 = 0.02, stz1 = dD / 2 - T - 0.012, stD = stz1 - stz0, stzC = (stz0 + stz1) / 2;
  const stH = deckY - T - 0.006, stY = T + stH / 2 + 0.002;
  box(name + '_side_tray_floor', iW - 0.014, 0.010, stD, 0, stY - stH / 2, stzC, M.ply, sideTray);
  box(name + '_side_tray_back', iW - 0.014, stH, 0.010, 0, stY, stzC - stD / 2, M.ply_dark, sideTray);
  box(name + '_side_tray_fore', iW - 0.014, stH, 0.010, 0, stY, stzC + stD / 2, M.ply_dark, sideTray);
  box(name + '_side_tray_face', 0.014, stH + 0.010, stD, (iW - 0.014) / 2, stY, stzC, M.accent, sideTray);
  box(name + '_side_tray_end', 0.010, stH, stD, -(iW - 0.014) / 2, stY, stzC, M.ply, sideTray);
  box(name + '_side_tray_pull', 0.010, 0.022, 0.09, (iW - 0.014) / 2 + 0.010, stY, stzC, M.latch, sideTray);
  const sideTravel = iW - 0.06;
  /* two loose dividers running the length of the tray, splitting it into thirds.
     Each drops between short cleats on the end wall and the face; to lift one out
     its outer end tips up first, then it draws out along its own length */
  const SD_T = 0.010, SD_H = stH - 0.016;
  const sdX0 = -(iW - 0.014) / 2 + 0.005 + 0.0015, sdX1 = (iW - 0.014) / 2 - 0.007 - 0.0015, SD_L = sdX1 - sdX0;
  const sideDiv = [];
  for (const [tag, dz] of [['a', -stD / 6], ['b', stD / 6]]) {
    const zk = stzC + dz;
    for (const [wtag, cx] of [['end', sdX0 + 0.004], ['face', sdX1 - 0.004]])
      for (const sz of [-1, 1])
        box(name + '_side_tray_cleat_' + tag + '_' + wtag + (sz < 0 ? '_1' : '_2'), 0.008, 0.04, 0.008,
            cx, stY - stH / 2 + 0.005 + 0.02, zk + sz * (SD_T / 2 + 0.004), M.ply_dark, sideTray);
    const v = new THREE.Group(); v.name = name + '_side_tray_divider_' + tag;
    v.position.set(sdX0, stY - stH / 2 + 0.005, zk); sideTray.add(v);
    box(name + '_side_tray_divider_' + tag + '_board', SD_L, SD_H, SD_T, SD_L / 2, SD_H / 2, 0, M.ply, v);
    box(name + '_side_tray_divider_' + tag + '_grip', 0.07, 0.014, SD_T + 0.004, SD_L - 0.06, SD_H - 0.012, 0, M.latch, v);
    v.userData = { x0: v.position.x, y0: v.position.y, slide: SD_L * 0.85 + 0.05 };
    sideDiv.push(v);
  }

  /* --- twin-burner stove --- */
  const sY = deckY + 0.015;
  box(name + '_stove_body', 0.26, 0.055, 0.24, 0, sY + 0.0275, pzC + 0.01, M.stove, g);
  for (const sx of [-1, 1]) {
    tube(name + '_burner_' + (sx < 0 ? 'left' : 'right'), 0.042, 0.012, sx * 0.062, sY + 0.061, pzC + 0.01, M.steel, g, 'y');
    tube(name + '_burner_ring_' + (sx < 0 ? 'left' : 'right'), 0.026, 0.014, sx * 0.062, sY + 0.070, pzC + 0.01, M.stove, g, 'y');
    tube(name + '_knob_' + (sx < 0 ? 'left' : 'right'), 0.012, 0.022, sx * 0.062, sY + 0.028, pzC + 0.132, M.steel, g, 'z');
  }
  const shield = new THREE.Group(); shield.name = name + '_windshield';
  shield.position.set(0, sY, pzC - 0.125); g.add(shield);
  const back = box(name + '_shield_back', 0.26, 0.20, 0.010, 0, 0.10, 0, M.stove, shield);
  back.rotation.x = 0.10;
  for (const sx of [-1, 1]) {
    const wing = box(name + '_shield_wing_' + (sx < 0 ? 'left' : 'right'), 0.010, 0.20, 0.14, sx * 0.128, 0.10, 0.068, M.stove, shield);
    wing.rotation.y = sx * -0.30;
  }
  tube(name + '_pot', 0.055, 0.07, -0.062, sY + 0.095, pzC + 0.01, M.steel, g, 'y');
  tube(name + '_pot_rim', 0.059, 0.010, -0.062, sY + 0.130, pzC + 0.01, M.stove, g, 'y');

  /* --- open storage behind the drawer front, above the side tray --- */
  tube(name + '_rolled_mat', 0.040, 0.20, 0.05, 0.100, 0.24, M.stove, g);
  box(name + '_gas_canister', 0.080, 0.080, 0.080, -0.095, 0.100, 0.10, M.steel, g);
  return { g, frontPivot, shield, sideTray, sideTravel, sideDiv };
}
const left = drawer('drawer_left_upper', -(bayW + T), 0, true);
const leftDrawer = left.g, leftShield = left.shield;
const leftSideTray = left.sideTray, leftSideTravel = left.sideTravel, leftSideDiv = left.sideDiv || [];
const d2 = drawer('drawer_left_lower', -(bayW + T), 0);
const d2Div = d2.crossDivider, d2Div2 = d2.crossDivider2, d2Slots = d2.cdSlots || [], d2Lift = d2.cdLift || 0;
const d3 = drawer('drawer_right_upper', (bayW + T), 0);
const d3Lids = d3.lids || [];
const d3Divs = ['fore', 'aft'].map(t => d3.g.getObjectByName('drawer_right_upper_divider_' + t)).filter(Boolean);
for (const v of d3Divs) v.userData.y0 = v.position.y;
const d4 = drawer('drawer_right_lower', (bayW + T), 0);
/* the fridge and everything on it ride as one unit, so it can be rolled out of the
   drawer's cab end once the loose back has been lifted out of its channels */
const fridgeUnit = new THREE.Group(); fridgeUnit.name = 'drawer_right_lower_fridge_unit';
d4.g.add(fridgeUnit);
for (const o of [...d4.g.children]) {
  if (o !== fridgeUnit && /_(fridge|basket)_|_fridge_lid$/.test(o.name)) fridgeUnit.add(o);
}
const fridgeBack = d4.g.getObjectByName('drawer_right_lower_back');
const fridgeBackY0 = fridgeBack ? fridgeBack.position.y : 0, fridgeBackZ0 = fridgeBack ? fridgeBack.position.z : 0;
const FRIDGE_ROLL = D / 2 + 0.24 + 0.03;          /* until its far end is clear of the carcass face */
const FRIDGE_DROP = BAYS.drawer_right_lower[0] + T; /* down off the drawer base onto the van floor */
/* two cans stood in the cab-end half of the fridge, clear of the basket */
const CAN_R = 0.033, CAN_H = 0.115, CAN_Y0 = 0.075 + CAN_H / 2;
const fridgeCans = [[-0.06, M.latch], [0.06, M.steel]].map(([cx, mat], i) => {
  const c = tube('drawer_right_lower_fridge_can_' + (i ? 'b' : 'a'), CAN_R, CAN_H, cx, CAN_Y0, -0.12, mat, fridgeUnit, 'y');
  c.userData.x0 = cx; c.userData.xF = cx * 1.6;
  return c;
});
let fridgeLidP = 0;
/* where the cans are set down: on the table top if a table is up, else on the floor.
   Worked out in the fridge unit's own frame, so they land right wherever it is */
const _tb = new THREE.Box3(), _tv = new THREE.Vector3();
const shown = o => { for (; o; o = o.parent) if (!o.visible) return false; return true; };
function canTarget(i) {
  const tops = [];
  model.traverse(o => { if (o.isMesh && /^(table_top_[ab]|leaf_table_centre_\w+)$/.test(o.name) && shown(o)) tops.push(o); });
  if (!tops.length) return null;
  _tb.makeEmpty(); for (const o of tops) _tb.expandByObject(o);
  _tv.set((_tb.min.x + _tb.max.x) / 2 + (i ? 0.07 : -0.07), _tb.max.y, (_tb.min.z + _tb.max.z) / 2);
  const v = fridgeUnit.worldToLocal(_tv.clone());
  v.y += CAN_H / 2;
  return v;
}
const drawerRefs = [
  { n: 1, g: leftDrawer, key: 'drawer_left_upper', hinge: left.frontPivot, tabletop: true },
  { n: 2, g: d2.g, key: 'drawer_left_lower', hinge: d2.frontPivot },
  { n: 3, g: d3.g, key: 'drawer_right_upper', hinge: d3.frontPivot },
  { n: 4, g: d4.g, key: 'drawer_right_lower', hinge: d4.frontPivot, lid: d4.fridgeLid, dir: 1 },
];

/* ---- removable door across the middle bay: lifts out and goes back in as a shelf ---- */
const midDoor = new THREE.Group(); midDoor.name = 'mid_door'; model.add(midDoor);
const mdW = bayW - 0.012, mdH = H - T - 0.012;
const doorBoard = new THREE.Group(); doorBoard.name = 'mid_door_panel'; midDoor.add(doorBoard);
/* hand hole near the top edge, so the door can be lifted straight out */
const HH_W = 0.110, HH_H = 0.032, HH_TOP = 0.085;   /* slot size and its drop from the top edge — clear of the upper cleat */
const HH_Y = mdH / 2 - HH_TOP - HH_H / 2;
function handSlot(w, h, thk, name, z) {
  const sh = new THREE.Shape();
  sh.moveTo(-w / 2, -h / 2); sh.lineTo(w / 2, -h / 2); sh.lineTo(w / 2, h / 2); sh.lineTo(-w / 2, h / 2);
  sh.closePath();
  const r = HH_H / 2, hx = HH_W / 2 - r;
  const hole = new THREE.Path();
  hole.moveTo(-hx, HH_Y - r); hole.lineTo(hx, HH_Y - r);
  hole.absarc(hx, HH_Y, r, -Math.PI / 2, Math.PI / 2, false);
  hole.lineTo(-hx, HH_Y + r);
  hole.absarc(-hx, HH_Y, r, Math.PI / 2, Math.PI * 1.5, false);
  sh.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(sh, { depth: thk, bevelEnabled: false });
  geo.translate(0, 0, -thk / 2);
  const m = new THREE.Mesh(geo, M.accent);
  m.name = name; m.castShadow = m.receiveShadow = true; m.position.z = z;
  doorBoard.add(m);
  return m;
}
handSlot(mdW, mdH, T, 'mid_door_board', 0);
handSlot(mdW - 0.05, mdH - 0.05, 0.004, 'mid_door_face', T / 2 + 0.002);
for (const sy of [-1, 1]) {
  box('mid_door_cleat_' + (sy < 0 ? 'lower' : 'upper'), mdW - 0.06, 0.022, 0.020, 0, sy * (mdH / 2 - 0.05), -T / 2 - 0.010, M.trim_dk, doorBoard);
}
/* three steel strips across the face — stood as a shelf they carry a hot pan */
for (const [i, sy] of [-1, 0, 1].entries()) {
  box('mid_door_trivet_bar_' + (i + 1), mdW - 0.08, 0.022, 0.008,
      0, sy * 0.12, T / 2 + 0.008, M.steel, doorBoard);
}
/* the middle-bay door gets a pin too, in the same style, keyed to its own anim */
const doorPinRef = { n: 5, g: doorBoard, local: [0, 0, T / 2 + 0.02] };

const DOOR_Y = T + (H - T) / 2, DOOR_Z = D / 2 - T / 2;
/* horizontal, the board slides forward into shallow channels that run the depth of
   the bay, so it seats inside the box rather than standing proud of it */
const CH_Z0 = -D / 2 + 0.005, CH_Z1 = D / 2 - T - 0.002;
const DOOR_OUT = DOOR_Z + 0.42, SHELF_Z = CH_Z1;   /* half in the channels, half proud of the box */
const SHELF_Y_HI = H - 0.105;   /* the second set of shelf supports — high, but under the aft rail */
/* the channels themselves: a pair of shallow runners per height on each divider */
for (const [tag, sy] of [['low', DOOR_Y], ['high', SHELF_Y_HI]]) {
  for (const [side, sx] of [['left', -1], ['right', 1]]) {
    for (const [edge, dy] of [['lower', -1], ['upper', 1]]) {
      box('carcass_shelf_channel_' + tag + '_' + side + '_' + edge,
          0.012, 0.006, CH_Z1 - CH_Z0,
          sx * (bayW / 2 - 0.006), sy + dy * (T / 2 + 0.004), (CH_Z0 + CH_Z1) / 2,
          M.ply_dark, carcass);
    }
  }
}
let shelfHi = 0;
/* p = 0 shut across the gap · 1 back in as a shelf */
function setDoor(p) {
  doorP = p;
  const a = Math.min(1, Math.max(0, p / 0.4));
  const b = Math.min(1, Math.max(0, (p - 0.4) / 0.3));
  const c = Math.min(1, Math.max(0, (p - 0.7) / 0.3));
  const sm = t => t * t * (3 - 2 * t);
  doorBoard.rotation.x = -Math.PI / 2 * sm(b);
  const z = c > 0 ? DOOR_OUT + (SHELF_Z - DOOR_OUT) * sm(c) : DOOR_Z + (DOOR_OUT - DOOR_Z) * sm(a);
  doorBoard.position.set(0, DOOR_Y + (SHELF_Y_HI - DOOR_Y) * shelfHi, z);
}
/* q = 0 on the lower supports · 1 lifted to the upper pair */
function setShelfHigh(q) { shelfHi = q; setDoor(doorP); }
let doorP = 0;
setDoor(0);

/* runners, extended with the drawers. Held back 40 mm from the aft face so they
   stay hidden behind the flush drawer fronts. */
const RUN_L = D - 0.040, RUN_Z = -0.020;
const runnersByDrawer = {};
for (const [side, sx] of [['left', -1], ['right', 1]]) {
  const outer = sx * (W / 2 - T - 0.012);
  const inner = sx * (divX + T / 2 + 0.012);   /* inside its own bay, not in the pass-through */
  for (const lvl of ['lower', 'upper']) {
    const out = 0;
    const [baseY, dh] = BAYS['drawer_' + side + '_' + lvl];
    const y = baseY + dh * 0.45;
    const a = box('runner_' + side + '_' + lvl + '_outer', 0.024, 0.045, RUN_L + out, outer, y, RUN_Z + out / 2, M.steel);
    const b = box('runner_' + side + '_' + lvl + '_inner', 0.024, 0.045, RUN_L + out, inner, y, RUN_Z + out / 2, M.steel);
    runnersByDrawer['drawer_' + side + '_' + lvl] = [a, b];
  }
}

/* ---- fold-out bed: rear panel on the deck, two panels on hinges ---- */
const bed = new THREE.Group(); bed.name = 'bed'; model.add(bed);
const pT = 0.016, BED_W = W - 0.02, bedW = BED_W, pL = 0.66, bedY = H + pT / 2;   /* 660 + 680 + 660 = 2000 mm deployed */
const cT = 0.075, hingeA = D / 2 - 0.01 - pL;
const MID_L = 0.68;   /* slide-out panel, 680 mm — three panels give a 2000 mm bed */
const LIFT = pT + 0.005;   /* bare panels stack directly on each other */
const OVL = pT + 0.004;   /* the overlay board laid on the cab-end panel */

const flaps = [];
const wingStays = [];   /* sliding hooked arms under the fold-out wings */
const sideCushions = [];
const FLAP_W = (VW - 0.04 - W) / 2;   /* unfolded, the wings take the bed out to the full van width */
const SIDE_PAD_W = W / 2 + FLAP_W - BED_W / 2;   /* infill pads close right up to the mattress edge */
const WING_DZ = 0.02;   /* wing pads sit 20 mm aft of their panels so their cab edges line up with the middle / cab-end pads */

const hatchSlats = [];   /* the aft panel's centre slats lift out with the hatch */
const stackSlats = [];   /* the folded panels' centre slats — only in the way when stowed */
/* a panel with one soft corner: the outboard corner at the cab end, which is the
   one you climb past to get onto the bed. Every other corner stays square. */
function softPlate(name, w, d, thk, r, mat, parent) {
  const hw = w / 2, hd = d / 2;
  const s = new THREE.Shape();
  s.moveTo(-hw, -hd);
  s.lineTo(-hw, hd);
  s.lineTo(hw - r, hd);
  s.absarc(hw - r, hd - r, r, Math.PI / 2, 0, true);
  s.lineTo(hw, -hd);
  s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: thk, bevelEnabled: false, curveSegments: 8 });
  geo.rotateX(-Math.PI / 2); geo.translate(0, -thk / 2, 0);
  const m = new THREE.Mesh(geo, mat); m.name = name;
  parent.add(m);
  return m;
}
/* the two aft sections are built the other way round: cross rails at each end and
   slats running fore-and-aft, so the slide-out middle rides on its long edges */
const LENGTHWISE = ['bed_panel_rear', 'bed_panel_mid'];
/* the orange and green panels run the full width of the box, edges flush with its sides */
const REAR_OVERHANG = 0.010;   /* orange + green run to exactly W — outer edges flush with the box sides */
/* each panel gets its own colour so the separate parts read clearly when folded */
const PANEL_MATS = {
  bed_panel_rear:    [0xc99a5b, 0xb8853f],
  bed_panel_mid:     [0xc99a5b, 0xb8853f],
  bed_panel_front:   [0xc99a5b, 0xb8853f],
  bed_panel_overlay: [0xb0857f, 0x9a6c66],
};
for (const k in PANEL_MATS) {
  PANEL_MATS[k] = PANEL_MATS[k].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.82, metalness: 0.02 }));
}
const jointSlats = [];
const rearFingers = [], rearFill = [], rearFillBay = [];
const midFingers = [], midFill = [], midFillBay = [];   /* the green panel gets the same vented board in folding mode */
function panel(name, len, zCenter, y, parent, plain) {
  const g = new THREE.Group(); g.name = name;
  const pc = PANEL_MATS[name], pm = pc ? pc[0] : M.ply, pmd = pc ? pc[1] : M.ply_dark;
  /* the blue panel is 36 mm narrower so that, folded, its wings nest inside the
     green panel's wings instead of reading as one merged slab */
  const bedW = (name === 'bed_panel_rear' || name === 'bed_panel_mid' || name === 'bed_panel_front')
    ? BED_W + REAR_OVERHANG * 2 - (name === 'bed_panel_front' ? 0.036 : 0)
    : BED_W;
  if (LENGTHWISE.includes(name)) {
    /* only the outer rail on each panel — the facing edges interleave, so a rail
       there would foul the other panel's fingers */
    const isRear = name === 'bed_panel_rear', sz = isRear ? 1 : -1;
    /* on the middle panel the rail stops at the perimeter bar's inner face, so the two never share a face */
    const rInset = name === 'bed_panel_mid' ? 0.018 : 0, rD = 0.05 - rInset;
    const rz = zCenter + sz * (len / 2 - rInset - rD / 2), rn = name + '_rail_' + (isRear ? 'aft' : 'fore');
    /* cut at the middle bay so nothing crosses the hatch opening */
    const rW = (bedW - bayW) / 2;
    const rbi = name === 'bed_panel_mid' ? 0.018 : 0;   /* stop at the border bar's inner face */
    for (const rx of [-1, 1]) {
      box(rn + (rx < 0 ? '_left' : '_right'), rW - rbi, pT, rD, rx * (bayW + rW - rbi) / 2, y, rz, pm, g);
    }
    const rMid = box(rn + '_middle', bayW - 0.006, pT, rD, 0, y, rz, pm, g);
    (isRear ? hatchSlats : stackSlats).push(rMid);
    const sideW = (bedW - 0.02 - bayW) / 2;   /* kept for the rail cuts above */
    /* fingers reach past the panel's own edge so the two sets overlap when nested */
    const sd = len - 0.05 + 0.09, sz0 = zCenter - sz * 0.045;
    /* a true finger joint: the panel width is split into an odd number of equal fingers,
       so green takes 1,3,5… (a full slat flush at each outer edge) and orange takes 2,4,6…
       Every finger is the same width and the pitch is constant right across the panel. */
    const K = 19, fw = bedW / K, sw = fw - 0.008;
    for (let k = isRear ? 1 : 0; k < K; k += 2) {
      /* the green panel carries a frame rail down each long edge, so its two
         outermost fingers are the rails themselves */
      if (!isRear && (k === 0 || k === K - 1)) continue;
      const x = -bedW / 2 + fw * (k + 0.5);
      const inBay = Math.abs(x) - fw / 2 < bayW / 2;   /* any slat touching the bay travels with the hatch */
      const sfx = Math.abs(x) < 1e-6 ? 'c' : (x < 0 ? 'l' : 'r');
      /* the bedside post stands in a socket over each drawer bay, so the orange
         panel's finger over each socket is broken open there */
      const postGap = Math.abs(x - BSL_PX) < POST_HOLE_R + sw / 2;   /* the finger over the bedside post is broken open round it */
      if (isRear && postGap) {
        const clr = POST_HOLE_R + 0.006;
        const cuts = [POST_HOLE_Z - hingeA];
        let z0 = sz0 - sd / 2;
        const ends = [];
        for (const cz of cuts) { ends.push([z0, cz - clr]); z0 = cz + clr; }
        ends.push([z0, sz0 + sd / 2]);
        let si = 0;
        for (const [za, zb] of ends) {
          if (zb - za < 0.02) continue;
          si++;
          const seg = box(name + '_slat_' + (inBay ? 'bay_' : 'side_') + (k + 1) + '_' + sfx + '_seg' + si,
                          sw, pT, zb - za, x, y, (za + zb) / 2, pmd, g);
          if (inBay) hatchSlats.push(seg);
          rearFingers.push(seg);
        }
        continue;
      }
      const s = box(name + '_slat_' + (inBay ? 'bay_' : 'side_') + (k + 1) + '_' + sfx,
                    sw, pT, sd, x, y, sz0, pmd, g);
      /* folding mode butts the two panels edge to edge instead of interleaving,
         so each finger is pulled back inside its own panel */
      jointSlats.push({ m: s, sd, sz0, butt: sd - 0.09, buttZ: zCenter });
      if (inBay) (isRear ? hatchSlats : stackSlats).push(s);
      if (isRear) rearFingers.push(s); else midFingers.push(s);
    }
    /* folding mode overlaps the panels instead of interleaving them, so orange
       can be a solid board — open only where the hatch panel lifts out */
    if (isRear || name === 'bed_panel_mid') {
      /* orange: the infill stops 50 mm short of the hinge edge, where a fore rail closes the
         border between the two side frame rails. Green: it fills between its fore rail and
         the aft border bar, with the same slots as orange. */
      const FR = 0.05;
      const mzA = zCenter - len / 2 + 0.05, mzB = zCenter + len / 2 - 0.018;
      const fz = isRear ? zCenter - 0.025 + FR / 2 : (mzA + mzB) / 2;
      const fl = isRear ? len - 0.05 - FR : mzB - mzA;
      const fillL = isRear ? rearFill : midFill, fillBay = isRear ? rearFillBay : midFillBay;
      const sw2 = bedW / 2 - fw - bayW / 2;
      if (isRear) {
        const rz = zCenter - len / 2 + FR / 2;
        /* only with the solid board (folding mode) — sliding mode keeps the open finger joint */
        for (const rx of [-1, 1])
          rearFill.push(box(name + '_rail_fore_' + (rx < 0 ? 'left' : 'right'), sw2, pT, FR, rx * (bayW / 2 + sw2 / 2), y, rz, pm, g));
        /* over the hatch bay the fore rail and infill are one bored sheet (below), so the
           bedside post's bore sits wholly inside it */
      }
      /* the boards are ventilated on the green panel's own rhythm: one slot per
         finger pitch, running lengthwise like the slats either side of them */
      const vent = (nm, w, d, px, bores, fzOwn) => {
        const fz0 = fzOwn === undefined ? fz : fzOwn;
        const sh = new THREE.Shape();
        sh.moveTo(-w / 2, -d / 2); sh.lineTo(w / 2, -d / 2); sh.lineTo(w / 2, d / 2);
        sh.lineTo(-w / 2, d / 2); sh.closePath();
        const sl = Math.min(d - 0.10, 0.34), r = 0.007;   /* slot length and half-width */
        const n = Math.max(1, Math.round(w / fw));
        for (let i = 0; i < n; i++) {
          const cx = -w / 2 + w * (i + 0.5) / n;
          if (Math.abs(cx) + r > w / 2 - 0.018) continue;
          if ((bores || []).some(([bx]) => Math.abs(cx - bx) < r + POST_HOLE_R + 0.012)) continue;   /* keep slots clear of the post bore */
          const hp = new THREE.Path();
          hp.moveTo(cx - r, -sl / 2 + r);
          hp.absarc(cx, -sl / 2 + r, r, Math.PI, 0, true);
          hp.lineTo(cx + r, sl / 2 - r);
          hp.absarc(cx, sl / 2 - r, r, 0, Math.PI, true);
          hp.closePath();
          sh.holes.push(hp);
        }
        for (const [bx, bz] of (bores || [])) {   /* clearance for the bedside table post */
          const hp = new THREE.Path();
          hp.absarc(bx, -(bz - fz0), POST_HOLE_R, 0, Math.PI * 2, true);
          sh.holes.push(hp);
        }
        const geo = new THREE.ExtrudeGeometry(sh, { depth: pT, bevelEnabled: false });
        geo.rotateX(-Math.PI / 2); geo.translate(0, -pT / 2, 0);
        const m = new THREE.Mesh(geo, pmd);
        m.name = nm; m.castShadow = m.receiveShadow = true;
        m.position.set(px, y, fz0);
        g.add(m);
        return m;
      };
      for (const rx of [-1, 1]) {
        const px = rx * (bayW / 2 + sw2 / 2);
        fillL.push(vent(name + '_infill_' + (rx < 0 ? 'left' : 'right'), sw2, fl, px));
      }
      const bf = isRear
        ? vent(name + '_infill_bay', bayW - 0.006, fl + FR, 0, [[BSL_PX, POST_HOLE_Z - hingeA]], fz - FR / 2)
        : vent(name + '_infill_bay', bayW - 0.006, fl, 0);
      fillL.push(bf); fillBay.push(bf);
    }
    if (true) for (const rx of [-1, 1]) {   /* long-edge frame rails */
      /* on the middle panel the outer 18 mm of each rail is the border bar instead */
      const bi = name === 'bed_panel_mid' ? 0.018 : 0;
      /* on the green panel the rails run between the fore rail and the aft border bar, butting both */
      const fzA = bi ? zCenter - len / 2 + 0.05 : 0, fzB = bi ? zCenter + len / 2 - 0.018 : 0;
      box(name + '_frame_' + (rx < 0 ? 'left' : 'right'), fw - bi, pT, bi ? fzB - fzA : len - 0.05,
          rx * (bedW - fw - bi) / 2, y, bi ? (fzA + fzB) / 2 : zCenter + (isRear ? -0.025 : 0), pm, g);
    }
  } else if (name === 'bed_panel_overlay') {
    /* the pink board is a solid sheet */
    /* built in three parts split on the hatch lines. A notch the size of each middle-panel
       leg is cut in from the hinge edge, so a leg folded flat nests in the board, flush with
       it; the leg's own openings then act as the prop slots. The middle strip hides with the
       stack over the open hatch bay. */
    const z0 = zCenter - len / 2, z1 = zCenter + len / 2;
    const NCLR = 0.003, NW = 0.28 + 2 * NCLR;           /* leg width (BR_PROP_W) + clearance */
    const zn = 0.009 - 0.590 - 0.016;                    /* leg hinge − 590 mm leg − 12 mm rail shoe − clearance, in pivotB z */
    const notches = [-1, 1].map(sx => [sx * bedW / 4 - NW / 2, sx * bedW / 4 + NW / 2]);
    /* slots either side of each leg notch, in line with the leg's own openings (45 mm, at
       the four gap positions) so the gaps read straight across the board: a 25 mm web to
       the notch, a 50 mm margin to the outer edge, and one run across the middle */
    const WEB = 0.025, EDGE = 0.05, SLOT_D = 0.045;
    const inner = notches[1][0] - WEB, outerA = notches[1][1] + WEB, outerB = bedW / 2 - EDGE;
    const slotRuns = [[-inner, inner], [outerA, outerB], [-outerB, -outerA]];
    const slotZ = [1, 2, 3, 4].map(i => z0 + (len / 5) * i);
    const sheet = (tag, xa, xb) => {
      const sh = new THREE.Shape();
      const cuts = notches.map(([a, b]) => [Math.max(a, xa), Math.min(b, xb)]).filter(([a, b]) => b > a + 1e-6)
        .sort((p, q) => q[0] - p[0]);   /* walk the hinge edge from xb back to xa */
      sh.moveTo(xa, z0); sh.lineTo(xb, z0);
      let atEdge = true;
      if (cuts.length && Math.abs(cuts[0][1] - xb) < 1e-6) { sh.lineTo(xb, zn); atEdge = false; }
      else sh.lineTo(xb, z1);
      for (const [ca, cb] of cuts) {
        if (atEdge) { sh.lineTo(cb, z1); sh.lineTo(cb, zn); }
        sh.lineTo(ca, zn);
        if (Math.abs(ca - xa) < 1e-6) { atEdge = false; break; }
        sh.lineTo(ca, z1); atEdge = true;
      }
      if (atEdge) sh.lineTo(xa, z1);
      sh.closePath();
      for (const [a, b] of slotRuns) {
        if (a < xa + 0.005 || b > xb - 0.005) continue;   /* only runs wholly inside this piece */
        for (const cz of slotZ) {
          const hp = new THREE.Path();
          hp.moveTo(a, cz - SLOT_D / 2); hp.lineTo(a, cz + SLOT_D / 2); hp.lineTo(b, cz + SLOT_D / 2); hp.lineTo(b, cz - SLOT_D / 2); hp.closePath();
          sh.holes.push(hp);
        }
      }
      const geo = new THREE.ExtrudeGeometry(sh, { depth: pT, bevelEnabled: false });
      const pos = geo.attributes.position, nrm = geo.attributes.normal;
      for (let i = 0; i < pos.count; i += 3) {   /* flat, true normals on the faces */
        const zA = pos.getZ(i);
        if (Math.abs(pos.getZ(i + 1) - zA) < 1e-6 && Math.abs(pos.getZ(i + 2) - zA) < 1e-6)
          for (let k = 0; k < 3; k++) nrm.setXYZ(i + k, 0, 0, zA > 0 ? 1 : -1);
      }
      geo.rotateX(Math.PI / 2);   /* shape y → z, extrusion → down */
      geo.translate(0, y + pT / 2, 0);
      const m = new THREE.Mesh(geo, pm);
      m.name = name + '_sheet_' + tag; m.castShadow = true; m.receiveShadow = false; m.userData.noReceive = true;
      g.add(m);
      return m;
    };
    sheet('left', -bedW / 2, -bayW / 2);
    sheet('right', bayW / 2, bedW / 2);
    stackSlats.push(sheet('middle', -bayW / 2 + 0.003, bayW / 2 - 0.003));
  } else {
  box(name + '_rail_left',  0.05, pT, len, -bedW / 2 + 0.025, y, zCenter, pm, g);
  box(name + '_rail_right', 0.05, pT, len,  bedW / 2 - 0.025, y, zCenter, pm, g);
  const slats = 5;
  for (let i = 0; i < slats; i++) {
    const z = zCenter - len / 2 + (len / slats) * (i + 0.5);
    const sd = len / slats - 0.045;
    if (name === 'bed_panel_rear' || name === 'bed_panel_mid' || name === 'bed_panel_front' || name === 'bed_panel_overlay') {
      /* cut on the hatch lines so the middle bay stays clear from above */
      const sw = (bedW - 0.12 - bayW) / 2;
      for (const sx of [-1, 1]) {
        box(name + '_slat_' + (i + 1) + (sx < 0 ? '_left' : '_right'), sw, pT, sd,
            sx * (bayW / 2 + sw / 2), y, z, pmd, g);
      }
      const mid = box(name + '_slat_' + (i + 1) + '_middle', bayW - 0.006, pT, sd, 0, y, z, pmd, g);
      (name === 'bed_panel_rear' ? hatchSlats : stackSlats).push(mid);
      continue;
    }
    box(name + '_slat_' + (i + 1), bedW - 0.12, pT, sd, 0, y, z, pmd, g);
  }
  /* cross rails at each end close the frame */
  /* the pink overlay board gets the same end rails, fitted inside its own length
     between the side rails, so its footprint doesn't change */
  if (name === 'bed_panel_front' || name === 'bed_panel_overlay') for (const ez of [-1, 1]) {
    box(name + '_frame_' + (ez < 0 ? 'fore' : 'aft'), bedW - 0.1, pT, 0.022,
        0, y, zCenter + ez * (len / 2 - 0.011), pm, g);
  }
  }
  /* the middle panel is edged with an 18 mm timber border bar, flush with its faces and
     let in all round inside its own footprint, so the panel is no bigger and the wing
     hinges stay on the panel edge */
  const PBAR = name === 'bed_panel_mid' ? 0.018 : 0;
  if (PBAR) {
    const pbm = new THREE.MeshStandardMaterial({ color: 0x9a6a3c, roughness: 0.7, metalness: 0.02 });
    for (const sx of [-1, 1])
      box(name + '_perimeter_bar_' + (sx < 0 ? 'left' : 'right'), PBAR, pT + 0.002, len - 2 * PBAR, sx * (bedW / 2 - PBAR / 2), y, zCenter, pbm, g);
    for (const [tag, ez] of [['fore', -1], ['aft', 1]])
      box(name + '_perimeter_bar_' + tag, bedW, pT + 0.002, PBAR, 0, y, zCenter + ez * (len / 2 - PBAR / 2), pbm, g);
  }
  /* fold-out wings on the green and blue panels, taking the bed out to the van walls */
  for (const sx of (name === 'bed_panel_mid' || name === 'bed_panel_front') ? [-1, 1] : []) {
    const side = sx < 0 ? 'left' : 'right';
    const pv = new THREE.Group(); pv.name = name + '_flap_hinge_' + side;
    pv.position.set(sx * (bedW / 2), y, zCenter); g.add(pv);
    const soft = name === 'bed_panel_front';   /* the pair nearest the cab */
    if (soft) {
      /* run out 15 mm further at the cab end so the wing's top edge is flush with the panel's */
      const fl = softPlate(name + '_flap_' + side, FLAP_W, len - 0.015, pT, 0.09, pm, pv);
      fl.position.set(sx * FLAP_W / 2, 0, -0.0075); fl.scale.x = sx;
    } else {
      box(name + '_flap_' + side, FLAP_W, pT, len - 0.03, sx * FLAP_W / 2, 0, 0, pm, pv);
    }
    /* infill cushion out to the van wall — posed from setFold so it never
       sweeps through the mattress when the flap folds up */
    let sc;
    if (soft) {
      sc = softPlate('tmp', SIDE_PAD_W - 0.002, len - 0.002, cT, 0.086,
        [M.cushion_face, M.cushion_edge], new THREE.Group());
      sc.scale.x = sx;
    } else {
      sc = new THREE.Mesh(
        new THREE.BoxGeometry(SIDE_PAD_W - 0.002, cT, len - 0.002),
        [M.cushion_edge, M.cushion_edge, M.cushion_face, M.cushion_face, M.cushion_edge, M.cushion_edge]);
    }
    sc.name = name.replace('bed_panel', 'side_cushion') + '_' + side;
    sc.position.set(sx * (BED_W / 2 + SIDE_PAD_W / 2), y + pT / 2 + cT / 2 + 0.002, zCenter + WING_DZ);
    g.add(sc);
    sideCushions.push({ m: sc, sx, y: y + pT / 2 + cT / 2 + 0.002, z: zCenter + WING_DZ, len: len - 0.002, dir: name === 'bed_panel_front' ? -1 : 1 });
    tube(name + '_flap_pin_' + side, 0.008, len - 0.06, 0, 0, 0, M.steel, pv, 'z');
    flaps.push({ pv, sx, dir: name === 'bed_panel_front' ? -1 : 1 });   /* blue is inverted when stowed, so its wings fold the other way */
    /* two leaf stays per wing: a channel rail screwed to the panel underside with
       a sliding arm that runs out and hooks under the wing once it is down */
    for (const [tag, zf] of [['a', -0.28], ['b', 0.28]]) {
      const bz = zCenter + zf * (len - 0.03), sy = y - pT / 2 - 0.010;
      box(name + '_wing_stay_rail_' + side + '_' + tag, 0.170, 0.018, 0.026,
        sx * (bedW / 2 - 0.095), sy, bz, M.steel, g);
      const slide = new THREE.Group(); slide.name = name + '_wing_stay_' + side + '_' + tag; g.add(slide);
      box(name + '_wing_stay_arm_' + side + '_' + tag, 0.150, 0.008, 0.016,
        sx * 0.075, 0, 0, M.steel, slide);
      box(name + '_wing_stay_hook_' + side + '_' + tag, 0.012, 0.026, 0.016,
        sx * 0.144, 0.009, 0, M.steel, slide);
      const inX = sx * (bedW / 2 - 0.160), outX = sx * (bedW / 2 - 0.030);
      slide.position.set(outX, sy, bz);
      wingStays.push({ slide, inX, outX });
    }
  }
  parent.add(g);
  return g;
}

const rearPivot = new THREE.Group(); rearPivot.name = 'bed_rear_recline';
rearPivot.position.set(0, bedY, hingeA); bed.add(rearPivot);
panel('bed_panel_rear', pL, pL / 2, 0, rearPivot);

const pivotA = new THREE.Group(); pivotA.name = 'bed_hinge_a';
pivotA.position.set(0, bedY, hingeA); bed.add(pivotA);
/* cut at the hatch lines, like the rear rail and the middle slats, so the
   bedside post can drop through the joint */
for (const [side, sx] of [['left', -1], ['right', 1]]) {
  const seg = (bedW - 0.06 - bayW) / 2;
  tube('hinge_rear_mid_' + side, 0.011, seg, sx * (bayW + seg) / 2, 0, 0, M.steel, pivotA);
}
panel('bed_panel_mid', MID_L, -MID_L / 2, 0, pivotA);

const pivotB = new THREE.Group(); pivotB.name = 'bed_hinge_b';
pivotB.position.set(0, 0, -MID_L); pivotA.add(pivotB);
/* the cab-end panel is split down the centreline: each half rides its own hinge
   and rises as its own backrest in the lounger */
for (const sx of [-1, 1]) {
  const hl = (bedW - 0.06) / 2 - 0.006;
  tube('hinge_mid_front_' + (sx < 0 ? 'left' : 'right'), 0.011, hl, sx * (hl / 2 + 0.006), 0, 0, M.steel, pivotB);
}
const frontPivot = new THREE.Group(); frontPivot.name = 'bed_front_recline_left';
frontPivot.position.set(0, 0, 0); pivotB.add(frontPivot);
const frontPivotR = new THREE.Group(); frontPivotR.name = 'bed_front_recline_right';
frontPivotR.position.set(0, 0, 0); pivotB.add(frontPivotR);
const frontPivots = { '-1': frontPivot, '1': frontPivotR };
{
  const gL = panel('bed_panel_front', pL, -pL / 2, 0, frontPivot);
  gL.name = 'bed_panel_front_left';
  const gR = new THREE.Group(); gR.name = 'bed_panel_front_right'; frontPivotR.add(gR);
  const SPLIT = 0.006;   /* saw kerf + running clearance between the two halves */
  const IN_RAIL = 0.05;   /* each half gets its own inner edge rail, so its frame is closed all round */
  for (const ch of [...gL.children]) {
    const x = ch.position.x;
    if (Math.abs(x) < 1e-4 && ch.isMesh && ch.geometry.parameters && ch.geometry.parameters.width) {
      /* centred parts (middle slats, end frame rails) are cut in two */
      const p = ch.geometry.parameters;
      /* slats stop short of the new inner edge rail; the end rails run in to meet it */
      const inset = /_slat_/.test(ch.name) ? IN_RAIL : 0;
      const hw = p.width / 2 - SPLIT / 2 - inset;
      const halves = [-1, 1].map(sx => {
        const m = new THREE.Mesh(new THREE.BoxGeometry(hw, p.height, p.depth), ch.material);
        m.name = ch.name + (sx < 0 ? '_left' : '_right');
        m.position.set(sx * (hw / 2 + SPLIT / 2 + inset), ch.position.y, ch.position.z);
        (sx < 0 ? gL : gR).add(m);
        return m;
      });
      gL.remove(ch);
      const i = stackSlats.indexOf(ch);
      if (i >= 0) stackSlats.splice(i, 1, ...halves);
      continue;
    }
    if (x > 0) gR.add(ch);   /* add() re-parents; both pivots share an origin */
  }
  /* inner long-edge rail on each half, fitted between the fore and aft end rails */
  const railMat = gL.getObjectByName('bed_panel_front_rail_left').material;
  for (const sx of [-1, 1]) {
    box('bed_panel_front_rail_inner_' + (sx < 0 ? 'left' : 'right'), IN_RAIL, pT, pL - 0.044,
        sx * (SPLIT / 2 + IN_RAIL / 2), 0, -pL / 2, railMat, sx < 0 ? gL : gR);
  }
}
/* second board laid on top, lapping the hinge line — it stays flat while the
   backrest panel underneath it rises into the lounger */
const OVL_Z = -pL / 2;   /* exactly over the panel that rises into the backrest */
const overlayPanel = panel('bed_panel_overlay', pL, OVL_Z, -OVL, pivotB, true);   /* sits under the blue panel, so blue always reads on top */
/* the extension board carries its own pair of legs down to the load floor */
const overlayLegs = new THREE.Group(); overlayLegs.name = 'overlay_legs'; overlayPanel.add(overlayLegs);
for (const sx of []) {   /* overlay legs removed for now */
  const side = sx < 0 ? 'left' : 'right';
  const oh = bedY + OVL - pT / 2;
  box('overlay_leg_' + side, 0.05, oh, 0.05, sx * (bedW / 2 - 0.06), OVL - pT / 2 - oh / 2, OVL_Z - pL / 2 + 0.08, M.ply_dark, overlayLegs);
}

/* prop under the backrest: a single ply panel hinged to the underside. Swung
   down it stands on the panel below; folded it lies flat under the backrest. */
const BR_LEG_Z = -0.34, BR_LEG_L = 0.44;
const BR_PROP_W = 0.51;   /* one 510 mm prop under each backrest half, spanning three rows of board slots */
const brLegs = [];
for (const sx of [-1, 1]) {
  const side = sx < 0 ? 'left' : 'right';
  const pv = new THREE.Group();
  pv.name = 'lounger_prop_hinge_' + side;
  pv.position.set(sx * bedW / 4, -pT / 2, BR_LEG_Z);
  pv.userData.sx = sx;
  frontPivots[sx].add(pv);
  /* stepped prop, from the user's sketch: a full-width body under the hinge, then a
     narrower centred tongue at the foot that drops into the slat gap. Proportions are
     of the 261 mm working length (body 196, tongue 65 × 165 wide); the group is scaled to PROP_L. */
  const bodyL = BR_LEG_L * (196 / 261), tongueL = BR_LEG_L - bodyL, TONGUE_W = 0.165;
  /* offsets are from the hinge at bedW/4, mirrored for the left half. The body runs
     from 20 mm off the centre split out to 530 mm; three fingers drop into the pink
     board's slots: the centre run (to x 117), the leg opening (165 wide, centred) and
     the outboard slot (x 470..530). */
  const span = (a, b) => [sx * ((a + b) / 2 - bedW / 4), b - a];
  const [bx, bw] = span(0.02, 0.53);
  box('lounger_prop_panel_' + side, bw, bodyL, 0.018, bx, -bodyL / 2, 0, M.ply_dark, pv);
  for (const [tag, a, b] of [['inner', 0.02, 0.117], ['tongue', bedW / 4 - TONGUE_W / 2, bedW / 4 + TONGUE_W / 2], ['outer', 0.47, 0.53]]) {
    const [fx, fw] = span(a, b);
    box('lounger_prop_' + (tag === 'tongue' ? 'tongue' : 'finger_' + tag) + '_' + side, fw, tongueL, 0.018, fx, -bodyL - tongueL / 2, 0, M.ply_dark, pv);
  }
  /* no bearer: the bare 18 mm edge drops into a 45 mm gap between the pink board's slats */
  brLegs.push(pv);
}

/* ---- the two of us, lying on the lounger: schematic figures, heads on the raised backrest.
       The upper body rides the reclining panel, the legs stay on the flat panels. ---- */
const MSURF = pT / 2 + cT + 0.012;
const occupants = [];
function person(tag, x, kit) {
  const up = new THREE.Group(); up.name = 'person_' + tag + '_upper'; frontPivots[x < 0 ? -1 : 1].add(up);
  box('person_' + tag + '_torso', 0.36, 0.17, 0.44, x, MSURF + 0.085, -0.27, kit.top, up);
  box('person_' + tag + '_neck', 0.10, 0.10, 0.06, x, MSURF + 0.085, -0.52, kit.skin, up);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.093, 20, 16), kit.skin);
  head.name = 'person_' + tag + '_head';
  head.position.set(x, MSURF + 0.095, -0.60); up.add(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.096, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), M.hair);
  hair.name = 'person_' + tag + '_hair';
  hair.position.set(x, MSURF + 0.095, -0.60);
  hair.rotation.x = Math.PI - 0.55;   /* cap on the back of the head, so the face looks up */
  hair.visible = !!kit.hair && !kit.longHair; up.add(hair);
  if (kit.longHair) {
    /* a full head of hair, front to back, open only where her face looks up */
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.103, 26, 20, 0, Math.PI * 2, 0.8, Math.PI - 0.8), M.hair);
    shell.name = 'person_' + tag + '_hair_shell';
    shell.position.set(x, MSURF + 0.093, -0.60);
    shell.scale.set(1, 1, 1.12); up.add(shell);
    const mane = new THREE.Mesh(new THREE.SphereGeometry(0.10, 20, 16), M.hair);
    mane.name = 'person_' + tag + '_hair_long';
    mane.position.set(x, MSURF + 0.042, -0.50);
    mane.scale.set(1.4, 0.40, 2.7);   /* long hair spread out on the cushion behind her head */
    up.add(mane);
    const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.075, 18, 14), M.hair);
    fringe.name = 'person_' + tag + '_fringe';
    fringe.position.set(x, MSURF + 0.150, -0.655);
    fringe.scale.set(1.15, 0.5, 0.85);   /* hair forward over the top of her face */
    up.add(fringe);
  }
  /* face, looking up */
  for (const sx of [-1, 1]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.013, 12, 10), M.eye);
    eye.name = 'person_' + tag + '_eye_' + (sx < 0 ? 'left' : 'right');
    eye.position.set(x + sx * 0.034, MSURF + 0.180, -0.618);
    eye.scale.set(1, 0.6, 1); up.add(eye);
  }
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.020, 14, 10), M.mouth);
  mouth.name = 'person_' + tag + '_mouth';
  mouth.position.set(x, MSURF + 0.176, -0.556);
  mouth.scale.set(1.5, 0.35, 0.7); up.add(mouth);
  for (const sx of [-1, 1]) {
    const s = sx < 0 ? 'left' : 'right';
    box('person_' + tag + '_arm_' + s, 0.085, 0.085, 0.42, x + sx * 0.225, MSURF + 0.045, -0.25, kit.top, up);
    box('person_' + tag + '_hand_' + s, 0.075, 0.055, 0.10, x + sx * 0.225, MSURF + 0.030, 0.00, kit.skin, up);
  }
  const lo = new THREE.Group(); lo.name = 'person_' + tag + '_lower'; pivotB.add(lo);
  box('person_' + tag + '_hips', 0.34, 0.15, 0.22, x, MSURF + 0.075, 0.10, kit.legs, lo);
  for (const sx of [-1, 1]) {
    const s = sx < 0 ? 'left' : 'right';
    box('person_' + tag + '_thigh_' + s, 0.135, 0.135, 0.38, x + sx * 0.085, MSURF + 0.068, 0.40, kit.legs, lo);
    box('person_' + tag + '_shin_' + s, 0.115, 0.115, 0.42, x + sx * 0.085, MSURF + 0.058, 0.80, kit.shin, lo);
    box('person_' + tag + '_foot_' + s, 0.115, 0.075, 0.11, x + sx * 0.085, MSURF + 0.038, 1.06, M.trim_dk, lo);
  }
  occupants.push(up, lo);
  if (kit.h) { up.scale.z = kit.h; lo.scale.z = kit.h; }
}
person('a', -0.34, { top: M.tee, legs: M.shorts, shin: M.skin, skin: M.skin, hair: true });
person('b', 0.34, { top: M.sweat, legs: M.jeans, shin: M.jeans, skin: M.skin, hair: true, longHair: true, h: 0.88 });
for (const g of occupants) g.visible = false;

/* ---- the same two, sat in the permanent left-hand seats when the bed is folded away ---- */
const seated = [];
function seatedPerson(tag, seatTag, kit) {
  const gs = seatGroups[seatTag];
  if (!gs) return;
  const g = new THREE.Group(); g.name = 'seated_' + tag; gs.add(g);
  box('seated_' + tag + '_hips', 0.34, 0.16, 0.28, 0, 0.55, 0.03, kit.legs, g);
  box('seated_' + tag + '_torso', 0.36, 0.46, 0.20, 0, 0.81, 0.10, kit.top, g);
  box('seated_' + tag + '_neck', 0.10, 0.06, 0.10, 0, 1.05, 0.07, kit.skin, g);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.093, 20, 16), kit.skin);
  head.name = 'seated_' + tag + '_head'; head.position.set(0, 1.14, 0.06); g.add(head);
  if (kit.longHair) {
    const shell = new THREE.Mesh(new THREE.SphereGeometry(0.103, 26, 20, 0, Math.PI * 2, 1.15, Math.PI - 1.15), M.hair);
    shell.name = 'seated_' + tag + '_hair_shell';
    shell.position.set(0, 1.14, 0.09); shell.rotation.x = Math.PI / 2; shell.scale.set(1, 1.12, 1); g.add(shell);
    const fall = new THREE.Mesh(new THREE.SphereGeometry(0.098, 22, 18), M.hair);
    fall.name = 'seated_' + tag + '_hair_fall';
    fall.position.set(0, 1.00, 0.125);
    fall.scale.set(1.05, 1.85, 0.55);   /* down her back, past the shoulders */
    g.add(fall);
  } else {
    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.096, 20, 16, 0, Math.PI * 2, 0, Math.PI * 0.55), M.hair);
    cap.name = 'seated_' + tag + '_hair'; cap.position.set(0, 1.14, 0.07); cap.rotation.x = 0.55; g.add(cap);
  }
  for (const sx of [-1, 1]) {
    const s = sx < 0 ? 'left' : 'right';
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.013, 12, 10), M.eye);
    eye.name = 'seated_' + tag + '_eye_' + s;
    eye.position.set(sx * 0.034, 1.155, -0.028); eye.scale.set(1, 1, 0.6); g.add(eye);
    box('seated_' + tag + '_arm_' + s, 0.085, 0.28, 0.085, sx * 0.225, 0.86, 0.06, kit.top, g);
    /* forearm bridging elbow to hand, aimed along its own axis so the joints meet */
    const elbow = new THREE.Vector3(sx * 0.225, 0.725, 0.06);
    const wrist = new THREE.Vector3(sx * 0.085, 0.885, -0.215);
    const d = wrist.clone().sub(elbow);
    const fa = box('seated_' + tag + '_forearm_' + s, 0.075, 0.075, d.length(), 0, 0, 0, kit.top, g);
    fa.position.copy(elbow).add(d.clone().multiplyScalar(0.5));
    fa.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), d.clone().normalize());
    box('seated_' + tag + '_hand_' + s, 0.070, 0.055, 0.095, sx * 0.085, 0.895, -0.245, kit.skin, g);
    const lx = kit.legDX || 0.085;
    box('seated_' + tag + '_thigh_' + s, 0.135, 0.135, 0.28, sx * lx, 0.555, -0.11, kit.legs, g);
    box('seated_' + tag + '_shin_' + s, 0.115, 0.40, 0.115, sx * lx, 0.30, -0.28, kit.shin, g);
    box('seated_' + tag + '_foot_' + s, 0.115, 0.07, 0.20, sx * lx, 0.075, -0.34, M.trim_dk, g);
  }
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.020, 14, 10), M.mouth);
  mouth.name = 'seated_' + tag + '_mouth';
  mouth.position.set(0, 1.095, -0.030); mouth.scale.set(1.5, 0.7, 0.35); g.add(mouth);
  if (kit.h) g.scale.set(1, kit.h, 1);
  /* a fan of cards held up in front of the chest */
  const fan = new THREE.Group(); fan.name = 'seated_' + tag + '_cards';
  fan.position.set(0, 0.925, -0.245); fan.rotation.x = -0.6; g.add(fan);
  for (let i = 0; i < 5; i++) {
    const c = box('seated_' + tag + '_card_' + (i + 1), 0.055, 0.002, 0.085, 0, i * 0.0025, 0, M.card, fan);
    c.rotation.y = (i - 2) * 0.16;
    c.position.x = (i - 2) * 0.022;
  }
  g.visible = false;
  seated.push(g);
}
seatedPerson('mike', 'row2_1', { top: M.tee, legs: M.shorts, shin: M.skin, skin: M.skin });
seatedPerson('julia', 'row1_1', { top: M.sweat, legs: M.jeans, shin: M.jeans, skin: M.skin, longHair: true, h: 0.93, legDX: 0.23 });

/* the game and the wine, on the table between the two seats */
const tableProps = new THREE.Group(); tableProps.name = 'cards_and_wine';
tableParts.add(tableProps);
const TT = TBL_H + 0.009;
for (const [tag, dx, dz] of [['mike', -0.11, 0.07], ['julia', 0.11, -0.07]]) {
  const gx = HALF_DX + dx, gz = dz;
  tube('wine_glass_' + tag + '_base', 0.030, 0.006, gx, TT + 0.003, gz, M.crystal, tableProps, 'y');
  tube('wine_glass_' + tag + '_stem', 0.005, 0.085, gx, TT + 0.048, gz, M.crystal, tableProps, 'y');
  tube('wine_glass_' + tag + '_bowl', 0.035, 0.080, gx, TT + 0.131, gz, M.crystal, tableProps, 'y');
  tube('wine_' + tag, 0.031, 0.038, gx, TT + 0.110, gz, M.wine, tableProps, 'y');
}
tube('wine_bottle_body', 0.038, 0.230, HALF_DX + 0.02, TT + 0.115, 0.00, M.wine, tableProps, 'y');
tube('wine_bottle_neck', 0.014, 0.090, HALF_DX + 0.02, TT + 0.272, 0.00, M.wine, tableProps, 'y');
for (let i = 0; i < 6; i++) {
  const c = box('table_card_' + (i + 1), 0.058, 0.002, 0.088, HALF_DX - 0.20, TT + 0.001 + i * 0.0022, -0.02, M.card, tableProps);
  c.rotation.y = (i - 3) * 0.09;
}
tableProps.visible = false;
seated.push(tableProps);

const legs = new THREE.Group(); legs.name = 'bed_legs';
legs.position.set(0, -pT / 2, -pL + 0.10); pivotB.add(legs);
for (const sx of []) {   /* legs removed for now */
  box('bed_leg_' + (sx < 0 ? 'left' : 'right'), 0.05, H - 0.02, 0.05, sx * (bedW / 2 - 0.06), -(H - 0.02) / 2, 0, M.ply_dark, legs);
}

/* the middle panel's own pair of ply legs, screwed to its underside on the cab-end
   edge, so they travel out with the panel. Each is separately hinged: it either
   stands on the van floor or folds flat over a seat that is still fitted. */
const MID_LEG_L = 0.590;   /* panel underside down to the load floor — no separate foot */
const STAY_A = 0.20, STAY_L = 0.28, STAY_DX = 0.10;   /* pin 200 mm down the leg, 280 mm stay, 100 mm either side of the leg centre */
const STAY_STAND_S = Math.sqrt(STAY_L * STAY_L - (STAY_A + 0.012 - 0.009) ** 2) - 0.012;   /* slider travel aft of the hinge, standing */
/* each leg sits under the backrest prop's middle finger, on the same centreline */
const MID_LEG_W = 0.28, MID_LEG_X = bedW / 4;
/* the legs are slatted frames: two stiles and cross slats that, with the leg folded
   flat under the panel, sit exactly under the pink overlay board's slats */
const LEG_STILE = 0.05, LEG_SLAT_D = pL / 5 - 0.045;
const LEG_SLAT_Y = [0, 1, 2, 3, 4].map(i => 0.009 + pL - (pL / 5) * (i + 0.5))
  .filter(d => d + LEG_SLAT_D / 2 < MID_LEG_L - 0.02);
const legs2 = new THREE.Group(); legs2.name = 'bed_legs_mid';
legs2.position.set(0, -pT / 2, -0.12); pivotB.add(legs2);   /* kept as the stow-time group */
const midLegs = [];
for (const sx of [-1, 1]) {
  const s = sx < 0 ? 'left' : 'right';
  const pv = new THREE.Group(); pv.name = 'bed_leg_mid_' + s + '_hinge';
  pv.position.set(sx * MID_LEG_X, -pT / 2, -MID_L + 0.009);   /* hard on the fore edge — folded, the blade passes fore of the bed support bar */
  pivotA.add(pv);
  for (const ex of [-1, 1]) {
    box('bed_leg_mid_' + s + '_stile_' + (ex < 0 ? 'left' : 'right'), LEG_STILE, MID_LEG_L, 0.018,
        ex * (MID_LEG_W / 2 - LEG_STILE / 2), -MID_LEG_L / 2, 0, M.ply_dark, pv);
  }
  LEG_SLAT_Y.forEach((d, i) => box('bed_leg_mid_' + s + '_slat_' + (i + 1), MID_LEG_W - 2 * LEG_STILE, LEG_SLAT_D, 0.018,
      0, -d, 0, M.ply_dark, pv));
  /* foot rail starts where the board's cab-end slot ends, so the leg's last opening is a
     full 45 mm and lines up with that slot (and the 23° prop tongue drops through it) */
  const FR_TOP = 0.009 + (pL / 5) * 4 + 0.0225, FR_H = MID_LEG_L - FR_TOP;
  box('bed_leg_mid_' + s + '_rail_foot', MID_LEG_W - 2 * LEG_STILE, FR_H, 0.018, 0, -FR_TOP - FR_H / 2, 0, M.ply_dark, pv);
  /* floor-rail shoe: an aluminium tongue under the foot that drops 12 mm into the van's
     seat rail, locked by a quarter-turn stud on the aft face */
  box('bed_leg_mid_' + s + '_rail_shoe', 0.018, 0.012, 0.014, 0, -MID_LEG_L - 0.006, 0, M.steel, pv);   /* 18 mm, drops between the rail's 22 mm lips */
  tube('bed_leg_mid_' + s + '_rail_stud', 0.008, 0.012, 0, -MID_LEG_L + 0.02, 0.015, M.steel, pv, 'z');
  box('bed_leg_mid_' + s + '_rail_stud_wing', 0.028, 0.006, 0.004, 0, -MID_LEG_L + 0.02, 0.022, M.stove, pv);
  /* folding lock stays: one inboard of each stile, pinned to the leg's aft face 200 mm
     down and sliding in a channel under the green panel. Standing, the slider clicks
     into a spring catch and the stay locks the leg into a triangle; a thumb trigger
     releases it to fold. */
  const stays = [];
  for (const ex of [-1, 1]) {
    const xs = sx * MID_LEG_X + ex * STAY_DX;
    const rod = box('bed_leg_mid_' + s + '_stay_' + (ex < 0 ? 'a' : 'b'), 0.020, 0.005, 1, 0, 0, 0, M.steel, pivotA);
    const slider = box('bed_leg_mid_' + s + '_stay_slider_' + (ex < 0 ? 'a' : 'b'), 0.026, 0.010, 0.030, 0, 0, 0, M.stove, pivotA);
    const hz = -MID_L + 0.009;
    const ch0 = hz + 0.05, ch1 = hz + 0.25;
    box('bed_leg_mid_' + s + '_stay_channel_' + (ex < 0 ? 'a' : 'b'), 0.030, 0.008, ch1 - ch0, xs, -pT / 2 - 0.004, (ch0 + ch1) / 2, M.steel, pivotA);
    /* spring catch just aft of where the slider lands with the leg standing, butting it */
    const standAy = -pT / 2 - STAY_A, standBz = hz + 0.012 + Math.sqrt(STAY_L * STAY_L - (-pT / 2 - 0.009 - standAy) ** 2);
    box('bed_leg_mid_' + s + '_stay_catch_' + (ex < 0 ? 'a' : 'b'), 0.034, 0.012, 0.012, xs, -pT / 2 - 0.0065, standBz + 0.015 + 0.006, M.latch, pivotA);
    stays.push({ rod, slider, xs, hz });
  }
  midLegs.push({ pv, s, seat: sx < 0 ? 'row2_1' : 'row2_3', stays });
}
/* pose each stay from the leg's current angle: the leg-end pin is fixed on the leg, and
   the panel end slides along its channel to wherever the stay's length puts it */
function poseLegStays(L) {
  const th = L.pv.rotation.x, c = Math.cos(th), sn = Math.sin(th);
  const ly = -STAY_A, lz = 0.009 + 0.003;
  const Ay = L.pv.position.y + ly * c - lz * sn, Az = L.pv.position.z + ly * sn + lz * c;
  const By = -pT / 2 - 0.009;
  for (const st of L.stays) {
    const dy = By - Ay, rem = STAY_L * STAY_L - dy * dy;
    let Bz = Az + Math.sqrt(Math.max(0, rem));
    Bz = Math.min(Math.max(Bz, st.hz + 0.05), st.hz + 0.25);
    const dz = Bz - Az, len = Math.hypot(dy, dz);
    st.rod.position.set(st.xs, (Ay + By) / 2, (Az + Bz) / 2);
    st.rod.rotation.x = Math.atan2(-dy, dz);
    st.rod.scale.z = len;
    st.slider.position.set(st.xs, By, Bz);
  }
}

/* seat rails in the load floor, one under each leg line, running the length of the seat bay */
const seatRails = new THREE.Group(); seatRails.name = 'van_seat_rails'; model.add(seatRails);
{
  const legZ = hingeA - MID_L + 0.009, z0 = legZ - 0.95, z1 = legZ + 0.55;
  for (const sx of [-1, 1]) {
    const side = sx < 0 ? 'left' : 'right', x = sx * MID_LEG_X;
    for (const lip of [-1, 1])
      box('van_seat_rail_' + side + '_lip_' + (lip < 0 ? 'a' : 'b'), 0.012, 0.004, z1 - z0, x + lip * 0.017, 0.002, (z0 + z1) / 2, M.steel, seatRails);
    box('van_seat_rail_' + side + '_channel', 0.022, 0.002, z1 - z0, x, -0.011, (z0 + z1) / 2, M.trim_dk, seatRails);
    for (let k = 0; k < 20; k++)   /* the rail's locking pockets, every 75 mm */
      box('van_seat_rail_' + side + '_pocket_' + k, 0.030, 0.001, 0.010, x, 0.0045, z0 + 0.04 + k * 0.075, M.trim_dk, seatRails);
  }
}

/* the cushions are loose: they lift off before the wood folds and go back on top after.
   The aft section is split into three short pads that stack side by side on the top layer. */
const CUSHION_Y = bedY + pT / 2 + cT / 2 + 0.002;
const STACK_BASE = bedY + LIFT * 2 + pT / 2 + 0.004;
const RAISE = 0.36;
const AIR_STEP = cT + 0.012;   /* vertical spacing between pads while they are carried */
/* the middle panel and its folded cab panel slide back in under the aft panel */
const STOW_DY = 0;   /* stowed, the panels mesh at deck level and sit on top of the box */
const FINGER_OVER = 0.065;   /* how far the interleaving fingers reach past their own panel edge */
const REAR_W = bedW / 3;
const PAD_GAP = 0.002;   /* unfolded, every pad butts its neighbours with a 1 mm allowance per face */
/* the pad joint sits on the table post, so it drops between the aft and middle pads */
const SPLIT_Z = POST_HOLE_Z, POST_GAP = 0.03;   /* with the geometry's own 30 mm inset this clears the 60 mm post */
const AFT_END = D / 2;   /* pads run right out to the box's aft face */
/* the middle pad runs aft past the bedside post to its tailgate-side face, where all three
   aft pads start. A small open notch in the middle pad's aft edge takes the post, so there
   is no gap and no enclosed hole */
const PAD_JOINT = SPLIT_Z + 0.025;
const POST_PAD_Z = PAD_JOINT;
const POST_NOTCH_W = 0.046, POST_NOTCH_D = 0.050;
const SIDE_LEN = AFT_END - PAD_JOINT;
const REAR_LEN = AFT_END - POST_PAD_Z;
const MID_LEN = PAD_JOINT - (hingeA - pL);
const SIDE_Z = AFT_END - SIDE_LEN / 2, REAR_Z = AFT_END - REAR_LEN / 2;
const MID_Z = PAD_JOINT - MID_LEN / 2;
/* stacked, the pads line up on their aft edges so nothing cantilevers past the drawer fronts */
const zs = len => hingeA + pL - len / 2;
const cushionSpec = [
  /* three equal aft pads. The post stands in the joint between the middle pad and the
     centre aft pad, which starts just behind it; the outer two run on to meet the middle pad */
  ...(() => {
    const b0 = -bedW / 2, b1 = -REAR_W / 2, b2 = REAR_W / 2, b3 = REAR_W / 2, b4 = bedW / 2;
    const pad = (tag, a, b, len, z) => ({ tag, layer: 0, w: b - a, x: (a + b) / 2, len, z, zStack: zs(len) });
    return [pad('rear_a', b0, b1, SIDE_LEN, SIDE_Z), pad('rear_b', b1, b2, REAR_LEN, REAR_Z), pad('rear_c', b3, b4, SIDE_LEN, SIDE_Z)];
  })(),
  { tag: 'mid',    layer: 1, w: bedW, x: 0, len: MID_LEN, z: MID_Z,     zStack: zs(MID_LEN) },
  { tag: 'front_left',  layer: 2, w: bedW / 2, x: -bedW / 4, len: pL, z: hingeA - pL * 1.5, zStack: zs(pL) },
  { tag: 'front_right', layer: 2, w: bedW / 2, x: bedW / 4,  len: pL, z: hingeA - pL * 1.5, zStack: zs(pL) },
];
/* the two outer aft pads are bored for the bedside post over each socket */
function boredPad(w, d, hx, hz) {
  const sh = new THREE.Shape();
  sh.moveTo(-w / 2, -d / 2); sh.lineTo(w / 2, -d / 2); sh.lineTo(w / 2, d / 2); sh.lineTo(-w / 2, d / 2); sh.closePath();
  const hp = new THREE.Path(); hp.absarc(hx, -hz, POST_HOLE_R + 0.004, 0, Math.PI * 2, true); sh.holes.push(hp);
  const geo = new THREE.ExtrudeGeometry(sh, { depth: cT, bevelEnabled: false, curveSegments: 20 });
  geo.rotateX(-Math.PI / 2); geo.translate(0, -cT / 2, 0);
  return geo;
}
/* pad with a rectangular open notch in its aft (tailgate-side) edge, centred at x nx */
function aftNotchPad(w, d, nx) {
  const sh = new THREE.Shape(), a = -d / 2, hw = POST_NOTCH_W / 2;
  sh.moveTo(-w / 2, a); sh.lineTo(nx - hw, a); sh.lineTo(nx - hw, a + POST_NOTCH_D); sh.lineTo(nx + hw, a + POST_NOTCH_D);
  sh.lineTo(nx + hw, a); sh.lineTo(w / 2, a); sh.lineTo(w / 2, d / 2); sh.lineTo(-w / 2, d / 2); sh.closePath();
  const geo = new THREE.ExtrudeGeometry(sh, { depth: cT, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2); geo.translate(0, -cT / 2, 0);
  return geo;
}
/* pad with a half-round notch in one long edge (side −1 left, +1 right) at z nz */
function notchedPad(w, d, side, nz, r) {
  const sh = new THREE.Shape(), y0 = -nz;
  sh.moveTo(-w / 2, -d / 2); sh.lineTo(w / 2, -d / 2);
  if (side > 0) { sh.lineTo(w / 2, y0 - r); sh.absarc(w / 2, y0, r, -Math.PI / 2, Math.PI / 2, true); }
  sh.lineTo(w / 2, d / 2); sh.lineTo(-w / 2, d / 2);
  if (side < 0) { sh.lineTo(-w / 2, y0 + r); sh.absarc(-w / 2, y0, r, Math.PI / 2, -Math.PI / 2, true); }
  sh.closePath();
  const geo = new THREE.ExtrudeGeometry(sh, { depth: cT, bevelEnabled: false, curveSegments: 20 });
  geo.rotateX(-Math.PI / 2); geo.translate(0, -cT / 2, 0);
  return geo;
}
const cushions = cushionSpec.map(s => {
  const notch = s.tag === 'mid';   /* open notch in its aft edge round the post */
  const c = new THREE.Mesh(
    notch ? aftNotchPad(s.w - PAD_GAP, s.len - PAD_GAP, BSL_PX - s.x)
         : new THREE.BoxGeometry(s.w - PAD_GAP, cT, s.len - PAD_GAP),
    notch ? [M.cushion_face, M.cushion_edge]
         : [M.cushion_edge, M.cushion_edge, M.cushion_face, M.cushion_face, M.cushion_edge, M.cushion_edge]);
  c.name = 'cushion_' + s.tag;
  c.position.set(s.x, CUSHION_Y + (s.dy || 0), s.z);
  bed.add(c);
  return { m: c, i: s.layer, z0: s.z, zStack: s.zStack, tag: s.tag, dy: s.dy || 0 };
});
/* travel strap: stowed, the three pads are a stack — one webbing strap loops
   across the width of them, over the top, down both sides and under the base */
let strapBuckle = null, strapBuckleY = 0, strapTopY = 0, strapP = 0;
let strapCoil = null, strapStow = { x: 0, y: 0, z: 0 };
const cushionStrap = new THREE.Group(); cushionStrap.name = 'cushion_travel_strap';
cushionStrap.visible = false; bed.add(cushionStrap);
{
  const maxLen = Math.max(...cushionSpec.map(c => c.len));
  const maxW = Math.max(...cushionSpec.map(c => c.w)) - 0.008;
  const zc = hingeA + pL - maxLen / 2;
  const yBot = STACK_BASE - 0.003, yTop = STACK_BASE + 4 * cT + 0.009 + 0.003;   /* four layers: wing pads on top */
  const sw = 0.055, st = 0.005, runW = maxW + 0.012;
  box('cushion_strap_top', runW, st, sw, 0, yTop, zc, M.trim_dk, cushionStrap);
  box('cushion_strap_bottom', runW, st, sw, 0, yBot, zc, M.trim_dk, cushionStrap);
  for (const [tag, sx] of [['left', -1], ['right', 1]]) {
    box('cushion_strap_side_' + tag, st, yTop - yBot, sw, sx * (maxW / 2 + 0.006), (yTop + yBot) / 2, zc, M.trim_dk, cushionStrap);
  }
  /* cam buckle out on the top run, and the embroidered badge face up beside it */
  strapBuckle = box('cushion_strap_buckle', 0.05, 0.014, sw + 0.014, maxW / 4, yTop + 0.006, zc, M.steel, cushionStrap);
  strapTopY = yTop;
  const badge = new THREE.Mesh(new THREE.PlaneGeometry(0.19, 0.040), logoMat);
  badge.name = 'cushion_strap_badge';
  badge.rotation.x = -Math.PI / 2;
  badge.position.set(-maxW / 6, yTop + st / 2 + 0.001, zc);
  badge.renderOrder = 2;
  cushionStrap.add(badge);
  /* everything hangs off a pivot at the middle of the loop, so it can be coiled
     down about its own centre rather than about the bed origin */
  strapCoil = new THREE.Group(); strapCoil.name = 'cushion_strap_coil';
  strapCoil.position.set(0, (yTop + yBot) / 2, zc);
  for (const c of cushionStrap.children.slice()) {
    c.position.sub(strapCoil.position);
    strapCoil.add(c);
  }
  cushionStrap.add(strapCoil);
  strapBuckleY = strapBuckle.position.y;
  /* stowed, the coil hangs on a peg on the left side of the box */
  strapStow = {
    x: (W / 2 + 0.045) - strapCoil.position.x,
    y: T + (H - T) * 0.62 - strapCoil.position.y,
    z: 0.06 - strapCoil.position.z,
  };
  tube('carcass_strap_peg_right', 0.008, 0.055, (W / 2 + 0.028), T + (H - T) * 0.62 + 0.035, 0.06, M.steel, carcass, 'x');
}
const frontCushions = cushions.filter(c => c.tag.startsWith('front_'));
for (const c of frontCushions) c.sx = c.tag === 'front_left' ? -1 : 1;
const midAftCushion = cushions.find(c => c.tag === 'rear_b');   /* lifted out in the lounger pose */

const clamp01 = v => Math.min(1, Math.max(0, v));
const smooth = t => t * t * (3 - 2 * t);

let midLegT = 0;
/* each mid-panel leg reads the seat below it: seat still fitted → hinge it flat so
   it lies over the squab; seat out → let it hang down and stand on the van floor */
function poseMidLegs(t) {
  if (t !== undefined) midLegT = t;
  /* the legs stand on the floor whatever the bed is doing — they simply travel
     fore and aft with the panel. The only thing that folds one up is a seat
     still fitted underneath it. */
  for (const L of midLegs) {
    const g = seatGroups[L.seat];
    const fitted = !!(g && g.visible) && vanSolid.visible;
    /* folded, the legs lie flat against the panel so the stack packs down.
       Folding mode inverts the green panel, so the blade has to swing the
       other way to land under the stack rather than past the tailgate. */
    const up = midLegT > 0.5 ? (bedMode === 'fold') : fitted;
    const flat = (midLegT > 0.5 && bedMode === 'fold') ? -Math.PI / 2 : Math.PI / 2;
    L.pv.rotation.x = up ? flat : 0;
    /* folded flat under the unfolded bed, the blade drops 11 mm into the pink board's
       notch so it lies flush with the board (18 mm blade in the 16 mm board, 2 mm below) */
    L.pv.position.y = -pT / 2 - (up && flat > 0 ? 0.011 : 0);
    L.pv.visible = true;
    poseLegStays(L);
  }
  /* the van's own seat rails, left clear once the seats are out; the leg shoes drop into them */
  if (typeof seatRails !== 'undefined') {
    seatRails.visible = vanSolid.visible;
  }
}

/* f = 0 unfolded over the seats, 1 folded flat on the deck.
   0–0.25 cushions lift off · 0.25–0.75 the wood folds · 0.75–1 cushions land on top */
let folded = 1;
let bedF = 1;   /* raw fold track, including the cushion lift / place phases */
let peopleShown = false;   /* hidden until the button asks for them */
let reclined = 0;
const recSide = { L: 1, R: 1 };   /* how far each backrest half is up, within the lounger */
var fitP = 1;   /* how far the box is fitted; set by setFit each frame */
let stackPlaced = false;   /* the pads are stacked and strapped for travel */
let hatchOut = false;   /* the middle-bay lid and the centre aft pad lift out together */
let cushionsOut = false;   /* every mattress pad taken out of the van */
let uiReady = false;
let reclinePrev = 0;
let hatchUi = null;
function applyHatch() {
  const out = hatchOut;
  topPanel.visible = !out;
  hatchRail.visible = !out;
  /* gone with the box — but only as the carry-out actually takes it away
     (var, so it reads safely on the first pass before setFit exists) */
  midDoor.visible = !out && fitP > 0.002;   /* the bay has to read as a clear opening */
  /* the solid orange infill only exists in folding mode; its fingers only in sliding */
  for (const s of rearFill) s.visible = bedMode === 'fold' && !(out && rearFillBay.includes(s));
  for (const s of rearFingers) s.visible = bedMode !== 'fold';
  for (const s of hatchSlats) s.visible = !out && !(bedMode === 'fold' && rearFingers.includes(s));
  for (const s of stackSlats) s.visible = !(out && folded > 0.5);   /* folded, these lie over the opening too */
  /* green, like orange, is a slotted board in folding mode and open fingers in sliding */
  for (const s of midFill) s.visible = bedMode === 'fold' && !(out && folded > 0.5 && midFillBay.includes(s));
  for (const s of midFingers) if (bedMode === 'fold') s.visible = false;
  const stowedOver = out && folded > 0.5;   /* the stow stack sits right on the opening */
  for (const c of cushions) c.m.visible = !cushionsOut && !stowedOver;
  for (const s of sideCushions) s.m.visible = !cushionsOut && (bedF > 0.001 ? !stowedOver : !(bedMode === 'fold' && flapFold > 0.5));
  midAftCushion.m.visible = !cushionsOut && !stowedOver && (folded > 0.001 || !out);
  cushionStrap.visible = !cushionsOut && (stackPlaced || strapP > 0.01);
  const key = hatchOut + '|' + cushionsOut + '|' + (folded > 0.5);
  if (uiReady && key !== hatchUi) { hatchUi = key; labels(); }
}
/* two bed mechanisms, switchable from the controls. 'slide': the green panel runs
   out of the carcass on drawer slides. 'fold': the green panel is hinged at the
   box's cab-end edge and swings over, overlapping the orange panel when folded.
   Both share the same deployed 2000 mm bed, so only the stowing motion differs. */
let bedMode = 'fold';
let pendingMode = null;
function applyBedTiming() { anim.bed.ms = bedMode === 'fold' ? 4000 : 3400; }
function requestBedMode(m) {
  if (m === (pendingMode || bedMode)) return;
  pendingMode = null;
  if (anim.bed.p > 0.001 && anim.seats.p === 1) {
    pendingMode = m;                 /* run the bed out, swap, then stow it the new way */
    anim.recline.target = 0;
    anim.bed.target = 0;
  } else {
    bedMode = m;
    applyBedTiming();
    setFold(anim.bed.p);
    setFlaps(anim.flaps.p);
  }
  labels();
}
/* folded, the four wing pads lie side by side as the top layer of the travel stack.
   They follow the mattress pads: lift clear, travel over, then drop onto the pile. */
const _wv = new THREE.Vector3(), _wq = new THREE.Quaternion(), _pq = new THREE.Quaternion(), _bq = new THREE.Quaternion(), _e = new THREE.Euler(), _qi = new THREE.Quaternion();
function poseWings() {
  const f = bedF;
  const lift = smooth(clamp01(f / 0.25)), move = smooth(clamp01((f - 0.25) / 0.5)), place = smooth(clamp01((f - 0.75) / 0.25));
  const order = [...sideCushions].sort((a, b) => a.sx - b.sx || a.sx * (a.dir - b.dir));
  const step = SIDE_PAD_W + 0.002;
  const yS = STACK_BASE + cT / 2 + 3 * (cT + 0.003);
  bed.updateMatrixWorld(true);
  bed.getWorldQuaternion(_bq);
  order.forEach((s, k) => {
    if (!s.fp) return;
    const par = s.m.parent;
    par.getWorldQuaternion(_pq);
    /* the wing pose lives in the folding panel's frame; blend in bed space so the
       folded hinges don't flip the stack target */
    if (f < 0.25 || !s.fpBed) {
      if (f < 0.25) {
        _wv.set(s.fp.x, s.fp.y, s.z); par.localToWorld(_wv); bed.worldToLocal(_wv);
        _wq.setFromEuler(_e.set(0, 0, s.fp.rz)).premultiply(_pq).premultiply(_bq.clone().invert());
        s.fpBed = { p: _wv.clone(), q: _wq.clone() };
      } else {
        s.fpBed = { p: new THREE.Vector3(s.sx * (BED_W / 2 + SIDE_PAD_W / 2), CUSHION_Y,
          (s.dir > 0 ? hingeA - MID_L / 2 : hingeA - MID_L - pL / 2) + WING_DZ), q: new THREE.Quaternion() };
      }
    }
    const p0 = s.fpBed.p;
    const xS = (k - 1.5) * step, zS = hingeA + pL - s.len / 2;
    /* each wing pad gets its own level above the mattress pads: pads on the same side
       converge on one another as they travel, so they must not share a height */
    const hi = CUSHION_Y + RAISE + (3 + k) * AIR_STEP;
    const yUp = p0.y + (hi - p0.y) * lift;
    _wv.set(p0.x + (xS - p0.x) * move, (1 - place) * yUp + place * yS, p0.z + (zS - p0.z) * move);
    bed.localToWorld(_wv); par.worldToLocal(_wv);
    s.m.position.copy(_wv);
    _wq.copy(s.fpBed.q).slerp(_qi, lift).premultiply(_bq).premultiply(_pq.clone().invert());
    s.m.quaternion.copy(_wq);
  });
}
function setFold(f) {
  bedF = f;
  const fp = clamp01((f - 0.25) / 0.5);
  folded = fp;
  if (fp > 0.5 && uiReady && anim.bed.target === 1) hatchOut = false;   /* stowing — the panel goes back in first */
  for (const g of seated) g.visible = peopleShown && f > 0.98;
  for (const g of occupants) g.visible = peopleShown && fp < 0.02;
  /* sliding: the green panel runs out of the carcass, then blue unfolds off it.
     folding: blue folds onto green first and the two clip together, then the pair
     swing over onto orange — with a pause between so the two moves read apart. */
  const foldMode = bedMode === 'fold';
  /* folding: orange and green butt on a hinged edge, so the interleaving
     fingers retract inside their own panels */
  for (const j of jointSlats) {    j.m.scale.z = foldMode ? j.butt / j.sd : 1;
    j.m.position.z = foldMode ? j.buttZ : j.sz0;
  }
  const s = foldMode ? smooth(clamp01((fp - 0.65) / 0.35)) : smooth(clamp01(fp / 0.5));
  const t = foldMode ? smooth(clamp01(fp / 0.35)) : smooth(clamp01((fp - 0.5) / 0.5));
  const th = Math.PI * t, k = (1 - Math.cos(th)) / 2;
  if (foldMode) {
    const ath = Math.PI * s;
    pivotA.rotation.x = ath;   /* swings up and over, landing on top of the orange panel */
    pivotA.position.z = hingeA;
    pivotA.position.y = bedY + (pT + 0.004) * (1 - Math.cos(ath)) / 2;
  } else {
    pivotA.rotation.x = 0;
    const STOW_FORE = 0.045;   /* extra fore travel, so the green panel's fingers stop short of the aft face */
    pivotA.position.z = hingeA + (MID_L - FINGER_OVER + 0.01 - STOW_FORE) * s;   /* stowed, the panel is fully retracted into the box */
    pivotA.position.y = bedY + STOW_DY * s;
  }
  /* folded, green is inverted, so blue's own offset has to go the other way to
     still land on top of it */
  pivotB.rotation.x = th;
  pivotB.position.y = (foldMode ? -(pT + 0.002) : (pT + 0.002)) * k;
  legs.rotation.x = -Math.PI / 2 * Math.min(1, t * 1.5);
  legs.visible = t < 0.8 && reclined < 0.5;
  poseMidLegs(t);
  for (const pv of brLegs) pv.visible = t < 0.5 && reclined > 0.001;
  overlayPanel.visible = foldMode || t < 0.5;   /* folding mode keeps the extension board in view */
  overlayLegs.visible = reclined >= 0.5;


  const lift = smooth(clamp01(f / 0.25));
  const place = smooth(clamp01((f - 0.75) / 0.25));
  for (const c of cushions) {
    const yStack = STACK_BASE + cT / 2 + (2 - c.i) * (cT + 0.003);
    c.m.position.z = c.z0 + (c.zStack - c.z0) * fp;
    /* aloft, each layer rides a full pad thickness above the one below it — in stack order —
       so pads crossing over each other never pass through one another */
    c.m.position.y = (1 - place) * (CUSHION_Y + c.dy + (RAISE + (2 - c.i) * AIR_STEP) * lift) + place * yStack;
  }
  stackPlaced = place > 0.96;
  poseWings();
  applyHatch();
}
/* p = 0 buckled round the stack · 1 unbuckled and lying beside the box */
function setStrap(p) {
  strapP = p;
  if (strapBuckle) {
    const pop = Math.sin(Math.PI * clamp01(p / 0.12));
    strapBuckle.position.y = strapBuckleY + 0.03 * pop;
    strapBuckle.rotation.x = 0.5 * pop;
  }
  /* unbuckle · wind it up · carry the coil across to the peg on the box side */
  const c = smooth(clamp01((p - 0.12) / 0.43));
  const q = smooth(clamp01((p - 0.58) / 0.20));    /* out sideways, still held high */
  const qd = smooth(clamp01((p - 0.78) / 0.22));   /* then down onto the peg */
  if (strapCoil) {
    strapCoil.scale.set(1 - 0.82 * c, 1 - 0.82 * c, 1);
    strapCoil.rotation.z = 2.5 * Math.PI * c;   /* two and a half turns as it winds down */
  }
  /* it lifts clear of the pads first, so the winding is in plain view — and it
     stays up there until it is outboard of them, so nothing passes through */
  const up = smooth(clamp01((p - 0.05) / 0.22)) * 0.30;
  cushionStrap.position.set(strapStow.x * q, up * (1 - qd) + strapStow.y * qd, strapStow.z * q);
  cushionStrap.rotation.y = -Math.PI / 2 * q;
  cushionStrap.rotation.z = -0.25 * Math.sin(Math.PI * qd);
}
/* g = 0 flaps out over the arches, 1 folded up against the mattress.
   Driven on its own track so it can lag the bed unfolding by two seconds. */
let flapFold = 1;
function setFlaps(g) {
  flapFold = g;
  /* folded, the green panel is inverted in fold mode and the blue one is not — the
     opposite of sliding mode — so every wing folds about the other way */
  const inv = bedMode === 'fold' ? -1 : 1;
  const fold180 = bedMode === 'fold';   /* folding: the wings lie flat on their own panel, so the stack stays flat */
  /* folding: the blue wings come up first, so blue can fold onto green before
     green's own wings follow */
  const gg = d => (bedMode !== 'fold') ? g
    : (d < 0 ? smooth(clamp01(g / 0.45)) : smooth(clamp01((g - 0.45) / 0.55)));
  const ANG = fold180 ? Math.PI : Math.PI / 2;
  for (const f of flaps) f.pv.rotation.z = f.sx * f.dir * inv * ANG * gg(f.dir);
  /* the arms run out with the wings and retract into their rails as they fold up */
  for (const st of wingStays) st.slide.position.x = st.inX + (st.outX - st.inX) * (1 - g);
  for (const s of sideCushions) {
    const dir = s.dir * inv;
    const g2 = gg(s.dir);
    const xDep = s.sx * (BED_W / 2 + SIDE_PAD_W / 2);
    const xFold = fold180 ? s.sx * (W / 2 - FLAP_W / 2)
                          : s.sx * (W / 2 - cT / 2 - 0.014);   /* folds inboard onto the stack — outboard there is no room past the arches */
    const fx = xDep + (xFold - xDep) * g2;
    /* flat-folded, the wing lands face-down on its own panel and the infill
       cushion rides on its far side; stood on edge it has to be lifted instead */
    const lift = fold180 ? (pT + cT) : ((FLAP_W - cT) / 2 + (dir < 0 ? 2 * (pT / 2 + cT / 2 + 0.002) : 0));
    s.fp = { x: fx, y: s.y + lift * g2 * dir, rz: s.sx * dir * ANG * g2 };
  }
  poseWings();
  applyHatch();
}

/* r = 0 flat, 1 backrest up. The prop is a fixed length and its foot drops into one of
   the gaps between the pink board's slats; each gap gives a different backrest angle. */
const RECLINE = Math.PI / 4;
const PROP_FOOT_Y = -OVL - pT / 2 + 0.002;   /* foot tip sits just above the gap's floor */
const propHinge = th => [-BR_LEG_Z * Math.sin(th) - (pT / 2) * Math.cos(th),
                         BR_LEG_Z * Math.cos(th) - (pT / 2) * Math.sin(th)];
const SLAT_GAPS = [1, 2, 3, 4].map(i => -pL + (pL / 5) * i);   /* gap centres, pivotB z */
const PROP_L = (() => {   /* sized so the middle gap gives the 45° backrest */
  const [hy, hz] = propHinge(RECLINE), gz = SLAT_GAPS.reduce((a, g) => Math.abs(g - hz) < Math.abs(a - hz) ? g : a);
  return Math.hypot(hy - PROP_FOOT_Y, hz - gz);
})();
const REC_ANGLES = [];   /* [angle, gap z] for every gap the prop can reach */
for (const gz of SLAT_GAPS) {
  let prev = null;
  for (let th = 0.2; th <= 1.25; th += 0.002) {
    const [hy, hz] = propHinge(th), d = Math.hypot(hy - PROP_FOOT_Y, hz - gz) - PROP_L;
    if (prev !== null && prev < 0 && d >= 0 && hz - gz > -0.02) { REC_ANGLES.push([th, gz]); break; }
    prev = d;
  }
}
REC_ANGLES.sort((a, b) => a[0] - b[0]);
let recIdx = REC_ANGLES.findIndex(a => Math.abs(a[0] - RECLINE) < 0.02);
if (recIdx < 0) recIdx = 0;
let recAngCur = REC_ANGLES[recIdx][0], recAngFrom = recAngCur;
function setRecline(r) {
  const th = recAngCur * r;
  reclined = r;
  if (r >= 0.5 && reclinePrev < 0.5) hatchOut = true;   /* rising into the lounger takes the panel out once */
  reclinePrev = r;
  const thS = { '-1': th * recSide.L, '1': th * recSide.R };
  frontPivot.rotation.x = thS[-1];
  frontPivotR.rotation.x = thS[1];
  for (const pv of brLegs) {
    const th = thS[pv.userData.sx], r = th / recAngCur;
    /* the prop swings down from flat under the backrest and its foot finds the gap
       the backrest angle belongs to: the gap is where the foot lands at this angle */
    const [hy, hz] = propHinge(th);
    const gz = hz - Math.sqrt(Math.max(0, PROP_L * PROP_L - (hy - PROP_FOOT_Y) ** 2));
    const land = Math.atan2(-(gz - hz), -(PROP_FOOT_Y - hy));
    const world = -Math.PI / 2 + (land + Math.PI / 2) * r;   /* -π/2 = folded flat */
    pv.rotation.x = world - th;
    pv.scale.y = PROP_L / BR_LEG_L;
    pv.visible = folded < 0.5 && r > 0.001;
  }
  for (const g of occupants) g.visible = peopleShown && folded < 0.02;
  legs.visible = folded < 0.8 && r < 0.5;   /* the far pair has nothing to stand under once the panel is up */
  applyHatch();
  if (folded > 0.001) return;   /* folded away — setFold owns the cushion stack */
  const arm = pL / 2, off = pT / 2 + cT / 2 + 0.002;
  for (const c of frontCushions) {
    const t = thS[c.sx], rr = t / recAngCur;
    c.m.rotation.x = t;
    c.m.position.z = hingeA - pL + off * Math.sin(t) - arm * Math.cos(t);
    c.m.position.y = bedY + c.dy * (1 - rr) + off * Math.cos(t) + arm * Math.sin(t);
  }
  overlayPanel.visible = bedMode === 'fold' || folded < 0.5;   /* the extension board lifts out before the bed stows */
  overlayLegs.visible = r >= 0.5;   /* only needed once the panel below has risen */
}
setFold(0);
setFlaps(0);
setRecline(0);

/* ---- slide the box (not the van) forward to meet the seat backs ---- */
for (const c of model.children) {
  if (c === vanSolid || c === tableUnit) continue;
  c.position.z += BOXZ;
}

/* ---- rest the whole thing on y = 0 ---- */
const bounds = new THREE.Box3().setFromObject(model);
model.position.y -= bounds.min.y;
model.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = !o.userData.noReceive; } });

leftShield.rotation.x = 0; /* frame the camera on the widest pose */
stage.setObject(model);
/* steadier render: tighter depth range and a denser, normal-biased shadow map so
   the thin drawer fronts and slots don't shimmer or show shadow acne */
model.traverse(o => { if (o.userData.noReceive) o.receiveShadow = false; });
(function steadyRender() {
  const r = stage._renderer, cam = stage._camera, key = stage._key;
  if (!r || !cam || !key) return;
  cam.near = Math.max(cam.near, 0.05); cam.far = Math.min(cam.far, 80); cam.updateProjectionMatrix();
  key.shadow.mapSize.set(4096, 4096);
  key.shadow.bias = -0.0004; key.shadow.normalBias = 0.012;
  const sc = key.shadow.camera, span = 4.2;
  sc.left = -span; sc.right = span; sc.top = span; sc.bottom = -span;
  sc.near = 0.5; sc.far = 25; sc.updateProjectionMatrix();
  if (key.shadow.map) { key.shadow.map.dispose(); key.shadow.map = null; }
})();

/* The stage can end up booted-but-idle if the host re-parents it mid-boot:
   canvas left at 1px and no render loop. Re-assert size + loop after layout. */
function ensureRendering() {
  const r = stage._renderer, cam = stage._camera;
  if (!r || !cam) return;
  const w = stage.clientWidth, h = stage.clientHeight;
  if (w > 1 && h > 1) {
    const cv = r.domElement;
    if (Math.abs(cv.clientWidth - w) > 1 || Math.abs(cv.clientHeight - h) > 1) {
      r.setSize(w, h, false);
      cv.style.width = w + 'px';
      cv.style.height = h + 'px';
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    }
  }
  if (stage._loop) r.setAnimationLoop(stage._loop);
  if (stage._ro) stage._ro.observe(stage);
}
ensureRendering();
requestAnimationFrame(ensureRendering);
for (const t of [120, 400, 1200]) setTimeout(ensureRendering, t);
window.addEventListener('resize', ensureRendering);

/* ---- motion: button-driven drawer and bed ---- */
const OPEN = 0.52;
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/* pull the camera back a little as the drawer runs out, so the photo bubble has room,
   and swing round to a rear three-quarter view of the open drawer */
let lastDrawerP = 0;
const sph = new THREE.Spherical();
let fromTheta = null, fromPhi = null;
const TO_THETA = 0.62, TO_PHI = 1.16;   /* rear three-quarter, slightly above the deck */
/* the moment the user grabs the view, stop steering it for them */
let userOrbiting = false;
if (stage._controls) {
  stage._controls.addEventListener('start', () => { userOrbiting = true; });
}

/* while any drawer is out, ease the view round to the back of the van */
function holdRearView(dt) {
  const cam = stage._camera, ctr = stage._controls;
  if (!cam || !ctr) return;
  sph.setFromVector3(cam.position.clone().sub(ctr.target));
  let dTheta = TO_THETA - sph.theta;
  if (!Number.isFinite(dTheta)) return;
  dTheta = Math.atan2(Math.sin(dTheta), Math.cos(dTheta));
  const k = Math.min(1, dt / 700);
  if (Math.abs(dTheta) < 0.004 && Math.abs(TO_PHI - sph.phi) < 0.004) return;
  sph.theta += dTheta * k;
  sph.phi += (TO_PHI - sph.phi) * k;
  cam.position.copy(ctr.target).add(new THREE.Vector3().setFromSpherical(sph));
  cam.lookAt(ctr.target);
  ctr.update();
}
function dollyWithDrawer(p) {
  const cam = stage._camera, ctr = stage._controls;
  if (!cam || !ctr) { lastDrawerP = p; return; }
  const f = 1 + 0.20 * (p - lastDrawerP);
  lastDrawerP = p;
  if (f === 1) return;
  const v = cam.position.clone().sub(ctr.target).multiplyScalar(f);
  cam.position.copy(ctr.target).add(v);
  ctr.update();
}

function setOut(ref, out) {
  const dir = ref.dir || 1;   /* -1 runs the drawer out the cab end instead */
  ref.g.position.z = BOXZ + out * dir;
  for (const r of (runnersByDrawer[ref.key] || [])) {
    r.scale.z = (RUN_L + out) / RUN_L;
    r.position.z = BOXZ + RUN_Z + (out / 2) * dir;
  }
  const open = Math.min(1, Math.max(0, (out / OPEN - 0.5) / 0.5));
  /* on drawer 1 the front folds out flat and becomes a side table */
  if (ref.tabletop && ref.hinge) ref.hinge.rotation.x = -Math.PI / 2 * open;
  /* the fridge lid lifts once the drawer is out */

  if (ref.n !== 1) return;
  /* the windshield lies flat over the stove until the drawer is out */
  leftShield.rotation.x = Math.PI / 2 * (1 - open);
}
function drawersP() { return Math.max(...drawerRefs.map(d => anim['d' + d.n].p)); }
function allOpen() { return drawerRefs.every(d => anim['d' + d.n].target === 1); }

/* f = 0 upright, 1 folded flat onto the squab */
function setSeatBacks(f) {
  const a = 0.32 - f * (Math.PI / 2 + 0.32);   /* upright leans back; folding tips it forward onto the squab */
  for (const p of seatPivots) p.rotation.x = a;
}

let fitReady = false;
let boxRemoved = () => false;
const anim = {
  d1: { p: 0, target: 0, ms: 1500, gate: () => anim.d1.target === 1 || anim.d1s.p === 0, apply: p => { setOut(drawerRefs[0], ease(p) * OPEN); dollyWithDrawer(p); } },
  d2: { p: 0, target: 0, ms: 900, apply: p => setOut(drawerRefs[1], ease(p) * OPEN) },
  d3: { p: 0, target: 0, ms: 900, gate: () => anim.d3.target === 1 || (anim.d3l.p === 0 && (anim.d3d.p === 0 || anim.d3d.p === 1)), apply: p => setOut(drawerRefs[2], ease(p) * OPEN) },
  d4: { p: 0, target: 0, ms: 900, gate: () => anim.d4.target === 0 || anim.fridge.p === 0, apply: p => setOut(drawerRefs[3], ease(p) * OPEN) },
  /* removing the fridge: the drawer's back lifts up out of its channels, then the
     fridge rolls out of the cab end and steps down onto the floor */
  /* ...then the lid opens and two cans are lifted out and stood on the floor */
  fridge: { p: 0, target: 0, ms: 7600, gate: () => anim.d4.p === 0, apply: p => {
    const a = ease(clamp01(p / 0.14)), b = ease(clamp01((p - 0.16) / 0.26)), c = ease(clamp01((p - 0.42) / 0.07));
    fridgeLidP = ease(clamp01((p - 0.52) / 0.1));
    fridgeCans.forEach((can, i) => {
      const q = clamp01((p - 0.64 - i * 0.18) / 0.18);
      const up = ease(clamp01(q / 0.4)), over = ease(clamp01((q - 0.4) / 0.6));
      const yTop = T + 0.33 + CAN_H / 2 + 0.05;
      const tg = over > 0 ? canTarget(i) : null;
      const tx = tg ? tg.x : can.userData.xF, ty = tg ? tg.y : T + CAN_H / 2, tz = tg ? tg.z : -0.38;
      can.position.y = CAN_Y0 + (yTop - CAN_Y0) * up + (ty - yTop) * over + 0.12 * Math.sin(Math.PI * over);
      can.position.z = -0.12 + (tz + 0.12) * over;
      can.position.x = can.userData.x0 + (tx - can.userData.x0) * over;
    });
    if (fridgeBack) {
      fridgeBack.position.y = fridgeBackY0 + 0.24 * a;
      fridgeBack.position.z = fridgeBackZ0 - 0.06 * clamp01((a - 0.7) / 0.3);
    }
    fridgeUnit.position.z = -FRIDGE_ROLL * b;
    fridgeUnit.position.y = -FRIDGE_DROP * c;
  } },
  d5: { p: 0, target: 0, ms: 1600, apply: p => setDoor(ease(p)) },
  d5h: { p: 0, target: 0, ms: 1100, apply: p => setShelfHigh(ease(p)) },
  /* the tray's dividers, in one run: each in turn tips up at its outer end, draws
     out along its length, pauses clear of the tray, then goes back the same way */
  d1v: { p: 0, target: 0, ms: 6000, apply: p => {
    leftSideDiv.forEach((v, i) => {
      const q = clamp01((p - i * 0.5) / 0.5);
      const r = q < 0.42 ? q / 0.42 : q < 0.58 ? 1 : (1 - q) / 0.42;
      const th = 0.55 * ease(clamp01(r / 0.35)), sl = v.userData.slide * ease(clamp01((r - 0.35) / 0.65));
      v.rotation.z = th;
      v.position.x = v.userData.x0 + sl * Math.cos(th);
      v.position.y = v.userData.y0 + sl * Math.sin(th);
    });
  } },
  d1s: { p: 0, target: 0, ms: 800, gate: () => anim.d1s.target === 1 || anim.d1v.p === 0 || anim.d1v.p === 1, apply: p => { if (leftSideTray) leftSideTray.position.x = ease(p) * leftSideTravel; } },
  /* the cross divider lifts clear of its cleats and drops into the next slot,
     twice over, so all three positions are shown */
  strap: { p: 0, target: 0, ms: 2800, apply: p => setStrap(p) },
  d2d: { p: 0, target: 0, ms: 2600, apply: p => {
    if (!d2Div) return;
    /* one board at a time: the aft board hops to the cab end over the middle
       one, then the middle one moves back into the slot just vacated */
    const hop = (g, a, b, q) => {
      if (!g) return;
      const e = ease(q), arc = Math.sin(Math.PI * e);
      g.position.z = a + (b - a) * e;
      g.position.y = g.userData.y0 + d2Lift * arc;
    };
    const q1 = clamp01(p / 0.5), q2 = clamp01((p - 0.5) / 0.5);
    hop(d2Div, d2Slots[0], d2Slots[2], q1);
    hop(d2Div2, d2Slots[1], d2Slots[0], q2);
  } },
  d3l: { p: 0, target: 0, ms: 3200, gate: () => anim.d3l.target === 1 || anim.d3d.p === 0 || anim.d3d.p === 1, apply: p => {
    /* each chopping board in turn: lift clear of the drawer, roll over to show the
       trivet bars, then carried out past the drawer front and laid flat on the ground
       behind the van, one on the other —
       leaving the dividers and mugs in view. The model is lifted onto the van floor,
       so the ground sits at -model.position.y in its own frame. */
    d3Lids.forEach((pv, i) => {
      /* both boards come back off the ground once the dividers have been shown — top one first */
      const back = i === 1 ? clamp01(anim.d3b.p / 0.5) : clamp01((anim.d3b.p - 0.5) / 0.5);
      const a = clamp01((p - i * 0.5) / 0.5) * (1 - back);
      const up = ease(clamp01(a / 0.3)), go = ease(clamp01((a - 0.3) / 0.7));
      /* they fly straight up clear of the drawer and hang there, one above the other */
      const tg = { x: 0, y: pv.userData.y0 + 0.42 + i * 0.08, z: pv.userData.z0 + (i === 1 ? 0.30 : 0.16) };
      const y1 = pv.userData.y0 + 0.16, z1 = pv.userData.z0 + (i === 1 ? 0.26 : 0.12);
      pv.position.x = tg.x * go;
      pv.position.y = pv.userData.y0 + (y1 - pv.userData.y0) * up + (tg.y - y1) * go;
      pv.position.z = pv.userData.z0 + (z1 - pv.userData.z0) * up + (tg.z - z1) * go;
      pv.rotation.z = Math.PI * ease(clamp01((a - 0.2) / 0.35));
    });
  } },
  /* last, both boards go back onto the drawer, top one first — each lifted off the
     stack, turned back over and set down in its own place */
  d3b: { p: 0, target: 0, ms: 3200, apply: () => anim.d3l.apply(anim.d3l.p) },
  /* then the two dividers, one at a time: each lifts straight up out of its cleats,
     is held clear for a moment, and drops back in */
  d3d: { p: 0, target: 0, ms: 3200, gate: () => anim.d3d.target === 1 || anim.d3l.p === 1, apply: p => {
    d3Divs.forEach((v, i) => {
      const q = clamp01((p - i * 0.5) / 0.5);
      const r = q < 0.4 ? q / 0.4 : q < 0.6 ? 1 : (1 - q) / 0.4;
      v.position.y = v.userData.y0 + 0.16 * ease(r);
      for (const c of v.userData.cleats || []) c.visible = true;
    });
  } },
  leaf: { p: 0, target: 0, ms: 1100, apply: p => setHalfBOut(ease(p)) },
  fleaf: { p: 0, target: 0, ms: 2200, apply: p => setTableFold(ease(p)) },
  tstow: { p: 0, target: 0, ms: 2000, apply: p => setTableTravel(ease(p)) },
  bside: { p: 0, target: 0, ms: 1500, apply: p => setBedsideMove(ease(p)) },
  bspos: { p: 0, target: 0, ms: 1600, apply: p => setBedsidePos(ease(p)) },
  bed:    { p: 1, target: 1, ms: 3400, apply: p => setFold(ease(p)) },
  flaps:  { p: 1, target: 1, ms: 900, apply: p => setFlaps(ease(p)) },
  seats:  { p: 0, target: 0, ms: 1400, apply: p => setSeatBacks(ease(p)) },
  recline: { p: 0, target: 0, ms: 1200, apply: p => setRecline(ease(p)) },
  recA: { p: 1, target: 1, ms: 900, apply: p => { recAngCur = recAngFrom + (REC_ANGLES[recIdx][0] - recAngFrom) * ease(p); setRecline(reclined); } },
  recL: { p: 1, target: 1, ms: 1000, apply: p => { recSide.L = ease(p); setRecline(reclined); } },
  recR: { p: 1, target: 1, ms: 1000, apply: p => { recSide.R = ease(p); setRecline(reclined); } },
  fit: { p: 0, target: 0, ms: 3200, apply: p => { if (fitReady) setFit(p); } },
  doors:  { p: 0, target: 0, ms: 1600, apply: p => {
    const e = ease(p);
    for (const d of doorGroups) d.position.z = e * DL;
    tailgate.rotation.x = -e * 1.35;
    /* fade the body sides back so the interior reads once the doors are open */
    M.trim_clear.opacity = 0.22 - 0.17 * e;
    M.glass.opacity = 0.28 - 0.21 * e;
    M.door.opacity = 1 - 0.97 * e;
    M.door_dk.opacity = 1 - 0.97 * e;
  } },
};
/* the bed can only come down onto folded seat backs, and the backs can
   only come up again once the bed is folded away */
anim.bed.gate = () => anim.bed.target === 1
  || (anim.seats.p === 1 && (cushionsOut || anim.strap.p === 1)
      && (!leafMode || anim.fleaf.p === 1)   /* and the table's leaves are folded up */
      && Math.abs(tblH - (TBL_H_BED - (leafMode ? FOLD_PROUD : 0))) < 0.0005);   /* and it has wound down to take the board */
anim.strap.gate = () => anim.strap.target === 1 || anim.bed.p === 1;
tstowTrack = anim.tstow;
tstowTrack.p = tstowTrack.target = stowP;
/* going away the leaves fold first; coming back it travels out before unfolding */
anim.tstow.gate = () => anim.tstow.target === 0 || !leafMode || anim.fleaf.p === 1;
anim.fleaf.gate = () => anim.fleaf.target === 1 || anim.tstow.p < 0.001;
anim.seats.gate = () => anim.seats.target === 1 || anim.bed.p === 1;
/* the backrest can only rise once the bed is flat and down */
anim.recline.gate = () => anim.recline.target === 0 || anim.bed.p === 0;
const fridgeBtn = document.getElementById('fridge-remove');
function refreshFridgeBtn() { if (fridgeBtn) fridgeBtn.textContent = anim.fridge.target === 1 ? 'Refit fridge' : 'Remove fridge'; }
if (fridgeBtn) fridgeBtn.addEventListener('click', () => {
  anim.d4.target = 0;   /* the drawer shuts first, then the fridge comes out the cab end */
  anim.fridge.target = anim.fridge.target === 1 ? 0 : 1;
  refreshFridgeBtn();
});
let last = performance.now();
const FLAP_DELAY = 4000;
let bedPrevTarget = anim.bed.target, flapsAt = null;
/* --- projected screen bounds of everything visible, for bubble placement --- */
const visBox = new THREE.Box3();
const corner = new THREE.Vector3();
function updateVisBox() {
  visBox.makeEmpty();
  model.updateWorldMatrix(true, true);
  model.traverse(o => {
    if (!o.isMesh) return;
    let p = o, vis = true;
    while (p) { if (p.visible === false) { vis = false; break; } p = p.parent; }
    if (!vis) return;
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    visBox.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld));
  });
}
function projectedSpan(cam, rect, wrapRect) {
  let xmin = Infinity, xmax = -Infinity;
  for (let i = 0; i < 8; i++) {
    corner.set(i & 1 ? visBox.max.x : visBox.min.x, i & 2 ? visBox.max.y : visBox.min.y, i & 4 ? visBox.max.z : visBox.min.z);
    corner.project(cam);
    const px = (corner.x * 0.5 + 0.5) * rect.width + (rect.left - wrapRect.left);
    xmin = Math.min(xmin, px); xmax = Math.max(xmax, px);
  }
  return [xmin, xmax];
}

/* --- numbered pins on each drawer front --- */
const pinHost = document.getElementById('pins');
const pinPt = new THREE.Vector3();
const pinRefs = drawerRefs.concat([doorPinRef]);
if (pinHost) for (const d of pinRefs) {
  const el = document.createElement('span');
  el.className = 'pin';
  el.textContent = String(d.n);
  pinHost.appendChild(el);
  d.el = el;
}
let frameRects = null;
let latchedSide = null, latchedBase = null, latchedCount = 0, latchedCols = 0;
function readRects() {
  const cv = stage.shadowRoot && stage.shadowRoot.querySelector('canvas');
  if (!cv || !wrap) { frameRects = null; return; }
  frameRects = { r: cv.getBoundingClientRect(), w: wrap.getBoundingClientRect() };
}
const boxBtnEl = document.getElementById('box-toggle');
const bedFloat = document.getElementById('bed-float');
const drawersFloat = document.getElementById('drawers-float');
const tableFloat = document.getElementById('table-float');
/* project a point on an object into stage coordinates */
function toScreen(obj, lx, ly, lz, cam, r, wr) {
  obj.updateWorldMatrix(true, false);
  pinPt.set(lx, ly, lz).applyMatrix4(obj.matrixWorld).project(cam);
  return {
    x: (pinPt.x * 0.5 + 0.5) * r.width + (r.left - wr.left),
    y: (-pinPt.y * 0.5 + 0.5) * r.height + (r.top - wr.top),
    front: pinPt.z < 1,
  };
}
function placeFloat(el, obj, lx, ly, lz, show, cam, r, wr) {
  if (!el) return;
  if (!show) { el.style.opacity = '0'; el.style.pointerEvents = 'none'; return; }
  const p = toScreen(obj, lx, ly, lz, cam, r, wr);
  el.style.transform = 'translate(' + Math.round(p.x) + 'px,' + Math.round(p.y) + 'px) translate(-50%,-50%)';
  el.style.opacity = p.front ? '1' : '0';
  el.style.pointerEvents = p.front ? '' : 'none';
}
function placePins() {
  if (!pinHost || !frameRects) return;
  const cam = stage._camera;
  if (!cam) return;
  const r = frameRects.r, wr = frameRects.w;
  /* one bed control, on the bed's rear panel: unfold · lounger · fold */
  const boxIn = anim.fit.p > 0.998 && anim.fit.target === 1;
  const bedSettled = anim.bed.p === anim.bed.target && anim.recline.p === anim.recline.target;
  if (bedFloat) {
    const label = anim.bed.target === 1 ? 'Unfold bed'
      : anim.recline.target === 1 ? 'Fold bed' : 'Lounger';
    if (bedFloat.textContent !== label) bedFloat.textContent = label;
    /* anchored clear above the van roof — with the van hidden there is no roof to
       clear, so it drops down close to the box instead */
    if (vanSolid.visible) {
      placeFloat(bedFloat, vanSolid, 0, VH + 0.22, TAIL - 0.40, boxIn && bedSettled, cam, r, wr);
    } else {
      placeFloat(bedFloat, carcass, 0, H + 0.26, 0, boxIn && bedSettled, cam, r, wr);
    }
  }
  if (drawersFloat) {
    const shut = !anyDrawerOpen() && !seqRunning;
    /* anchored below the drawer fronts, so it never covers what it opens */
    const drop = vanSolid.visible ? 0.34 : 0.15;
    placeFloat(drawersFloat, doorBoard, 0, -(H - T) / 2 - drop, T / 2 + 0.10, boxIn && shut, cam, r, wr);
    /* and if the camera still brings them together, push the lower one clear */
    if (bedFloat && bedFloat.style.opacity === '1' && drawersFloat.style.opacity === '1') {
      const a = bedFloat.getBoundingClientRect(), b = drawersFloat.getBoundingClientRect();
      const ovY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      const ovX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      if (ovX > 0 && ovY > 0) {
        drawersFloat.style.transform += ' translateY(' + Math.round(ovY + 10) + 'px)';
      }
    }
  }
  if (tableFloat) {
    /* with the box out of the van, the table is the thing on screen — put its
       control on the table when it is up, and on the box when it is stowed */
    const show = boxOut && anim.fit.p < 0.002;
    const label = typeof tableCycleLabel === 'function' ? tableCycleLabel()
      : (tableStowed ? 'Set up table' : 'Stow table');
    if (tableFloat.textContent !== label) tableFloat.textContent = label;
    /* always anchored to the floor socket between the seats, where the post stands
       when the table is set up — so the control sits in one place either way */
    placeFloat(tableFloat, tableParts, TOPDX - LEGDX, 0.036 + POST_LEN + 0.12, 0, show, cam, r, wr);
    /* the tailgate-pinned fit button projects to nearly this same point when the box
       is on the tarmac — a constant offset separates them without a feedback loop */
    if (tableFloat.style.opacity === '1') {
      const fitUp = boxBtnEl && boxBtnEl.style.opacity === '1';
      tableFloat.style.transform += fitUp ? ' translateY(-124px)' : ' translateY(-72px)';
    }
  }
  if (typeof refreshTableLabels === 'function') refreshTableLabels();
  /* whichever control is out on the model leaves the menu, and vice versa */
  const bedFloatOn = bedFloat && bedFloat.style.opacity === '1';
  if (bedBtn) bedBtn.dataset.floating = (bedFloatOn && bedFloat.textContent !== 'Lounger') ? '1' : '';
  if (loungeBtn) loungeBtn.dataset.floating = (bedFloatOn && bedFloat.textContent === 'Lounger') ? '1' : '';
  if (drawerBtn) drawerBtn.dataset.floating = (drawersFloat && drawersFloat.style.opacity === '1') ? '1' : '';
  if (tableBtn) tableBtn.dataset.floating = '';   /* the table controls stay in the menu as well */
  for (const b of [bedBtn, loungeBtn, drawerBtn, tableBtn]) {
    if (b && !b.dataset.boxHidden) b.style.display = b.dataset.floating ? 'none' : '';
  }
  /* the fit/remove button rides with the tailgate opening */
  if (boxBtnEl) {
    tailgate.updateWorldMatrix(true, false);
    pinPt.set(0, -0.30, 0.10).applyMatrix4(tailgate.matrixWorld).project(cam);
    const bx = (pinPt.x * 0.5 + 0.5) * r.width + (r.left - wr.left);
    const by = (-pinPt.y * 0.5 + 0.5) * r.height + (r.top - wr.top);
    /* only once the box is fully out and still — never mid-animation */
    const settled = anim.fit.p < 0.002 && anim.fit.target === 0;
    const on = pinPt.z < 1 && boxBtnEl.style.display !== 'none' && settled;
    boxBtnEl.style.transform = 'translate(' + Math.round(bx) + 'px,' + Math.round(by) + 'px) translate(-50%,-50%)';
    boxBtnEl.style.opacity = on ? '1' : '0';
    boxBtnEl.style.pointerEvents = on ? '' : 'none';
  }
  const SEP = 34;
  const pts = [];
  for (const d of pinRefs) {
    if (!d.el) continue;
    d.g.updateWorldMatrix(true, false);
    if (d.local) {
      pinPt.set(d.local[0], d.local[1], d.local[2]);
    } else {
      const px0 = d.key.endsWith('_upper') ? -(dW / 2 - 0.05) : (dW / 2 - 0.05);
      pinPt.set(px0, BAYS[d.key][1] * 0.55, dD / 2 + 0.05);
    }
    pinPt.applyMatrix4(d.g.matrixWorld).project(cam);
    pts.push({
      d,
      x: (pinPt.x * 0.5 + 0.5) * r.width + (r.left - wr.left),
      y: (-pinPt.y * 0.5 + 0.5) * r.height + (r.top - wr.top),
      on: anim['d' + d.n].p > 0.35 && pinPt.z < 1,
    });
  }
  /* push overlapping badges apart in screen space */
  const live = pts.filter(p => p.on).sort((a, b) => a.y - b.y);
  for (let i = 1; i < live.length; i++) {
    for (let j = 0; j < i; j++) {
      if (Math.abs(live[i].x - live[j].x) < SEP && live[i].y - live[j].y < SEP) {
        live[i].y = live[j].y + SEP;
      }
    }
  }
  for (const p of pts) {
    const tf = 'translate(' + Math.round(p.x - 15) + 'px,' + Math.round(p.y - 15) + 'px)';
    if (p.d.lastTf !== tf) { p.d.el.style.transform = tf; p.d.lastTf = tf; }
    const op = p.on ? '1' : '0';
    if (p.d.lastOp !== op) { p.d.el.style.opacity = op; p.d.lastOp = op; }
  }
}

/* --- one reference-photo bubble per drawer, stacked clear of the model --- */
const wrap = document.querySelector('.stage-wrap');
const callouts = [...document.querySelectorAll('.callout')].map(el => ({
  el, n: +el.dataset.drawer, bub: el.querySelector('.bubble'),
}));
/* hovering a photo runs its own drawer out; leaving it shuts it again */
for (const c of callouts) {
  c.bub.addEventListener('pointerenter', () => {
    if (seqRunning) return;   /* let the run finish — hovering does not cut in */
    stopSequence();
    holdStill();
    anim['d' + c.n].target = 1;
    if (drawerBtn) drawerBtn.textContent = 'Close drawers';
  });
  c.bub.addEventListener('pointerleave', () => {
    if (seqRunning) return;
    anim['d' + c.n].target = 0;
    if (!anyDrawerOpen() && drawerBtn) drawerBtn.textContent = 'Open drawers';
  });
}

function placeCallouts() {
  if (!callouts.length || !frameRects) return;
  const cam = stage._camera;
  if (!cam) return;
  const r = frameRects.r, w = frameRects.w;
  const pad = 8, off = 26;
  const shown = callouts.filter(c => bubblesPinned || anim['d' + c.n].p > 0.35);

  for (const c of callouts) {
    if (!shown.includes(c) && c.lastOp !== '0') {
      c.el.style.opacity = '0';
      c.el.style.visibility = 'hidden';
      c.bub.style.pointerEvents = 'none';
      c.lastOp = '0';
    }
  }
  if (!shown.length) return;

  const [mx0, mx1] = projectedSpan(cam, r, w);
  const HINT = 46;                       /* the stage's own hint strip, bottom-left */
  const usableH = w.height - HINT;


  /* the side and the cell size are LATCHED: re-deciding them per frame made the
     grid jump sides and resize while the user was dragging */
  /* the photos always sit on the left of the stage — the controls menu lives on
     the right, so a right-hand grid would collide with it */
  const leftSpace = mx0 - off - pad;
  const rightSpace = w.width - pad - (mx1 + off);
  latchedSide = 'left';
  const useLeft = true;
  /* the bubbles may run over the model's left edge — they are the point of the
     view while a drawer is out, so give them a proper share of the stage */
  const space = Math.max(110, Math.round(w.width * 0.32), useLeft ? leftSpace : rightSpace);

  /* fit the grid to the room available BEFORE latching: two columns if they fit
     at a sensible size, otherwise one — and never a cell wider than its column */
  let rows = Math.min(shown.length, 2);
  let cols = Math.ceil(shown.length / rows);
  const sizeFor = (rw, cl) => Math.min(
    Math.floor((space - (cl - 1) * pad) / cl),
    Math.floor((usableH - pad * (rw + 1)) / rw));
  if (cols > 1 && sizeFor(rows, cols) < 88) { rows = shown.length; cols = 1; }
  const want = Math.max(56, Math.min(279, sizeFor(rows, cols)));
  const fits = b => cols * (b + pad) - pad <= space && rows * (b + pad) - pad <= usableH;
  if (latchedBase === null || shown.length !== latchedCount || cols !== latchedCols
      || !fits(latchedBase) || Math.abs(want - latchedBase) > 28) {
    let b = Math.floor(want / 8) * 8;
    while (b > 56 && !fits(b)) b -= 8;
    latchedBase = b;
    latchedCount = shown.length;
    latchedCols = cols;
  }
  const base = latchedBase;

  for (const c of shown) {
    const i = shown.indexOf(c);
    const row = i % rows, col = Math.floor(i / rows);
    const s = base;
    if (c.lastS !== s) {
      c.bub.style.width = s + 'px';
      c.bub.style.height = s + 'px';
      c.el.style.width = s + 'px';
      c.lastS = s;
    }

    const rawX = useLeft
      ? mx0 - off - (col + 1) * base - col * pad + (base - s)
      : mx1 + off + col * (base + pad);
    const cx = Math.min(Math.max(pad, rawX), Math.max(pad, w.width - s - pad));
    const cy = Math.min(pad + row * (base + pad), Math.max(pad, usableH - s - pad));
    const tf = 'translate(' + Math.round(cx) + 'px,' + Math.round(cy) + 'px)';
    if (c.lastTf !== tf) { c.el.style.transform = tf; c.lastTf = tf; }
    /* grow the hover zoom inward, so an edge cell is never clipped */
    const head = Math.ceil(0.43 * s);
    const ox = cx < head ? 'left' : (w.width - (cx + s) < head ? 'right' : 'center');
    const oy = cy < head ? 'top' : (w.height - (cy + s) < head ? 'bottom' : 'center');
    const org = ox + ' ' + oy;
    if (c.lastOrg !== org) { c.bub.style.transformOrigin = org; c.lastOrg = org; }
    if (c.lastOp !== '1') {
      c.el.style.visibility = 'visible';
      c.el.style.opacity = '1';
      c.bub.style.pointerEvents = 'auto';
      c.lastOp = '1';
    }
  }
}

updateVisBox();
function tick(now) {
  const dt = now - last; last = now;
  applyTableMode();   /* the pedestal rises only once the fold has finished */
  if (pendingMode && anim.bed.p < 0.001) {   /* bed is out — swap mechanism and stow it again */
    bedMode = pendingMode; pendingMode = null;
    applyBedTiming();
    setFold(0); setFlaps(anim.flaps.p); anim.bed.target = 1; labels();
  } else if (pendingMode && anim.seats.p !== 1) {   /* it cannot run out — swap where it stands */
    bedMode = pendingMode; pendingMode = null;
    applyBedTiming();
    setFold(anim.bed.p); setFlaps(anim.flaps.p); labels();
  }
  /* let the page know the box is in, so the controls sheet can stay open */
  {
    const fitted = (anim.fit.target === 1 && anim.fit.p > 0.998) ? '1' : '0';
    if (document.body.dataset.boxFitted !== fitted) document.body.dataset.boxFitted = fitted;
  }
  /* the side cushions wait two seconds after the bed starts unfolding */
  if (anim.bed.target !== bedPrevTarget) { bedPrevTarget = anim.bed.target; flapsAt = null; }
  if (anim.bed.target === 0) {
    if (flapsAt === null && anim.bed.p < 1) flapsAt = now + FLAP_DELAY;
    anim.flaps.target = (flapsAt !== null && now >= flapsAt) ? 0 : 1;
  } else {
    flapsAt = null;
    anim.flaps.target = 1;
  }
  anim.strap.target = anim.bed.target === 1 ? 0 : 1;
  let moved = false;
  for (const a of Object.values(anim)) {
    if (a.p !== a.target && (!a.gate || a.gate())) {
      moved = true;
      const step = dt / a.ms;
      a.p = a.target > a.p ? Math.min(a.target, a.p + step) : Math.max(a.target, a.p - step);
      a.apply(a.p);
    }
  }
  /* the lower side tray only runs out once drawer 1 is fully extended */
  anim.d1s.target = (anim.d1.target === 1 && anim.d1.p > 0.999 && !trayClosing) ? 1 : 0;
  /* and its divider only lifts out once the tray is fully out */
  if (anim.d1s.target === 1) { if (anim.d1s.p > 0.999) anim.d1v.target = 1; }
  else if (anim.d1v.p === 1) { anim.d1v.p = 0; anim.d1v.target = 0; }   /* the run ends with it home — re-arm it */
  else anim.d1v.target = 0;
  /* the divider only comes out once drawer 2 is fully extended */
  anim.d2d.target = (anim.d2.target === 1 && anim.d2.p > 0.999 && !divClosing) ? 1 : 0;
  /* the shelf shows both heights: it seats low, then lifts to the upper supports */
  anim.d5h.target = (anim.d5.target === 1 && anim.d5.p > 0.999 && !shelfLowering) ? 1 : 0;
  /* the lids only come off once drawer 3 is fully extended */
  anim.d3l.target = (anim.d3.target === 1 && anim.d3.p > 0.999 && !lidsClosing) ? 1 : 0;
  /* the dividers come out and go back once the boards are off */
  if (anim.d3l.target === 1) { if (anim.d3l.p > 0.999) anim.d3d.target = 1; }
  else if (anim.d3d.p === 1) { anim.d3d.p = 0; anim.d3d.target = 0; }
  else anim.d3d.target = 0;
  /* once back on, the boards stay put on closing; the flag is cleared when the
     board run is wound back, ready for the next opening */
  if (anim.d3l.target === 1) { if (anim.d3d.p === 1) anim.d3b.target = 1; }
  else if (anim.d3b.p === 1) { anim.d3l.p = 0; anim.d3b.p = 0; anim.d3b.target = 0; anim.d3l.apply(0); }
  else if (anim.d3l.p === 0) { anim.d3b.p = 0; anim.d3b.target = 0; }
  else anim.d3b.target = anim.d3b.p;
  /* the fridge lid only lifts when drawer 4 is out on its own */
  const d4ref = drawerRefs[3];
  if (d4ref.lid) {
    const p = anim.d4.p;
    const open = Math.min(1, Math.max(0, (p - 0.5) / 0.5));
    d4ref.lid.rotation.z = Math.max(allOpen() ? 0 : 1.45 * open, 1.45 * fridgeLidP);
  }
  if (moved) updateVisBox();
  if (anyDrawerOpen() && !userOrbiting) holdRearView(dt);
  readRects();
  placeCallouts();
  syncDrawerBtn();
  placePins();
  requestAnimationFrame(tick);
}
for (const d of drawerRefs) anim['d' + d.n].apply(0);
for (const pv of d3Lids) { pv.userData.y0 = pv.position.y; pv.userData.z0 = pv.position.z; }
for (const g of [d2Div, d2Div2]) if (g) g.userData.y0 = g.position.y;
anim.d1s.apply(0);
anim.d1v.apply(0);
anim.d2d.apply(0);
anim.d3l.apply(0);
applyBedTiming();
anim.d5.apply(0);
anim.d5h.apply(0);
anim.bed.apply(1);
anim.flaps.apply(1);
anim.seats.apply(0);
anim.recline.apply(0);
anim.doors.apply(0);
requestAnimationFrame(tick);

function wire(id, a, labels) {
  const btn = document.getElementById(id);
  if (!btn) return;
  btn.addEventListener('click', () => {
    a.target = a.target ? 0 : 1;
    btn.textContent = a.target ? labels[1] : labels[0];
  });
}
const loungeBtn = document.getElementById('lounge-toggle');
if (loungeBtn) loungeBtn.addEventListener('click', () => {
  stopDemo();
  anim.recline.target = anim.recline.target ? 0 : 1;
  anim.recL.target = anim.recR.target = 1;   /* the lounger always comes up with both backrests raised */
  labels();
  hatchOut = anim.recline.target === 1;   /* the lounger comes with the panel out, but it can be refitted */
  applyHatch();
  if (anim.recline.target === 1) {   /* the bed has to be down and flat first */
    anim.bed.target = 0;
    anim.seats.target = 1;
    tableStowed = false;             /* the bedside table comes out with the lounger */
  }
  applyTableMode();
  labels();
});

{
  const b = document.getElementById('recline-angle-toggle');
  if (b) b.addEventListener('click', () => {
    stopDemo();
    recAngFrom = recAngCur;
    recIdx = (recIdx + 1) % REC_ANGLES.length;
    anim.recA.p = 0; anim.recA.target = 1;
    labels();
  });
}
for (const [id, k] of [['recline-left-toggle', 'recL'], ['recline-right-toggle', 'recR']]) {
  const b = document.getElementById(id);
  if (b) b.addEventListener('click', () => { stopDemo(); anim[k].target = anim[k].target ? 0 : 1; labels(); });
}
const hatchBtn = document.getElementById('hatch-toggle');
if (hatchBtn) hatchBtn.addEventListener('click', () => {
  hatchOut = !hatchOut;
  applyTableMode();
  applyHatch();
  labels();
});

const cushionsBtn = document.getElementById('cushions-toggle');
if (cushionsBtn) cushionsBtn.addEventListener('click', () => {
  cushionsOut = !cushionsOut;
  applyHatch();
  labels();
});

const peopleBtn = document.getElementById('people-toggle');
let peopleRevealed = false;
if (peopleBtn) peopleBtn.style.display = 'none';   /* revealed by typing "jm" */
let jmKeys = '';
window.addEventListener('keydown', e => {
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  const tag = (e.target && e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'select' || tag === 'textarea') return;
  jmKeys = (jmKeys + (e.key || '').toLowerCase()).slice(-2);
  if (jmKeys === 'jm' && peopleBtn) { peopleRevealed = true; peopleBtn.style.display = ''; peopleBtn.focus(); }
});
if (peopleBtn) peopleBtn.addEventListener('click', () => {
  peopleShown = !peopleShown;
  peopleBtn.textContent = peopleShown ? 'Hide Julia & Mike' : 'Show Julia & Mike';
  setRecline(reclined);
  for (const g of seated) g.visible = peopleShown && anim.bed.p > 0.98 && anim.bed.target === 1;
  for (const g of occupants) g.visible = peopleShown && folded < 0.02;
});

const fridgeSideBtn = document.getElementById('fridge-side-toggle');
let fridgeUserDir = 1;   /* the side the user chose, restored after the demo leg */
function setFridgeSide(dir) {
  drawerRefs[3].dir = dir;
  if (fridgeSideBtn) fridgeSideBtn.textContent = dir === 1 ? 'Fridge: out the back' : 'Fridge: into the van';
  anim.d4.apply(anim.d4.p);   /* re-seat it on the new side straight away */
}
if (fridgeSideBtn) fridgeSideBtn.addEventListener('click', () => {
  fridgeUserDir = drawerRefs[3].dir === 1 ? -1 : 1;
  setFridgeSide(fridgeUserDir);
});

const drawerBtn = document.getElementById('drawer-toggle');
/* with the photos up and every drawer shut, the button's only job is to clear them */
function syncDrawerBtn() {
  if (!drawerBtn) return;
  if (bubblesPinned && !anyDrawerOpen()) {
    if (drawerBtn.textContent !== 'Hide drawer info') drawerBtn.textContent = 'Hide drawer info';
  }
}
function setDrawers(t) { for (const d of drawerRefs) anim['d' + d.n].target = t; anim.d5.target = t; }
function anyDrawerOpen() { return pinRefs.some(d => anim['d' + d.n].target === 1); }

let seqTimers = [];
let bubblesPinned = false;
let seqRunning = false;   /* true only while the drawer run itself is playing */
function stopSequence() { for (const t of seqTimers) clearTimeout(t); seqTimers = []; seqRunning = false; trayClosing = false; lidsClosing = false; divClosing = false; shelfLowering = false; if (drawerRefs[3].dir !== fridgeUserDir) setFridgeSide(fridgeUserDir); }
function holdStill() {
  userOrbiting = false;
  fromTheta = null;
  stage.removeAttribute('autorotate');
  if (stage._controls) stage._controls.autoRotate = false;
}
/* each drawer, then the middle-bay door, out and back in once in turn */
let trayClosing = false;
let lidsClosing = false;
let divClosing = false;
let shelfLowering = false;
function runDrawerSequence() {
  stopSequence();
  seqRunning = true;
  const HOLD = 350, GAP = 500;
  /* with the bed folded away and at least two seats out, there is room to stand
     in the load bay — so the run also shows the fridge coming out the cab end */
  const seatsRemoved = Object.values(seatGroups).filter(g => g && !g.visible).length;
  const showInsideFridge = false;   /* the fridge now only runs out off the tailgate */
  /* the hatch panel goes back in too, so the run starts from a complete box */
  if (hatchOut) { hatchOut = false; applyHatch(); labels(); }
  /* the middle-bay panel goes back in first, so the run always starts from a
     complete box however the user left it */
  let t = 0;
  if (anim.d5.p > 0.001) {
    anim.d5.target = 0;
    t = anim.d5.ms * anim.d5.p + GAP;
  }
  for (const d of pinRefs) {
    const a = anim['d' + d.n];
    const at = t;
    seqTimers.push(setTimeout(() => { a.target = 1; }, at));
    /* drawer 1 waits for its side tray to run out, be seen, and go back in */
    const extra = d.n === 1 ? anim.d1s.ms * 2 + anim.d1v.ms + 900
                : d.n === 2 ? anim.d2d.ms * 2 + 900
                : d.n === 3 ? anim.d3l.ms * 2 + anim.d3d.ms + anim.d3b.ms + 900
                : d.n === 5 ? anim.d5h.ms * 2 + 1200 : 0;
    if (d.n === 1) {
      seqTimers.push(setTimeout(() => { trayClosing = false; }, at));
      seqTimers.push(setTimeout(() => { trayClosing = true; }, at + a.ms + HOLD + extra - anim.d1s.ms));
    }
    if (d.n === 2) {
      seqTimers.push(setTimeout(() => { divClosing = false; }, at));
      seqTimers.push(setTimeout(() => { divClosing = true; }, at + a.ms + HOLD + extra - anim.d2d.ms));
    }
    if (d.n === 3) {
      seqTimers.push(setTimeout(() => { lidsClosing = false; }, at));      seqTimers.push(setTimeout(() => { lidsClosing = true; }, at + a.ms + HOLD + extra - anim.d3l.ms));
    }
    if (d.n === 5) {
      seqTimers.push(setTimeout(() => { shelfLowering = false; }, at));
      seqTimers.push(setTimeout(() => { shelfLowering = true; }, at + a.ms + HOLD + extra - anim.d5h.ms));
    }
    seqTimers.push(setTimeout(() => { a.target = 0; }, at + a.ms + HOLD + extra));
    t = at + a.ms * 2 + HOLD + extra + GAP;
  }
  if (showInsideFridge) {
    const a4 = anim.d4, at = t, dwell = a4.ms + HOLD + 600;
    seqTimers.push(setTimeout(() => { setFridgeSide(-1); a4.target = 1; }, at));
    seqTimers.push(setTimeout(() => { a4.target = 0; }, at + dwell));
    seqTimers.push(setTimeout(() => { setFridgeSide(fridgeUserDir); }, at + dwell + a4.ms));
    t = at + dwell + a4.ms + GAP;
  }
  /* each one opens and shuts once — hovering a front still peeks it afterwards */
  seqTimers.push(setTimeout(() => {
    setDrawers(0);
    seqRunning = false;   /* the run is over — the on-model button can come back */
    if (drawerBtn) drawerBtn.textContent = 'Open drawers';
  }, t));
}

if (drawerBtn) drawerBtn.addEventListener('click', () => {
  stopDemo();
  stopSequence();
  /* the demo has run and the drawers are back in — this press just clears the photos */
  if (bubblesPinned && !anyDrawerOpen()) {
    bubblesPinned = false;
    drawerBtn.textContent = 'Open drawers';
    labels();
    return;
  }
  bubblesPinned = false;
  if (anyDrawerOpen()) {
    setDrawers(0);
    drawerBtn.textContent = 'Open drawers';
  } else {
    anim.doors.target = 1;   /* doors open to reach the drawers */
    holdStill();
    runDrawerSequence();
    drawerBtn.textContent = 'Close drawers';
  }
  labels();
});

const doorsBtn = document.getElementById('doors-toggle');
let demoPoll = null, demoTimer = null;
function stopDemo() {
  stopSequence();
  if (demoPoll) { clearInterval(demoPoll); demoPoll = null; }
  if (demoTimer) { clearTimeout(demoTimer); demoTimer = null; }
}
/* opening the doors runs a short demonstration: bed down, drawer out, hold, stow */
function runDemo() {
  stopDemo();
  tableStowed = true;
  applyTableMode();
  anim.seats.target = 1;
  anim.bed.target = 0;
  fromTheta = null;
  stage.removeAttribute('autorotate');
  if (stage._controls) stage._controls.autoRotate = false;
  labels();
  demoPoll = setInterval(() => {
    if (anim.bed.p !== 0) return;
    clearInterval(demoPoll); demoPoll = null;
    demoTimer = setTimeout(() => {
      demoTimer = null;
      anim.bed.target = 1;
      anim.seats.target = 0;
      labels();
    }, 3000);
  }, 120);
}

if (doorsBtn) doorsBtn.addEventListener('click', () => {
  anim.doors.target = anim.doors.target ? 0 : 1;
  /* opening up is just opening up — it doesn't unfold the bed or recline the seats */
  if (anim.doors.target === 0) {
    stopDemo();
    stopSequence();
    bubblesPinned = false;
    setDrawers(0);   /* nothing can be left sticking out of a shut van */
    if (drawerBtn) drawerBtn.textContent = 'Open drawers';
  }
  labels();
});


const bedBtn = document.getElementById('bed-toggle');
const bedModeBtn = document.getElementById('bedmode-toggle');
function labels() {
  const db = document.getElementById('doors-toggle');
  if (db) db.textContent = anim.doors.target ? 'Close doors' : 'Open doors';
  if (bedBtn) bedBtn.textContent = anim.bed.target === 1 ? 'Unfold bed' : 'Fold bed';
  if (loungeBtn) loungeBtn.textContent = anim.recline.target ? 'Flat bed' : 'Lounger';
  for (const [id, k, nm] of [['recline-left-toggle', 'recL', 'left'], ['recline-right-toggle', 'recR', 'right']]) {
    const b = document.getElementById(id);
    if (!b) continue;
    b.textContent = (anim[k].target ? 'Lower ' : 'Raise ') + nm + ' backrest';
    b.style.display = (anim.recline.target === 1 && !b.dataset.boxHidden) ? '' : 'none';
  }
  {
    const b = document.getElementById('recline-angle-toggle');
    if (b) {
      const deg = a => Math.round(a[0] * 180 / Math.PI);
      b.textContent = 'Backrest ' + deg(REC_ANGLES[recIdx]) + '° → ' + deg(REC_ANGLES[(recIdx + 1) % REC_ANGLES.length]) + '°';
      b.style.display = (anim.recline.target === 1 && REC_ANGLES.length > 1 && !b.dataset.boxHidden) ? '' : 'none';
    }
  }
  if (hatchBtn) {
    const stowed = anim.bed.target === 1;   /* the panel stays in under the folded bed */
    hatchBtn.disabled = stowed;
    hatchBtn.textContent = hatchOut ? 'Refit hatch panel' : 'Remove hatch panel';
  }
  if (cushionsBtn) cushionsBtn.textContent = cushionsOut ? 'Refit cushions' : 'Remove all cushions';
  if (bedModeBtn) bedModeBtn.textContent = (pendingMode || bedMode) === 'fold' ? 'Bed: folding' : 'Bed: sliding';
}
if (bedModeBtn) bedModeBtn.addEventListener('click', () => {
  stopDemo();
  requestBedMode((pendingMode || bedMode) === 'fold' ? 'slide' : 'fold');
});
if (bedBtn) bedBtn.addEventListener('click', () => {
  stopDemo();
  if (anim.bed.target === 0) anim.recline.target = 0;   /* stowing — drop the backrest first */
  if (anim.bed.target === 1) tableStowed = false;   /* unfolding — the table stands under the bed */
  applyTableMode();
  anim.bed.target = anim.bed.target ? 0 : 1;
  applyTableMode();   /* again, now the new bed state is known — sets the table height */
  if (anim.bed.target === 0) { anim.seats.target = 1; anim.doors.target = 1; }
  else anim.seats.target = 0;   /* bed stowed — bring the seat backs up */
  labels();
});
if (bedFloat) bedFloat.addEventListener('click', () => {
  const target = bedFloat.textContent === 'Lounger' ? loungeBtn : bedBtn;
  if (target) target.click();
});
if (drawersFloat) drawersFloat.addEventListener('click', () => { if (drawerBtn) drawerBtn.click(); });
if (tableFloat) tableFloat.addEventListener('click', cycleTable);
labels();
uiReady = true;

/* ---- tweaks: three presets that reshape how the whole thing reads ---- */
const FINISHES = {
  birch:    { ply: 0xa9a7a2, ply_dark: 0x7d7b77, trim: 0x8a867e, trim_dk: 0x55524d, worktop: 0x2e2b28, accent: 0x1b1a19 },
  walnut:   { ply: 0x8a6a4e, ply_dark: 0x6b4f38, trim: 0x7d6a58, trim_dk: 0x4c3a2b, worktop: 0x3a2b20, accent: 0x241a12 },
  charcoal: { ply: 0x6f6e6c, ply_dark: 0x4c4b49, trim: 0x63625f, trim_dk: 0x3a3937, worktop: 0x1d1c1b, accent: 0x111110 },
};
const LIGHTS = {
  studio: { bg: '#ffffff', hemi: [0xffffff, 0xd8d2c4, 1.0], key: [0xffffff, 2.2], fill: [0xfff4e6, 0.5] },
  golden: { bg: '#e8cfa8', hemi: [0xffe3bd, 0xb08c5c, 0.85], key: [0xffc271, 2.6], fill: [0xffd9a8, 0.7] },
  dusk:   { bg: '#1e232b', hemi: [0x9fb6d6, 0x1a1d22, 0.55], key: [0xdfe8ff, 1.5], fill: [0xffb677, 0.9] },
};
const sceneLights = { hemi: null, key: null, fill: null };
if (stage._scene) {
  stage._scene.traverse(o => {
    if (o.isHemisphereLight) sceneLights.hemi = o;
    else if (o.isDirectionalLight) { if (o.castShadow) sceneLights.key = o; else sceneLights.fill = o; }
  });
}
const baseMs = {};
for (const [k, a] of Object.entries(anim)) baseMs[k] = a.ms;
const PACE = { brisk: 0.6, natural: 1, cinematic: 1.7 };
window.campalTweaks = {
  finish(key) {
    const f = FINISHES[key] || FINISHES.birch;
    for (const [m, hex] of Object.entries(f)) if (M[m]) M[m].color.setHex(hex);
    M.door.color.copy(M.trim.color);
    M.door_dk.color.copy(M.trim_dk.color);
    M.trim_clear.color.copy(M.trim.color);
  },
  light(key) {
    const l = LIGHTS[key] || LIGHTS.studio;
    stage.style.setProperty('--stage-bg', l.bg);
    if (sceneLights.hemi) { sceneLights.hemi.color.setHex(l.hemi[0]); sceneLights.hemi.groundColor.setHex(l.hemi[1]); sceneLights.hemi.intensity = l.hemi[2]; }
    if (sceneLights.key) { sceneLights.key.color.setHex(l.key[0]); sceneLights.key.intensity = l.key[1]; }
    if (sceneLights.fill) { sceneLights.fill.color.setHex(l.fill[0]); sceneLights.fill.intensity = l.fill[1]; }
    document.documentElement.classList.toggle('stage-dark', key === 'dusk');
  },
  pace(key) {
    const k = PACE[key] || 1;
    for (const [n, a] of Object.entries(anim)) a.ms = Math.round(baseMs[n] * k);
  },
};
/* the panel is clickable long before this module finishes building the model,
   so apply anything the user already picked, then tell it we are live */
window.dispatchEvent(new CustomEvent('campal-tweaks-ready'));

/* frame the camera on whatever is currently visible */
function reframe() {
  const cam = stage._camera, ctr = stage._controls;
  if (!cam || !ctr) return;
  const b = new THREE.Box3();
  model.updateWorldMatrix(true, true);
  model.traverse(o => {
    if (!o.isMesh && !o.isLine) return;
    let p = o, vis = true;
    while (p) { if (p.visible === false) { vis = false; break; } p = p.parent; }
    if (!vis) return;
    if (!o.geometry.boundingBox) o.geometry.computeBoundingBox();
    b.union(o.geometry.boundingBox.clone().applyMatrix4(o.matrixWorld));
  });
  if (b.isEmpty()) return;
  const s = b.getBoundingSphere(new THREE.Sphere());
  const vFit = s.radius / Math.tan(cam.fov * Math.PI / 360);
  const hFov = 2 * Math.atan(Math.tan(cam.fov * Math.PI / 360) * cam.aspect);
  const dist = Math.max(vFit, s.radius / Math.tan(hFov / 2)) * 1.08;
  const dir = cam.position.clone().sub(ctr.target).normalize();
  cam.position.copy(s.center).add(dir.multiplyScalar(dist));
  cam.near = Math.max(dist / 40, 0.05);
  cam.far = dist * 20;
  cam.updateProjectionMatrix();
  ctr.target.copy(s.center);
  ctr.update();
}

/* front row only: the middle and right-hand seats */
const FRONT_REMOVABLE = ['row1_2', 'row1_3'];
const frontSeatsBtn = document.getElementById('front-seats-out-toggle');
if (frontSeatsBtn) frontSeatsBtn.addEventListener('click', () => {
  const out = seatGroups[FRONT_REMOVABLE[0]].visible;
  for (const k of FRONT_REMOVABLE) { const g = seatGroups[k]; if (g) g.visible = !out; }
  refreshSeatButtons();
  poseMidLegs();
  bikes.visible = out;   /* bikes go in the space the seats leave */
  updateVisBox();
  reframe();
});

/* four seats out: the middle pair and the pair on the right */
const REMOVABLE = ['row1_2', 'row2_2', 'row1_3', 'row2_3'];
const seatsOutBtn = document.getElementById('seats-out-toggle');
if (seatsOutBtn) seatsOutBtn.addEventListener('click', () => {
  const out = seatGroups[REMOVABLE[0]].visible;   /* currently in → take them out */
  for (const k of REMOVABLE) { const g = seatGroups[k]; if (g) g.visible = !out; }
  refreshSeatButtons();
  poseMidLegs();
  anim.leaf.target = out ? 1 : 0;   /* half B lifts off for the two-seat layout */
  applyTableMode();
  updateVisBox();
  reframe();
});

/* every seat out: the whole load bay clear */
const ALL_REMOVABLE = Object.keys(seatGroups);
const allSeatsBtn = document.getElementById('all-seats-out-toggle');
if (allSeatsBtn) allSeatsBtn.addEventListener('click', () => {
  const out = ALL_REMOVABLE.some(k => seatGroups[k] && seatGroups[k].visible);
  for (const k of ALL_REMOVABLE) { const g = seatGroups[k]; if (g) g.visible = !out; }
  refreshSeatButtons();
  poseMidLegs();
  /* nothing left to sit on — set the table up in full, both halves on both posts,
     so it also carries the unfolded bed */
  anim.leaf.target = 0;
  tableStowed = !out;
  applyTableMode();
  updateVisBox();
  reframe();
});

/* one place decides all three seat controls, from what is actually fitted */
function refreshSeatButtons() {
  const vis = k => !!(seatGroups[k] && seatGroups[k].visible);
  const allOut = ALL_REMOVABLE.every(k => !vis(k));
  const fourOut = !allOut && !vis('row2_2');
  const frontOut = !allOut && !fourOut && !vis('row1_2');
  const set = (b, out, label) => {
    if (!b) return;
    b.textContent = (out ? 'Refit ' : 'Remove ') + label;
    b.style.display = vanSolid.visible ? '' : 'none';
  };
  set(seatsOutBtn, fourOut, '4 seats');
  set(frontSeatsBtn, frontOut, '2 seats');
  set(allSeatsBtn, allOut, 'all seats');
  if (!vanSolid.visible) return;
  /* whichever removal is in effect owns the pill — the others have nothing to act on */
  const hide = b => { if (b) b.style.display = 'none'; };
  if (allOut) { hide(seatsOutBtn); hide(frontSeatsBtn); }
  else if (fourOut) { hide(frontSeatsBtn); hide(allSeatsBtn); }
  else if (frontOut) { hide(seatsOutBtn); hide(allSeatsBtn); }
}

let tableStowed = false;   /* it starts set up, unfolded, in the seating bay */
var bsSwivel = 1, swivelBtn = null;   /* bedside arm: 0 left · 0.5 aft · 1 right */
const SWIVEL_NAMES = { 0: 'left', 0.5: 'to centre', 1: 'right' };
const SWIVEL_NEXT = { 1: 0.5, 0.5: 0, 0: 1 };
function applyTableMode() {
  /* the bed lands on the table — it can never be stowed while the bed is down.
     The lounger is the exception: only its own table goes away. */
  if (anim.bed.target === 0 && anim.recline.target !== 1) tableStowed = false;
  /* stowing wins in every mode — in the lounger it takes the bedside table away too */
  /* the pedestal stands at dining height with the bed folded, and drops to bed
     height when the bed comes down so the panels land on it */
  /* raise only once the bed has finished folding; drop as soon as it starts coming down */
  /* with the bed down the pink board rests on the table top. Folded, the leaves sit
     27 mm proud of the centre panel, so the pedestal drops that much further. The
     post winds down slowly rather than jumping. */
  const bedDown = !(anim.bed.target === 1 && anim.bed.p > 0.999);
  tblHTarget = bedDown ? TBL_H_BED - (leafMode ? FOLD_PROUD * foldP : 0) : TBL_H_HI;
  const step = 0.0016;   /* per frame, ~0.1 m/s */
  const prevH = tblH;
  tblH = Math.abs(tblHTarget - tblH) <= step ? tblHTarget : tblH + Math.sign(tblHTarget - tblH) * step;
  if (tblH !== prevH && typeof poseTable === 'function') poseTable();
  tableProps.position.y = tblH - TBL_H;   /* the cards and wine ride with the top */
  /* the bedside table is its own piece now — it comes out with the lounger
     whether or not the main table is standing. In the lounger, stowing takes
     only the lounger table away: the main table stays set up under the seat. */
  const lounger = anim.recline.target === 1;
  const mainStowed = tableStowed && !lounger;
  const bedside = lounger && !tableStowed;   /* the post drops through the hatch panel's bore, fitted or not */
  /* the bed and the lounger both land on the table, so it must be whole — both
     halves down, nothing lifted off or sent to the bedside pose */
  const full = anim.bed.target === 0 || lounger;
  setTableStowed(mainStowed, bedside);
  anim.bside.target = bedside ? 1 : 0;   /* the lounger table comes out with the lounger */
  /* both sockets get shown: it lands in the left one, then moves across to the right */
  anim.bspos.target = (bedside && anim.bside.p > 0.999) ? bsSwivel : 0;
  if (!swivelBtn) swivelBtn = document.getElementById('swivel-toggle');
  if (swivelBtn) {
    const show = bedside ? '' : 'none';
    if (swivelBtn.style.display !== show) swivelBtn.style.display = show;
    const l = 'Swing table ' + SWIVEL_NAMES[SWIVEL_NEXT[bsSwivel]];
    if (swivelBtn.textContent !== l) swivelBtn.textContent = l;
  }
  if (full) anim.leaf.target = 0;
  /* the leaves fold on their own button, and always as the table goes away */
  /* the bed comes down onto the table, so the leaves always fold up first */
  if (leafMode && anim.bed.target === 0 && !leafFolded) { leafFolded = true; leafStep = 1; }
  anim.fleaf.target = (leafMode && (mainStowed || leafFolded)) ? 1 : 0;

  /* the table is the van's, not the box's — it stays in the van, stowed or not */
  tableUnit.visible = true;
  if (tableBtn) tableBtn.textContent = lounger
    ? (tableStowed ? 'Set up lounger table' : 'Stow lounger table')
    : tableCycleLabel();
}
/* the table controls all step through the same cycle:
   set up · unfold · fold · stow */
let leafStep = 0;   /* 0 up, unfolded · 1 folded · 2 unfolded again · 3 away */
function tableCycleLabel() {
  if (!leafMode) return tableStowed ? 'Set up table' : 'Stow table';
  return ['Fold table', 'Unfold table', 'Stow table', 'Set up table'][leafStep];
}
function cycleTable() {
  if (!leafMode) { tableStowed = !tableStowed; leafFolded = false; }
  else {
    leafStep = (leafStep + 1) % 4;
    tableStowed = leafStep === 3;
    leafFolded = leafStep === 1 || leafStep === 3;
  }
  if (!tableStowed) anim.doors.target = 1;   /* nothing goes in through a shut door */
  applyTableMode();
  updateVisBox();
  refreshTableLabels();
}
{
  const sb = document.getElementById('swivel-toggle');
  if (sb) sb.addEventListener('click', () => { bsSwivel = SWIVEL_NEXT[bsSwivel]; applyTableMode(); });
}
function refreshTableLabels() {
  const l = tableCycleLabel();
  for (const b of [tableBtn, tableFloat]) if (b && b.textContent !== l) b.textContent = l;
  if (foldBtn) {
    const fl = tableStowed ? l : (leafFolded ? 'Unfold table' : 'Fold table');
    if (foldBtn.textContent !== fl) foldBtn.textContent = fl;
  }
}
const tableBtn = document.getElementById('table-toggle');
applyTableMode();   /* start stowed */
if (tableBtn) tableBtn.addEventListener('click', cycleTable);

foldBtn = document.getElementById('tablefold-toggle');
if (foldBtn) foldBtn.addEventListener('click', () => {
  if (tableStowed) { cycleTable(); return; }   /* nothing to fold until it is up */
  leafStep = leafFolded ? 2 : 1;
  leafFolded = leafStep === 1;
  applyTableMode();
  refreshTableLabels();
});
const tableTypeBtn = document.getElementById('tabletype-toggle');
function refreshTableType() {
  if (tableTypeBtn) tableTypeBtn.textContent = leafMode ? 'Tier-drop table' : 'Fold-out leaf table';
}
refreshTableType();
if (tableTypeBtn) tableTypeBtn.addEventListener('click', () => {
  leafMode = !leafMode;
  refreshTableType();
  applyTableMode();
  poseTable();
});

const vanBtn = document.getElementById('van-toggle');
const boxBtn = document.getElementById('box-toggle');
const boxRemoveBtn = document.getElementById('box-remove');
/* everything that is the camping box rather than the van */
const boxGroups = model.children.filter(c => c !== vanSolid);
const boxBase = boxGroups.map(g => g.position.clone());
let boxOut = true;   /* the van starts empty, box on the ground behind it */
boxRemoved = () => boxOut;

/* p = 0 the box is on the ground behind the van · 1 fitted in place.
   0–0.55 Julia and Mike carry it to the sill · 0.55–0.8 it slides in ·
   0.8–1 they set it down on the load floor. */
const CARRY_Y = 0.22, CARRY_Z = 1.30;
function setFit(p) {
  const sm = t => t * t * (3 - 2 * t);
  const a = clamp01(p / 0.55), b = clamp01((p - 0.55) / 0.25), c = clamp01((p - 0.8) / 0.2);
  fitP = p;
  const z = a < 1 ? 0.30 + (CARRY_Z - 0.30) * (1 - sm(a)) : 0.30 * (1 - sm(b));
  const y = CARRY_Y * (1 - sm(c));
  for (let i = 0; i < boxGroups.length; i++) {
    const g = boxGroups[i], base = boxBase[i];
    /* the table isn't part of the box — it stays put, and applyView owns it */
    if (g === tableUnit) continue;
    g.position.set(base.x, base.y + y, base.z + z);
    g.visible = p > 0.002;
  }
  /* the stowed lounger table is clipped to the box, so it rides in with it */
  fitOffY = y; fitOffZ = z;
  bsHideStowed = p <= 0.002;
  poseTable();
  /* they stay with the box for the whole move, including the set-down */
  lifters.visible = false;   /* the box moves on its own — no carriers shown */
  /* carrying it at the sides out on the tarmac, then in behind the tailgate,
     shoulder to shoulder, pushing it through the rear opening */
  const lx = (W / 2 + 0.26) + (0.44 - (W / 2 + 0.26)) * sm(a);
  const lz = BOXZ + D / 2 + z + 0.30;   /* hands overlap the box's rear edge */
  lifterL.position.set(-lx, 0, lz);
  lifterR.position.set(lx, 0, lz);
  /* arms follow the box down as it is lowered onto the load floor */
  const drop = y - CARRY_Y;
  mikeL.armsG.position.y = drop;
  juliaR.armsG.position.y = drop;
}
function applyView() {
  /* with the box out there is nothing to show the van against — keep the van.
     Clamped first, so the label and every downstream read see the final state. */
  if (boxOut && !vanSolid.visible) vanSolid.visible = true;
  if (vanBtn) {
    vanBtn.textContent = vanSolid.visible ? 'Hide van' : 'Show van';
    vanBtn.style.display = boxOut ? 'none' : '';   /* it cannot act while the box is out */
  }
  /* fitting is offered on the tailgate; the menu carries both states */
  if (boxBtn) boxBtn.style.display = boxOut ? '' : 'none';
  if (boxRemoveBtn) boxRemoveBtn.textContent = boxOut ? 'Fit myCampal' : 'Remove myCampal';
  if (pinHost) pinHost.style.display = boxOut ? 'none' : '';
  bsHideStowed = fitP <= 0.002;   /* it rides with the box: shown only once the box is */
  poseTable();   /* the stowed bedside table hides with the box out */
  /* box-only controls have nothing to act on once the box is out */
  for (const id of ['drawer-toggle', 'bed-toggle', 'bedmode-toggle', 'lounge-toggle',
                    'hatch-toggle', 'cushions-toggle', 'recline-left-toggle', 'recline-right-toggle', 'recline-angle-toggle']) {
    const b = document.getElementById(id);
    if (!b) continue;
    b.dataset.boxHidden = boxOut ? '1' : '';
    b.style.display = boxOut ? 'none' : '';
  }
  /* Julia & Mike stay hidden until the "jm" easter egg is typed */
  if (peopleBtn) peopleBtn.style.display = (boxOut || !peopleRevealed) ? 'none' : '';

  /* the set-up table belongs to the layout, not the van — keep it when the van goes */
  /* the table stays in the van when the box comes out, but only if it is set up —
     the board and socket plates go out with the box otherwise */
  tableUnit.visible = true;
  /* van-only controls have nothing to act on once the van is hidden */
  {
    const b = document.getElementById('doors-toggle');
    if (b) b.style.display = vanSolid.visible ? '' : 'none';
  }
  refreshSeatButtons();
  /* a group whose every button is hidden shouldn't leave an empty pill behind */
  for (const g of document.querySelectorAll('#legend .group')) {
    const any = [...g.children].some(c => getComputedStyle(c).display !== 'none');
    /* hide the labelled wrapper, so no heading is left behind */
    (g.closest('.ctl-group') || g).style.display = any ? '' : 'none';
  }
  updateVisBox();
  reframe();
}
applyView();
fitReady = true;
setFit(0);
function toggleBox() {
  boxOut = !boxOut;
  stopDemo(); stopSequence();
  let wait = 0;
  if (boxOut) {
    setDrawers(0);
    bubblesPinned = false;
    /* the box can't come out with the bed made up — fold it away first */
    if (anim.bed.target !== 1) {
      anim.bed.target = 1;
      anim.flaps.target = 1;
      anim.recline.target = 0;
      wait = Math.max(wait, anim.bed.ms * (1 - anim.bed.p));
    }
  }
  /* nothing goes in or out through a shut tailgate — open up first */
  if (anim.doors.target !== 1) {
    anim.doors.target = 1;
    wait = Math.max(wait, anim.doors.ms * (1 - anim.doors.p));
  }
  labels();
  applyView();
  if (wait > 0) seqTimers.push(setTimeout(() => { anim.fit.target = boxOut ? 0 : 1; }, wait));
  else anim.fit.target = boxOut ? 0 : 1;
  /* the table goes up with the box, and travels stowed when it comes out */
  seqTimers.push(setTimeout(() => {
    tableStowed = boxOut;
    applyTableMode();
    labels();
    applyView();
  }, wait + (boxOut ? 0 : anim.fit.ms)));
  /* once the box is out, shut the van up and stand the seat backs upright */
  if (boxOut) {
    seqTimers.push(setTimeout(() => {
      anim.doors.target = 0;
      anim.seats.target = 0;
      labels();
    }, wait + anim.fit.ms + 200));
  }
}
if (boxBtn) boxBtn.addEventListener('click', toggleBox);
if (boxRemoveBtn) boxRemoveBtn.addEventListener('click', toggleBox);
if (vanBtn) vanBtn.addEventListener('click', () => {
  vanSolid.visible = !vanSolid.visible;
  applyView();
});

/* ---- clicking a drawer front in the 3D view runs it out for three seconds ---- */
const hoverRay = new THREE.Raycaster(), hoverPt = new THREE.Vector2();
const frontMeshes = drawerRefs.map(d => {
  const m = d.hinge.getObjectByName(d.key + '_front');
  if (m) { m.userData.drawerN = d.n; m.userData.peekDir = 1; }
  return m;
}).filter(Boolean);
/* the fridge's cab-end front is a front in its own right: hovering it runs the
   drawer out into the van instead of off the tailgate */
/* the door across the hatch opening behaves the same way — clicking it opens it */
{
  const m = doorBoard.getObjectByName('mid_door_board');
  if (m) { m.userData.drawerN = 5; m.userData.peekDir = 1; frontMeshes.push(m); }
}
let hoverN = 0, hoverDir = 1, hoverTimer = null;
function closePeek() {
  clearTimeout(hoverTimer); hoverTimer = null;
  if (!hoverN) return;
  const n = hoverN;
  anim['d' + n].target = 0;
  hoverN = 0;
  /* once it is back in, hand the fridge side back to whatever the user picked */
  if (n === 4 && drawerRefs[3].dir !== fridgeUserDir) {
    setTimeout(() => { if (!hoverN && !seqRunning) setFridgeSide(fridgeUserDir); }, anim.d4.ms);
  }
  if (!anyDrawerOpen() && drawerBtn) drawerBtn.textContent = 'Open drawers';
}
function peekDrawer(n, dir) {
  if (seqRunning) return;   /* the run owns the drawers until it is done */
  if (n === hoverN && dir === hoverDir) return;
  closePeek();   /* moving off a front, or onto another one, shuts the last */
  hoverN = n; hoverDir = dir || 1;
  if (!n) return;
  stopDemo();
  stopSequence();
  bubblesPinned = false;
  if (n === 4) setFridgeSide(hoverDir);   /* after stopSequence, which resets the side */
  const a = anim['d' + n];
  a.target = 1;
  if (drawerBtn) drawerBtn.textContent = 'Close drawers';
  /* it stays out until its front is clicked again */
}
function pickFront(e) {
  const r = stage._renderer, cam = stage._camera;
  if (!r || !cam) return null;
  const b = r.domElement.getBoundingClientRect();
  hoverPt.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
  hoverRay.setFromCamera(hoverPt, cam);
  /* once the fridge is out on the floor, the fridge itself is clickable too */
  const fridgeOut = anim.fridge.target === 1 && anim.fridge.p === 1;
  return hoverRay.intersectObjects(fridgeOut ? frontMeshes.concat(fridgeClickMeshes) : frontMeshes, false)[0] || null;
}
const fridgeClickMeshes = [];
fridgeUnit.traverse(o => { if (o.isMesh && !fridgeCans.includes(o)) { o.userData.fridgeRefit = true; fridgeClickMeshes.push(o); } });
function onStageMove(e) {
  const r = stage._renderer;
  if (!r) return;
  r.domElement.style.cursor = pickFront(e) ? 'pointer' : '';
}
/* clicking a front runs it out; clicking it again shuts it */
function onStageClick(e) {
  const hit = pickFront(e);
  if (!hit) return;
  if (hit.object.userData.fridgeRefit) {   /* clicking the fridge on the floor puts it back */
    anim.fridge.target = 0; refreshFridgeBtn(); return;
  }
  const n = hit.object.userData.drawerN;
  if (!n) return;
  const dir = hit.object.userData.peekDir || 1;
  if (n === hoverN && dir === hoverDir) { closePeek(); return; }
  peekDrawer(n, dir);
}
function bindStageHover() {
  const r = stage._renderer;
  if (!r) { setTimeout(bindStageHover, 200); return; }
  r.domElement.addEventListener('pointermove', onStageMove);
  r.domElement.addEventListener('click', onStageClick);
  r.domElement.addEventListener('pointerleave', () => { r.domElement.style.cursor = ''; });
}
bindStageHover();
