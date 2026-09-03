import * as THREE from 'three';

const stage = document.querySelector('three-d-stage');
const { } = await stage.ready;

const M = {
  ply:      new THREE.MeshStandardMaterial({ color: 0xa9a7a2, roughness: 0.78, metalness: 0.02 }),
  ply_dark: new THREE.MeshStandardMaterial({ color: 0x7d7b77, roughness: 0.8,  metalness: 0.02 }),
  accent:   new THREE.MeshStandardMaterial({ color: 0x1b1a19, roughness: 0.5, metalness: 0.06 }),
  steel:    new THREE.MeshStandardMaterial({ color: 0xb9b7b2, roughness: 0.35, metalness: 0.35 }),
  cushion:  new THREE.MeshStandardMaterial({ color: 0xd2d0cb, roughness: 0.95, metalness: 0.0 }),
  cushion_edge: new THREE.MeshStandardMaterial({ color: 0x7a8a5e, roughness: 0.95, metalness: 0.0 }),
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
const W = 1.37, D = 0.98, H = 0.59, T = 0.018;   /* W = 1390 mm between the arches, less 10 mm clearance */
const BOXZ = -0.13;   /* pushed forward so the front panel meets the rear seat backs */

/* ---- van: load bay of a Tourneo Custom, seen from the tailgate ---- */
const VW = 1.76, VWA = 1.39, VH = 1.32, TAIL = 0.42, CAB = -2.32;

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
  S('arch_box_' + side, aw, 0.30, 0.86, sx * (VWA / 2 + aw / 2), 0.15, -0.24, M.trim);
  S('arch_top_' + side, aw, 0.02, 0.86, sx * (VWA / 2 + aw / 2), 0.30, -0.24, M.trim_dk);
}
S('bulkhead_panel', VW, VH, 0.03, 0, VH / 2, CAB + 0.015, M.trim);
S('rear_sill_step', 1.60, 0.05, 0.18, 0, -0.025, TAIL + 0.09, M.trim_dk);
S('rear_sill_trim', 1.60, 0.02, 0.05, 0, 0.005, TAIL + 0.02, M.trim);
for (const sx of [-1, 1]) {
  S('d_pillar_' + (sx < 0 ? 'left' : 'right'), 0.10, VH, 0.06, sx * 0.77, VH / 2, TAIL + 0.03, M.trim);
}
S('header_rail', 1.64, 0.10, 0.06, 0, VH - 0.05, TAIL + 0.03, M.trim);

/* ---- tailgate, hinged at the roof ---- */
const tailgate = new THREE.Group(); tailgate.name = 'tailgate';
tailgate.position.set(0, VH, TAIL + 0.03); vanSolid.add(tailgate);
box('tailgate_skin', 1.62, VH - 0.10, 0.05, 0, -(VH - 0.10) / 2, 0, M.door, tailgate);
box('tailgate_glass', 1.44, 0.46, 0.018, 0, -0.30, 0.036, M.glass, tailgate);
box('tailgate_handle', 0.22, 0.05, 0.05, 0, -0.66, 0.045, M.door_dk, tailgate);
box('tailgate_trim', 1.62, 0.06, 0.06, 0, -(VH - 0.13), 0.01, M.door_dk, tailgate);

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
const TBLZ = -1.35, TBLX = -0.46, TBL_H = 0.62;
const tableUnit = new THREE.Group(); tableUnit.name = 'pedestal_table'; model.add(tableUnit);
box('table_base_board', 0.42, 0.018, 0.34, TBLX, 0.015, TBLZ, M.ply, tableUnit);
for (const dx of [-0.15, 0.15]) {
  box('velcro_strip_' + (dx < 0 ? 'left' : 'right'), 0.075, 0.006, 0.30, TBLX + dx, 0.003, TBLZ, M.stove, tableUnit);
}
/* post and top lift off the board as one piece */
const tableParts = new THREE.Group(); tableParts.name = 'table_post_and_top';
tableParts.position.set(TBLX, 0, TBLZ); tableUnit.add(tableParts);
const TOPDX = 0.07;   /* nudged inboard so the wide top clears the van wall */
const tFoot = box('table_foot_plate', 0.16, 0.012, 0.16, 0, 0.030, 0, M.steel, tableParts);
const tPost = tube('table_post', 0.030, TBL_H - 0.05, 0, 0.036 + (TBL_H - 0.05) / 2, 0, M.steel, tableParts, 'y');
const tPlate = box('table_top_plate', 0.18, 0.012, 0.18, TOPDX, TBL_H - 0.019, 0, M.steel, tableParts);
const tTop = box('table_top', 0.92, 0.018, 0.32, TOPDX, TBL_H, 0, M.ply, tableParts);
const tEdge = box('table_top_edge', 0.92, 0.010, 0.010, TOPDX, TBL_H - 0.008, 0.16, M.stove, tableParts);

