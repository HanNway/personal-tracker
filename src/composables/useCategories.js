import { ref } from 'vue'

export const useCategories = () => {
  // Category data
  const categories = ref([
    { id: 'food', name: 'Food & Dining', emoji: '🍔', color: '#10B981' },
    { id: 'transport', name: 'Transport', emoji: '🚗', color: '#3B82F6' },
    { id: 'shopping', name: 'Shopping', emoji: '🛍️', color: '#8B5CF6' },
    { id: 'entertainment', name: 'Entertainment', emoji: '🎬', color: '#EC4899' },
    { id: 'bills', name: 'Bills', emoji: '📄', color: '#6366F1' },
    { id: 'health', name: 'Health', emoji: '🏥', color: '#EF4444' },
    { id: 'education', name: 'Education', emoji: '📚', color: '#F59E0B' },
    { id: 'other', name: 'Other', emoji: '📦', color: '#6B7280' }
  ])

  // Payment methods
  const paymentMethods = ref([
    { id: 'cash', name: 'Cash', emoji: '💵' },
    { id: 'kbz_pay', name: 'KBZ Pay', emoji: '📱' },
    { id: 'wave_money', name: 'Wave Money', emoji: '📱' },
    { id: 'bank', name: 'Bank', emoji: '🏦' },
    { id: 'card', name: 'Card', emoji: '💳' },
    { id: 'other', name: 'Other', emoji: '📦' }
  ])

  // Format currency (MMK)
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '0 MMK'
    return new Intl.NumberFormat('en-US').format(amount) + ' MMK'
  }

  // Format date
  const formatDate = (date) => {
    if (!date) return ''
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return ''
    }
  }

  // Format relative time
  const formatRelativeTime = (date) => {
    if (!date) return 'Never'
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      const now = new Date()
      const diffMs = now - dateObj
      const diffMins = Math.floor(diffMs / 60000)
      
      if (diffMins < 1) return 'Just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`
      return dateObj.toLocaleDateString()
    } catch (error) {
      return ''
    }
  }

  // Get category by ID
  const getCategoryById = (categoryId) => {
    return categories.value.find(cat => cat.id === categoryId) || 
           categories.value.find(cat => cat.id === 'other')
  }

  // Get category emoji
  const getCategoryEmoji = (categoryId) => {
    const category = getCategoryById(categoryId)
    return category ? category.emoji : '📦'
  }

  // Get category name
  const getCategoryName = (categoryId) => {
    const category = getCategoryById(categoryId)
    return category ? category.name : 'Other'
  }

  // Get category color
  const getCategoryColor = (categoryId) => {
    const category = getCategoryById(categoryId)
    return category ? category.color : '#6B7280'
  }

  // Get payment method by ID
  const getPaymentMethodById = (methodId) => {
    return paymentMethods.value.find(method => method.id === methodId) || 
           paymentMethods.value.find(method => method.id === 'other')
  }

  // Get payment method name
  const getPaymentMethodName = (methodId) => {
    const method = getPaymentMethodById(methodId)
    return method ? method.name : 'Other'
  }

  // Get payment method emoji
  const getPaymentMethodEmoji = (methodId) => {
    const method = getPaymentMethodById(methodId)
    return method ? method.emoji : '📦'
  }

  // Validate income amount
  const validateIncomeAmount = (amount) => {
    const amountNum = Number(amount)
    
    if (!amount && amount !== 0) {
      return 'Income amount is required'
    }
    
    if (isNaN(amountNum)) {
      return 'Please enter a valid number'
    }
    
    if (amountNum < 1000) {
      return 'Minimum income is 1,000 MMK'
    }
    
    if (amountNum > 1000000000) {
      return 'Income amount is too large'
    }
    
    return null
  }

  // Validate expense amount
  const validateExpenseAmount = (amount, availableBalance) => {
    const amountNum = Number(amount)
    
    if (!amount && amount !== 0) {
      return 'Expense amount is required'
    }
    
    if (isNaN(amountNum)) {
      return 'Please enter a valid number'
    }
    
    if (amountNum <= 0) {
      return 'Amount must be greater than 0'
    }
    
    if (amountNum < 100) {
      return 'Minimum expense is 100 MMK'
    }
    
    if (amountNum > availableBalance) {
      return `Amount exceeds available balance by ${formatCurrency(amountNum - availableBalance)}`
    }
    
    return null
  }

  // Get balance status
  const getBalanceStatus = (balance, totalIncome) => {
    if (balance < 0) {
      return {
        status: 'Over Budget',
        icon: '💸',
        class: 'negative',
        message: 'No funds available for expenses'
      }
    }
    
    if (balance < totalIncome * 0.2) {
      return {
        status: 'Low Balance',
        icon: '⚠️',
        class: 'warning',
        message: 'Balance is getting low'
      }
    }
    
    return {
      status: 'Healthy',
      icon: '✅',
      class: 'positive',
      message: 'You can spend up to ' + formatCurrency(balance)
    }
  }

  return {
    // Data
    categories,
    paymentMethods,
    
    // Formatters
    formatCurrency,
    formatDate,
    formatRelativeTime,
    
    // Getters
    getCategoryById,
    getCategoryEmoji,
    getCategoryName,
    getCategoryColor,
    getPaymentMethodById,
    getPaymentMethodName,
    getPaymentMethodEmoji,
    
    // Validators
    validateIncomeAmount,
    validateExpenseAmount,
    
    // Status helpers
    getBalanceStatus
  }
}