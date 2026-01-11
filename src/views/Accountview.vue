<template>
  <div class="container">
    <div class="card">
      
      <div class="tabs">
        <button
          :class="{ active: !isEdit }"
          @click="setIsEdit(false)"
          class="tab"
        >
          Add Account
        </button>
        <button
          :class="{ active: isEdit }"
          @click="setIsEdit(true)"
          class="tab"
        >
          Edit Account
        </button>
      </div>

      <div class="content">
        <h1 class="title">{{ isEdit ? 'Edit Account' : 'Add Account' }}</h1>
        <p class="subtitle">Enter Account name</p>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label class="label">Account Name</label>
            <input
              type="text"
              v-model="accName"
              placeholder="Enter Account Name"
              :class="{ 'input-error': hasError }"
              class="input"
              @blur="validateName"
            />
           
            <p v-if="hasError" class="error-message">
              {{ errorMessage }}
            </p>
          </div>

          <div class="actions">
            <button type="button" @click="handleCancel" class="btn-cancel">
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!isValid || isSubmitting"
              class="btn-submit"
            >
              {{ isEdit ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>

        
        <div v-if="submitted" class="success">
          <p>
            Account "{{ accName }}" has been successfully
            {{ isEdit ? 'updated' : 'added' }}!
          </p>
          <button @click="resetForm" class="btn-reset">Reset</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const isEdit = ref(false)
const accName = ref('')
const submitted = ref(false)
const isSubmitting = ref(false)

// Form Validation 
const hasError = ref(false)
const errorMessage = ref('')

const validateName = () => {
  const name = accName.value.trim()

  if (name === '') {
    hasError.value = true
    errorMessage.value = 'Name is required'
    return false
  }

  if (name.length < 3) {
    hasError.value = true
    errorMessage.value = 'Name must be at least 3 characters long'
    return false
  }

  if (name.length > 50) {
    hasError.value = true
    errorMessage.value = 'Name cannot exceed 50 characters'
    return false
  }

  hasError.value = false
  errorMessage.value = ''
  return true
}

const isValid = computed(() => {
  return accName.value.trim().length >= 3 &&
         accName.value.trim().length <= 5 
         
})

const setIsEdit = (edit) => {
  isEdit.value = edit
  resetForm()
}

const handleSubmit = () => {
  if (!validateName()) return

  isSubmitting.value = true

  setTimeout(() => {
    console.log('Submitted Account Name:', accName.value.trim())
    submitted.value = true
    isSubmitting.value = false
  }, 800)
}

const handleCancel = () => {
  resetForm()
}

const resetForm = () => {
  accName.value = ''
  submitted.value = false
  hasError.value = false
  errorMessage.value = ''
}
</script>


<style scoped>
.container {
  min-height: 100vh;
  background: linear-gradient(to bottom, #635bff, #a78bfa);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 480px;
  overflow: hidden;
}

.tabs {
  display: flex;
  background: #f8f9fa;
}

.tab {
  flex: 1;
  padding: 14px 20px;
  font-size: 16px;
  font-weight: 500;
  color: #6c757d;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
}

.tab.active {
  color: #635bff;
  background: white;
  border-bottom: 3px solid #635bff;
}

.content {
  padding: 40px;
}

.title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  text-align: center;
}

.subtitle {
  color: #6c757d;
  text-align: center;
  margin-bottom: 40px;
  font-size: 16px;
}

.form-group {
  margin-bottom: 32px;
}

.label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  font-size: 15px;
}

.input {
  width: 100%;
  padding: 14px 16px;
  font-size: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  background: #fafafa;
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: #635bff;
  background: white;
  box-shadow: 0 0 0 3px rgba(99, 91, 255, 0.1);
}

.input-error {
  border-color: #e74c3c;
  background: #fff5f5;
}

.input-error:focus {
  border-color: #e74c3c;
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 8px;
  margin-left: 4px;
}

.actions {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 40px;
}

.btn-cancel {
  flex: 1;
  padding: 14px;
  background: #f1f3f5;
  color: #495057;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.btn-cancel:hover {
  background: #e2e6ea;
}

.btn-submit {
  flex: 1;
  padding: 14px;
  background: linear-gradient(to right, #635bff, #a78bfa);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(99, 91, 255, 0.3);
  transition: all 0.2s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(99, 91, 255, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.success {
  margin-top: 30px;
  padding: 20px;
  background: #f0f5ff;
  border-radius: 12px;
  text-align: center;
  color: #635bff;
}

.btn-reset {
  margin-top: 12px;
  padding: 10px 20px;
  background: #635bff;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>
