import { Billboard, Text } from '@react-three/drei';
import { FC } from 'react';

export interface ShipInfoProps {
  name: string;
}

export const ShipInfo: FC<ShipInfoProps> = ({ name }) => {
  return (
    <Billboard position-y={2.5}>
      <Text position-y={0.36} fontSize={0.4}>
        {name}
      </Text>
    </Billboard>
  );
};
