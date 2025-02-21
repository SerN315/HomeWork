import { collection, getDocs } from "firebase/firestore";
import { db } from "../services/firebase";

export const fetchCardsFromDB = async () => {
  try {
    const snapshot = await getDocs(collection(db, "cards"));
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error fetching cards:", error);
    return [];
  }
};
