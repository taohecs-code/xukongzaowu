import React, { useState, useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, Sparkles, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { MOCK_DATA, COLORS } from './constants';
import { Sun } from './components/Sun';
import { Galaxy } from './components/Galaxy';
import { Overlay } from './components/Overlay';
import { ThoughtNode, LayoutMode } from './types';

const MIN_YEAR = 1996;
const MAX_YEAR = 2024;

const App: React.FC = () => {
  const [currentYear, setCurrentYear] = useState<number>(MAX_YEAR);
  const [selectedNode, setSelectedNode] = useState<ThoughtNode | null>(null);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('SPIRAL');

  // Filter nodes based on the selected year (timeline)
  // Only show thoughts that existed on or before the selected year
  const visibleNodes = useMemo(() => {
    return MOCK_DATA.filter(node => {
      const nodeYear = parseInt(node.date.split('-')[0]);
      return nodeYear <= currentYear;
    });
  }, [currentYear]);

  return (
    <div className="w-full h-screen bg-[#050505] relative selection:bg-[#D4AF37] selection:text-black">
      
      {/* 2D UI Overlay */}
      <Overlay 
        currentYear={currentYear} 
        onYearChange={setCurrentYear} 
        selectedNode={selectedNode}
        onCloseNode={() => setSelectedNode(null)}
        minYear={MIN_YEAR}
        maxYear={MAX_YEAR}
        layoutMode={layoutMode}
        onLayoutChange={setLayoutMode}
      />

      {/* 3D Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas 
          camera={{ position: [0, 20, 35], fov: 45 }}
          gl={{ antialias: false, toneMappingExposure: 1.5 }}
          dpr={[1, 2]} // Optimize pixel ratio
        >
          <color attach="background" args={[COLORS.VOID]} />
          
          <Suspense fallback={null}>
            <Environment preset="city" intensity={0.5} />
            
            <OrbitControls 
                enablePan={true} 
                enableZoom={true} 
                enableRotate={true}
                autoRotate={!selectedNode} // Stop rotation when reading
                autoRotateSpeed={0.5}
                minDistance={10}
                maxDistance={100}
                maxPolarAngle={Math.PI / 1.5} // Prevent going too far below
            />

            {/* Background Atmosphere */}
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Sparkles count={200} scale={40} size={4} speed={0.4} opacity={0.2} color={COLORS.GOLD} />

            {/* Main Content */}
            <group position={[0, 0, 0]}>
                <Sun />
                <Galaxy 
                    nodes={visibleNodes} 
                    onNodeClick={setSelectedNode} 
                    selectedNodeId={selectedNode?.id || null}
                    layoutMode={layoutMode}
                />
            </group>

            {/* Post Processing for the "Glow" look */}
            <EffectComposer disableNormalPass>
                <Bloom 
                    luminanceThreshold={1} 
                    mipmapBlur 
                    intensity={1.5} 
                    radius={0.4}
                />
                <Noise opacity={0.05} />
                <Vignette eskil={false} offset={0.1} darkness={1.1} />
            </EffectComposer>

          </Suspense>
        </Canvas>
      </div>
    </div>
  );
};

export default App;