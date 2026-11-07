"use client";

import * as React from "react";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";

interface BodyMesh3DProps {
  interactive?: boolean;
  activeDimension?: "height" | "chest" | "waist" | "hip" | "shoulder" | "inseam" | "outseam" | null;
  onSelectDimension?: (dim: "height" | "chest" | "waist" | "hip" | "shoulder" | "inseam" | "outseam") => void;
  currentValues?: {
    height?: number | string;
    chest?: number | string;
    waist?: number | string;
    hip?: number | string;
    shoulder?: number | string;
    inseam?: number | string;
    outseam?: number | string;
  };
  unit?: string;
  className?: string;
}

export function BodyMesh3D({
  interactive = true,
  activeDimension = null,
  onSelectDimension,
  currentValues,
  unit = "cm",
  className = "",
}: BodyMesh3DProps) {
  const mountRef = React.useRef<HTMLDivElement | null>(null);
  const [hoveredZone, setHoveredZone] = React.useState<string | null>(null);
  const resetCallbackRef = React.useRef<(() => void) | null>(null);

  const activeZone = activeDimension || hoveredZone;

  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 380;
    const height = mount.clientHeight || 540;

    // 1. SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();

    const fov = 37;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);

    const updateCameraFraming = (w: number, h: number) => {
      const aspect = w / h;
      camera.aspect = aspect;
      // Base distance: 242 gives ~162 units of visible vertical height.
      // Total model height + pedestal = 124 units (76.5% height utilization).
      // Leaves generous 11.7% headroom & footroom clearing all HUD overlays.
      const baseDistance = 242;
      const targetDist = aspect < 0.75 ? baseDistance * (0.80 / Math.max(aspect, 0.46)) : baseDistance;
      camera.position.set(0, 0, targetDist);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };

    updateCameraFraming(width, height);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    mount.appendChild(renderer.domElement);

    // 2. STUDIO SCIENTIFIC LIGHTING RIG
    const ambientLight = new THREE.AmbientLight(0x283244, 2.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 5.2);
    keyLight.position.set(65, 130, 100);
    scene.add(keyLight);

    const rimLightLeft = new THREE.DirectionalLight(0xc2dcff, 6.8);
    rimLightLeft.position.set(-120, 85, -70);
    scene.add(rimLightLeft);

    const rimLightRight = new THREE.DirectionalLight(0xfff6ec, 5.8);
    rimLightRight.position.set(120, 85, -70);
    scene.add(rimLightRight);

    const fillLight = new THREE.DirectionalLight(0x202838, 2.2);
    fillLight.position.set(0, -75, 55);
    scene.add(fillLight);

    // Internal Thoracic Point Light (Subtle luminescent core)
    const thoracicGlow = new THREE.PointLight(0xdde8ff, 3.4, 85);
    thoracicGlow.position.set(0, 29, 10);

    // 3. HUMAN MODEL GROUP — PERFECTLY CENTERED VERTICALLY
    // Cranium top at +66, pedestal bottom at -58 -> total span = 124 units.
    // Offsetting by Y = -4.0 centers cranium apex at +62 and pedestal at -62.
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);
    bodyGroup.add(thoracicGlow);
    bodyGroup.position.set(0, -4.0, 0);

    // HIGH-SPECULAR SILVER & CHROME METALLIC MATERIALS
    const silverMetalMat = new THREE.MeshStandardMaterial({
      color: 0x98a8bc,
      metalness: 0.95,
      roughness: 0.15,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });

    const contourWireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });

    const segmentHighlightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x446688,
      emissiveIntensity: 0.95,
      metalness: 0.98,
      roughness: 0.08,
      transparent: true,
      opacity: 0.98,
      side: THREE.DoubleSide,
    });

    const segmentMeshes: Record<string, { solid: THREE.Mesh; group: THREE.Group }> = {};

    const createBodySegment = (id: string, geo: THREE.BufferGeometry, posY: number, parent: THREE.Group, scale = 1) => {
      const segGroup = new THREE.Group();
      segGroup.position.y = posY;
      segGroup.scale.set(scale, scale, scale);

      const solidMesh = new THREE.Mesh(geo, silverMetalMat);
      segGroup.add(solidMesh);

      const wireMesh = new THREE.Mesh(geo, contourWireMat);
      segGroup.add(wireMesh);

      parent.add(segGroup);
      segmentMeshes[id] = { solid: solidMesh, group: segGroup };
      return segGroup;
    };

    // A. HEAD & NECK
    const headGroup = new THREE.Group();
    bodyGroup.add(headGroup);

    // Cranium with cranial vault (top reaches Y = +66)
    const craniumGeo = new THREE.SphereGeometry(7.6, 28, 24);
    craniumGeo.scale(1.0, 1.25, 1.08);
    createBodySegment("cranium", craniumGeo, 56.5, headGroup);

    // Contoured Jaw / Mandible
    const jawGeo = new THREE.CylinderGeometry(4.8, 3.4, 5.8, 20, 2);
    jawGeo.scale(1.0, 1.0, 0.92);
    createBodySegment("jaw", jawGeo, 49.5, headGroup);

    // Anatomical Neck with Sternocleidomastoid taper
    const neckGeo = new THREE.CylinderGeometry(3.6, 4.4, 7.6, 20, 3);
    createBodySegment("neck", neckGeo, 44.0, headGroup);

    // B. TORSO, SHOULDERS & CHEST
    const torsoGroup = new THREE.Group();
    bodyGroup.add(torsoGroup);

    // Clavicular Trapezius Bridge
    const shoulderGeo = new THREE.CylinderGeometry(17.2, 16.0, 5.0, 24, 2);
    createBodySegment("shoulder", shoulderGeo, 38.5, torsoGroup);

    // Deltoid Shoulder Caps
    const deltoidGeo = new THREE.SphereGeometry(4.2, 16, 14);
    const leftDeltoid = createBodySegment("deltoid_l", deltoidGeo, 38.0, torsoGroup);
    leftDeltoid.position.x = -18.2;
    const rightDeltoid = createBodySegment("deltoid_r", deltoidGeo, 38.0, torsoGroup);
    rightDeltoid.position.x = 18.2;

    // Sculpted Thorax & Pectoral Ribcage
    const chestGeo = new THREE.CylinderGeometry(16.2, 13.5, 16.0, 24, 4);
    chestGeo.scale(1.08, 1.0, 0.82);
    createBodySegment("chest", chestGeo, 29.5, torsoGroup);

    // Natural Waist & Abdominal Wall (Waistband top is at Y = 17.5)
    const waistGeo = new THREE.CylinderGeometry(12.5, 13.5, 12.5, 22, 3);
    waistGeo.scale(1.02, 1.0, 0.78);
    createBodySegment("waist", waistGeo, 16.5, torsoGroup);

    // Pelvis & Iliac Flare (Y = 4.5)
    const pelvisGeo = new THREE.CylinderGeometry(13.8, 15.8, 13.5, 24, 3);
    pelvisGeo.scale(1.08, 1.0, 0.85);
    createBodySegment("hip", pelvisGeo, 4.5, bodyGroup);

    // C. RELAXED TAILORING A-POSE ARMS
    const createArm = (isRight: boolean) => {
      const armGroup = new THREE.Group();
      const sign = isRight ? 1 : -1;
      armGroup.position.set(sign * 18.2, 37.0, 0);
      armGroup.rotation.z = sign * -0.18;
      armGroup.rotation.x = 0.05;

      // Bicep
      const bicepGeo = new THREE.CylinderGeometry(3.2, 2.6, 16.5, 16, 3);
      createBodySegment(isRight ? "bicep_r" : "bicep_l", bicepGeo, -8.5, armGroup);

      // Elbow
      const elbowGeo = new THREE.SphereGeometry(2.4, 12, 10);
      createBodySegment(isRight ? "elbow_r" : "elbow_l", elbowGeo, -17.5, armGroup);

      // Forearm
      const forearmGeo = new THREE.CylinderGeometry(2.5, 2.0, 15.0, 16, 3);
      createBodySegment(isRight ? "forearm_r" : "forearm_l", forearmGeo, -25.5, armGroup);

      // Hand
      const handGeo = new THREE.BoxGeometry(2.4, 6.8, 1.4);
      createBodySegment(isRight ? "hand_r" : "hand_l", handGeo, -35.5, armGroup);

      bodyGroup.add(armGroup);
    };

    createArm(false);
    createArm(true);

    // D. PLANTED ATHLETIC LEGS (Crotch junction at Y: -0.5, Trouser hem at Y: -53.5, Feet at Y: -55.5)
    const createLeg = (isRight: boolean) => {
      const legGroup = new THREE.Group();
      const sign = isRight ? 1 : -1;
      legGroup.position.set(sign * 6.8, 0, 0);

      // Thigh
      const thighGeo = new THREE.CylinderGeometry(5.4, 3.9, 26.0, 18, 3);
      createBodySegment(isRight ? "thigh_r" : "thigh_l", thighGeo, -13.5, legGroup);

      // Knee Joint
      const kneeGeo = new THREE.SphereGeometry(3.5, 14, 12);
      createBodySegment(isRight ? "knee_r" : "knee_l", kneeGeo, -27.5, legGroup);

      // Calf / Shin
      const calfGeo = new THREE.CylinderGeometry(3.8, 2.5, 26.0, 18, 3);
      createBodySegment(isRight ? "calf_r" : "calf_l", calfGeo, -41.5, legGroup);

      // Foot & Ankle
      const footGeo = new THREE.BoxGeometry(3.5, 3.0, 10.5);
      const foot = createBodySegment(isRight ? "foot_r" : "foot_l", footGeo, -55.5, legGroup);
      foot.position.z = 2.5;

      bodyGroup.add(legGroup);
    };

    createLeg(false);
    createLeg(true);

    // E. STUDIO TURNTABLE PEDESTAL & GROUND SHADOW
    const pedestalGroup = new THREE.Group();
    pedestalGroup.position.y = -57.5;
    bodyGroup.add(pedestalGroup);

    const baseDisk = new THREE.Mesh(
      new THREE.CylinderGeometry(28, 28, 1.0, 48),
      new THREE.MeshStandardMaterial({
        color: 0x141820,
        roughness: 0.25,
        metalness: 0.90,
        transparent: true,
        opacity: 0.8,
      })
    );
    pedestalGroup.add(baseDisk);

    // Contact Ground Shadow Disc with soft falloff
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext("2d");
    if (sctx) {
      const grad = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.95)");
      grad.addColorStop(0.4, "rgba(0, 0, 0, 0.55)");
      grad.addColorStop(0.8, "rgba(0, 0, 0, 0.15)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(54, 54),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      })
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.6;
    pedestalGroup.add(shadowMesh);

    // 4. ANATOMICALLY CONNECTED MEASUREMENT CALIPER GUIDES
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x334455,
      emissiveIntensity: 0.45,
      metalness: 0.95,
      roughness: 0.12,
      transparent: true,
      opacity: 0.82,
    });

    const activeRingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x6688aa,
      emissiveIntensity: 1.0,
      metalness: 0.98,
      roughness: 0.05,
      transparent: true,
      opacity: 1.0,
    });

    const createCaliperLoop = (radius: number, yPos: number, scaleZ = 0.82) => {
      const ringGroup = new THREE.Group();
      ringGroup.position.y = yPos;

      const geo = new THREE.TorusGeometry(radius, 0.32, 12, 48);
      geo.rotateX(Math.PI / 2);
      geo.scale(1, 1, scaleZ);
      const mesh = new THREE.Mesh(geo, ringMat);
      ringGroup.add(mesh);

      // Front Diamond Node
      const nodeGeo = new THREE.OctahedronGeometry(1.0, 0);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const nodeMesh = new THREE.Mesh(nodeGeo, nodeMat);
      nodeMesh.position.set(0, 0, radius * scaleZ);
      ringGroup.add(nodeMesh);

      bodyGroup.add(ringGroup);
      return { group: ringGroup, mesh, nodeMesh, baseY: yPos };
    };

    const caliperLoops: Record<string, ReturnType<typeof createCaliperLoop>> = {
      shoulder: createCaliperLoop(18.2, 38.5, 0.80),
      chest: createCaliperLoop(16.5, 29.5, 0.82),
      waist: createCaliperLoop(13.2, 16.5, 0.78),
      hip: createCaliperLoop(15.8, 4.5, 0.85),
    };

    // 5. ANATOMICALLY ACCURATE INSEAM & OUTSEAM 3D CALIPER GUIDES
    const legGuidesGroup = new THREE.Group();
    bodyGroup.add(legGuidesGroup);

    // ==========================================
    // A. INSEAM: Crotch Seam Junction down to Ankle Hem along Inner Leg
    // ==========================================
    const inseamCurvePoints = [
      new THREE.Vector3(1.6, -0.5, 0.8),    // Point 0: Crotch Seam Apex
      new THREE.Vector3(2.4, -13.5, 0.8),   // Point 1: Inner Medial Thigh
      new THREE.Vector3(3.3, -27.5, 0.8),   // Point 2: Inner Knee Joint
      new THREE.Vector3(3.9, -41.5, 0.8),   // Point 3: Inner Medial Calf
      new THREE.Vector3(4.3, -53.5, 0.8),   // Point 4: Inner Ankle / Trouser Hem
    ];
    const inseamSpline = new THREE.CatmullRomCurve3(inseamCurvePoints);
    const inseamTubeGeo = new THREE.TubeGeometry(inseamSpline, 36, 0.40, 12, false);
    const inseamMat = new THREE.MeshStandardMaterial({
      color: 0x99ddff,
      emissive: 0x0088cc,
      emissiveIntensity: 0.65,
      metalness: 0.98,
      roughness: 0.08,
      transparent: true,
      opacity: 0.90,
    });
    const inseamMesh = new THREE.Mesh(inseamTubeGeo, inseamMat);
    legGuidesGroup.add(inseamMesh);

    // Inseam Upper Endpoint: Crotch Seam Caliper Tick & Node
    const caliperNodeGeo = new THREE.OctahedronGeometry(1.2, 0);
    const crotchNodeMat = new THREE.MeshBasicMaterial({ color: 0x99eeff });
    const crotchNodeMesh = new THREE.Mesh(caliperNodeGeo, crotchNodeMat);
    crotchNodeMesh.position.set(1.6, -0.5, 0.8);
    legGuidesGroup.add(crotchNodeMesh);

    const tickLineMat = new THREE.LineBasicMaterial({ color: 0x99eeff, transparent: true, opacity: 0.95 });
    const crotchTickGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.8, -0.5, 0.8),
      new THREE.Vector3(4.0, -0.5, 0.8),
    ]);
    const crotchTickLine = new THREE.Line(crotchTickGeo, tickLineMat);
    legGuidesGroup.add(crotchTickLine);

    // Inseam Lower Endpoint: Bottom Hem Caliper Tick & Node
    const hemNodeMesh = new THREE.Mesh(caliperNodeGeo, crotchNodeMat);
    hemNodeMesh.position.set(4.3, -53.5, 0.8);
    legGuidesGroup.add(hemNodeMesh);

    const hemTickGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(1.8, -53.5, 0.8),
      new THREE.Vector3(6.8, -53.5, 0.8),
    ]);
    const hemTickLine = new THREE.Line(hemTickGeo, tickLineMat);
    legGuidesGroup.add(hemTickLine);

    // ==========================================
    // B. OUTSEAM: Waistband down to Ankle Hem along Lateral Outer Leg
    // ==========================================
    const outseamCurvePoints = [
      new THREE.Vector3(13.5, 17.5, 0.6),   // Point 0: Top of Waistband
      new THREE.Vector3(15.5, 4.5, 0.6),    // Point 1: Lateral Hip / Iliac Crest
      new THREE.Vector3(12.2, -13.5, 0.6),  // Point 2: Lateral Thigh
      new THREE.Vector3(10.3, -27.5, 0.6),  // Point 3: Lateral Knee
      new THREE.Vector3(9.8, -41.5, 0.6),   // Point 4: Lateral Calf
      new THREE.Vector3(9.3, -53.5, 0.6),   // Point 5: Lateral Trouser Hem
    ];
    const outseamSpline = new THREE.CatmullRomCurve3(outseamCurvePoints);
    const outseamTubeGeo = new THREE.TubeGeometry(outseamSpline, 42, 0.36, 12, false);
    const outseamMat = new THREE.MeshStandardMaterial({
      color: 0xffdfba,
      emissive: 0xaa6622,
      emissiveIntensity: 0.50,
      metalness: 0.98,
      roughness: 0.10,
      transparent: true,
      opacity: 0.85,
    });
    const outseamMesh = new THREE.Mesh(outseamTubeGeo, outseamMat);
    legGuidesGroup.add(outseamMesh);

    // Outseam Upper Endpoint: Waistband Caliper Tick & Node
    const outseamNodeMat = new THREE.MeshBasicMaterial({ color: 0xffeedd });
    const waistNodeMesh = new THREE.Mesh(caliperNodeGeo, outseamNodeMat);
    waistNodeMesh.position.set(13.5, 17.5, 0.6);
    legGuidesGroup.add(waistNodeMesh);

    const outseamTickMat = new THREE.LineBasicMaterial({ color: 0xffeedd, transparent: true, opacity: 0.95 });
    const waistTickGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(11.0, 17.5, 0.6),
      new THREE.Vector3(16.0, 17.5, 0.6),
    ]);
    const waistTickLine = new THREE.Line(waistTickGeo, outseamTickMat);
    legGuidesGroup.add(waistTickLine);

    // Outseam Lower Endpoint: Lateral Trouser Hem Tick & Node
    const outerHemNodeMesh = new THREE.Mesh(caliperNodeGeo, outseamNodeMat);
    outerHemNodeMesh.position.set(9.3, -53.5, 0.6);
    legGuidesGroup.add(outerHemNodeMesh);

    const outerHemTickGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(7.0, -53.5, 0.6),
      new THREE.Vector3(11.6, -53.5, 0.6),
    ]);
    const outerHemTickLine = new THREE.Line(outerHemTickGeo, outseamTickMat);
    legGuidesGroup.add(outerHemTickLine);

    // 6. TRAVELING VERTICAL SCANNING LASER PLANE
    const scanPlaneGroup = new THREE.Group();
    bodyGroup.add(scanPlaneGroup);

    const scanPlaneGeo = new THREE.PlaneGeometry(54, 38);
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const scanPlane = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanPlane.rotation.x = Math.PI / 2;
    scanPlaneGroup.add(scanPlane);

    // Glowing Laser Edge Line
    const laserLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-27, 0, 0),
      new THREE.Vector3(27, 0, 0),
    ]);
    const laserLine = new THREE.Line(
      laserLineGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
    );
    scanPlaneGroup.add(laserLine);

    // Attached Laser Point Light (Casts moving illumination onto anatomical curves)
    const laserLight = new THREE.PointLight(0xffffff, 3.8, 48);
    scanPlaneGroup.add(laserLight);

    // 7. INTERACTION & CONTROLLED DRAGGING — NO DRIFT ON RELEASE
    let isDragging = false;
    let previousPointerX = 0;
    let userRotationY = 0;
    let targetRotationY = 0;

    resetCallbackRef.current = () => {
      targetRotationY = 0;
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      previousPointerX = e.clientX;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousPointerX;
      targetRotationY += deltaX * 0.008;
      previousPointerX = e.clientX;
    };

    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      targetRotationY = userRotationY;
    };

    if (interactive) {
      mount.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    }

    // 8. ANIMATION LOOP
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsed = (performance.now() - startTime) / 1000;

      // Sequential Entrance Reveal (0 to 0.8s)
      const revealProgress = Math.min(elapsed / 0.8, 1);
      const revealEase = 1 - Math.pow(1 - revealProgress, 3);
      silverMetalMat.opacity = 0.92 * revealEase;
      contourWireMat.opacity = 0.35 * revealEase;

      // Rotation damping that halts immediately on release
      userRotationY += (targetRotationY - userRotationY) * 0.25;
      bodyGroup.rotation.y = userRotationY;

      // Traveling Scan Beam (from shoulders Y: 42 to hips/inseam Y: -25)
      const scanY = 9 + Math.sin(elapsed * 1.8) * 33;
      scanPlaneGroup.position.y = scanY;

      // Highlight active body segment
      Object.keys(segmentMeshes).forEach((key) => {
        const seg = segmentMeshes[key];
        const isActive = activeZone && (key === activeZone || key.startsWith(activeZone));
        seg.solid.material = isActive ? segmentHighlightMat : silverMetalMat;
      });

      // Caliper loops pulse
      Object.keys(caliperLoops).forEach((key) => {
        const loop = caliperLoops[key];
        const isActive = activeZone === key;
        const distToLaser = Math.abs(loop.baseY - scanY);
        const laserPulse = Math.max(0, 1 - distToLaser / 8) * 0.12;
        loop.mesh.material = isActive ? activeRingMat : ringMat;
        loop.group.scale.setScalar(isActive ? 1.08 : 1.0 + laserPulse);
      });

      // Inseam guide dynamic lighting
      const isInseamActive = activeZone === "inseam";
      inseamMat.emissiveIntensity = isInseamActive ? 1.4 : 0.65;
      crotchNodeMesh.scale.setScalar(isInseamActive ? 1.35 : 1.0);
      hemNodeMesh.scale.setScalar(isInseamActive ? 1.35 : 1.0);

      // Outseam guide dynamic lighting
      const isOutseamActive = activeZone === "outseam";
      outseamMat.emissiveIntensity = isOutseamActive ? 1.4 : 0.50;
      waistNodeMesh.scale.setScalar(isOutseamActive ? 1.35 : 1.0);
      outerHemNodeMesh.scale.setScalar(isOutseamActive ? 1.35 : 1.0);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      updateCameraFraming(w, h);
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        mount.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      }
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive, activeZone]);

  const inseamVal = currentValues?.inseam ? String(currentValues.inseam) : "82";
  const outseamVal = currentValues?.outseam
    ? String(currentValues.outseam)
    : String(Number(inseamVal) + 24);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-[520px] sm:h-[580px] cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Precision Caliper HUD Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-5">
        {/* Top Header Technical Tag with Reset View Button */}
        <div className="flex items-center justify-between text-[10px] font-mono text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-medium uppercase tracking-wider">3D ANTHROPOMETRIC RIG</span>
          </span>
          <button
            type="button"
            onClick={() => resetCallbackRef.current?.()}
            className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/90 hover:text-white border border-white/15 transition-colors text-[10px]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET VIEW</span>
          </button>
        </div>

        {/* Anatomically Pinned Callouts with Guaranteed Non-Overlapping Interleaved Heights */}
        <div className="relative flex-1 my-2 pointer-events-none">
          {/* ======================================================== */}
          {/* LEFT FLANK: 01 Shoulders (14%), 03 Waist (38%), 05 Inseam (62%) */}
          {/* ======================================================== */}

          {/* 01 Shoulders */}
          <div
            onClick={() => onSelectDimension?.("shoulder")}
            onMouseEnter={() => setHoveredZone("shoulder")}
            onMouseLeave={() => setHoveredZone(null)}
            style={{ top: "14%", left: "0px" }}
            className={`absolute pointer-events-auto group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer shadow-xl ${
              activeZone === "shoulder"
                ? "border-white bg-white/20 text-white"
                : "border-white/15 bg-[#0a0c10]/90 text-neutral-300 hover:border-white/40 hover:text-white"
            }`}
          >
            <span className="text-[9px] uppercase tracking-wider font-semibold">01 // SHOULDERS</span>
            <span className="font-bold text-white text-[11px] font-mono">
              {currentValues?.shoulder ? `${currentValues.shoulder} ${unit}` : "46 cm"}
            </span>
          </div>

          {/* 03 Natural Waist */}
          <div
            onClick={() => onSelectDimension?.("waist")}
            onMouseEnter={() => setHoveredZone("waist")}
            onMouseLeave={() => setHoveredZone(null)}
            style={{ top: "38%", left: "0px" }}
            className={`absolute pointer-events-auto group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer shadow-xl ${
              activeZone === "waist"
                ? "border-white bg-white/20 text-white"
                : "border-white/15 bg-[#0a0c10]/90 text-neutral-300 hover:border-white/40 hover:text-white"
            }`}
          >
            <span className="text-[9px] uppercase tracking-wider font-semibold">03 // WAIST</span>
            <span className="font-bold text-white text-[11px] font-mono">
              {currentValues?.waist ? `${currentValues.waist} ${unit}` : "84 cm"}
            </span>
          </div>

          {/* 05 Inner Inseam (Safely beside inner leg at 62%, WELL ABOVE the feet) */}
          <div
            onClick={() => onSelectDimension?.("inseam")}
            onMouseEnter={() => setHoveredZone("inseam")}
            onMouseLeave={() => setHoveredZone(null)}
            style={{ top: "62%", left: "0px" }}
            className={`absolute pointer-events-auto group flex flex-col gap-0.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer shadow-xl ${
              activeZone === "inseam"
                ? "border-cyan-300 bg-cyan-950/40 text-cyan-200 ring-1 ring-cyan-400/50"
                : "border-cyan-500/30 bg-[#0a0c10]/90 text-neutral-300 hover:border-cyan-400 hover:text-white"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-cyan-200">05 // INSEAM</span>
              <span className="font-bold text-white text-[11px] font-mono">
                {inseamVal} {unit}
              </span>
            </div>
            <span className="text-[7.5px] text-cyan-400/80 font-mono tracking-tight">
              CROTCH SEAM → HEM (INNER)
            </span>
          </div>

          {/* ======================================================== */}
          {/* RIGHT FLANK: 02 Chest (25%), 04 Hips (49%), 06 Outseam (73%) */}
          {/* ======================================================== */}

          {/* 02 Chest / Bust */}
          <div
            onClick={() => onSelectDimension?.("chest")}
            onMouseEnter={() => setHoveredZone("chest")}
            onMouseLeave={() => setHoveredZone(null)}
            style={{ top: "25%", right: "0px" }}
            className={`absolute pointer-events-auto group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer shadow-xl ${
              activeZone === "chest"
                ? "border-white bg-white/20 text-white"
                : "border-white/15 bg-[#0a0c10]/90 text-neutral-300 hover:border-white/40 hover:text-white"
            }`}
          >
            <span className="text-[9px] uppercase tracking-wider font-semibold">02 // CHEST</span>
            <span className="font-bold text-white text-[11px] font-mono">
              {currentValues?.chest ? `${currentValues.chest} ${unit}` : "98 cm"}
            </span>
          </div>

          {/* 04 Pelvic Seat / Hips */}
          <div
            onClick={() => onSelectDimension?.("hip")}
            onMouseEnter={() => setHoveredZone("hip")}
            onMouseLeave={() => setHoveredZone(null)}
            style={{ top: "49%", right: "0px" }}
            className={`absolute pointer-events-auto group flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer shadow-xl ${
              activeZone === "hip"
                ? "border-white bg-white/20 text-white"
                : "border-white/15 bg-[#0a0c10]/90 text-neutral-300 hover:border-white/40 hover:text-white"
            }`}
          >
            <span className="text-[9px] uppercase tracking-wider font-semibold">04 // HIPS</span>
            <span className="font-bold text-white text-[11px] font-mono">
              {currentValues?.hip ? `${currentValues.hip} ${unit}` : "102 cm"}
            </span>
          </div>

          {/* 06 Outer Outseam (Safely beside outer leg at 73%, WELL ABOVE the feet) */}
          <div
            onClick={() => onSelectDimension?.("outseam")}
            onMouseEnter={() => setHoveredZone("outseam")}
            onMouseLeave={() => setHoveredZone(null)}
            style={{ top: "73%", right: "0px" }}
            className={`absolute pointer-events-auto group flex flex-col gap-0.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer shadow-xl ${
              activeZone === "outseam"
                ? "border-amber-300 bg-amber-950/40 text-amber-200 ring-1 ring-amber-400/50"
                : "border-amber-500/30 bg-[#0a0c10]/90 text-neutral-300 hover:border-amber-400 hover:text-white"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] uppercase tracking-wider font-semibold text-amber-200">06 // OUTSEAM</span>
              <span className="font-bold text-white text-[11px] font-mono">
                {outseamVal} {unit}
              </span>
            </div>
            <span className="text-[7.5px] text-amber-300/80 font-mono tracking-tight">
              WAISTBAND → HEM (OUTER)
            </span>
          </div>
        </div>

        {/* Footer Coordinate Ticks (At bottom ~94%, completely clear of the feet at 86-92%) */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/15 text-[9.5px] font-mono text-neutral-400">
          <span className="tracking-wide uppercase">360° TURNTABLE: DRAG ROTATE</span>
          <span className="tracking-wide uppercase text-neutral-300">
            <span className="text-cyan-400">INSEAM:</span> INNER SEAM // <span className="text-amber-300">OUTSEAM:</span> WAIST-TO-HEM
          </span>
        </div>
      </div>
    </div>
  );
}
