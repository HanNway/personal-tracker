<template>
<div class="auth-wapper">
  <div class="container">
    <div class="tabs">
      <div
        class="tab"
        :class="{ active: isSignIn }"
        @click="isSignIn = true"
      >
        LogIn
      </div>
      <div
        class="tab"
        :class="{ active: !isSignIn }"
        @click="isSignIn = false"
      >
        Sign Up
      </div>
    </div>

    <h2>{{ isSignIn ? "Sign In" : "Sign Up" }}</h2>

    <span v-if="!isSignIn">
      <RegisterForm/>
    </span>

    <span v-else>
      <LoginForm/>
    </span>

    <p class="message">
      {{ isSignIn ? "Don't have an account?" : "Already have an account?" }}
      <a href="#" @click.prevent="isSignIn = !isSignIn">
        {{ isSignIn ? "Sign Up" : "Sign In" }}
      </a>
    </p>
  </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { register } from "@/composables/useAuth.js"
import LoginForm from "@/components/LoginForm.vue";
import RegisterForm from "@/components/RegisterForm.vue";

const isSignIn = ref(true)
</script>

<style >
.auth-wapper{
  min-height: 100vh;
  background: linear-gradient(135deg, #fde8f7, #fdf2f6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: sans-serif;
}
.container {
  background: rgba(255, 255, 255, 0.15);
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 350px;
  margin: 0 auto;
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

.tabs {
  display: flex;
  margin-bottom: 20px;
}

.tab {
  flex: 1;
  padding: 10px;
  text-align: center;
  background: #eee;
  cursor: pointer;
}

.tab.active {
  background: #007bff;
  color: white;
}

form {
  display: flex;
  flex-direction: column;
}

input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

button {
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background: #0056b3;
}

.message {
  text-align: center;
  margin-top: 15px;
  font-size: 14px;
}

.message a {
  color: #007bff;
  text-decoration: none;
}

.message a:hover {
  text-decoration: underline;
}
</style>

