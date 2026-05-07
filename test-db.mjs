import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCHJZXueo2ZUvrewVJbZ4MqM7n0D6fmMS8",
  authDomain: "barbeque-nation-89ace.firebaseapp.com",
  databaseURL: "https://barbeque-nation-89ace-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "barbeque-nation-89ace",
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

get(ref(db, "bookings")).then(snap => {
   console.log(JSON.stringify(snap.val(), null, 2));
   process.exit(0);
});
