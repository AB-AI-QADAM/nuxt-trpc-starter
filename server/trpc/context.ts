import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { auth } from '../utils/auth'

export async function createContext({ req }: FetchCreateContextFnOptions) {
  const session = await auth.api.getSession({ headers: req.headers })
  return { user: session?.user }
}

export type Context = Awaited<ReturnType<typeof createContext>>
