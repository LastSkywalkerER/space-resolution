import { rpcUrl } from "@/constants/constants";
import { BaseContract, Contract, ContractInterface, providers } from "ethers/lib/ethers";

export abstract class GameContract<T extends BaseContract> {
  protected contract;

  constructor({ address, abi }: { address: string; abi: ContractInterface }) {
    this.contract = new Contract(address, abi, new providers.JsonRpcProvider(rpcUrl)) as T;
  }
}
