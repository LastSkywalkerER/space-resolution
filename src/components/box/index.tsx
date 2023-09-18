'use client';

import { MeshProps, useLoader } from '@react-three/fiber';
import { FC, useEffect } from 'react';
import { TextureLoader } from 'three';
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import image from './image.png';

export const Box: FC<MeshProps> = (props) => {
  const texture = useLoader(TextureLoader as any, image.src);
  // const gltf = useLoader(GLTFLoader as any, './Substanse-dice.gltf');
  const obj = useLoader(OBJLoader as any, './Substanse-dice.obj');

  return (
    <mesh {...props} receiveShadow={true} castShadow>
      {/* <boxGeometry /> */}
      <primitive object={obj} />
      <meshPhysicalMaterial map={texture} color={'white'} />
    </mesh>
  );
};
