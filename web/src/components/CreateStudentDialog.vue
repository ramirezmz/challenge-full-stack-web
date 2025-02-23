<template>
  <v-dialog v-model="modelValue" width="600px">
    <template v-slot:activator="{ props: activatorProps }">
        <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        v-bind="activatorProps"
          >
        Register Student
        </v-btn>
      </template>
    <v-card>
      <v-card-title class="text-h5 pa-4">
        User Profile
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="handleSubmit">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.name"
                  label="Name*"
                  required
                  :error-messages="errors.name"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.email"
                  label="Email*"
                  type="email"
                  required
                  :error-messages="errors.email"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.academic_registration"
                  label="Academic Registration*"
                  required
                  :error-messages="errors.academic_registration"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="formData.identification"
                  label="Identification*"
                  required
                  :error-messages="errors.identification"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="closeDialog"
        >
          Close
        </v-btn>
        <v-btn
          color="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const modelValue = ref(false)
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'submit': [data: typeof formData.value]
}>()

const loading = ref(false)

const formData = ref({
  name: '',
  email: '',
  academic_registration: '',
  identification: ''
})

const errors = ref({
  name: '',
  email: '',
  academic_registration: '',
  identification: ''
})

const closeDialog = () => {
  modelValue.value = false
  emit('update:modelValue', false)
  resetForm()
}

const resetForm = () => {
  formData.value = {
    name: '',
    email: '',
    academic_registration: '',
    identification: ''
  }
  errors.value = {
    name: '',
    email: '',
    academic_registration: '',
    identification: ''
  }
}

const handleSubmit = async () => {
  errors.value = {
    name: '',
    email: '',
    academic_registration: '',
    identification: ''
  }

  let hasError = false
  if (!formData.value.name) {
    errors.value.name = 'Name is required'
    hasError = true
  }
  if (!formData.value.email) {
    errors.value.email = 'Email is required'
    hasError = true
  }
  if (!formData.value.academic_registration) {
    errors.value.academic_registration = 'Academic Registration is required'
    hasError = true
  }
  if (!formData.value.identification) {
    errors.value.identification = 'Identification is required'
    hasError = true
  }

  if (hasError) return

  try {
    loading.value = true
    emit('submit', formData.value)
    closeDialog()
  } finally {
    loading.value = false
  }
}
</script>