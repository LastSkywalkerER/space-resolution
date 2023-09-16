import { extend, useThree } from '@react-three/fiber';

import { Stats, OrbitControls as ThreeOrbitControls } from '@react-three/drei';

extend({ ThreeOrbitControls });

export const OrbitControls = () => {
  const { camera, gl } = useThree();
  return (
    <ThreeOrbitControls
      attach={'orbitControls'}
      args={[camera, gl.domElement]}
      enabled
    />
  );
};
