// 52장 카드 덱 생성 및 셔플
let deck = [];

function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  deck = [];
  for (const suit of suits) {
    for (const value of values) {
      deck.push(value + suit);
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCard() {
  if (deck.length === 0) {
    alert("덱이 다 떨어졌습니다! 새로 셔플합니다.");
    createDeck();
    shuffleDeck();
  }
  return deck.pop();
}

function getCardValue(card) {
  const value = card.slice(0, -1);
  if (value === "A") return 11;
  if (["K", "Q", "J"].includes(value)) return 10;
  return parseInt(value);
}

function calculateScore(cards) {
  let score = 0;
  let aceCount = 0;
  for (const card of cards) {
    let val = getCardValue(card);
    if (val === 11) aceCount++;
    score += val;
  }
  while (score > 21 && aceCount > 0) {
    score -= 10;
    aceCount--;
  }
  return score;
}

function renderCard(card) {
  const cardDiv = document.createElement("div");
  cardDiv.classList.add("card");
  const suit = card.slice(-1);
  if (suit === "♥" || suit === "♦") {
    cardDiv.classList.add("red");
  } else {
    cardDiv.classList.add("black");
  }
  cardDiv.textContent = card;
  return cardDiv;
}

function updateHands(hideDealerSecondCard = true) {
  const playerCardsDiv = document.getElementById("player-cards");
  const dealerCardsDiv = document.getElementById("dealer-cards");
  const playerTotalSpan = document.getElementById("player-total");
  const dealerTotalSpan = document.getElementById("dealer-total");

  playerCardsDiv.innerHTML = "";
  playerCards.forEach(card => playerCardsDiv.appendChild(renderCard(card)));

  dealerCardsDiv.innerHTML = "";
  if (hideDealerSecondCard && dealerCards.length > 1) {
    dealerCardsDiv.appendChild(renderCard(dealerCards[0]));
    const cardBack = document.createElement("div");
    cardBack.classList.add("card", "card-back");
    cardBack.textContent = "?";
    dealerCardsDiv.appendChild(cardBack);
    dealerTotalSpan.textContent = getCardValue(dealerCards[0]);
  } else {
    dealerCards.forEach(card => dealerCardsDiv.appendChild(renderCard(card)));
    dealerTotalSpan.textContent = dealerScore;
  }

  playerTotalSpan.textContent = playerScore;
}

function updateStatus(message, color = "black") {
  const statusDiv = document.getElementById("status");
  statusDiv.textContent = message;
  statusDiv.style.color = color;
}

function setButtons(start, hit, doubleDown, stand) {
  document.getElementById("start-btn").disabled = !start;
  document.getElementById("hit-btn").disabled = !hit;
  document.getElementById("double-btn").disabled = !doubleDown;
  document.getElementById("stand-btn").disabled = !stand;
}

function showCreditChangeMessage(buttonId, msg) {
  const messageDiv = document.getElementById(buttonId + "-credit-change");
  if (!messageDiv) return;
  messageDiv.textContent = msg;
  messageDiv.style.opacity = "1";
  setTimeout(() => {
    messageDiv.style.opacity = "0";
    messageDiv.textContent = "";
  }, 500);
}

function endRound(result, isDoubleDown = false) {
  let message = "";
  let color = "black";
  let score = 0;

  if (result === "player_bust") {
    message = "버스트! 당신이 졌습니다.";
    color = "red";
    score = 0;

  } else if (result === "dealer_bust" || result === "player_win") {
    const creditWon = isDoubleDown ? DOUBLE_WIN_CREDIT : WIN_CREDIT;
    message = `당신이 이겼습니다! + ${creditWon} 크레딧`;
    color = "green";
    credits += creditWon;
    score = creditWon;

  } else if (result === "dealer_win") {
    message = "딜러가 이겼습니다.";
    color = "red";
    score = 0;

  } else if (result === "tie") {
    const creditReturn = isDoubleDown ? BET_CREDIT * 2 : TIE_CREDIT;
    message = `무승부입니다. + ${creditReturn} 크레딧 (반환)`;
    color = "green";
    credits += creditReturn;
    score = creditReturn;
  }

  // 화면과 로컬 저장소에 반영
  updateStatus(message, color);
  updateCredits();
  setButtons(true, false, false, false);
  gameInProgress = false;
  saveScore(score);
  syncCreditToDB();

}

function updateCredits() {
  document.getElementById("credits").textContent = credits;
  document.getElementById("bet-credit").textContent = BET_CREDIT;
  document.getElementById("win-credit").textContent = WIN_CREDIT;
  document.getElementById("tie-credit").textContent = TIE_CREDIT;
  document.getElementById("double-win-credit").textContent = DOUBLE_WIN_CREDIT;
}

function dealerTurn(isDoubleDown = false) {
  while (dealerScore < 17) {
    dealerCards.push(drawCard());
    dealerScore = calculateScore(dealerCards);
    updateHands(false);
  }
  if (dealerScore > 21) {
    endRound("dealer_bust", isDoubleDown);
  } else if (dealerScore > playerScore) {
    endRound("dealer_win", isDoubleDown);
  } else if (dealerScore < playerScore) {
    endRound("player_win", isDoubleDown);
  } else {
    endRound("tie", isDoubleDown);
  }
}

function playerHit() {
  playerCards.push(drawCard());
  playerScore = calculateScore(playerCards);
  updateHands();
  if (playerScore > 21) endRound("player_bust");
}

function playerStand(isDoubleDown = false) {
  updateHands(false);
  dealerScore = calculateScore(dealerCards);
  dealerTurn(isDoubleDown);
}

function playerDoubleDown() {
  if (credits < BET_CREDIT) {
    alert("크레딧이 부족합니다.");
    return;
  }
  credits -= BET_CREDIT;
  updateCredits();
  showCreditChangeMessage("double", `-${BET_CREDIT}`);
  playerCards.push(drawCard());
  playerScore = calculateScore(playerCards);
  updateHands();
  if (playerScore > 21) {
    endRound("player_bust", true);
  } else {
    playerStand(true);
  }
}

function startGame() {
  if (credits < BET_CREDIT) {
    alert("크레딧이 부족합니다.");
    return;
  }
  credits -= BET_CREDIT;
  updateCredits();
  showCreditChangeMessage("start", `-${BET_CREDIT}`);
  gameInProgress = true;
  updateStatus("게임 진행 중...");
  createDeck();
  shuffleDeck();
  playerCards = [drawCard(), drawCard()];
  dealerCards = [drawCard(), drawCard()];
  playerScore = calculateScore(playerCards);
  dealerScore = calculateScore(dealerCards);
  updateHands();
  setButtons(false, true, true, true);
}

function saveScore(score) {
  const memberId = localStorage.getItem("memberId");
  const gameName = "블랙잭";
  fetch("/api/game/record", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId, gameName, currentScore: score })
  })
      .then(res => res.text())
      .then(msg => console.log("점수 저장 완료:", msg))
      .catch(err => console.error("점수 저장 실패:", err));
}

