"use client";

import * as React from "react";
import * as THREE from "three";

export function ThreeSceneBackground() {
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x080808, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.set(0, 0, 450);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: !isMobile,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // 2. 3D PARTICLE FIELD (2,200 points on desktop, 700 on mobile)
    const particleCount = isMobile ? 650 : 2200;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const initialPos = new Float32Array(particleCount * 3);
    const speedArray = new Float32Array(particleCount);

    const spreadX = 1400;
    const spreadY = 1600;
    const spreadZ = 1200;

    for (let i = 0; i < particleCount * 3; i += 3) {
      const x = (Math.random() - 0.5) * spreadX;
      const y = (Math.random() - 0.5) * spreadY;
      const z = (Math.random() - 0.5) * spreadZ;

      posArray[i] = x;
      posArray[i + 1] = y;
      posArray[i + 2] = z;

      initialPos[i] = x;
      initialPos[i + 1] = y;
      initialPos[i + 2] = z;

      speedArray[i / 3] = Math.random() * 0.8 + 0.4;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));

    // Particle texture (soft circular glow)
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
      gradient.addColorStop(0.3, "rgba(255, 255, 255, 0.7)");
      gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 3.5 : 4.5,
      map: particleTexture,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 3. 3D CONCENTRIC ORBITAL STRUCTURES
    const orbitalGroup = new THREE.Group();
    scene.add(orbitalGroup);
    orbitalGroup.position.set(220, 40, -100);

    // Ring 1: Outer Torus
    const ring1Geo = new THREE.TorusGeometry(180, 0.6, 16, 120);
    const ring1Mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    orbitalGroup.add(ring1);

    // Ring 2: Mid Dotted/Segmented Ring
    const ring2Geo = new THREE.TorusGeometry(130, 0.5, 16, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      wireframe: true,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = Math.PI / 4;
    orbitalGroup.add(ring2);

    // Ring 3: Inner Orbital Core
    const ring3Geo = new THREE.TorusGeometry(80, 0.4, 16, 60);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16,
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.y = Math.PI / 3;
    orbitalGroup.add(ring3);

    // Central 3D Geodesic Wireframe Node
    const coreGeo = new THREE.IcosahedronGeometry(35, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.12,
    });
    const coreNode = new THREE.Mesh(coreGeo, coreMat);
    orbitalGroup.add(coreNode);

    // Secondary Left Orbital Structure for mid-scroll depth
    const midOrbitalGroup = new THREE.Group();
    scene.add(midOrbitalGroup);
    midOrbitalGroup.position.set(-280, -350, -180);

    const midRingGeo = new THREE.TorusGeometry(140, 0.6, 16, 100);
    const midRingMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.14,
      wireframe: true,
    });
    const midRing = new THREE.Mesh(midRingGeo, midRingMat);
    midOrbitalGroup.add(midRing);

    // 4. MOUSE & SCROLL STATE TRACKING
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

    // Handle Window Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // 5. ANIMATION LOOP WITH SPATIAL CAMERA MOTION
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (document.hidden) return;

      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Smooth scroll interpolation
      scrollY += (targetScrollY - scrollY) * 0.08;

      if (!prefersReducedMotion) {
        // Continuous rotation of orbital structures
        ring1.rotation.z += 0.003;
        ring1.rotation.y += 0.002;

        ring2.rotation.z -= 0.004;
        ring2.rotation.x += 0.003;

        ring3.rotation.y += 0.005;
        coreNode.rotation.x += 0.004;
        coreNode.rotation.y += 0.003;

        midRing.rotation.y += 0.003;
        midRing.rotation.z -= 0.002;

        // Subtle organic undulation of particles
        const positions = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount * 3; i += 3) {
          const speed = speedArray[i / 3];
          positions[i] = initialPos[i] + Math.sin(elapsedTime * speed + i) * 6;
          positions[i + 1] = initialPos[i + 1] + Math.cos(elapsedTime * speed * 0.8 + i) * 8;
        }
        particleGeo.attributes.position.needsUpdate = true;
      }

      // Smooth mouse parallax targeting
      targetCameraX = mouseX * 45;
      targetCameraY = -mouseY * 35;

      camera.position.x += (targetCameraX - camera.position.x) * 0.05;
      camera.position.y += (targetCameraY - (scrollY * 0.35) - camera.position.y) * 0.05;

      // Scroll-linked camera depth zoom & rotation
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      const scrollProgress = scrollY / maxScroll;

      camera.position.z = 450 - scrollProgress * 180;
      orbitalGroup.rotation.y = scrollProgress * Math.PI * 1.5;
      midOrbitalGroup.rotation.x = scrollProgress * Math.PI;

      camera.lookAt(0, camera.position.y * 0.8, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup resources on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      ring3Geo.dispose();
      ring3Mat.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      midRingGeo.dispose();
      midRingMat.dispose();
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
