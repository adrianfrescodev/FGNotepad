
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
function goHome(){
    data[currentCharacter][currentTab] = userNotes.value;
    currentCharacter = "";
    homepage.classList.remove("hidden");
    characterScreen.classList.add("hidden");
}
const banner = document.getElementById("banner")
banner.addEventListener("click", (e) =>{
    goHome()
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
    userNotes.placeholder = tabmap[currentTab];
    userNotes.value = data[currentCharacter][currentTab];
    currentCharacterDisplay.textContent = newChar.value;
    currentCharacterPicture.src = "Images/" + newChar.value + "-full.png";
    homepage.classList.add("hidden");
    characterScreen.classList.remove("hidden");

}
function switchTab(newtab){
    data[currentCharacter][currentTab] = userNotes.value;
    currentTab = newtab.value;
    userNotes.placeholder = tabmap[newtab.value];
    userNotes.value = data[currentCharacter][currentTab];
    
}
