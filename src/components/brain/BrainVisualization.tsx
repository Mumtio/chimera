import { useRef, useState, memo, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { CognitiveModel } from '../../types';

interface BrainVisualizationProps {
  models: CognitiveModel[];
  onModelSelect: (modelId: string) => void;
  hoveredModel?: string;
}

interface ModelNodeProps {
  model: CognitiveModel;
  isHovered: boolean;
  onHover: (modelId: string | null) => void;
  onClick: (modelId: string) => void;
}

const ModelNode = memo(({ model, isHovered, onHover, onClick }: ModelNodeProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const scale = isHovered ? 1.3 : 1.0;

  useFrame(() => {
    if (meshRef.current) {
      // Smooth interpolation for scale animation
      meshRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.15);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[model.position.x, model.position.y, model.position.z]}
      onPointerOver={() => onHover(model.id)}
      onPointerOut={() => onHover(null)}
      onClick={() => onClick(model.id)}
    >
      <sphereGeometry args={[0.3, 16, 16]} />
      <meshStandardMaterial
        color="#00FFAA"
        emissive={isHovered ? '#00FFAA' : '#00AA88'}
        emissiveIntensity={isHovered ? 1.8 : 0.6}
        toneMapped={false}
      />
      {isHovered && (
        <pointLight
          color="#00FFAA"
          intensity={2}
          distance={3}
        />
      )}
    </mesh>
  );
});

const BrainMesh = memo(() => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Smooth, slow rotation
      meshRef.current.rotation.y += 0.002;
      // Subtle breathing effect
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
      meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2, 1]} />
      <meshBasicMaterial 
        color="#00FFAA" 
        wireframe 
        opacity={0.25} 
        transparent 
        toneMapped={false}
      />
    </mesh>
  );
});

const Scene = memo(({ models, onModelSelect, onHover, hoveredModelId }: {
  models: CognitiveModel[];
  onModelSelect: (modelId: string) => void;
  onHover: (modelId: string | null) => void;
  hoveredModelId: string | null;
}) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <BrainMesh />
      {models.map((model) => (
        <ModelNode
          key={model.id}
          model={model}
          isHovered={hoveredModelId === model.id}
          onHover={onHover}
          onClick={onModelSelect}
        />
      ))}
      <OrbitControls enableZoom={true} enablePan={false} />
    </>
  );
});

const BrainVisualization = ({ models, onModelSelect }: BrainVisualizationProps) => {
  const [hoveredModelId, setHoveredModelId] = useState<string | null>(null);
  const hoveredModel = models.find(m => m.id === hoveredModelId);

  return (
    <div className="relative w-full h-full">
      <Canvas 
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance'
        }}
        dpr={[1, 2]}
      >
        <Scene
          models={models}
          onModelSelect={onModelSelect}
          onHover={setHoveredModelId}
          hoveredModelId={hoveredModelId}
        />
      </Canvas>
      
      {hoveredModel && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-fade-in">
          <div className="bg-black/90 border-2 border-neon-green px-6 py-4 angular-frame text-center shadow-neon">
            <div className="text-neon-green font-bold text-lg mb-1 text-glow-sm">
              Active Node Link
            </div>
            <div className="text-white text-sm mb-2">
              {hoveredModel.displayName}
            </div>
            <div className="text-neon-green text-xs pulse-subtle">
              Click to Initialize
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(BrainVisualization);
