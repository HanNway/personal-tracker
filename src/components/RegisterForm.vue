<script setup>
import { ref } from 'vue'
import { register } from "../composables/useAuth.js"

const name = ref("")
const email = ref("")
const password = ref("")

const {error,loading, handleSubmit} = register(name,email,password)
</script>

<template>
<p v-if="error">{{error}}</p>
    <form @submit.prevent="handleSubmit">
      <input
        name="name"
        type="text"
        v-model="name"
        placeholder="Full Name"
      />

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
        required
      />

      <button type="submit" :disabled="loading">
        {{loading ? 'Loading...' :'Sign Up' }}
      </button>
    </form>
</template>