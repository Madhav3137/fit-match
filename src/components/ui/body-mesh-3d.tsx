"use client";

import * as React from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

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

  const activeZone = activeDimension || hoveredZone;

  React.useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 360;
    const height = mount.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 240);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Humanoid Model Group
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);
    bodyGroup.position.y = 8;

    // 2. PROCEDURAL 3D WIREFRAME ANATOMICAL SILHOUETTE
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.75,
    });

    const activeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 1.0,
    });

    // Cranium / Head
    const headGeo = new THREE.SphereGeometry(12, 12, 12);
    const headMesh = new THREE.Mesh(headGeo, wireMat);
    headMesh.position.y = 66;
    bodyGroup.add(headMesh);

    // Torso / Chest
    const torsoGeo = new THREE.CylinderGeometry(18, 14, 32, 16, 6, true);
    const torsoMesh = new THREE.Mesh(torsoGeo, wireMat);
    torsoMesh.position.y = 36;
    bodyGroup.add(torsoMesh);

    // Abdomen & Waist
    const waistGeo = new THREE.CylinderGeometry(14, 15, 20, 16, 4, true);
    const waistMesh = new THREE.Mesh(waistGeo, wireMat);
    waistMesh.position.y = 10;
    bodyGroup.add(waistMesh);

    // Pelvis & Hips
    const hipGeo = new THREE.CylinderGeometry(15, 17, 18, 16, 4, true);
    const hipMesh = new THREE.Mesh(hipGeo, wireMat);
    hipMesh.position.y = -8;
    bodyGroup.add(hipMesh);

    // Left Leg
    const legLeftGeo = new THREE.CylinderGeometry(6, 4, 65, 10, 8, true);
    const legLeft = new THREE.Mesh(legLeftGeo, wireMat);
    legLeft.position.set(-8, -48, 0);
    bodyGroup.add(legLeft);

    // Right Leg
    const legRight = new THREE.Mesh(legLeftGeo, wireMat);
    legRight.position.set(8, -48, 0);
    bodyGroup.add(legRight);

    // Arms
    const armGeo = new THREE.CylinderGeometry(3.5, 2.5, 50, 8, 6, true);
    const armLeft = new THREE.Mesh(armGeo, wireMat);
    armLeft.position.set(-22, 28, 0);
    armLeft.rotation.z = Math.PI * 0.08;
    bodyGroup.add(armLeft);

    const armRight = new THREE.Mesh(armGeo, wireMat);
    armRight.position.set(22, 28, 0);
    armRight.rotation.z = -Math.PI * 0.08;
    bodyGroup.add(armRight);

    // 3. ANATOMICAL 3D MEASUREMENT CALIPER RINGS
    const createRing = (radius: number, yPos: number, opacity = 0.85) => {
      const geo = new THREE.TorusGeometry(radius, 0.65, 16, 64);
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = Math.PI / 2;
      mesh.position.y = yPos;
      bodyGroup.add(mesh);
      return mesh;
    };

    const shoulderRing = createRing(25, 48, 0.75);
    const chestRing = createRing(21, 30, 0.95);
    const waistRing = createRing(17, 10, 0.85);
    const hipRing = createRing(20, -10, 0.85);

    // 4. VERTICAL 3D SCANNING LASER PLANE
    const laserGeo = new THREE.PlaneGeometry(60, 60);
    const laserCanvas = document.createElement("canvas");
    laserCanvas.width = 128;
    laserCanvas.height = 128;
    const lctx = laserCanvas.getContext("2d");
    if (lctx) {
      const rad = lctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      rad.addColorStop(0, "rgba(255, 255, 255, 0.35)");
      rad.addColorStop(0.5, "rgba(255, 255, 255, 0.08)");
      rad.addColorStop(1, "rgba(255, 255, 255, 0)");
      lctx.fillStyle = rad;
      lctx.fillRect(0, 0, 128, 128);
    }
    const laserTex = new THREE.CanvasTexture(laserCanvas);
    const laserMat = new THREE.MeshBasicMaterial({
      map: laserTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const laserPlane = new THREE.Mesh(laserGeo, laserMat);
    laserPlane.rotation.x = Math.PI / 2;
    bodyGroup.add(laserPlane);

    // Laser Edge Hairline
    const laserLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-30, 0, 0),
      new THREE.Vector3(30, 0, 0),
    ]);
    const laserLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.8,
    });
    const laserLine = new THREE.Line(laserLineGeo, laserLineMat);
    laserPlane.add(laserLine);

    // 5. INTERACTION & ROTATION DRAG
    let isDragging = false;
    let previousMouseX = 0;
    let rotationVelocity = 0.008;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMouseX = e.clientX;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - previousMouseX;
      bodyGroup.rotation.y += deltaX * 0.01;
      rotationVelocity = deltaX * 0.002;
      previousMouseX = e.clientX;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    if (interactive) {
      mount.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }

    // 6. ANIMATION LOOP
    let animId: number;
    let time = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      time += 0.02;

      // Inertial rotation
      if (!isDragging) {
        bodyGroup.rotation.y += rotationVelocity;
        rotationVelocity += (0.006 - rotationVelocity) * 0.04;
      }

      // Vertical laser scan oscillation
      const laserY = Math.sin(time * 0.9) * 75 - 5;
      laserPlane.position.y = laserY;

      // Highlight rings when scanning laser passes by
      shoulderRing.scale.setScalar(1 + Math.max(0, 1 - Math.abs(laserY - 48) / 12) * 0.08);
      chestRing.scale.setScalar(1 + Math.max(0, 1 - Math.abs(laserY - 30) / 12) * 0.08);
      waistRing.scale.setScalar(1 + Math.max(0, 1 - Math.abs(laserY - 10) / 12) * 0.08);
      hipRing.scale.setScalar(1 + Math.max(0, 1 - Math.abs(laserY - (-10)) / 12) * 0.08);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      if (interactive) {
        mount.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      }
      if (mount && renderer.domElement) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      headGeo.dispose();
      torsoGeo.dispose();
      waistGeo.dispose();
      hipGeo.dispose();
      legLeftGeo.dispose();
      armGeo.dispose();
      laserGeo.dispose();
      laserTex.dispose();
      wireMat.dispose();
      activeMat.dispose();
    };
  }, [interactive]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* 3D WebGL Canvas Mount */}
      <div
        ref={mountRef}
        className="w-full h-[460px] sm:h-[500px] cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Futuristic Precision Caliper HUD Callouts */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4">
        {/* Top Header Technical Tag */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[#888]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>3D CALIBRATION ENGINE // V.02</span>
          </span>
          <span className="text-white/60">DRAG TO ROTATE 360°</span>
        </div>

        {/* Anatomical Caliper Callout Tags with Interactive Selection */}
        <div className="space-y-4 pointer-events-auto">
          {/* Shoulders */}
          <div
            onClick={() => onSelectDimension?.("shoulder")}
            onMouseEnter={() => setHoveredZone("shoulder")}
            onMouseLeave={() => setHoveredZone(null)}
            className={`group flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer ${
              activeZone === "shoulder"
                ? "border-white bg-white/10 text-white shadow-lg"
                : "border-[#262626] bg-[#0d0d0d]/80 text-[#888] hover:border-neutral-500 hover:text-white"
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider">01 // SHOULDERS</span>
            <span className="font-bold text-white">
              {currentValues?.shoulder ? `${currentValues.shoulder} ${unit}` : "46 cm"}
            </span>
          </div>

          {/* Chest */}
          <div
            onClick={() => onSelectDimension?.("chest")}
            onMouseEnter={() => setHoveredZone("chest")}
            onMouseLeave={() => setHoveredZone(null)}
            className={`group flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer ${
              activeZone === "chest"
                ? "border-white bg-white/10 text-white shadow-lg"
                : "border-[#262626] bg-[#0d0d0d]/80 text-[#888] hover:border-neutral-500 hover:text-white"
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider">02 // CHEST / BUST</span>
            <span className="font-bold text-white">
              {currentValues?.chest ? `${currentValues.chest} ${unit}` : "98 cm"}
            </span>
          </div>

          {/* Waist */}
          <div
            onClick={() => onSelectDimension?.("waist")}
            onMouseEnter={() => setHoveredZone("waist")}
            onMouseLeave={() => setHoveredZone(null)}
            className={`group flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer ${
              activeZone === "waist"
                ? "border-white bg-white/10 text-white shadow-lg"
                : "border-[#262626] bg-[#0d0d0d]/80 text-[#888] hover:border-neutral-500 hover:text-white"
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider">03 // WAIST</span>
            <span className="font-bold text-white">
              {currentValues?.waist ? `${currentValues.waist} ${unit}` : "84 cm"}
            </span>
          </div>

          {/* Hips */}
          <div
            onClick={() => onSelectDimension?.("hip")}
            onMouseEnter={() => setHoveredZone("hip")}
            onMouseLeave={() => setHoveredZone(null)}
            className={`group flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer ${
              activeZone === "hip"
                ? "border-white bg-white/10 text-white shadow-lg"
                : "border-[#262626] bg-[#0d0d0d]/80 text-[#888] hover:border-neutral-500 hover:text-white"
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider">04 // HIPS</span>
            <span className="font-bold text-white">
              {currentValues?.hip ? `${currentValues.hip} ${unit}` : "102 cm"}
            </span>
          </div>
        </div>

        {/* Footer Coordinate Ticks */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1e1e1e] text-[9px] font-mono text-[#555]">
          <span>AZIMUTH: 360° TURNTABLE</span>
          <span>LASER VERTICAL FREQ: 0.9HZ</span>
        </div>
      </div>
    </div>
  );
}

