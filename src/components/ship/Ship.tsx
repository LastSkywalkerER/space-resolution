"use client";

import { GroupProps, useFrame } from "@react-three/fiber";
import { CameraControls, useKeyboardControls } from "@react-three/drei";
import { FC, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RapierRigidBody, RigidBody, quat, vec3 } from "@react-three/rapier";
import { CustomFbxLoader, CustomObjectLoader } from "../customObject";
import { shipAssets, shipAssets2 } from "./asssets";
import { Controls } from "@/constants";
import { Group } from "three";
import { ShipInfo } from "./ShipInfo";
import { BulletData, ShipSpecs } from "@/types/game.types";

const direction = new THREE.Vector3();
const rotation = new THREE.Vector3();

export interface ShipProps {
  downgradedPerformance?: boolean;
  onFire: (bullet: BulletData) => void;
  specs: ShipSpecs;
}

export const Ship: FC<GroupProps & ShipProps> = ({
  onFire,
  downgradedPerformance,
  specs,
  ...props
}) => {
  const rigidbody = useRef<RapierRigidBody | null>(null);
  const group = useRef<Group<THREE.Object3DEventMap> | null>(null);
  const character = useRef<Group<THREE.Object3DEventMap> | null>(null);
  const controls = useRef<CameraControls | null>(null);
  const directionalLight = useRef<THREE.DirectionalLight | null>(null);
  const lastShoot = useRef(0);

  const forward = useKeyboardControls<Controls>((state) => state.forward);
  const backward = useKeyboardControls<Controls>((state) => state.back);
  const left = useKeyboardControls<Controls>((state) => state.left);
  const right = useKeyboardControls<Controls>((state) => state.right);
  const fire = useKeyboardControls<Controls>((state) => state.fire);

  useFrame((state, delta) => {
    if (!specs) return;
    const { FIRE_RATE, MOVE_ANGLE_SPEED, MOVE_SPEED } = specs;

    if (!rigidbody.current) return;

    // CAMERA FOLLOW
    if (controls.current) {
      const cameraDistanceY = window.innerWidth < 1024 ? 16 : 20;
      const cameraDistanceZ = window.innerWidth < 1024 ? 12 : 16;
      const playerWorldPos = vec3(rigidbody.current.translation());
      controls.current.setLookAt(
        playerWorldPos.x,
        playerWorldPos.y + cameraDistanceY,
        playerWorldPos.z + cameraDistanceZ,
        playerWorldPos.x,
        playerWorldPos.y + 1.5,
        playerWorldPos.z,
        true,
      );
    }

    rotation
      .set(0, +left - +right, 0)
      .normalize()
      .multiplyScalar(MOVE_ANGLE_SPEED);
    rigidbody.current.applyTorqueImpulse(rotation, true);
    const curRotation = quat(rigidbody.current.rotation());

    // apply liner impulse by key buttons
    direction
      .set(0, 0, +backward - +forward)
      .normalize()
      .multiplyScalar(MOVE_SPEED)
      .applyQuaternion(curRotation);
    rigidbody.current.applyImpulse(direction, true);

    // Check if fire button is pressed
    if (fire) {
      // fire

      if (Date.now() - lastShoot.current > FIRE_RATE) {
        lastShoot.current = Date.now();
        const newBullet = {
          id: +new Date(),
          position: vec3(rigidbody.current.translation()),
          angle: curRotation,
          player: "Ship",
        };
        onFire(newBullet);
      }
    }
  });

  useEffect(() => {
    if (character.current && directionalLight.current) {
      directionalLight.current.target = character.current;
    }
  }, [character.current]);

  if (!specs) return null;

  return (
    <group {...props} ref={group}>
      <CameraControls ref={controls} />

      <RigidBody
        ref={rigidbody}
        mass={specs.SHIP_MASS}
        enabledTranslations={[true, false, true]}
        enabledRotations={[false, true, false]}
        linearDamping={specs.LINEAR_DAMPING}
        angularDamping={specs.ANGULAR_DAMPING}
        type="dynamic"
        colliders={"trimesh"}
      >
        <ShipInfo name="Ship" />
        <group ref={character}>
          <CustomFbxLoader {...shipAssets2} />
          {/* <CustomObjectLoader {...shipAssets} /> */}
        </group>

        <directionalLight
          ref={directionalLight}
          position={[25, 18, -25]}
          intensity={0.3}
          castShadow={!downgradedPerformance} // Disable shadows on low-end devices
          shadow-camera-near={0}
          shadow-camera-far={100}
          shadow-camera-left={-20}
          shadow-camera-right={20}
          shadow-camera-top={20}
          shadow-camera-bottom={-20}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
      </RigidBody>
    </group>
  );
};
