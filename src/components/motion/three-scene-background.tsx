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
    scene.fog = new THREE.FogExp2(0x080808, 0.0014);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 0, 220);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x080808, 1);
    container.appendChild(renderer.domElement);

    // 2. LIGHTING RIG
    const ambientLight = new THREE.AmbientLight(0x555560, 2.0);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(120, 160, 140);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xa5b8d0, 3.2);
    rimLight.position.set(-140, 120, -80);
    scene.add(rimLight);

    const bottomLight = new THREE.DirectionalLight(0x404855, 1.2);
    bottomLight.position.set(0, -120, 80);
    scene.add(bottomLight);

    // 3. MASTER MANNEQUIN ROOT GROUP
    const mannequinMaster = new THREE.Group();
    scene.add(mannequinMaster);
    mannequinMaster.position.set(isMobile ? 0 : 38, -4, 0);

    // Shared Materials
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xe2e2e8,
      wireframe: true,
      transparent: true,
      opacity: 0.58,
    });

    const activeWireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });

    const solidInnerMat = new THREE.MeshStandardMaterial({
      color: 0x111116,
      roughness: 0.25,
      metalness: 0.85,
      transparent: true,
      opacity: 0.42,
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
    createBodySegment(shoulderGeo, 39.5, torsoGroup);

    // Deltoid caps (Shoulder joints)
    const deltoidGeo = new THREE.SphereGeometry(3.8, 12, 10);
    const leftDeltoid = createBodySegment(deltoidGeo, 39, torsoGroup);
    leftDeltoid.position.x = -16.5;
    const rightDeltoid = createBodySegment(deltoidGeo, 39, torsoGroup);
    rightDeltoid.position.x = 16.5;

    // Chest / Thorax (Tapering to solar plexus)
    const chestGeo = new THREE.CylinderGeometry(14.8, 12.0, 14.5, 18, 4, true);
    chestGeo.scale(1.05, 1, 0.82);
    createBodySegment(chestGeo, 30.5, torsoGroup);

    // C. ABDOMEN & NATURAL WAIST
    const waistGeo = new THREE.CylinderGeometry(11.8, 12.8, 11.5, 18, 3, true);
    waistGeo.scale(1, 1, 0.78);
    createBodySegment(waistGeo, 17.5, torsoGroup);

    // D. PELVIS & HIPS
    const pelvisGeo = new THREE.CylinderGeometry(12.8, 14.8, 13, 18, 3, true);
    pelvisGeo.scale(1.08, 1, 0.85);
    createBodySegment(pelvisGeo, 5.5, mannequinMaster);

    // E. ARMS (Left and Right relaxed tailoring A-pose)
    const createArm = (isRight: boolean) => {
      const armGroup = new THREE.Group();
      const sign = isRight ? 1 : -1;
      armGroup.position.set(sign * 16.5, 38, 0);
      armGroup.rotation.z = sign * -0.16; // Slight outward angle
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

    createLeg(false); // Left leg
    createLeg(true);  // Right leg

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
    const caliperRings: { mesh: THREE.LineLoop; speed: number; rotAxis: string }[] = [];

    const createCaliperRing = (radius: number, posY: number, color = 0xffffff, speed = 0.015) => {
      const segments = 48;
      const ringGeometry = new THREE.BufferGeometry();
      const positions = new Float32Array((segments + 1) * 3);

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        positions[i * 3] = Math.cos(theta) * radius;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = Math.sin(theta) * (radius * 0.78); // Subtle anatomical ellipse
      }

      ringGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const ringLineMat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.75,
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

      caliperRings.push({ mesh: ringLoop, speed, rotAxis: "y" });
      return ringLoop;
    };

    const shoulderRing = createCaliperRing(20.5, 39, 0xffffff, 0.012);
    const chestRing = createCaliperRing(18.5, 31, 0xffffff, -0.016);
    const waistRing = createCaliperRing(15.2, 17, 0xffffff, 0.014);
    const hipRing = createCaliperRing(17.8, 5, 0xffffff, -0.012);

    // 5. GIANT OUTER ORBITAL CALIPER (Surrounds the entire body at 45 degrees)
    const outerOrbitalGeo = new THREE.BufferGeometry();
    const outerSegments = 64;
    const outerRadius = 78;
    const outerPos = new Float32Array((outerSegments + 1) * 3);

    for (let i = 0; i <= outerSegments; i++) {
      const theta = (i / outerSegments) * Math.PI * 2;
      outerPos[i * 3] = Math.cos(theta) * outerRadius;
      outerPos[i * 3 + 1] = Math.sin(theta) * (outerRadius * 0.95);
      outerPos[i * 3 + 2] = 0;
    }

    outerOrbitalGeo.setAttribute("position", new THREE.BufferAttribute(outerPos, 3));
    const outerOrbitalMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
    });
    const outerOrbital = new THREE.LineLoop(outerOrbitalGeo, outerOrbitalMat);
    outerOrbital.rotation.x = Math.PI * 0.22;
    outerOrbital.rotation.y = Math.PI * 0.15;
    mannequinMaster.add(outerOrbital);

    // 6. CONTINUOUS HORIZONTAL LASER SCANNING BEAM PLANE
    const scanPlaneGeo = new THREE.PlaneGeometry(54, 42);
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
    mannequinMaster.add(scanPlane);

    // Glowing laser beam edge line
    const laserLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-27, 0, 0),
      new THREE.Vector3(27, 0, 0),
    ]);
    const laserLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });
    const laserLine = new THREE.Line(laserLineGeo, laserLineMat);
    scanPlane.add(laserLine);

    // 7. FLOATING 3D GARMENT SILHOUETTE (Appears & Converges in Chapters 02 & 03)
    const garmentGroup = new THREE.Group();
    garmentGroup.position.set(35, 24, 0);
    garmentGroup.scale.set(0.01, 0.01, 0.01); // Initially hidden in hero
    scene.add(garmentGroup);

    // Procedural tailored jacket wireframe
    const jacketGeo = new THREE.CylinderGeometry(17.5, 14.5, 32, 16, 4, true);
    jacketGeo.scale(1.18, 1, 0.92);
    const jacketWire = new THREE.Mesh(
      jacketGeo,
      new THREE.MeshBasicMaterial({
        color: 0xe0e5f0,
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      })
    );
    garmentGroup.add(jacketWire);

    const garmentCollar = new THREE.Mesh(
      new THREE.TorusGeometry(8.5, 1.2, 8, 24),
      new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.8 })
    );
    garmentCollar.rotation.x = Math.PI / 2;
    garmentCollar.position.y = 16;
    garmentGroup.add(garmentCollar);

    // 8. 3D DEEP SPATIAL PARTICLES
    const particleCount = isMobile ? 300 : 700;
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
      opacity: 0.32,
      depthWrite: false,
    });
    const stardust = new THREE.Points(particleGeo, particleMat);
    scene.add(stardust);

    // 9. SMOOTH INTERACTION & SCROLL COORDINATION
    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;
    let scrollY = 0;
    let targetScrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
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

    // 10. CONTINUOUS ANIMATION LOOP
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

      if (!prefersReducedMotion) {
        // Continuous 360-degree rotation of the mannequin
        mannequinMaster.rotation.y = time * 0.28 + scrollProgress * Math.PI * 1.5;

        // Subtle anatomical breathing & floating oscillation
        torsoGroup.scale.set(
          1 + Math.sin(time * 1.8) * 0.015,
          1,
          1 + Math.sin(time * 1.8) * 0.02
        );
        mannequinMaster.position.y = (isMobile ? -2 : -4) + Math.sin(time * 1.2) * 2.5;

        // Rotate individual caliper rings at differential speeds
        caliperRings.forEach((r) => {
          r.mesh.rotation.y += r.speed;
        });

        // Rotate giant outer orbital ring
        outerOrbital.rotation.z = time * 0.12;

        // Continuous vertical laser scanning beam plane travel from head to feet
        const laserY = Math.sin(time * 1.5) * 52;
        scanPlane.position.y = laserY;

        // Stardust subtle axial drift
        stardust.rotation.y = time * 0.03;
      }

      // CHAPTER-BASED 3D SPATIAL CHOREOGRAPHY
      if (scrollProgress < 0.16) {
        // HERO: Large dominant full-body figure (70% viewport height)
        camera.position.z = 210;
        mannequinMaster.position.x = isMobile ? 0 : 36;
        garmentGroup.scale.set(0.001, 0.001, 0.001);
        chestRing.scale.set(1, 1, 1);
      } else if (scrollProgress >= 0.16 && scrollProgress < 0.36) {
        // CHAPTER 01: Universal Body Profile Lab (Shifts right, expands chest/waist calipers)
        camera.position.z = 215;
        mannequinMaster.position.x = isMobile ? 0 : 44;
        const ringPulse = 1 + Math.sin(time * 3) * 0.08;
        chestRing.scale.set(ringPulse, 1, ringPulse);
        waistRing.scale.set(ringPulse, 1, ringPulse);
        garmentGroup.scale.set(0.001, 0.001, 0.001);
      } else if (scrollProgress >= 0.36 && scrollProgress < 0.56) {
        // CHAPTER 02: Garment Ingestion Engine (Garment wireframe emerges alongside mannequin)
        camera.position.z = 225;
        mannequinMaster.position.x = isMobile ? -10 : -18;
        garmentGroup.position.set(isMobile ? 12 : 36, 10, 0);
        garmentGroup.scale.set(0.88, 0.88, 0.88);
        garmentGroup.rotation.y = time * 0.4;
      } else if (scrollProgress >= 0.56 && scrollProgress < 0.74) {
        // CHAPTER 03: Fit Synthesis (Garment converges directly onto the mannequin!)
        camera.position.z = 210;
        mannequinMaster.position.x = isMobile ? 0 : 36;
        garmentGroup.position.set(mannequinMaster.position.x, mannequinMaster.position.y + 12, 0);
        garmentGroup.scale.set(1.08, 1.08, 1.08); // Envelopes torso with fit ease
        garmentGroup.rotation.y = mannequinMaster.rotation.y;
      } else if (scrollProgress >= 0.74 && scrollProgress < 0.88) {
        // RETAILERS & FAQ: Camera recedes into depth, subtle atmospheric perspective
        camera.position.z = 270;
        mannequinMaster.position.x = isMobile ? 0 : 20;
        garmentGroup.scale.set(0.001, 0.001, 0.001);
      } else {
        // FINAL CTA: Mannequin glides back to center-stage for heroic closing scene
        camera.position.z = 215;
        mannequinMaster.position.x = 0;
        garmentGroup.scale.set(0.001, 0.001, 0.001);
      }

      // Parallax mouse damping
      targetCameraX = mouseX * 18;
      targetCameraY = -mouseY * 14;

      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;

      camera.lookAt(mannequinMaster.position.x * 0.5, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

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
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none bg-[#080808]"
    />
  );
}
