import { ref, watch, onUnmounted } from 'vue'
import { db } from '@/firebase/config'
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'

export const useIncome = (user) => {
  const totalIncome = ref(0)
  const loading = ref(true)
  const error = ref(null)
  const lastUpdated = ref(null)
  let unsubscribe = null

  // Initialize real-time listener for income
  const initIncomeListener = () => {
    if (!user || !user.value) {
      resetIncome()
      return () => {}
    }

    const userId = user.value.uid
    const incomeDocRef = doc(db, 'users', userId, 'settings', 'income')
    
    unsubscribe = onSnapshot(
      incomeDocRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data()
          totalIncome.value = data.amount || 0
          lastUpdated.value = data.updatedAt?.toDate() || data.createdAt?.toDate() || new Date()
        } else {
          totalIncome.value = 0
          lastUpdated.value = null
        }
        loading.value = false
        error.value = null
      },
      (err) => {
        console.error('Income listener error:', err)
        error.value = err.message
        loading.value = false
        resetIncome()
      }
    )

    return unsubscribe
  }

  // Reset income state
  const resetIncome = () => {
    totalIncome.value = 0
    lastUpdated.value = null
    loading.value = false
  }

  // Set initial income
  const setInitialIncome = async (amount) => {
    if (!user || !user.value) {
      throw new Error('User not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      const userId = user.value.uid
      const amountNum = Number(amount)

      // Validation
      if (isNaN(amountNum)) {
        throw new Error('Please enter a valid number')
      }
      if (amountNum < 1000) {
        throw new Error('Minimum income is 1,000 MMK')
      }

      const incomeDocRef = doc(db, 'users', userId, 'settings', 'income')
      const now = new Date()

      await setDoc(incomeDocRef, {
        amount: amountNum,
        createdAt: now,
        updatedAt: now
      })

      console.log('Initial income set:', amountNum)
      return true
    } catch (err) {
      console.error('Error setting initial income:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Change income to new amount (replace, not add)
  const changeIncome = async (newAmount) => {
    if (!user || !user.value) {
      throw new Error('User not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      const userId = user.value.uid
      const amountNum = Number(newAmount)

      // Validation
      if (isNaN(amountNum)) {
        throw new Error('Please enter a valid number')
      }
      if (amountNum < 1000) {
        throw new Error('Minimum income is 1,000 MMK')
      }

      const incomeDocRef = doc(db, 'users', userId, 'settings', 'income')
      const now = new Date()

      // Get current income to show difference
      const currentDoc = await getDoc(incomeDocRef)
      const currentIncome = currentDoc.exists() ? currentDoc.data().amount || 0 : 0

      await setDoc(incomeDocRef, {
        amount: amountNum,
        updatedAt: now
      }, { merge: true })

      console.log('Income changed from', currentIncome, 'to', amountNum)
      return { 
        success: true, 
        oldAmount: currentIncome, 
        newAmount: amountNum,
        difference: amountNum - currentIncome
      }
    } catch (err) {
      console.error('Error changing income:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Add more income to existing amount
  const addMoreIncome = async (additionalAmount) => {
    if (!user || !user.value) {
      throw new Error('User not authenticated')
    }

    loading.value = true
    error.value = null

    try {
      const userId = user.value.uid
      const amountNum = Number(additionalAmount)

      // Validation
      if (isNaN(amountNum) || amountNum <= 0) {
        throw new Error('Please enter a valid amount')
      }

      const incomeDocRef = doc(db, 'users', userId, 'settings', 'income')
      const incomeDoc = await getDoc(incomeDocRef)

      if (incomeDoc.exists()) {
        const currentIncome = incomeDoc.data().amount || 0
        const newIncome = currentIncome + amountNum

        await updateDoc(incomeDocRef, {
          amount: newIncome,
          updatedAt: new Date()
        })

        console.log('Income added:', amountNum, 'Total:', newIncome)
        return newIncome
      } else {
        // If no income exists, create initial income
        return await setInitialIncome(amountNum)
      }
    } catch (err) {
      console.error('Error adding more income:', err)
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  // Check if user has income set
  const hasIncomeSet = () => {
    return totalIncome.value > 0 && !loading.value
  }

  // Cleanup listener
  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
      console.log('Income listener cleaned up')
    }
  }

  // Watch for user changes
  watch(
    () => user?.value,
    (newUser) => {
      cleanup()
      if (newUser) {
        console.log('User changed, re-initializing income listener')
        initIncomeListener()
      } else {
        resetIncome()
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
    totalIncome,
    loading,
    error,
    lastUpdated,
    
    // Actions
    setInitialIncome,
    changeIncome,  // NEW: Change income to new amount
    addMoreIncome,
    hasIncomeSet,
    
    // Utility
    cleanup
  }
}