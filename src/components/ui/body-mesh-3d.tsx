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

    const width = mount.clientWidth || 360;
    const height = mount.clientHeight || 500;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 235);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // 2. STUDIO SCIENTIFIC LIGHTING
    const ambientLight = new THREE.AmbientLight(0x282c35, 2.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(70, 140, 110);
    scene.add(keyLight);

    const rimLightLeft = new THREE.DirectionalLight(0xb8cce4, 5.0);
    rimLightLeft.position.set(-130, 90, -80);
    scene.add(rimLightLeft);

    const rimLightRight = new THREE.DirectionalLight(0xffffff, 4.5);
    rimLightRight.position.set(130, 90, -80);
    scene.add(rimLightRight);

    // 3. HUMAN MODEL GROUP — STATIONARY DEFAULT
    const bodyGroup = new THREE.Group();
    scene.add(bodyGroup);
    bodyGroup.position.y = 4;

    // REFINED SILVER & METALLIC MATERIALS
    const silverMetalMat = new THREE.MeshStandardMaterial({
      color: 0x828b98,
      metalness: 0.88,
      roughness: 0.22,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
    });

    const contourWireMat = new THREE.MeshBasicMaterial({
      color: 0xd6e0ec,
      wireframe: true,
      transparent: true,
      opacity: 0.24,
    });

    const segmentHighlightMat = new THREE.MeshStandardMaterial({
      color: 0xd0dae6,
      emissive: 0x334455,
      emissiveIntensity: 0.65,
      metalness: 0.92,
      roughness: 0.12,
      transparent: true,
      opacity: 0.96,
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

    // Head
    const headGeo = new THREE.SphereGeometry(10.5, 18, 14);
    headGeo.scale(1, 1.2, 1.05);
    createBodySegment("head", headGeo, 64, bodyGroup);

    // Torso / Shoulders
    const shoulderGeo = new THREE.CylinderGeometry(19, 17, 6, 18, 2, true);
    createBodySegment("shoulder", shoulderGeo, 48, bodyGroup);

    // Chest
    const chestGeo = new THREE.CylinderGeometry(17.5, 14, 18, 18, 4, true);
    chestGeo.scale(1.05, 1, 0.82);
    createBodySegment("chest", chestGeo, 32, bodyGroup);

    // Natural Waist
    const waistGeo = new THREE.CylinderGeometry(13.5, 14.5, 14, 18, 3, true);
    waistGeo.scale(1, 1, 0.8);
    createBodySegment("waist", waistGeo, 14, bodyGroup);

    // Pelvis & Hips
    const hipGeo = new THREE.CylinderGeometry(14.5, 16.5, 14, 18, 3, true);
    hipGeo.scale(1.06, 1, 0.84);
    createBodySegment("hip", hipGeo, -2, bodyGroup);

    // Legs
    const legGeo = new THREE.CylinderGeometry(4.8, 3.2, 54, 14, 4, true);
    const leftLeg = createBodySegment("inseam_l", legGeo, -36, bodyGroup);
    leftLeg.position.x = -6.8;

    const rightLeg = createBodySegment("inseam_r", legGeo, -36, bodyGroup);
    rightLeg.position.x = 6.8;

    // Arms
    const armGeo = new THREE.CylinderGeometry(3.0, 2.2, 44, 12, 3, true);
    const leftArm = createBodySegment("arm_l", armGeo, 24, bodyGroup);
    leftArm.position.x = -19;
    leftArm.rotation.z = -0.16;

    const rightArm = createBodySegment("arm_r", armGeo, 24, bodyGroup);
    rightArm.position.x = 19;
    rightArm.rotation.z = 0.16;

    // 4. MEASUREMENT GUIDES (Refined thin Torus rings)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x334455,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.15,
      transparent: true,
      opacity: 0.8,
    });

    const activeRingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x6688aa,
      emissiveIntensity: 0.9,
      metalness: 0.95,
      roughness: 0.08,
      transparent: true,
      opacity: 1.0,
    });

    const createCaliperRing = (radius: number, yPos: number) => {
      const geo = new THREE.TorusGeometry(radius, 0.35, 12, 48);
      geo.rotateX(Math.PI / 2);
      geo.scale(1, 1, 0.82);
      const mesh = new THREE.Mesh(geo, ringMat);
      mesh.position.y = yPos;
      bodyGroup.add(mesh);
      return mesh;
    };

    const rings: Record<string, THREE.Mesh> = {
      shoulder: createCaliperRing(21.5, 48),
      chest: createCaliperRing(18.5, 32),
      waist: createCaliperRing(15.2, 14),
      hip: createCaliperRing(17.8, -2),
      inseam: createCaliperRing(11.0, -26),
    };

    // 5. INTERACTION & CONTROLLED DRAGGING — NO AUTO-ROTATION!
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
      // STOP IMMEDIATELY — No continuing spin or drift!
      targetRotationY = userRotationY;
    };

    if (interactive) {
      mount.addEventListener("pointerdown", onPointerDown);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
    }

    // 6. ANIMATION LOOP — PURE STABILITY
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Smooth damping that settles firmly
      userRotationY += (targetRotationY - userRotationY) * 0.25;
      bodyGroup.rotation.y = userRotationY;

      // Highlight active body segment and measurement ring
      Object.keys(segmentMeshes).forEach((key) => {
        const seg = segmentMeshes[key];
        const isActive = activeZone && (key === activeZone || key.startsWith(activeZone));
        seg.solid.material = isActive ? segmentHighlightMat : silverMetalMat;
      });

      Object.keys(rings).forEach((key) => {
        const ring = rings[key];
        const isActive = activeZone === key;
        ring.material = isActive ? activeRingMat : ringMat;
        ring.scale.setScalar(isActive ? 1.05 : 1.0);
      });

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
        className="w-full h-[400px] sm:h-[440px] cursor-grab active:cursor-grabbing relative z-10"
      />

      {/* Futuristic Precision Caliper HUD Callouts */}
      <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-between p-4">
        {/* Top Header Technical Tag with Reset View Button */}
        <div className="flex items-center justify-between text-[10px] font-mono text-[#888]">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-white font-medium">3D PRECISION RIG</span>
          </span>
          <button
            type="button"
            onClick={() => resetCallbackRef.current?.()}
            className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>RESET VIEW</span>
          </button>
        </div>

        {/* Anatomical Caliper Callout Tags with Interactive Selection */}
        <div className="space-y-2 pointer-events-auto max-w-[210px] ml-auto">
          {/* Shoulders */}
          <div
            onClick={() => onSelectDimension?.("shoulder")}
            onMouseEnter={() => setHoveredZone("shoulder")}
            onMouseLeave={() => setHoveredZone(null)}
            className={`group flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-200 cursor-pointer ${
              activeZone === "shoulder"
                ? "border-white bg-white/15 text-white shadow-lg"
                : "border-white/10 bg-[#0c0d12]/80 text-[#888] hover:border-white/30 hover:text-white"
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider">SHOULDERS</span>
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
                ? "border-white bg-white/15 text-white shadow-lg"
                : "border-white/10 bg-[#0c0d12]/80 text-[#888] hover:border-white/30 hover:text-white"
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider">CHEST</span>
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
                ? "border-white bg-white/15 text-white shadow-lg"
                : "border-white/10 bg-[#0c0d12]/80 text-[#888] hover:border-white/30 hover:text-white"
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider">WAIST</span>
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
                ? "border-white bg-white/15 text-white shadow-lg"
                : "border-white/10 bg-[#0c0d12]/80 text-[#888] hover:border-white/30 hover:text-white"
            }`}
          >
            <span className="text-[10px] uppercase tracking-wider">HIPS</span>
            <span className="font-bold text-white">
              {currentValues?.hip ? `${currentValues.hip} ${unit}` : "102 cm"}
            </span>
          </div>
        </div>

        {/* Footer Coordinate Ticks */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[9px] font-mono text-[#666]">
          <span>HORIZONTAL YAW: DRAG 360°</span>
          <span>STOP ON RELEASE</span>
        </div>
      </div>
    </div>
  );
}
