import { createRouter, createWebHistory } from 'vue-router'
import { auth } from '../firebase/config'
import HomeView from '../views/HomeView.vue'
import AuthView from '../views/AuthView.vue'
import AddTransation from '../views/AddTransation.vue'
import HistoryView from '../views/HistoryView.vue'
import Accountview from '../views/Accountview.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    name: 'auth',
    component: AuthView,
  },
  {
    path: '/add-transaction',
    name: 'add-transaction',
    component: AddTransation,
  },
  {
    path: '/history',
    name: 'history',
    component: HistoryView,
  },
  {
    path: '/account',
    name: 'account',
    component: Accountview,
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {
  
  if (to.matched.some(record => record.meta.requiresAuth)) {
    
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe() 
      
      if (user) {
        next()
      } else {
        next('/auth')
      }
    })
  } else {
    next()
  }
})

export default router