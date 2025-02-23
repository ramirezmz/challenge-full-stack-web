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
    </v-row>
    <v-table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.email }}</td>
          <td>{{ user.profile?.name || 'N/A' }}</td>
          <td>{{ new Date(user.createdAt).toLocaleDateString() }}</td>
          <td>
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              color="primary"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { authService } from '@/helpers/fetch'
import type { User } from '@/interfaces'

const search = ref('')
const users = ref<User[]>([])

const handleSearch = () => {
  console.log('Searching for:', search.value)
}

const fetchUsers = async () => {
  try {
    const response = await authService.listAll({
      role: 'admin'
    })
    users.value = response.body
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}

onMounted(() => {
  fetchUsers()
})
</script>