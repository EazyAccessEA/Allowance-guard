/**
 * Hook-level integration tests for the EIP-5792 branch added to
 * `useBulkRevokeEnhanced`.
 *
 * These mocks stand in for wagmi hooks + `@wagmi/core`'s
 * `waitForCallsStatus`. They do NOT exercise a real wallet or chain —
 * a true testnet E2E against Coinbase Smart Wallet on Base Sepolia
 * needs a funded bot account, a persistent passkey, and a browser
 * driver that can sign; we've flagged that gap for a dedicated session.
 *
 * What this harness does cover:
 *   1. When `useCapabilities` reports EIP-5792 atomic-batch support on
 *      a chain AND ≥2 rows target it, the hook calls `sendCallsAsync`
 *      with the correctly encoded approve/setApprovalForAll calldata.
 *   2. The `revoke` fallback (sequential per-row) is invoked when the
 *      capability is absent.
 *   3. If `sendCallsAsync` rejects, the hook falls back to sequential
 *      rather than aborting the whole operation.
 *   4. `batchedChains` / `batchIds` in the result reflect reality.
 */

// jsdom (used by this project's jest env) ships without TextEncoder /
// TextDecoder. viem's encoding modules need them at import time — wire
// them from Node's util before the viem import lands below.
import { TextEncoder, TextDecoder } from 'util'
const g = globalThis as unknown as {
  TextEncoder: typeof TextEncoder
  TextDecoder: typeof TextDecoder
}
g.TextEncoder = g.TextEncoder ?? TextEncoder
g.TextDecoder = g.TextDecoder ?? TextDecoder

import { renderHook, act } from '@testing-library/react'
import { encodeFunctionData } from 'viem'
import { ERC20_ABI, ERC721_ABI } from '@/lib/abi'

// ---- Mocks --------------------------------------------------------------

const mockRevoke = jest.fn<Promise<string>, [unknown]>()
const mockSendCallsAsync = jest.fn()
const mockSwitchChainAsync = jest.fn()
const mockWaitForCallsStatus = jest.fn()
const mockCapabilities: { current: Record<string, unknown> | undefined } = {
  current: undefined,
}

jest.mock('@/hooks/useRevoke', () => ({
  useRevoke: () => ({ revoke: mockRevoke }),
}))

jest.mock('wagmi', () => ({
  useAccount: () => ({ address: '0x1111111111111111111111111111111111111111' }),
  useCapabilities: () => ({ data: mockCapabilities.current }),
  useConfig: () => ({ __mock: true }),
  useSendCalls: () => ({ sendCallsAsync: mockSendCallsAsync }),
  useSwitchChain: () => ({ switchChainAsync: mockSwitchChainAsync }),
}))

jest.mock('@wagmi/core', () => ({
  waitForCallsStatus: (...args: unknown[]) => mockWaitForCallsStatus(...args),
}))

// Import after mocks so the hook picks up stubbed modules.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { useBulkRevokeEnhanced } = require('@/hooks/useBulkRevokeEnhanced')

// ---- Fixtures -----------------------------------------------------------

const WALLET = '0x1111111111111111111111111111111111111111'
const TOKEN_A = '0xaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
const TOKEN_B = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
const SPENDER_A = '0xcccccccccccccccccccccccccccccccccccccccc'
const SPENDER_B = '0xdddddddddddddddddddddddddddddddddddddddd'

function erc20Row(token: string, spender: string, chainId = 8453) {
  return {
    chain_id: chainId,
    token_address: token,
    spender_address: spender,
    standard: 'ERC20',
    allowance_type: 'per-token',
    amount: '1000000',
    is_unlimited: false,
    last_seen_block: '0',
    risk_score: 10,
    risk_flags: [],
  }
}

function erc721Row(token: string, spender: string, chainId = 8453) {
  return {
    ...erc20Row(token, spender, chainId),
    standard: 'ERC721',
    allowance_type: 'all-assets',
  }
}

