"use client";

import * as React from "react";
import * as THREE from "three";

export function ThreeSceneBackground() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let isMobile = width < 768;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. SCENE, CAMERA, RENDERER
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.0012);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, 0, 320);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: !isMobile,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x050507, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. CINEMATIC 5-POINT LIGHTING RIG
    // Ambient fill
    const ambientLight = new THREE.AmbientLight(0x222632, 2.2);
    scene.add(ambientLight);

    // Overhead Key Softbox (Mouse-responsive light that casts dramatic highlights across chrome & silk)
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.6);
    keyLight.position.set(120, 180, 140);
    scene.add(keyLight);

    // Cool Blue-Silver Rim Light Left (Silhouette pop against pitch black)
    const rimLightLeft = new THREE.DirectionalLight(0xbad4ff, 6.2);
    rimLightLeft.position.set(-180, 120, -100);
    scene.add(rimLightLeft);

    // Warm Silver Rim Light Right (Edge separation)
    const rimLightRight = new THREE.DirectionalLight(0xfff5ea, 5.2);
    rimLightRight.position.set(180, 100, -100);
    scene.add(rimLightRight);

    // Ground Bounce Fill
    const groundBounce = new THREE.DirectionalLight(0x181c25, 1.6);
    groundBounce.position.set(0, -120, 80);
    scene.add(groundBounce);

    // Internal Core Glow Point Light
    const coreGlow = new THREE.PointLight(0xdbe8ff, 3.2, 190);
    coreGlow.position.set(35, 10, -20);
    scene.add(coreGlow);

    // 3. MASTER ROOTS
    const environmentMaster = new THREE.Group();
    scene.add(environmentMaster);

    // A. METALLIC SCULPTURAL FORM (Fluid Chrome Torus Knot)
    // Sits in right/center deep-space (x: 35) framing the scene behind the cards
    const sculptureGroup = new THREE.Group();
    sculptureGroup.position.set(isMobile ? 0 : 38, 8, -40);
    environmentMaster.add(sculptureGroup);

    const knotGeo = new THREE.TorusKnotGeometry(46, 9.2, 200, 36, 2, 3);
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0x98a2b2,
      metalness: 0.96,
      roughness: 0.14,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    });
    const knotMesh = new THREE.Mesh(knotGeo, chromeMat);
    sculptureGroup.add(knotMesh);

    // Delicate architectural contour cage surrounding the sculpture
    const cageGeo = new THREE.TorusKnotGeometry(48, 9.8, 120, 20, 2, 3);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    sculptureGroup.add(cageMesh);

    // Floating Concentric Caliper Orbit Ring
    const orbitRingGeo = new THREE.TorusGeometry(82, 0.45, 16, 120);
    const orbitRingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.92,
      roughness: 0.2,
      transparent: true,
      opacity: 0.45,
    });
    const orbitRing = new THREE.Mesh(orbitRingGeo, orbitRingMat);
    orbitRing.rotation.x = Math.PI * 0.28;
    orbitRing.rotation.y = Math.PI * 0.15;
    sculptureGroup.add(orbitRing);

    // B. DYNAMIC FABRIC SIMULATIONS (Flowing Haute-Couture Silk Ribbons)
    const fabricGroup = new THREE.Group();
    fabricGroup.position.set(isMobile ? 0 : 30, -5, -20);
    environmentMaster.add(fabricGroup);

    // Ribbon 1: Primary billowy silk drape
    const ribbon1Width = isMobile ? 180 : 260;
    const ribbon1Height = 62;
    const ribbon1SegW = 64;
    const ribbon1SegH = 28;
    const ribbon1Geo = new THREE.PlaneGeometry(ribbon1Width, ribbon1Height, ribbon1SegW, ribbon1SegH);
    const ribbon1Mat = new THREE.MeshStandardMaterial({
      color: 0x6e7888,
      metalness: 0.82,
      roughness: 0.26,
      transparent: true,
      opacity: 0.84,
      side: THREE.DoubleSide,
    });
    const ribbon1Mesh = new THREE.Mesh(ribbon1Geo, ribbon1Mat);
    ribbon1Mesh.rotation.x = -Math.PI * 0.18;
    ribbon1Mesh.rotation.z = Math.PI * 0.08;
    fabricGroup.add(ribbon1Mesh);

    // Store base vertices for procedural wave deformation
    const posAttr1 = ribbon1Geo.attributes.position;
    const originalPositions1 = Float32Array.from(posAttr1.array);

    // Ribbon 2: Secondary fluid accent sash
    const ribbon2Geo = new THREE.PlaneGeometry(200, 42, 48, 20);
    const ribbon2Mat = new THREE.MeshStandardMaterial({
      color: 0x9ab0c8,
      metalness: 0.9,
      roughness: 0.2,
      transparent: true,
      opacity: 0.68,
      side: THREE.DoubleSide,
    });
    const ribbon2Mesh = new THREE.Mesh(ribbon2Geo, ribbon2Mat);
    ribbon2Mesh.position.set(0, -18, -30);
    ribbon2Mesh.rotation.x = -Math.PI * 0.24;
    ribbon2Mesh.rotation.z = -Math.PI * 0.12;
    fabricGroup.add(ribbon2Mesh);

    const posAttr2 = ribbon2Geo.attributes.position;
    const originalPositions2 = Float32Array.from(posAttr2.array);

    // C. TECHNICAL FASHION TAILORING DETAILS (Calibrated Arcs & Drafting Grid)
    const techGroup = new THREE.Group();
    techGroup.position.set(isMobile ? 0 : 38, 8, -60);
    environmentMaster.add(techGroup);

    // Tailoring circular measurement arcs
    const arcMat = new THREE.LineBasicMaterial({ color: 0x48566a, transparent: true, opacity: 0.35 });
    [68, 98, 128].forEach((r) => {
      const curve = new THREE.EllipseCurve(0, 0, r, r * 0.85, 0, Math.PI * 2, false, 0);
      const points = curve.getPoints(80);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(arcGeo, arcMat);
      techGroup.add(line);
    });

    // Minimal scanning beam line across fabric (Chapter 02)
    const scanLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-140, 0, 0),
      new THREE.Vector3(140, 0, 0),
    ]);
    const scanLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
    });
    const scanLine = new THREE.Line(scanLineGeo, scanLineMat);
    scanLine.position.y = 0;
    fabricGroup.add(scanLine);

    // D. SOPHISTICATED FINE METALLIC PARTICLES
    const particleCount = isMobile ? 320 : 750;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 800;
      particlePositions[i + 1] = (Math.random() - 0.5) * 900;
      particlePositions[i + 2] = (Math.random() - 0.5) * 600 - 50;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 1.8,
      color: 0xd0e0f5,
      transparent: true,
      opacity: 0.42,
      depthWrite: false,
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    environmentMaster.add(particleField);

    // 4. INTERACTION STATE
    let userRotationY = 0;
    let targetRotationY = 0;
    let userRotationX = 0;
    let targetRotationX = 0;
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;

    let mouseX = 0;
    let mouseY = 0;
    let targetCameraX = 0;
    let targetCameraY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        const deltaY = e.clientY - previousPointerY;
        targetRotationY += deltaX * 0.006;
        targetRotationX += deltaY * 0.004;
        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
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
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("pointerup", handlePointerUp, { passive: true });

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < 768;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      sculptureGroup.position.x = isMobile ? 0 : 38;
      fabricGroup.position.x = isMobile ? 0 : 30;
      techGroup.position.x = isMobile ? 0 : 38;
    };
    window.addEventListener("resize", handleResize);

    // 5. CHOREOGRAPHED ANIMATION LOOP
    let animationFrameId: number;
    const startTime = performance.now();
    let scanLineY = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const elapsed = (performance.now() - startTime) / 1000;

      // 1. Entrance Light & Material Ramp (0.0s to 2.4s)
      const entranceProgress = Math.min(elapsed / 2.2, 1);
      const entranceEase = 1 - Math.pow(1 - entranceProgress, 3);
      keyLight.intensity = 4.6 * entranceEase;
      chromeMat.opacity = 0.92 * entranceEase;
      ribbon1Mat.opacity = 0.84 * entranceEase;
      ribbon2Mat.opacity = 0.68 * entranceEase;

      // 2. Drag & User Rotation Damping
      userRotationY += (targetRotationY - userRotationY) * 0.08;
      userRotationX += (targetRotationX - userRotationX) * 0.08;

      if (!prefersReducedMotion) {
        // Continuous elegant movement
        const baseKnotRotY = elapsed * 0.14;
        const baseKnotRotX = Math.sin(elapsed * 0.25) * 0.12;

        sculptureGroup.rotation.y = baseKnotRotY + userRotationY;
        sculptureGroup.rotation.x = baseKnotRotX + userRotationX;

        orbitRing.rotation.z = elapsed * 0.08;

        // 3. Procedural Silk Fabric Undulation Wave Physics
        const pos1 = ribbon1Geo.attributes.position;
        const orig1 = originalPositions1;
        const count1 = pos1.count;

        for (let i = 0; i < count1; i++) {
          const ox = orig1[i * 3];
          const oy = orig1[i * 3 + 1];

          // Complex fluid sine-cosine traveling wave
          const waveZ =
            Math.sin(ox * 0.035 + elapsed * 1.5) * 11.0 +
            Math.cos(oy * 0.045 + elapsed * 1.8) * 6.5 +
            Math.sin((ox + oy) * 0.02 + elapsed * 0.9) * 4.0;

          pos1.setZ(i, waveZ);
        }
        pos1.needsUpdate = true;
        ribbon1Geo.computeVertexNormals();

        // Ribbon 2 fluid ripple
        const pos2 = ribbon2Geo.attributes.position;
        const orig2 = originalPositions2;
        const count2 = pos2.count;

        for (let i = 0; i < count2; i++) {
          const ox = orig2[i * 3];
          const oy = orig2[i * 3 + 1];
          const waveZ =
            Math.sin(ox * 0.04 - elapsed * 1.6) * 8.5 +
            Math.cos(oy * 0.05 + elapsed * 1.3) * 5.0;

          pos2.setZ(i, waveZ);
        }
        pos2.needsUpdate = true;
        ribbon2Geo.computeVertexNormals();

        // 4. Chapter 02 Scanning beam oscillation
        scanLineY += 0.35;
        if (scanLineY > 30) scanLineY = -30;
        scanLine.position.y = scanLineY;

        // 5. Fine Particle subtle spatial drift
        particleField.rotation.y = elapsed * 0.02;
        particleField.rotation.x = Math.sin(elapsed * 0.015) * 0.04;
      }

      // 6. Mouse-Responsive Studio Key Light Shift across metallic highlights
      keyLight.position.x = 120 + mouseX * 42;
      keyLight.position.y = 180 - mouseY * 32;

      // Subtle parallax camera damp
      targetCameraX = mouseX * 14;
      targetCameraY = -mouseY * 10;
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;

      // 7. Scroll-Driven Cinematic Chapter Camera Transitions
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);

      if (scrollProgress < 0.22) {
        // HERO: Sculptural chrome & silk ribbon framing deep-space behind content
        camera.position.z += (320 - camera.position.z) * 0.05;
        sculptureGroup.scale.set(1.0, 1.0, 1.0);
        fabricGroup.scale.set(1.0, 1.0, 1.0);
        arcMat.opacity = 0.25;
        scanLineMat.opacity = 0.2;
      } else if (scrollProgress >= 0.22 && scrollProgress < 0.42) {
        // CHAPTER 01: Measurement Laboratory (Camera glides closer, tailoring arcs illuminate)
        camera.position.z += (295 - camera.position.z) * 0.05;
        sculptureGroup.scale.set(1.08, 1.08, 1.08);
        fabricGroup.scale.set(1.05, 1.05, 1.05);
        arcMat.opacity = 0.65;
        scanLineMat.opacity = 0.3;
      } else if (scrollProgress >= 0.42 && scrollProgress < 0.62) {
        // CHAPTER 02: Garment Ingestion (Silk fabric ribbons billow into focus with scanning beam)
        camera.position.z += (305 - camera.position.z) * 0.05;
        fabricGroup.scale.set(1.22, 1.22, 1.22);
        arcMat.opacity = 0.3;
        scanLineMat.opacity = 0.85;
      } else if (scrollProgress >= 0.62 && scrollProgress < 0.78) {
        // CHAPTER 03: Fit Synthesis (Harmonic alignment of sculpture & fabric)
        camera.position.z += (315 - camera.position.z) * 0.05;
        sculptureGroup.scale.set(1.12, 1.12, 1.12);
        fabricGroup.scale.set(1.15, 1.15, 1.15);
        arcMat.opacity = 0.5;
        scanLineMat.opacity = 0.4;
      } else {
        // FAQ & FOOTER: Smooth, deep, subdued atmospheric perspective with zero empty space
        camera.position.z += (370 - camera.position.z) * 0.05;
        sculptureGroup.scale.set(0.9, 0.9, 0.9);
        fabricGroup.scale.set(0.85, 0.85, 0.85);
        arcMat.opacity = 0.15;
        scanLineMat.opacity = 0.1;
      }

      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("resize", handleResize);

      knotGeo.dispose();
      chromeMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      orbitRingGeo.dispose();
      orbitRingMat.dispose();
      ribbon1Geo.dispose();
      ribbon1Mat.dispose();
      ribbon2Geo.dispose();
      ribbon2Mat.dispose();
      arcMat.dispose();
      scanLineGeo.dispose();
      scanLineMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

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