function updateCreditInDB(amount) {
  const memberId = localStorage.getItem("memberId");

  fetch("/api/game/updateCredit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId, amount })
  })
      .then(res => res.json())
      .then(data => {
        credits = data.updatedCredit;
        localStorage.setItem("memberCredit", credits);
        updateCredits(); // 화면 반영
      })
      .catch(err => console.error("크레딧 DB 반영 실패:", err));
}

function syncCreditToDB() {
  const memberId = localStorage.getItem("memberId");

  fetch("/api/game/syncCredit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      memberId,
      credit: credits
    })
  })
      .then(res => res.text())
      .then(msg => console.log("크레딧 동기화 완료:", msg))
      .catch(err => console.error("크레딧 동기화 실패:", err));
}

document.getElementById("backToMainBtn").addEventListener("click", () => {
  const memberId = localStorage.getItem("memberId");
  if (!memberId) {
    alert("로그인 정보가 없습니다.");
    window.location.href = "/";
    return;
  }
  fetch(`/member/gameLogin?memberId=${memberId}`)
      .then(res => res.json())
      .then(user => {
        localStorage.setItem("memberCredit", user.memberCredit);
        localStorage.setItem("memberName", user.memberName);
        localStorage.setItem("memberRole", user.memberRole);
        window.location.href = `/ygstory/html/index.html` +
            `?memberId=${user.memberId}` +
            `&memberName=${encodeURIComponent(user.memberName)}` +
            `&memberCredit=${user.memberCredit}` +
            `&memberRole=${user.memberRole}`;
      })
      .catch(() => {
        alert("크레딧 정보를 불러오는 데 실패했습니다.");
        window.location.href = "/";
      });
});

function getCurrentCredit() {
  return parseInt(document.getElementById("credits").innerText, 10) || 0;
}

function updateCredit(newCredit) {
  document.getElementById("credits").innerText = newCredit;
  localStorage.setItem("memberCredit", newCredit.toString());
}

const BET_CREDIT = 5;
const WIN_CREDIT = 10;
const TIE_CREDIT = 5;
const DOUBLE_WIN_CREDIT = 20;

let credits = parseInt(localStorage.getItem("memberCredit")) || 0;
let gameInProgress = false;
let playerCards = [];
let dealerCards = [];
let playerScore = 0;
let dealerScore = 0;

updateCredits();
setButtons(true, false, false, false);
updateStatus("게임을 시작하려면 [시작] 버튼을 누르세요.");

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("hit-btn").addEventListener("click", () => {
  if (gameInProgress) playerHit();
});
document.getElementById("double-btn").addEventListener("click", () => {
  if (gameInProgress) playerDoubleDown();
});
document.getElementById("stand-btn").addEventListener("click", () => {
  if (gameInProgress) playerStand();
});
function updateCreditInDB(amount) {
  const memberId = localStorage.getItem("memberId");

  fetch("/api/game/updateCredit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ memberId, amount })
  })
      .then(res => res.json())
      .then(data => {
        credits = data.updatedCredit;
        localStorage.setItem("memberCredit", credits);
        updateCredits(); // 화면 반영
      })
      .catch(err => console.error("크레딧 DB 반영 실패:", err));
}