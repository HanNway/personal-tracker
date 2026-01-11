import { addDoc, deleteDoc, updateDoc, doc } from "firebase/firestore";

export const useAddTransaction = () => {
  const addTransaction = async (amount, note, type, payMethod) => {
    await addDoc(collection(db, "users", auth.currentUser.uid, "transactions"), {
      amount: Number(amount.value),
      note: note.value,
      type: type.value,
      payMethod: payMethod.value,
      createdAt: new Date(),
    });
  };

  return { addTransaction };
};

export const useEditTransaction = () => {
  const updateTransaction = async (id, data) => {
    await updateDoc(doc(db, "users", auth.currentUser.uid, "transactions", id), data);
  };

  const deleteTransaction = async (id) => {
    await deleteDoc(doc(db, "users", auth.currentUser.uid, "transactions", id));
  };

  return { updateTransaction, deleteTransaction };
};
