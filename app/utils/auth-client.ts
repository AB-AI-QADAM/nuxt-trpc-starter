import { createAuthClient } from 'better-auth/vue'

export const authClient = createAuthClient({
  // better-fetch cannot resolve a relative URL during SSR (no window.location
  // to resolve against), so an absolute baseURL is required on the server.
  // In the browser this is omitted and requests stay relative.
  baseURL: import.meta.server ? process.env.BETTER_AUTH_URL : undefined
})
export const { signIn, signUp, signOut, useSession } = authClient
