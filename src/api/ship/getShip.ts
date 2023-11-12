import { Contract, providers } from 'ethers';
import { cache } from 'react';
import abi from './abi.json';
import { Ship } from './types';

export interface Specs {
  MOVE_SPEED: number;
  MOVE_ANGLE_SPEED: number;
  SHIP_MASS: number;
  LINEAR_DAMPING: number;
  ANGULAR_DAMPING: number;
  FIRE_RATE: number;
}

const k = 100;

export const getShip = cache(async (): Promise<Specs> => {
  const provider = new providers.JsonRpcProvider(
    'https://goerli.infura.io/v3/57b7823b502145a9b4abcc6f383f049d',
  );
  const ship = new Contract(
    '0xBE97051aFd24899a78D6B40923B99Fa104De1593',
    abi,
    provider,
  ) as Ship;

  const specs = await ship.specs();

  return {
    ANGULAR_DAMPING: specs.ANGULAR_DAMPING / k,
    FIRE_RATE: specs.FIRE_RATE / k,
    LINEAR_DAMPING: specs.LINEAR_DAMPING / k,
    MOVE_ANGLE_SPEED: specs.MOVE_ANGLE_SPEED / k,
    MOVE_SPEED: specs.MOVE_SPEED / k,
    SHIP_MASS: specs.SHIP_MASS / k,
  };
});
