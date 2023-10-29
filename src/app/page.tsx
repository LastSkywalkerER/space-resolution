'use client';

import { Canvas } from '@react-three/fiber';
import css from './index.module.css';
import { CAMERA_HEIGHT, Ship } from '@/components/ship';
import {
  KeyboardControls,
  KeyboardControlsEntry,
  Sky,
} from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { Suspense, useMemo } from 'react';
import { Asteroid } from '@/components/asteroid';
import { Controls, asteroids } from '@/constants';

export default function Home() {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.Forward, keys: ['ArrowUp', 'KeyW'] },
      { name: Controls.Back, keys: ['ArrowDown', 'KeyS'] },
      { name: Controls.Left, keys: ['ArrowLeft', 'KeyA'] },
      { name: Controls.Right, keys: ['ArrowRight', 'KeyD'] },
    ],
    [],
  );

  return (
    <KeyboardControls map={map}>
      <div className={css.scene}>
        <Canvas
          shadows
          className={css.canvas}
          camera={{
            position: [0, CAMERA_HEIGHT, 0],
          }}
        >
          <ambientLight intensity={1.5} />
          <Sky sunPosition={[100, 20, 100]} />

          <Suspense>
            <Physics gravity={[0, 0, 0]}>
              <Ship />
              {asteroids.map((position, index) => (
                <Asteroid key={index} position={position} />
              ))}
            </Physics>
          </Suspense>
        </Canvas>
      </div>
    </KeyboardControls>
  );
}
