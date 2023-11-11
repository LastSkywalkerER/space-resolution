import { RigidBody, RigidBodyProps } from '@react-three/rapier';
import { FC, useState } from 'react';
import { BulletUserData } from '../Bullet';
import { CustomFbxLoader } from '../customObject';
import { asteroidAssets } from './asssets';

export interface AsteroidProps {
  onKilled: () => void;
}

export const Asteroid: FC<RigidBodyProps & AsteroidProps> = ({
  onKilled,
  ...props
}) => {
  const [isDead, setIsDead] = useState(false);

  if (isDead) {
    return null;
  }

  return (
    <RigidBody
      {...props}
      angularVelocity={[0, 1, 0]}
      enabledTranslations={[true, false, true]}
      onIntersectionEnter={({ other }) => {
        if ((other.rigidBody?.userData as BulletUserData).type === 'bullet') {
          setIsDead(true);
          onKilled();
        }
      }}
      colliders={'hull'}
    >
      <CustomFbxLoader {...asteroidAssets} />
    </RigidBody>
  );
};
