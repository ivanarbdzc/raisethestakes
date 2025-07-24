const players = [];
const scores = {};

const easyCategories = ["Fruits", "Colors", "Countries", "Pizza toppings", "Cartoon characters", "Ice cream flavors"];
const hardCategories = ["Oscar-winning movies", "European rivers", "Rare Pokémon", "Space missions", "Classical composers", "Historical treaties"];

function addPlayer() {
  const nameInput = document.getElementById('playerName');
  const name = nameInput.value.trim();
  if (name && !players.includes(name)) {
    players.push(name);
    scores[name] = 0;
    nameInput.value = '';
    renderPlayers();
  }
}

function renderPlayers() {
  const list = document.getElementById('playerList');
  list.innerHTML = '';
  players.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p;
    list.appendChild(li);
  });
}

function startGame() {
  if (players.length < 2) {
    alert("Need at least 2 players to start!");
    return;
  }
  document.getElementById('lobby').classList.add('hidden');
  document.getElementById('gameArea').classList.remove('hidden');
  nextRound();
  updateScoreboard();
}

function nextRound() {
  const easy = easyCategories[Math.floor(Math.random() * easyCategories.length)];
  const hard = hardCategories[Math.floor(Math.random() * hardCategories.length)];
  document.getElementById('easyCat').textContent = easy;
  document.getElementById('hardCat').textContent = hard;

  const bidderSelect = document.getElementById('bidderSelect');
  const stealSelect = document.getElementById('stealSelect');
  bidderSelect.innerHTML = '';
  stealSelect.innerHTML = '';

  players.forEach(p => {
    const opt1 = document.createElement('option');
    opt1.value = opt1.textContent = p;
    const opt2 = document.createElement('option');
    opt2.value = opt2.textContent = p;
    bidderSelect.appendChild(opt1);
    stealSelect.appendChild(opt2);
  });
}

function markFinished(difficulty) {
  const name = document.getElementById('bidderSelect').value;
  const points = difficulty === 'easy' ? 1 : 2;
  scores[name] += points;
  updateScoreboard();
}

function markFailed() {
  const name = document.getElementById('bidderSelect').value;
  scores[name] -= 1;
  updateScoreboard();
}

function markSteal() {
  const name = document.getElementById('stealSelect').value;
  scores[name] += 1;
  updateScoreboard();
}

function updateScoreboard() {
  const board = document.getElementById('scoreboard');
  board.innerHTML = '';
  players.forEach(p => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${p}</strong>: ${scores[p]} points`;
    board.appendChild(li);
  });
}
