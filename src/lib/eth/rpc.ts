type JsonRpcReq = { jsonrpc: '2.0'; id: number; method: string; params: unknown[] }
type JsonRpcRes<T = unknown> = { jsonrpc: '2.0'; id: number; result?: T; error?: { code: number; message: string } }

export async function jsonRpc<T = unknown>(rpcUrl: string, method: string, params: unknown[], id = 1): Promise<T> {
  const body: JsonRpcReq = { jsonrpc: '2.0', id, method, params }
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store'
  })
  const data = (await res.json()) as JsonRpcRes<T>
  if (!res.ok || data.error) throw new Error(data.error?.message || `RPC ${method} failed`)
  return data.result as T
}
