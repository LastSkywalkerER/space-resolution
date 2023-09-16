import { MeshProps } from '@react-three/fiber';
import { FC } from 'react';

export const Floor: FC<MeshProps> = (props) => {
  return (
    <mesh {...props} receiveShadow>
      <boxGeometry args={[10, 0.5, 10]} />
      <meshPhysicalMaterial color="white" />
    </mesh>
  );
};
