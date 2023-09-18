'use client';

import { Canvas } from '@react-three/fiber';
import css from './index.module.css';
import { Floor } from '@/components/floor';
import { LightBulb } from '@/components/LightBulb';
import { Box } from '@/components/box';
import { OrbitControls } from '@/components/controls';

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
        <ambientLight color={'white'} intensity={0.3} />
        <LightBulb position={[2, 6, 4]} />
        <LightBulb position={[-2, 6, -4]} />
        <Box />
        <OrbitControls />
        {/* <Floor position={[0, -0.75, 0]} /> */}
      </Canvas>
    </div>
  );
}
