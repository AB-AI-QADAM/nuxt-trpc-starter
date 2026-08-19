<script setup lang="ts">
import { authClient } from '~/utils/auth-client'
import { trpc } from '~/utils/trpc'

definePageMeta({
  middleware: 'auth'
})

// `authClient.useSession(useFetch)` relies on Nuxt's automatic cookie
// forwarding, which only applies to relative request URLs. Because the
// client is configured with an absolute `baseURL` on the server (required
// for better-fetch to resolve requests during SSR), that path is used
// instead, forwarding the incoming request's cookie explicitly.
const { data: session } = await authClient.getSession({
  fetchOptions: {
    headers: import.meta.server ? useRequestHeaders(['cookie']) : undefined
  }
})

// tRPC examples: `health.ping` exercises the public query path, `user.me`
// exercises the auth-cookie-forwarding path (see `app/utils/trpc.ts`).
const { data: health } = await useAsyncData('health', () => trpc.health.ping.query())
const { data: me } = await useAsyncData('me', () => trpc.user.me.query())

async function handleSignOut() {
  await authClient.signOut()
  await navigateTo('/login')
}
</script>

<template>
  <UPageSection
    title="Dashboard"
    description="This page is only reachable with an active session."
  >
    <UCard class="max-w-sm">
      <p class="text-sm text-muted">
        Signed in as
      </p>
      <p class="font-semibold">
        {{ session?.user?.email }}
      </p>

      <UButton
        class="mt-4"
        color="neutral"
        variant="subtle"
        @click="handleSignOut"
      >
        Sign out
      </UButton>
    </UCard>

    <UCard class="max-w-sm mt-4">
      <p class="text-sm text-muted">
        tRPC health.ping (public)
      </p>
      <p class="font-semibold">
        ok: {{ health?.ok }}, ts: {{ health?.ts }}
      </p>
    </UCard>

    <UCard class="max-w-sm mt-4">
      <p class="text-sm text-muted">
        tRPC user.me (protected)
      </p>
      <p class="font-semibold">
        {{ me?.name }} &lt;{{ me?.email }}&gt;
      </p>
    </UCard>
  </UPageSection>
</template>
