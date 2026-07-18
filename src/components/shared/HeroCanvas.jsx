import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { BorderBeam } from "@stianlarsen/border-beam";
import { mockData } from "../../data/mockData";

// --- Particles scattered in a sphere shell ---
function StarField({ count = 500 }) {
  const ref = useRef();

  const positions = useMemo(() => {
    const pts = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.2 + Math.random() * 1.8;
      pts[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pts[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pts[i * 3 + 2] = r * Math.cos(phi);
    }
    return pts;
  }, [count]);

  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.04;
    ref.current.rotation.x = clock.elapsedTime * 0.015;
  });

  return (
    <Points ref={ref} positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#9d6cff"
        size={0.022}
        sizeAttenuation
        depthWrite={false}
        opacity={0.55}
      />
    </Points>
  );
}

// --- Glowing purple sphere ---
function GlowSphere() {
  const meshRef = useRef();

  useFrame(({ clock, pointer }) => {
    const t = clock.elapsedTime;
    // Gentle idle rotation
    meshRef.current.rotation.y = t * 0.18;
    meshRef.current.rotation.z = Math.sin(t * 0.3) * 0.12;
    // Subtle mouse-driven tilt (lerped)
    meshRef.current.rotation.x +=
      (-pointer.y * 0.25 - meshRef.current.rotation.x) * 0.06;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 48, 48]} />
      <meshStandardMaterial
        color="#7c3aed"
        emissive="#5b21b6"
        emissiveIntensity={0.7}
        roughness={0.15}
        metalness={0.85}
      />
    </mesh>
  );
}

// --- Lighting + scene wrapper with mouse parallax ---
function Scene() {
  const groupRef = useRef();

  useFrame(({ pointer }) => {
    // Lerp group toward mouse position — gives parallax depth
    groupRef.current.rotation.y +=
      (pointer.x * 0.18 - groupRef.current.rotation.y) * 0.04;
    groupRef.current.rotation.x +=
      (-pointer.y * 0.1 - groupRef.current.rotation.x) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.25} />
      <pointLight position={[3, 4, 3]}  intensity={3.5} color="#9d6cff" />
      <pointLight position={[-4, -2, -2]} intensity={1.2} color="#6366f1" />
      <pointLight position={[0, -3, 2]}  intensity={0.6} color="#c084fc" />
      <GlowSphere />
      <StarField count={480} />
    </group>
  );
}

// --- Outer component: canvas + gradient overlays + text ---
export default function HeroCanvas() {
  const { user } = mockData;

  return (
    <div className="relative h-52 w-full overflow-hidden rounded-2xl border border-ink-650/80 bg-ink-900/60 sm:h-56">
      <BorderBeam
        colorFrom="#c084fc"
        colorTo="#4f46e5"
        duration={8}
        borderWidth={2}
        size={280}
      />
      {/* Three.js canvas — lazy loaded, limited DPR, no antialias */}
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        style={{ position: "absolute", inset: 0 }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Side vignettes — blend canvas edges into page bg */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, #0d0d0f 0%, transparent 30%, transparent 70%, #0d0d0f 100%)",
        }}
      />
      {/* Bottom fade into content */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 40%, rgba(13,13,15,0.75) 100%)",
        }}
      />

      {/* Text overlay */}
      <div className="pointer-events-none bg-white absolute inset-0 flex flex-col justify-end px-6 pb-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400">
          Developer Portfolio
        </p>
        <h2 className="font-display mt-1 text-2xl font-bold text-white sm:text-3xl">
          {user.name}
        </h2>
        <p className="mt-0.5 text-sm text-zinc-400">{user.tagline}</p>
      </div>
    </div>
  );
}
