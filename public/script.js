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
const data = {}
login.addEventListener('click', () => {
  signInWithPopup(auth, provider)
    .then((result) => {
    })
    .catch((error) => {
      alert("Login failed");
    }
    )
})
logout.addEventListener('click', async () => {
  await setnotes(currentuser.uid)

  await signOut(auth);
  document.querySelectorAll('label[data-custom="true"]').forEach(char => char.remove());

  for (const name in data) {
    if (data[name]._custom === true) {
      delete data[name];
    }
  }
  location.reload();
})

async function setnotes(userid) {
  const docRef = doc(db, "users", userid);
  await setDoc(docRef, data);
}
async function loadnotes(userid) {
  const docRef = doc(db, "users", userid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    Object.assign(data, docSnap.data());
  } else {
    console.log("No such document!");
  }
}

onAuthStateChanged(auth, async (user) => {
  if (user) {
    logout.classList.remove("hidden");
    login.classList.add("hidden");
    currentuser = user;
    await loadnotes(user.uid);
    for (const name in data) {
      if (!('_custom' in data[name])) {
        data[name]._custom = false;
      }
    }
    for (const name in data) {
      if (data[name]._custom === true) {
        quickmake(name);
      }
    }

  } else {
    logout.classList.add("hidden");
    login.classList.remove("hidden");
  }
})
let homepage = document.getElementById("home");
let characterScreen = document.getElementById("char-screen");
let currentTab = "general";
let currentCharacterDisplayPc = document.getElementById("currentcharpc");
let currentCharacterDisplayMobile = document.getElementById("currentcharmobile");
let currentCharacter = "";
let currentCharacterPicture = document.getElementById("currentpic");
const selects = document.querySelectorAll("input[name='character']");
selects.forEach(selection => {
  selection.addEventListener('click', (e) => {
    loadChar(e.target);
  })
})
const tabmap = {
  general: "General notes",
  "key-moves": "Key Moves",
  combos: "Combos"
}
let quills = {};
const openTabs = new Set();
const tabs = document.querySelectorAll("input[name='tab']");
tabs.forEach(tab => {
  tab.addEventListener('click', (e) => {
    const tab = e.target.value;
    currentTab = tab;
    if (openTabs.has(tab)) {
      data[currentCharacter][tab] = quills[tab].root.innerHTML;
      const wrap = document.getElementById(`editor-${tab}`);
      wrap.remove();
      delete quills[tab];
      openTabs.delete(tab);
      if (openTabs.size === 0) {
        const placeholder = document.createElement("div");
        placeholder.id = "tab-placeholder";
        placeholder.classList.add("tab-placeholder");
        placeholder.textContent = "Select a tab to begin editing.";
        document.getElementById("quillbox").appendChild(placeholder);
      }
      const keyBox = document.getElementById("editor-key-moves");
      if (keyBox && openTabs.size === 1) {
        keyBox.style.width = "100%";
        keyBox.style.maxWidth = "100%";
      }
      else {
        keyBox.style.maxWidth = "35%";
      }
    }
    else {
      const placeholder = document.getElementById("tab-placeholder");
      if (placeholder) placeholder.remove();
      let box = document.getElementById("quillbox");

      const holder = document.createElement("div");
      holder.id = `editor-${tab}`;
      holder.classList.add("editor-box");
      const title = document.createElement("div");
      title.classList.add("editor-title");
      title.textContent = `${tabmap[tab]}`;
      holder.appendChild(title);
      box.appendChild(holder);
      const quillContainer = document.createElement("div");
      quillContainer.id = `quill-container-${tab}`;
      holder.appendChild(quillContainer);

      const quill = new Quill(`#quill-container-${tab}`, {
        theme: 'bubble',
        placeholder: tabmap[tab]
      })

      quill.root.innerHTML = data[currentCharacter][tab] || "";
      quills[tab] = quill;
      openTabs.add(tab);
      const keyBox = document.getElementById("editor-key-moves");
      if (keyBox && openTabs.size === 1) {
        keyBox.style.width = "100%";
        keyBox.style.maxWidth = "100%";
      }
      else {
        keyBox.style.maxWidth = "35%";
      }
    }

  })
})
async function goHome() {
  if (currentCharacter) {
    Object.keys(quills).forEach(tab => {
      data[currentCharacter][tab] = quills[tab].root.innerHTML;
    })
  }
  if (currentuser) {
    await setnotes(currentuser.uid);
  }
  Object.keys(quills).forEach(tab => {
    const wrap = document.getElementById(`editor-${tab}`);
    if (wrap) wrap.remove();
    delete quills[tab];
    openTabs.delete(tab);
  })
  const placeholder = document.getElementById("tab-placeholder");
  if (placeholder) placeholder.remove();
  currentCharacter = "";
  homepage.classList.remove("hidden");
  characterScreen.classList.add("hidden");
  document.querySelectorAll("input[name='tab']").forEach(tab => {
    tab.checked = false;

  })
}
const banner = document.getElementById("banner")
banner.addEventListener("click", async () => {
  await goHome()
})
function loadChar(newChar) {
  Object.keys(quills).forEach(tab => {
    const wrap = document.getElementById(`editor-${tab}`);
    if (wrap) wrap.remove();
    delete quills[tab];
    openTabs.delete(tab);
  });
  currentCharacter = newChar.value;
  if (!data[newChar.value]) {
    data[newChar.value] = {
      general: "",
      "key-moves": "",
      combos: "",
      _custom: false
    }
  }
  currentTab = "general";
  document.getElementById("general").checked = true;
  const box = document.getElementById("quillbox");
  const holder = document.createElement("div");
  holder.id = "editor-general";
  holder.classList.add("editor-box");
  box.appendChild(holder);
  const title = document.createElement("div");
  title.classList.add("editor-title");
  title.textContent = "General";
  holder.appendChild(title);
  const quillContainer = document.createElement("div");
  quillContainer.id = "quill-container-general";
  holder.appendChild(quillContainer);
  box.appendChild(holder);
  const quill = new Quill(`#quill-container-general`, {
    theme: 'bubble',
    placeholder: tabmap["general"]
  });
  quill.root.innerHTML = data[currentCharacter]["general"];
  quills["general"] = quill;
  openTabs.add("general");
  currentCharacterDisplayPc.textContent = newChar.value;
  currentCharacterDisplayMobile.textContent = newChar.value;
  currentCharacterPicture.src = "Images/" + newChar.value + "-full.png";
  currentCharacterPicture.onerror = () => {
    currentCharacterPicture.src = "Images/default.png";
  }
  homepage.classList.add("hidden");
  characterScreen.classList.remove("hidden");
}
document.addEventListener("beforeunload", () => {
  if (currentuser) {
    setnotes(currentuser.uid);
  }

})
document.addEventListener("visibilitychange", async () => {
  if (document.visibilityState === "hidden" && currentuser) {
    await setnotes(currentuser.uid);
  }
})
const addChar = document.getElementsByName("new")[0];
addChar.addEventListener("click", () => {
  document.getElementById("overlay").classList.remove("hidden");
  document.getElementById("newcharname").focus()
})
const cancelbtn = document.getElementById("cancelchar");
const savebtn = document.getElementById("savechar");
cancelbtn.addEventListener("click", () => {
  document.getElementById("overlay").classList.add("hidden");
})

