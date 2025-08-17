import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import { Box3, Vector3 } from 'three';

function Character({ mouse }) {
  const group = useRef();
  // const { scene } = useGLTF('/src/assets/smile1.glb');
    const { scene } = useGLTF('/smile1.glb');


  useEffect(() => {
    if (group.current) {
      group.current.rotation.set(0, 0, 0);
      
      // Center the model
      const box = new Box3().setFromObject(group.current);
      const center = new Vector3();
      box.getCenter(center);
      group.current.position.y -= center.y;
    }
  }, []);

  useFrame(() => {
    if (group.current && mouse.current) {
      const maxYaw = 0.5;    // Left/right rotation
      const maxPitch = 0.3;  // Up/down rotation
      
      group.current.rotation.y = mouse.current.x * maxYaw;
      group.current.rotation.x = mouse.current.y * maxPitch;
    }
  });

  return <primitive ref={group} object={scene} scale={4} />;
}

export default function Welcome3DFace() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '40px 0 32px 0' }}>
      <div style={{ width: 340, height: 340 }}>
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Character mouse={mouse} />
        </Canvas>
      </div>
    </div>
  );
}