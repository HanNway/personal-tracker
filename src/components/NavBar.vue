<script setup>
import { ref } from 'vue';
import {auth} from "@/firebase/config.js";
import router from "@/router/index.js";
import { logout }  from "@/composables/useAuth.js";

const user = auth.currentUser

const handleLogout = () => {
    router.push("/auth");
}

</script>

<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-logo desktop-only">
        <span class="logo-icon">💰</span>
        <span class="logo-text">MyWallet</span>
      </div>

      <ul class="nav-menu">
        <li>
          <a href="#">
            <i class="fa-solid fa-house " style="color: #63E6BE;"></i>
            <span class="text">
              <router-link to = "/"> Home </router-link>
            </span>
          </a>
        </li>
        <li>
          <a href="#">
            <i class="fa-solid fa-file-circle-check" style="color: #63E6BE;"></i>
            <span class="text">
              <router-link to = "/history"> History </router-link>
            </span>
          </a>
        </li>
        <li >
          <a href="#">
            <span class="icon">💳</span>
            <span class="text">
              <router-link to = "/account"> Account</router-link>
            </span>
          </a>
        </li>
      </ul>

      <div class="nav-user">
        <div class="profile-preview">
         <i class="fa-solid fa-circle-user fa-xl" style="color: #74C0FC;"></i>
          <span class="username desktop-only">{{ user.displayName }}</span>
        </div>
        <button @click="handleLogout" class="logout-btn">
          <span class="icon">🚪</span>
          <span class="text desktop-only">Logout</span>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background-color: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0.75rem 1.5rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Logo Section */
.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 30px;
  color: #1e293b;
}

/* Menu Items */
.nav-menu {
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;
  font-size: 20px;
}

.nav-menu li a {
  text-decoration: none;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-menu li.active a {
  color: #4f46e5;
}

.nav-menu li:hover a {
  color: #790723;
  
}

/* User Section */
.nav-user {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  font-size: 15px;
}

.profile-preview {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}


.username {
  font-weight: 600;
  color: #334155;
}

.logout-btn {
  background: #fff1f2;
  border: 1px solid #ffe4e6;
  color: #e11d48;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #ffe4e6;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .navbar {
    position: fixed;
    bottom: 0;
    top: auto;
    width: 100%;
    padding: 0.5rem 0;
    border-top: 1px solid #e2e8f0;
    border-bottom: none;
  }

  .nav-container {
    justify-content: space-around;
  }

  .nav-menu {
    width: 100%;
    justify-content: space-around;
    gap: 0;
  }

  .nav-menu li a {
    flex-direction: column;
    font-size: 0.75rem;
    gap: 0.2rem;
  }

  .nav-menu li .icon {
    font-size: 1.5rem;
  }

  .nav-user {
    position: fixed;
    top: 1rem;
    right: 1.5rem;
    background: white;
    padding: 0.4rem;
    border-radius: 50%;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
}
</style>