import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../constants';

export const Sun: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z += 0.001;
    }
  });

  return (
    <group>
      {/* Core Sun */}
      <Sphere args={[2.5, 64, 64]} ref={meshRef}>
        <MeshDistortMaterial
          color={COLORS.RED_GLOW}
          emissive={new THREE.Color('#500000')}
          emissiveIntensity={2}
          roughness={0.1}
          metalness={0.8}
          distort={0.4}
          speed={2}
        />
      </Sphere>
      
      {/* Inner Glow Aura */}
      <mesh>
        <sphereGeometry args={[2.8, 32, 32]} />
        <meshBasicMaterial 
          color={COLORS.RED_GLOW} 
          transparent 
          opacity={0.15} 
          side={THREE.BackSide}
        />
      </mesh>

      {/* Accretion Disk / Ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4.5, 0.05, 16, 100]} />
        <meshStandardMaterial 
          color={COLORS.GOLD} 
          emissive={COLORS.GOLD}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Particles around Sun */}
      <points>
        <sphereGeometry args={[6, 64, 64]} />
        <pointsMaterial 
          size={0.05} 
          color={COLORS.RED_GLOW} 
          transparent 
          opacity={0.4} 
        />
      </points>
    </group>
  );
};