<template>
  <v-container>
    <h1>Edit Student: {{ formData?.name }}</h1>
    
    <v-form @submit.prevent="handleSubmit" v-model="isFormValid">
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.name"
            label="Name"
            required
            :loading="loading"
          ></v-text-field>
        </v-col>
        
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.email"
            label="Email"
            type="email"
            required
            :loading="loading"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.academic_registration"
            label="Academic Registration"
            required
            :loading="loading"
          ></v-text-field>
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.identification"
            label="Identification"
            required
            :loading="loading"
          ></v-text-field>
        </v-col>

        <v-col cols="12" class="d-flex gap-4">
          <v-btn
            type="submit"
            color="primary"
            :loading="loading"
            :disabled="!isFormValid"
          >
            Save Changes
          </v-btn>
          <v-btn
            color="error"
            variant="outlined"
            :disabled="loading"
            @click="router.push('/dashboard/students')"
          >
            Cancel
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/helpers/fetch'
import type { createStudentSchema } from '@/interfaces'

const route = useRoute()
const router = useRouter()
const formData = ref<createStudentSchema>({
  name: '',
  email: '',
  academic_registration: '',
  identification: ''
})
const loading = ref(false)
const isFormValid = ref(false)

const fetchStudent = async () => {
  try {
    const response = await authService.getUser(route.params.userId as string)
    formData.value = {
      name: response.body.profile?.name,
      email: response.body.email,
      academic_registration: response.body.profile?.academic_registration,
      identification: response.body.profile?.identification
    }
  } catch (error) {
    router.push('/dashboard/students')
  }
}

const handleSubmit = async () => {
  if (!formData.value) return
  try {
    loading.value = true
    await authService.updateStudent(route.params.userId as string, formData.value)
    router.push('/dashboard/students')
  } catch (error) {
    console.error('Error updating student:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchStudent()
})
</script>