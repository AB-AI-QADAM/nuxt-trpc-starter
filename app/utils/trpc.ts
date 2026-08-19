import { createTRPCClient, httpBatchLink } from '@trpc/client'
import type { AppRouter } from '~~/server/trpc/routers/_app'

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      // Node's fetch cannot resolve a relative URL during SSR (no
      // window.location to resolve against), so an absolute URL is required
      // on the server — same issue already solved for `app/utils/auth-client.ts`.
      // In the browser this stays relative.
      url: import.meta.server ? `${process.env.BETTER_AUTH_URL}/api/trpc` : '/api/trpc',
      // `credentials: 'include'` only matters in the browser (attaches the
      // cookie jar automatically). During SSR there is no cookie jar, so the
      // incoming request's cookie header must be forwarded explicitly for
      // the Better Auth session to reach protected procedures — same fix as
      // `app/utils/auth-client.ts`.
      fetch: (input, init) => fetch(input, {
        ...init,
        credentials: 'include',
        headers: {
          ...init?.headers,
          ...(import.meta.server ? useRequestHeaders(['cookie']) : {})
        }
      })
    })
  ]
})
