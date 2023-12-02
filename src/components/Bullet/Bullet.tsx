import { CollisionPayload, RapierRigidBody, RigidBody, vec3 } from "@react-three/rapier";
import { FC, useEffect, useRef } from "react";
import { Euler, MeshBasicMaterial, Quaternion, Vector3 } from "three";

const BULLET_SPEED = 200;

const bulletMaterial = new MeshBasicMaterial({
  color: "green",
  toneMapped: false,
});

bulletMaterial.color.multiplyScalar(42);

export interface BulletUserData {
  type: string;
  player: string;
  bulletId: number;
  damage: number;
}

export interface BulletProps {
  id: number;
  player: string;
  angle: Quaternion;
  position: { x: number; y: number; z: number };
  WEAPON_OFFSET: Vector3;
  onHit: (vector: Vector3) => void;
}

export const Bullet: FC<BulletProps> = ({ id, player, angle, position, WEAPON_OFFSET, onHit }) => {
  const rigidbody = useRef<RapierRigidBody | null>(null);

  useEffect(() => {
    if (!rigidbody.current) return;

    const audio = new Audio("/audios/rifle.mp3");
    audio.play();

    const direction = new Vector3()
      .set(0, 0, -1)
      .normalize()
      .multiplyScalar(BULLET_SPEED)
      .applyQuaternion(angle);

    // rigidbody.current.setRotation(angle, true);
    rigidbody.current.setLinvel(direction, true);
  }, []);

  return (
    <group
      position={[position.x, position.y, position.z]}
      rotation={new Euler().setFromQuaternion(angle)}
    >
      <group position-x={WEAPON_OFFSET.x} position-y={WEAPON_OFFSET.y} position-z={WEAPON_OFFSET.z}>
        <RigidBody
          ref={rigidbody}
          gravityScale={0}
          onIntersectionEnter={(e: CollisionPayload) => {
            if ((e.other.rigidBody?.userData as BulletUserData)?.type !== "bullet") {
              rigidbody.current?.setEnabled(false);
              onHit(vec3(rigidbody.current?.translation()));
            }
          }}
          sensor
          userData={
            {
              type: "bullet",
              player,
              damage: 10,
              bulletId: id,
            } as BulletUserData
          }
        >
          <mesh position-z={0.25} material={bulletMaterial} castShadow>
            <boxGeometry args={[0.05, 0.05, 5]} />
          </mesh>
        </RigidBody>
      </group>
    </group>
  );
};
