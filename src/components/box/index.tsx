import { MeshProps, useLoader } from '@react-three/fiber';
import { FC } from 'react';
import { TextureLoader } from 'three';

import image from './image.png';

export const Box: FC<MeshProps> = (props) => {
  const texture = useLoader(TextureLoader as any, image.src);
  // const texture = new TextureLoader().load(image.src);

  return (
    <mesh {...props} receiveShadow={true} castShadow>
      <boxGeometry />
      <meshPhysicalMaterial map={texture} color={'white'} />
    </mesh>
  );
};
