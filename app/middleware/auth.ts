import { authClient } from '~/utils/auth-client'

export default defineNuxtRouteMiddleware(async () => {
  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined
    }
  })

  if (!session) {
    return navigateTo('/login')
  }
})
