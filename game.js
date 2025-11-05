const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let packet = { x: 100, y: canvas.height / 2, r: 12, vy: 0 };
let gravity = 0.4, jump = -9.5;
let obstacles = [], frame = 0, score = 0, gameOver = false;

function drawPacket() {
  ctx.beginPath();
  ctx.arc(packet.x, packet.y, packet.r, 0, Math.PI * 2);
  ctx.fillStyle = "#00ffff";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#00ffff";
  ctx.fill();
}

function createObstacles() {
  if (frame % 120 === 0) { // slower spawn
    let top = Math.random() * (canvas.height / 2.5);
    let gap = 200; // wider gap
    obstacles.push({ x: canvas.width, y: 0, w: 40, h: top });
    obstacles.push({ x: canvas.width, y: top + gap, w: 40, h: canvas.height });
  }
}

function drawObstacles() {
  ctx.fillStyle = "#ff003c";
  obstacles.forEach(o => {
    ctx.fillRect(o.x, o.y, o.w, o.h);
    o.x -= 3; // slower movement

    // scoring logic
    if (!o.passed && o.x + o.w < packet.x) {
      o.passed = true;
      score++;
    }
  });
  obstacles = obstacles.filter(o => o.x + o.w > 0);
}

function detectCollision() {
  for (let o of obstacles) {
    if (
      packet.x + packet.r > o.x &&
      packet.x - packet.r < o.x + o.w &&
      packet.y + packet.r > o.y &&
      packet.y - packet.r < o.y + o.h
    ) {
      gameOver = true;
    }
  }
}

function update() {
  if (gameOver) {
    ctx.fillStyle = "#ff003c";
    ctx.font = "48px monospace";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ff003c";
    ctx.fillText("GAME OVER", canvas.width / 2 - 150, canvas.height / 2);
    ctx.font = "28px monospace";
    ctx.fillStyle = "#00ffff";
    ctx.shadowColor = "#00ffff";
    ctx.fillText("Press SPACE to restart", canvas.width / 2 - 160, canvas.height / 2 + 50);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPacket();
  createObstacles();
  drawObstacles();
  detectCollision();

  // gravity and motion
  packet.vy = Math.min(packet.vy + gravity, 10);
  packet.y += packet.vy;

  // draw score
  ctx.fillStyle = "#00ffff";
  ctx.font = "24px monospace";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "#00ffff";
  ctx.fillText("Score: " + score, 30, 50);

  frame++;
  requestAnimationFrame(update);
}

function resetGame() {
  packet = { x: 100, y: canvas.height / 2, r: 12, vy: 0 };
  obstacles = [];
  score = 0;
  frame = 0;
  gameOver = false;
  update();
}

// controls
window.addEventListener("keydown", e => {
  if (e.code === "Space") {
    if (gameOver) resetGame();
    else packet.vy = jump;
  }
});
window.addEventListener("mousedown", () => {
  if (gameOver) resetGame();
  else packet.vy = jump;
});

update();
