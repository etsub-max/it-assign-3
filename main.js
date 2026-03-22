let cardInserted = false;

let users = [
  { name: "Evan David", pin: "1216", balance: 5000, history: [] },
  { name: "Abebe Kebede", pin: "1987", balance: 10000, history: [] }
];

let currentUser = null;
let attempts = 0;
let locked = false;
let prevScreen = null;
let currentLang = "en";

// LANGUAGE TEXTS
const translations = {
  en: {
    welcome: "Welcome to LCCS Bank",
    insert: "Please insert your ATM card",
    pin: "Enter Your PIN",
    deposit: "Deposit",
    withdraw: "Withdraw",
    borrow: "Borrow",
    balance: "Balance",
    history: "History",
    exit: "Exit",
    noTransactions: "No transactions",
    invalidAmount: "Invalid amount",
    notEnough: "Not enough money",
    atmLocked: "ATM locked. Wait 2 minutes."
  },
  am: {
    welcome: "እንኳን ወደ LCCS ባንክ በደህና መጡ",
    insert: "እባክዎ ካርድዎን ያስገቡ",
    pin: "ፒን ያስገቡ",
    deposit: "ገንዘብ አስገባ",
    withdraw: "ገንዘብ አውጣ",
    borrow: "ብድር ውሰድ",
    balance: "ሂሳብ",
    history: "ታሪክ",
    exit: "ውጣ",
    noTransactions: "ምንም ግብዓት የለም",
    invalidAmount: "የተሳሳተ መጠን",
    notEnough: "በቂ ገንዘብ የለም",
    atmLocked: "ATM ተዘግቷል። 2 ደቂቃ ቆይ"
  },
  or: {
    welcome: "Baga nagaan dhuftan",
    insert: "Kaardii galchi",
    pin: "PIN galchi",
    deposit: "Galchi",
    withdraw: "Maallaqa baasi",
    borrow: "Liqa fudhadhu",
    balance: "Haftee",
    history: "Seenaa",
    exit: "Baasi",
    noTransactions: "Malli hin jiru",
    invalidAmount: "Maallaqa sirrii miti",
    notEnough: "Maallaqa gahaa miti",
    atmLocked: "ATM cufame. Daqiiqaa 2 eegi"
  },
  ti: {
    welcome: "እንቋዕ ብደሓን መጻእኩም",
    insert: "ካርድ ኣእትዉ",
    pin: "PIN ኣእትዉ",
    deposit: "ኣእትዉ",
    withdraw: "ገንዘብ ኣውጺ",
    borrow: "ልቓሕ",
    balance: "ሚዛን",
    history: "ታሪክ",
    exit: "ኣውጺ",
    noTransactions: "ታሪክ የለም",
    invalidAmount: "ትክክለኛ መጠን የለም",
    notEnough: "በቂ ገንዘብ የለም",
    atmLocked: "ATM ተዘግቷል። 2 ደቂቃ ቆይ"
  }
};

// INSERT CARD → GO TO LANGUAGE
document.getElementById("startBtn").onclick = () => {
  cardInserted = true;
  show("languageScreen");
};

// SET LANGUAGE
function setLanguage(lang){
  currentLang = lang;
  document.querySelector(".moving-title").innerText = translations[lang].welcome;
  document.querySelector(".insert-text").innerText = translations[lang].insert;
  document.getElementById("pinTitle").innerText = translations[lang].pin;

  document.getElementById("depositBtn").innerText = translations[lang].deposit;
  document.getElementById("withdrawBtn").innerText = translations[lang].withdraw;
  document.getElementById("borrowBtn").innerText = translations[lang].borrow;
  document.getElementById("balanceBtn").innerText = translations[lang].balance;
  document.getElementById("historyBtn").innerText = translations[lang].history;
  document.getElementById("exitBtn").innerText = translations[lang].exit;

  show("pinScreen");
}

// SCREEN SWITCH
function show(id){
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
  prevScreen = id;
}

