<template>
  <div class="form">
    <h2>Add Transaction</h2>

    <input v-model="amount" type="number" placeholder="Amount" />
    <input v-model="note" placeholder="Note" />

    <select v-model="type">
      <option value="income">Income</option>
      <option value="expense">Expense</option>
    </select>

    <select v-model="payMethod">
      <option>KBZ Pay</option>
      <option>Wave Money</option>
      <option>True Money</option>
      <option>Banking System</option>
    </select>

    <button @click="add">Save</button>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAddTransaction } from "@/composables/useAddTransation";

const amount = ref(0);
const note = ref("");
const type = ref("expense");
const payMethod = ref("KBZ Pay");

const { addTransaction } = useAddTransaction();

const add = () => {
  addTransaction(amount, note, type, payMethod);
};
</script>
