import { ref, onMounted, watch, computed } from "vue";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/config";
import router from "@/router";
import { firebaseAuthErrorMessage } from "@/utils/firebaseAuthError";

/* REGISTER */
export const register = (name, email, password) => {
  const error = ref(null);
  const loading = ref(false);

  const handleSubmit = async () => {
    loading.value = true;
    error.value = null;

    try {
      const res = await createUserWithEmailAndPassword(auth,email.value,password.value
      );

      await updateProfile(res.user, {
        displayName: name.value,
      });

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName: name.value,
        email: email.value,
        createdAt: new Date(),
      });

      router.push({ name: "home" });
    } catch (err) {
      error.value = firebaseAuthErrorMessage(err.code);
      console.error("Registration error:", err);
    } finally {
      loading.value = false;
    }
  };

  return { error, loading, handleSubmit };
};


export const login = (email, password) => {
  const error = ref(null);
  const loading = ref(false);

  const handleSubmit = async () => {
    loading.value = true;
    error.value = null;

    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      router.push({ name: "home" });
    } catch (err) {
      error.value = firebaseAuthErrorMessage(err.code);
      console.error("Login error:", err);
    } finally {
      loading.value = false;
    }
  };

  return { error, loading, handleSubmit };
};


export const logout = async () => {
  const error = ref(null);
  try {
    await signOut(auth);
    router.push({ name: "auth" });
  } catch (err) {
    error.value = err.message;
    console.error("Logout error:", err);
  }
  return { error };
};


export function useAuth() {
  const user = ref(null);
  const loading = ref(true);

  onMounted(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser?.uid);
      user.value = firebaseUser;
      loading.value = false;
    });

    return unsubscribe;
  });

  const isAuthenticated = computed(() => !!user.value);

  return { user, loading, isAuthenticated };
}


export function useProfile(user) {
  const profileName = ref("");
  const profileLoading = ref(false);
  const userProfile = ref(null);

  const loadProfile = async () => {
    if (!user || !user.value) {
      profileName.value = "Guest";
      userProfile.value = null;
      return;
    }

    profileLoading.value = true;
    try {
      
      const userDoc = await getDoc(doc(db, "users", user.value.uid));

      if (userDoc.exists()) {
        userProfile.value = userDoc.data();
        profileName.value = userProfile.value.displayName || user.value.displayName || user.value.email?.split("@")[0] || "User";
      } else {
        
        profileName.value = user.value.displayName || user.value.email?.split("@")[0] || "User";
        userProfile.value = {
          uid: user.value.uid,
          displayName: user.value.displayName,
          email: user.value.email,
        };
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      profileName.value = user.value.displayName || user.value.email?.split("@")[0] || "User";
    } finally {
      profileLoading.value = false;
    }
  };

  // Watch for user changes
  watch(
    () => user?.value,
    (newUser) => {
      if (newUser) {
        loadProfile();
      } else {
        profileName.value = "Guest";
        userProfile.value = null;
      }
    },
    { immediate: true }
  );

  return {
    profileName,
    userProfile,
    profileLoading,
    loadProfile,
  };
}