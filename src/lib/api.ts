import {auth, db, storage} from "@/lib/firebase";
import {
    collection, doc, getDoc, setDoc, updateDoc, deleteDoc,
    orderBy, query, getDocs, limit
} from "firebase/firestore";
import {deleteObject, getDownloadURL, ref, uploadBytes} from "firebase/storage";
import {onAuthStateChanged, signInWithEmailAndPassword, signOut, User} from "firebase/auth";
import {Kind, Post} from "@/data/type";

const postsCol = (kind: Kind) => collection(db, "kinds", kind, "posts");

export async function getPosts(kind: Kind): Promise<Post[]> {
    const q = query(postsCol(kind), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Post);
}

export async function getRecentPosts(kind: Kind, count: number): Promise<Post[]> {
    const q = query(postsCol(kind), orderBy("createdAt", "desc"), limit(count));
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as Post);
}

export async function getPost(kind: Kind, postId: string): Promise<Post | null> {
    const snap = await getDoc(doc(postsCol(kind), postId));
    return snap.exists() ? (snap.data() as Post) : null;
}

export async function createPost(kind: Kind, post: Post) {
    await setDoc(doc(postsCol(kind), post.id), post);
}

export async function updatePost(kind: Kind, postId: string, patch: Partial<Post>) {
    await updateDoc(doc(postsCol(kind), postId), { ...patch, updatedAt: Date.now() });
}

export async function deletePost(kind: Kind, postId: string) {
    await deleteDoc(doc(postsCol(kind), postId));
}

export async function insertImageToStorage(kind: Kind, postId: string, part: string, file: File) {
    const storageRef = ref(storage, `${kind}/${postId}/${part}/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
}

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