// BACK BUTTON
function goBack(){
  if(prevScreen === "languageScreen") show("startScreen");
  else if(prevScreen === "pinScreen") show("languageScreen");
  else if(prevScreen === "depositScreen" || prevScreen === "withdrawScreen" || prevScreen === "borrowScreen") show("menuScreen");
  else show("menuScreen");
}

// KEYPAD SETUP
function setupKeypad(id,input,callback){
  let k = document.getElementById(id);
  let i = document.getElementById(input);
  k.innerHTML = `
    <button>1</button><button>2</button><button>3</button>
    <button>4</button><button>5</button><button>6</button>
    <button>7</button><button>8</button><button>9</button>
    <button>C</button><button>0</button><button>OK</button>
  `;
  k.addEventListener("click", e=>{
    if(e.target.tagName!=="BUTTON") return;
    let v = e.target.innerText;
    if(v==="C") i.value="";
    else if(v==="OK") callback(i.value);
    else i.value += v;
  });
}

// PIN ENTRY LOGIC
setupKeypad("pinKeypad","pinInput",(val)=>{
  if(!cardInserted){ alert(translations[currentLang].insert); return; }
  if(locked){ document.getElementById("pinMsg").innerText = translations[currentLang].atmLocked; return; }

  currentUser = users.find(user => user.pin === val);

  if(currentUser){
    attempts = 0;
    show("menuScreen");
    document.getElementById("menuTitle").innerText = "Welcome, " + currentUser.name;
  } else {
    attempts++;
    document.getElementById("pinMsg").innerText = "Wrong PIN (" + attempts + "/3)";
    if(attempts >= 3){
      locked = true;
      document.getElementById("pinMsg").innerText = translations[currentLang].atmLocked;
      setTimeout(()=>{
        locked = false;
        attempts = 0;
        document.getElementById("pinMsg").innerText = "Try again.";
      }, 120000); // 2 minutes
    }
  }
  document.getElementById("pinInput").value="";
});

// MENU FUNCTIONS
function checkBalance(){
  document.getElementById("output").innerText = "Balance: " + currentUser.balance;
}
function showHistory(){
  document.getElementById("output").innerHTML = currentUser.history.length ? currentUser.history.join("<br>") : translations[currentLang].noTransactions;
}

// EXIT
function exitATM(){
  document.getElementById("output").innerText = "";
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));

  const thankScreen = document.createElement("div");
  thankScreen.className = "screen active thank-you";
  thankScreen.innerHTML = `<h2>Thank you for using LCCS Bank</h2>
                           <p>Please take your ATM card</p>`;
  document.querySelector(".atm").appendChild(thankScreen);

  setTimeout(() => {
    thankScreen.remove();
    cardInserted = false;
    currentUser = null;
    attempts = 0;
    locked = false;
    show("startScreen");
    document.getElementById("pinMsg").innerText = "";
    document.getElementById("pinInput").value = "";
    document.getElementById("depositInput").value = "";
    document.getElementById("withdrawInput").value = "";
    document.getElementById("borrowInput").value = "";
    document.getElementById("output").innerText = "";
  }, 5000);
}

// TRANSACTIONS
setupKeypad("depositKeypad","depositInput",(v)=>{
  let amt = Number(v);
  if(isNaN(amt) || amt<=0){ alert(translations[currentLang].invalidAmount); return; }
  currentUser.balance += amt;
  currentUser.history.push("Deposit +" + amt);
  show("menuScreen");
});

setupKeypad("withdrawKeypad","withdrawInput",(v)=>{
  let amt = Number(v);
  if(isNaN(amt) || amt<=0){ alert(translations[currentLang].invalidAmount); return; }
  if(amt > currentUser.balance){ alert(translations[currentLang].notEnough); return; }
  currentUser.balance -= amt;
  currentUser.history.push("Withdraw -" + amt);
  show("menuScreen");
});

setupKeypad("borrowKeypad","borrowInput",(v)=>{
  let amt = Number(v);
  if(isNaN(amt) || amt<=0){ alert(translations[currentLang].invalidAmount); return; }
  currentUser.balance += amt;
  currentUser.history.push("Borrow +" + amt);
  show("menuScreen");
});