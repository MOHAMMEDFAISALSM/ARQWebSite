import { db, storage, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, ref, uploadBytes, getDownloadURL } from "./firebase/firebaseconfig";

// 🔹 Reference to Firestore Collection
const eventsCollection = collection(db, "events");

// 🔹 Function to Upload Image and Get URL
const uploadImage = async (file) => {
  const storageRef = ref(storage, `event_images/${file.name}`);
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
};

// 🔹 Function to Add Event
export const addEvent = async (eventData, file) => {
  try {
    const imageUrl = await uploadImage(file);
    eventData.image = imageUrl;
    await addDoc(eventsCollection, eventData);
    console.log("Event Added Successfully!");
  } catch (error) {
    console.error("Error adding event:", error);
  }
};
