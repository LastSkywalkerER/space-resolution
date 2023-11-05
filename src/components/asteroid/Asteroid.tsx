import { MeshProps } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { FC, useState } from 'react';
import { BulletUserData } from '../Bullet';

export interface AsteroidProps {
  onKilled: () => void;
}

export const Asteroid: FC<MeshProps & AsteroidProps> = ({
  onKilled,
  ...props
}) => {
  const [isDead, setIsDead] = useState(false);

  return (
    <RigidBody
      enabledTranslations={[true, false, true]}
      onIntersectionEnter={({ other }) => {
        if ((other.rigidBody?.userData as BulletUserData).type === 'bullet') {
          setIsDead(true);
          onKilled();
        }
      }}
    >
      <mesh {...props}>
        <boxGeometry />
        <meshBasicMaterial color={isDead ? 'red' : 'white'} />
      </mesh>
    </RigidBody>
  );
};
