import * as THREE from 'three';

const stage = document.querySelector('three-d-stage');
const { } = await stage.ready;

const M = {
  ply:      new THREE.MeshStandardMaterial({ color: 0xa9a7a2, roughness: 0.78, metalness: 0.02 }),
  ply_dark: new THREE.MeshStandardMaterial({ color: 0x7d7b77, roughness: 0.8,  metalness: 0.02 }),
  accent:   new THREE.MeshStandardMaterial({ color: 0x1b1a19, roughness: 0.5, metalness: 0.06 }),
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
let tblH = TBL_H_HI;
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
const tPost = tube('table_post', 0.030, POST_LEN, 0, 0, 0, M.steel, tableParts, 'y');
const tFoot = roundPlate('table_foot_plate', 0.16, 0.16, 0.012, 0.045, M.steel, tableParts);
const tPost2 = tube('table_post_2', 0.030, POST_LEN, 0, 0, 0, M.steel, tableParts, 'y');
const tFoot2 = roundPlate('table_foot_plate_2', 0.16, 0.16, 0.012, 0.045, M.steel, tableParts);
/* the posts lift out; the plates they socket into stay put — two screwed to the
   floor board, a third fixed in the middle bay for the bedside pose */
const bsFoot = roundPlate('table_foot_plate_bedside', 0.16, 0.16, 0.012, 0.045, M.steel, tableParts);

/* poses: set up on its board, stowed behind the seats, or — for half B alone —
   up on the wheel-arch top as a bedside table when the lounger is out */
const STOW_Z = -2.26 - TBLZ, POST_X = -0.75 - TBLX, POST_Z = -2.14 - TBLZ;
const BEDSIDE_TOP_Y = 0.88;
const BS_POST_X = 0 - TBLX, BS_Z = (POST_HOLE_Z + BOXZ) - TBLZ;   /* centred in the middle bay, aft of the fore face so the foot plate is fully within the base */
const BS_BASE_Y = 0.018;   /* foot plate stands on the carcass floor inside the gap */
const BS_LEN = BEDSIDE_TOP_Y - 0.026 - BS_BASE_Y;
const lerp = (a, b, t) => a + (b - a) * t;

/* the bedside table is its own piece — a small top and a single post that stow
   flat against the aft face of the camping box until the lounger is set up */
const bsTable = new THREE.Group(); bsTable.name = 'bedside_table'; tableParts.add(bsTable);
roundPlate('bedside_top', 0.42, 0.34, 0.018, 0.06, M.ply, bsTable);
box('bedside_top_plate', 0.14, 0.012, 0.14, 0, -0.015, 0, M.steel, bsTable);
const bsPost = tube('bedside_post', 0.026, BS_LEN, 0, 0, 0, M.steel, tableParts, 'y');
/* stowed: clipped flat to the cab-end face of the box, on the drawer-bay side,
   portrait so it stays inside the bay width; the leg stands beside it, collapsed */
const FORE_FACE = BOXZ - D / 2;
const BSS_X = 0.410 - TBLX, BSS_Y = 0.290, BSS_Z = (FORE_FACE - 0.011) - TBLZ;
const BSP_STOW_X = 0.214 - TBLX, BSP_STOW_Y = 0.285, BSP_STOW_Z = (FORE_FACE - 0.030) - TBLZ;
const BSP_STOW_LEN = 0.450;

let tblStow = false, tblBedside = false, remP = 0, bsP = 0;
var bsHideStowed = true;   /* the van starts empty, so the stowed bedside table is hidden */
var fitOffY = 0, fitOffZ = 0;   /* the box's own travel, so the stowed table rides with it */
function poseTable() {
  tableBoard.visible = true;
  tFoot.visible = tFoot2.visible = true;   /* screwed to the board */
  const away = tblStow ? 1 : 0;
  /* --- half A: stays on the board unless the whole table is put away --- */
  const a = away;
  halfA.g.rotation.x = -Math.PI / 2 * a;
  halfA.g.position.set(lerp(TOPDX - HALF_W, TOPDX - HALF_W + 0.02, a),
    lerp(tblH, 0.30, a) + 0.09 * Math.sin(Math.PI * a), lerp(0, STOW_Z, a));
  halfA.plate.visible = a < 0.5;
  const pLen = tblH - 0.05, pScale = pLen / POST_LEN;
  tPost.scale.y = pScale;
  tPost.position.set(lerp(TOPDX - LEGDX, POST_X, a), lerp(0.036 + pLen / 2, 0.32, a), lerp(0, POST_Z, a));
  /* --- half B: fitted, or lifted out and stowed --- */
  const s = Math.max(away, remP);
  let bx, by, bz, brx, px, py, pz, psx, psy;
  {
    bx = lerp(TOPDX, TOPDX + 0.02, s);
    by = lerp(tblH, 0.30, s) + 0.09 * Math.sin(Math.PI * s);
    bz = lerp(0, STOW_Z, s); brx = -Math.PI / 2 * s;
    px = lerp(TOPDX + LEGDX, POST_X + 0.09, s);
    py = lerp(0.036 + pLen / 2, 0.32, s);
    pz = lerp(0, POST_Z, s);
    psx = 1; psy = pScale;
  }
  halfB.g.rotation.x = brx; halfB.g.position.set(bx, by, bz);
  halfB.plate.visible = brx > -0.1;
  tPost2.scale.set(psx, psy, psx); tPost2.position.set(px, py, pz);
  /* --- the bedside table: its own top and post, off the box's aft face --- */
  const b2 = bsP;
  bsTable.rotation.x = -Math.PI / 2 * (1 - b2);
  bsTable.rotation.y = Math.PI / 2 * (1 - b2);   /* portrait while clipped to the drawer front */
  /* the stowed table is clipped to the box, so it travels in with it */
  const ride = 1 - b2;
  bsTable.position.set(lerp(BSS_X, BS_POST_X, b2),
    lerp(BSS_Y, BEDSIDE_TOP_Y, b2) + 0.14 * Math.sin(Math.PI * b2) + fitOffY * ride,
    lerp(BSS_Z, BS_Z, b2) + fitOffZ * ride);
  bsPost.rotation.z = 0;   /* the leg stows upright beside the top, collapsed */
  bsPost.scale.y = lerp(BSP_STOW_LEN / BS_LEN, 1, b2);
  bsPost.position.set(lerp(BSP_STOW_X, BS_POST_X, b2),
    lerp(BSP_STOW_Y, BS_BASE_Y + 0.012 + BS_LEN / 2, b2) + fitOffY * ride,
    lerp(BSP_STOW_Z, BS_Z, b2) + fitOffZ * ride);
  bsFoot.visible = b2 > 0.02;
  /* stowed on the box's cab-end face — not shown at all while the box is out of the van.
     Read from a hoisted flag, so poseTable never reaches forward to a later binding. */
  const hideBs = b2 < 0.02 && bsHideStowed;
  bsTable.visible = !hideBs;
  bsPost.visible = !hideBs;
}
function setTableStowed(stowed, bedside) { tblStow = stowed; tblBedside = bedside; poseTable(); }
function setHalfBOut(p) { remP = p; poseTable(); }        /* lifted off for the two-seat layout */
function setBedsideMove(p) { bsP = p; poseTable(); }      /* half B travelling to the bedside pose */
tFoot.position.set(TOPDX - LEGDX, 0.036, 0);
tFoot2.position.set(TOPDX + LEGDX, 0.036, 0);

setTableStowed(false);

/* ---- six fixed seats, two rows of three, facing the cab ---- */
const ROWS = [['row2', -0.79], ['row1', -1.65]];   /* moved back to meet the shallower box */
const seatPivots = [];
const seatGroups = {};
const SEATX = [-0.46, 0, 0.46];

function seat(tag, x, z, reversed) {
  const n = 'seat_' + tag;
  const gs = new THREE.Group(); gs.name = n; gs.position.set(x, 0, z); vanSolid.add(gs);
  seatGroups[tag] = gs;
  if (reversed) gs.rotation.y = Math.PI;

  box(n + '_frame', 0.42, 0.40, 0.46, 0, 0.20, 0, M.trim_dk, gs);
  box(n + '_squab', 0.46, 0.10, 0.50, 0, 0.45, 0, M.seat, gs);
  const ps = new THREE.Group(); ps.name = n + '_back_pivot'; ps.position.set(0, 0.52, 0.24); gs.add(ps);   /* folded, the back tops out at 570 mm */
  box(n + '_back', 0.46, 0.50, 0.10, 0, 0.25, 0, M.seat, ps);   /* upright: 1040 mm overall */
  box(n + '_headrest', 0.24, 0.15, 0.10, 0, 0.45, -0.04, M.seat, ps);
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
/* the bedside socket plate is screwed to the camping box's own floor, inside the
   middle bay, so it travels with the box rather than the van */
carcass.add(bsFoot);
bsFoot.position.set(0, T + 0.006, POST_HOLE_Z);
/* hand-sized carry slots, two high two low at each end of both side panels */
const SLOT_L = 0.12, SLOT_H = 0.034, SLOT_INSET = 0.055;
function sidePanel(name, sx) {
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
  const geo = new THREE.ExtrudeGeometry(sh, { depth: T, bevelEnabled: false });
  geo.rotateY(Math.PI / 2); geo.translate(-T / 2, 0, 0);
  const m = new THREE.Mesh(geo, M.ply); m.name = name; m.castShadow = m.receiveShadow = true;
  m.position.set(sx * (W / 2 - T / 2), T + (H - T) / 2, 0);
  carcass.add(m);
}
sidePanel('carcass_side_left', -1);
sidePanel('carcass_side_right', 1);
box('carcass_divider_left',  T, H - T, D, -divX, T + (H - T) / 2, 0, M.ply, carcass);
box('carcass_divider_right', T, H - T, D,  divX, T + (H - T) / 2, 0, M.ply, carcass);
/* the van-side panel closes the two drawer bays only — the middle bay is open
   front and back so gear can pass through from the cab side */
for (const [side, sx] of [['left', -1], ['right', 1]]) {
  box('carcass_front_panel_' + side, bayW, H - T, T, sx * (bayW + T), T + (H - T) / 2, -D / 2 + T / 2, M.ply_dark, carcass);
}
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
  const hole = new THREE.Path();
  hole.absarc(0, -POST_HOLE_Z, POST_HOLE_R, 0, Math.PI * 2, true);
  sh.holes.push(hole);
  const geo = new THREE.ExtrudeGeometry(sh, { depth: T, bevelEnabled: false });
  geo.rotateX(-Math.PI / 2); geo.translate(0, -T / 2, 0);
  const p = new THREE.Mesh(geo, M.ply_dark); p.name = 'top_panel'; topPanel.add(p);
  const lin = new THREE.Mesh(new THREE.CylinderGeometry(POST_HOLE_R, POST_HOLE_R, T + 0.004, 24, 1, true), M.steel);
  lin.name = 'top_panel_post_liner'; lin.position.set(0, 0, POST_HOLE_Z); topPanel.add(lin);
}
box('top_panel_finger_slot', 0.09, 0.008, 0.022, 0, T / 2 - 0.003, D / 2 - 0.07, M.stove, topPanel);
/* the rear rail is cut at the middle bay so the hatch opening is clear through */
for (const [side, sx] of [['left', -1], ['right', 1]]) {
  box('carcass_rear_rail_' + side, DECK_W, 0.05, T, sx * (W + bayW) / 4, H - T - 0.025, D / 2 - T / 2, M.ply_dark, carcass);
}
const hatchRail = box('carcass_rear_rail_middle', bayW, 0.05, T, 0, H - T - 0.025, D / 2 - T / 2, M.ply_dark, carcass);
/* cross bar on the cab-end face, standing proud of the carcass — the unfolded
   bed panels land on it once they are run out over the drawers */
/* notched at the two leg positions so the folded legs can stand down through it */
{
  const bz = -D / 2 - 0.03 + T, legX = (W - 0.02) / 2 - 0.055, notch = 0.035;
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
   the top hangs portrait over the right bay and the leg stands beside it,
   both kept clear of the open middle bay */
{
  const faceZ = -D / 2, panelOut = faceZ - 0.022;
  for (const [lvl, cy] of [['upper', 0.455], ['lower', 0.125]]) {
    for (const [edge, ex] of [['outer', 0.580], ['inner', 0.240]]) {
      box('table_stow_clip_' + lvl + '_' + edge, 0.026, 0.030, 0.022,
        ex, cy, faceZ - 0.011, M.steel, carcass);
      box('table_stow_catch_' + lvl + '_' + edge, 0.034, 0.018, 0.008,
        ex, cy, panelOut - 0.004, M.latch, carcass);
    }
  }
  /* cradle clips for the collapsed leg, just inboard of the top */
  for (const [lvl, cy] of [['upper', 0.455], ['lower', 0.125]]) {
    box('table_stow_leg_clip_' + lvl, 0.022, 0.024, 0.058,
      0.214, cy, faceZ - 0.029, M.steel, carcass);
    box('table_stow_leg_catch_' + lvl, 0.060, 0.016, 0.008,
      0.214, cy, faceZ - 0.062, M.latch, carcass);
  }
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

function drawer(name, cx, out, kitchen) {
  const [baseY, dh] = BAYS[name];
  const g = new THREE.Group(); g.name = name;
  g.position.set(cx, baseY, out);
  const y = dh / 2;
  box(name + '_base', dW, T, dD, 0, T / 2, 0, M.ply, g);
  const crate = name === 'drawer_left_lower';
  if (crate) {
    for (const sx of [-1, 1]) {
      const side2 = sx < 0 ? 'left' : 'right';
      const p = pillPlate(name + '_side_' + side2, dD, dh, T, 0.13, 0.05, -0.06, dh - 0.055, M.ply, g);
      p.rotation.y = Math.PI / 2;
      p.position.set(sx < 0 ? -dW / 2 : dW / 2 - T, 0, 0);
    }
    const bk = pillPlate(name + '_back', dW - 2 * T, dh, T, 0.16, 0.05, 0, dh - 0.055, M.ply, g);
    bk.position.set(0, 0, -dD / 2);
  } else {
    box(name + '_side_left',  T, dh, dD, -dW / 2 + T / 2, y, 0, M.ply, g);
    box(name + '_side_right', T, dh, dD,  dW / 2 - T / 2, y, 0, M.ply, g);
    box(name + '_back', dW - 2 * T, dh, T, 0, y, -dD / 2 + T / 2, M.ply, g);
  }
  const fh = dh + 0.02;
  const frontPivot = new THREE.Group(); frontPivot.name = name + '_front_hinge';
  frontPivot.position.set(0, fh, D / 2 - 0.011); g.add(frontPivot);   /* hinged along its top edge; shut, the face sits flush with the carcass edge */
  box(name + '_front', bayW - 0.012, fh, 0.022, 0, -fh / 2, 0, M.accent, frontPivot);
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
    logo.position.set(0, -fh / 2, 0.0125);
    frontPivot.add(logo);
  }
  /* --- drawer 4: slide-out compressor fridge with a top-opening lid --- */
  let fridgeLid = null;
  if (name === 'drawer_right_lower') {
    const fw = dW - 2 * T - 0.006, fd = 0.48, fhh = 0.33;
    /* sits at the tailgate end so the whole fridge — and its lid — clears the carcass when out */
    const fz = dD / 2 - fd / 2 - 0.005;
    box(name + '_fridge_body', fw, fhh, fd, 0, T + fhh / 2, fz, M.trim, g);
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
  }
  model.add(g);
  if (name === 'drawer_right_upper') {
    /* flat pull-out tray with a collapsible washing-up bowl set into it */
    const bz = 0.06, ribs = [[0.30, 0.24, 0.018, M.trim], [0.275, 0.215, 0.024, M.trim_dk],
                             [0.245, 0.185, 0.024, M.trim_dk], [0.215, 0.155, 0.020, M.trim_dk]];
    let y = dh - 0.008;
    for (let i = 0; i < ribs.length; i++) {
      const [w2, d2, h2, mat] = ribs[i];
      y -= h2 / 2 + (i ? 0.002 : 0);
      box(name + '_bowl_rib_' + (i + 1), w2, h2, d2, 0, y, bz, mat, g);
      y -= h2 / 2;
    }
    box(name + '_bowl_base', 0.20, 0.014, 0.14, 0, y - 0.007, bz, M.trim_dk, g);
    box(name + '_tray_stop', dW - 2 * T, 0.02, T, 0, dh - 0.01, -dD / 2 + T, M.ply_dark, g);
    return { g, frontPivot, fridgeLid };
  }
  if (crate) return { g, frontPivot, fridgeLid };
  if (!kitchen) {
    box(name + '_tray_divider', T * 0.7, dh - 0.06, dD - 2 * T, -0.06, (dh - 0.06) / 2 + T, 0, M.ply_dark, g);
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

  /* --- open storage behind the drawer front --- */
  box(name + '_tray_divider', T * 0.7, 0.11, 0.28, -0.05, 0.075, 0.16, M.ply_dark, g);
  tube(name + '_rolled_mat', 0.040, 0.20, 0.05, 0.058, 0.24, M.stove, g);
  box(name + '_gas_canister', 0.080, 0.080, 0.080, -0.095, 0.058, 0.10, M.steel, g);
  return { g, frontPivot, shield };
}
const left = drawer('drawer_left_upper', -(bayW + T), 0, true);
const leftDrawer = left.g, leftShield = left.shield;
const d2 = drawer('drawer_left_lower', -(bayW + T), 0);
const d3 = drawer('drawer_right_upper', (bayW + T), 0);
const d4 = drawer('drawer_right_lower', (bayW + T), 0);
const drawerRefs = [
  { n: 1, g: leftDrawer, key: 'drawer_left_upper', hinge: left.frontPivot, tabletop: true },
  { n: 2, g: d2.g, key: 'drawer_left_lower', hinge: d2.frontPivot },
  { n: 3, g: d3.g, key: 'drawer_right_upper', hinge: d3.frontPivot },
  { n: 4, g: d4.g, key: 'drawer_right_lower', hinge: d4.frontPivot, lid: d4.fridgeLid },
];

/* ---- removable door across the middle bay: lifts out and goes back in as a shelf ---- */
const midDoor = new THREE.Group(); midDoor.name = 'mid_door'; model.add(midDoor);
const mdW = bayW - 0.012, mdH = H - T - 0.012;
const doorBoard = new THREE.Group(); doorBoard.name = 'mid_door_panel'; midDoor.add(doorBoard);
box('mid_door_board', mdW, mdH, T, 0, 0, 0, M.accent, doorBoard);
box('mid_door_face', mdW - 0.05, mdH - 0.05, 0.004, 0, 0, T / 2 + 0.002, M.accent, doorBoard);
for (const sy of [-1, 1]) {
  box('mid_door_cleat_' + (sy < 0 ? 'lower' : 'upper'), mdW - 0.06, 0.022, 0.020, 0, sy * (mdH / 2 - 0.05), -T / 2 - 0.010, M.trim_dk, doorBoard);
}
tube('mid_door_pull', 0.010, 0.14, 0, 0, T / 2 + 0.012, M.steel, doorBoard, 'x');
/* the middle-bay door gets a pin too, in the same style, keyed to its own anim */
const doorPinRef = { n: 5, g: doorBoard, local: [0, 0, T / 2 + 0.02] };

const DOOR_Y = T + (H - T) / 2, DOOR_Z = D / 2 - T / 2;
const DOOR_OUT = DOOR_Z + 0.42, SHELF_Z = D / 2 + 0.7 * mdH - mdH / 2;   /* shelf stands 70% proud of the unit */
/* p = 0 shut across the gap · 1 back in as a shelf */
function setDoor(p) {
  const a = Math.min(1, Math.max(0, p / 0.4));
  const b = Math.min(1, Math.max(0, (p - 0.4) / 0.3));
  const c = Math.min(1, Math.max(0, (p - 0.7) / 0.3));
  const sm = t => t * t * (3 - 2 * t);
  doorBoard.rotation.x = -Math.PI / 2 * sm(b);
  const z = c > 0 ? DOOR_OUT + (SHELF_Z - DOOR_OUT) * sm(c) : DOOR_Z + (DOOR_OUT - DOOR_Z) * sm(a);
  doorBoard.position.set(0, DOOR_Y, z);
}
setDoor(0);

/* runners, extended with the drawers */
const runnersByDrawer = {};
for (const [side, sx] of [['left', -1], ['right', 1]]) {
  const outer = sx * (W / 2 - T - 0.012);
  const inner = sx * (divX + T / 2 + 0.012);   /* inside its own bay, not in the pass-through */
  for (const lvl of ['lower', 'upper']) {
    const out = 0;
    const [baseY, dh] = BAYS['drawer_' + side + '_' + lvl];
    const y = baseY + dh * 0.45;
    const a = box('runner_' + side + '_' + lvl + '_outer', 0.024, 0.045, D + out, outer, y, out / 2, M.steel);
    const b = box('runner_' + side + '_' + lvl + '_inner', 0.024, 0.045, D + out, inner, y, out / 2, M.steel);
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
  bed_panel_mid:     [0x7f9e7a, 0x688a63],
  bed_panel_front:   [0x8794ad, 0x6e7d99],
  bed_panel_overlay: [0xb0857f, 0x9a6c66],
};
for (const k in PANEL_MATS) {
  PANEL_MATS[k] = PANEL_MATS[k].map(c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.82, metalness: 0.02 }));
}
function panel(name, len, zCenter, y, parent, plain) {
  const g = new THREE.Group(); g.name = name;
  const pc = PANEL_MATS[name], pm = pc ? pc[0] : M.ply, pmd = pc ? pc[1] : M.ply_dark;
  const bedW = (name === 'bed_panel_rear' || name === 'bed_panel_mid' || name === 'bed_panel_front') ? BED_W + REAR_OVERHANG * 2 : BED_W;
  if (LENGTHWISE.includes(name)) {
    /* only the outer rail on each panel — the facing edges interleave, so a rail
       there would foul the other panel's fingers */
    const isRear = name === 'bed_panel_rear', sz = isRear ? 1 : -1;
    const rz = zCenter + sz * (len / 2 - 0.025), rn = name + '_rail_' + (isRear ? 'aft' : 'fore');
    /* cut at the middle bay so nothing crosses the hatch opening */
    const rW = (bedW - bayW) / 2;
    for (const rx of [-1, 1]) {
      box(rn + (rx < 0 ? '_left' : '_right'), rW, pT, 0.05, rx * (bayW + rW) / 2, y, rz, pm, g);
    }
    const rMid = box(rn + '_middle', bayW - 0.006, pT, 0.05, 0, y, rz, pm, g);
    (isRear ? hatchSlats : stackSlats).push(rMid);
    const sideW = (bedW - 0.02 - bayW) / 2;   /* kept for the rail cuts above */
    /* fingers reach past the panel's own edge so the two sets overlap when nested */
    const sd = len - 0.05 + 0.09, sz0 = zCenter - sz * 0.045;
    /* a true finger joint: the panel width is split into an odd number of equal fingers,
       so green takes 1,3,5… (a full slat flush at each outer edge) and orange takes 2,4,6…
       Every finger is the same width and the pitch is constant right across the panel. */
    const K = 19, fw = bedW / K, sw = fw - 0.008;
    for (let k = isRear ? 1 : 0; k < K; k += 2) {
      const x = -bedW / 2 + fw * (k + 0.5);
      const inBay = Math.abs(x) - fw / 2 < bayW / 2;   /* any slat touching the bay travels with the hatch */
      const sfx = Math.abs(x) < 1e-6 ? 'c' : (x < 0 ? 'l' : 'r');
      const s = box(name + '_slat_' + (inBay ? 'bay_' : 'side_') + (k + 1) + '_' + sfx,
                    sw, pT, sd, x, y, sz0, pmd, g);
      if (inBay) (isRear ? hatchSlats : stackSlats).push(s);
    }
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
  }
  /* fold-out wings on the green and blue panels, taking the bed out to the van walls */
  for (const sx of (name === 'bed_panel_mid' || name === 'bed_panel_front') ? [-1, 1] : []) {
    const side = sx < 0 ? 'left' : 'right';
    const pv = new THREE.Group(); pv.name = name + '_flap_hinge_' + side;
    pv.position.set(sx * bedW / 2, y, zCenter); g.add(pv);
    const soft = name === 'bed_panel_front';   /* the pair nearest the cab */
    if (soft) {
      const fl = softPlate(name + '_flap_' + side, FLAP_W, len - 0.03, pT, 0.09, pm, pv);
      fl.position.set(sx * FLAP_W / 2, 0, 0); fl.scale.x = sx;
    } else {
      box(name + '_flap_' + side, FLAP_W, pT, len - 0.03, sx * FLAP_W / 2, 0, 0, pm, pv);
    }
    /* infill cushion out to the van wall — posed from setFold so it never
       sweeps through the mattress when the flap folds up */
    let sc;
    if (soft) {
      sc = softPlate('tmp', FLAP_W - 0.008, len - 0.04, cT, 0.086,
        [M.cushion_face, M.cushion_edge], new THREE.Group());
      sc.scale.x = sx;
    } else {
      sc = new THREE.Mesh(
        new THREE.BoxGeometry(FLAP_W - 0.008, cT, len - 0.04),
        [M.cushion_edge, M.cushion_edge, M.cushion_face, M.cushion_face, M.cushion_edge, M.cushion_edge]);
    }
    sc.name = name.replace('bed_panel', 'side_cushion') + '_' + side;
    sc.position.set(sx * (bedW / 2 + FLAP_W / 2), y + pT / 2 + cT / 2 + 0.002, zCenter);
    g.add(sc);
    sideCushions.push({ m: sc, sx, y: y + pT / 2 + cT / 2 + 0.002, z: zCenter, dir: name === 'bed_panel_front' ? -1 : 1 });
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
tube('hinge_mid_front', 0.011, bedW - 0.06, 0, 0, 0, M.steel, pivotB);
const frontPivot = new THREE.Group(); frontPivot.name = 'bed_front_recline';
frontPivot.position.set(0, 0, 0); pivotB.add(frontPivot);
panel('bed_panel_front', pL, -pL / 2, 0, frontPivot);
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

/* prop legs under the backrest: swung down they stand on the panel below,
   folded they lie flat against the underside */
const BR_LEG_Z = -0.34, BR_LEG_L = 0.44;
const brLegs = [];
for (const sx of [-1, 1]) {
  const pv = new THREE.Group();
  pv.name = 'lounger_prop_hinge_' + (sx < 0 ? 'left' : 'right');
  pv.position.set(sx * (bedW / 2 - 0.12), -pT / 2, BR_LEG_Z);
  frontPivot.add(pv);
  box('lounger_prop_' + (sx < 0 ? 'left' : 'right'), 0.036, BR_LEG_L, 0.036, 0, -BR_LEG_L / 2, 0, M.ply_dark, pv);
  box('lounger_prop_foot_' + (sx < 0 ? 'left' : 'right'), 0.06, 0.012, 0.07, 0, -BR_LEG_L, 0, M.trim_dk, pv);
  brLegs.push(pv);
}

/* ---- the two of us, lying on the lounger: schematic figures, heads on the raised backrest.
       The upper body rides the reclining panel, the legs stay on the flat panels. ---- */
const MSURF = pT / 2 + cT + 0.012;
const occupants = [];
function person(tag, x, kit) {
  const up = new THREE.Group(); up.name = 'person_' + tag + '_upper'; frontPivot.add(up);
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
const MID_LEG_L = H - 0.007;   /* panel underside down to the load floor, less the foot block */
const legs2 = new THREE.Group(); legs2.name = 'bed_legs_mid';
legs2.position.set(0, -pT / 2, -0.12); pivotB.add(legs2);   /* kept as the stow-time group */
const midLegs = [];
for (const sx of [-1, 1]) {
  const s = sx < 0 ? 'left' : 'right';
  const pv = new THREE.Group(); pv.name = 'bed_leg_mid_' + s + '_hinge';
  pv.position.set(sx * (bedW / 2 - 0.055), -pT / 2, -MID_L + 0.009);   /* hard on the fore edge — folded, the blade passes fore of the bed support bar */
  pivotA.add(pv);
  box('bed_leg_mid_' + s, 0.05, MID_LEG_L, 0.018, 0, -MID_LEG_L / 2, 0, M.ply_dark, pv);
  box('bed_leg_mid_' + s + '_foot', 0.09, 0.014, 0.07, 0, -MID_LEG_L, 0, M.trim_dk, pv);
  /* short gusset, kept in line with the blade so both pass through the bar's notch */
  box('bed_leg_mid_' + s + '_brace', 0.05, 0.05, 0.018, 0, -0.09, 0, M.ply_dark, pv);
  midLegs.push({ pv, s, seat: sx < 0 ? 'row2_1' : 'row2_3' });
}

/* the cushions are loose: they lift off before the wood folds and go back on top after.
   The aft section is split into three short pads that stack side by side on the top layer. */
const CUSHION_Y = bedY + pT / 2 + cT / 2 + 0.002;
const STACK_BASE = bedY + LIFT * 2 + pT / 2 + 0.004;
const RAISE = 0.36;
/* the middle panel and its folded cab panel slide back in under the aft panel */
const STOW_DY = 0;   /* stowed, the panels mesh at deck level and sit on top of the box */
const FINGER_OVER = 0.065;   /* how far the interleaving fingers reach past their own panel edge */
const REAR_W = (bedW - 0.02) / 3;
/* the pad joint sits on the table post, so it drops between the aft and middle pads */
const SPLIT_Z = POST_HOLE_Z, POST_GAP = 0.03;   /* with the geometry's own 30 mm inset this clears the 60 mm post */
const AFT_END = D / 2;   /* pads run right out to the box's aft face */
/* only the centre pad has to clear the table post — the two outer pads run the
   full length forward to meet the middle pad, so there is no gap fore to aft.
   The +0.03 restores what the pad geometry insets at each end. */
const SIDE_LEN = AFT_END - (SPLIT_Z - POST_GAP / 2) + 0.03;
const REAR_LEN = SIDE_LEN;   /* the hatch pad runs the same length — the bored hole clears the post */
const MID_LEN = (SPLIT_Z - POST_GAP / 2) - (hingeA - pL);
const SIDE_Z = AFT_END - (SIDE_LEN - 0.03) / 2, REAR_Z = AFT_END - (REAR_LEN - 0.03) / 2;
const MID_Z = SPLIT_Z - POST_GAP / 2 - MID_LEN / 2;
/* stacked, the pads line up on their aft edges so nothing cantilevers past the drawer fronts */
const zs = len => hingeA + pL - len / 2;
const cushionSpec = [
  { tag: 'rear_a', layer: 0, w: REAR_W, x: -REAR_W, len: SIDE_LEN, z: SIDE_Z, zStack: zs(SIDE_LEN) },
  { tag: 'rear_b', layer: 0, w: REAR_W, x: 0,        len: REAR_LEN, z: REAR_Z, zStack: zs(REAR_LEN) },
  { tag: 'rear_c', layer: 0, w: REAR_W, x: REAR_W,   len: SIDE_LEN, z: SIDE_Z, zStack: zs(SIDE_LEN) },
  { tag: 'mid',    layer: 1, w: bedW - 0.02, x: 0, len: MID_LEN, z: MID_Z,     zStack: zs(MID_LEN) },
  { tag: 'front',  layer: 2, w: bedW - 0.02, x: 0, len: pL, z: hingeA - pL * 1.5, zStack: zs(pL) },
];
const cushions = cushionSpec.map(s => {
  const c = new THREE.Mesh(
    new THREE.BoxGeometry(s.w - 0.008, cT, s.len - 0.03),
    [M.cushion_edge, M.cushion_edge, M.cushion_face, M.cushion_face, M.cushion_edge, M.cushion_edge]);
  c.name = 'cushion_' + s.tag;
  c.position.set(s.x, CUSHION_Y + (s.dy || 0), s.z);
  bed.add(c);
  return { m: c, i: s.layer, z0: s.z, zStack: s.zStack, tag: s.tag, dy: s.dy || 0 };
});
const frontCushion = cushions[cushions.length - 1];
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
    /* folded, the legs always stand down — the support bar is notched to let them through */
    const up = midLegT > 0.5 ? false : fitted;
    L.pv.rotation.x = up ? Math.PI / 2 : 0;
    L.pv.visible = true;
  }
}

/* f = 0 unfolded over the seats, 1 folded flat on the deck.
   0–0.25 cushions lift off · 0.25–0.75 the wood folds · 0.75–1 cushions land on top */
let folded = 1;
let peopleShown = false;   /* hidden until the button asks for them */
let reclined = 0;
var fitP = 1;   /* how far the box is fitted; set by setFit each frame */
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
  for (const s of hatchSlats) s.visible = !out;
  for (const s of stackSlats) s.visible = !(out && folded > 0.5);   /* folded, these lie over the opening too */
  const stowedOver = out && folded > 0.5;   /* the stow stack sits right on the opening */
  for (const c of cushions) c.m.visible = !cushionsOut && !stowedOver;
  for (const s of sideCushions) s.m.visible = !cushionsOut;
  midAftCushion.m.visible = !cushionsOut && !stowedOver && (folded > 0.001 || !out);
  const key = hatchOut + '|' + cushionsOut + '|' + (folded > 0.5);
  if (uiReady && key !== hatchUi) { hatchUi = key; labels(); }
}
function setFold(f) {
  const fp = clamp01((f - 0.25) / 0.5);
  folded = fp;
  if (fp > 0.5 && uiReady && anim.bed.target === 1) hatchOut = false;   /* stowing — the panel goes back in first */
  for (const g of seated) g.visible = peopleShown && f > 0.98;
  for (const g of occupants) g.visible = peopleShown && fp < 0.02;
  /* two moves, in sequence: the middle panel runs out of the carcass on drawer
     slides, then the cab-end panel unfolds off its forward edge */
  const s = smooth(clamp01(fp / 0.5));         /* first: the green panel runs into the orange one */
  const t = smooth(clamp01((fp - 0.5) / 0.5));  /* then: the blue panel folds over on top */
  const th = Math.PI * t, k = (1 - Math.cos(th)) / 2;
  pivotA.rotation.x = 0;
  const STOW_FORE = 0.045;   /* extra fore travel, so the green panel's fingers stop short of the aft face */
  pivotA.position.z = hingeA + (MID_L - FINGER_OVER + 0.01 - STOW_FORE) * s;   /* stowed, the panel is fully retracted into the box */
  pivotA.position.y = bedY + STOW_DY * s;
  pivotB.rotation.x = th; pivotB.position.y = (pT + 0.002) * k;   /* folds up and over, landing face-down on top of the middle panel */
  legs.rotation.x = -Math.PI / 2 * Math.min(1, t * 1.5);
  legs.visible = t < 0.8 && reclined < 0.5;
  poseMidLegs(t);
  for (const pv of brLegs) pv.visible = t < 0.5 && reclined > 0.001;
  overlayPanel.visible = t < 0.5;
  overlayLegs.visible = reclined >= 0.5;


  const lift = smooth(clamp01(f / 0.25));
  const place = smooth(clamp01((f - 0.75) / 0.25));
  for (const c of cushions) {
    const yStack = STACK_BASE + cT / 2 + (2 - c.i) * (cT + 0.003);
    c.m.position.z = c.z0 + (c.zStack - c.z0) * fp;
    c.m.position.y = (1 - place) * (CUSHION_Y + c.dy + (RAISE + c.i * 0.012) * lift) + place * yStack;
  }
  applyHatch();
}
/* g = 0 flaps out over the arches, 1 folded up against the mattress.
   Driven on its own track so it can lag the bed unfolding by two seconds. */
function setFlaps(g) {
  for (const f of flaps) f.pv.rotation.z = f.sx * f.dir * Math.PI / 2 * g;
  /* the arms run out with the wings and retract into their rails as they fold up */
  for (const st of wingStays) st.slide.position.x = st.inX + (st.outX - st.inX) * (1 - g);
  for (const s of sideCushions) {
    const xDep = s.sx * (W / 2 + FLAP_W / 2);
    const xFold = s.sx * (W / 2 - cT / 2 - 0.014);   /* folds inboard onto the stack — outboard there is no room past the arches */
    s.m.position.x = xDep + (xFold - xDep) * g;
    /* stood on edge it would straddle the board — lift it so it stands on top.
       Blue is inverted by bed_hinge_b, so its local above-board offset resolves
       below the board and has to be cancelled twice over. */
    const lift = (FLAP_W - cT) / 2 + (s.dir < 0 ? 2 * (pT / 2 + cT / 2 + 0.002) : 0);
    s.m.position.y = s.y + lift * g * s.dir;
    s.m.rotation.z = s.sx * s.dir * Math.PI / 2 * g;
  }
}

/* r = 0 flat, 1 backrest up at 45° — the cab-end panel is the one that rises */
const RECLINE = Math.PI / 4;
function setRecline(r) {
  const th = RECLINE * r;
  reclined = r;
  if (r >= 0.5 && reclinePrev < 0.5) hatchOut = true;   /* rising into the lounger takes the panel out once */
  reclinePrev = r;
  frontPivot.rotation.x = th;
  for (const pv of brLegs) {
    const boardTop = OVL + pT / 2;
    /* hinge position in pivotB space, and the lean we want at this angle */
    const hy = -BR_LEG_Z * Math.sin(th) - (pT / 2) * Math.cos(th);
    const world = -Math.PI / 2 * (1 - r);   /* 0 = straight down, -π/2 = folded flat */
    const gap = hy - boardTop;
    const len = (gap > 0.005 && Math.cos(world) > 0.01) ? gap / Math.cos(world) : BR_LEG_L;
    pv.rotation.x = world - th;
    pv.scale.y = Math.min(1, len / BR_LEG_L);
    pv.visible = folded < 0.5 && r > 0.001;
  }
  for (const g of occupants) g.visible = peopleShown && folded < 0.02;
  legs.visible = folded < 0.8 && r < 0.5;   /* the far pair has nothing to stand under once the panel is up */
  applyHatch();
  if (folded > 0.001) return;   /* folded away — setFold owns the cushion stack */
  const c = frontCushion;
  const arm = pL / 2, off = pT / 2 + cT / 2 + 0.002;
  c.m.rotation.x = th;
  c.m.position.z = hingeA - pL + off * Math.sin(th) - arm * Math.cos(th);
  c.m.position.y = bedY + c.dy * (1 - r) + off * Math.cos(th) + arm * Math.sin(th);
  overlayPanel.visible = folded < 0.5;   /* the extension board lifts out before the bed stows */
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
model.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });

leftShield.rotation.x = 0; /* frame the camera on the widest pose */
stage.setObject(model);

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
  ref.g.position.z = BOXZ + out;
  for (const r of (runnersByDrawer[ref.key] || [])) {
    r.scale.z = (D + out) / D;
    r.position.z = BOXZ + out / 2;
  }
  const open = Math.min(1, Math.max(0, (out / OPEN - 0.5) / 0.5));
  /* on the top two drawers the front folds out flat and becomes a side table */
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
  d1: { p: 0, target: 0, ms: 900, apply: p => { setOut(drawerRefs[0], ease(p) * OPEN); dollyWithDrawer(p); } },
  d2: { p: 0, target: 0, ms: 900, apply: p => setOut(drawerRefs[1], ease(p) * OPEN) },
  d3: { p: 0, target: 0, ms: 900, apply: p => setOut(drawerRefs[2], ease(p) * OPEN) },
  d4: { p: 0, target: 0, ms: 900, apply: p => setOut(drawerRefs[3], ease(p) * OPEN) },
  d5: { p: 0, target: 0, ms: 1600, apply: p => setDoor(ease(p)) },
  leaf: { p: 0, target: 0, ms: 1100, apply: p => setHalfBOut(ease(p)) },
  bside: { p: 0, target: 0, ms: 1500, apply: p => setBedsideMove(ease(p)) },
  bed:    { p: 1, target: 1, ms: 3400, apply: p => setFold(ease(p)) },
  flaps:  { p: 1, target: 1, ms: 900, apply: p => setFlaps(ease(p)) },
  seats:  { p: 0, target: 0, ms: 1400, apply: p => setSeatBacks(ease(p)) },
  recline: { p: 0, target: 0, ms: 1200, apply: p => setRecline(ease(p)) },
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
anim.bed.gate = () => anim.bed.target === 1 || anim.seats.p === 1;
anim.seats.gate = () => anim.seats.target === 1 || anim.bed.p === 1;
/* the backrest can only rise once the bed is flat and down */
anim.recline.gate = () => anim.recline.target === 0 || anim.bed.p === 0;
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
    placeFloat(bedFloat, rearPivot, 0, 0.30, -pL * 0.85, boxIn && bedSettled, cam, r, wr);
  }
  if (drawersFloat) {
    const shut = !anyDrawerOpen() && !seqRunning;
    placeFloat(drawersFloat, doorBoard, 0, -0.10, T / 2 + 0.10, boxIn && shut, cam, r, wr);
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
    const label = tableStowed ? 'Set up table' : 'Stow table';
    if (tableFloat.textContent !== label) tableFloat.textContent = label;
    /* always anchored to the floor socket between the seats, where the post stands
       when the table is set up — so the control sits in one place either way */
    placeFloat(tableFloat, tableParts, TOPDX - LEGDX, 0.036 + POST_LEN + 0.12, 0, show, cam, r, wr);
    /* the tailgate-pinned fit button projects to nearly this same point when the box
       is on the tarmac — a constant offset separates them without a feedback loop */
    if (tableFloat.style.opacity === '1') {
      tableFloat.style.transform += ' translateY(-72px)';
    }
  }
  /* whichever control is out on the model leaves the menu, and vice versa */
  const bedFloatOn = bedFloat && bedFloat.style.opacity === '1';
  if (bedBtn) bedBtn.dataset.floating = (bedFloatOn && bedFloat.textContent !== 'Lounger') ? '1' : '';
  if (loungeBtn) loungeBtn.dataset.floating = (bedFloatOn && bedFloat.textContent === 'Lounger') ? '1' : '';
  if (drawerBtn) drawerBtn.dataset.floating = (drawersFloat && drawersFloat.style.opacity === '1') ? '1' : '';
  if (tableBtn) tableBtn.dataset.floating = (tableFloat && tableFloat.style.opacity === '1') ? '1' : '';
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
    stopSequence();
    holdStill();
    anim['d' + c.n].target = 1;
    if (drawerBtn) drawerBtn.textContent = 'Close drawers';
  });
  c.bub.addEventListener('pointerleave', () => {
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
  const leftSpace = mx0 - off - pad;
  const rightSpace = w.width - pad - (mx1 + off);
  if (latchedSide === null) latchedSide = leftSpace >= rightSpace ? 'left' : 'right';
  else if (!userOrbiting) {
    const mine = latchedSide === 'left' ? leftSpace : rightSpace;
    const other = latchedSide === 'left' ? rightSpace : leftSpace;
    if (other > mine * 1.25 + 80) latchedSide = latchedSide === 'left' ? 'right' : 'left';
  }
  const useLeft = latchedSide === 'left';
  const space = Math.max(110, useLeft ? leftSpace : rightSpace);

  /* fit the grid to the room available BEFORE latching: two columns if they fit
     at a sensible size, otherwise one — and never a cell wider than its column */
  let rows = Math.min(shown.length, 2);
  let cols = Math.ceil(shown.length / rows);
  const sizeFor = (rw, cl) => Math.min(
    Math.floor((space - (cl - 1) * pad) / cl),
    Math.floor((usableH - pad * (rw + 1)) / rw));
  if (cols > 1 && sizeFor(rows, cols) < 88) { rows = shown.length; cols = 1; }
  const want = Math.max(56, Math.min(186, sizeFor(rows, cols)));
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
  let moved = false;
  for (const a of Object.values(anim)) {
    if (a.p !== a.target && (!a.gate || a.gate())) {
      moved = true;
      const step = dt / a.ms;
      a.p = a.target > a.p ? Math.min(a.target, a.p + step) : Math.max(a.target, a.p - step);
      a.apply(a.p);
    }
  }
  /* the fridge lid only lifts when drawer 4 is out on its own */
  const d4ref = drawerRefs[3];
  if (d4ref.lid) {
    const p = anim.d4.p;
    const open = Math.min(1, Math.max(0, (p - 0.5) / 0.5));
    d4ref.lid.rotation.z = allOpen() ? 0 : 1.45 * open;
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
anim.d5.apply(0);
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

const hatchBtn = document.getElementById('hatch-toggle');
if (hatchBtn) hatchBtn.addEventListener('click', () => {
  hatchOut = !hatchOut;
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
function stopSequence() { for (const t of seqTimers) clearTimeout(t); seqTimers = []; seqRunning = false; }
function holdStill() {
  userOrbiting = false;
  fromTheta = null;
  stage.removeAttribute('autorotate');
  if (stage._controls) stage._controls.autoRotate = false;
}
/* each drawer, then the middle-bay door, out and back in once in turn */
function runDrawerSequence() {
  stopSequence();
  seqRunning = true;
  const HOLD = 350, GAP = 500;
  let t = 0;
  for (const d of pinRefs) {
    const a = anim['d' + d.n];
    const at = t;
    seqTimers.push(setTimeout(() => { a.target = 1; }, at));
    seqTimers.push(setTimeout(() => { a.target = 0; }, at + a.ms + HOLD));
    t = at + a.ms * 2 + HOLD + GAP;
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
function labels() {
  const db = document.getElementById('doors-toggle');
  if (db) db.textContent = anim.doors.target ? 'Close doors' : 'Open doors';
  if (bedBtn) bedBtn.textContent = anim.bed.target === 1 ? 'Unfold bed' : 'Fold bed';
  if (loungeBtn) loungeBtn.textContent = anim.recline.target ? 'Flat bed' : 'Lounger';
  if (hatchBtn) {
    const stowed = anim.bed.target === 1;   /* the panel stays in under the folded bed */
    hatchBtn.disabled = stowed;
    hatchBtn.textContent = hatchOut ? 'Refit hatch panel' : 'Remove hatch panel';
  }
  if (cushionsBtn) cushionsBtn.textContent = cushionsOut ? 'Refit cushions' : 'Remove all cushions';
}
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
if (tableFloat) tableFloat.addEventListener('click', () => { if (tableBtn) tableBtn.click(); });
labels();
uiReady = true;

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
  cam.near = Math.max(dist / 100, 0.01);
  cam.far = dist * 100;
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

let tableStowed = true;   /* the van starts empty — the table travels stowed */
function applyTableMode() {
  /* the bed lands on the table — it can never be stowed while the bed is down.
     The lounger is the exception: only its own table goes away. */
  if (anim.bed.target === 0 && anim.recline.target !== 1) tableStowed = false;
  /* stowing wins in every mode — in the lounger it takes the bedside table away too */
  /* the pedestal stands at dining height with the bed folded, and drops to bed
     height when the bed comes down so the panels land on it */
  /* raise only once the bed has finished folding; drop as soon as it starts coming down */
  tblH = (anim.bed.target === 1 && anim.bed.p > 0.999) ? TBL_H_HI : TBL_H_BED;
  tableProps.position.y = tblH - TBL_H;   /* the cards and wine ride with the top */
  /* the bedside table is its own piece now — it comes out with the lounger
     whether or not the main table is standing. In the lounger, stowing takes
     only the lounger table away: the main table stays set up under the seat. */
  const lounger = anim.recline.target === 1;
  const mainStowed = tableStowed && !lounger;
  const bedside = lounger && !tableStowed;
  /* the bed and the lounger both land on the table, so it must be whole — both
     halves down, nothing lifted off or sent to the bedside pose */
  const full = anim.bed.target === 0 || lounger;
  setTableStowed(mainStowed, bedside);
  anim.bside.target = bedside ? 1 : 0;   /* the lounger table comes out with the lounger */
  if (full) anim.leaf.target = 0;
  tableUnit.visible = boxRemoved() ? !mainStowed : (vanSolid.visible || !mainStowed);
  if (tableBtn) tableBtn.textContent = lounger
    ? (tableStowed ? 'Set up lounger table' : 'Stow lounger table')
    : (tableStowed ? 'Set up table' : 'Stow table');
}
const tableBtn = document.getElementById('table-toggle');
applyTableMode();   /* start stowed */
if (tableBtn) tableBtn.addEventListener('click', () => {
  tableStowed = !tableStowed;
  if (!tableStowed) anim.doors.target = 1;   /* nothing goes in through a shut door */
  applyTableMode();
  /* the table and the bed now stand together — stowing the table is the only
     thing that takes it away */
  updateVisBox();
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
  /* fitting is offered on the tailgate; removing lives in the menu */
  if (boxBtn) boxBtn.style.display = boxOut ? '' : 'none';
  if (boxRemoveBtn) boxRemoveBtn.style.display = boxOut ? 'none' : '';
  if (pinHost) pinHost.style.display = boxOut ? 'none' : '';
  bsHideStowed = fitP <= 0.002;   /* it rides with the box: shown only once the box is */
  poseTable();   /* the stowed bedside table hides with the box out */
  /* box-only controls have nothing to act on once the box is out */
  for (const id of ['drawer-toggle', 'bed-toggle', 'lounge-toggle',
                    'hatch-toggle', 'cushions-toggle']) {
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
  const tableUp = !tableStowed || anim.recline.target === 1;
  tableUnit.visible = boxOut ? tableUp : (vanSolid.visible || tableUp);
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

/* ---- hovering a drawer front in the 3D view runs it out for three seconds ---- */
const hoverRay = new THREE.Raycaster(), hoverPt = new THREE.Vector2();
const frontMeshes = drawerRefs.map(d => {
  const m = d.hinge.getObjectByName(d.key + '_front');
  if (m) m.userData.drawerN = d.n;
  return m;
}).filter(Boolean);
let hoverN = 0, hoverTimer = null;
function closePeek() {
  clearTimeout(hoverTimer); hoverTimer = null;
  if (!hoverN) return;
  anim['d' + hoverN].target = 0;
  hoverN = 0;
  if (!anyDrawerOpen() && drawerBtn) drawerBtn.textContent = 'Open drawers';
}
function peekDrawer(n) {
  if (n === hoverN) return;
  closePeek();   /* moving off a front, or onto another one, shuts the last */
  hoverN = n;
  if (!n) return;
  stopDemo();
  stopSequence();
  bubblesPinned = false;
  const a = anim['d' + n];
  a.target = 1;
  if (drawerBtn) drawerBtn.textContent = 'Close drawers';
  hoverTimer = setTimeout(closePeek, 3000);   /* and it shuts itself after three seconds */
}
function onStageMove(e) {
  const r = stage._renderer, cam = stage._camera;
  if (!r || !cam) return;
  const b = r.domElement.getBoundingClientRect();
  hoverPt.set(((e.clientX - b.left) / b.width) * 2 - 1, -((e.clientY - b.top) / b.height) * 2 + 1);
  hoverRay.setFromCamera(hoverPt, cam);
  const hit = hoverRay.intersectObjects(frontMeshes, false)[0];
  const n = hit ? hit.object.userData.drawerN : 0;
  r.domElement.style.cursor = n ? 'pointer' : '';
  peekDrawer(n);
}
function bindStageHover() {
  const r = stage._renderer;
  if (!r) { setTimeout(bindStageHover, 200); return; }
  r.domElement.addEventListener('pointermove', onStageMove);
  r.domElement.addEventListener('pointerleave', () => { r.domElement.style.cursor = ''; closePeek(); });
}
bindStageHover();
