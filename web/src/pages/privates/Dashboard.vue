<template>
  <v-layout>
    <v-navigation-drawer permanent>
      <v-list>
        <v-list-item
          prepend-icon="mdi-account-group"
          title="Students"
          :active="currentRoute === 'students'"
          @click="navigate('students')"
        />
        <v-list-item
          prepend-icon="mdi-account-cog"
          title="Admins"
          :active="currentRoute === 'admins'"
          @click="navigate('admins')"
        />
        <v-list-item
          prepend-icon="mdi-google-classroom"
          title="Groups"
          :active="currentRoute === 'groups'"
          @click="navigate('groups')"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>
  </v-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const currentRoute = ref('')

const navigate = (path: string) => {
  currentRoute.value = path
  router.push(`/dashboard/${path}`)
}

onMounted(() => {
  currentRoute.value = route.name as string
})
</script>