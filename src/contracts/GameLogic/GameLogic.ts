import { Signer, utils } from "ethers";
import { gameLogicAddress } from "@/constants/constants";
import abi from "./abi.json";
import { Vector3 } from "three";
import { type GameLogic as IGameLogic } from "./GameLogic.types";
import { BulletData } from "@/types/game.types";
import { GameContract } from "../GameContract";
import { n, r, rk, nk } from "@/helpers/ethSpecsParse";

export class GameLogic extends GameContract<IGameLogic> {
  public bulletPrice = 0.0001;

  constructor() {
    super({ address: gameLogicAddress, abi });
  }

  public async start(signer: Signer, ethersPosition: Vector3[]) {
    return await this.contract
      .connect(signer)
      .start(ethersPosition.map(({ x, y, z }) => ({ x: rk(x), y: rk(y), z: rk(z) })));
  }
  public async buyBullets(signer: Signer, amount: number) {
    return await this.contract
      .connect(signer)
      .buyBullets(amount, { value: utils.parseEther(`${this.bulletPrice * amount}`) });
  }
  public async getGameData(signer: Signer) {
    const data = await this.contract.connect(signer).getGameData();

    return {
      ethersPosition: data.ethersPosition.map(({ x, y, z }) => new Vector3(nk(x), nk(y), nk(z))),
      currentPosition: new Vector3(
        nk(data.currentPosition.x),
        nk(data.currentPosition.y),
        nk(data.currentPosition.z),
      ),
      wreckedEthers: n(data.wreckedEthers),
      ethersId: data.ethersId.map((id) => n(id)),
      ethersAmount: n(data.ethersAmount),
      bullets: n(data.bullets),
    };
  }

  public async registerAction(
    signer: Signer,
    {
      bullets,
      etherIds,
      newPlayerPosition,
    }: { etherIds: number[]; bullets: BulletData[]; newPlayerPosition: Vector3 },
  ) {
    return await this.contract.connect(signer).hitRegister(
      etherIds,
      bullets.map(({ position, hitPosition, id }) => ({
        startPosition: { x: rk(position.x), y: rk(position.y), z: rk(position.z) },
        endPosition: { x: rk(hitPosition?.x), y: rk(hitPosition?.y), z: rk(hitPosition?.z) },
        id,
      })),
      {
        x: rk(newPlayerPosition.x),
        y: rk(newPlayerPosition.y),
        z: rk(newPlayerPosition.z),
      },
    );
  }
}
