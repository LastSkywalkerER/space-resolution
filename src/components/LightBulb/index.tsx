import { MeshProps } from '@react-three/fiber';
import { FC } from 'react';

export const LightBulb: FC<MeshProps> = (props) => {
  return (
    <mesh {...props}>
      <pointLight castShadow />
      <sphereGeometry args={[0.2, 30, 10]} />
      <meshPhongMaterial emissive={'yellow'} />
    </mesh>
  );
};
