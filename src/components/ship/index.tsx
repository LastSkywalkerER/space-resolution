'use client';

import { LoaderProto, MeshProps, useLoader } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { FC, useEffect, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export const Ship: FC<MeshProps> = (props) => {
  const [texture, normal, height, roughness, metalness] = useTexture([
    './ship/ship_Base_color.png',
    './ship/ship_Normal_DirectX.png',
    './ship/ship_Height.png',
    './ship/ship_Roughness.png',
    './ship/ship_Metallic.png',
  ]);

  const obj = useLoader(OBJLoader as any, './ship/ship.obj');

  useLayoutEffect(() => {
    obj.traverse((child) => {
      if (child.isMesh) {
        child.material.map = texture;
        child.material.normalMap = normal;
        // child.material.displacementMap = height;
        child.material.roughnessMap = roughness;
        child.material.metalnessMap = metalness;
        child.geometry.computeVertexNormals();
      }
    });
  }, [height, metalness, normal, obj, roughness, texture]);

  return <primitive object={obj} />;
};
