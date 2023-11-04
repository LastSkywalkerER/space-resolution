import { MeshProps } from '@react-three/fiber';
import { RigidBody } from '@react-three/rapier';
import { FC } from 'react';

export const Asteroid: FC<MeshProps> = (props) => {
  return (
    <RigidBody enabledTranslations={[true, false, true]}>
      <mesh {...props}>
        <boxGeometry />
      </mesh>
    </RigidBody>
  );
};
