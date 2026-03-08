import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, githubProvider } from '../config/firebase';
import {
    onAuthStateChanged,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    updateProfile,
    getAdditionalUserInfo
} from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Sync to backend DB
    const syncUserToBackend = async (firebaseUser, additionalData = {}) => {
        try {
            if (!firebaseUser) return;
            const token = await firebaseUser.getIdToken();
            // Wait for backend to be ready, this will create or update the user in Postgres
            await fetch('http://localhost:5000/api/auth/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    firebaseUid: firebaseUser.uid,
                    email: firebaseUser.email,
                    username: firebaseUser.displayName || additionalData.username || firebaseUser.email.split('@')[0],
                    fullName: firebaseUser.displayName || '',
                    profilePic: firebaseUser.photoURL || '',
                    firstName: additionalData.firstName || '',
                    lastName: additionalData.lastName || '',
                    phoneNumber: additionalData.phoneNumber || '',
                })
            });
        } catch (error) {
            console.error('Error syncing user to backend:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
            if (user) {
                syncUserToBackend(user);
            }
        });

        return unsubscribe;
    }, []);

    const signup = async (email, password, userData) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userData?.username) {
            await updateProfile(userCredential.user, {
                displayName: userData.username
            });
            // We update state with a new reference to force re-render, but bind methods to the original user
            setCurrentUser(Object.assign(Object.create(Object.getPrototypeOf(userCredential.user)), userCredential.user));
            // Sync to backend explicitly since we just updated the displayName and have extra fields
            await syncUserToBackend(auth.currentUser, userData);
        } else if (userData) {
            // Still sync to backend if we have extra fields but no username (e.g. from UI)
            await syncUserToBackend(auth.currentUser, userData);
        }
        return userCredential;
    }

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    }

    const loginWithGoogle = async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const { isNewUser } = getAdditionalUserInfo(result);
        if (isNewUser) {
            await result.user.delete(); // Delete the mistakenly created account
            await firebaseSignOut(auth);
            const error = new Error("Bu akkaunt mavjud emas. Iltimos oldin ro'yxatdan o'ting!");
            error.code = 'auth/user-not-found';
            throw error;
        }
        return result;
    }

    const loginWithGithub = async () => {
        const result = await signInWithPopup(auth, githubProvider);
        const { isNewUser } = getAdditionalUserInfo(result);
        if (isNewUser) {
            await result.user.delete();
            await firebaseSignOut(auth);
            const error = new Error("Bu akkaunt mavjud emas. Iltimos oldin ro'yxatdan o'ting!");
            error.code = 'auth/user-not-found';
            throw error;
        }
        return result;
    }

    const logout = () => {
        return firebaseSignOut(auth);
    }

    const value = {
        currentUser,
        signup,
        login,
        loginWithGoogle,
        loginWithGithub,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
