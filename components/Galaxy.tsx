import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, Billboard } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore
import { forceSimulation, forceManyBody, forceCenter, forceCollide, forceLink, forceX, forceY, forceZ } from 'd3-force-3d';
import { ThoughtNode, LayoutMode } from '../types';
import { COLORS } from '../constants';

interface GalaxyProps {
  nodes: ThoughtNode[];
  onNodeClick: (node: ThoughtNode) => void;
  selectedNodeId: string | null;
  layoutMode: LayoutMode;
}

interface LinkData {
  source: string;
  target: string;
  strength: number;
}

// Sub-component for rendering dynamic lines between moving nodes
const ConnectionLines: React.FC<{ 
    links: LinkData[]; 
    nodeRefs: React.MutableRefObject<{ [key: string]: THREE.Group }>;
    visible: boolean;
}> = ({ links, nodeRefs, visible }) => {
    const geometryRef = useRef<THREE.BufferGeometry>(null);
    const linkCount = links.length;
    
    // Create buffers
    // Re-create buffers when link count changes (e.g. timeline filter)
    const positions = useMemo(() => new Float32Array(linkCount * 2 * 3), [linkCount]);
    const colors = useMemo(() => new Float32Array(linkCount * 2 * 3), [linkCount]);

    useFrame((state) => {
        if (!geometryRef.current || !visible) return;
        
        const posAttr = geometryRef.current.attributes.position;
        const colAttr = geometryRef.current.attributes.color;
        
        const posArray = posAttr.array as Float32Array;
        const colArray = colAttr.array as Float32Array;
        
        let idx = 0;
        let colIdx = 0;
        let updateCount = 0;
        
        const time = state.clock.getElapsedTime();
        const baseColor = new THREE.Color(COLORS.GOLD);

        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const sourceGroup = nodeRefs.current[link.source];
            const targetGroup = nodeRefs.current[link.target];
            
            if (sourceGroup && targetGroup) {
                // Update Line Positions
                posArray[idx++] = sourceGroup.position.x;
                posArray[idx++] = sourceGroup.position.y;
                posArray[idx++] = sourceGroup.position.z;
                
                posArray[idx++] = targetGroup.position.x;
                posArray[idx++] = targetGroup.position.y;
                posArray[idx++] = targetGroup.position.z;
                
                // Animation: Subtle pulse indicating data flow
                // Use index to offset phase, creating a "rippling" effect across the network
                const pulseFrequency = 2.0;
                const pulseOffset = i * 0.2;
                const pulse = 0.5 + 0.5 * Math.sin(time * pulseFrequency + pulseOffset); 
                
                // Calculate opacity based on link strength and pulse
                // Base opacity is derived from link strength (stronger links = more visible)
                // Pulse modulates this between 30% and 100% of the base strength
                const effectiveOpacity = link.strength * (0.3 + 0.7 * pulse);
                
                // Apply to Vertex Colors (using Additive Blending, darker color = more transparent)
                colArray[colIdx++] = baseColor.r * effectiveOpacity;
                colArray[colIdx++] = baseColor.g * effectiveOpacity;
                colArray[colIdx++] = baseColor.b * effectiveOpacity;

                colArray[colIdx++] = baseColor.r * effectiveOpacity;
                colArray[colIdx++] = baseColor.g * effectiveOpacity;
                colArray[colIdx++] = baseColor.b * effectiveOpacity;

                updateCount++;
            } else {
                 idx += 6; 
                 colIdx += 6;
            }
        }
        
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
        geometryRef.current.setDrawRange(0, updateCount * 2);
    });

    if (!visible) return null;

    return (
        <lineSegments key={linkCount}>
            <bufferGeometry ref={geometryRef}>
                <bufferAttribute 
                    attach="attributes-position"
                    count={linkCount * 2}
                    array={positions}
                    itemSize={3}
                    usage={THREE.DynamicDrawUsage}
                />
                <bufferAttribute 
                    attach="attributes-color"
                    count={linkCount * 2}
                    array={colors}
                    itemSize={3}
                    usage={THREE.DynamicDrawUsage}
                />
            </bufferGeometry>
            <lineBasicMaterial 
                vertexColors={true}
                transparent={true}
                opacity={1} // Base opacity 1, modulated by vertex colors
                depthWrite={false} 
                blending={THREE.AdditiveBlending} 
            />
        </lineSegments>
    );
};