savebtn.addEventListener("click", (e) => {
  createCharacter(document.getElementById("newcharname").value);
})
async function createCharacter(name) {
  name = name.trim();
  const dupe = document.querySelectorAll("input[name='character']");
  for (const i of dupe) {
    if (i.value.toLowerCase() === name.toLowerCase()) {
      alert("That character already exists.");
      return;
    }
  }
  if (name === "") {
    alert("Name can not be blank.");
    return;
  }
  if (!data[name]) {
    data[name] = {
      general: "",
      "key-moves": "",
      combos: "",
      _custom: true
    }
  }

  const label = document.createElement("label");
  const text = document.createTextNode(name.charAt(0).toUpperCase() + name.slice(1));
  const input = document.createElement("input");
  const img = document.createElement("img");
  img.src = "Images/default.png";
  img.alt = name;
  input.type = "radio";
  input.name = "character";
  input.value = name;
  input.hidden = true;
  input.addEventListener("click", (e) => loadChar(e.target));
  label.appendChild(text);
  label.insertBefore(img, text);
  label.appendChild(input);
  label.setAttribute("data-custom", "true");
  document.querySelector(".chars").appendChild(label);
  document.getElementById("overlay").classList.add("hidden");
  await setnotes(currentuser.uid);
  document.getElementById("newcharname").value = "";
}
function quickmake(name) {
  const label = document.createElement("label");
  const text = document.createTextNode(name.charAt(0).toUpperCase() + name.slice(1));
  const input = document.createElement("input");
  const img = document.createElement("img");
  img.src = "Images/default.png";
  img.alt = name;
  input.type = "radio";
  input.name = "character";
  input.value = name;
  input.hidden = true;
  input.addEventListener("click", (e) => loadChar(e.target));
  label.appendChild(text);
  label.insertBefore(img, text);
  label.appendChild(input);
  label.setAttribute("data-custom", "true");
  document.querySelector(".chars").appendChild(label);
}