/* three poses: set up on its board, stowed behind the seats, or run up
   through the bed platform as a bedside table when the lounger is out */
const STOW_Z = -2.26 - TBLZ, POST_X = -0.75 - TBLX, POST_Z = -2.14 - TBLZ;
const BEDSIDE_TOP_Y = 0.88, BEDSIDE_TOP_SX = 0.42;
const BS_POST_X = 0.78 - TBLX, BS_Z = -0.96 - TBLZ;   /* beside the bed, a third of the way down */
function setTableStowed(stowed, bedside) {
  tTop.scale.set(1, 1, 1); tEdge.scale.set(1, 1, 1); tPost.scale.set(1, 1, 1);
  tTop.rotation.x = 0; tEdge.rotation.x = 0; tPlate.rotation.x = 0;
  if (stowed) {
    tTop.rotation.x = -Math.PI / 2; tTop.position.set(TOPDX, 0.30, STOW_Z);
    tEdge.rotation.x = -Math.PI / 2; tEdge.position.set(TOPDX, 0.46, STOW_Z + 0.012);
    tPlate.rotation.x = -Math.PI / 2; tPlate.position.set(TOPDX, 0.30, STOW_Z + 0.016);
    tPost.position.set(POST_X, 0.32, POST_Z);
    tFoot.position.set(POST_X, 0.036, POST_Z);
    return;
  }
  if (bedside) {
    /* longer post up beside the bed, small dark top cantilevered over the mattress */
    const len = BEDSIDE_TOP_Y - 0.05;
    tPost.scale.y = len / (TBL_H - 0.05);
    tPost.position.set(BS_POST_X, 0.036 + len / 2, BS_Z);
    tFoot.position.set(BS_POST_X, 0.030, BS_Z);
    tTop.material = M.worktop;
    tTop.scale.set(BEDSIDE_TOP_SX, 1, 1);
    tTop.position.set(BS_POST_X - 0.19, BEDSIDE_TOP_Y, BS_Z);
    tPlate.position.set(BS_POST_X, BEDSIDE_TOP_Y - 0.019, BS_Z);
    tEdge.scale.set(BEDSIDE_TOP_SX, 1, 1);
    tEdge.position.set(BS_POST_X - 0.19, BEDSIDE_TOP_Y - 0.008, BS_Z + 0.16);
    return;
  }
  tTop.material = M.ply;
  tTop.position.set(TOPDX, TBL_H, 0);
  tEdge.position.set(TOPDX, TBL_H - 0.008, 0.16);
  tPlate.position.set(TOPDX, TBL_H - 0.019, 0);
  tPost.position.set(0, 0.036 + (TBL_H - 0.05) / 2, 0);
  tFoot.position.set(0, 0.030, 0);
}
setTableStowed(false);

/* ---- six fixed seats, two rows of three, facing the cab ---- */
const ROWS = [['row2', -0.92], ['row1', -1.78]];
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


const bayW = (W - 4 * T) / 3;   /* thirds: drawer · open space · drawer */
const divX = bayW / 2 + T / 2;

/* ---- carcass ---- */
const carcass = new THREE.Group(); carcass.name = 'carcass'; model.add(carcass);
box('carcass_floor', W, T, D, 0, T / 2, 0, M.ply, carcass);
box('carcass_side_left',  T, H - T, D, -W / 2 + T / 2, T + (H - T) / 2, 0, M.ply, carcass);
box('carcass_side_right', T, H - T, D,  W / 2 - T / 2, T + (H - T) / 2, 0, M.ply, carcass);
box('carcass_divider_left',  T, H - T, D, -divX, T + (H - T) / 2, 0, M.ply, carcass);
box('carcass_divider_right', T, H - T, D,  divX, T + (H - T) / 2, 0, M.ply, carcass);
box('carcass_front_panel', W - 2 * T, H - T, T, 0, T + (H - T) / 2, -D / 2 + T / 2, M.ply_dark, carcass);
box('carcass_top_deck', W, T, D, 0, H - T / 2, 0, M.ply, carcass);
box('carcass_rear_rail', W, 0.05, T, 0, H - T - 0.025, D / 2 - T / 2, M.ply_dark, carcass);
/* floor-mount cleats */
box('cleat_left',  0.05, 0.03, D - 0.10, -W / 2 + 0.06, 0.0155, 0, M.steel, carcass);
/* shelf between the stacked drawers in each side bay */
for (const [side, sx] of [['left', -1], ['right', 1]]) {
  box('carcass_shelf_' + side, bayW, T, D, sx * (bayW + T), side === 'left' ? 0.283 : 0.416, 0, M.ply, carcass);
}
box('cleat_right', 0.05, 0.03, D - 0.10,  W / 2 - 0.06, 0.0155, 0, M.steel, carcass);

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

