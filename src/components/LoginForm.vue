<script setup>
import { ref } from 'vue'
import { login } from "../composables/useAuth.js"

const email = ref("")
const password = ref("")

const {error,loading, handleSubmit} = login(email,password)
</script>

<template>
    <p v-if="error">{{error}}</p>
    <form @submit.prevent="handleSubmit">
    

      <input
        name="email"
        type="email"
        v-model="email"
        placeholder="Email"
      />

      <input
        name="password"
        type="password"
        v-model="password"
        placeholder="Password"
      />

      <button type="submit" :disabled="loading">
        {{loading ? 'Loading...' :'Login' }}
      </button>
    </form>
</template>