export const Galaxy: React.FC<GalaxyProps> = ({ nodes, onNodeClick, selectedNodeId, layoutMode }) => {
  const groupRef = useRef<THREE.Group>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  
  // Create refs for meshes to animate them imperatively
  const meshRefs = useRef<{ [key: string]: THREE.Group }>({});

  // 1. Generate Links (Relationships)
  const links = useMemo(() => {
      const _links: LinkData[] = [];
      const byCategory: Record<string, ThoughtNode[]> = {};
      
      nodes.forEach(node => {
          if (!byCategory[node.category]) byCategory[node.category] = [];
          byCategory[node.category].push(node);
      });

      Object.values(byCategory).forEach((catNodes) => {
           for(let i = 0; i < catNodes.length - 1; i++) {
               // Primary connection: Strong
               _links.push({ 
                   source: catNodes[i].id, 
                   target: catNodes[i+1].id,
                   strength: 0.8
               });
               
               // Occasional skip-connection: Weaker, adds complexity
               if (i + 2 < catNodes.length && Math.random() > 0.6) {
                   _links.push({ 
                       source: catNodes[i].id, 
                       target: catNodes[i+2].id,
                       strength: 0.3
                   });
               }
           }
      });

      return _links;
  }, [nodes]);

  // 2. Compute target positions based on Layout Mode
  const targetPositions = useMemo(() => {
    const positionMap = new Map<string, THREE.Vector3>();

    if (layoutMode === 'SPIRAL') {
        nodes.forEach((node, i) => {
            const angle = i * 0.3; 
            const radius = 6 + (i * 0.15); 
            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = Math.sin(i * 0.5) * (radius * 0.1); 
            positionMap.set(node.id, new THREE.Vector3(x, y, z));
        });
    } 
    else if (layoutMode === 'SPHERE') {
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
        nodes.forEach((node, i) => {
            const y = 1 - (i / (nodes.length - 1)) * 2; // y goes from 1 to -1
            const radius = Math.sqrt(1 - y * y);
            const theta = phi * i;
            
            const r = 12; // Sphere radius
            const x = Math.cos(theta) * radius * r;
            const z = Math.sin(theta) * radius * r;
            const finalY = y * r;
            
            positionMap.set(node.id, new THREE.Vector3(x, finalY, z));
        });
    } 
    else if (layoutMode === 'FORCE' || layoutMode === 'GROUPED') {
        // Prepare nodes for D3
        const d3Nodes = nodes.map(n => ({ 
            id: n.id, 
            r: (n.importance / 10) * 0.3 + 1,
            category: n.category 
        })); 
        // Prepare links for D3
        const d3Links = links.map(l => ({ source: l.source, target: l.target }));

        const simulation = forceSimulation(d3Nodes, 3) 
            .force('charge', forceManyBody().strength(-15)) 
            .force('collision', forceCollide().radius((d: any) => d.r * 1.5));

        if (layoutMode === 'GROUPED') {
             // Define distinct centers for each category in 3D space
             const centers: Record<string, [number, number, number]> = {
                 'TECH': [15, 5, 0],
                 'PHILOSOPHY': [-15, 5, 0],
                 'LIFE': [0, -10, 10],
                 'ART': [0, -10, -10]
             };

             simulation
                .force('x', forceX((d: any) => centers[d.category] ? centers[d.category][0] : 0).strength(0.5))
                .force('y', forceY((d: any) => centers[d.category] ? centers[d.category][1] : 0).strength(0.5))
                .force('z', forceZ((d: any) => centers[d.category] ? centers[d.category][2] : 0).strength(0.5))
                // Weaker link force in grouped mode to allow clustering to dominate
                .force('link', forceLink(d3Links).id((d: any) => d.id).distance(5).strength(0.1));

        } else {
             // Standard FORCE mode (Centralized)
             simulation
                .force('center', forceCenter(0, 0, 0))
                .force('link', forceLink(d3Links).id((d: any) => d.id).distance(2).strength(1));
        }
            
        simulation.stop();

        // Run simulation synchronously
        for (let i = 0; i < 200; i++) {
            simulation.tick();
        }

        d3Nodes.forEach((n: any) => {
            const scale = 0.5; 
            positionMap.set(n.id, new THREE.Vector3(n.x * scale, n.y * scale, n.z * scale));
        });
    }

    return positionMap;
  }, [nodes, layoutMode, links]);


  useFrame((state, delta) => {
    if (groupRef.current) {
      // Rotation logic
      if (layoutMode === 'SPIRAL') {
          groupRef.current.rotation.y += delta * 0.05;
      } else {
          // Slow rotation for other modes
          groupRef.current.rotation.y += delta * 0.02;
      }
    }

    // Smoothly interpolate positions
    nodes.forEach(node => {
        const meshGroup = meshRefs.current[node.id];
        const target = targetPositions.get(node.id);
        
        if (meshGroup && target) {
            const lerpFactor = 0.1; 
            meshGroup.position.lerp(target, lerpFactor);
        }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Connection Lines (Visible in FORCE and GROUPED modes) */}
      <ConnectionLines 
        links={links} 
        nodeRefs={meshRefs} 
        visible={layoutMode === 'FORCE' || layoutMode === 'GROUPED'} 
      />

      {nodes.map((node) => {
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNode === node.id;
        const color = COLORS.CATEGORY[node.category];
        const size = (node.importance / 10) * 0.3;

        return (
          <group 
            key={node.id} 
            ref={(el) => { if (el) meshRefs.current[node.id] = el; }}
          >
            {/* The Star */}
            <mesh 
              onClick={(e) => { e.stopPropagation(); onNodeClick(node); }}
              onPointerOver={() => setHoveredNode(node.id)}
              onPointerOut={() => setHoveredNode(null)}
            >
              <sphereGeometry args={[isSelected ? size * 1.5 : size, 32, 32]} />
              <meshStandardMaterial 
                color={isSelected ? '#ffffff' : color}
                emissive={color}
                emissiveIntensity={isSelected || isHovered ? 2 : 0.5}
                roughness={0.2}
                metalness={0.8}
              />
            </mesh>
            
            {/* Label (Visible on hover or select) */}
            {(isHovered || isSelected) && (
              <Billboard position={[0, size + 1.2, 0]}>
                {/* Title */}
                <Text
                  fontSize={0.4}
                  color={COLORS.GOLD}
                  font="https://fonts.gstatic.com/s/notoserifsc/v12/k3kXo84MP20-170-b8O_CSzPl2-s.woff"
                  anchorX="center"
                  anchorY="bottom"
                  outlineWidth={0.02}
                  outlineColor="#000000"
                >
                  {node.title}
                </Text>
                
                {/* Content Preview (Short Snippet) */}
                <Text
                   fontSize={0.2}
                   position={[0, -0.25, 0]}
                   color="#dddddd"
                   anchorX="center"
                   anchorY="top"
                   maxWidth={4}
                   textAlign="center"
                   outlineWidth={0.01}
                   outlineColor="#000000"
                >
                   {node.content.substring(0, 50) + (node.content.length > 50 ? '...' : '')}
                </Text>

                {/* Date */}
                <Text
                   fontSize={0.15}
                   position={[0, -1.2, 0]}
                   color={COLORS.TEXT_MUTED}
                   anchorX="center"
                   anchorY="top"
                >
                   {node.date}
                </Text>
              </Billboard>
            )}
            
            {/* Glow Sprite */}
            <Billboard>
                 <mesh>
                    <planeGeometry args={[size * 4, size * 4]} />
                    <meshBasicMaterial 
                        map={new THREE.TextureLoader().load('https://assets.codepen.io/127738/dotTexture.png')}
                        transparent
                        opacity={isSelected ? 0.8 : 0.3}
                        color={color}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                    />
                 </mesh>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
};