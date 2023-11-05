import { GroupProps } from '@react-three/fiber';
import { FC } from 'react';

export const Crosshair: FC<GroupProps> = (props) => {
  return (
    <group {...props}>
      <mesh position-z={-1}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="white" transparent opacity={0.9} />
      </mesh>
      <mesh position-z={-2}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="white" transparent opacity={0.85} />
      </mesh>
      <mesh position-z={-3}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="white" transparent opacity={0.8} />
      </mesh>

      <mesh position-z={-4.5}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="white" opacity={0.7} transparent />
      </mesh>

      <mesh position-z={-6.5}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="white" opacity={0.6} transparent />
      </mesh>

      <mesh position-z={-9}>
        <boxGeometry args={[0.05, 0.05, 0.05]} />
        <meshBasicMaterial color="white" opacity={0.2} transparent />
      </mesh>
    </group>
  );
};
