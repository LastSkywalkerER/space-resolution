import { BigNumberish, Contract, Signer, utils } from "ethers";
import { gameLogicAddress, rpcUrl } from "@/constants/constants";
import abi from "./abi.json";
import { JsonRpcProvider } from "@ethersproject/providers";
import { Vector3 } from "three";
import { type GameLogic as IGameLogic } from "./GameLogic.types";
import { BulletData } from "@/types/game.types";

const n = (b: BigNumberish) => parseFloat(utils.formatUnits(b, 0)) || 0;
const r = (n?: number) => Math.round(n || 0) || 0;

export class GameLogic {
  private contract = new Contract(gameLogicAddress, abi, new JsonRpcProvider(rpcUrl)) as IGameLogic;
  public bulletPrice = 0.0001;

  public async start(signer: Signer, ethersPosition: Vector3[]) {
    return await this.contract
      .connect(signer)
      .start(ethersPosition.map(({ x, y, z }) => ({ x, y, z })));
  }
  public async buyBullets(signer: Signer, amount: number) {
    return await this.contract
      .connect(signer)
      .buyBullets(amount, { value: utils.parseEther(`${this.bulletPrice * amount}`) });
  }
  public async getGameData(signer: Signer) {
    const data = await this.contract.connect(signer).getGameData();

    return {
      ethersPosition: data.ethersPosition.map(({ x, y, z }) => new Vector3(n(x), n(y), n(z))),
      currentPosition: new Vector3(
        n(data.currentPosition.x),
        n(data.currentPosition.y),
        n(data.currentPosition.z),
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
        startPosition: { x: r(position.x), y: r(position.y), z: r(position.z) },
        endPosition: { x: r(hitPosition?.x), y: r(hitPosition?.y), z: r(hitPosition?.z) },
        id,
      })),
      {
        x: r(newPlayerPosition.x),
        y: r(newPlayerPosition.y),
        z: r(newPlayerPosition.z),
      },
    );
  }
}
