'use client';

import { PrimitiveProps, useLoader } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { FC, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

export interface CustomObjectLoaderProps {
  objectPath: string;
  texturePath: string;
  normalPath: string;
  heightPath: string;
  roughnessPath: string;
  metalnessPath: string;
}

export const CustomObjectLoader: FC<
  Omit<PrimitiveProps, 'object'> & CustomObjectLoaderProps
> = ({
  objectPath,
  texturePath,
  normalPath,
  heightPath,
  roughnessPath,
  metalnessPath,
  ...props
}) => {
  const [texture, normal, height, roughness, metalness] = useTexture([
    texturePath,
    normalPath,
    heightPath,
    roughnessPath,
    metalnessPath,
  ]);
  const obj = useLoader(OBJLoader as any, objectPath);

  let objClone = obj.clone();

  useLayoutEffect(() => {
    objClone.traverse(
      (
        child: THREE.Mesh & {
          material: THREE.MeshStandardMaterial;
        },
      ) => {
        if (child.isMesh) {
          const material = new THREE.MeshStandardMaterial({
            map: texture,
            normalMap: normal,
            // displacementMap: height,
            displacementBias: -0.05,
            displacementScale: 1,
            roughnessMap: roughness,
            metalnessMap: metalness,
            bumpMap: height,
          });

          child.material = material;
          child.geometry.computeVertexNormals();
        }
      },
    );
  }, [height, metalness, normal, objClone, roughness, texture]);

  return <primitive object={objClone} {...props} />;
};
