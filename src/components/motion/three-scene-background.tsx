"use client";

import * as React from "react";
import * as THREE from "three";

interface ScrollKeyframe {
  p: number; // Normalized scroll progress [0..1]
  cameraZ: number;
  sculptureScale: number;
  fabricScale: number;
  orbitalScale: number;
  arcOpacity: number;
  scanOpacity: number;
}

const SCROLL_KEYFRAMES: ScrollKeyframe[] = [
  // 0.00: Hero (Framing deep-space backdrop behind headline and hero card)
  { p: 0.00, cameraZ: 310, sculptureScale: 1.00, fabricScale: 1.00, orbitalScale: 1.00, arcOpacity: 0.35, scanOpacity: 0.25 },
  // 0.26: Chapter 01 Profile (Camera glides subtly closer, tailoring caliper arcs illuminate)
  { p: 0.26, cameraZ: 292, sculptureScale: 1.07, fabricScale: 1.05, orbitalScale: 1.05, arcOpacity: 0.65, scanOpacity: 0.40 },
  // 0.48: Chapter 02 Scanner (Silk ribbons billow into focus with active optical scanning beam)
  { p: 0.48, cameraZ: 296, sculptureScale: 1.11, fabricScale: 1.16, orbitalScale: 1.09, arcOpacity: 0.50, scanOpacity: 0.80 },
  // 0.68: Chapter 03 Synthesis (Harmonic alignment of sculptural knot & fluid fabric)
  { p: 0.68, cameraZ: 304, sculptureScale: 1.10, fabricScale: 1.11, orbitalScale: 1.08, arcOpacity: 0.55, scanOpacity: 0.50 },
  // 0.85: FAQ Section (Gradual, subtle atmospheric perspective with zero sudden resizing)
  { p: 0.85, cameraZ: 318, sculptureScale: 1.04, fabricScale: 1.02, orbitalScale: 1.03, arcOpacity: 0.35, scanOpacity: 0.30 },
  // 1.00: Closing CTA & Footer (Graceful deep-space resolve)
  { p: 1.00, cameraZ: 328, sculptureScale: 0.98, fabricScale: 0.96, orbitalScale: 0.98, arcOpacity: 0.25, scanOpacity: 0.20 },
];

