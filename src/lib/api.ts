import {auth, db, storage} from "@/lib/firebase";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {deleteObject, ref} from "firebase/storage";
import {onAuthStateChanged, signInWithEmailAndPassword, signOut, User} from "firebase/auth";

export async function deleteImageFromStorage(imageUrl: string): Promise<void> {
    const url = new URL(imageUrl);
    const path = decodeURIComponent(url.pathname.split("/o/")[1].split("?")[0]);
    const imageRef = ref(storage, path);
    await deleteObject(imageRef);
}

export async function login(email: string, password: string) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
}

export function observeAuthState(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}

export async function logout() {
    await signOut(auth);
}