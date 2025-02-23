<template>
  <v-dialog v-model="dialog" max-width="400px">
    <v-card>
      <v-card-title class="text-h5 pa-4">
        Confirm Deletion
      </v-card-title>
      <v-card-text>
        Are you sure you want to delete this student? This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="dialog = false"
        >
          Cancel
        </v-btn>
        <v-btn
          color="error"
          :loading="loading"
          @click="handleConfirm"
        >
          Delete
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  userId: string
}>()

const emit = defineEmits<{
  'confirm': [id: string]
}>()

const dialog = ref(false)
const loading = ref(false)

const handleConfirm = async () => {
  try {
    loading.value = true
    await emit('confirm', props.userId)
    dialog.value = false
  } finally {
    loading.value = false
  }
}

const open = () => {
  dialog.value = true
}

defineExpose({ open })
</script>