function capabilitiesSupportedOn(chainIdHex: string) {
  return {
    [chainIdHex]: { atomic: { status: 'supported' } },
  }
}

// ---- Harness ------------------------------------------------------------

beforeEach(() => {
  mockRevoke.mockReset()
  mockSendCallsAsync.mockReset()
  mockSwitchChainAsync.mockReset().mockResolvedValue(undefined)
  mockWaitForCallsStatus.mockReset()
  mockCapabilities.current = undefined

  // Default: all fetch calls (audit log + receipts) succeed silently.
  // The hook only checks that fetch resolves — it doesn't read the body —
  // so a stub with a no-op json() is sufficient and avoids jsdom's
  // missing Response global.
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: async () => ({}),
  } as unknown as Response)
})

afterAll(() => {
  // Restore fetch for other suites.
  // @ts-expect-error — jest's fetch mock cleanup
  delete global.fetch
})

// ---- Tests --------------------------------------------------------------

describe('useBulkRevokeEnhanced — EIP-5792 branch', () => {
  it('sends one atomic batch per chain when the wallet supports EIP-5792', async () => {
    mockCapabilities.current = capabilitiesSupportedOn('0x2105') // Base (8453)
    mockSendCallsAsync.mockResolvedValue({ id: '0xbatch-1' })
    mockWaitForCallsStatus.mockResolvedValue({
      status: 'success',
      receipts: [
        { transactionHash: '0xabc1', status: 'success' },
        { transactionHash: '0xabc2', status: 'success' },
      ],
    })

    const { result } = renderHook(() => useBulkRevokeEnhanced(WALLET))

    let finalResult: Awaited<ReturnType<typeof result.current.revokeMany>> | undefined
    await act(async () => {
      finalResult = await result.current.revokeMany([
        erc20Row(TOKEN_A, SPENDER_A),
        erc721Row(TOKEN_B, SPENDER_B),
      ])
    })

    // sendCallsAsync invoked exactly once with the two encoded calls.
    expect(mockSendCallsAsync).toHaveBeenCalledTimes(1)
    const sendArgs = mockSendCallsAsync.mock.calls[0][0] as {
      calls: Array<{ to: string; data: string }>
      chainId: number
      account: string
    }
    expect(sendArgs.chainId).toBe(8453)
    expect(sendArgs.account.toLowerCase()).toBe(WALLET)
    expect(sendArgs.calls).toHaveLength(2)

    // Call 0 → ERC20 approve(spender, 0)
    expect(sendArgs.calls[0].to.toLowerCase()).toBe(TOKEN_A)
    expect(sendArgs.calls[0].data).toBe(
      encodeFunctionData({
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [SPENDER_A as `0x${string}`, BigInt(0)],
      }),
    )

    // Call 1 → ERC721 setApprovalForAll(spender, false)
    expect(sendArgs.calls[1].to.toLowerCase()).toBe(TOKEN_B)
    expect(sendArgs.calls[1].data).toBe(
      encodeFunctionData({
        abi: ERC721_ABI,
        functionName: 'setApprovalForAll',
        args: [SPENDER_B as `0x${string}`, false],
      }),
    )

    // waitForCallsStatus polled with the batch id.
    expect(mockWaitForCallsStatus).toHaveBeenCalledWith(
      expect.objectContaining({ __mock: true }),
      expect.objectContaining({ id: '0xbatch-1' }),
    )

    // Sequential path untouched.
    expect(mockRevoke).not.toHaveBeenCalled()

    expect(finalResult).toBeDefined()
    expect(finalResult!.success).toBe(2)
    expect(finalResult!.failed).toBe(0)
    expect(finalResult!.batchedChains).toEqual([8453])
    expect(finalResult!.batchIds).toEqual(['0xbatch-1'])
    expect(finalResult!.totalTransactions).toBe(1)
  })

  it('uses sequential revokes when the wallet has no EIP-5792 capability', async () => {
    mockCapabilities.current = undefined
    mockRevoke.mockResolvedValue('0xseq-tx-hash')

    const { result } = renderHook(() => useBulkRevokeEnhanced(WALLET))

    let finalResult: Awaited<ReturnType<typeof result.current.revokeMany>> | undefined
    await act(async () => {
      finalResult = await result.current.revokeMany([
        erc20Row(TOKEN_A, SPENDER_A),
        erc20Row(TOKEN_B, SPENDER_B),
      ])
    })

    expect(mockSendCallsAsync).not.toHaveBeenCalled()
    expect(mockRevoke).toHaveBeenCalledTimes(2)
    expect(finalResult!.batchedChains).toEqual([])
    expect(finalResult!.batchIds).toEqual([])
    expect(finalResult!.success).toBe(2)
  }, 10_000)

  it('falls back to sequential if sendCallsAsync throws', async () => {
    mockCapabilities.current = capabilitiesSupportedOn('0x2105')
    mockSendCallsAsync.mockRejectedValue(new Error('user rejected batch'))
    mockRevoke.mockResolvedValue('0xfallback-hash')

    const { result } = renderHook(() => useBulkRevokeEnhanced(WALLET))

    let finalResult: Awaited<ReturnType<typeof result.current.revokeMany>> | undefined
    await act(async () => {
      finalResult = await result.current.revokeMany([
        erc20Row(TOKEN_A, SPENDER_A),
        erc20Row(TOKEN_B, SPENDER_B),
      ])
    })

    // Tried batch, then fell back to sequential for the same 2 rows.
    expect(mockSendCallsAsync).toHaveBeenCalledTimes(1)
    expect(mockRevoke).toHaveBeenCalledTimes(2)
    expect(finalResult!.batchedChains).toEqual([])
    expect(finalResult!.success).toBe(2)
  }, 10_000)

  it('does not batch a single-row chain group (threshold N ≥ 2)', async () => {
    mockCapabilities.current = capabilitiesSupportedOn('0x2105')
    mockRevoke.mockResolvedValue('0xseq-tx-hash')

    const { result } = renderHook(() => useBulkRevokeEnhanced(WALLET))

    await act(async () => {
      await result.current.revokeMany([erc20Row(TOKEN_A, SPENDER_A)])
    })

    expect(mockSendCallsAsync).not.toHaveBeenCalled()
    expect(mockRevoke).toHaveBeenCalledTimes(1)
  })

  it('batches each supporting chain independently', async () => {
    // Capability for Base (8453) but not Ethereum (1).
    mockCapabilities.current = capabilitiesSupportedOn('0x2105')
    mockSendCallsAsync.mockResolvedValue({ id: '0xbatch-base' })
    mockWaitForCallsStatus.mockResolvedValue({
      status: 'success',
      receipts: [
        { transactionHash: '0xa', status: 'success' },
        { transactionHash: '0xb', status: 'success' },
      ],
    })
    mockRevoke.mockResolvedValue('0xseq-mainnet')

    const { result } = renderHook(() => useBulkRevokeEnhanced(WALLET))

    let finalResult: Awaited<ReturnType<typeof result.current.revokeMany>> | undefined
    await act(async () => {
      finalResult = await result.current.revokeMany([
        erc20Row(TOKEN_A, SPENDER_A, 8453),
        erc20Row(TOKEN_B, SPENDER_B, 8453),
        erc20Row(TOKEN_A, SPENDER_A, 1),
        erc20Row(TOKEN_B, SPENDER_B, 1),
      ])
    })

    expect(mockSendCallsAsync).toHaveBeenCalledTimes(1)
    expect(mockRevoke).toHaveBeenCalledTimes(2) // mainnet rows
    expect(finalResult!.batchedChains).toEqual([8453])
    expect(finalResult!.batchIds).toEqual(['0xbatch-base'])
  }, 10_000)
})
