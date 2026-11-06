"use client";

import * as React from "react";
import * as THREE from "three";

interface MarkerDefinition {
  id: "shoulder" | "chest" | "waist" | "hip" | "inseam";
  label: string;
  defaultVal: number;
  unit: string;
  posY: number;
  radius: number;
  description: string;
}

const MARKERS: MarkerDefinition[] = [
  { id: "shoulder", label: "SHOULDERS", defaultVal: 46.0, unit: "CM", posY: 40.0, radius: 19.5, description: "Biacromial breadth" },
  { id: "chest", label: "CHEST", defaultVal: 98.0, unit: "CM", posY: 31.0, radius: 17.6, description: "Fullest thoracic girth" },
  { id: "waist", label: "WAIST", defaultVal: 84.0, unit: "CM", posY: 17.5, radius: 14.2, description: "Narrowest natural waist" },
  { id: "hip", label: "HIPS", defaultVal: 102.0, unit: "CM", posY: 5.5, radius: 16.8, description: "Fullest pelvic width" },
  { id: "inseam", label: "INSEAM", defaultVal: 82.0, unit: "CM", posY: -22.0, radius: 11.0, description: "Inner crotch to ankle" },
];

export function ThreeSceneBackground() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [activeAnnotation, setActiveAnnotation] = React.useState<{
    label: string;
    value: string;
    description: string;
    screenX: number;
    screenY: number;
    visible: boolean;
  }>({
    label: "CHEST",
    value: "98.0 CM",
    description: "Fullest thoracic girth",
    screenX: 0,
    screenY: 0,
    visible: false,
  });

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let isMobile = width < 768;

    // 1. SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.0011);

    // Camera at z: 200, fov: 45 gives optimal perspective with zero fisheye distortion
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 200);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x050507, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. PROFESSIONAL 5-POINT CINEMATIC LIGHTING RIG
    // Ambient baseline
    const ambientLight = new THREE.AmbientLight(0x2a303c, 2.4);
    scene.add(ambientLight);

    // Overhead Key Softbox (Top-right, casting sculptural speculars)
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.5);
    keyLight.position.set(80, 160, 130);
    scene.add(keyLight);

    // Razor Cool-Blue Specular Rim Light (Silhouette pop against pitch black)
    const rimLightLeft = new THREE.DirectionalLight(0xc4dcff, 6.8);
    rimLightLeft.position.set(-150, 110, -90);
    scene.add(rimLightLeft);

    // Warm Silver Right Rim Light (Edge separation)
    const rimLightRight = new THREE.DirectionalLight(0xffffff, 5.8);
    rimLightRight.position.set(150, 110, -90);
    scene.add(rimLightRight);

    // Studio Ground Bounce Fill
    const groundBounce = new THREE.DirectionalLight(0x222834, 1.8);
    groundBounce.position.set(0, -90, 70);
    scene.add(groundBounce);

    // Internal Thoracic Chest Point Light (Translucent core glow)
    const thoracicGlow = new THREE.PointLight(0xdde8ff, 3.2, 90);
    thoracicGlow.position.set(0, 32, 12);

    // 3. MASTER SCENE ROOT GROUPS
    // Mannequin root: Positioned in center-right 35% corridor (x: 16.5) so left 38% copy and right 27% HUD are clear
    const mannequinMaster = new THREE.Group();
    scene.add(mannequinMaster);
    mannequinMaster.add(thoracicGlow);
    mannequinMaster.position.set(isMobile ? 0 : 16.5, -4, 0);

    // 3D Garment Root for Chapters 02 & 03
    const garmentMaster = new THREE.Group();
    scene.add(garmentMaster);
    garmentMaster.position.set(isMobile ? 0 : 16.5, 12, 0);
    garmentMaster.visible = false;

    // 4. LUXURY AUTOMOTIVE-GRADE METALLIC & CHROME MATERIALS
    // Solid core: Liquid silver / titanium with high specular reflectance
    const silverMetalMat = new THREE.MeshStandardMaterial({
      color: 0x8a96a6,
      metalness: 0.94,
      roughness: 0.15,
      transparent: true,
      opacity: 0.86,
      side: THREE.DoubleSide,
    });

    // Refined structural contour lines
    const contourWireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.32,
    });

    // Active highlighted body segment material
    const segmentHighlightMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x446688,
      emissiveIntensity: 0.85,
      metalness: 0.98,
      roughness: 0.08,
      transparent: true,
      opacity: 0.98,
      side: THREE.DoubleSide,
    });

    // Segment mesh tracker
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

    // A. DETAILED ANATOMICAL HUMAN MANNEQUIN
    // 1. Head & Neck
    const headGroup = new THREE.Group();
    mannequinMaster.add(headGroup);

    // Cranium with cranial vault
    const craniumGeo = new THREE.SphereGeometry(8.2, 32, 28);
    craniumGeo.scale(1.0, 1.25, 1.08);
    createBodySegment("cranium", craniumGeo, 58.5, headGroup);

    // Contoured Jaw / Mandible
    const jawGeo = new THREE.CylinderGeometry(5.2, 3.8, 6.2, 20, 2);
    jawGeo.scale(1.0, 1.0, 0.92);
    createBodySegment("jaw", jawGeo, 51.0, headGroup);

    // Anatomical Neck with Sternocleidomastoid taper
    const neckGeo = new THREE.CylinderGeometry(4.0, 4.8, 8.5, 22, 3);
    createBodySegment("neck", neckGeo, 45.5, headGroup);

    // 2. Torso, Shoulders & Chest
    const torsoGroup = new THREE.Group();
    mannequinMaster.add(torsoGroup);

    // Clavicular Trapezius Bridge
    const shoulderGeo = new THREE.CylinderGeometry(18.2, 17.0, 5.5, 24, 2);
    createBodySegment("shoulder", shoulderGeo, 40.0, torsoGroup);

    // Deltoid Shoulder Caps
    const deltoidGeo = new THREE.SphereGeometry(4.6, 18, 16);
    const leftDeltoid = createBodySegment("deltoid_l", deltoidGeo, 39.5, torsoGroup);
    leftDeltoid.position.x = -19.5;
    const rightDeltoid = createBodySegment("deltoid_r", deltoidGeo, 39.5, torsoGroup);
    rightDeltoid.position.x = 19.5;

    // Sculpted Thorax & Pectoral Ribcage
    const chestGeo = new THREE.CylinderGeometry(17.5, 14.2, 17.0, 26, 6);
    chestGeo.scale(1.08, 1.0, 0.84);
    createBodySegment("chest", chestGeo, 31.0, torsoGroup);

    // Natural Waist & Abdominal Wall
    const waistGeo = new THREE.CylinderGeometry(13.8, 14.8, 13.5, 24, 4);
    waistGeo.scale(1.02, 1.0, 0.78);
    createBodySegment("waist", waistGeo, 17.5, torsoGroup);

    // Pelvis & Iliac Flare
    const pelvisGeo = new THREE.CylinderGeometry(14.8, 17.2, 15.0, 26, 4);
    pelvisGeo.scale(1.08, 1.0, 0.85);
    createBodySegment("hip", pelvisGeo, 5.5, mannequinMaster);

    // 3. Relaxed Tailoring A-Pose Arms
    const createArm = (isRight: boolean) => {
      const armGroup = new THREE.Group();
      const sign = isRight ? 1 : -1;
      armGroup.position.set(sign * 19.5, 38.5, 0);
      armGroup.rotation.z = sign * -0.18;
      armGroup.rotation.x = 0.05;

      // Bicep
      const bicepGeo = new THREE.CylinderGeometry(3.6, 3.0, 18.0, 18, 4);
      createBodySegment(isRight ? "bicep_r" : "bicep_l", bicepGeo, -9, armGroup);

      // Elbow
      const elbowGeo = new THREE.SphereGeometry(2.8, 14, 12);
      createBodySegment(isRight ? "elbow_r" : "elbow_l", elbowGeo, -18.5, armGroup);

      // Forearm
      const forearmGeo = new THREE.CylinderGeometry(2.9, 2.3, 16.5, 18, 4);
      createBodySegment(isRight ? "forearm_r" : "forearm_l", forearmGeo, -27, armGroup);

      // Hand & Fingers
      const handGeo = new THREE.BoxGeometry(2.8, 7.5, 1.6);
      createBodySegment(isRight ? "hand_r" : "hand_l", handGeo, -38, armGroup);

      mannequinMaster.add(armGroup);
    };

    createArm(false);
    createArm(true);

    // 4. Planted Athletic Stature Legs
    const createLeg = (isRight: boolean) => {
      const legGroup = new THREE.Group();
      const sign = isRight ? 1 : -1;
      legGroup.position.set(sign * 7.5, 0, 0);

      // Muscular Thigh
      const thighGeo = new THREE.CylinderGeometry(6.0, 4.4, 28.0, 20, 4);
      createBodySegment(isRight ? "thigh_r" : "thigh_l", thighGeo, -14, legGroup);

      // Patella Knee Joint
      const kneeGeo = new THREE.SphereGeometry(4.0, 16, 14);
      createBodySegment(isRight ? "knee_r" : "knee_l", kneeGeo, -29, legGroup);

      // Contoured Shin & Calf
      const calfGeo = new THREE.CylinderGeometry(4.3, 2.8, 28.0, 20, 4);
      createBodySegment(isRight ? "calf_r" : "calf_l", calfGeo, -44, legGroup);

      // Ankle & Foot
      const footGeo = new THREE.BoxGeometry(3.8, 3.4, 11.5);
      const foot = createBodySegment(isRight ? "foot_r" : "foot_l", footGeo, -59.5, legGroup);
      foot.position.z = 2.8;

      mannequinMaster.add(legGroup);
    };

    createLeg(false);
    createLeg(true);

    // B. STUDIO REFLECTIVE GROUND PLANE & CONTACT SHADOWS
    const floorRoot = new THREE.Group();
    floorRoot.position.y = -62;
    mannequinMaster.add(floorRoot);

    // Circular studio turntable base
    const baseDisk = new THREE.Mesh(
      new THREE.CylinderGeometry(34, 34, 1.2, 64),
      new THREE.MeshStandardMaterial({
        color: 0x111318,
        roughness: 0.2,
        metalness: 0.92,
        transparent: true,
        opacity: 0.78,
      })
    );
    floorRoot.add(baseDisk);

    // Contact Ground Shadow Disc with soft falloff
    const shadowCanvas = document.createElement("canvas");
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sctx = shadowCanvas.getContext("2d");
    if (sctx) {
      const grad = sctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, "rgba(0, 0, 0, 0.95)");
      grad.addColorStop(0.35, "rgba(0, 0, 0, 0.65)");
      grad.addColorStop(0.7, "rgba(0, 0, 0, 0.2)");
      grad.addColorStop(1, "rgba(0, 0, 0, 0)");
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 256, 256);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(62, 62),
      new THREE.MeshBasicMaterial({
        map: shadowTexture,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
      })
    );
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.7;
    floorRoot.add(shadowMesh);

    // Concentric precision turntable graduation tracks
    const trackMat = new THREE.MeshBasicMaterial({ color: 0x5a6878, transparent: true, opacity: 0.45 });
    const innerTrack = new THREE.Mesh(new THREE.RingGeometry(26, 26.4, 64), trackMat);
    innerTrack.rotation.x = -Math.PI / 2;
    innerTrack.position.y = 0.65;
    floorRoot.add(innerTrack);

    const outerTrack = new THREE.Mesh(new THREE.RingGeometry(31.5, 32.0, 64), trackMat);
    outerTrack.rotation.x = -Math.PI / 2;
    outerTrack.position.y = 0.65;
    floorRoot.add(outerTrack);

    // 5. FOUR PRECISION MEASUREMENT SYSTEMS & INTERACTIVE NODES
    interface RingInstance {
      id: string;
      group: THREE.Group;
      torusMesh: THREE.Mesh;
      markerSphere: THREE.Mesh;
      baseRadius: number;
      posY: number;
    }

    const ringInstances: RingInstance[] = [];
    const interactiveRaycastTargets: THREE.Mesh[] = [];

    const guideLineMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x446688,
      emissiveIntensity: 0.5,
      metalness: 0.95,
      roughness: 0.1,
      transparent: true,
      opacity: 0.92,
    });

    const markerDefaultMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x6688aa,
      emissiveIntensity: 0.7,
      metalness: 0.98,
      roughness: 0.08,
    });

    const markerHoverMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.2,
      metalness: 1.0,
      roughness: 0.02,
    });

    MARKERS.forEach((m) => {
      const ringGroup = new THREE.Group();
      ringGroup.position.y = m.posY;

      // 3D Torus measurement ring (0.28 unit tube catching striking speculars)
      const torusGeo = new THREE.TorusGeometry(m.radius, 0.28, 14, 64);
      torusGeo.rotateX(Math.PI / 2);
      torusGeo.scale(1, 1, 0.82);
      const torusMesh = new THREE.Mesh(torusGeo, guideLineMat);
      ringGroup.add(torusMesh);

      // Glowing diamond satellite nodes at cardinal points
      const satGeo = new THREE.OctahedronGeometry(0.8, 0);
      const satMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const sat = new THREE.Mesh(satGeo, satMat);
        sat.position.set(Math.cos(angle) * m.radius, 0, Math.sin(angle) * (m.radius * 0.82));
        ringGroup.add(sat);
      }

      // Interactive Marker Sphere at front apex
      const hitSphereGeo = new THREE.SphereGeometry(1.6, 18, 16);
      const markerSphere = new THREE.Mesh(hitSphereGeo, markerDefaultMat);
      markerSphere.position.set(0, 0, m.radius * 0.82);
      markerSphere.userData = { markerId: m.id, def: m };
      ringGroup.add(markerSphere);

      interactiveRaycastTargets.push(markerSphere);
      mannequinMaster.add(ringGroup);

      ringInstances.push({
        id: m.id,
        group: ringGroup,
        torusMesh,
        markerSphere,
        baseRadius: m.radius,
        posY: m.posY,
      });
    });

    // 6. CONTINUOUS VERTICAL SCANNING LASER PLANE & MOVING ILLUMINATION
    const scanPlaneGroup = new THREE.Group();
    mannequinMaster.add(scanPlaneGroup);

    const scanPlaneGeo = new THREE.PlaneGeometry(62, 42);
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

    // Glowing laser beam edge line
    const laserLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-31, 0, 0),
      new THREE.Vector3(31, 0, 0),
    ]);
    const laserLine = new THREE.Line(
      laserLineGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
    );
    scanPlaneGroup.add(laserLine);

    // Attached Laser Point Light (Casts actual moving illumination onto anatomical curves!)
    const laserLight = new THREE.PointLight(0xffffff, 4.0, 52);
    scanPlaneGroup.add(laserLight);

    // 7. CHAPTER 02 — DETAILED 3D TAILORED GARMENT BLUEPRINT
    const garmentGeo = new THREE.CylinderGeometry(18.2, 15.4, 34, 26, 6, true);
    garmentGeo.scale(1.18, 1.0, 0.92);
    const garmentMesh = new THREE.Mesh(
      garmentGeo,
      new THREE.MeshStandardMaterial({
        color: 0xb0c4de,
        wireframe: true,
        emissive: 0x334466,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
      })
    );
    garmentMaster.add(garmentMesh);

    // Structured collar
    const garmentCollar = new THREE.Mesh(
      new THREE.TorusGeometry(8.8, 0.45, 12, 36),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.85 })
    );
    garmentCollar.rotation.x = Math.PI / 2;
    garmentCollar.position.y = 17;
    garmentMaster.add(garmentCollar);

    // Garment sleeves
    const createGarmentSleeve = (isRight: boolean) => {
      const sign = isRight ? 1 : -1;
      const sleeve = new THREE.Mesh(
        new THREE.CylinderGeometry(4.2, 3.2, 28, 16, 4, true),
        new THREE.MeshStandardMaterial({
          color: 0x8aa0bc,
          wireframe: true,
          emissive: 0x223344,
          emissiveIntensity: 0.4,
          transparent: true,
          opacity: 0.75,
        })
      );
      sleeve.position.set(sign * 21, 2, 0);
      sleeve.rotation.z = sign * -0.22;
      garmentMaster.add(sleeve);
    };
    createGarmentSleeve(false);
    createGarmentSleeve(true);

    // Chapter 02 Scanning light across garment
    const garmentScanLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-28, 0, 0),
        new THREE.Vector3(28, 0, 0),
      ]),
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 })
    );
    garmentMaster.add(garmentScanLine);

    // Chapter 03 Fit Synthesis Ease Delta Rings
    const easeDeltaRingChest = new THREE.Mesh(
      new THREE.TorusGeometry(20.5, 0.42, 14, 52),
      new THREE.MeshStandardMaterial({
        color: 0x66ffaa,
        emissive: 0x22cc77,
        emissiveIntensity: 0.85,
        transparent: true,
        opacity: 0.9,
      })
    );
    easeDeltaRingChest.rotation.x = Math.PI / 2;
    easeDeltaRingChest.position.y = 8;
    easeDeltaRingChest.visible = false;
    garmentMaster.add(easeDeltaRingChest);

    // 8. INTERACTIVE STATE TRACKING
    let userRotationY = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousPointerX = 0;
    let hasDragged = false;
    let hoveredMarkerId: string | null = null;
    let selectedMarkerId: string = "chest";

    // Mouse coordinates for lighting shift
    let mouseX = 0;
    let mouseY = 0;
    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const highlightSegment = (markerId: string | null) => {
      Object.keys(segmentMeshes).forEach((key) => {
        const seg = segmentMeshes[key];
        if (markerId && (key === markerId || key.startsWith(markerId))) {
          seg.solid.material = segmentHighlightMat;
        } else {
          seg.solid.material = silverMetalMat;
        }
      });
    };

    highlightSegment("chest");

    // Dynamic marker values
    const currentValues: Record<string, number> = {
      shoulder: 46.0,
      chest: 98.0,
      waist: 84.0,
      hip: 102.0,
      inseam: 82.0,
    };

    const updateAnnotationBadge = (markerId: string, visible: boolean) => {
      const def = MARKERS.find((m) => m.id === markerId);
      if (!def) {
        setActiveAnnotation((prev) => ({ ...prev, visible: false }));
        return;
      }

      const worldPos = new THREE.Vector3(0, def.posY, def.radius * 0.82);
      mannequinMaster.localToWorld(worldPos);
      worldPos.project(camera);

      const screenX = (worldPos.x * 0.5 + 0.5) * window.innerWidth;
      const screenY = (-(worldPos.y * 0.5) + 0.5) * window.innerHeight;

      const val = currentValues[markerId] || def.defaultVal;

      setActiveAnnotation({
        label: def.label,
        value: `${val.toFixed(1)} ${def.unit}`,
        description: def.description,
        screenX,
        screenY,
        visible,
      });
    };

    // 9. EVENT LISTENERS
    const handlePointerMove = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        if (Math.abs(deltaX) > 2) hasDragged = true;
        targetRotationY += deltaX * 0.007;
        previousPointerX = e.clientX;
        return;
      }

      // Raycast test
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(interactiveRaycastTargets);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const id = hit.userData.markerId as string;
        if (hoveredMarkerId !== id) {
          hoveredMarkerId = id;
          document.body.style.cursor = "pointer";

          interactiveRaycastTargets.forEach((target) => {
            target.material = target.userData.markerId === id ? markerHoverMat : markerDefaultMat;
          });

          highlightSegment(id);
          updateAnnotationBadge(id, true);
        }
      } else {
        if (hoveredMarkerId !== null) {
          hoveredMarkerId = null;
          document.body.style.cursor = "default";

          interactiveRaycastTargets.forEach((target) => {
            target.material = target.userData.markerId === selectedMarkerId ? markerHoverMat : markerDefaultMat;
          });

          highlightSegment(selectedMarkerId);
          updateAnnotationBadge(selectedMarkerId, false);
        }
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "BUTTON" ||
          target.tagName === "INPUT" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("input") ||
          target.closest("a"))
      ) {
        return;
      }

      isDragging = true;
      hasDragged = false;
      previousPointerX = e.clientX;
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      // IMMEDIATE STOP — Zero drift or cartoon coasting!
      targetRotationY = userRotationY;

      if (!hasDragged && hoveredMarkerId) {
        selectedMarkerId = hoveredMarkerId;
        highlightSegment(selectedMarkerId);
        updateAnnotationBadge(selectedMarkerId, true);

        window.dispatchEvent(
          new CustomEvent("fitmatch:select_dimension", {
            detail: { dimension: selectedMarkerId },
          })
        );
      }
    };

    const handleResetView = () => {
      targetRotationY = 0;
    };

    const handleDimensionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ dimension: string; value: number }>;
      const { dimension, value } = customEvent.detail;
      currentValues[dimension] = value;

      const ring = ringInstances.find((r) => r.id === dimension);
      if (ring) {
        const baseDef = MARKERS.find((m) => m.id === dimension);
        if (baseDef) {
          const scale = value / baseDef.defaultVal;
          ring.group.scale.set(scale, 1, scale);
        }
      }

      selectedMarkerId = dimension;
      highlightSegment(dimension);
      updateAnnotationBadge(dimension, true);
    };

    const handleFitPreference = (e: Event) => {
      const customEvent = e as CustomEvent<{ preference: string }>;
      const { preference } = customEvent.detail;
      easeDeltaRingChest.visible = true;

      if (preference === "slim") {
        easeDeltaRingChest.scale.set(0.94, 1, 0.94);
      } else if (preference === "relaxed") {
        easeDeltaRingChest.scale.set(1.18, 1, 1.18);
      } else {
        easeDeltaRingChest.scale.set(1.06, 1, 1.06);
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("dblclick", handleResetView);
    window.addEventListener("fitmatch:reset_view", handleResetView);
    window.addEventListener("fitmatch:dimension_change", handleDimensionChange);
    window.addEventListener("fitmatch:fit_preference", handleFitPreference);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < 768;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      mannequinMaster.position.x = isMobile ? 0 : 16.5;
      garmentMaster.position.x = isMobile ? 0 : 16.5;
    };
    window.addEventListener("resize", handleResize);

    // 10. ANIMATION LOOP — CHOREOGRAPHED HERO REVEAL & CHAPTER TRANSITIONS
    let animationFrameId: number;
    const startTime = performance.now();
    let garmentScanY = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const elapsed = (performance.now() - startTime) / 1000;

      // 1. Mannequin rotation damping (settles firmly and stops)
      userRotationY += (targetRotationY - userRotationY) * 0.22;
      mannequinMaster.rotation.y = userRotationY;

      // 2. Mouse-responsive studio key light shift
      keyLight.position.x = 80 + mouseX * 28;
      keyLight.position.y = 160 - mouseY * 22;

      // 3. Continuous vertical laser scan beam travel (torso region Y: 10 to 45)
      const scanY = 27 + Math.sin(elapsed * 1.6) * 18;
      scanPlaneGroup.position.y = scanY;

      // 4. Garment scanning beam in Chapter 02
      if (garmentMaster.visible) {
        garmentScanY += 0.55;
        if (garmentScanY > 18) garmentScanY = -18;
        garmentScanLine.position.y = garmentScanY;
      }

      // 5. Scroll-driven cinematic chapter transitions
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);

      if (scrollProgress < 0.22) {
        // HERO: Large dominant stationary mannequin in center-right clearing (x: 16.5)
        mannequinMaster.visible = true;
        silverMetalMat.opacity = 0.86;
        contourWireMat.opacity = 0.32;
        scanPlaneGroup.visible = true;
        garmentMaster.visible = false;
        easeDeltaRingChest.visible = false;
      } else if (scrollProgress >= 0.22 && scrollProgress < 0.42) {
        // CHAPTER 01: Universal Measurement Laboratory
        mannequinMaster.visible = true;
        silverMetalMat.opacity = 0.92;
        contourWireMat.opacity = 0.38;
        scanPlaneGroup.visible = true;
        garmentMaster.visible = false;
        easeDeltaRingChest.visible = false;
      } else if (scrollProgress >= 0.42 && scrollProgress < 0.62) {
        // CHAPTER 02: Garment Ingestion
        // Mannequin dims to faint reference silhouette; 3D Garment blueprint is the visual focus!
        mannequinMaster.visible = true;
        silverMetalMat.opacity = 0.12;
        contourWireMat.opacity = 0.08;
        scanPlaneGroup.visible = false;
        garmentMaster.visible = true;
        easeDeltaRingChest.visible = false;
      } else if (scrollProgress >= 0.62 && scrollProgress < 0.78) {
        // CHAPTER 03: Fit Synthesis (Garment + Body overlay with Ease Delta Ring)
        mannequinMaster.visible = true;
        silverMetalMat.opacity = 0.4;
        contourWireMat.opacity = 0.2;
        scanPlaneGroup.visible = false;
        garmentMaster.visible = true;
        easeDeltaRingChest.visible = true;
      } else {
        // RETAILERS, FAQ, CTA: Fades completely for 100% reading contrast
        mannequinMaster.visible = false;
        garmentMaster.visible = false;
        easeDeltaRingChest.visible = false;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = "default";
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("dblclick", handleResetView);
      window.removeEventListener("fitmatch:reset_view", handleResetView);
      window.removeEventListener("fitmatch:dimension_change", handleDimensionChange);
      window.removeEventListener("fitmatch:fit_preference", handleFitPreference);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#050507]"
      />

      {/* Floating Precision Technical Annotation Badge */}
      {activeAnnotation.visible && (
        <div
          style={{
            position: "fixed",
            left: `${activeAnnotation.screenX}px`,
            top: `${activeAnnotation.screenY}px`,
            transform: "translate(20px, -50%)",
            pointerEvents: "none",
            zIndex: 15,
          }}
          className="hidden sm:flex flex-col gap-0.5 px-3.5 py-2 rounded-xl border border-white/20 bg-[#0c0d12]/92 backdrop-blur-md shadow-2xl transition-all duration-150"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-white tracking-wider">
              {activeAnnotation.label}
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-semibold">
              {activeAnnotation.value}
            </span>
          </div>
          <span className="text-[9px] font-mono text-[#8a92a0]">
            {activeAnnotation.description}
          </span>
        </div>
      )}
    </>
  );
}
