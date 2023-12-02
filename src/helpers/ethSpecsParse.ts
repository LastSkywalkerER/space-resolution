import { BigNumberish, utils } from "ethers/lib/ethers";

/**
 * SPECS_MULTIPLIER
 */
export const k = 100;

/**
 * Parse specs from contracts to game format with SPECS_MULTIPLIER
 * @param b - spec from contract
 * @returns - readable in web spec
 */
export const nk = (b: BigNumberish) => parseFloat(utils.formatUnits(b, 0)) / k || 0;

/**
 * Parse specs from game to contracts format with SPECS_MULTIPLIER
 * @param n: spec from game
 * @returns - integer for contract
 */
export const rk = (n?: number) => Math.round(n || 0) * k || 0;

/**
 * Parse specs from contracts to game format without SPECS_MULTIPLIER
 * @param b - spec from contract
 * @returns - readable in web spec
 */
export const n = (b: BigNumberish) => parseFloat(utils.formatUnits(b, 0)) || 0;

/**
 * Parse specs from game to contracts format without SPECS_MULTIPLIER
 * @param n: spec from game
 * @returns - integer for contract
 */
export const r = (n?: number) => Math.round(n || 0) || 0;
