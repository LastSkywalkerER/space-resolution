import { Contract, Wallet, providers } from 'ethers';
import abi from './abi.json';
import { Ether } from './types';

export const onHit = async () => {
  const provider = new providers.JsonRpcProvider(
    'https://goerli.infura.io/v3/57b7823b502145a9b4abcc6f383f049d',
  );
  const wallet = new Wallet(
    '0x84ad4bad3508ce45558482fd4275a6d30fc79cc2d92b3bfef733abbe1470209b',
    provider,
  );
  const ether = new Contract(
    '0x82E475c3386d9acF91d0509995cA6C52A2d66de9',
    abi,
    wallet,
  ) as Ether;

  return await ether.onHit();
};
