<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="elevation-12 pa-4">
          <v-card-title class="text-h5 text-center mb-4">
            Sign In
          </v-card-title>
          <v-form @submit.prevent="handleSubmit">
            <v-card-text>
              <v-text-field
                v-model="email"
                label="Email"
                prepend-icon="mdi-email"
                type="email"
                required
                :error-messages="emailErrors"
              />
              <v-text-field
                v-model="password"
                label="Password"
                prepend-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                required
                :error-messages="passwordErrors"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                type="submit"
                block
                :loading="loading"
              >
                Sign In
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/helpers/fetch'

const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const emailErrors = ref('')
const passwordErrors = ref('')

const handleSubmit = async () => {
  emailErrors.value = ''
  passwordErrors.value = ''

  if (!email.value) {
    emailErrors.value = 'Email is required'
    return
  }
  if (!password.value) {
    passwordErrors.value = 'Password is required'
    return
  }

  try {
    loading.value = true
    const response = await authService.login(email.value, password.value)
    localStorage.setItem('token', response.body.token)
    router.push('/dashboard')
  } catch (error: any) {
    console.error('Login failed:', error)
    if (error.response?.status === 404) {
      emailErrors.value = 'User not found'
    } else if (error.response?.status === 401) {
      passwordErrors.value = 'Invalid password'
    } else {
      emailErrors.value = 'Login failed. Please try again.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>

</style>