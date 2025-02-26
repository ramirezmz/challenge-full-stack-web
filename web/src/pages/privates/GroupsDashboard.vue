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
          <th>Group Code</th>
          <th>Course</th>
          <th>Start Course</th>
          <th>Students</th>
          <!-- <th>Options</th> -->
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in groups" :key="group.id">
          <td>{{ group.code || 'N/A' }}</td>
          <td>{{ group.course.name || 'N/A' }}</td>
          <td>{{ group.startDate || 'N/A' }}</td>
          <td>{{ group?.registrations?.length || 0 }}</td>
          <!-- <td>
            <v-icon
              class="mr-2"
              @click="router.push(`groups/${group.id}`)"
            >
              mdi-pencil
            </v-icon>
          </td> -->
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { authService } from '@/helpers/fetch'
import type { Group } from '@/interfaces'
import { debounce } from 'lodash'

const search = ref('')
const groups = ref<Group[]>([])

const fetchGroupsBySearch = async (searchTerm?: string) => {
  try {
    const response = await authService.listAllGroups({
      search: searchTerm
    })
    groups.value = response.body
  } catch (error) {
    console.error('Error fetching group:', error)
  }
}

const debouncedSearch = debounce(async (searchTerm: string) => {
  await fetchGroupsBySearch(searchTerm)
}, 500)

const handleSearch = async () => {
  await debouncedSearch(search.value)
}

const fetchGroups = async () => {
  try {
    const response = await authService.listAllGroups()
    groups.value = response.body
  } catch (error) {
    console.error('Error fetching groups:', error)
  }
}

onMounted(() => {
  fetchGroups()
})
</script>