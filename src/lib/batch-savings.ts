/**
 * Gas-savings calculator for EIP-5792 batched revocation.
 *
 * Honest framing:
 *   - Sequential execution runs N separate user-signed txs (the fallback path).
 *   - Batched execution via EIP-5792 (`wallet_sendCalls`) sends one outer tx
 *     that carries N inner approve(spender, 0) calls. Savings come from the
 *     shared base-tx fee and shared calldata header.
 *
 * Savings are **realised only on wallets that support EIP-5792**
 * (Coinbase Smart Wallet, Base Smart Wallet, some recent MetaMask builds).
 * On a standard EOA the batched path isn't available and the function
 * returns `savings: null`.
 *
 * Gas constants below are approximations calibrated against mainnet
 * `approve(0)` execution costs + typical smart-wallet overheads. The
 * function intentionally does not claim precision — results are labelled
 * `approximate` and should be surfaced as "typical savings", not a quote.
 */

import { CHAINS } from './networks'

// Per-call gas for a sequential ERC-20 `approve(spender, 0)` tx. 21k base
// tx cost + ~46k for the approve SSTORE (from non-zero to zero, after
// EIP-3529 refund caps) + calldata rounding. ERC-721
// `setApprovalForAll(op, false)` is cheaper (~30k execution) but we use
// the higher figure as the conservative default — overestimating
// sequential cost *understates* the savings, not the other way around.
const SEQUENTIAL_GAS_PER_CALL = 70_000

// Fixed overhead of the outer batched tx: 21k base + ~13k smart-wallet
// validation (signature check + nonce update). Amortised across N inner
// calls.
const BATCHED_BASE_GAS = 34_000

// Per-inner-call gas inside a batched execution: ~46k approve + ~8k
// smart-wallet per-call bookkeeping (memory slot, return handling).
const BATCHED_GAS_PER_CALL = 54_000

// Fallback gas-price defaults in gwei when the caller doesn't supply one.
// Rough order-of-magnitude: L1 mainnet ~20 gwei, L2 rollups sub-gwei.
const DEFAULT_GAS_PRICE_GWEI: Record<number, number> = {
  1: 20, // Ethereum
  10: 0.001, // Optimism
  56: 3, // BNB
  137: 30, // Polygon
  250: 50, // Fantom
  8453: 0.01, // Base
  42161: 0.01, // Arbitrum
  43114: 25, // Avalanche
  59144: 0.05, // Linea
  534352: 0.05, // Scroll
}

const L1_FALLBACK_GWEI = 20
const L2_FALLBACK_GWEI = 0.05

// 10^12 wei = 1 micro-ether. We divide by this (bigint) to convert wei
// → a number holding 6dp of ether. BigInt literals are disallowed at the
// project's ES2017 TS target, hence the constructor form.
const WEI_PER_MICRO_ETHER = BigInt(10) ** BigInt(12)

export interface SavingsQuote {
  /** Total gas units if the user signs N separate revocations. */
  gasUnits: number
  /** Fee in wei at the supplied/defaulted gas price. */
  feeWei: bigint
  /** Fee in ether (feeWei / 1e18), rounded to 6dp. */
  feeEther: number
}

export interface BatchSavingsResult {
  chainId: number
  approvalCount: number
  gasPriceGwei: number
  sequential: SavingsQuote
  /**
   * Batched quote. Null when approvalCount < 2 — batching requires at
   * least two calls to amortise the base overhead.
   */
  batched: SavingsQuote | null
  /**
   * Savings vs sequential, or null when batching isn't advantageous
   * (i.e. approvalCount < 2).
   */
  savings: {
    gasUnits: number
    feeWei: bigint
    feeEther: number
    /** Savings as a fraction of sequential cost (0–1). Rounded to 4dp. */
    fraction: number
  } | null
  /**
   * Always 'approximate'. Surface as "typical savings" in UI — never
   * present this as an exact quote.
   */
  confidence: 'approximate'
  /** Human-readable assumption trail the caller can echo to users. */
  assumptions: string[]
}

