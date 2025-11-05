const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let packet = { x: 100, y: canvas.height / 2, r: 12, vy: 0 };
let gravity = 0.4, jump = -9.5;
let obstacles = [], powerups = [], frame = 0, score = 0, gameOver = false;

function drawPacket() {
  ctx.beginPath();
  ctx.arc(packet.x, packet.y, packet.r, 0, Math.PI * 2);
  ctx.fillStyle = "#00ffff";
  ctx.shadowBlur = 15;
  ctx.shadowColor = "#00ffff";
  ctx.fill();
}

function createObstacles() {
  if (frame % 100 === 0) {
    let top = Math.random() * (canvas.height / 2);
    obstacles.push({ x: canvas.width, y: 0, w: 40, h: top });
    obstacles.push({ x: canvas.width, y: top + 150, w: 40, h: canvas.height });
  }
}

function drawObstacles() {
  ctx.fillStyle = "#ff003c";
  obstacles.forEach(o => {
    ctx.fillRect(o.x, o.y, o.w, o.h);
    o.x -= 4;
  });
  obstacles = obstacles.filter(o => o.x + o.w > 0);
}

function drawPowerups() {
  if (frame % 250 === 0)
    powerups.push({ x: canvas.width, y: Math.random() * canvas.height });
  ctx.fillStyle = "#00ff55";
  powerups.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fill();
    p.x -= 4;
  });
  powerups = powerups.filter(p => p.x > 0);
}

function detectCollision() {
  for (let o of obstacles)
    if (packet.x + packet.r > o.x && packet.x - packet.r < o.x + o.w &&
        packet.y + packet.r > o.y && packet.y - packet.r < o.y + o.h)
      gameOver = true;
}

function update() {
  if (gameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPacket();
  createObstacles();
  drawObstacles();
  drawPowerups();
  detectCollision();
  packet.vy = Math.min(packet.vy + gravity, 10);
  packet.y += packet.vy;
  
  frame++;
  requestAnimationFrame(update);
}

window.addEventListener("keydown", e => {
  if (e.code === "Space") packet.vy = jump;
});
window.addEventListener("mousedown", () => packet.vy = jump);

update();
