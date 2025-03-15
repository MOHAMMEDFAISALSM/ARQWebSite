import { db } from "./firebaseConfig";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";

const eventsCollection = collection(db, "events");

// 🔹 Function to Fetch All Events
export const getEvents = async () => {
  try {
    const querySnapshot = await getDocs(eventsCollection);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

// 🔹 Function to Update Event
export const updateEvent = async (id, updatedData) => {
  try {
    const eventRef = doc(db, "events", id);
    await updateDoc(eventRef, updatedData);
    console.log("Event Updated!");
  } catch (error) {
    console.error("Error updating event:", error);
  }
};

// 🔹 Function to Delete Event
export const deleteEvent = async (id) => {
  try {
    await deleteDoc(doc(db, "events", id));
    console.log("Event Deleted!");
  } catch (error) {
    console.error("Error deleting event:", error);
  }
};
