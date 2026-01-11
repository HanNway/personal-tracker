import { ref, computed, watch, onUnmounted } from "vue";
import { db } from "@/firebase/config";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  addDoc,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";

export function useTransactions(user) {
  const transactions = ref([]);
  const loading = ref(false);
  const error = ref(null);
  let unsubscribe = null;

  // Add new expense (only expense allowed)
  const addExpense = async (expenseData) => {
    if (!user || !user.value) {
      throw new Error("User not authenticated");
    }

    try {
      loading.value = true;
      error.value = null;

      const expenseWithMetadata = {
        ...expenseData,
        type: "expense", // Always expense
        userId: user.value.uid,
        amount: Number(expenseData.amount),
        createdAt: serverTimestamp(),
      };

      console.log("Adding expense:", expenseWithMetadata);

      // Save to Firestore
      const userExpensesRef = collection(db, "users", user.value.uid, "transactions");
      const docRef = await addDoc(userExpensesRef, expenseWithMetadata);

      console.log("Expense saved with ID:", docRef.id);
      return { id: docRef.id, ...expenseData };
    } catch (err) {
      console.error("Error adding expense:", err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete transaction
  const deleteTransaction = async (transactionId) => {
    if (!user || !user.value) {
      throw new Error("User not authenticated");
    }

    try {
      loading.value = true;
      await deleteDoc(doc(db, "users", user.value.uid, "transactions", transactionId));
      console.log("Transaction deleted:", transactionId);
    } catch (err) {
      console.error("Error deleting transaction:", err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Listen to transactions
  const listenTransactions = (uid) => {
    if (!uid) {
      transactions.value = [];
      return;
    }

    console.log("Listening to transactions for user:", uid);
    loading.value = true;
    error.value = null;

    try {
      const txRef = collection(db, "users", uid, "transactions");
      const q = query(txRef, orderBy("createdAt", "desc"));

      // Unsubscribe from previous listener if exists
      if (unsubscribe) {
        unsubscribe();
      }

      unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log("Transactions snapshot received:", snapshot.docs.length, "transactions");
          
          transactions.value = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              createdAt: data.createdAt?.toDate() || new Date(),
            };
          });
          
          loading.value = false;
        },
        (err) => {
          console.error("Error listening to transactions:", err);
          error.value = err.message;
          loading.value = false;
          transactions.value = [];
        }
      );
    } catch (err) {
      console.error("Error setting up transaction listener:", err);
      error.value = err.message;
      loading.value = false;
    }
  };

  // Calculate total expenses
  const totalExpense = computed(() => {
    return transactions.value
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  });

  // Watch for user changes
  watch(
    () => user?.value,
    (newUser) => {
      console.log("User changed in useTransactions:", newUser?.uid);
      if (newUser) {
        listenTransactions(newUser.uid);
      } else {
        transactions.value = [];
        if (unsubscribe) {
          unsubscribe();
          unsubscribe = null;
        }
      }
    },
    { immediate: true }
  );

  // Cleanup on unmount
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe();
    }
  });

  return {
    transactions,
    totalExpense,
    loading,
    error,
    addExpense,
    deleteTransaction,
    listenTransactions,
  };
}