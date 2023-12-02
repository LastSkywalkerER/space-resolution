import { shipAddress } from "@/constants/constants";
import { GameContract } from "../GameContract";
import { Ship as IShip } from "./Ship.types";
import abi from "./abi.json";
import { ShipSpecs } from "@/types/game.types";
import { nk } from "@/helpers/ethSpecsParse";
import { Vector3 } from "three";

export class Ship extends GameContract<IShip> {
  constructor() {
    super({ address: shipAddress, abi });
  }

  public async getSpecs(tokenId: number): Promise<ShipSpecs> {
    // const tokenId: number = await new Promise(async (resolve, reject) => {
    //   try {
    //     const totalSupply = +utils.formatUnits(await this.contract.totalSupply(), 0);

    //     for (let i = 0; totalSupply > i; i++) {
    //       if ((await this.contract.ownerOf(i)) === (await signer.getAddress())) {
    //         resolve(i);
    //         break;
    //       }
    //     }

    //     reject();
    //   } catch (error) {
    //     reject(error);
    //   }
    // });

    const data = await this.contract.shipSpecsByTokenId(tokenId);

    return {
      ANGULAR_DAMPING: nk(data.ANGULAR_DAMPING),
      FIRE_RATE: nk(data.FIRE_RATE),
      LINEAR_DAMPING: nk(data.LINEAR_DAMPING),
      MOVE_ANGLE_SPEED: nk(data.MOVE_ANGLE_SPEED),
      MOVE_SPEED: nk(data.MOVE_SPEED),
      SHIP_MASS: nk(data.SHIP_MASS),
      WEAPON_OFFSET: new Vector3(
        nk(data.WEAPON_OFFSET.x),
        nk(data.WEAPON_OFFSET.y),
        nk(data.WEAPON_OFFSET.z),
      ),
    };
  }
}
