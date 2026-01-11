<template>
  <div class="mywallet-container">
    <!-- Header -->
    <header class="header">
      <div class="logo">
        <i class="fas fa-wallet"></i>
        <span>MyWallet</span>
      </div>
      
      <nav class="nav-menu">
        <ul>
          <li class="active">Home</li>
          <li>History</li>
          <li>Account</li>
        </ul>
      </nav>
      
      <div class="user-info">
        <span class="user-name">Han Nway</span>
        <button class="logout-btn">
          <i class="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <h1 class="page-title">Expense History</h1>
      
      <!-- Filter Controls -->
      <div class="filter-section">
        <div class="filter-group">
          <label>Category:</label>
          <div class="select-wrapper">
            <select class="filter-select">
              <option>All Categories</option>
              <option>Food & Dining</option>
              <option>Transportation</option>
              <option>Shopping</option>
              <option>Bills & Utilities</option>
              <option>Entertainment</option>
            </select>
            <i class="fas fa-chevron-down"></i>
          </div>
        </div>
        
        <div class="filter-group">
          <label>Period:</label>
          <div class="select-wrapper">
            <select class="filter-select">
              <option>All Time</option>
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
            <i class="fas fa-chevron-down"></i>
          </div>
        </div>
        
        <div class="filter-group">
          <label>Sort by:</label>
          <div class="select-wrapper">
            <select class="filter-select">
              <option>Date (Newest First)</option>
              <option>Date (Oldest First)</option>
              <option>Amount (Highest First)</option>
              <option>Amount (Lowest First)</option>
            </select>
            <i class="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>
      
      <!-- Summary Statistics -->
      <div class="summary-section">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-receipt"></i>
          </div>
          <div class="stat-content">
            <h3>TOTAL EXPENSES</h3>
            <p class="stat-value">0</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <div class="stat-content">
            <h3>TOTAL AMOUNT</h3>
            <p class="stat-value">0 MMK</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <div class="stat-content">
            <h3>AVERAGE</h3>
            <p class="stat-value">0 MMK</p>
          </div>
        </div>
      </div>
      
      <!-- Loading State -->
      <div class="loading-section">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>Loading expense history...</p>
        </div>
      </div>
      
      <!-- Placeholder for Data -->
      <div class="data-placeholder">
        <div class="placeholder-text">
          <i class="fas fa-database"></i>
          <p>No expense data available</p>
          <small>Add expenses to see your history here</small>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>

</script>

<style scoped>
/* Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
}

.mywallet-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  min-height: 100vh;
}

/* Header Styles */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #4f46e5;
}

.logo i {
  font-size: 28px;
}

.nav-menu ul {
  display: flex;
  list-style: none;
  gap: 32px;
  padding: 0;
  margin: 0;
}

.nav-menu li {
  padding: 8px 0;
  cursor: pointer;
  color: #64748b;
  font-weight: 500;
  position: relative;
  transition: color 0.2s;
}

.nav-menu li:hover {
  color: #4f46e5;
}

.nav-menu li.active {
  color: #4f46e5;
}

.nav-menu li.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #4f46e5;
  border-radius: 2px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-name {
  font-weight: 600;
  color: #334155;
}

.logout-btn {
  background: #f1f5f9;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: #e2e8f0;
  color: #334155;
}

/* Main Content */
.main-content {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 32px;
  color: #1e293b;
}

/* Filter Section */
.filter-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-weight: 600;
  color: #475569;
  font-size: 14px;
}

.select-wrapper {
  position: relative;
  width: 100%;
}

.filter-select {
  width: 100%;
  padding: 12px 16px;
  padding-right: 40px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  font-size: 15px;
  color: #334155;
  cursor: pointer;
  appearance: none;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.select-wrapper i {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  pointer-events: none;
}

/* Summary Statistics */
.summary-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  width: 60px;
  height: 60px;
  background: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #4f46e5;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.1);
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

/* Loading Section */
.loading-section {
  margin: 48px 0;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}

.spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #4f46e5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-spinner p {
  color: #64748b;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

/* Data Placeholder */
.data-placeholder {
  margin-top: 48px;
  padding: 64px 32px;
  background: #f8fafc;
  border-radius: 12px;
  border: 2px dashed #cbd5e1;
  text-align: center;
}

.placeholder-text {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #94a3b8;
}

.placeholder-text i {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.placeholder-text p {
  font-size: 18px;
  font-weight: 600;
  color: #64748b;
  margin: 0;
}

.placeholder-text small {
  font-size: 14px;
  color: #94a3b8;
}

/* Responsive Design */
@media (max-width: 768px) {
  .mywallet-container {
    padding: 16px;
  }
  
  .header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
  
  .nav-menu ul {
    gap: 16px;
    flex-wrap: wrap;
  }
  
  .main-content {
    padding: 24px 16px;
  }
  
  .filter-section {
    grid-template-columns: 1fr;
    padding: 20px;
  }
  
  .summary-section {
    grid-template-columns: 1fr;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: 16px;
  }
  
  .loading-spinner {
    padding: 32px 20px;
  }
  
  .data-placeholder {
    padding: 48px 20px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 24px;
  }
  
  .stat-value {
    font-size: 24px;
  }
  
  .user-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    width: 100%;
  }
  
  .logout-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>