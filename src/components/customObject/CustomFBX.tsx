"use client";

import { PrimitiveProps, useLoader } from "@react-three/fiber";
import { useFBX, useTexture } from "@react-three/drei";
import { FC, useLayoutEffect } from "react";
import * as THREE from "three";

export interface CustomFbxLoaderProps {
  fbxPath: string;
  texturePath: string;
  normalPath: string;
  heightPath: string;
  roughnessPath: string;
  metalnessPath: string;
  aoPath?: string;
}

export const CustomFbxLoader: FC<Omit<PrimitiveProps, "object"> & CustomFbxLoaderProps> = ({
  fbxPath,
  texturePath,
  normalPath,
  heightPath,
  roughnessPath,
  metalnessPath,
  aoPath,
  ...props
}) => {
  const [texture, normal, height, roughness, metalness, aoMap] = useTexture([
    texturePath,
    normalPath,
    heightPath,
    roughnessPath,
    metalnessPath,
    ...(aoPath ? [aoPath] : []),
  ]);
  const fbx = useFBX(fbxPath);

  let fbxClone = fbx.clone();

  useLayoutEffect(() => {
    fbxClone.traverse((realChild) => {
      const child = realChild as THREE.Mesh & {
        material: THREE.MeshStandardMaterial;
      };

      if (child.isMesh) {
        const material = new THREE.MeshStandardMaterial({
          map: texture,
          normalMap: normal,
          // displacementMap: height,
          // displacementBias: -0.05,
          // displacementScale: 1,
          roughnessMap: roughness,
          metalnessMap: metalness,
          bumpMap: height,
          aoMap,
        });

        child.material = material;
        child.geometry.computeVertexNormals();
      }
    });
  }, [height, metalness, normal, fbxClone, roughness, texture, aoMap]);

  return <primitive object={fbxClone} {...props} />;
};