function getInterpolatedKeyframe(p: number): ScrollKeyframe {
  const clamped = Math.min(Math.max(p, 0), 1);
  let i = 0;
  while (i < SCROLL_KEYFRAMES.length - 1 && SCROLL_KEYFRAMES[i + 1].p < clamped) {
    i++;
  }
  if (i >= SCROLL_KEYFRAMES.length - 1) return SCROLL_KEYFRAMES[SCROLL_KEYFRAMES.length - 1];

  const k1 = SCROLL_KEYFRAMES[i];
  const k2 = SCROLL_KEYFRAMES[i + 1];
  const range = k2.p - k1.p;
  const localT = range > 0 ? (clamped - k1.p) / range : 0;
  // Cubic smoothstep easing: continuous 1st derivative (zero jumps or abrupt jerks)
  const easeT = localT * localT * (3 - 2 * localT);

  const lerp = (a: number, b: number) => a + (b - a) * easeT;

  return {
    p: clamped,
    cameraZ: lerp(k1.cameraZ, k2.cameraZ),
    sculptureScale: lerp(k1.sculptureScale, k2.sculptureScale),
    fabricScale: lerp(k1.fabricScale, k2.fabricScale),
    orbitalScale: lerp(k1.orbitalScale, k2.orbitalScale),
    arcOpacity: lerp(k1.arcOpacity, k2.arcOpacity),
    scanOpacity: lerp(k1.scanOpacity, k2.scanOpacity),
  };
}

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
    scene.fog = new THREE.FogExp2(0x050507, 0.00085);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 2000);
    camera.position.set(0, 0, 310);

    const renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: !isMobile,
      alpha: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setClearColor(0x050507, 1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // 2. PROCEDURAL HIGH-CONTRAST STUDIO REFLECTION MAP
    const envCanvas = document.createElement("canvas");
    envCanvas.width = 512;
    envCanvas.height = 256;
    const ectx = envCanvas.getContext("2d");
    if (ectx) {
      ectx.fillStyle = "#07090d";
      ectx.fillRect(0, 0, 512, 256);

      // Studio softbox 1 (top right)
      const grad1 = ectx.createRadialGradient(380, 60, 0, 380, 60, 160);
      grad1.addColorStop(0, "rgba(255, 255, 255, 1.0)");
      grad1.addColorStop(0.3, "rgba(200, 225, 255, 0.75)");
      grad1.addColorStop(1, "rgba(7, 9, 13, 0)");
      ectx.fillStyle = grad1;
      ectx.fillRect(200, 0, 312, 180);

      // Studio softbox 2 (left edge rim)
      const grad2 = ectx.createRadialGradient(80, 120, 0, 80, 120, 140);
      grad2.addColorStop(0, "rgba(215, 238, 255, 0.95)");
      grad2.addColorStop(0.4, "rgba(125, 165, 225, 0.5)");
      grad2.addColorStop(1, "rgba(7, 9, 13, 0)");
      ectx.fillStyle = grad2;
      ectx.fillRect(0, 0, 220, 256);

      // Studio floor reflection strip
      const grad3 = ectx.createLinearGradient(0, 200, 0, 256);
      grad3.addColorStop(0, "rgba(30, 42, 60, 0)");
      grad3.addColorStop(0.5, "rgba(150, 180, 220, 0.4)");
      grad3.addColorStop(1, "rgba(10, 12, 18, 0)");
      ectx.fillStyle = grad3;
      ectx.fillRect(0, 200, 512, 56);
    }
    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = envTexture;

    // 3. CINEMATIC MULTI-LIGHT RIG
    const ambientLight = new THREE.AmbientLight(0x2a3242, 2.8);
    scene.add(ambientLight);

    // Primary Dynamic Key Softbox
    const keyLight = new THREE.DirectionalLight(0xffffff, 5.4);
    keyLight.position.set(130, 180, 150);
    scene.add(keyLight);

    // Dynamic Mouse-Tracking Spotlight (Follows cursor in 3D world space)
    const mouseLight = new THREE.PointLight(0xd8e8ff, 4.8, 380);
    mouseLight.position.set(50, 20, 80);
    scene.add(mouseLight);

    // Cool Blue-Silver Rim Light Left
    const rimLightLeft = new THREE.DirectionalLight(0xc0dcff, 7.8);
    rimLightLeft.position.set(-190, 130, -110);
    scene.add(rimLightLeft);

    // Warm Platinum Rim Light Right
    const rimLightRight = new THREE.DirectionalLight(0xfff6ec, 6.4);
    rimLightRight.position.set(190, 110, -110);
    scene.add(rimLightRight);

    // Ground Bounce Fill
    const groundBounce = new THREE.DirectionalLight(0x242c3c, 2.2);
    groundBounce.position.set(0, -130, 90);
    scene.add(groundBounce);

    // Internal Core Glow Point Light
    const coreGlow = new THREE.PointLight(0xdceaff, 3.8, 220);
    coreGlow.position.set(38, 12, -25);
    scene.add(coreGlow);

    // 4. MASTER ROOTS
    const environmentMaster = new THREE.Group();
    scene.add(environmentMaster);

    // A. CENTRAL METALLIC SCULPTURAL FORM (Fluid Chrome Torus Knot)
    const sculptureGroup = new THREE.Group();
    sculptureGroup.position.set(isMobile ? 0 : 38, 8, -35);
    environmentMaster.add(sculptureGroup);

    const knotGeo = new THREE.TorusKnotGeometry(48, 9.8, 220, 40, 2, 3);
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xc2d0e2,
      metalness: 0.98,
      roughness: 0.10,
      envMapIntensity: 1.5,
      transparent: true,
      opacity: 0.94,
      side: THREE.DoubleSide,
    });
    const knotMesh = new THREE.Mesh(knotGeo, chromeMat);
    sculptureGroup.add(knotMesh);

    // Architectural Wireframe Cage Accents
    const cageGeo = new THREE.TorusKnotGeometry(50, 10.4, 140, 24, 2, 3);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.22,
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    sculptureGroup.add(cageMesh);

    // B. PREMIUM 3D ORBITAL RINGS SYSTEM (Elegant multi-plane silver/chrome ellipses with orbital nodes)
    const orbitalSystemGroup = new THREE.Group();
    orbitalSystemGroup.position.set(isMobile ? 0 : 38, 8, -35);
    environmentMaster.add(orbitalSystemGroup);

    const orbitalRingMat = new THREE.MeshStandardMaterial({
      color: 0xdde9f8,
      metalness: 0.98,
      roughness: 0.10,
      envMapIntensity: 1.85,
      transparent: true,
      opacity: 0.72,
    });

    const orbitalNodeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x334866,
      emissiveIntensity: 0.75,
      metalness: 0.99,
      roughness: 0.06,
      envMapIntensity: 2.0,
    });

    interface OrbitalRingConfig {
      mesh: THREE.Mesh;
      group: THREE.Group;
      rotSpeedZ: number;
      baseTiltX: number;
      baseTiltY: number;
      radiusX: number;
      radiusY: number;
      nodes: { mesh: THREE.Mesh; speed: number; phase: number }[];
    }

    const orbitalRings: OrbitalRingConfig[] = [];

    const ringParams = [
      { r: 84, tube: 0.44, tiltX: 0.34, tiltY: 0.20, rotSpeedZ: 0.052, scaleY: 0.88, numNodes: 2 },
      { r: 114, tube: 0.38, tiltX: -0.46, tiltY: 0.52, rotSpeedZ: -0.038, scaleY: 0.85, numNodes: 2 },
      { r: 148, tube: 0.32, tiltX: 0.62, tiltY: -0.34, rotSpeedZ: 0.028, scaleY: 0.90, numNodes: 1 },
      { r: 182, tube: 0.28, tiltX: -0.26, tiltY: 0.78, rotSpeedZ: -0.019, scaleY: 0.82, numNodes: 2 },
    ];

    const nodeGeo = new THREE.OctahedronGeometry(1.6, 0);

    ringParams.forEach((param, ringIdx) => {
      const ringGroup = new THREE.Group();
      ringGroup.rotation.x = param.tiltX;
      ringGroup.rotation.y = param.tiltY;
      orbitalSystemGroup.add(ringGroup);

      const ringGeo = new THREE.TorusGeometry(param.r, param.tube, 16, 140);
      ringGeo.scale(1.0, param.scaleY, 1.0);
      const ringMesh = new THREE.Mesh(ringGeo, orbitalRingMat);
      ringGroup.add(ringMesh);

      const nodes: { mesh: THREE.Mesh; speed: number; phase: number }[] = [];
      for (let n = 0; n < param.numNodes; n++) {
        const nMesh = new THREE.Mesh(nodeGeo, orbitalNodeMat);
        ringGroup.add(nMesh);
        nodes.push({
          mesh: nMesh,
          speed: (param.rotSpeedZ > 0 ? 0.32 : -0.28) * (1 + n * 0.25),
          phase: (Math.PI * 2 * n) / param.numNodes + ringIdx * 0.7,
        });
      }

      orbitalRings.push({
        mesh: ringMesh,
        group: ringGroup,
        rotSpeedZ: param.rotSpeedZ,
        baseTiltX: param.tiltX,
        baseTiltY: param.tiltY,
        radiusX: param.r,
        radiusY: param.r * param.scaleY,
        nodes,
      });
    });

    // C. FLOATING METALLIC RIBBONS & SPLINE CURVES
    const ribbonCurvesGroup = new THREE.Group();
    environmentMaster.add(ribbonCurvesGroup);

    // Curve 1: Floating chrome spline ribbon weaving through deep space
    const curvePoints1 = [
      new THREE.Vector3(-90, -40, -60),
      new THREE.Vector3(-30, 30, -30),
      new THREE.Vector3(50, 60, -50),
      new THREE.Vector3(110, 10, -70),
      new THREE.Vector3(150, -40, -40),
    ];
    const curve1 = new THREE.CatmullRomCurve3(curvePoints1);
    const tubeGeo1 = new THREE.TubeGeometry(curve1, 90, 1.2, 12, false);
    const chromeTubeMat = new THREE.MeshStandardMaterial({
      color: 0xd8e4f5,
      metalness: 0.98,
      roughness: 0.08,
      envMapIntensity: 1.6,
      transparent: true,
      opacity: 0.85,
    });
    const ribbonTube1 = new THREE.Mesh(tubeGeo1, chromeTubeMat);
    ribbonCurvesGroup.add(ribbonTube1);

    // Curve 2: Elegant lower accent ribbon
    const curvePoints2 = [
      new THREE.Vector3(-120, -20, -40),
      new THREE.Vector3(-40, -70, -20),
      new THREE.Vector3(40, -50, -30),
      new THREE.Vector3(120, -60, -60),
    ];
    const curve2 = new THREE.CatmullRomCurve3(curvePoints2);
    const tubeGeo2 = new THREE.TubeGeometry(curve2, 70, 0.9, 12, false);
    const ribbonTube2 = new THREE.Mesh(tubeGeo2, chromeTubeMat);
    ribbonCurvesGroup.add(ribbonTube2);

    // D. SMALL CHROME SPHERES & SATELLITE NODES
    const sphereGroup = new THREE.Group();
    environmentMaster.add(sphereGroup);

    const sphereInstances: { mesh: THREE.Mesh; baseAngle: number; radius: number; speed: number; yOffset: number }[] = [];
    const smallSphereGeo = new THREE.SphereGeometry(3.6, 28, 24);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.98,
      roughness: 0.08,
      envMapIntensity: 1.8,
    });

    const sphereConfigs = [
      { r: 72, y: 35, speed: 0.35, angle: 0 },
      { r: 92, y: -25, speed: -0.28, angle: 2.1 },
      { r: 110, y: 15, speed: 0.22, angle: 4.2 },
      { r: 65, y: -45, speed: -0.4, angle: 1.2 },
      { r: 125, y: -10, speed: 0.18, angle: 3.5 },
      { r: 85, y: 55, speed: -0.3, angle: 5.4 },
    ];

    sphereConfigs.forEach((cfg) => {
      const mesh = new THREE.Mesh(smallSphereGeo, sphereMat);
      sphereGroup.add(mesh);
      sphereInstances.push({
        mesh,
        baseAngle: cfg.angle,
        radius: cfg.r,
        speed: cfg.speed,
        yOffset: cfg.y,
      });
    });

    // E. TRANSLUCENT GLASS PANELS WITH DEPTH
    const glassGroup = new THREE.Group();
    environmentMaster.add(glassGroup);

    const glassGeo = new THREE.BoxGeometry(38, 56, 1.2);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xdfe9f6,
      metalness: 0.1,
      roughness: 0.12,
      transmission: 0.75,
      transparent: true,
      opacity: 0.48,
      envMapIntensity: 1.4,
      reflectivity: 0.85,
    });

    const glassPanel1 = new THREE.Mesh(glassGeo, glassMat);
    glassPanel1.position.set(-60, 40, -50);
    glassPanel1.rotation.set(0.2, 0.35, -0.15);
    glassGroup.add(glassPanel1);

    const glassPanel2 = new THREE.Mesh(glassGeo, glassMat);
    glassPanel2.position.set(110, -35, -45);
    glassPanel2.rotation.set(-0.25, -0.4, 0.2);
    glassGroup.add(glassPanel2);

    // Thin chrome framing rim around glass
    const glassFrameGeo = new THREE.BoxGeometry(38.6, 56.6, 0.4);
    const glassFrameMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.25 });
    glassPanel1.add(new THREE.Mesh(glassFrameGeo, glassFrameMat));
    glassPanel2.add(new THREE.Mesh(glassFrameGeo, glassFrameMat));

    // F. FLOATING GEOMETRIC SHARDS & FRAGMENTS
    const shardGroup = new THREE.Group();
    environmentMaster.add(shardGroup);

    const shardInstances: { mesh: THREE.Mesh; rotSpeedX: number; rotSpeedY: number }[] = [];
    const shardGeo = new THREE.OctahedronGeometry(2.4, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.98,
      roughness: 0.08,
      envMapIntensity: 1.6,
      transparent: true,
      opacity: 0.85,
    });

    for (let i = 0; i < 14; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      shard.position.set(
        (Math.random() - 0.5) * 450 + 40,
        (Math.random() - 0.5) * 350,
        (Math.random() - 0.5) * 200 - 40
      );
      shardGroup.add(shard);
      shardInstances.push({
        mesh: shard,
        rotSpeedX: (Math.random() - 0.5) * 0.8,
        rotSpeedY: (Math.random() - 0.5) * 0.8,
      });
    }

    // G. DYNAMIC HIGH-LUMINOSITY SILK FABRIC SIMULATION
    const fabricGroup = new THREE.Group();
    fabricGroup.position.set(isMobile ? 0 : 30, -6, -15);
    environmentMaster.add(fabricGroup);

    // Primary Silk Ribbon
    const ribbon1Width = isMobile ? 200 : 280;
    const ribbon1Height = 68;
    const ribbon1SegW = 72;
    const ribbon1SegH = 32;
    const ribbon1Geo = new THREE.PlaneGeometry(ribbon1Width, ribbon1Height, ribbon1SegW, ribbon1SegH);
    const ribbon1Mat = new THREE.MeshStandardMaterial({
      color: 0x8a9db5,
      metalness: 0.86,
      roughness: 0.22,
      envMapIntensity: 1.3,
      transparent: true,
      opacity: 0.88,
      side: THREE.DoubleSide,
    });
    const ribbon1Mesh = new THREE.Mesh(ribbon1Geo, ribbon1Mat);
    ribbon1Mesh.rotation.x = -Math.PI * 0.18;
    ribbon1Mesh.rotation.z = Math.PI * 0.08;
    fabricGroup.add(ribbon1Mesh);

    const posAttr1 = ribbon1Geo.attributes.position;
    const originalPositions1 = Float32Array.from(posAttr1.array);

    // Secondary Fluid Silk Sash
    const ribbon2Geo = new THREE.PlaneGeometry(220, 46, 54, 22);
    const ribbon2Mat = new THREE.MeshStandardMaterial({
      color: 0xb5cbe4,
      metalness: 0.94,
      roughness: 0.16,
      envMapIntensity: 1.4,
      transparent: true,
      opacity: 0.74,
      side: THREE.DoubleSide,
    });
    const ribbon2Mesh = new THREE.Mesh(ribbon2Geo, ribbon2Mat);
    ribbon2Mesh.position.set(0, -20, -25);
    ribbon2Mesh.rotation.x = -Math.PI * 0.25;
    ribbon2Mesh.rotation.z = -Math.PI * 0.14;
    fabricGroup.add(ribbon2Mesh);

    const posAttr2 = ribbon2Geo.attributes.position;
    const originalPositions2 = Float32Array.from(posAttr2.array);

    // H. TECHNICAL TAILORING MEASUREMENT GEOMETRY (Chapter 01 & 02)
    const techGroup = new THREE.Group();
    techGroup.position.set(isMobile ? 0 : 38, 8, -55);
    environmentMaster.add(techGroup);

    const arcMat = new THREE.LineBasicMaterial({ color: 0x647a96, transparent: true, opacity: 0.45 });
    [70, 102, 134, 166].forEach((r) => {
      const curve = new THREE.EllipseCurve(0, 0, r, r * 0.84, 0, Math.PI * 2, false, 0);
      const points = curve.getPoints(90);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(arcGeo, arcMat);
      techGroup.add(line);
    });

    // Minimal Traveling Optical Scanning Beam across Fabric
    const scanLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-150, 0, 0),
      new THREE.Vector3(150, 0, 0),
    ]);
    const scanLineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });
    const scanLine = new THREE.Line(scanLineGeo, scanLineMat);
    fabricGroup.add(scanLine);

    // I. HIGH-INTERACTION METALLIC PARTICLES
    const particleCount = isMobile ? 380 : 850;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = new Float32Array(particleCount * 3);
    const particleHome = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const px = (Math.random() - 0.5) * 850;
      const py = (Math.random() - 0.5) * 950;
      const pz = (Math.random() - 0.5) * 650 - 40;

      particlePositions[i] = px;
      particlePositions[i + 1] = py;
      particlePositions[i + 2] = pz;

      particleHome[i] = px;
      particleHome[i + 1] = py;
      particleHome[i + 2] = pz;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      color: 0xe0efff,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    const particleField = new THREE.Points(particleGeo, particleMat);
    environmentMaster.add(particleField);

    // 5. INTERACTION & RAYCASTING SYSTEM
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

    let mouseWorldX = 0;
    let mouseWorldY = 0;

    const raycaster = new THREE.Raycaster();
    const mouseVector = new THREE.Vector2();

    const handlePointerMove = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      mouseVector.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseVector.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // Unproject to world coordinates at distance z = 310
      const vector = new THREE.Vector3(mouseVector.x, mouseVector.y, 0.5);
      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      mouseWorldX = pos.x;
      mouseWorldY = pos.y;

      if (isDragging) {
        const deltaX = e.clientX - previousPointerX;
        const deltaY = e.clientY - previousPointerY;
        targetRotationY += deltaX * 0.007;
        targetRotationX += deltaY * 0.005;
        previousPointerX = e.clientX;
        previousPointerY = e.clientY;
        return;
      }

      // Raycast against the sculpture and glass
      raycaster.setFromCamera(mouseVector, camera);
      const hits = raycaster.intersectObjects([knotMesh, ribbon1Mesh, glassPanel1, glassPanel2]);
      if (hits.length > 0) {
        document.body.style.cursor = "grab";
        chromeMat.roughness = 0.06;
        chromeMat.emissive.setHex(0x223850);
        chromeMat.emissiveIntensity = 0.5;
      } else {
        document.body.style.cursor = "default";
        chromeMat.roughness = 0.10;
        chromeMat.emissive.setHex(0x000000);
        chromeMat.emissiveIntensity = 0.0;
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
      document.body.style.cursor = "grabbing";
      previousPointerX = e.clientX;
      previousPointerY = e.clientY;
    };

    const handlePointerUp = () => {
      isDragging = false;
      document.body.style.cursor = "default";
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
      orbitalSystemGroup.position.x = isMobile ? 0 : 38;
      fabricGroup.position.x = isMobile ? 0 : 30;
      techGroup.position.x = isMobile ? 0 : 38;
    };
    window.addEventListener("resize", handleResize);

    // 6. CONTINUOUS CINEMATIC ANIMATION LOOP
    let animationFrameId: number;
    const startTime = performance.now();
    let scanLineY = 0;

    // Smoothed transition variables with physical damping
    let currentCameraZ = 310;
    let currentSculptureScale = 1.0;
    let currentFabricScale = 1.0;
    let currentOrbitalScale = 1.0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (document.hidden) return;

      const elapsed = (performance.now() - startTime) / 1000;

      // 1. Entrance Light Ramp
      const entranceProgress = Math.min(elapsed / 2.0, 1);
      const entranceEase = 1 - Math.pow(1 - entranceProgress, 3);
      keyLight.intensity = 5.4 * entranceEase;
      chromeMat.opacity = 0.94 * entranceEase;
      ribbon1Mat.opacity = 0.88 * entranceEase;
      ribbon2Mat.opacity = 0.74 * entranceEase;

      // 2. Sculpture Rotation Damping with subtle mouse orientation tracking
      userRotationY += (targetRotationY - userRotationY) * 0.09;
      userRotationX += (targetRotationX - userRotationX) * 0.09;

      if (!prefersReducedMotion) {
        const baseKnotRotY = elapsed * 0.16;
        const baseKnotRotX = Math.sin(elapsed * 0.28) * 0.14;

        const mouseTiltY = mouseX * 0.35;
        const mouseTiltX = -mouseY * 0.25;

        sculptureGroup.rotation.y = baseKnotRotY + userRotationY + mouseTiltY;
        sculptureGroup.rotation.x = baseKnotRotX + userRotationX + mouseTiltX;

        // Animate Premium Orbital Rings System
        orbitalRings.forEach((orb) => {
          orb.group.rotation.z += orb.rotSpeedZ * 0.018;

          // Animate nodes gliding along this orbital ring's perimeter
          orb.nodes.forEach((node) => {
            const angle = node.phase + elapsed * node.speed;
            node.mesh.position.set(
              Math.cos(angle) * orb.radiusX,
              Math.sin(angle) * orb.radiusY,
              Math.sin(angle * 2.0) * 4.0
            );
          });
        });

        // Animate floating chrome spline ribbons
        ribbonCurvesGroup.rotation.y = elapsed * 0.05;
        ribbonTube1.rotation.z = Math.sin(elapsed * 0.2) * 0.1;
        ribbonTube2.rotation.z = -Math.cos(elapsed * 0.25) * 0.12;

        // Animate orbiting chrome spheres at individual speeds
        sphereInstances.forEach((inst) => {
          const a = inst.baseAngle + elapsed * inst.speed;
          inst.mesh.position.set(
            sculptureGroup.position.x + Math.cos(a) * inst.radius,
            inst.yOffset + Math.sin(elapsed * 0.5 + a) * 8.0,
            sculptureGroup.position.z + Math.sin(a) * (inst.radius * 0.7)
          );
        });

        // Animate floating glass panels
        glassPanel1.rotation.y = 0.35 + Math.sin(elapsed * 0.3) * 0.12;
        glassPanel1.rotation.x = 0.2 + Math.cos(elapsed * 0.25) * 0.08;

        glassPanel2.rotation.y = -0.4 + Math.cos(elapsed * 0.35) * 0.14;
        glassPanel2.rotation.x = -0.25 + Math.sin(elapsed * 0.2) * 0.09;

        // Animate floating geometric shards
        shardInstances.forEach((s) => {
          s.mesh.rotation.x += s.rotSpeedX * 0.02;
          s.mesh.rotation.y += s.rotSpeedY * 0.02;
        });

        // 3. Dynamic Silk Fabric Undulation with Cursor Proximity Ripples
        const pos1 = ribbon1Geo.attributes.position;
        const orig1 = originalPositions1;
        const count1 = pos1.count;

        const localMouseX = mouseWorldX - fabricGroup.position.x;
        const localMouseY = mouseWorldY - fabricGroup.position.y;

        for (let i = 0; i < count1; i++) {
          const ox = orig1[i * 3];
          const oy = orig1[i * 3 + 1];

          const distToMouse = Math.hypot(ox - localMouseX, oy - localMouseY);
          const mouseRipple = Math.sin(distToMouse * 0.06 - elapsed * 4.5) * Math.exp(-distToMouse * 0.016) * 14.0;

          const waveZ =
            Math.sin(ox * 0.032 + elapsed * 1.6) * 12.0 +
            Math.cos(oy * 0.042 + elapsed * 1.8) * 7.0 +
            mouseRipple;

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
          const distToMouse = Math.hypot(ox - localMouseX, oy - localMouseY);
          const mouseRipple = Math.sin(distToMouse * 0.08 - elapsed * 5.0) * Math.exp(-distToMouse * 0.02) * 9.0;

          const waveZ =
            Math.sin(ox * 0.038 - elapsed * 1.7) * 9.0 +
            Math.cos(oy * 0.048 + elapsed * 1.4) * 5.5 +
            mouseRipple;

          pos2.setZ(i, waveZ);
        }
        pos2.needsUpdate = true;
        ribbon2Geo.computeVertexNormals();

        // 4. Scanning beam oscillation across fabric
        scanLineY += 0.42;
        if (scanLineY > 34) scanLineY = -34;
        scanLine.position.y = scanLineY;

        // 5. Interactive Metallic Particle Swarm
        const pPos = particleGeo.attributes.position;
        const pArray = pPos.array as Float32Array;

        for (let i = 0; i < particleCount * 3; i += 3) {
          const px = pArray[i];
          const py = pArray[i + 1];
          const hx = particleHome[i];
          const hy = particleHome[i + 1];

          const dx = px - mouseWorldX;
          const dy = py - mouseWorldY;
          const d = Math.hypot(dx, dy);

          if (d < 140 && d > 1) {
            const force = (1 - d / 140) * 3.5;
            particleVelocities[i] += (dx / d) * force;
            particleVelocities[i + 1] += (dy / d) * force;
          }

          particleVelocities[i] += (hx - px) * 0.015;
          particleVelocities[i + 1] += (hy - py) * 0.015;

          particleVelocities[i] *= 0.92;
          particleVelocities[i + 1] *= 0.92;

          pArray[i] += particleVelocities[i];
          pArray[i + 1] += particleVelocities[i + 1];
        }
        pPos.needsUpdate = true;
      }

      // 6. Dynamic Mouse Spotlight Tracking
      mouseLight.position.x += (mouseWorldX - mouseLight.position.x) * 0.08;
      mouseLight.position.y += (mouseWorldY - mouseLight.position.y) * 0.08;

      // Studio key light tilt
      keyLight.position.x = 130 + mouseX * 48;
      keyLight.position.y = 180 - mouseY * 36;

      // Subtle parallax camera damping
      targetCameraX = mouseX * 16;
      targetCameraY = -mouseY * 12;
      camera.position.x += (targetCameraX - camera.position.x) * 0.04;
      camera.position.y += (targetCameraY - camera.position.y) * 0.04;

      // 7. Continuous Scroll Interpolation Across All Chapters & FAQ
      const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      const scrollProgress = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);

      // Layered Parallax: Foreground elements move faster than background sculpture
      glassGroup.position.y = scrollProgress * -90;
      ribbonCurvesGroup.position.y = scrollProgress * -45;

      // Evaluate C¹ continuous piecewise-smoothstep keyframe target
      const targetKf = getInterpolatedKeyframe(scrollProgress);

      // Physical frame damping for 100% fluid, pop-free transitions
      currentCameraZ += (targetKf.cameraZ - currentCameraZ) * 0.06;
      camera.position.z = currentCameraZ;

      currentSculptureScale += (targetKf.sculptureScale - currentSculptureScale) * 0.06;
      sculptureGroup.scale.setScalar(currentSculptureScale);

      currentFabricScale += (targetKf.fabricScale - currentFabricScale) * 0.06;
      fabricGroup.scale.setScalar(currentFabricScale);

      currentOrbitalScale += (targetKf.orbitalScale - currentOrbitalScale) * 0.06;
      orbitalSystemGroup.scale.setScalar(currentOrbitalScale);

      // Scroll-driven orbital system progressive tilt (smoothly evolving between chapters)
      orbitalSystemGroup.rotation.x = scrollProgress * 0.45 + (-mouseY * 0.15);
      orbitalSystemGroup.rotation.y = scrollProgress * 0.65 + (mouseX * 0.20);

      arcMat.opacity += (targetKf.arcOpacity - arcMat.opacity) * 0.06;
      scanLineMat.opacity += (targetKf.scanOpacity - scanLineMat.opacity) * 0.06;

      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      document.body.style.cursor = "default";
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("resize", handleResize);

      knotGeo.dispose();
      chromeMat.dispose();
      cageGeo.dispose();
      cageMat.dispose();
      orbitalRingMat.dispose();
      orbitalNodeMat.dispose();
      nodeGeo.dispose();
      tubeGeo1.dispose();
      tubeGeo2.dispose();
      chromeTubeMat.dispose();
      smallSphereGeo.dispose();
      sphereMat.dispose();
      glassGeo.dispose();
      glassMat.dispose();
      glassFrameGeo.dispose();
      glassFrameMat.dispose();
      shardGeo.dispose();
      shardMat.dispose();
      ribbon1Geo.dispose();
      ribbon1Mat.dispose();
      ribbon2Geo.dispose();
      ribbon2Mat.dispose();
      arcMat.dispose();
      scanLineGeo.dispose();
      scanLineMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      envTexture.dispose();

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
