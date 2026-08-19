<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { authClient } from '~/utils/auth-client'

const mode = ref<'sign-in' | 'sign-up'>('sign-in')
const loading = ref(false)
const errorMessage = ref('')

const schema = computed(() => {
  return mode.value === 'sign-up'
    ? z.object({
        name: z.string().min(1, 'Required'),
        email: z.email('Invalid email'),
        password: z.string().min(8, 'Must be at least 8 characters')
      })
    : z.object({
        email: z.email('Invalid email'),
        password: z.string().min(8, 'Must be at least 8 characters')
      })
})

type Schema = z.output<typeof schema.value>

const state = reactive({
  name: '',
  email: '',
  password: ''
})

function toggleMode() {
  mode.value = mode.value === 'sign-in' ? 'sign-up' : 'sign-in'
  errorMessage.value = ''
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  loading.value = true
  errorMessage.value = ''

  const { email, password } = event.data

  const { error } = mode.value === 'sign-up'
    ? await authClient.signUp.email({
        name: state.name,
        email,
        password
      })
    : await authClient.signIn.email({
        email,
        password
      })

  loading.value = false

  if (error) {
    errorMessage.value = error.message ?? 'Something went wrong'
    return
  }

  await navigateTo('/dashboard')
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
    <UCard class="w-full max-w-sm">
      <template #header>
        <div class="flex flex-col items-center gap-2 text-center">
          <NuxtLink to="/">
            <AppLogo class="w-auto h-6 shrink-0" />
          </NuxtLink>
          <h1 class="text-lg font-semibold">
            {{ mode === 'sign-up' ? 'Create an account' : 'Sign in' }}
          </h1>
        </div>
      </template>

      <UAlert
        v-if="errorMessage"
        color="error"
        variant="subtle"
        :title="errorMessage"
        class="mb-4"
      />

      <UForm
        :schema="schema"
        :state="state"
        class="flex flex-col gap-4"
        @submit="onSubmit"
      >
        <UFormField
          v-if="mode === 'sign-up'"
          label="Name"
          name="name"
        >
          <UInput
            v-model="state.name"
            class="w-full"
            placeholder="Jane Doe"
          />
        </UFormField>

        <UFormField
          label="Email"
          name="email"
        >
          <UInput
            v-model="state.email"
            type="email"
            class="w-full"
            placeholder="you@example.com"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
        >
          <UInput
            v-model="state.password"
            type="password"
            class="w-full"
            placeholder="********"
          />
        </UFormField>

        <UButton
          type="submit"
          block
          :loading="loading"
        >
          {{ mode === 'sign-up' ? 'Sign up' : 'Sign in' }}
        </UButton>
      </UForm>

      <template #footer>
        <div class="text-sm text-center text-muted">
          <template v-if="mode === 'sign-up'">
            Already have an account?
          </template>
          <template v-else>
            No account yet?
          </template>
          <UButton
            variant="link"
            color="neutral"
            class="px-1"
            @click="toggleMode"
          >
            {{ mode === 'sign-up' ? 'Sign in' : 'Sign up' }}
          </UButton>
        </div>
      </template>
    </UCard>
  </div>
</template>
