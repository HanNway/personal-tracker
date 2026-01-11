<template>
  <NavBar />
  <div class="home">
    <h2>Welcome, {{ profileName }}</h2>

    <!-- Income Setup Modal -->
    <div v-if="showIncomeSetup && !incomeLoading" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>💰 Set Your Total Income</h3>
        </div>
        
        <div class="modal-body">
          <div class="form-group">
            <label>Total Monthly Income (MMK)</label>
            <input 
              type="number" 
              v-model.number="initialIncome" 
              class="form-input"
              placeholder="0"
              min="1000"
              step="1000"
            >
            <small class="hint">Minimum: 1,000 MMK</small>
          </div>

          <div v-if="incomeError" class="error-message">
            {{ incomeError }}
          </div>

          <button 
            class="btn-primary"
            @click="saveInitialIncome" 
            :disabled="isSettingIncome || !initialIncome || initialIncome < 1000"
          >
            {{ isSettingIncome ? 'Setting...' : 'Set Income & Start' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="incomeLoading" class="loading">
      Loading...
    </div>

    <!-- Main Content -->
    <div v-else-if="totalIncome > 0" class="main-content">
      <!-- Summary Cards -->
      <div class="summary">
        <div class="card income">
          <div class="card-header">
            <p>Total Income</p>
            <button class="edit-btn" @click="openChangeIncomeModal">Change</button>
          </div>
          <h3>{{ formatCurrency(totalIncome) }}</h3>
          <small>Last updated: {{ formatRelativeTime(incomeLastUpdated) }}</small>
        </div>

        <div class="card expense">
          <p>Total Expense</p>
          <h3>{{ formatCurrency(totalExpense) }}</h3>
          <small>{{ expenses.length }} transactions</small>
        </div>

        <div class="card balance" :class="balanceStatus.class">
          <p>Available Balance</p>
          <h3>{{ formatCurrency(balance) }}</h3>
          <small>{{ balanceStatus.message }}</small>
        </div>
      </div>

      <!-- Change Income Modal -->
      <div v-if="showChangeIncomeModal" class="modal-overlay" @click="closeChangeIncomeModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Change Monthly Income</h3>
            <button class="close-btn" @click="closeChangeIncomeModal">×</button>
          </div>
          
          <div class="modal-body">
            <div class="current-income-info">
              <p><strong>Current Income:</strong> {{ formatCurrency(totalIncome) }}</p>
              <p><strong>Current Balance:</strong> {{ formatCurrency(balance) }}</p>
            </div>

            <div class="form-group">
              <label>New Monthly Income (MMK)</label>
              <input 
                type="number" 
                v-model.number="newIncomeAmount" 
                class="form-input"
                placeholder="Enter new income amount"
                min="1000"
                step="1000"
              >
              <small class="hint">This will replace your current income</small>
              
              <div v-if="newIncomeAmount" class="income-difference">
                <span v-if="newIncomeAmount > totalIncome" class="positive">
                  +{{ formatCurrency(newIncomeAmount - totalIncome) }}
                </span>
                <span v-else-if="newIncomeAmount < totalIncome" class="negative">
                  -{{ formatCurrency(totalIncome - newIncomeAmount) }}
                </span>
                <span v-else class="no-change">
                  No change
                </span>
              </div>
            </div>

            <div v-if="changeIncomeError" class="error-message">
              {{ changeIncomeError }}
            </div>

            <div class="modal-actions">
              <button class="btn-secondary" @click="closeChangeIncomeModal" :disabled="isChangingIncome">
                Cancel
              </button>
              <button 
                class="btn-primary"
                @click="changeIncomeHandler"
                :disabled="isChangingIncome || !newIncomeAmount || newIncomeAmount < 1000"
              >
                {{ isChangingIncome ? 'Changing...' : 'Change Income' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Expense Section -->
      <div class="expense-section">
        <div class="section-header">
          <h3>Expense Transactions</h3>
          <div class="action-buttons">
            <button 
              class="btn-primary"
              @click="openAddExpenseModal"
              :disabled="balance <= 0"
              :title="balance <= 0 ? 'No available balance' : 'Add new expense'"
            >
              + Add Expense
            </button>
          </div>
        </div>

        <!-- Balance Warning -->
        <div v-if="balance <= 0" class="warning-message danger">
          ⚠️ No available balance. Please update your income.
          <button @click="openChangeIncomeModal" class="btn-warning">Update Income</button>
        </div>

        <!-- Expenses Loading -->
        <div v-if="expensesLoading" class="loading-expenses">
          Loading expenses...
        </div>

        <!-- Empty State -->
        <div v-else-if="expenses.length === 0" class="empty-state">
          <p>No expenses yet. Start tracking your expenses!</p>
          <p class="available-balance">Available: {{ formatCurrency(balance) }}</p>
        </div>

        <!-- Expenses List -->
        <div v-else class="expenses-list">
          <div 
            v-for="expense in expenses" 
            :key="expense.id" 
            class="expense-item"
            :class="expense.category"
          >
            <div class="expense-icon">
              {{ getCategoryEmoji(expense.category) }}
            </div>
            
            <div class="expense-details">
              <div class="expense-header">
                <h4 class="expense-note">
                  {{ expense.note || 'No description' }}
                  <span class="expense-category">{{ getCategoryName(expense.category) }}</span>
                </h4>
                <div class="expense-amount">
                  -{{ formatCurrency(expense.amount) }}
                </div>
              </div>
              
              <div class="expense-meta">
                <span class="meta-item">
                  {{ formatDate(expense.createdAt) }}
                </span>
                <span class="meta-item">
                  {{ getPaymentMethodName(expense.payMethod) }}
                </span>
                <button 
                  class="btn-delete"
                  @click="deleteExpenseHandler(expense.id)"
                  title="Delete expense"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Expense Modal -->
      <div v-if="showAddExpenseModal" class="modal-overlay" @click="closeAddExpenseModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>💸 Add New Expense</h3>
            <button class="close-btn" @click="closeAddExpenseModal">×</button>
          </div>
          
          <div class="modal-body">
            <div class="balance-display">
              <div class="balance-row">
                <span>Available Balance:</span>
                <span class="balance-value">{{ formatCurrency(balance) }}</span>
              </div>
              <div class="balance-row" v-if="newExpense.amount">
                <span>After Expense:</span>
                <span class="balance-value remaining">
                  {{ formatCurrency(balance - newExpense.amount) }}
                </span>
              </div>
            </div>

            <!-- Expense Form -->
            <div class="form-group">
              <label for="amount">Amount (MMK) *</label>
              <input 
                type="number" 
                v-model.number="newExpense.amount" 
                id="amount"
                class="form-input"
                placeholder="0"
                :max="balance"
                min="100"
                step="100"
                @input="validateExpenseAmount"
              >
              <small class="hint">Max: {{ formatCurrency(balance) }}</small>
              <div v-if="amountError" class="error-message small">
                {{ amountError }}
              </div>
            </div>

            <div class="form-group">
              <label for="category">Category *</label>
              <select v-model="newExpense.category" id="category" class="form-input">
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.emoji }} {{ cat.name }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="note">Description (Optional)</label>
              <input 
                type="text" 
                v-model="newExpense.note" 
                id="note"
                class="form-input"
                placeholder="What was this expense for?"
                maxlength="100"
              >
              <small class="hint">{{ newExpense.note.length }}/100 characters</small>
            </div>

            <div class="form-group">
              <label for="payMethod">Payment Method</label>
              <select v-model="newExpense.payMethod" id="payMethod" class="form-input">
                <option v-for="method in paymentMethods" :key="method.id" :value="method.id">
                  {{ method.emoji }} {{ method.name }}
                </option>
              </select>
            </div>

            <div v-if="addExpenseError" class="error-message">
              {{ addExpenseError }}
            </div>

            <div class="modal-actions">
              <button class="btn-secondary" @click="closeAddExpenseModal" :disabled="isAddingExpense">
                Cancel
              </button>
              <button 
                class="btn-primary"
                @click="saveExpense"
                :disabled="isAddingExpense || !newExpense.amount || newExpense.amount > balance || newExpense.amount <= 0"
              >
                {{ isAddingExpense ? 'Saving...' : 'Add Expense' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Income Set -->
    <div v-else-if="!incomeLoading" class="no-income-setup">
      <div class="setup-card">
        <h3>Start Tracking Your Expenses</h3>
        <p>Set your monthly income to begin tracking expenses</p>
        <button class="btn-primary" @click="showIncomeSetup = true">
          Set Monthly Income
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
// ==================== IMPORTS ====================
import { useAuth, useProfile } from "@/composables/useAuth.js";
import { useIncome } from "@/composables/useIncome.js";
import { useExpenses } from "@/composables/useExpenses.js";
import { useCategories } from "@/composables/useCategories.js";
import NavBar from "@/components/NavBar.vue";
import { ref, reactive, computed, onUnmounted } from "vue";

// ==================== COMPOSABLES ====================
const { user } = useAuth();
const { profileName } = useProfile(user);

const {
  totalIncome,
  loading: incomeLoading,
  error: incomeError,
  lastUpdated: incomeLastUpdated,
  setInitialIncome,
  changeIncome, // This is the composable function
  cleanup: cleanupIncome,
} = useIncome(user);

const {
  expenses,
  loading: expensesLoading,
  error: expensesError,
  totalExpense,
  balance,
  addExpense,
  deleteExpense,
  cleanup: cleanupExpenses,
} = useExpenses(user, totalIncome);

const {
  formatCurrency,
  formatDate,
  formatRelativeTime,
  getCategoryEmoji,
  getCategoryName,
  getPaymentMethodName,
  categories,
  paymentMethods,
  validateExpenseAmount: validateExpenseAmountHelper,
  getBalanceStatus,
} = useCategories();

// ==================== UI STATE ====================
const showIncomeSetup = ref(false);
const showChangeIncomeModal = ref(false);
const showAddExpenseModal = ref(false);
const isSettingIncome = ref(false);
const isChangingIncome = ref(false);
const isAddingExpense = ref(false);

// ==================== FORM DATA ====================
const initialIncome = ref(null);
const newIncomeAmount = ref(null);
const changeIncomeError = ref(null);
const addExpenseError = ref(null);
const amountError = ref(null);

const newExpense = reactive({
  amount: null,
  note: "",
  category: "food",
  payMethod: "cash",
});

// ==================== COMPUTED ====================
const balanceStatus = computed(() => {
  return getBalanceStatus(balance.value, totalIncome.value);
});

// ==================== INCOME FUNCTIONS ====================
const saveInitialIncome = async () => {
  if (!initialIncome.value || initialIncome.value < 1000) {
    incomeError.value = "Please enter at least 1,000 MMK";
    return;
  }

  isSettingIncome.value = true;
  incomeError.value = null;

  try {
    await setInitialIncome(initialIncome.value);
    showIncomeSetup.value = false;
    initialIncome.value = null;
  } catch (error) {
    incomeError.value = error.message || "Failed to set income";
  } finally {
    isSettingIncome.value = false;
  }
};

const openChangeIncomeModal = () => {
  showChangeIncomeModal.value = true;
  newIncomeAmount.value = totalIncome.value;
  changeIncomeError.value = null;
};

const changeIncomeHandler = async () => {
  console.log("Changing income to:", newIncomeAmount.value);

  if (!newIncomeAmount.value || newIncomeAmount.value < 1000) {
    changeIncomeError.value = "Please enter at least 1,000 MMK";
    return;
  }

  // If amount is same as current, just close modal
  if (newIncomeAmount.value === totalIncome.value) {
    closeChangeIncomeModal();
    return;
  }

  isChangingIncome.value = true;
  changeIncomeError.value = null;

  try {
    const result = await changeIncome(newIncomeAmount.value);
    console.log("Income change result:", result);

    showChangeIncomeModal.value = false;
    newIncomeAmount.value = null;

    // Show success message with difference
    if (result.difference > 0) {
      alert(`✅ Income increased by ${formatCurrency(result.difference)}`);
    } else if (result.difference < 0) {
      alert(
        `📉 Income decreased by ${formatCurrency(Math.abs(result.difference))}`
      );
    } else {
      alert(`✅ Income updated`);
    }
  } catch (error) {
    console.error("Error changing income:", error);
    changeIncomeError.value = error.message || "Failed to change income";
  } finally {
    isChangingIncome.value = false;
  }
};

const closeChangeIncomeModal = () => {
  showChangeIncomeModal.value = false;
  newIncomeAmount.value = null;
  changeIncomeError.value = null;
};

// ==================== EXPENSE FUNCTIONS ====================
const validateExpenseAmount = () => {
  if (!newExpense.amount) {
    amountError.value = null;
    return;
  }

  const validationError = validateExpenseAmountHelper(
    newExpense.amount,
    balance.value
  );
  amountError.value = validationError;
};

const openAddExpenseModal = () => {
  if (balance.value <= 0) {
    alert("Please update your income first - no available balance");
    openChangeIncomeModal();
    return;
  }

  showAddExpenseModal.value = true;
  addExpenseError.value = null;
  amountError.value = null;
};

const saveExpense = async () => {
  console.log("Save expense called with:", newExpense);

  // Validation
  if (!newExpense.amount || newExpense.amount <= 0) {
    amountError.value = "Please enter a valid amount";
    return;
  }

  if (newExpense.amount > balance.value) {
    amountError.value = "Amount exceeds available balance";
    return;
  }

  if (newExpense.amount < 100) {
    amountError.value = "Minimum expense is 100 MMK";
    return;
  }

  isAddingExpense.value = true;
  addExpenseError.value = null;

  try {
    await addExpense({
      amount: newExpense.amount,
      note: newExpense.note.trim(),
      category: newExpense.category,
      payMethod: newExpense.payMethod,
    });

    // Reset form
    newExpense.amount = null;
    newExpense.note = "";
    newExpense.category = "food";
    newExpense.payMethod = "cash";
    amountError.value = null;

    showAddExpenseModal.value = false;

    // Show success
    alert("✅ Expense added successfully!");
  } catch (error) {
    console.error("Error saving expense:", error);
    addExpenseError.value = error.message || "Failed to add expense";
  } finally {
    isAddingExpense.value = false;
  }
};

const deleteExpenseHandler = async (expenseId) => {
  if (!confirm("Are you sure you want to delete this expense?")) {
    return;
  }

  try {
    await deleteExpense(expenseId);
    alert("✅ Expense deleted!");
  } catch (error) {
    alert("❌ Failed to delete expense: " + (error.message || "Unknown error"));
  }
};

const closeAddExpenseModal = () => {
  showAddExpenseModal.value = false;
  newExpense.amount = null;
  newExpense.note = "";
  newExpense.category = "food";
  newExpense.payMethod = "cash";
  addExpenseError.value = null;
  amountError.value = null;
};

// ==================== CLEANUP ====================
onUnmounted(() => {
  cleanupIncome();
  cleanupExpenses();
});
</script>

<style scoped>
.home {
  padding: 20px;
  max-width: 1200px;
  margin: auto;
}

/* Summary Cards */
.summary {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  padding: 20px;
  border-radius: 12px;
  color: white;
}

.card.income {
  background: linear-gradient(135deg, #10b981, #059669);
}

.card.expense {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.card.balance {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.card.balance.negative {
  background: linear-gradient(135deg, #dc2626, #991b1b);
}

.card.balance.warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.card.balance.positive {
  background: linear-gradient(135deg, #10b981, #059669);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.edit-btn {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.edit-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.card h3 {
  margin: 10px 0;
  font-size: 24px;
}

/* Change Income Modal */
.current-income-info {
  background: #f3f4f6;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.current-income-info p {
  margin: 5px 0;
}

.income-difference {
  margin-top: 10px;
  padding: 8px;
  border-radius: 6px;
  background: #f8fafc;
  text-align: center;
  font-weight: 600;
}

.income-difference .positive {
  color: #10b981;
}

.income-difference .negative {
  color: #ef4444;
}

.income-difference .no-change {
  color: #6b7280;
}

/* Warning Messages */
.warning-message {
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.warning-message.danger {
  background: #fee2e2;
  color: #dc2626;
  border-left: 4px solid #dc2626;
}

.btn-warning {
  background: #dc2626;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.btn-warning:hover {
  background: #b91c1c;
}

/* Balance Display */
.balance-display {
  background: #f0f9ff;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  border-left: 4px solid #3b82f6;
}

.balance-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.balance-row:last-child {
  margin-bottom: 0;
}

.balance-value {
  font-weight: 700;
  color: #059669;
}

.balance-value.remaining {
  color: #1e40af;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #6b7280;
  padding: 5px;
}

.close-btn:hover {
  color: #374151;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #374151;
}

.form-input,
select.form-input {
  width: 100%;
  padding: 10px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-input:focus,
select.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.hint {
  color: #6b7280;
  font-size: 13px;
  display: block;
  margin-top: 5px;
}

.error-message {
  background: #fee2e2;
  color: #dc2626;
  padding: 12px;
  border-radius: 8px;
  margin: 15px 0;
}

.error-message.small {
  padding: 8px 12px;
  font-size: 14px;
  margin-top: 8px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn-primary:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
  border: 2px solid #e2e8f0;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  transition: all 0.2s;
}

.btn-secondary:hover:not(:disabled) {
  background: #e2e8f0;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Expense Section */
.expense-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.section-header h3 {
  margin: 0;
  font-size: 20px;
  color: #1f2937;
}

.action-buttons .btn-primary {
  width: auto;
  padding: 10px 20px;
}

.loading-expenses {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}

.available-balance {
  color: #059669;
  font-weight: 600;
  margin-top: 10px;
}

/* Expenses List */
.expenses-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.expense-item {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 10px;
  border-left: 4px solid #e5e7eb;
  transition: all 0.2s;
}

.expense-item:hover {
  background: #f1f5f9;
  transform: translateX(4px);
}

.expense-item.food {
  border-left-color: #10b981;
}

.expense-item.transport {
  border-left-color: #3b82f6;
}

.expense-item.shopping {
  border-left-color: #8b5cf6;
}

.expense-item.entertainment {
  border-left-color: #ec4899;
}

.expense-item.bills {
  border-left-color: #6366f1;
}

.expense-item.health {
  border-left-color: #ef4444;
}

.expense-item.education {
  border-left-color: #f59e0b;
}

.expense-item.other {
  border-left-color: #6b7280;
}

.expense-icon {
  font-size: 24px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.expense-details {
  flex: 1;
  min-width: 0;
}

.expense-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 8px;
}

.expense-note {
  margin: 0;
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.expense-category {
  background: rgba(0, 0, 0, 0.05);
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.expense-amount {
  font-size: 18px;
  font-weight: 700;
  color: #ef4444;
  flex-shrink: 0;
}

.expense-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  color: #6b7280;
  font-size: 13px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-delete {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  font-size: 16px;
  opacity: 0;
  transition: all 0.2s;
}

.expense-item:hover .btn-delete {
  opacity: 1;
}

.btn-delete:hover {
  color: #dc2626;
  background: #fee2e2;
}

/* No Income Setup */
.no-income-setup {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
}

.setup-card {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  max-width: 400px;
}

.setup-card h3 {
  color: #1f2937;
  margin-bottom: 12px;
  font-size: 24px;
}

.setup-card p {
  color: #6b7280;
  margin-bottom: 24px;
  line-height: 1.5;
}

.setup-card .btn-primary {
  max-width: 250px;
  margin: 0 auto;
}

.loading {
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;
  font-size: 18px;
}

/* Responsive */
@media (max-width: 768px) {
  .home {
    padding: 15px;
  }

  .summary {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons .btn-primary {
    width: 100%;
  }

  .expense-header {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .expense-amount {
    align-self: flex-end;
  }

  .expense-meta {
    flex-wrap: wrap;
    gap: 12px;
  }

  .btn-delete {
    opacity: 1;
  }

  .modal-actions {
    flex-direction: column;
  }
}
</style>