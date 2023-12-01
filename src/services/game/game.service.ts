import { create } from "zustand";
import { Vector3 } from "three";
import { GameLogic } from "@/services/game/gameLogic/GameLogic";
import { asteroids } from "@/constants";
import { Signer } from "ethers";

type Game = {
  position: Vector3;
  bullets: number;
  usedBullets: number;
  ethers: { id: number; position: Vector3 }[];
  wreckedEthers: number;

  gameLogic: GameLogic;

  init: (signer: Signer) => Promise<void>;
  buyBullets: (signer: Signer, amount: number) => Promise<void>;
  onShoot: (position: Vector3) => void;
  onHit: (signer: Signer, position: Vector3, etherId: number) => Promise<void>;
  loadGameData: (signer: Signer) => Promise<void>;
};

export const useGame = create<Game>()((set, get) => ({
  bullets: 0,
  usedBullets: 0,
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

    const { bullets, ethersPosition, currentPosition, wreckedEthers, ethersId, ethersAmount } =
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
  //   TODO: add hit position logic
  onShoot: (_: Vector3) => {
    const { bullets } = get();

    if (!bullets) throw Error("Buy bullets");

    set((state) => ({
      ...state,
      bullets: state.bullets === 0 ? 0 : --state.bullets,
      usedBullets: state.bullets === 0 ? state.usedBullets : ++state.usedBullets,
    }));
  },
  //   TODO: add hit position logic
  onHit: async (signer: Signer, _: Vector3, etherId: number) => {
    const { gameLogic, usedBullets, position, bullets } = get();

    if (!bullets) throw Error("You have no bullets");

    const tx = await gameLogic.registerAction(signer, {
      newPlayerPosition: position,
      etherIds: [etherId],
      bulletsAmount: usedBullets,
    });
    const { status } = await tx.wait();

    if (status && status > 0) {
      set((state) => ({
        ...state,
        ethers: state.ethers.filter(({ id }) => id !== etherId),
        wreckedEthers: ++state.wreckedEthers,
        position,
      }));
    } else {
      throw Error("Hit failed");
    }
  },
}));