function drawer(name, cx, out, kitchen) {
  const [baseY, dh] = BAYS[name];
  const g = new THREE.Group(); g.name = name;
  g.position.set(cx, baseY, out);
  const y = dh / 2;
  box(name + '_base', dW, T, dD, 0, T / 2, 0, M.ply, g);
  box(name + '_side_left',  T, dh, dD, -dW / 2 + T / 2, y, 0, M.ply, g);
  box(name + '_side_right', T, dh, dD,  dW / 2 - T / 2, y, 0, M.ply, g);
  box(name + '_back', dW - 2 * T, dh, T, 0, y, -dD / 2 + T / 2, M.ply, g);
  const fh = dh + 0.02;
  const frontPivot = new THREE.Group(); frontPivot.name = name + '_front_hinge';
  frontPivot.position.set(0, fh, D / 2 + 0.012); g.add(frontPivot);   /* hinged along its top edge, proud of the carcass */
  box(name + '_front', bayW + 0.012, fh, 0.022, 0, -fh / 2, 0, M.accent, frontPivot);
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

/* runners, extended with the drawers */
const runnersByDrawer = {};
for (const [side, sx] of [['left', -1], ['right', 1]]) {
  const outer = sx * (W / 2 - T - 0.012);
  const inner = sx * (divX - T / 2 - 0.012);
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
const pT = 0.016, bedW = W - 0.02, pL = 0.66, bedY = H + pT / 2;   /* three equal panels, so they stack flush */
const cT = 0.075, hingeA = D / 2 - 0.01 - pL;
const LIFT = pT + 0.005;   /* bare panels stack directly on each other */

const flaps = [];
const sideCushions = [];
const FLAP_W = (1.72 - bedW) / 2;   /* out to the full van width over the arches */

function panel(name, len, zCenter, y, parent) {
  const g = new THREE.Group(); g.name = name;
  box(name + '_rail_left',  0.05, pT, len, -bedW / 2 + 0.025, y, zCenter, M.ply, g);
  box(name + '_rail_right', 0.05, pT, len,  bedW / 2 - 0.025, y, zCenter, M.ply, g);
  const slats = 5;
  for (let i = 0; i < slats; i++) {
    const z = zCenter - len / 2 + (len / slats) * (i + 0.5);
    box(name + '_slat_' + (i + 1), bedW - 0.12, pT, len / slats - 0.045, 0, y, z, M.ply_dark, g);
  }
  /* hinged flaps that fold out over the wheel arches */
  for (const sx of [-1, 1]) {
    const side = sx < 0 ? 'left' : 'right';
    const pv = new THREE.Group(); pv.name = name + '_flap_hinge_' + side;
    pv.position.set(sx * bedW / 2, y, zCenter); g.add(pv);
    box(name + '_flap_' + side, FLAP_W, pT, len - 0.03, sx * FLAP_W / 2, 0, 0, M.ply, pv);
    /* infill cushion out to the van wall — posed from setFold so it never
       sweeps through the mattress when the flap folds up */
    const sc = new THREE.Mesh(
      new THREE.BoxGeometry(FLAP_W - 0.008, cT, len - 0.04), M.cushion_edge);
    sc.name = name.replace('bed_panel', 'side_cushion') + '_' + side;
    sc.position.set(sx * (bedW / 2 + FLAP_W / 2), y + pT / 2 + cT / 2 + 0.002, zCenter);
    g.add(sc);
    sideCushions.push({ m: sc, sx, y: y + pT / 2 + cT / 2 + 0.002, z: zCenter });
    tube(name + '_flap_pin_' + side, 0.008, len - 0.06, 0, 0, 0, M.steel, pv, 'z');
    flaps.push({ pv, sx });
  }
  parent.add(g);
  return g;
}

const rearPivot = new THREE.Group(); rearPivot.name = 'bed_rear_recline';
rearPivot.position.set(0, bedY, hingeA); bed.add(rearPivot);
panel('bed_panel_rear', pL, pL / 2, 0, rearPivot);

const pivotA = new THREE.Group(); pivotA.name = 'bed_hinge_a';
pivotA.position.set(0, bedY, hingeA); bed.add(pivotA);
tube('hinge_rear_mid', 0.011, bedW - 0.06, 0, 0, 0, M.steel, pivotA);
panel('bed_panel_mid', pL, -pL / 2, 0, pivotA);

const pivotB = new THREE.Group(); pivotB.name = 'bed_hinge_b';
pivotB.position.set(0, 0, -pL); pivotA.add(pivotB);
tube('hinge_mid_front', 0.011, bedW - 0.06, 0, 0, 0, M.steel, pivotB);
panel('bed_panel_front', pL, -pL / 2, 0, pivotB);

const legs = new THREE.Group(); legs.name = 'bed_legs';
legs.position.set(0, -pT / 2, -pL + 0.10); pivotB.add(legs);
for (const sx of [-1, 1]) {
  box('bed_leg_' + (sx < 0 ? 'left' : 'right'), 0.05, H - 0.02, 0.05, sx * (bedW / 2 - 0.06), -(H - 0.02) / 2, 0, M.ply_dark, legs);
}

/* the three cushions are loose: they lift off before the wood folds and go back on top after */
const CUSHION_Y = bedY + pT / 2 + cT / 2 + 0.002;
const STACK_BASE = bedY + LIFT * 2 + pT / 2 + 0.004;
const RAISE = 0.36;
const cushions = ['rear', 'mid', 'front'].map((tag, i) => {
  const c = new THREE.Mesh(
    new THREE.BoxGeometry(bedW - 0.02, cT, pL - 0.03),
    [M.cushion_edge, M.cushion_edge, M.cushion, M.cushion, M.cushion_edge, M.cushion_edge]);
  c.name = 'cushion_' + tag;
  c.position.set(0, CUSHION_Y, hingeA + pL / 2 - i * pL);
  bed.add(c);
  return { m: c, i, z0: hingeA + pL / 2 - i * pL };
});

const clamp01 = v => Math.min(1, Math.max(0, v));
const smooth = t => t * t * (3 - 2 * t);

/* f = 0 unfolded over the seats, 1 folded flat on the deck.
   0–0.25 cushions lift off · 0.25–0.75 the wood folds · 0.75–1 cushions land on top */
function setFold(f) {
  const fp = clamp01((f - 0.25) / 0.5);
  const th = Math.PI * fp, k = (1 - Math.cos(th)) / 2;
  pivotA.rotation.x = th; pivotA.position.y = bedY + LIFT * k;
  pivotB.rotation.x = -th; pivotB.position.y = -LIFT * k;   /* reverse fold — the top panel lands face-up */
  legs.rotation.x = -Math.PI / 2 * Math.min(1, fp * 1.5);
  legs.visible = fp < 0.8;
  for (const f of flaps) f.pv.rotation.z = f.sx * Math.PI / 2 * fp;   /* flaps fold up as the bed folds */
  for (const s of sideCushions) {
    const xDep = s.sx * (bedW / 2 + FLAP_W / 2);
    const xFold = s.sx * (bedW / 2 + cT / 2 + 0.014);
    s.m.position.x = xDep + (xFold - xDep) * fp;
    s.m.rotation.z = s.sx * Math.PI / 2 * fp;
  }


  const lift = smooth(clamp01(f / 0.25));
  const place = smooth(clamp01((f - 0.75) / 0.25));
  const zStack = hingeA + pL / 2;
  for (const c of cushions) {
    const yStack = STACK_BASE + cT / 2 + (2 - c.i) * (cT + 0.003);
    c.m.position.z = c.z0 + (zStack - c.z0) * fp;
    c.m.position.y = (1 - place) * (CUSHION_Y + (RAISE + c.i * 0.012) * lift) + place * yStack;
  }
}
/* r = 0 flat, 1 backrest up at 45° — only meaningful with the bed unfolded */
const RECLINE = Math.PI / 4;
function setRecline(r) {
  const th = RECLINE * r;
  rearPivot.rotation.x = -th;
  const c = cushions[0];
  const arm = pL / 2, off = pT / 2 + cT / 2 + 0.002;
  c.m.rotation.x = -th;
  c.m.position.z = hingeA + arm * Math.cos(th) + off * Math.sin(th);
  c.m.position.y = bedY + arm * Math.sin(th) + off * Math.cos(th);
}
setFold(0);
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
  const a = -0.14 - f * (Math.PI / 2 - 0.14);
  for (const p of seatPivots) p.rotation.x = a;
}

const anim = {
  d1: { p: 0, target: 0, ms: 900, apply: p => { setOut(drawerRefs[0], ease(p) * OPEN); dollyWithDrawer(p); } },
  d2: { p: 0, target: 0, ms: 900, apply: p => setOut(drawerRefs[1], ease(p) * OPEN) },
  d3: { p: 0, target: 0, ms: 900, apply: p => setOut(drawerRefs[2], ease(p) * OPEN) },
  d4: { p: 0, target: 0, ms: 900, apply: p => setOut(drawerRefs[3], ease(p) * OPEN) },
  bed:    { p: 1, target: 1, ms: 2200, apply: p => setFold(ease(p)) },
  seats:  { p: 0, target: 0, ms: 1400, apply: p => setSeatBacks(ease(p)) },
  recline: { p: 0, target: 0, ms: 1200, apply: p => setRecline(ease(p)) },
  doors:  { p: 1, target: 1, ms: 1600, apply: p => {
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
if (pinHost) for (const d of drawerRefs) {
  const el = document.createElement('span');
  el.className = 'pin';
  el.textContent = String(d.n);
  pinHost.appendChild(el);
  d.el = el;
}
let frameRects = null;
let latchedSide = null, latchedBase = null, latchedCount = 0;
function readRects() {
  const cv = stage.shadowRoot && stage.shadowRoot.querySelector('canvas');
  if (!cv || !wrap) { frameRects = null; return; }
  frameRects = { r: cv.getBoundingClientRect(), w: wrap.getBoundingClientRect() };
}
function placePins() {
  if (!pinHost || !frameRects) return;
  const cam = stage._camera;
  if (!cam) return;
  const r = frameRects.r, wr = frameRects.w;
  const SEP = 34;
  const pts = [];
  for (const d of drawerRefs) {
    if (!d.el) continue;
    d.g.updateWorldMatrix(true, false);
    const px0 = d.key.endsWith('_upper') ? -(dW / 2 - 0.05) : (dW / 2 - 0.05);
    pinPt.set(px0, BAYS[d.key][1] * 0.55, dD / 2 + 0.05).applyMatrix4(d.g.matrixWorld).project(cam);
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
function placeCallouts() {
  if (!callouts.length || !frameRects) return;
  const cam = stage._camera;
  if (!cam) return;
  const r = frameRects.r, w = frameRects.w;
  const pad = 8, off = 26;
  const shown = callouts.filter(c => anim['d' + c.n].p > 0.35);

  for (const c of callouts) {
    if (!shown.includes(c) && c.lastOp !== '0') { c.el.style.opacity = '0'; c.lastOp = '0'; }
  }
  if (!shown.length) return;

  const [mx0, mx1] = projectedSpan(cam, r, w);
  const HINT = 46;                       /* the stage's own hint strip, bottom-left */
  const usableH = w.height - HINT;
  const rows = Math.min(shown.length, 2);
  const cols = Math.ceil(shown.length / rows);

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
  const space = Math.max(120, useLeft ? leftSpace : rightSpace);
  const byW = Math.floor((space - (cols - 1) * pad) / cols);
  const byH = Math.floor((usableH - pad * (rows + 1)) / rows);
  const want = Math.max(96, Math.min(186, byW, byH));
  if (latchedBase === null || shown.length !== latchedCount || Math.abs(want - latchedBase) > 28) {
    latchedBase = Math.round(want / 8) * 8;
    latchedCount = shown.length;
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
    if (c.lastOp !== '1') { c.el.style.opacity = '1'; c.lastOp = '1'; }
  }
}

updateVisBox();
function tick(now) {
  const dt = now - last; last = now;
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
  placePins();
  requestAnimationFrame(tick);
}
for (const d of drawerRefs) anim['d' + d.n].apply(0);
anim.bed.apply(1);
anim.seats.apply(0);
anim.recline.apply(0);
anim.doors.apply(1);
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
  if (anim.recline.target === 1) {   /* the bed has to be down and flat first */
    anim.bed.target = 0;
    anim.seats.target = 1;
  }
  applyTableMode();
  loungeBtn.textContent = anim.recline.target ? 'Flat bed' : 'Lounger';
  labels();
});

const drawerBtn = document.getElementById('drawer-toggle');
function setDrawers(t) { for (const d of drawerRefs) anim['d' + d.n].target = t; }
function anyDrawerOpen() { return drawerRefs.some(d => anim['d' + d.n].target === 1); }

let seqTimers = [];
function stopSequence() { for (const t of seqTimers) clearTimeout(t); seqTimers = []; }
function holdStill() {
  userOrbiting = false;
  fromTheta = null;
  stage.removeAttribute('autorotate');
  if (stage._controls) stage._controls.autoRotate = false;
}
/* each drawer out and back in turn, two seconds apart, then all four together */
function runDrawerSequence() {
  stopSequence();
  const OPEN_MS = 900, HOLD = 350, STEP = OPEN_MS * 2 + HOLD + 500;
  drawerRefs.forEach((d, i) => {
    const a = anim['d' + d.n];
    seqTimers.push(setTimeout(() => { a.target = 1; }, i * STEP));
    seqTimers.push(setTimeout(() => { a.target = 0; }, i * STEP + OPEN_MS + HOLD));
  });
  seqTimers.push(setTimeout(() => setDrawers(1), drawerRefs.length * STEP));
}

if (drawerBtn) drawerBtn.addEventListener('click', () => {
  stopDemo();
  stopSequence();
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
  if (anim.doors.target === 1) runDemo();
  if (anim.doors.target === 0) {
    stopDemo();
    stopSequence();
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
}
if (bedBtn) bedBtn.addEventListener('click', () => {
  stopDemo();
  if (anim.bed.target === 0) anim.recline.target = 0;   /* stowing — drop the backrest first */
  if (anim.bed.target === 1 && !tableStowed) {   /* about to unfold — stow the table first */
    tableStowed = true;
  }
  applyTableMode();
  anim.bed.target = anim.bed.target ? 0 : 1;
  if (anim.bed.target === 0) { anim.seats.target = 1; anim.doors.target = 1; }
  else anim.seats.target = 0;   /* bed stowed — bring the seat backs up */
  labels();
});
labels();

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

/* four seats out: the middle pair and the pair on the right */
const REMOVABLE = ['row1_2', 'row2_2', 'row1_3', 'row2_3'];
const seatsOutBtn = document.getElementById('seats-out-toggle');
if (seatsOutBtn) seatsOutBtn.addEventListener('click', () => {
  const out = seatGroups[REMOVABLE[0]].visible;   /* currently in → take them out */
  for (const k of REMOVABLE) { const g = seatGroups[k]; if (g) g.visible = !out; }
  seatsOutBtn.textContent = out ? 'Refit 4 seats' : 'Remove 4 seats';
  updateVisBox();
  reframe();
});

let tableStowed = false;
function applyTableMode() {
  const bedside = anim.recline.target === 1;
  setTableStowed(tableStowed && !bedside, bedside);
  tableUnit.visible = vanSolid.visible || !tableStowed || bedside;
  if (tableBtn) tableBtn.textContent = (tableStowed && !bedside) ? 'Set up table' : 'Stow table';
}
const tableBtn = document.getElementById('table-toggle');
if (tableBtn) tableBtn.addEventListener('click', () => {
  tableStowed = !tableStowed;
  applyTableMode();
  if (!tableStowed) {           /* the table needs the floor the bed sits over */
    stopDemo();
    anim.bed.target = 1;
    labels();
  }
  updateVisBox();
});

const vanBtn = document.getElementById('van-toggle');
function applyView() {
  if (vanBtn) vanBtn.textContent = vanSolid.visible ? 'Hide van' : 'Show van';
  /* the set-up table belongs to the layout, not the van — keep it when the van goes */
  tableUnit.visible = vanSolid.visible || !tableStowed || anim.recline.target === 1;
  /* van-only controls have nothing to act on once the van is hidden */
  for (const id of ['doors-toggle', 'seats-out-toggle']) {
    const b = document.getElementById(id);
    if (b) b.style.display = vanSolid.visible ? '' : 'none';
  }
  updateVisBox();
  reframe();
}
applyView();
if (vanBtn) vanBtn.addEventListener('click', () => {
  vanSolid.visible = !vanSolid.visible;
  applyView();
});
