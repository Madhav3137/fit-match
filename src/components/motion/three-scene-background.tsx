"use client";

import * as React from "react";
import * as THREE from "three";

export function ThreeSceneBackground() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let isMobile = width < 768;

    // 1. SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.0011);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 0, 210);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x050507, 1);
    container.appendChild(renderer.domElement);

    // 2. STUDIO SCIENTIFIC LIGHTING RIG (High-contrast metallic illumination)
    const ambientLight = new THREE.AmbientLight(0x505565, 2.5);
    scene.add(ambientLight);

    // Front-Right Key Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(120, 160, 140);
    scene.add(keyLight);

    // Powerful Cool-Blue Specular Rim Lights (Makes silhouette pop against pitch black)
    const rimLightLeft = new THREE.DirectionalLight(0xc2dcff, 6.5);
    rimLightLeft.position.set(-160, 140, -100);
    scene.add(rimLightLeft);

    const rimLightRight = new THREE.DirectionalLight(0xffffff, 5.5);
    rimLightRight.position.set(160, 140, -100);
    scene.add(rimLightRight);

    // Bottom Fill Bounce Light
    const bottomLight = new THREE.DirectionalLight(0x404858, 2.0);
    bottomLight.position.set(0, -140, 80);
    scene.add(bottomLight);

    // Internal Thoracic Chest Point Light (Gives torso an internal luminescent glow)
    const thoracicGlow = new THREE.PointLight(0xdde8ff, 3.5, 95);
    thoracicGlow.position.set(0, 24, 15);

    // 3. MASTER MANNEQUIN ROOT GROUP
    // Fixed viewport centering — NEVER scrolls vertically with page layout!
    const mannequinMaster = new THREE.Group();
    scene.add(mannequinMaster);
    mannequinMaster.add(thoracicGlow);
    // Center-Right placement (x: 16) leaves left copy (0-45%) and far-right HUD (80-100%) completely clear!
    mannequinMaster.position.set(isMobile ? 0 : 16, -3, 0);

    // Dynamic rotation tracking
    let autoRotation = 0;
    let userRotationY = 0;
    let userTargetRotationY = 0;
    let isDragging = false;
    let previousPointerX = 0;

    // HIGH-VISIBILITY METALLIC & CHROME MATERIALS
    // Solid surface: luminous silver-slate with clearcoat specular reflection
    const solidInnerMat = new THREE.MeshStandardMaterial({
      color: 0x5a6578,
      roughness: 0.14,
      metalness: 0.95,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
    });

    // Wireframe shell: bright pure white lines
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });

    const activeWireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 1.0,
    });

    // Helper to create dual-layer body segments (solid core + wireframe shell)
    const createBodySegment = (geo: THREE.BufferGeometry, posY: number, parent: THREE.Group, scale = 1) => {
      const segGroup = new THREE.Group();
      segGroup.position.y = posY;
      segGroup.scale.set(scale, scale, scale);

      const solidMesh = new THREE.Mesh(geo, solidInnerMat);
      segGroup.add(solidMesh);

      const wireMesh = new THREE.Mesh(geo, wireMat);
      segGroup.add(wireMesh);

      parent.add(segGroup);
      return segGroup;
    };

    // A. HEAD & NECK
    const headGroup = new THREE.Group();
    mannequinMaster.add(headGroup);

    // Cranium
    const craniumGeo = new THREE.SphereGeometry(7.4, 20, 16);
    craniumGeo.scale(1, 1.22, 1.08);
    createBodySegment(craniumGeo, 56.5, headGroup);

    // Jaw / Face contour
    const jawGeo = new THREE.ConeGeometry(5.4, 5.8, 14, 1, true);
    jawGeo.rotateX(Math.PI);
    createBodySegment(jawGeo, 49.5, headGroup);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(3.6, 4.4, 7.8, 16, 2, true);
    createBodySegment(neckGeo, 44.5, headGroup);

    // B. TORSO, SHOULDERS & CHEST
    const torsoGroup = new THREE.Group();
    mannequinMaster.add(torsoGroup);

    // Trapezius / Clavicles
    const shoulderGeo = new THREE.CylinderGeometry(15.8, 14.8, 4.8, 20, 2, true);
    const shoulderSeg = createBodySegment(shoulderGeo, 39.5, torsoGroup);

    // Deltoid caps (Shoulder joints)
    const deltoidGeo = new THREE.SphereGeometry(4.0, 14, 12);
    const leftDeltoid = createBodySegment(deltoidGeo, 39, torsoGroup);
    leftDeltoid.position.x = -17.0;
    const rightDeltoid = createBodySegment(deltoidGeo, 39, torsoGroup);
    rightDeltoid.position.x = 17.0;

    // Chest / Thorax (Tapering to solar plexus)
    const chestGeo = new THREE.CylinderGeometry(15.2, 12.4, 15.0, 20, 4, true);
    chestGeo.scale(1.05, 1, 0.82);
    const chestSeg = createBodySegment(chestGeo, 30.5, torsoGroup);

    // C. ABDOMEN & NATURAL WAIST
    const waistGeo = new THREE.CylinderGeometry(12.2, 13.2, 12.0, 20, 3, true);
    waistGeo.scale(1, 1, 0.78);
    const waistSeg = createBodySegment(waistGeo, 17.5, torsoGroup);

    // D. PELVIS & HIPS
    const pelvisGeo = new THREE.CylinderGeometry(13.2, 15.2, 13.5, 20, 3, true);
    pelvisGeo.scale(1.08, 1, 0.85);
    const hipSeg = createBodySegment(pelvisGeo, 5.5, mannequinMaster);

    // E. ARMS (Left and Right relaxed tailoring A-pose)
    const createArm = (isRight: boolean) => {
      const armGroup = new THREE.Group();
      const sign = isRight ? 1 : -1;
      armGroup.position.set(sign * 17.0, 38, 0);
      armGroup.rotation.z = sign * -0.16;
      armGroup.rotation.x = 0.05;

      // Upper arm
      const bicepGeo = new THREE.CylinderGeometry(3.3, 2.7, 16.0, 14, 2, true);
      createBodySegment(bicepGeo, -8, armGroup);

      // Elbow joint
      const elbowGeo = new THREE.SphereGeometry(2.6, 12, 10);
      createBodySegment(elbowGeo, -16.8, armGroup);

      // Forearm
      const forearmGeo = new THREE.CylinderGeometry(2.6, 2.1, 14.5, 14, 2, true);
      createBodySegment(forearmGeo, -24.5, armGroup);

      // Hand
      const handGeo = new THREE.BoxGeometry(2.5, 6.8, 1.5);
      createBodySegment(handGeo, -34, armGroup);

      mannequinMaster.add(armGroup);
      return armGroup;
    };

    createArm(false); // Left
    createArm(true);  // Right

    // F. LEGS (Left and Right planted stature)
    const createLeg = (isRight: boolean) => {
      const legGroup = new THREE.Group();
      const sign = isRight ? 1 : -1;
      legGroup.position.set(sign * 6.8, 0, 0);

      // Thigh
      const thighGeo = new THREE.CylinderGeometry(5.4, 4.0, 25, 16, 3, true);
      createBodySegment(thighGeo, -13.5, legGroup);

      // Knee joint
      const kneeGeo = new THREE.SphereGeometry(3.6, 12, 10);
      createBodySegment(kneeGeo, -27, legGroup);

      // Calf / Shin
      const calfGeo = new THREE.CylinderGeometry(3.8, 2.6, 25, 16, 3, true);
      createBodySegment(calfGeo, -40.5, legGroup);

      // Foot & Ankle
      const footGeo = new THREE.BoxGeometry(3.6, 3.2, 10.0);
      const foot = createBodySegment(footGeo, -54.5, legGroup);
      foot.position.z = 2.5;

      mannequinMaster.add(legGroup);
      return legGroup;
    };

    createLeg(false); // Left
    createLeg(true);  // Right

    // G. CALIBRATION PEDESTAL TURNTABLE (At the feet)
    const turntableGroup = new THREE.Group();
    turntableGroup.position.y = -57;
    mannequinMaster.add(turntableGroup);

    const diskGeo = new THREE.CylinderGeometry(28, 28, 1.4, 48);
    const diskMesh = new THREE.Mesh(diskGeo, solidInnerMat);
    turntableGroup.add(diskMesh);

    const ringGeo = new THREE.RingGeometry(25, 28, 48);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, activeWireMat);
    turntableGroup.add(ringMesh);

    // 4. THICK 3D TORUS MEASUREMENT RINGS (With physical volume & glowing satellite diamonds)
    const caliperRings: { mesh: THREE.Group; speed: number; baseRadius: number; currentScale: number }[] = [];

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x88aacc,
      emissiveIntensity: 0.85,
      roughness: 0.1,
      metalness: 0.95,
    });

    const createCaliperRing = (radius: number, posY: number, speed = 0.015) => {
      const ringGroup = new THREE.Group();
      ringGroup.position.y = posY;

      // 3D Physical Torus (0.55 unit tube thickness catches striking highlights)
      const torusGeo = new THREE.TorusGeometry(radius, 0.55, 16, 64);
      torusGeo.rotateX(Math.PI / 2);
      torusGeo.scale(1, 1, 0.8); // Anatomical ellipse
      const torusMesh = new THREE.Mesh(torusGeo, ringMat);
      ringGroup.add(torusMesh);

      // 4 Glowing diamond satellite nodes around the ring
      const nodeGeo = new THREE.OctahedronGeometry(1.5, 0);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2;
        const node = new THREE.Mesh(nodeGeo, nodeMat);
        node.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * (radius * 0.8));
        ringGroup.add(node);
      }

      mannequinMaster.add(ringGroup);

      const ringObj = { mesh: ringGroup, speed, baseRadius: radius, currentScale: 1 };
      caliperRings.push(ringObj);
      return ringObj;
    };

    const shoulderRingObj = createCaliperRing(21.0, 39.5, 0.012);
    const chestRingObj = createCaliperRing(19.2, 30.5, -0.016);
    const waistRingObj = createCaliperRing(15.6, 17.5, 0.014);
    const hipRingObj = createCaliperRing(18.2, 5.5, -0.012);

    // 5. 3D FLOATING HUD BILLBOARD LABELS (Camera-Facing Billboards)
    const createBillboardSprite = (title: string, value: string, posY: number, offsetX: number) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");

      const drawCanvas = (t: string, v: string) => {
        if (!ctx) return;
        ctx.clearRect(0, 0, 256, 64);
        ctx.fillStyle = "rgba(10, 10, 16, 0.88)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.roundRect(4, 4, 248, 56, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px monospace";
        ctx.fillText(t, 16, 28);

        ctx.fillStyle = "#a8b5c8";
        ctx.font = "12px monospace";
        ctx.fillText(v, 16, 48);
      };

      drawCanvas(title, value);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(22, 5.5, 1);
      sprite.position.set(offsetX, posY, 6);
      mannequinMaster.add(sprite);

      // Lead-in line connecting body coordinate to billboard label
      const leadGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(offsetX > 0 ? offsetX - 11 : offsetX + 11, posY, 0),
        new THREE.Vector3(offsetX > 0 ? offsetX - 2 : offsetX + 2, posY, 0),
      ]);
      const leadLine = new THREE.Line(leadGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }));
      mannequinMaster.add(leadLine);

      return {
        sprite,
        update: (newTitle: string, newVal: string) => {
          drawCanvas(newTitle, newVal);
          texture.needsUpdate = true;
        },
      };
    };

    const chestLabel = createBillboardSprite("CHEST", "98.0 CM // OPTIMAL", 30.5, 32);
    const waistLabel = createBillboardSprite("WAIST", "84.0 CM // NATURAL", 17.5, -30);
    const shoulderLabel = createBillboardSprite("SHOULDERS", "46.0 CM // BIACROMIAL", 39.5, -34);

    // 6. GIANT MULTI-AXIS ORBITAL CALIPERS (Thick torus tubes around the entire figure)
    const createOuterOrbit = (radius: number, rotX: number, rotY: number, tubeRadius = 0.45) => {
      const geo = new THREE.TorusGeometry(radius, tubeRadius, 12, 72);
      const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: 0x446688,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.95,
      });
      const torus = new THREE.Mesh(geo, mat);
      torus.rotation.x = rotX;
      torus.rotation.y = rotY;
      mannequinMaster.add(torus);
      return torus;
    };

    const outerOrbital1 = createOuterOrbit(84, Math.PI * 0.22, Math.PI * 0.15, 0.45);
    const outerOrbital2 = createOuterOrbit(102, -Math.PI * 0.18, Math.PI * 0.25, 0.38);

    // 7. CONTINUOUS HORIZONTAL LASER SCANNING BEAM & MOVING POINT LIGHT
    const scanPlaneGroup = new THREE.Group();
    mannequinMaster.add(scanPlaneGroup);

    const scanPlaneGeo = new THREE.PlaneGeometry(64, 48);
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const scanPlane = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanPlane.rotation.x = Math.PI / 2;
    scanPlaneGroup.add(scanPlane);

    // Luminous laser beam edge line
    const laserLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-32, 0, 0),
      new THREE.Vector3(32, 0, 0),
    ]);
    const laserLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });
    const laserLine = new THREE.Line(laserLineGeo, laserLineMat);
    scanPlaneGroup.add(laserLine);

    // Attached Laser Point Light (Casts actual light onto body vertices as it travels!)
    const laserPointLight = new THREE.PointLight(0xffffff, 4.0, 48);
    scanPlaneGroup.add(laserPointLight);

    // 8. FLOATING 3D GARMENT SILHOUETTE (Chapters 02 & 03)
    const garmentGroup = new THREE.Group();
    garmentGroup.position.set(36, 24, 0);
    garmentGroup.scale.set(0.001, 0.001, 0.001); // Hidden in hero
    scene.add(garmentGroup);

    const jacketGeo = new THREE.CylinderGeometry(17.8, 14.8, 33, 20, 4, true);
    jacketGeo.scale(1.18, 1, 0.92);
    const jacketWire = new THREE.Mesh(
      jacketGeo,
      new THREE.MeshStandardMaterial({
        color: 0x90a8cc,
        wireframe: true,
        emissive: 0x446699,
        emissiveIntensity: 0.5,
      })
    );
    garmentGroup.add(jacketWire);

    const garmentCollar = new THREE.Mesh(
      new THREE.TorusGeometry(8.8, 1.2, 10, 32),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.9 })
    );
    garmentCollar.rotation.x = Math.PI / 2;
    garmentCollar.position.y = 16.5;
    garmentGroup.add(garmentCollar);

    // Tolerance Ease Ring around Garment in Chapter 03
    const toleranceEaseRing = new THREE.Mesh(
      new THREE.TorusGeometry(22, 0.5, 12, 48),
      new THREE.MeshStandardMaterial({
        color: 0x55ffaa,
        emissive: 0x22cc77,
        emissiveIntensity: 0.8,
      })
    );
    toleranceEaseRing.rotation.x = Math.PI / 2;
    toleranceEaseRing.position.y = 30;
    toleranceEaseRing.visible = false;
    garmentGroup.add(toleranceEaseRing);

    // 9. 3D DEEP SPATIAL METALLIC PARTICLES
    const particleCount = isMobile ? 350 : 850;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 650;
      particlePositions[i + 1] = (Math.random() - 0.5) * 850;
      particlePositions[i + 2] = (Math.random() - 0.5) * 550;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 2.4,
      color: 0xffffff,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
    });
    const stardust = new THREE.Points(particleGeo, particleMat);
    scene.add(stardust);

    // 10. REAL-TIME EVENT LISTENER FOR SLIDERS
    const handleDimensionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ dimension: string; value: number }>;
      const { dimension, value } = customEvent.detail;

      if (dimension === "chest") {
        const scale = value / 98;
        chestRingObj.mesh.scale.set(scale, 1, scale);
        chestSeg.scale.set(scale, 1, scale);
        chestLabel.update("CHEST", `${value.toFixed(1)} CM // ACTIVE`);
      } else if (dimension === "waist") {
        const scale = value / 84;
        waistRingObj.mesh.scale.set(scale, 1, scale);
        waistSeg.scale.set(scale, 1, scale);
        waistLabel.update("WAIST", `${value.toFixed(1)} CM // ACTIVE`);
      } else if (dimension === "shoulder") {
        const scale = value / 46;
        shoulderRingObj.mesh.scale.set(scale, 1, scale);
        shoulderSeg.scale.set(scale, 1, scale);
        shoulderLabel.update("SHOULDERS", `${value.toFixed(1)} CM // ACTIVE`);
      } else if (dimension === "hip") {
        const scale = value / 102;
        hipRingObj.mesh.scale.set(scale, 1, scale);
        hipSeg.scale.set(scale, 1, scale);
      }
    };

    const handleFitPreference = (e: Event) => {
      const customEvent = e as CustomEvent<{ preference: string }>;
      const { preference } = customEvent.detail;
      toleranceEaseRing.visible = true;

      if (preference === "slim") {
        toleranceEaseRing.scale.set(0.94, 1, 0.94);
      } else if (preference === "relaxed") {
        toleranceEaseRing.scale.set(1.16, 1, 1.16);
      } else {
        toleranceEaseRing.scale.set(1.05, 1, 1.05);
      }
    };

    window.addEventListener("fitmatch:dimension_change", handleDimensionChange);
    window.addEventListener("fitmatch:fit_preference", handleFitPreference);

    // 11. INTERACTIVE MOUSE PARALLAX & DRAG-TO-ROTATE
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let scrollY = 0;
    let targetScrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        userTargetRotationY += deltaX * 0.008;
        previousPointerX = e.clientX;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "BUTTON" || target.tagName === "INPUT" || target.tagName === "A" || target.closest("button") || target.closest("input") || target.closest("a"))) {
        return;
      }
      isDragging = true;
      previousPointerX = e.clientX;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < 768;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      mannequinMaster.position.x = isMobile ? 0 : 16;
    };
    window.addEventListener("resize", handleResize);

    // 12. CONTINUOUS ANIMATION LOOP
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const time = clock.getElapsedTime();

      // Smooth scroll interpolation
      scrollY += (targetScrollY - scrollY) * 0.07;
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const scrollProgress = Math.min(Math.max(scrollY / maxScroll, 0), 1);

      // Smooth user rotation damping
      userRotationY += (userTargetRotationY - userRotationY) * 0.08;

      if (!prefersReducedMotion) {
        // Continuous turntable rotation + user drag offset
        autoRotation = time * 0.25;
        mannequinMaster.rotation.y = autoRotation + userRotationY;

        // Subtle anatomical breathing & floating idle oscillation (NO vertical scroll displacement!)
        torsoGroup.scale.set(
          1 + Math.sin(time * 1.8) * 0.015,
          1,
          1 + Math.sin(time * 1.8) * 0.02
        );
        mannequinMaster.position.y = (isMobile ? -2 : -3) + Math.sin(time * 1.2) * 2.2;

        // Rotate individual caliper rings at differential speeds
        caliperRings.forEach((r) => {
          r.mesh.rotation.y += r.speed;
        });

        // Rotate giant outer orbital calipers
        outerOrbital1.rotation.z = time * 0.12;
        outerOrbital2.rotation.z = -time * 0.09;

        // Continuous vertical laser scanning beam plane travel from head to feet
        const laserY = Math.sin(time * 1.5) * 52;
        scanPlaneGroup.position.y = laserY;

        // Stardust subtle axial drift
        stardust.rotation.y = time * 0.03;
      }

      // CHAPTER-BASED SCENE EVOLUTION (Fixed canvas, internal scene transitions!)
      if (scrollProgress < 0.16) {
        // HERO: Large dominant full-body figure (x: 16, z: 210, 76% viewport height)
        camera.position.z = 210;
        mannequinMaster.position.x = isMobile ? 0 : 16;
        garmentGroup.scale.set(0.001, 0.001, 0.001);
        toleranceEaseRing.visible = false;
      } else if (scrollProgress >= 0.16 && scrollProgress < 0.36) {
        // CHAPTER 01: Universal Body Profile Lab (Pans to x: 26, rings illuminate & scale with sliders)
        camera.position.z = 215;
        mannequinMaster.position.x = isMobile ? 0 : 26;
        const ringPulse = 1 + Math.sin(time * 3) * 0.06;
        chestRingObj.mesh.scale.set(ringPulse, 1, ringPulse);
        waistRingObj.mesh.scale.set(ringPulse, 1, ringPulse);
        garmentGroup.scale.set(0.001, 0.001, 0.001);
      } else if (scrollProgress >= 0.36 && scrollProgress < 0.56) {
        // CHAPTER 02: Garment Ingestion Engine (Mannequin shifts to x: -24, 3D garment emerges at x: 28)
        camera.position.z = 225;
        mannequinMaster.position.x = isMobile ? -10 : -24;
        garmentGroup.position.set(isMobile ? 12 : 28, 8, 0);
        garmentGroup.scale.set(0.92, 0.92, 0.92);
        garmentGroup.rotation.y = time * 0.4;
      } else if (scrollProgress >= 0.56 && scrollProgress < 0.74) {
        // CHAPTER 03: Fit Synthesis (Garment converges directly onto the mannequin at x: 20!)
        camera.position.z = 210;
        mannequinMaster.position.x = isMobile ? 0 : 20;
        garmentGroup.position.set(mannequinMaster.position.x, mannequinMaster.position.y + 12, 0);
        garmentGroup.scale.set(1.08, 1.08, 1.08);
        garmentGroup.rotation.y = mannequinMaster.rotation.y;
        toleranceEaseRing.visible = true;
      } else if (scrollProgress >= 0.74 && scrollProgress < 0.88) {
        // RETAILERS & FAQ: Camera pulls back to z: 275 into deep atmospheric perspective
        camera.position.z = 275;
        mannequinMaster.position.x = isMobile ? 0 : 15;
        garmentGroup.scale.set(0.001, 0.001, 0.001);
      } else {
        // FINAL CTA: Mannequin glides back to center-stage (x: 0, z: 210) for heroic closing scene
        camera.position.z = 210;
        mannequinMaster.position.x = 0;
        garmentGroup.scale.set(0.001, 0.001, 0.001);
      }

      // Parallax mouse damping
      targetCameraX = mouseX * 18;
      targetCameraY = -mouseY * 14;

      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;

      camera.lookAt(mannequinMaster.position.x * 0.4, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("fitmatch:dimension_change", handleDimensionChange);
      window.removeEventListener("fitmatch:fit_preference", handleFitPreference);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#050507]"
    />
  );
}
