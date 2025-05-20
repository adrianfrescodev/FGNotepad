import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyCnFbqk7jan3PT0rYkkBD9jaFo0gc-ahqQ",
  authDomain: "fighting-game-notepad.firebaseapp.com",
  projectId: "fighting-game-notepad",
  storageBucket: "fighting-game-notepad.firebasestorage.app",
  messagingSenderId: "354413999025",
  appId: "1:354413999025:web:4cb24b581b83ba09ac0390",
  measurementId: "G-9N1R7YW8QP"
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
let currentuser = null;
let logout = document.getElementById("logoutbutton");
let login = document.getElementById("loginbutton");

login.addEventListener('click', () =>{
    signInWithPopup(auth, provider)
  .then((result) => {
})
    .catch((error) => {
    alert("Login failed");
    }
)
})
logout.addEventListener('click', () =>
{
    signOut(auth).then(() => {
    location.reload();
})
}
)
async function setnotes(userid){
    const docRef = doc(db, "users", userid);
    await setDoc(docRef, data);
}
async function loadnotes(userid){
    const docRef = doc(db, "users", userid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
    Object.assign(data, docSnap.data());
} else {

  console.log("No such document!");
}
}

onAuthStateChanged (auth, async (user) => {
  if (user) {
    logout.classList.remove("hidden");
    login.classList.add("hidden");
    currentuser = user;
    await loadnotes(user.uid);
  } else {
    logout.classList.add("hidden");
    login.classList.remove("hidden");
  }
})

let homepage = document.getElementById("home");
let characterScreen = document.getElementById("char-screen");
let currentTab = "general";
let currentCharacterDisplay = document.getElementById("currentchar");
let currentCharacter = "";
let currentCharacterPicture = document.getElementById("currentpic");
const userNotes = document.getElementById("user-notes");
const selects = document.querySelectorAll("input[name='character']");
const data = {}
selects.forEach( selection => {
    selection.addEventListener('click', (e) =>{
    loadChar(e.target);
    })
})
const tabmap = {
    general: "General notes",
    "key-moves": "Key moves",
    combos: "Combos"
}
const tabs = document.querySelectorAll("input[name='tab']");
tabs.forEach( tab => {
    tab.addEventListener('click', (e) =>{
        switchTab(e.target);
    })
})
async function goHome(){
    if (currentCharacter) {
        data[currentCharacter][currentTab] = userNotes.value;
         if (currentuser){
            await setnotes(currentuser.uid);
        } 
    }
    currentCharacter = "";
    homepage.classList.remove("hidden");
    characterScreen.classList.add("hidden");
    document.querySelectorAll("input[name='tab']").forEach(tab => {
    tab.checked = false;
    
})
}
const banner = document.getElementById("banner")
banner.addEventListener("click", async () =>{
    await goHome()
})
function loadChar(newChar){
    if(currentCharacter !== ""){
        data[currentCharacter][currentTab] = userNotes.value;
    }
    currentCharacter = newChar.value;
    if(!data[newChar.value]) {
    data[newChar.value] = {
    general: "",
    "key-moves": "",
    combos: ""
  }
}
    currentTab = "general";
    document.getElementById("general").checked = true;
    userNotes.placeholder = tabmap[currentTab];
    userNotes.value = data[currentCharacter][currentTab];
    currentCharacterDisplay.textContent = newChar.value;
    currentCharacterPicture.src = "Images/" + newChar.value + "-full.png";
    homepage.classList.add("hidden");
    characterScreen.classList.remove("hidden");
}
async function switchTab(newtab){
     if(currentuser)
        {
        await setnotes(currentuser.uid);
    }
    data[currentCharacter][currentTab] = userNotes.value;
    currentTab = newtab.value;
    userNotes.placeholder = tabmap[newtab.value];
    userNotes.value = data[currentCharacter][currentTab];
}
document.addEventListener("beforeunload",() => {
   setnotes(currentuser.uid);
})

document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "hidden") {
    await setnotes(currentuser.uid);
  } 
});