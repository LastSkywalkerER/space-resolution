import { create } from "zustand";
import { Vector3 } from "three";
import { asteroids } from "@/constants";
import { Signer } from "ethers";
import { BulletData } from "@/types/game.types";
import { GameLogic } from "@/contracts/GameLogic";

type Game = {
  position: Vector3;
  bullets: number;
  usedBullets: Record<string, BulletData>;
  ethers: { id: number; position: Vector3 }[];
  wreckedEthers: number;

  gameLogic: GameLogic;

  init: (signer: Signer) => Promise<void>;
  buyBullets: (signer: Signer, amount: number) => Promise<void>;
  onShoot: (bullet: BulletData) => void;
  onHit: (
    signer: Signer,
    data: { hitPosition: Vector3; etherId: number; bulletId: number },
  ) => Promise<void>;
  loadGameData: (signer: Signer) => Promise<void>;
};

export const useGame = create<Game>()((set, get) => ({
  bullets: 0,
  usedBullets: {},
  ethers: [],
  position: new Vector3(0, 0, 0),
  wreckedEthers: 0,

  gameLogic: new GameLogic(),

  init: async (signer: Signer) => {
    const { gameLogic } = get();

    const { bullets, ethersPosition, currentPosition, wreckedEthers, ethersId, ethersAmount } =
      await gameLogic.getGameData(signer);

    let ethers = ethersId.map((id, index) => ({
      id,
      position: ethersPosition[index],
    }));

    if (ethersAmount === 0) {
      const generatedEthers = asteroids.map(([x, y, z]) => new Vector3(x, y, z));
      const tx = await gameLogic.start(signer, generatedEthers);
      const { status } = await tx.wait();

      if (status && status > 0) {
        ethers = generatedEthers.map((position, index) => ({
          id: index,
          position,
        }));
      } else {
        throw Error("Start failed");
      }
    }

    set((state) => ({
      ...state,
      bullets,
      ethers,
      position: currentPosition,
      wreckedEthers,
    }));
  },
  loadGameData: async (signer: Signer) => {
    const { gameLogic } = get();

    const { bullets, ethersPosition, currentPosition, wreckedEthers, ethersId } =
      await gameLogic.getGameData(signer);

    set((state) => ({
      ...state,
      bullets,
      ethers: ethersId.map((id, index) => ({
        id,
        position: ethersPosition[index],
      })),
      position: currentPosition,
      wreckedEthers,
    }));
  },
  buyBullets: async (signer: Signer, amount: number) => {
    const { gameLogic } = get();

    const tx = await gameLogic.buyBullets(signer, amount);
    const { status } = await tx.wait();

    if (status && status > 0) {
      set((state) => ({ ...state, bullets: state.bullets + amount }));
    } else {
      throw Error("Buy failed");
    }
  },
  onShoot: (bullet: BulletData) => {
    const { bullets } = get();

    if (!bullets) throw Error("Buy bullets");

    set((state) => ({
      ...state,
      bullets: state.bullets === 0 ? 0 : --state.bullets,
      usedBullets: { ...state.usedBullets, [bullet.id]: bullet },
    }));
  },
  onHit: async (
    signer: Signer,
    { bulletId, etherId, hitPosition }: { hitPosition: Vector3; etherId: number; bulletId: number },
  ) => {
    const { gameLogic, usedBullets, position, bullets } = get();

    if (!bullets) throw Error("You have no bullets");

    const tx = await gameLogic.registerAction(signer, {
      newPlayerPosition: position,
      etherIds: [etherId],
      bullets: Object.values(usedBullets).map(({ id, ...rest }) => ({
        ...rest,
        id,
        hitPosition: id === bulletId ? hitPosition : undefined,
      })),
    });
    const { status } = await tx.wait();

    if (status && status > 0) {
      set((state) => ({
        ...state,
        ethers: state.ethers.filter(({ id }) => id !== etherId),
        wreckedEthers: ++state.wreckedEthers,
        position,
        usedBullets: {},
      }));
    } else {
      throw Error("Hit failed");
    }
  },
}));
