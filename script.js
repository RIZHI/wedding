const stage = document.getElementById("stage");

stage.addEventListener("click", () => {
  stage.classList.toggle("open");
});

// Track revealed cards
let revealedCards = 0;
const totalCards = 3;

function checkAllRevealed() {
  if (revealedCards === totalCards) {
    celebrateRevealed();
  }
}

function celebrateRevealed() {
  // Show celebration message
  const celebrationMsg = document.getElementById("celebrationMessage");
  celebrationMsg.classList.add("show");

  // Create confetti
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      createConfetti();
    }, i * 30);
  }
}

function createConfetti() {
  const confetti = document.createElement("div");
  confetti.classList.add("confetti");
  confetti.style.left = Math.random() * 100 + "%";
  confetti.style.background = [
    "#b96b6b",
    "#d4a5a5",
    "#c98888",
    "#a55858",
    "#e6b3b3",
  ][Math.floor(Math.random() * 5)];
  confetti.style.delay = "0s";
  confetti.style.animationDuration = 2 + Math.random() * 1 + "s";
  document.body.appendChild(confetti);

  setTimeout(() => {
    confetti.remove();
  }, 3000);
}

// Initialize scratch cards
const scratchCards = document.querySelectorAll(".scratch-card");

scratchCards.forEach((card, index) => {
  const canvas = card.querySelector(".scratch-overlay");
  const ctx = canvas.getContext("2d");

  // Set canvas size
  canvas.width = 120;
  canvas.height = 120;
  canvas.style.zIndex = "2";

  // Draw gold overlay
  const gradient = ctx.createLinearGradient(0, 0, 120, 120);
  gradient.addColorStop(0, "#b96b6b");
  gradient.addColorStop(0.5, "#d4a5a5");
  gradient.addColorStop(1, "#c98888");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add texture/pattern to make it look scratchy
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 1.5;
    ctx.fillRect(x, y, size, size);
  }

  let isDrawing = false;
  let scratchedPixels = 0;
  const revealThreshold = 0.5; // 50% scratched to fully reveal
  let cardRevealed = false;

  const scratch = (x, y) => {
    const rect = canvas.getBoundingClientRect();
    const scratchX = x - rect.left;
    const scratchY = y - rect.top;

    // Clear using clearRect (erase method)
    ctx.clearRect(scratchX - 15, scratchY - 15, 30, 30);

    // Check if enough is scratched
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    scratchedPixels = 0;

    for (let i = 3; i < data.length; i += 4) {
      if (data[i] < 10) scratchedPixels++;
    }

    const percentScratched = scratchedPixels / (canvas.width * canvas.height);

    if (percentScratched > revealThreshold) {
      if (!cardRevealed) {
        canvas.style.display = "none";
        cardRevealed = true;
        revealedCards++;
        checkAllRevealed();
      }
    }
  };

  const startScratching = (e) => {
    isDrawing = true;
    const touch = e.touches ? e.touches[0] : e;
    scratch(touch.clientX, touch.clientY);
  };

  const continueScratching = (e) => {
    if (!isDrawing) return;
    if (e.touches) e.preventDefault();
    const touch = e.touches ? e.touches[0] : e;
    scratch(touch.clientX, touch.clientY);
  };

  const stopScratching = () => {
    isDrawing = false;
  };

  // Mouse events
  canvas.addEventListener("mousedown", startScratching);
  canvas.addEventListener("mousemove", continueScratching);
  document.addEventListener("mouseup", stopScratching);

  // Touch events
  canvas.addEventListener("touchstart", startScratching, false);
  canvas.addEventListener("touchmove", continueScratching, false);
  canvas.addEventListener("touchend", stopScratching, false);
});

// Countdown Timer
function updateCountdown() {
  const weddingDate = new Date("June 24, 2026").getTime();
  const now = new Date().getTime();
  const difference = weddingDate - now;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = days;
  document.getElementById("hours").textContent = hours;
  document.getElementById("minutes").textContent = minutes;
  document.getElementById("seconds").textContent = seconds;
}

// Update immediately and then every second
updateCountdown();
setInterval(updateCountdown, 1000);
