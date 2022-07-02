import { initializeApp } from "firebase/app";
import { getFunctions, httpsCallable } from "firebase/functions";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getFirestore,
  setDoc,
  getDoc,
  writeBatch,
  collection,
  getDocs,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  increment,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDz5xYmuazsEnxQCZg6PR6FPiXh_mIY4ig",
  authDomain: "crown-db-15d7d.firebaseapp.com",
  projectId: "crown-db-15d7d",
  storageBucket: "crown-db-15d7d.appspot.com",
  messagingSenderId: "233837945121",
  appId: "1:233837945121:web:ecf9e6569ba41995349e60",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore();

export const SignUpWithEmailHelper = async (name, surname, email, password) => {
  const response = await createUserWithEmailAndPassword(auth, email, password);
  const updateRes = await updateProfile(auth.currentUser, {
    displayName: name,
  });
  const docRef = doc(db, "users", response.user.uid);
  const result = await setDoc(docRef, {
    name,
    surname,
    email,
    password,
  });
  sendEmailVerification(auth.currentUser).then(() => {
    console.log("sent");
  });
};

export const SignInWithEmailHelper = async (email, password) => {
  const response = await signInWithEmailAndPassword(auth, email, password);

  const docRef = doc(db, "users", response.user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data().name;
  } else {
    console.log("No such document!");
    return null;
  }
};

export const SignOutHelper = async () => {
  return await signOut(auth);
};

export const onAuthStateChangedListener = (func) => onAuthStateChanged(auth, func);

export const uploadStories = async (stories) => {
  const batch = writeBatch(db);

  stories.forEach((story) => {
    const collectionRef = collection(db, story.title.toLowerCase());
    story.sentences.forEach((sentence) => {
      const docRef = doc(collectionRef, sentence.id);
      batch.set(docRef, sentence);
    });
  });

  await batch.commit();

  console.log("done");
};

export const getStoryFromFirestore = async (title) => {
  const q = query(collection(db, title));

  const querySnapshot = await getDocs(q);
  const sentences = [];
  querySnapshot.forEach((doc) => {
    sentences.push(doc.data());
  });
  return sentences;
};

export const getStoryTitles = async () => {
  const querySnapshot = await getDocs(collection(db, "listOfCollections"));
  return querySnapshot.docs.map((doc) => doc.id);
};

export const addSentenceToStory = async (randomID, sentence, index, storyTitle, name, authorID) => {
  const q = query(collection(db, storyTitle), where("index", ">=", index));

  getDocs(q).then((query) => {
    query.docs.forEach(async (sentence) => {
      const ref = doc(db, storyTitle, sentence.id);
      if (sentence.id !== randomID) {
        await updateDoc(ref, {
          index: increment(1),
        });
      }
    });
  });

  const docRef = doc(db, storyTitle, randomID);
  const result = await setDoc(docRef, {
    id: randomID,
    index: index,
    content: sentence,
    authorID: authorID,
    authorName: name,
    upvotes: [],
    downvotes: [],
  });
};

export const editSentence = async (storyTitle, sentenceID, newContent) => {
  const ref = doc(db, storyTitle, sentenceID);
  return await updateDoc(ref, {
    content: newContent,
  });
};

export const deleteSentence = async (storyTitle, sentenceID, index) => {
  const q = query(collection(db, storyTitle), where("index", ">=", index));

  getDocs(q).then((query) => {
    if (query.docs.length === 0) return;
    query.docs.forEach(async (sentence) => {
      const ref = doc(db, storyTitle, sentence.id);
      if (sentence.id !== sentenceID) {
        await updateDoc(ref, {
          index: increment(-1),
        });
      }
    });
  });

  return await deleteDoc(doc(db, storyTitle, sentenceID));
};

export const upvoteSentence = async (sentenceID, storyTitle, userID, removeOtherVote) => {
  const ref = doc(db, storyTitle, sentenceID);
  if (removeOtherVote)
    await updateDoc(ref, {
      downvotes: arrayRemove(userID),
    });
  return await updateDoc(ref, {
    upvotes: arrayUnion(userID),
  });
};

export const downvoteSentence = async (sentenceID, storyTitle, userID, removeOtherVote) => {
  const ref = doc(db, storyTitle, sentenceID);
  if (removeOtherVote)
    await updateDoc(ref, {
      upvotes: arrayRemove(userID),
    });
  return await updateDoc(ref, {
    downvotes: arrayUnion(userID),
  });
};

export const removeVote = async (sentenceID, storyTitle, userID, category) => {
  const ref = doc(db, storyTitle, sentenceID);
  const field = category === "upvotes" ? "upvotes" : "downvotes";
  return await updateDoc(ref, {
    [field]: arrayRemove(userID),
  });
};

export const addStory = async (sentence, storyTitle) => {
  const collectionRef = collection(db, storyTitle.toLowerCase());
  const docRef = doc(collectionRef, sentence.id);

  const result = await setDoc(docRef, sentence);

  const ref = doc(db, "listOfCollections", storyTitle);
  const res = await setDoc(ref, {});
  console.log("done");
};

export const deleteStory = async (path) => {
  const functions = getFunctions(app);
  const deleteFn = httpsCallable(functions, "recursiveDelete");
  const res = await deleteFn({ path: path });
  return JSON.stringify(res);

  //need to enable functions which is not free
};
