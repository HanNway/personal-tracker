import {ref} from 'vue';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import router from '@/router/index.js';
import { auth } from "@/firebase/config.js"
import {firebaseAuthErrorMessage} from "@/utils/firebaseAuthError"


export const register = (name,email,password) => {
    const error = ref(null)
    const loading = ref (false)

    const handleSubmit = async() => {
        loading.value = true 
        try{
           const res = await createUserWithEmailAndPassword(auth, email.value, password.value)

            await updateProfile(res.user, {
                displayName: name.value
            })

            router.push({"name": "home"})
        }catch(err) {
            error.value = firebaseAuthErrorMessage(err.code)
        }finally {
            loading.value = false
        }
    }

    return {error,loading, handleSubmit}

}

export const login = (email,password) =>{
    const error = ref(null)
    const loading = ref (false)

    const handleSubmit = async() => {
        loading.value = true 
        try{
            await signInWithEmailAndPassword(auth, email.value, password.value)

            router.push({"name": "home"})
        }catch(err) {
            error.value =  firebaseAuthErrorMessage(err.code)
        }finally {
            loading.value = false
        }
    }
    return {error,loading, handleSubmit} 

}