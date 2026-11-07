"use client";

import * as React from "react";
import * as THREE from "three";
import { RotateCcw } from "lucide-react";

interface BodyMesh3DProps {
  interactive?: boolean;
  activeDimension?: "height" | "chest" | "waist" | "hip" | "shoulder" | "inseam" | null;
  onSelectDimension?: (dim: "height" | "chest" | "waist" | "hip" | "shoulder" | "inseam") => void;
  currentValues?: {
    height?: number | string;
    chest?: number | string;
    waist?: number | string;
    hip?: number | string;
    shoulder?: number | string;
    inseam?: number | string;
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

    // Camera framed so the COMPLETE human body + pedestal (from top of cranium to bottom of feet)
    // is 100% visible with ~11% headroom and ~11% footroom.
    const fov = 37;
    const camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 1000);

    const updateCameraFraming = (w: number, h: number) => {
      const aspect = w / h;
      camera.aspect = aspect;
      // Base distance: 236 gives 158 units of visible vertical height on desktop.
      // Total model height + pedestal = 124 units (78.5% height utilization).
      // On narrow mobile cards (aspect < 0.75), scale distance proportionally to keep ample horizontal clearance for flanking badges.
      const baseDistance = 236;
      const targetDist = aspect < 0.75 ? baseDistance * (0.78 / Math.max(aspect, 0.48)) : baseDistance;
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
    // Model bounds: Cranium top = +66, Pedestal bottom = -58. Total span = 124.
    // Offsetting bodyGroup by Y = -4.0 places cranium top at +62 and pedestal at -62, perfectly centered around Y = 0!
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

    // Natural Waist & Abdominal Wall
    const waistGeo = new THREE.CylinderGeometry(12.5, 13.5, 12.5, 22, 3);
    waistGeo.scale(1.02, 1.0, 0.78);
    createBodySegment("waist", waistGeo, 16.5, torsoGroup);

    // Pelvis & Iliac Flare
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

    // D. PLANTED ATHLETIC LEGS (from crotch Y: 0 to feet bottom Y: -57.0)
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

    // 5. ANATOMICALLY ACCURATE INSEAM CALIPER SYSTEM (Crotch Seam to Bottom Hem along Inner Leg)
    const inseamGroup = new THREE.Group();
    bodyGroup.add(inseamGroup);

    // Inner leg seam curve coordinates: from crotch seam apex down inner right leg to bottom hem
    const inseamCurvePoints = [
      new THREE.Vector3(1.8, -0.5, 0.6),    // 0: Crotch Seam Junction
      new THREE.Vector3(2.7, -14.0, 0.8),   // 1: Inner Medial Thigh
      new THREE.Vector3(3.4, -27.5, 0.8),   // 2: Inner Knee Joint
      new THREE.Vector3(4.0, -41.0, 0.7),   // 3: Inner Medial Calf
      new THREE.Vector3(4.4, -54.0, 0.6),   // 4: Bottom Hem / Inner Ankle
    ];
    const inseamSpline = new THREE.CatmullRomCurve3(inseamCurvePoints);
    const inseamTubeGeo = new THREE.TubeGeometry(inseamSpline, 36, 0.36, 12, false);
    const inseamSeamMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x446688,
      emissiveIntensity: 0.6,
      metalness: 0.98,
      roughness: 0.08,
      transparent: true,
      opacity: 0.85,
    });
    const inseamSeamMesh = new THREE.Mesh(inseamTubeGeo, inseamSeamMat);
    inseamGroup.add(inseamSeamMesh);

    // Crotch Seam Apex Caliper Diamond Indicator & Horizontal Caliper Tick
    const crotchNodeGeo = new THREE.OctahedronGeometry(1.2, 0);
    const crotchNodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const crotchNodeMesh = new THREE.Mesh(crotchNodeGeo, crotchNodeMat);
    crotchNodeMesh.position.set(1.8, -0.5, 0.6);
    inseamGroup.add(crotchNodeMesh);

    const crotchTickGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.6, -0.5, 0.6),
      new THREE.Vector3(4.2, -0.5, 0.6),
    ]);
    const tickMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 });
    const crotchTickLine = new THREE.Line(crotchTickGeo, tickMat);
    inseamGroup.add(crotchTickLine);

    // Bottom Hem Caliper Diamond Indicator & Horizontal Caliper Tick
    const hemNodeMesh = new THREE.Mesh(crotchNodeGeo, crotchNodeMat);
    hemNodeMesh.position.set(4.4, -54.0, 0.6);
    inseamGroup.add(hemNodeMesh);

    const hemTickGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(2.0, -54.0, 0.6),
      new THREE.Vector3(6.8, -54.0, 0.6),
    ]);
    const hemTickLine = new THREE.Line(hemTickGeo, tickMat);
    inseamGroup.add(hemTickLine);

    // Subtle Outseam Reference Spline (Waistband to Hem along Lateral Hip/Leg)
    const outseamCurvePoints = [
      new THREE.Vector3(13.2, 16.5, 0.4),   // Waistband
      new THREE.Vector3(15.2, 4.5, 0.5),    // Lateral Hip
      new THREE.Vector3(12.2, -14.0, 0.5),  // Lateral Thigh
      new THREE.Vector3(10.2, -27.5, 0.5),  // Lateral Knee
      new THREE.Vector3(9.2, -54.0, 0.5),   // Lateral Hem
    ];
    const outseamSpline = new THREE.CatmullRomCurve3(outseamCurvePoints);
    const outseamTubeGeo = new THREE.TubeGeometry(outseamSpline, 36, 0.18, 8, false);
    const outseamMat = new THREE.MeshBasicMaterial({
      color: 0x556677,
      transparent: true,
      opacity: 0.35,
    });
    const outseamMesh = new THREE.Mesh(outseamTubeGeo, outseamMat);
    inseamGroup.add(outseamMesh);

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

      // Inseam guide highlighting
      const isInseamActive = activeZone === "inseam";
      inseamSeamMat.emissiveIntensity = isInseamActive ? 1.4 : 0.45;
      inseamSeamMat.opacity = isInseamActive ? 1.0 : 0.75;
      crotchNodeMesh.scale.setScalar(isInseamActive ? 1.35 : 1.0);
      hemNodeMesh.scale.setScalar(isInseamActive ? 1.35 : 1.0);

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

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-[500px] sm:h-[560px] cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Precision Caliper HUD Callouts with Balanced Flanking Layout */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-3 sm:p-5">
        {/* Top Header Technical Tag with Reset View Button */}
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-[#888]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-medium uppercase tracking-wide">3D ANTHROPOMETRIC RIG</span>
          </span>
          <button
            type="button"
            onClick={() => resetCallbackRef.current?.()}
            className="pointer-events-auto flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors text-[9px] sm:text-[10px]"
          >
            <RotateCcw className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span>RESET VIEW</span>
          </button>
        </div>

        {/* Balanced Anatomical Measurement Callouts across Left & Right Flanks */}
        <div className="relative flex-1 my-2 flex items-center justify-between pointer-events-none">
          {/* Left Flank Callouts: Shoulders (Top), Waist (Center), Inseam (Lower) */}
          <div className="flex flex-col justify-between h-[85%] pointer-events-auto z-20 space-y-3 sm:space-y-4">
            {/* Shoulders */}
            <div
              onClick={() => onSelectDimension?.("shoulder")}
              onMouseEnter={() => setHoveredZone("shoulder")}
              onMouseLeave={() => setHoveredZone(null)}
              className={`group flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer shadow-xl ${
                activeZone === "shoulder"
                  ? "border-white bg-white/20 text-white"
                  : "border-white/10 bg-[#0c0d12]/85 text-[#888] hover:border-white/30 hover:text-white"
              }`}
            >
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider">01 // SHOULDERS</span>
              <span className="font-bold text-white text-[10px] sm:text-[11px]">
                {currentValues?.shoulder ? `${currentValues.shoulder} ${unit}` : "46 cm"}
              </span>
            </div>

            {/* Natural Waist */}
            <div
              onClick={() => onSelectDimension?.("waist")}
              onMouseEnter={() => setHoveredZone("waist")}
              onMouseLeave={() => setHoveredZone(null)}
              className={`group flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer shadow-xl ${
                activeZone === "waist"
                  ? "border-white bg-white/20 text-white"
                  : "border-white/10 bg-[#0c0d12]/85 text-[#888] hover:border-white/30 hover:text-white"
              }`}
            >
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider">03 // WAIST</span>
              <span className="font-bold text-white text-[10px] sm:text-[11px]">
                {currentValues?.waist ? `${currentValues.waist} ${unit}` : "84 cm"}
              </span>
            </div>

            {/* Inner Inseam (Crotch Seam to Bottom Hem along inside leg) */}
            <div
              onClick={() => onSelectDimension?.("inseam")}
              onMouseEnter={() => setHoveredZone("inseam")}
              onMouseLeave={() => setHoveredZone(null)}
              className={`group flex flex-col gap-0.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer shadow-xl ${
                activeZone === "inseam"
                  ? "border-white bg-white/20 text-white"
                  : "border-white/10 bg-[#0c0d12]/85 text-[#888] hover:border-white/30 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                <span className="text-[8px] sm:text-[9px] uppercase tracking-wider">05 // INSEAM</span>
                <span className="font-bold text-white text-[10px] sm:text-[11px]">
                  {currentValues?.inseam ? `${currentValues.inseam} ${unit}` : "82 cm"}
                </span>
              </div>
              <span className="text-[7px] sm:text-[8px] text-[#708095] tracking-tight">CROTCH SEAM → HEM</span>
            </div>
          </div>

          {/* Right Flank Callouts: Chest (Top), Hips (Lower) */}
          <div className="flex flex-col justify-around h-[70%] pointer-events-auto z-20 space-y-4 sm:space-y-6">
            {/* Chest / Bust */}
            <div
              onClick={() => onSelectDimension?.("chest")}
              onMouseEnter={() => setHoveredZone("chest")}
              onMouseLeave={() => setHoveredZone(null)}
              className={`group flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer shadow-xl ${
                activeZone === "chest"
                  ? "border-white bg-white/20 text-white"
                  : "border-white/10 bg-[#0c0d12]/85 text-[#888] hover:border-white/30 hover:text-white"
              }`}
            >
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider">02 // CHEST</span>
              <span className="font-bold text-white text-[10px] sm:text-[11px]">
                {currentValues?.chest ? `${currentValues.chest} ${unit}` : "98 cm"}
              </span>
            </div>

            {/* Pelvic Seat / Hips */}
            <div
              onClick={() => onSelectDimension?.("hip")}
              onMouseEnter={() => setHoveredZone("hip")}
              onMouseLeave={() => setHoveredZone(null)}
              className={`group flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer shadow-xl ${
                activeZone === "hip"
                  ? "border-white bg-white/20 text-white"
                  : "border-white/10 bg-[#0c0d12]/85 text-[#888] hover:border-white/30 hover:text-white"
              }`}
            >
              <span className="text-[8px] sm:text-[9px] uppercase tracking-wider">04 // HIPS</span>
              <span className="font-bold text-white text-[10px] sm:text-[11px]">
                {currentValues?.hip ? `${currentValues.hip} ${unit}` : "102 cm"}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Coordinate Ticks */}
        <div className="flex items-center justify-between pt-2.5 border-t border-white/10 text-[9px] font-mono text-[#666]">
          <span>HORIZONTAL YAW: DRAG 360°</span>
          <span>INSEAM: INNER SEAM // OUTSEAM: WAIST-TO-HEM</span>
        </div>
      </div>
    </div>
  );
}
