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
  { id: "shoulder", label: "SHOULDERS", defaultVal: 46.0, unit: "CM", posY: 39.5, radius: 18.5, description: "Biacromial breadth" },
  { id: "chest", label: "CHEST", defaultVal: 98.0, unit: "CM", posY: 30.5, radius: 17.0, description: "Fullest thoracic girth" },
  { id: "waist", label: "WAIST", defaultVal: 84.0, unit: "CM", posY: 17.5, radius: 13.8, description: "Narrowest torso datum" },
  { id: "hip", label: "HIPS", defaultVal: 102.0, unit: "CM", posY: 5.5, radius: 16.2, description: "Fullest pelvic width" },
  { id: "inseam", label: "INSEAM", defaultVal: 82.0, unit: "CM", posY: -22.0, radius: 10.5, description: "Inner groin to ankle" },
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
    scene.fog = new THREE.FogExp2(0x050507, 0.0012);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 215);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x050507, 1);
    container.appendChild(renderer.domElement);

    // 2. CONTROLLED STUDIO LIGHTING RIG (Monochrome Luxury Aesthetic)
    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0x282c35, 2.2);
    scene.add(ambientLight);

    // Overhead Key Softbox (Subtly responds to mouse position to gleam across contours)
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(70, 140, 110);
    scene.add(keyLight);

    // Razor-sharp Cool-Silver Rim Lights (Define silhouette against deep charcoal background)
    const rimLightLeft = new THREE.DirectionalLight(0xb8cce4, 5.5);
    rimLightLeft.position.set(-140, 95, -85);
    scene.add(rimLightLeft);

    const rimLightRight = new THREE.DirectionalLight(0xffffff, 4.8);
    rimLightRight.position.set(140, 95, -85);
    scene.add(rimLightRight);

    // Subtle Ground Bounce Fill
    const groundBounce = new THREE.DirectionalLight(0x1c212a, 1.4);
    groundBounce.position.set(0, -90, 60);
    scene.add(groundBounce);

    // 3. MASTER SCENE ROOTS
    // Mannequin root: FIXED POSITION, FIXED SCALE, STATIONARY BY DEFAULT
    const mannequinMaster = new THREE.Group();
    scene.add(mannequinMaster);
    // Centered in right viewport clearing (x: 14) so left editorial copy and far-right HUD are clear
    mannequinMaster.position.set(isMobile ? 0 : 14, -3, 0);

    // Garment inspection root for Chapter 02 / 03
    const garmentMaster = new THREE.Group();
    scene.add(garmentMaster);
    garmentMaster.position.set(isMobile ? 0 : 14, 8, 0);
    garmentMaster.visible = false;

    // 4. REFINED SILVER & TITANIUM MATERIALS
    // Base solid metallic core (brushed silver with high specular response)
    const silverMetalMat = new THREE.MeshStandardMaterial({
      color: 0x828b98,
      metalness: 0.88,
      roughness: 0.22,
      transparent: true,
      opacity: 0.82,
      side: THREE.DoubleSide,
    });

    // Clean, subtle architectural contour wire lines
    const contourWireMat = new THREE.MeshBasicMaterial({
      color: 0xd6e0ec,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
    });

    // Active body segment highlight material
    const segmentHighlightMat = new THREE.MeshStandardMaterial({
      color: 0xd0dae6,
      emissive: 0x334455,
      emissiveIntensity: 0.65,
      metalness: 0.92,
      roughness: 0.12,
      transparent: true,
      opacity: 0.95,
      side: THREE.DoubleSide,
    });

    // Helper to create body segments
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

    // A. ANATOMICAL HUMAN SILHOUETTE
    // Head & Neck
    const headGroup = new THREE.Group();
    mannequinMaster.add(headGroup);

    const craniumGeo = new THREE.SphereGeometry(7.2, 22, 18);
    craniumGeo.scale(1, 1.22, 1.06);
    createBodySegment("cranium", craniumGeo, 56.5, headGroup);

    const jawGeo = new THREE.ConeGeometry(5.2, 5.8, 16, 1, true);
    jawGeo.rotateX(Math.PI);
    createBodySegment("jaw", jawGeo, 49.5, headGroup);

    const neckGeo = new THREE.CylinderGeometry(3.6, 4.4, 7.8, 18, 2, true);
    createBodySegment("neck", neckGeo, 44.5, headGroup);

    // Torso (Trapezius, Shoulders, Chest)
    const torsoGroup = new THREE.Group();
    mannequinMaster.add(torsoGroup);

    const shoulderGeo = new THREE.CylinderGeometry(15.6, 14.6, 4.8, 22, 2, true);
    createBodySegment("shoulder", shoulderGeo, 39.5, torsoGroup);

    const deltoidGeo = new THREE.SphereGeometry(3.9, 14, 12);
    const leftDeltoid = createBodySegment("deltoid_l", deltoidGeo, 39, torsoGroup);
    leftDeltoid.position.x = -16.8;
    const rightDeltoid = createBodySegment("deltoid_r", deltoidGeo, 39, torsoGroup);
    rightDeltoid.position.x = 16.8;

    const chestGeo = new THREE.CylinderGeometry(15.0, 12.2, 15.0, 22, 4, true);
    chestGeo.scale(1.05, 1, 0.82);
    createBodySegment("chest", chestGeo, 30.5, torsoGroup);

    // Abdomen & Natural Waist
    const waistGeo = new THREE.CylinderGeometry(12.0, 13.0, 12.0, 22, 3, true);
    waistGeo.scale(1, 1, 0.78);
    createBodySegment("waist", waistGeo, 17.5, torsoGroup);

    // Pelvis & Hips
    const pelvisGeo = new THREE.CylinderGeometry(13.0, 15.0, 13.5, 22, 3, true);
    pelvisGeo.scale(1.08, 1, 0.85);
    createBodySegment("hip", pelvisGeo, 5.5, mannequinMaster);

    // Arms (Restrained Tailoring A-Pose)
    const createArm = (isRight: boolean) => {
      const armGroup = new THREE.Group();
      const sign = isRight ? 1 : -1;
      armGroup.position.set(sign * 16.8, 38, 0);
      armGroup.rotation.z = sign * -0.16;
      armGroup.rotation.x = 0.04;

      const bicepGeo = new THREE.CylinderGeometry(3.2, 2.6, 16.0, 14, 2, true);
      createBodySegment(isRight ? "bicep_r" : "bicep_l", bicepGeo, -8, armGroup);

      const elbowGeo = new THREE.SphereGeometry(2.5, 12, 10);
      createBodySegment(isRight ? "elbow_r" : "elbow_l", elbowGeo, -16.8, armGroup);

      const forearmGeo = new THREE.CylinderGeometry(2.5, 2.0, 14.5, 14, 2, true);
      createBodySegment(isRight ? "forearm_r" : "forearm_l", forearmGeo, -24.5, armGroup);

      const handGeo = new THREE.BoxGeometry(2.4, 6.5, 1.4);
      createBodySegment(isRight ? "hand_r" : "hand_l", handGeo, -34, armGroup);

      mannequinMaster.add(armGroup);
    };

    createArm(false);
    createArm(true);

    // Legs (Planted Stature)
    const createLeg = (isRight: boolean) => {
      const legGroup = new THREE.Group();
      const sign = isRight ? 1 : -1;
      legGroup.position.set(sign * 6.6, 0, 0);

      const thighGeo = new THREE.CylinderGeometry(5.2, 3.9, 25, 16, 3, true);
      createBodySegment(isRight ? "thigh_r" : "thigh_l", thighGeo, -13.5, legGroup);

      const kneeGeo = new THREE.SphereGeometry(3.5, 12, 10);
      createBodySegment(isRight ? "knee_r" : "knee_l", kneeGeo, -27, legGroup);

      const calfGeo = new THREE.CylinderGeometry(3.7, 2.5, 25, 16, 3, true);
      createBodySegment(isRight ? "calf_r" : "calf_l", calfGeo, -40.5, legGroup);

      const footGeo = new THREE.BoxGeometry(3.5, 3.0, 9.5);
      const foot = createBodySegment(isRight ? "foot_r" : "foot_l", footGeo, -54.5, legGroup);
      foot.position.z = 2.4;

      mannequinMaster.add(legGroup);
    };

    createLeg(false);
    createLeg(true);

    // B. STUDIO FLOOR ARCHITECTURAL DATUM (Subtle turntable base under feet)
    const floorDatum = new THREE.Group();
    floorDatum.position.y = -58;
    mannequinMaster.add(floorDatum);

    const baseDisk = new THREE.Mesh(
      new THREE.CylinderGeometry(26, 26, 0.8, 48),
      new THREE.MeshStandardMaterial({
        color: 0x1a1e24,
        roughness: 0.4,
        metalness: 0.8,
        transparent: true,
        opacity: 0.6,
      })
    );
    floorDatum.add(baseDisk);

    // Fine concentric datum rings
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x485262, transparent: true, opacity: 0.35 });
    const innerTrack = new THREE.Mesh(new THREE.RingGeometry(22, 22.3, 48), ringMat);
    innerTrack.rotation.x = -Math.PI / 2;
    floorDatum.add(innerTrack);

    const outerTrack = new THREE.Mesh(new THREE.RingGeometry(25.6, 26, 48), ringMat);
    outerTrack.rotation.x = -Math.PI / 2;
    floorDatum.add(outerTrack);

    // 5. PRECISE MEASUREMENT GUIDES & INTERACTIVE HIT NODES
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
      color: 0xdde6f0,
      emissive: 0x334455,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.85,
    });

    const markerDefaultMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x6688aa,
      emissiveIntensity: 0.6,
      metalness: 0.95,
      roughness: 0.1,
    });

    const markerHoverMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xffffff,
      emissiveIntensity: 1.0,
      metalness: 1.0,
      roughness: 0.05,
    });

    MARKERS.forEach((m) => {
      const ringGroup = new THREE.Group();
      ringGroup.position.y = m.posY;

      // Refined, thin 3D Torus guide (tube radius: 0.22 — not a giant ring)
      const torusGeo = new THREE.TorusGeometry(m.radius, 0.22, 12, 64);
      torusGeo.rotateX(Math.PI / 2);
      torusGeo.scale(1, 1, 0.82);
      const torusMesh = new THREE.Mesh(torusGeo, guideLineMat);
      ringGroup.add(torusMesh);

      // Interactive Marker Sphere at front apex
      const hitSphereGeo = new THREE.SphereGeometry(1.6, 16, 16);
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

    // 6. CHAPTER 02 — REFINED 3D GARMENT BLUEPRINT
    const garmentGeo = new THREE.CylinderGeometry(16.5, 14.5, 30, 24, 4, true);
    garmentGeo.scale(1.15, 1, 0.9);
    const garmentMesh = new THREE.Mesh(
      garmentGeo,
      new THREE.MeshStandardMaterial({
        color: 0xa0afc4,
        wireframe: true,
        emissive: 0x223348,
        emissiveIntensity: 0.45,
        transparent: true,
        opacity: 0.85,
      })
    );
    garmentMaster.add(garmentMesh);

    const garmentCollar = new THREE.Mesh(
      new THREE.TorusGeometry(8.2, 0.35, 10, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.75 })
    );
    garmentCollar.rotation.x = Math.PI / 2;
    garmentCollar.position.y = 15;
    garmentMaster.add(garmentCollar);

    // Controlled vertical scanning line across garment
    const scanLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-24, 0, 0),
      new THREE.Vector3(24, 0, 0),
    ]);
    const scanLine = new THREE.Line(
      scanLineGeo,
      new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 })
    );
    garmentMaster.add(scanLine);

    // Chapter 03 Fit Ease Delta Ring
    const easeDeltaRing = new THREE.Mesh(
      new THREE.TorusGeometry(18.5, 0.35, 12, 48),
      new THREE.MeshStandardMaterial({
        color: 0x88ccff,
        emissive: 0x336699,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.85,
      })
    );
    easeDeltaRing.rotation.x = Math.PI / 2;
    easeDeltaRing.position.y = 8;
    easeDeltaRing.visible = false;
    garmentMaster.add(easeDeltaRing);

    // 7. INTERACTION STATE — STATIONARY DEFAULT, CONTROLLED USER ROTATION
    let userRotationY = 0;
    let targetRotationY = 0;
    let isDragging = false;
    let previousPointerX = 0;
    let hasDragged = false;
    let hoveredMarkerId: string | null = null;
    let selectedMarkerId: string = "chest";

    // Mouse coordinates for subtle studio key light response
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

    // Highlight chest by default
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

      // Project 3D coordinate to screen pixel coordinates
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

    // 8. EVENT HANDLERS
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

      // Raycasting for interactive marker nodes
      raycaster.setFromCamera(mouseVector, camera);
      const intersects = raycaster.intersectObjects(interactiveRaycastTargets);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const id = hit.userData.markerId as string;
        if (hoveredMarkerId !== id) {
          hoveredMarkerId = id;
          document.body.style.cursor = "pointer";

          // Highlight marker sphere
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

      // STOP ROTATION IMMEDIATELY — No continuing drift or cartoon spinning!
      targetRotationY = userRotationY;

      // If it was a clean click without dragging, check if user clicked a marker
      if (!hasDragged && hoveredMarkerId) {
        selectedMarkerId = hoveredMarkerId;
        highlightSegment(selectedMarkerId);
        updateAnnotationBadge(selectedMarkerId, true);

        // Sync with page controls
        window.dispatchEvent(
          new CustomEvent("fitmatch:select_dimension", {
            detail: { dimension: selectedMarkerId },
          })
        );
      }
    };

    // Reset View
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
      easeDeltaRing.visible = true;

      if (preference === "slim") {
        easeDeltaRing.scale.set(0.95, 1, 0.95);
      } else if (preference === "relaxed") {
        easeDeltaRing.scale.set(1.18, 1, 1.18);
      } else {
        easeDeltaRing.scale.set(1.06, 1, 1.06);
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
      mannequinMaster.position.x = isMobile ? 0 : 14;
      garmentMaster.position.x = isMobile ? 0 : 14;
    };
    window.addEventListener("resize", handleResize);

    // 9. ANIMATION LOOP — PURE RESTRAINT & CONTROLLED PRECISION
    let animationFrameId: number;
    let scanLineY = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (document.hidden) return;

      // 1. Mannequin rotation damping — halts immediately when drag stops
      userRotationY += (targetRotationY - userRotationY) * 0.25;
      mannequinMaster.rotation.y = userRotationY;

      // 2. Subtle mouse-responsive studio key light shift across metallic contours
      // Note: The mannequin itself stays completely stationary!
      keyLight.position.x = 70 + mouseX * 28;
      keyLight.position.y = 140 - mouseY * 22;

      // 3. Controlled vertical scanning line across garment (Chapter 02)
      if (garmentMaster.visible) {
        scanLineY += 0.45;
        if (scanLineY > 15) scanLineY = -15;
        scanLine.position.y = scanLineY;
      }

      // 4. Chapter-Specific Mode Transitions via Scroll Position
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);

      if (scrollProgress < 0.22) {
        // HERO: Full-body stationary mannequin in right clearing (x: 14)
        mannequinMaster.visible = true;
        silverMetalMat.opacity = 0.82;
        contourWireMat.opacity = 0.24;
        garmentMaster.visible = false;
        easeDeltaRing.visible = false;
      } else if (scrollProgress >= 0.22 && scrollProgress < 0.42) {
        // CHAPTER 01: Universal Profile Measurement Laboratory
        // Clear focus on measurement guides
        mannequinMaster.visible = true;
        silverMetalMat.opacity = 0.88;
        contourWireMat.opacity = 0.3;
        garmentMaster.visible = false;
        easeDeltaRing.visible = false;
      } else if (scrollProgress >= 0.42 && scrollProgress < 0.62) {
        // CHAPTER 02: Real-Time Garment Link Ingestion
        // Mannequin fades to faint background silhouette; 3D Garment blueprint is the visual focus!
        mannequinMaster.visible = true;
        silverMetalMat.opacity = 0.1;
        contourWireMat.opacity = 0.08;
        garmentMaster.visible = true;
        easeDeltaRing.visible = false;
      } else if (scrollProgress >= 0.62 && scrollProgress < 0.78) {
        // CHAPTER 03: Fit Synthesis & Ease Comparison
        mannequinMaster.visible = true;
        silverMetalMat.opacity = 0.35;
        contourWireMat.opacity = 0.15;
        garmentMaster.visible = true;
        easeDeltaRing.visible = true;
      } else {
        // RETAILERS, FAQ, CTA: Fades down completely for clean, unobstructed reading
        mannequinMaster.visible = false;
        garmentMaster.visible = false;
        easeDeltaRing.visible = false;
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
            transform: "translate(18px, -50%)",
            pointerEvents: "none",
            zIndex: 15,
          }}
          className="hidden sm:flex flex-col gap-0.5 px-3 py-1.5 rounded-lg border border-white/20 bg-[#0c0d12]/90 backdrop-blur-md shadow-2xl transition-all duration-150"
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
