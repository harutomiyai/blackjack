// Blackjack game logic with card images
let playerCards = [];
let dealerCards = [];
let gameOver = false;
let money = 1000;

const suits = ['s', 'h', 'd', 'k'];
const faces = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];

function faceNumber(face) {
  if (face === 'A') return '01';
  if (face === 'J') return '11';
  if (face === 'Q') return '12';
  if (face === 'K') return '13';
  return String(face).padStart(2, '0');
}

function getCard() {
  const suit = suits[Math.floor(Math.random() * suits.length)];
  const face = faces[Math.floor(Math.random() * faces.length)];
  const value = face === 'A' ? 11 : (['J', 'Q', 'K'].includes(face) ? 10 : face);
  const img = `img/${suit}${faceNumber(face)}@2x.png`;
  return { suit, face, value, img };
}

function calcScore(cards) {
  let total = cards.reduce((sum, c) => sum + c.value, 0);
  let aces = cards.filter(c => c.face === 'A').length;
  while (total > 21 && aces--) total -= 10;
  return total;
}

function renderCards(elId, cards) {
  const el = document.getElementById(elId);
  el.innerHTML = '';
  for (const c of cards) {
    const card = document.createElement('img');
    card.className = 'card inline-block rounded shadow';
    card.src = c.hidden ? 'img/back@2x.png' : c.img;
    card.alt = c.hidden ? 'back' : `${c.face}${c.suit}`;
    card.style.width = '80px';
    el.appendChild(card);
    requestAnimationFrame(() => card.classList.add('show'));
  }
}

function hit() {
  if (gameOver) return;
  playerCards.push(getCard());
  updateUI();
  if (calcScore(playerCards) > 21) endGame();
}

function stand() {
  if (gameOver) return;
  while (calcScore(dealerCards) < 17) {
    dealerCards.push(getCard());
  }
  endGame();
}

function endGame() {
  gameOver = true;
  const ps = calcScore(playerCards);
  const ds = calcScore(dealerCards);
  const bet = parseInt(document.getElementById('bet').value);
  let result = '';

  if (ps > 21) result = '😢 バースト！負け。', money -= bet;
  else if (ds > 21 || ps > ds) result = '🎉 あなたの勝ち！', money += bet;
  else if (ps < ds) result = '😩 あなたの負け。', money -= bet;
  else result = '🤝 引き分け。';

  document.getElementById('result-message').textContent = result;
  document.getElementById('money').textContent = money;
  updateUI();
}

function startGame() {
  if (money <= 0) {
    alert('お金がありません！');
    return;
  }
  playerCards = [getCard(), getCard()];
  dealerCards = [getCard(), getCard()];
  gameOver = false;
  document.getElementById('result-message').textContent = '';
  updateUI();
}

function updateUI() {
  renderCards('player-cards', playerCards);
  renderCards('dealer-cards', gameOver ? dealerCards : [dealerCards[0], { hidden: true }]);
  document.getElementById('player-score').textContent = `得点: ${calcScore(playerCards)}`;
  document.getElementById('dealer-score').textContent = gameOver ? `得点: ${calcScore(dealerCards)}` : '';
}

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#coin-select .coin').forEach(c => {
    c.addEventListener('click', () => {
      document.getElementById('bet').value = c.dataset.value;
    });
  });
  startGame();
});
