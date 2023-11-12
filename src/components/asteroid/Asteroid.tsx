import {
  CollisionPayload,
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
  vec3,
} from '@react-three/rapier';
import { FC, useRef, useState } from 'react';
import { BulletUserData } from '../Bullet';
import { CustomFbxLoader } from '../customObject';
import { asteroidAssets } from './asssets';
import { onHit } from '@/api/ether/onHit';
import { Vector3 } from 'three';

export interface AsteroidProps {
  onKilled: () => void;
}

export const Asteroid: FC<RigidBodyProps & AsteroidProps> = ({
  onKilled,
  ...props
}) => {
  const rigidBody = useRef<RapierRigidBody | null>(null);

  const [isDead, setIsDead] = useState(false);

  const [currentPosition, setCurrentPosition] = useState<Vector3 | null>(null);

  const intersectionHandler = async ({ other }: CollisionPayload) => {
    if ((other.rigidBody?.userData as BulletUserData).type === 'bullet') {
      setCurrentPosition(vec3(rigidBody.current?.translation()));

      try {
        const tx = await onHit();
        const receipt = await tx.wait();

        if (receipt.status && receipt.status > 0) {
          setIsDead(true);
          onKilled();
        }
      } catch (error) {
        setCurrentPosition(null);
      }
    }
  };

  if (isDead) {
    return null;
  }

  if (currentPosition) {
    return (
      <mesh position={currentPosition}>
        <boxGeometry />
        <meshBasicMaterial color={'red'} />
      </mesh>
    );
  }

  return (
    <RigidBody
      ref={rigidBody}
      {...props}
      angularVelocity={[0, 1, 0]}
      enabledTranslations={[true, false, true]}
      onIntersectionEnter={intersectionHandler}
      colliders={'hull'}
    >
      <CustomFbxLoader {...asteroidAssets} />
    </RigidBody>
  );
};
