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
    scene.fog = new THREE.FogExp2(0x050507, 0.0013);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
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

    // 2. LIGHTING RIG (Studio scientific illumination)
    const ambientLight = new THREE.AmbientLight(0x404048, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(130, 160, 140);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xb0c4de, 3.4);
    rimLight.position.set(-150, 120, -90);
    scene.add(rimLight);

    const bottomLight = new THREE.DirectionalLight(0x384050, 1.4);
    bottomLight.position.set(0, -130, 90);
    scene.add(bottomLight);

    // 3. MASTER MANNEQUIN ROOT GROUP
    // Fixed viewport centering — never scrolls vertically with page layout!
    const mannequinMaster = new THREE.Group();
    scene.add(mannequinMaster);
    mannequinMaster.position.set(isMobile ? 0 : 38, -3, 0);

    // Dynamic rotation tracking
    let autoRotation = 0;
    let userRotationY = 0;
    let userTargetRotationY = 0;
    let isDragging = false;
    let previousPointerX = 0;

    // Shared Materials
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xe2e2ec,
      wireframe: true,
      transparent: true,
      opacity: 0.62,
    });

    const activeWireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.95,
    });

    const solidInnerMat = new THREE.MeshStandardMaterial({
      color: 0x101015,
      roughness: 0.22,
      metalness: 0.88,
      transparent: true,
      opacity: 0.45,
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
    const craniumGeo = new THREE.SphereGeometry(7.2, 16, 14);
    craniumGeo.scale(1, 1.22, 1.08);
    createBodySegment(craniumGeo, 56, headGroup);

    // Jaw / Face contour
    const jawGeo = new THREE.ConeGeometry(5.2, 5.5, 12, 1, true);
    jawGeo.rotateX(Math.PI);
    createBodySegment(jawGeo, 49.5, headGroup);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(3.5, 4.2, 7.5, 14, 2, true);
    createBodySegment(neckGeo, 44.5, headGroup);

    // B. TORSO, SHOULDERS & CHEST
    const torsoGroup = new THREE.Group();
    mannequinMaster.add(torsoGroup);

    // Trapezius / Clavicles
    const shoulderGeo = new THREE.CylinderGeometry(15.5, 14.5, 4.5, 18, 2, true);
    const shoulderSeg = createBodySegment(shoulderGeo, 39.5, torsoGroup);

    // Deltoid caps (Shoulder joints)
    const deltoidGeo = new THREE.SphereGeometry(3.8, 12, 10);
    const leftDeltoid = createBodySegment(deltoidGeo, 39, torsoGroup);
    leftDeltoid.position.x = -16.5;
    const rightDeltoid = createBodySegment(deltoidGeo, 39, torsoGroup);
    rightDeltoid.position.x = 16.5;

    // Chest / Thorax (Tapering to solar plexus)
    const chestGeo = new THREE.CylinderGeometry(14.8, 12.0, 14.5, 18, 4, true);
    chestGeo.scale(1.05, 1, 0.82);
    const chestSeg = createBodySegment(chestGeo, 30.5, torsoGroup);

    // C. ABDOMEN & NATURAL WAIST
    const waistGeo = new THREE.CylinderGeometry(11.8, 12.8, 11.5, 18, 3, true);
    waistGeo.scale(1, 1, 0.78);
    const waistSeg = createBodySegment(waistGeo, 17.5, torsoGroup);

    // D. PELVIS & HIPS
    const pelvisGeo = new THREE.CylinderGeometry(12.8, 14.8, 13, 18, 3, true);
    pelvisGeo.scale(1.08, 1, 0.85);
    const hipSeg = createBodySegment(pelvisGeo, 5.5, mannequinMaster);

    // E. ARMS (Left and Right relaxed tailoring A-pose)
    const createArm = (isRight: boolean) => {
      const armGroup = new THREE.Group();
      const sign = isRight ? 1 : -1;
      armGroup.position.set(sign * 16.5, 38, 0);
      armGroup.rotation.z = sign * -0.16;
      armGroup.rotation.x = 0.05;

      // Upper arm
      const bicepGeo = new THREE.CylinderGeometry(3.1, 2.6, 15.5, 12, 2, true);
      createBodySegment(bicepGeo, -8, armGroup);

      // Elbow joint
      const elbowGeo = new THREE.SphereGeometry(2.5, 10, 8);
      createBodySegment(elbowGeo, -16.5, armGroup);

      // Forearm
      const forearmGeo = new THREE.CylinderGeometry(2.5, 2.0, 14, 12, 2, true);
      createBodySegment(forearmGeo, -24, armGroup);

      // Hand
      const handGeo = new THREE.BoxGeometry(2.4, 6.5, 1.4);
      createBodySegment(handGeo, -33, armGroup);

      mannequinMaster.add(armGroup);
      return armGroup;
    };

    createArm(false); // Left
    createArm(true);  // Right

    // F. LEGS (Left and Right planted stature)
    const createLeg = (isRight: boolean) => {
      const legGroup = new THREE.Group();
      const sign = isRight ? 1 : -1;
      legGroup.position.set(sign * 6.5, 0, 0);

      // Thigh
      const thighGeo = new THREE.CylinderGeometry(5.2, 3.8, 24, 14, 3, true);
      createBodySegment(thighGeo, -13, legGroup);

      // Knee joint
      const kneeGeo = new THREE.SphereGeometry(3.4, 10, 8);
      createBodySegment(kneeGeo, -26, legGroup);

      // Calf / Shin
      const calfGeo = new THREE.CylinderGeometry(3.6, 2.5, 24, 14, 3, true);
      createBodySegment(calfGeo, -39, legGroup);

      // Foot & Ankle
      const footGeo = new THREE.BoxGeometry(3.4, 3.0, 9.5);
      const foot = createBodySegment(footGeo, -52.5, legGroup);
      foot.position.z = 2.5;

      mannequinMaster.add(legGroup);
      return legGroup;
    };

    createLeg(false); // Left
    createLeg(true);  // Right

    // G. CALIBRATION PEDESTAL TURNTABLE (At the feet)
    const turntableGroup = new THREE.Group();
    turntableGroup.position.y = -55;
    mannequinMaster.add(turntableGroup);

    const diskGeo = new THREE.CylinderGeometry(26, 26, 1.2, 36);
    const diskMesh = new THREE.Mesh(diskGeo, solidInnerMat);
    turntableGroup.add(diskMesh);

    const ringGeo = new THREE.RingGeometry(24, 26, 36);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMesh = new THREE.Mesh(ringGeo, activeWireMat);
    turntableGroup.add(ringMesh);

    // 4. FLOATING 3D MEASUREMENT CALIPER RINGS
    const caliperRings: { mesh: THREE.LineLoop; speed: number; baseRadius: number; currentScale: number }[] = [];

    const createCaliperRing = (radius: number, posY: number, color = 0xffffff, speed = 0.015) => {
      const segments = 48;
      const ringGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array((segments + 1) * 3);

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        positions[i * 3] = Math.cos(theta) * radius;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = Math.sin(theta) * (radius * 0.8);
      }

      ringGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const ringLineMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.78,
      });

      const ringLoop = new THREE.LineLoop(ringGeometry, ringLineMat);
      ringLoop.position.y = posY;
      mannequinMaster.add(ringLoop);

      // Add 2 glowing diamond nodes on opposite sides
      const nodeGeo = new THREE.OctahedronGeometry(0.9, 0);
      const nodeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

      const node1 = new THREE.Mesh(nodeGeo, nodeMat);
      node1.position.set(radius, 0, 0);
      ringLoop.add(node1);

      const node2 = new THREE.Mesh(nodeGeo, nodeMat);
      node2.position.set(-radius, 0, 0);
      ringLoop.add(node2);

      const ringObj = { mesh: ringLoop, speed, baseRadius: radius, currentScale: 1 };
      caliperRings.push(ringObj);
      return ringObj;
    };

    const shoulderRingObj = createCaliperRing(20.5, 39, 0xffffff, 0.012);
    const chestRingObj = createCaliperRing(18.5, 31, 0xffffff, -0.016);
    const waistRingObj = createCaliperRing(15.2, 17, 0xffffff, 0.014);
    const hipRingObj = createCaliperRing(17.8, 5, 0xffffff, -0.012);

    // 5. 3D FLOATING HUD BILLBOARD LABELS (Remain anchored to coordinates and face camera)
    const createBillboardSprite = (title: string, value: string, posY: number, offsetX: number) => {
      const canvas = document.createElement("canvas");
      canvas.width = 256;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");

      const drawCanvas = (t: string, v: string) => {
        if (!ctx) return;
        ctx.clearRect(0, 0, 256, 64);
        ctx.fillStyle = "rgba(12, 12, 18, 0.85)";
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(4, 4, 248, 56, 8);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 18px monospace";
        ctx.fillText(t, 16, 28);

        ctx.fillStyle = "#a0a0b0";
        ctx.font = "12px monospace";
        ctx.fillText(v, 16, 48);
      };

      drawCanvas(title, value);

      const texture = new THREE.CanvasTexture(canvas);
      texture.minFilter = THREE.LinearFilter;
      const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.85 });
      const sprite = new THREE.Sprite(spriteMat);
      sprite.scale.set(20, 5, 1);
      sprite.position.set(offsetX, posY, 4);
      mannequinMaster.add(sprite);

      // Lead-in line from body coordinate to label
      const leadGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(offsetX > 0 ? offsetX - 10 : offsetX + 10, posY, 0),
        new THREE.Vector3(offsetX > 0 ? offsetX - 2 : offsetX + 2, posY, 0),
      ]);
      const leadLine = new THREE.Line(leadGeo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4 }));
      mannequinMaster.add(leadLine);

      return {
        sprite,
        update: (newTitle: string, newVal: string) => {
          drawCanvas(newTitle, newVal);
          texture.needsUpdate = true;
        },
      };
    };

    const chestLabel = createBillboardSprite("CHEST", "98.0 CM // OPTIMAL", 31, 30);
    const waistLabel = createBillboardSprite("WAIST", "84.0 CM // NATURAL", 17, -28);
    const shoulderLabel = createBillboardSprite("SHOULDERS", "46.0 CM // BIACROMIAL", 39, -32);

    // 6. GIANT OUTER ORBITAL CALIPERS (Surrounds the entire body)
    const createOuterOrbit = (radius: number, rotX: number, rotY: number, opacity = 0.25) => {
      const segs = 64;
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array((segs + 1) * 3);

      for (let i = 0; i <= segs; i++) {
        const theta = (i / segs) * Math.PI * 2;
        pos[i * 3] = Math.cos(theta) * radius;
        pos[i * 3 + 1] = Math.sin(theta) * (radius * 0.95);
        pos[i * 3 + 2] = 0;
      }

      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const mat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity });
      const loop = new THREE.LineLoop(geo, mat);
      loop.rotation.x = rotX;
      loop.rotation.y = rotY;
      mannequinMaster.add(loop);
      return loop;
    };

    const outerOrbital1 = createOuterOrbit(80, Math.PI * 0.22, Math.PI * 0.15, 0.28);
    const outerOrbital2 = createOuterOrbit(96, -Math.PI * 0.18, Math.PI * 0.25, 0.18);

    // 7. CONTINUOUS HORIZONTAL LASER SCANNING BEAM PLANE
    const scanPlaneGeo = new THREE.PlaneGeometry(58, 44);
    const scanPlaneMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.14,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const scanPlane = new THREE.Mesh(scanPlaneGeo, scanPlaneMat);
    scanPlane.rotation.x = Math.PI / 2;
    mannequinMaster.add(scanPlane);

    // Glowing laser beam edge line
    const laserLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-29, 0, 0),
      new THREE.Vector3(29, 0, 0),
    ]);
    const laserLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.88,
    });
    const laserLine = new THREE.Line(laserLineGeo, laserLineMat);
    scanPlane.add(laserLine);

    // 8. FLOATING 3D GARMENT SILHOUETTE (Appears & Converges in Chapters 02 & 03)
    const garmentGroup = new THREE.Group();
    garmentGroup.position.set(36, 24, 0);
    garmentGroup.scale.set(0.001, 0.001, 0.001); // Hidden in hero
    scene.add(garmentGroup);

    const jacketGeo = new THREE.CylinderGeometry(17.5, 14.5, 32, 16, 4, true);
    jacketGeo.scale(1.18, 1, 0.92);
    const jacketWire = new THREE.Mesh(
      jacketGeo,
      new THREE.MeshBasicMaterial({
        color: 0xe0e5f2,
        wireframe: true,
        transparent: true,
        opacity: 0.72,
      })
    );
    garmentGroup.add(jacketWire);

    const garmentCollar = new THREE.Mesh(
      new THREE.TorusGeometry(8.5, 1.2, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.85 })
    );
    garmentCollar.rotation.x = Math.PI / 2;
    garmentCollar.position.y = 16;
    garmentGroup.add(garmentCollar);

    // Tolerance Ease Ring around Garment in Chapter 03
    const toleranceEaseRing = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(
        Array.from({ length: 48 }, (_, i) => {
          const a = (i / 48) * Math.PI * 2;
          return new THREE.Vector3(Math.cos(a) * 22, 0, Math.sin(a) * 18);
        })
      ),
      new THREE.LineBasicMaterial({ color: 0x55ffaa, transparent: true, opacity: 0.8 })
    );
    toleranceEaseRing.position.y = 30;
    toleranceEaseRing.visible = false;
    garmentGroup.add(toleranceEaseRing);

    // 9. 3D DEEP SPATIAL METALLIC PARTICLES
    const particleCount = isMobile ? 300 : 750;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 600;
      particlePositions[i + 1] = (Math.random() - 0.5) * 800;
      particlePositions[i + 2] = (Math.random() - 0.5) * 500;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const stardust = new THREE.Points(particleGeo, particleMat);
    scene.add(stardust);

    // 10. REAL-TIME EVENT LISTENER FOR SLIDERS (Chapter 01 & Chapter 03 reactivity)
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
      // Don't drag if clicking buttons, inputs, links or sliders
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
      mannequinMaster.position.x = isMobile ? 0 : 38;
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
        scanPlane.position.y = laserY;

        // Stardust subtle axial drift
        stardust.rotation.y = time * 0.03;
      }

      // CHAPTER-BASED SCENE STATE EVOLUTION (Without moving mannequin vertically!)
      if (scrollProgress < 0.16) {
        // HERO: Large dominant full-body figure (70% viewport height, positioned right-of-center)
        camera.position.z = 210;
        mannequinMaster.position.x = isMobile ? 0 : 38;
        garmentGroup.scale.set(0.001, 0.001, 0.001);
        toleranceEaseRing.visible = false;
      } else if (scrollProgress >= 0.16 && scrollProgress < 0.36) {
        // CHAPTER 01: Universal Body Profile Lab (Shifts right, expands chest/waist calipers)
        camera.position.z = 215;
        mannequinMaster.position.x = isMobile ? 0 : 44;
        const ringPulse = 1 + Math.sin(time * 3) * 0.06;
        chestRingObj.mesh.scale.set(ringPulse, 1, ringPulse);
        waistRingObj.mesh.scale.set(ringPulse, 1, ringPulse);
        garmentGroup.scale.set(0.001, 0.001, 0.001);
      } else if (scrollProgress >= 0.36 && scrollProgress < 0.56) {
        // CHAPTER 02: Garment Ingestion Engine (Garment wireframe emerges alongside mannequin)
        camera.position.z = 225;
        mannequinMaster.position.x = isMobile ? -10 : -18;
        garmentGroup.position.set(isMobile ? 12 : 36, 8, 0);
        garmentGroup.scale.set(0.88, 0.88, 0.88);
        garmentGroup.rotation.y = time * 0.4;
      } else if (scrollProgress >= 0.56 && scrollProgress < 0.74) {
        // CHAPTER 03: Fit Synthesis (Garment converges directly onto the mannequin!)
        camera.position.z = 210;
        mannequinMaster.position.x = isMobile ? 0 : 38;
        garmentGroup.position.set(mannequinMaster.position.x, mannequinMaster.position.y + 12, 0);
        garmentGroup.scale.set(1.08, 1.08, 1.08);
        garmentGroup.rotation.y = mannequinMaster.rotation.y;
        toleranceEaseRing.visible = true;
      } else if (scrollProgress >= 0.74 && scrollProgress < 0.88) {
        // RETAILERS & FAQ: Camera recedes into depth, subtle atmospheric perspective
        camera.position.z = 275;
        mannequinMaster.position.x = isMobile ? 0 : 20;
        garmentGroup.scale.set(0.001, 0.001, 0.001);
      } else {
        // FINAL CTA: Mannequin glides back to center-stage for heroic closing scene
        camera.position.z = 215;
        mannequinMaster.position.x = 0;
        garmentGroup.scale.set(0.001, 0.001, 0.001);
      }

      // Parallax mouse damping
      targetCameraX = mouseX * 16;
      targetCameraY = -mouseY * 12;

      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;

      camera.lookAt(mannequinMaster.position.x * 0.5, 0, 0);

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
