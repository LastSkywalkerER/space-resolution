'use client';

import { Canvas } from '@react-three/fiber';
import css from './index.module.css';
import { Floor } from '@/components/floor';
import { LightBulb } from '@/components/LightBulb';
import { CAMERA_HEIGHT, Ship } from '@/components/ship';
import { OrbitControls } from '@/components/controls';
import {
  KeyboardControls,
  KeyboardControlsEntry,
  PerspectiveCamera,
  Scroll,
  ScrollControls,
  FlyControls,
  Sky,
  TrackballControls,
} from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { Suspense, useMemo } from 'react';
import { Asteroid } from '@/components/asteroid';

const createCoordinate = (
  from: number = 5,
  to: number = 50,
  withMinus: boolean = true,
) =>
  Math.floor(Math.random() * (to - from) + from) *
  (withMinus && Math.round(Math.random()) === 0 ? -1 : 1);

const asteroids: [number, number, number][] = Array.from(Array(50), () => [
  createCoordinate(),
  1,
  createCoordinate(),
]);

export enum Controls {
  Forward = 'forward',
  Back = 'back',
  Left = 'left',
  Right = 'right',
  // jump = 'jump',
}

export default function Home() {
  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.Forward, keys: ['ArrowUp', 'KeyW'] },
      { name: Controls.Back, keys: ['ArrowDown', 'KeyS'] },
      { name: Controls.Left, keys: ['ArrowLeft', 'KeyA'] },
      { name: Controls.Right, keys: ['ArrowRight', 'KeyD'] },
      // { name: Controls.jump, keys: ['Space'] },
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
          {/* <ScrollControls infinite> */}
          <ambientLight intensity={1.5} />
          <Sky sunPosition={[100, 20, 100]} />
          {/* <PerspectiveCamera makeDefault /> */}
          {/* <TrackballControls  /> */}
          {/* <OrbitControls /> */}
          <FlyControls />
          <Suspense>
            <Physics gravity={[0, 0, 0]}>
              <Ship />
              {asteroids.map((position, index) => (
                <Asteroid key={index} position={position} />
              ))}
            </Physics>
          </Suspense>

          {/* <Floor position={[0, -0.75, 0]} /> */}
          {/* </ScrollControls> */}
        </Canvas>
      </div>
    </KeyboardControls>
  );
}
