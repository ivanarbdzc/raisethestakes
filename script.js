const easyCategories = [
    "Sodas", "Fruits", "Car Brands", "Colors", "Animals",
    "Countries", "Sports", "Vegetables", "Board Games", 
    "Movie Genres", "Movies", "RomComs", "Female Pop Stars", 
    "Rappers", "Actors", "Actresses", "Famous 90's Shows", 
    "Taylor Swift Songs", "Animes", "Video Games", "Supermarket Chains",
    "Tourist Attractions", "Famous Books", "Sports that use a Ball", "Musicals",
    "Items of Stationary", "Celebrity Chefs", "Characters in Star Wars",
    "Herbs and Spices", "World Leaders", "Social Media Platforms",
    "Famous Youtubers", "Cities"

  ];
  
  const hardCategories = [
    "Rare Dog Breeds", "Classic Literature Authors", "Chemical Elements",
    "Famous Paintings", "Historical Battles", "Programming Languages",
    "Capital Cities", "Mythological Creatures", "Types of Clouds", "Jazz Musicians",
    "Oscar Winning Movies", "Makeup Brands", "KPOP Groups", "Types of Pasta",
    "Famous Philosophers", "Types of Cheese", "Famous Movie Directors", 
    "Countries in Asia", "Superheroes from Comics", "Historical Wars",
    "Pieces of Gym Equipment", "Famous Tennis Players", "Brands of Chewing Gum",
    "Famous Hotels", "Names of Seas", "Mexican Food Dishes", "Zombie Movies",
    "Parts of a Car"
  ];
  
  let usedCategories = new Set();
  let players = [];
  let scores = {};
  let currentEasyCat = "";
  let currentHardCat = "";
  let stealActive = false;
  let stealAttempts = 0;
  let currentBidder = "";
  
  // DOM Elements
  const lobby = document.getElementById("lobby");
  const gameArea = document.getElementById("gameArea");
  const playerList = document.getElementById("playerList");
  const bidderSelect = document.getElementById("bidderSelect");
  const stealSelect = document.getElementById("stealSelect");
  const stealArea = document.getElementById("stealArea");
  const stealInfo = document.getElementById("stealInfo");
  const easyCatEl = document.getElementById("easyCat");
  const hardCatEl = document.getElementById("hardCat");
  const scoreboardBody = document.getElementById("scoreboard");
  const easyCard = document.getElementById("easyCard");
  const hardCard = document.getElementById("hardCard");
  
  // Modal Elements
  const customConfirmModal = document.getElementById("customConfirmModal");
  const customConfirmMessage = document.getElementById("customConfirmMessage");
  const confirmYesBtn = document.getElementById("confirmYes");
  const confirmNoBtn = document.getElementById("confirmNo");
  
  // Toast container
  let toastContainer = null;
  function createToastContainer() {
    if (toastContainer) return;
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.className = "fixed bottom-8 left-1/2 -translate-x-1/2 z-50 space-y-2 max-w-md w-full px-4";
    document.body.appendChild(toastContainer);
  }
  createToastContainer();
  
  function showToast(message, type = "info") {
    const colors = {
      info: "bg-blue-600",
      success: "bg-green-600",
      error: "bg-red-600",
      warning: "bg-yellow-500 text-black",
    };
    const toast = document.createElement("div");
    toast.className = `text-white px-5 py-3 rounded shadow-lg animate-fade-in-down ${colors[type] || colors.info}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
  
    setTimeout(() => {
      toast.classList.add("animate-fade-out-up");
      toast.addEventListener("animationend", () => toast.remove());
    }, 3000);
  }
  
  // Add CSS animations
  function addTailwindAnimations() {
    const style = document.createElement("style");
    style.textContent = `
    @keyframes fade-in-down {
      0% { opacity: 0; transform: translateY(-10px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    @keyframes fade-out-up {
      0% { opacity: 1; transform: translateY(0); }
      100% { opacity: 0; transform: translateY(-10px); }
    }
    @keyframes flip-card {
      0% { transform: rotateY(0deg); }
      50% { transform: rotateY(90deg); }
      100% { transform: rotateY(0deg); }
    }
    .animate-fade-in-down { animation: fade-in-down 0.3s ease forwards; }
    .animate-fade-out-up { animation: fade-out-up 0.3s ease forwards; }
    .animate-flip { animation: flip-card 0.7s ease-in-out; }
    `;
    document.head.appendChild(style);
  }
  addTailwindAnimations();
  
  // Add player to list
  function addPlayer() {
    const input = document.getElementById("playerName");
    const name = input.value.trim();
    if (!name) {
      showToast("Please enter a player name", "warning");
      return;
    }
    if (players.includes(name)) {
      showToast("Player already added", "warning");
      return;
    }
    players.push(name);
    scores[name] = 0;
    updatePlayerList();
    updatePlayerSelectors();
    input.value = "";
  }
  
  // Update player list display
  function updatePlayerList() {
    playerList.innerHTML = "";
    players.forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p;
      playerList.appendChild(li);
    });
  }
  
  // Start the game
  function startGame() {
    if (players.length < 2) {
      showToast("Add at least 2 players to start!", "warning");
      return;
    }
    lobby.classList.add("hidden");
    gameArea.classList.remove("hidden");
    stealActive = false;
    stealAttempts = 0;
    hideStealArea();
    nextRound();
  }
  
  // Pick a random unused category
  function getRandomCategory(arr) {
    const available = arr.filter((cat) => !usedCategories.has(cat));
    if (available.length === 0) return null;
    const choice = available[Math.floor(Math.random() * available.length)];
    return choice;
  }
  
  // Animate card flip
  function animateCardFlip(card, newText) {
    card.classList.add("animate-flip");
    
    setTimeout(() => {
      if (card === easyCard) {
        easyCatEl.textContent = newText;
      } else {
        hardCatEl.textContent = newText;
      }
    }, 350); // Half of animation duration
    
    setTimeout(() => {
      card.classList.remove("animate-flip");
    }, 700);
  }
  
  // Setup next round categories & update selects
  function nextRound() {
    // Add current categories to used so they don't repeat
    if (currentEasyCat) usedCategories.add(currentEasyCat);
    if (currentHardCat) usedCategories.add(currentHardCat);
  
    const newEasy = getRandomCategory(easyCategories);
    const newHard = getRandomCategory(hardCategories);
  
    if (!newEasy && !newHard) {
      showToast("No more categories left! Game over.", "info");
      easyCatEl.textContent = "No more categories";
      hardCatEl.textContent = "No more categories";
      bidderSelect.innerHTML = "";
      return;
    }
  
    // Animate card changes
    if (newEasy) {
      animateCardFlip(easyCard, newEasy);
      currentEasyCat = newEasy;
    } else {
      animateCardFlip(easyCard, "No more categories");
      currentEasyCat = "";
    }
  
    if (newHard) {
      animateCardFlip(hardCard, newHard);
      currentHardCat = newHard;
    } else {
      animateCardFlip(hardCard, "No more categories");
      currentHardCat = "";
    }
  
    updatePlayerSelectors();
    hideStealArea();
  }
  
  // Fill bidder and stealer selects with current players
  function updatePlayerSelectors() {
    [bidderSelect, stealSelect].forEach((select) => {
      select.innerHTML = "";
      players.forEach((p) => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        select.appendChild(opt);
      });
    });
  }
  
  // Update scoreboard table
  function updateScoreboard() {
    scoreboardBody.innerHTML = "";
    // Sort players by score (highest first)
    const sortedPlayers = [...players].sort((a, b) => scores[b] - scores[a]);
    
    sortedPlayers.forEach((p, index) => {
      const tr = document.createElement("tr");
      tr.className = "border border-gray-400";
      
      // Highlight winner
      if (index === 0 && scores[p] > 0) {
        tr.className += " bg-yellow-100";
      }
      
      const nameTd = document.createElement("td");
      nameTd.className = "border border-gray-400 px-4 py-2";
      nameTd.textContent = p;
      
      const scoreTd = document.createElement("td");
      scoreTd.className = "border border-gray-400 px-4 py-2 font-semibold";
      scoreTd.textContent = scores[p];
      
      tr.appendChild(nameTd);
      tr.appendChild(scoreTd);
      scoreboardBody.appendChild(tr);
    });
  }
  
  // Custom confirm modal
  function customConfirm(message) {
    return new Promise((resolve) => {
      customConfirmMessage.textContent = message;
      customConfirmModal.classList.remove("hidden");
  
      function cleanUp() {
        confirmYesBtn.removeEventListener("click", onYes);
        confirmNoBtn.removeEventListener("click", onNo);
        customConfirmModal.classList.add("hidden");
      }
  
      function onYes() {
        cleanUp();
        resolve(true);
      }
  
      function onNo() {
        cleanUp();
        resolve(false);
      }
  
      confirmYesBtn.addEventListener("click", onYes);
      confirmNoBtn.addEventListener("click", onNo);
    });
  }
  
  // Show steal area
  function showStealArea() {
    stealArea.classList.remove("hidden");
    const penalty = stealAttempts + 1;
    stealInfo.textContent = `Steal available! Success: +${penalty} points, Failure: -${penalty + 1} points`;
    
    // Update steal select to exclude the bidder
    stealSelect.innerHTML = "";
    players.forEach((p) => {
      if (p !== currentBidder) {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        stealSelect.appendChild(opt);
      }
    });
  }
  
  // Hide steal area
  function hideStealArea() {
    stealArea.classList.add("hidden");
    stealActive = false;
    stealAttempts = 0;
    currentBidder = "";
  }
  
  // Mark finished for category (easy/hard)
  function markFinished(category) {
    const bidder = bidderSelect.value;
    if (!bidder) {
      showToast("Select the player who made the highest bid.", "warning");
      return;
    }
  
    let points = category === "hard" ? 2 : 1;
    scores[bidder] += points;
  
    updateScoreboard();
    showToast(`${bidder} finished the ${category} category and earned ${points} point${points > 1 ? "s" : ""}!`, "success");
  
    // After finishing, advance round
    setTimeout(() => {
      nextRound();
    }, 1000);
  }
  
  // Mark failed round (-1 point to bidder, enable steal)
  function markFailed() {
    const bidder = bidderSelect.value;
    if (!bidder) {
      showToast("Select the player who made the highest bid.", "warning");
      return;
    }
  
    scores[bidder] -= 1;
    currentBidder = bidder;
    updateScoreboard();
  
    showToast(`${bidder} failed and lost 1 point! Steal option is now available.`, "error");
  
    // Enable steal option
    stealActive = true;
    stealAttempts = 0;
    showStealArea();
  }
  
  // Attempt steal
  async function attemptSteal() {
    const stealer = stealSelect.value;
    if (!stealer) {
      showToast("Select a player who wants to steal.", "warning");
      return;
    }
  
    const successPoints = stealAttempts + 1;
    const failurePoints = stealAttempts + 2;
  
    const success = await customConfirm(`${stealer}, attempt steal? Success: +${successPoints} points, Failure: -${failurePoints} points`);
  
    if (!success) return;
  
    const stealSuccess = await customConfirm(`${stealer}, did you successfully complete the category?`);
  
    if (stealSuccess) {
      scores[stealer] += successPoints;
      showToast(`${stealer} successfully stole and earned ${successPoints} point${successPoints > 1 ? "s" : ""}!`, "success");
      updateScoreboard();
      
      // Steal success ends steal phase and advance round
      setTimeout(() => {
        nextRound();
      }, 1000);
    } else {
      scores[stealer] -= failurePoints;
      stealAttempts++;
      showToast(`${stealer} failed the steal and lost ${failurePoints} points!`, "error");
      updateScoreboard();
      
      // Update steal area for next attempt
      showStealArea();
    }
  }
  
  // End steal mode manually
  function endStealMode() {
    showToast("No more steal attempts. Moving to next round.", "info");
    setTimeout(() => {
      nextRound();
    }, 1000);
  }
  
  // Allow Enter key to add players
  document.getElementById("playerName").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      addPlayer();
    }
  });
  
  // Initialize scoreboard
  updateScoreboard();