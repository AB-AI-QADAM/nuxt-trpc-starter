// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/test-utils',
    '@nuxt/scripts',
    '@nuxt/image',
    '@nuxt/hints',
    'nuxt-zod'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    '/': { prerender: true }
  },

  // Required so `useRequestHeaders()` keeps resolving the current request
  // when called from inside the async link chain of `@trpc/client`'s
  // `httpBatchLink` (its batching defers the actual fetch to a microtask,
  // which drops Nuxt's request context without this flag) — needed to
  // forward the Better Auth session cookie to protected tRPC procedures
  // during SSR (see `app/utils/trpc.ts`).
  experimental: {
    asyncContext: true
  },

  compatibilityDate: '2026-06-30',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})