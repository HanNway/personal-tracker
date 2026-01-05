export const firebaseAuthErrorMessage = (code) => {
    const map = {
        'auth/invalid-email': 'The email address is not valse',
        'auth/user-disabled': 'The user account has been disabled by an administrater.',
        'auth/user-not-found': 'There is no user corresponding to the given email.',
        'auth/wrong-password': 'The password is invalid for the given email.',
        'auth/email-already-in-use': 'The email address is already in use by another account.',
        'auth/operation-not-allowed': 'Email/password accounts are not enabled.',
        'auth/weak-password': 'The password is too weak.',
        'auth/invalid-credential': 'The credential is invalid.'
    }
    
    return map[code] || "Something went worng, Please try again."

}
