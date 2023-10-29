'use client';

import { useFrame } from '@react-three/fiber';
import { useKeyboardControls, useScroll } from '@react-three/drei';
import { FC, useRef } from 'react';
import * as THREE from 'three';
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
  quat,
} from '@react-three/rapier';
import { CustomObjectLoader } from '../customObject';
import { shipAssets } from './asssets';
import { Controls } from '@/constants';

export const MOVE_SPEED = 10;
export const MOVE_ANGLE_SPEED = 50;
export const SHIP_MASS = 10;
export const CAMERA_HEIGHT = 50;
export const LINEAR_DAMPING = 0.5;
export const ANGULAR_DAMPING = 1.5;

const direction = new THREE.Vector3();
const rotation = new THREE.Vector3();

export const Ship: FC<RigidBodyProps> = (props) => {
  const shipRef = useRef<RapierRigidBody | null>(null);

  const forward = useKeyboardControls<Controls>((state) => state.forward);
  const backward = useKeyboardControls<Controls>((state) => state.back);
  const left = useKeyboardControls<Controls>((state) => state.left);
  const right = useKeyboardControls<Controls>((state) => state.right);

  useFrame((state, delta) => {
    if (!shipRef.current) return;

    // apply angle impulse by key buttons
    // if (right) {
    //   const incrementRotation = new THREE.Quaternion().setFromAxisAngle(
    //     new THREE.Vector3(0, -1, 0),
    //     delta * MOVE_ANGLE_SPEED,
    //   );
    //   curRotation.multiply(incrementRotation);
    // }
    // if (left) {
    //   const incrementRotation = new THREE.Quaternion().setFromAxisAngle(
    //     new THREE.Vector3(0, 1, 0),
    //     delta * MOVE_ANGLE_SPEED,
    //   );
    //   curRotation.multiply(incrementRotation);
    // }
    // shipRef.current.setRotation(curRotation, true);
    rotation
      .set(0, +left - +right, 0)
      .normalize()
      .multiplyScalar(MOVE_ANGLE_SPEED);
    shipRef.current.applyTorqueImpulse(rotation, true);
    const curRotation = quat(shipRef.current.rotation());

    // apply liner impulse by key buttons
    direction
      .set(0, 0, +backward - +forward)
      .normalize()
      .multiplyScalar(MOVE_SPEED)
      .applyQuaternion(curRotation);
    shipRef.current.applyImpulse(
      {
        x: direction.x,
        y: 0,
        z: direction.z,
      },
      true,
    );

    // moving camera
    const { x, y, z } = shipRef.current.translation();
    state.camera.position.set(x, y + CAMERA_HEIGHT, z);
  });

  return (
    <RigidBody
      ref={shipRef}
      mass={SHIP_MASS}
      enabledTranslations={[true, false, true]}
      enabledRotations={[false, true, false]}
      linearDamping={LINEAR_DAMPING}
      angularDamping={ANGULAR_DAMPING}
      {...props}
    >
      <CustomObjectLoader {...shipAssets} />
    </RigidBody>
  );
};
