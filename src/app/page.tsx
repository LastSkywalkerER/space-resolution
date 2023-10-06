'use client';

import { Canvas } from '@react-three/fiber';
import css from './index.module.css';
import { Floor } from '@/components/floor';
import { LightBulb } from '@/components/LightBulb';
import { Ship } from '@/components/ship';
import { OrbitControls } from '@/components/controls';
import { Sky } from '@react-three/drei';

export default function Home() {
  return (
    <div className={css.scene}>
      <Canvas
        shadows
        className={css.canvas}
        camera={{
          position: [-6, 7, 7],
        }}
      >
        <ambientLight intensity={1.5} />
        <Sky sunPosition={[100, 20, 100]} />
        <Ship />
        <OrbitControls />
        {/* <Floor position={[0, -0.75, 0]} /> */}
      </Canvas>
    </div>
  );
}
