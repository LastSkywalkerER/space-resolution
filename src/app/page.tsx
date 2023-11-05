'use client';

import { Canvas } from '@react-three/fiber';
import css from './index.module.css';
import { CAMERA_HEIGHT, Ship } from '@/components/ship';
import {
  Environment,
  KeyboardControls,
  KeyboardControlsEntry,
  Loader,
  PerformanceMonitor,
  SoftShadows,
} from '@react-three/drei';
import { Physics } from '@react-three/rapier';
import { Suspense, useMemo, useState } from 'react';
import { Controls } from '@/constants';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { Experience } from '@/components/experience';
import { Gui } from '@/components/gui';

export default function Home() {
  const [downgradedPerformance, setDowngradedPerformance] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const map = useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.Forward, keys: ['ArrowUp', 'KeyW'] },
      { name: Controls.Back, keys: ['ArrowDown', 'KeyS'] },
      { name: Controls.Left, keys: ['ArrowLeft', 'KeyA'] },
      { name: Controls.Right, keys: ['ArrowRight', 'KeyD'] },
      { name: Controls.Fire, keys: ['Space'] },
    ],
    [],
  );

  return (
    <div className="relative">
      <Gui
        map={map}
        className="absolute z-10"
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
      />
      <KeyboardControls map={map}>
        <div className={css.scene}>
          <Loader />
          <Canvas
            shadows
            className={css.canvas}
            camera={{
              position: [0, CAMERA_HEIGHT, 0],
            }}
            dpr={[1, 1.5]} // optimization to increase performance on retina/4k devices
          >
            <SoftShadows size={42} />
            <PerformanceMonitor
              // Detect low performance devices
              onDecline={(fps) => {
                setDowngradedPerformance(true);
              }}
            />

            <ambientLight intensity={1.5} />
            <Environment files={'./space/Space_sn_copy.hdr'} background />

            {isPlaying && (
              <Suspense fallback={null}>
                <Physics gravity={[0, 0, 0]}>
                  <Experience downgradedPerformance={downgradedPerformance} />
                </Physics>
              </Suspense>
            )}

            {!downgradedPerformance && (
              // disable the postprocessing on low-end devices
              <EffectComposer disableNormalPass>
                <Bloom luminanceThreshold={1} intensity={1.5} mipmapBlur />
              </EffectComposer>
            )}
          </Canvas>
        </div>
      </KeyboardControls>
    </div>
  );
}
