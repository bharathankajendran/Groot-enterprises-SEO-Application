import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, useScroll, ScrollControls, Scroll, MeshDistortMaterial, Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { Overlay } from './Overlay';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      sphereGeometry: any;
      meshBasicMaterial: any;
      meshStandardMaterial: any;
      pointLight: any;
      ambientLight: any;
      ringGeometry: any;
      color: any;
      [elemName: string]: any;
    }
  }
}

// -----------------------------------------------------------------------------
// 1. Star Field & Environment
// -----------------------------------------------------------------------------

const StarField = () => {
  const ref = useRef<THREE.Points>(null!);
  
  const sphere = useMemo(() => {
    const positions = new Float32Array(10000 * 3); // Dense starfield
    for (let i = 0; i < 10000; i++) {
      const r = 400 * Math.cbrt(Math.random()); // Large radius to cover full screen
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 50;
      ref.current.rotation.y -= delta / 60;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#fff"
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
};

// -----------------------------------------------------------------------------
// 2. Realistic Solar System Elements
// -----------------------------------------------------------------------------

const Sun = () => {
  return (
    <group>
      {/* The Core Star */}
      <mesh>
        <sphereGeometry args={[4, 64, 64]} />
        <MeshDistortMaterial 
          color="#ffaa00" 
          emissive="#ff5500"
          emissiveIntensity={2}
          roughness={0}
          distort={0.3} 
          speed={2}
        />
        <pointLight intensity={2.5} distance={300} decay={1} color="#ffaa00" />
      </mesh>
      {/* Outer Glow */}
      <mesh scale={[1.4, 1.4, 1.4]}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshBasicMaterial color="#ff4400" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>
    </group>
  );
};

interface PlanetProps {
  planet: {
    name: string;
    distance: number;
    size: number;
    color: string;
    speed: number;
    rotationSpeed: number;
    type: 'rocky' | 'gas' | 'earth';
    hasRing?: boolean;
    ringColor?: string;
  }
}

const Planet: React.FC<PlanetProps> = ({ planet }) => {
  const orbitGroupRef = useRef<THREE.Group>(null!);
  const planetMeshRef = useRef<THREE.Mesh>(null!);
  const cloudsRef = useRef<THREE.Mesh>(null!);
  const [startAngle] = useState(Math.random() * Math.PI * 2);

  useFrame((state) => {
    // 1. Orbital movement (Revolving around Sun)
    // We update the position of the group that holds the planet
    const t = state.clock.getElapsedTime() * planet.speed * 0.1 + startAngle;
    const x = Math.cos(t) * planet.distance;
    const z = Math.sin(t) * planet.distance;
    
    if (orbitGroupRef.current) {
      orbitGroupRef.current.position.set(x, 0, z);
    }
    
    // 2. Self-rotation (Day/Night cycle)
    if (planetMeshRef.current) {
      planetMeshRef.current.rotation.y += planet.rotationSpeed;
    }

    // 3. Cloud rotation (Earth only) - slightly faster than planet
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += planet.rotationSpeed * 1.2;
    }
  });

  return (
    <group>
      {/* Visual Orbit Path Line */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[planet.distance - 0.1, planet.distance + 0.1, 128]} />
        <meshBasicMaterial color="#ffffff" opacity={0.05} transparent side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>

      {/* The Planet Container (moves along orbit) */}
      <group ref={orbitGroupRef}>
        <mesh ref={planetMeshRef} castShadow receiveShadow>
          <sphereGeometry args={[planet.size, 64, 64]} />
          <meshStandardMaterial 
            color={planet.color} 
            roughness={planet.type === 'gas' ? 0.4 : 0.8}
            metalness={0.1}
          />
        </mesh>

        {/* Earth Specific: Clouds Layer */}
        {planet.name === "Earth" && (
           <mesh ref={cloudsRef} scale={[1.02, 1.02, 1.02]}>
             <sphereGeometry args={[planet.size, 64, 64]} />
             <meshStandardMaterial 
              color="#ffffff" 
              transparent 
              opacity={0.4} 
              depthWrite={false}
              side={THREE.DoubleSide}
             />
           </mesh>
        )}

        {/* Rings (Saturn) */}
        {planet.hasRing && (
          <mesh rotation={[-Math.PI / 2 + 0.5, 0, 0]} receiveShadow>
            <ringGeometry args={[planet.size * 1.4, planet.size * 2.8, 128]} />
            <meshStandardMaterial 
              color={planet.ringColor} 
              opacity={0.6} 
              transparent 
              side={THREE.DoubleSide}
              roughness={0.6}
            />
          </mesh>
        )}
      </group>
    </group>
  );
};

const SolarSystem = () => {
  const planets = [
    { name: "Mercury", distance: 8, size: 0.3, color: "#8c8c8c", speed: 1.5, rotationSpeed: 0.005, type: 'rocky' },
    { name: "Venus", distance: 12, size: 0.6, color: "#e6b88a", speed: 1.2, rotationSpeed: 0.002, type: 'rocky' },
    { name: "Earth", distance: 16, size: 0.65, color: "#2f6a69", speed: 1.0, rotationSpeed: 0.015, type: 'earth' },
    { name: "Mars", distance: 20, size: 0.4, color: "#c1440e", speed: 0.8, rotationSpeed: 0.015, type: 'rocky' },
    { name: "Jupiter", distance: 28, size: 2.2, color: "#d8ca9d", speed: 0.4, rotationSpeed: 0.04, type: 'gas' },
    { name: "Saturn", distance: 38, size: 1.8, color: "#ead6b8", speed: 0.3, rotationSpeed: 0.038, type: 'gas', hasRing: true, ringColor: "#cba87c" },
    { name: "Uranus", distance: 46, size: 1.0, color: "#d1f3f6", speed: 0.2, rotationSpeed: 0.03, type: 'gas' },
    { name: "Neptune", distance: 54, size: 1.0, color: "#4b70dd", speed: 0.15, rotationSpeed: 0.03, type: 'gas' },
  ];

  return (
    <group>
      <Sun />
      <ambientLight intensity={0.1} /> 
      {planets.map((p: any, i) => (
        <Planet key={i} planet={p} />
      ))}
    </group>
  );
};

// -----------------------------------------------------------------------------
// 3. Camera Tour Logic (Rotation Only)
// -----------------------------------------------------------------------------

const CameraRig = () => {
  const scroll = useScroll();
  
  useFrame((state) => {
    const offset = scroll.offset; // 0 (top) to 1 (bottom)

    // Fixed parameters - No Zoom, just rotation
    const radius = 65; // Fixed distance to view the whole system
    const height = 30; // Fixed height for a good angle
    
    // We rotate around the scene based on scroll percentage
    // 0 = 0 deg, 1 = 180 deg (or more/less as desired)
    const rotationSpeed = Math.PI; // Full half-circle rotation
    const theta = offset * rotationSpeed;
    
    // Convert Polar (r, theta) to Cartesian (x, z)
    // We add an initial offset to start from a good viewing angle
    const initialAngle = Math.PI / 4;
    const currentAngle = initialAngle + theta;

    const x = radius * Math.sin(currentAngle);
    const z = radius * Math.cos(currentAngle);

    // Smoothly move camera
    state.camera.position.lerp(new THREE.Vector3(x, height, z), 0.05);
    
    // Always look at the Sun (Center)
    state.camera.lookAt(0, 0, 0);
  });

  return null;
}

// -----------------------------------------------------------------------------
// 4. Scroll Event Handler (Bridge)
// -----------------------------------------------------------------------------
const ScrollHandler = () => {
  const scroll = useScroll();

  useEffect(() => {
    const handleScrollEvent = (e: CustomEvent) => {
      if (scroll && scroll.el) {
        // Scroll to the specific page index
        // page index * clientHeight = position in pixels
        const index = e.detail;
        const targetTop = index * scroll.el.clientHeight;
        scroll.el.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    };

    window.addEventListener('navigate-to-section', handleScrollEvent as EventListener);
    return () => window.removeEventListener('navigate-to-section', handleScrollEvent as EventListener);
  }, [scroll]);

  return null;
}

// -----------------------------------------------------------------------------
// 5. Main Scene Composition
// -----------------------------------------------------------------------------

export const Scene: React.FC = () => {
  return (
    <div className="h-screen w-full bg-black">
      <Canvas 
        shadows 
        camera={{ position: [0, 30, 65], fov: 45 }}
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping, 
          outputColorSpace: THREE.SRGBColorSpace,
          powerPreference: "high-performance"
        }}
      >
        <color attach="background" args={['#000000']} />
        
        <ScrollControls pages={4} damping={0.2}>
          <CameraRig />
          <ScrollHandler />

          <StarField />
          <Sparkles count={800} scale={100} size={2} speed={0.2} opacity={0.4} color="#a0c0ff" />
          
          <SolarSystem />
          
          {/* HTML Overlay Content (Moves with Scroll) */}
          <Scroll html style={{ width: '100%' }}>
            <Overlay />
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
};