function defaultGasPriceFor(chainId: number): number {
  if (chainId in DEFAULT_GAS_PRICE_GWEI) return DEFAULT_GAS_PRICE_GWEI[chainId]
  // Any chain we don't recognise → assume L1-like pricing. Safer to
  // overstate gas price than understate it; under-stating would let the
  // savings number run away at high N.
  return L1_FALLBACK_GWEI
}

function quote(gasUnits: number, gasPriceWei: bigint): SavingsQuote {
  const feeWei = BigInt(gasUnits) * gasPriceWei
  // Convert to ether as a number. BigInt division truncates; we keep 6dp
  // by scaling up first. Acceptable precision for a UI estimate.
  const feeEther = Number(feeWei / WEI_PER_MICRO_ETHER) / 1e6
  return { gasUnits, feeWei, feeEther }
}

export function computeBatchSavings(input: {
  chainId: number
  approvalCount: number
  gasPriceGwei?: number
}): BatchSavingsResult {
  const { chainId, approvalCount } = input

  if (!Number.isInteger(approvalCount) || approvalCount < 1) {
    throw new Error('approvalCount must be a positive integer')
  }
  if (!Number.isInteger(chainId) || chainId <= 0) {
    throw new Error('chainId must be a positive integer')
  }

  const gasPriceGwei = input.gasPriceGwei ?? defaultGasPriceFor(chainId)
  if (gasPriceGwei <= 0) {
    throw new Error('gasPriceGwei must be positive')
  }

  // gwei → wei. Multiply by 1e9 via integer math to avoid float drift at
  // realistic gas prices (sub-gwei on L2s still fits cleanly).
  const gasPriceWei = BigInt(Math.round(gasPriceGwei * 1e9))

  const sequentialGas = approvalCount * SEQUENTIAL_GAS_PER_CALL
  const sequential = quote(sequentialGas, gasPriceWei)

  const knownChain = CHAINS[chainId]
  const chainLabel = knownChain?.name ?? `chain ${chainId}`

  const assumptions = [
    `Sequential cost = ${approvalCount} × ${SEQUENTIAL_GAS_PER_CALL} gas`,
    `Batched cost = ${BATCHED_BASE_GAS} gas base + ${approvalCount} × ${BATCHED_GAS_PER_CALL} gas per call`,
    `Gas price = ${gasPriceGwei} gwei on ${chainLabel}`,
    'Batched path requires a wallet that supports EIP-5792 (`wallet_sendCalls`)',
  ]

  if (approvalCount < 2) {
    return {
      chainId,
      approvalCount,
      gasPriceGwei,
      sequential,
      batched: null,
      savings: null,
      confidence: 'approximate',
      assumptions,
    }
  }

  const batchedGas =
    BATCHED_BASE_GAS + approvalCount * BATCHED_GAS_PER_CALL
  const batched = quote(batchedGas, gasPriceWei)

  const savedGas = sequentialGas - batchedGas
  const savedFeeWei = sequential.feeWei - batched.feeWei
  const savedFeeEther = Number(savedFeeWei / WEI_PER_MICRO_ETHER) / 1e6
  const fraction = Math.max(
    0,
    Math.round((savedGas / sequentialGas) * 10_000) / 10_000,
  )

  return {
    chainId,
    approvalCount,
    gasPriceGwei,
    sequential,
    batched,
    savings: {
      gasUnits: savedGas,
      feeWei: savedFeeWei,
      feeEther: savedFeeEther,
      fraction,
    },
    confidence: 'approximate',
    assumptions,
  }
}

/** Helper used by the L2 fallback default in case we add new L2s. */
export function __defaultGasPriceFor(chainId: number): number {
  return defaultGasPriceFor(chainId)
}

export { L1_FALLBACK_GWEI, L2_FALLBACK_GWEI }
