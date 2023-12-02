import { create } from "zustand";
import { ShipSpecs } from "@/types/game.types";
import { Ship as ShipContract } from "@/contracts/Ship";

type Game = {
  shipSpecs?: ShipSpecs;

  shipContract: ShipContract;

  loadShipSpecs: () => Promise<void>;
};

export const useShip = create<Game>()((set, get) => ({
  shipSpecs: undefined,

  shipContract: new ShipContract(),

  loadShipSpecs: async () => {
    const { shipContract } = get();
    const specs = await shipContract.getSpecs(0);

    set((state) => ({ ...state, shipSpecs: specs }));
  },
}));
