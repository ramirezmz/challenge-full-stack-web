<template>
  <v-container>
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          @input="handleSearch"
          clearable
        />
      </v-col>
      <v-col cols="12" sm="6" md="4" class="text-right">
        <CreateStudentDialog
          @submit="handleCreateStudent"
        />
      </v-col>
    </v-row>
    <v-table>
      <thead>
        <tr>
          <th>Academic Registration</th>
          <th>Name</th>
          <th>CPF</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.profile?.academic_registration || 'N/A' }}</td>
          <td>{{ user.profile?.name || 'N/A' }}</td>
          <td>{{ user.profile?.identification || 'N/A' }}</td>
          <td>
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              color="primary"
              @click="handleEdit(user.id)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="() => handleDelete(user.id)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
    <DeleteConfirmationDialog
      ref="deleteDialog"
      :user-id="selectedUserId"
      @confirm="confirmDelete"
    />
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { authService } from '@/helpers/fetch'
import type { User } from '@/interfaces'
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog.vue'
import { useRouter } from 'vue-router'
import { debounce } from 'lodash'

const search = ref('')
const users = ref<User[]>([])
const deleteDialog = ref<InstanceType<typeof DeleteConfirmationDialog> | null>(null)
const selectedUserId = ref('')
const router = useRouter()

const handleCreateStudent = async (studentData: any) => {
  try {
    console.log('Creating student:', studentData)
    await authService.createUser(studentData)
    await fetchUsers()
  } catch (error) {
    console.error('Error creating student:', error)
  }
}

const fetchUsersBySearch = async (searchTerm?: string) => {
  try {
    const response = await authService.listAll({
      role:'student',
      search: searchTerm
    })
    users.value = response.body
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const debouncedSearch = debounce(async (searchTerm: string) => {
  await fetchUsersBySearch(searchTerm)
}, 500)

const handleSearch = async () => {
  await debouncedSearch(search.value)
}

const fetchUsers = async () => {
  try {
    const response = await authService.listAll({
      role: 'student'
    })
    users.value = response.body
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

const handleDelete = (userId: string) => {
  selectedUserId.value = userId
  deleteDialog.value?.open()
}

const confirmDelete = async (userId: string) => {
  try {
    await authService.deleteUser(userId)
    await fetchUsers()
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

const handleEdit = (userId: string) => {
  router.push(`/dashboard/students/${userId}`)
}

onMounted(() => {
  fetchUsers()
})
</script>