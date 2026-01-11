import { ref, computed, watch, onUnmounted } from "vue"
import { db } from "@/firebase/config"
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "firebase/firestore"

export const useExpenses = (user, totalIncome) => {
  const expenses = ref([])
  const loading = ref(true)
  const error = ref(null)
  let unsubscribe = null

  // Computed values
  const totalExpense = computed(() => {
    return expenses.value.reduce((sum, expense) => {
      return sum + (Number(expense.amount) || 0)
    }, 0)
  })

  const balance = computed(() => {
    return totalIncome.value - totalExpense.value
  })

  const expenseCount = computed(() => expenses.value.length)

  // Initialize real-time listener for expenses
  const initExpensesListener = () => {
    if (!user || !user.value) {
      resetExpenses()
      return () => {}
    }

    const userId = user.value.uid
    const expensesRef = collection(db, "users", userId, "expenses")
    const q = query(expensesRef, orderBy("createdAt", "desc"))

    loading.value = true
    error.value = null

    unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        expenses.value = snapshot.docs.map((doc) => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
          }
        })
        loading.value = false
        error.value = null
        console.log('Expenses updated:', expenses.value.length, 'items')
      },
      (err) => {
        console.error('Expenses listener error:', err)
        error.value = err.message
        loading.value = false
        expenses.value = []
      }
    )

    return unsubscribe
  }

  // Reset expenses state
  const resetExpenses = () => {
    expenses.value = []
    loading.value = false
    error.value = null
  }

  // Add new expense - FIXED VERSION
  const addExpense = async (expenseData) => {
    console.log('Adding expense with data:', expenseData)
    
    if (!user || !user.value) {
      throw new Error("User not authenticated")
    }

    loading.value = true
    error.value = null

    try {
      const userId = user.value.uid
      const amountNum = Number(expenseData.amount)

      // Validation
      if (isNaN(amountNum)) {
        throw new Error("Please enter a valid number")
      }
      if (amountNum <= 0) {
        throw new Error("Amount must be greater than 0")
      }
      if (amountNum < 100) {
        throw new Error("Minimum expense is 100 MMK")
      }
      
      // Check balance
      const currentBalance = totalIncome.value - totalExpense.value
      if (amountNum > currentBalance) {
        throw new Error(`Insufficient balance. Available: ${currentBalance.toLocaleString()} MMK`)
      }

      // Prepare expense data with correct field names
      const expenseWithMetadata = {
        amount: amountNum,
        note: expenseData.note || '',
        category: expenseData.category || 'other',
        payMethod: expenseData.payMethod || 'cash',
        userId: userId,
        createdAt: serverTimestamp(),
      }

      console.log('Saving expense to Firestore:', expenseWithMetadata)

      // Save to Firestore
      const expensesRef = collection(db, "users", userId, "expenses")
      const docRef = await addDoc(expensesRef, expenseWithMetadata)

      console.log('Expense added with ID:', docRef.id)
      return { 
        id: docRef.id, 
        ...expenseData,
        createdAt: new Date()
      }
    } catch (err) {
      console.error('Error adding expense:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete expense
  const deleteExpense = async (expenseId) => {
    if (!user || !user.value) {
      throw new Error("User not authenticated")
    }

    loading.value = true
    error.value = null

    try {
      const userId = user.value.uid
      await deleteDoc(doc(db, "users", userId, "expenses", expenseId))
      console.log('Expense deleted:', expenseId)
    } catch (err) {
      console.error('Error deleting expense:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Get expense percentage of income
  const getExpensePercentage = () => {
    if (totalIncome.value === 0) return 0
    return Math.min(100, Math.round((totalExpense.value / totalIncome.value) * 100))
  }

  // Cleanup listener
  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
      console.log('Expenses listener cleaned up')
    }
  }

  // Watch for user changes
  watch(
    () => user?.value,
    (newUser) => {
      cleanup()
      if (newUser) {
        console.log('User changed, re-initializing expenses listener')
        initExpensesListener()
      } else {
        resetExpenses()
      }
    },
    { immediate: true }
  )

  // Cleanup on unmount
  onUnmounted(() => {
    cleanup()
  })

  return {
    // State
    expenses,
    loading,
    error,
    
    // Computed
    totalExpense,
    balance,
    expenseCount,
    
    // Actions
    addExpense,
    deleteExpense,
    
    // Utility
    getExpensePercentage,
    cleanup
  }
}