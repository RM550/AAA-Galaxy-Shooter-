
const gameArea = document.getElementById('game-area');
const player = document.getElementById('player');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const countdown = document.getElementById('countdown');
const scoreBoard = document.getElementById('score');
const highScoreBoard = document.getElementById('high-score');

let score = 0;
let highScore = 0;
let gameInterval;
let autoFireInterval;

// Start Game
startButton.addEventListener('click', () => {
  startScreen.style.display = 'none';
  startCountdown(() => startGame());
});

function startCountdown(callback) {
  countdown.style.opacity = 1;
  let count = 3;

  const interval = setInterval(() => {
    countdown.textContent = count;
    count--;

    if (count < 0) {
      clearInterval(interval);
      countdown.style.opacity = 0;
      callback();
    }
  }, 1000);
}

// Start Game Logic
function startGame() {
  autoFireInterval = setInterval(shootBullet, 200);
  gameInterval = setInterval(spawnEnemy, 800);
}

gameArea.addEventListener('mousemove', (event) => {
  const areaRect = gameArea.getBoundingClientRect();
  const mouseX = event.clientX - areaRect.left;

  if (mouseX > 0 && mouseX < gameArea.clientWidth - player.offsetWidth) {
    player.style.left = `${mouseX}px`;
  }
});

function shootBullet() {
  const bullet = document.createElement('div');
  bullet.classList.add('bullet');
  bullet.style.left = `${player.offsetLeft + player.offsetWidth / 2 - 4}px`;
  bullet.style.bottom = '100px';
  gameArea.appendChild(bullet);

  const bulletInterval = setInterval(() => {
    bullet.style.bottom = `${parseInt(bullet.style.bottom) + 20}px`;

    const enemies = document.querySelectorAll('.enemy');
    enemies.forEach((enemy) => {
      if (isCollision(bullet, enemy)) {
        enemy.remove();
        bullet.remove();
        clearInterval(bulletInterval);
        score++;
        scoreBoard.textContent = score;

        if (score > highScore) {
          highScore = score;
          highScoreBoard.textContent = highScore;
        }
      }
    });

    if (parseInt(bullet.style.bottom) > gameArea.clientHeight) {
      bullet.remove();
      clearInterval(bulletInterval);
    }
  }, 20);
}
function spawnEnemy() {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');

  // Enemy position randomize
  enemy.style.left = `${Math.random() * (gameArea.clientWidth - 60)}px`;
  enemy.style.animationDuration = `${Math.random() * 2 + 3}s`; // Random fall speed
  gameArea.appendChild(enemy);

  const enemyInterval = setInterval(() => {
    // Collision with Player
    if (isCollision(player, enemy)) {
      alert('Game Over! Final Score: ' + score);
      clearInterval(autoFireInterval);
      clearInterval(gameInterval);
      location.reload();
    }

    // Remove enemy if it leaves the screen
    if (enemy.getBoundingClientRect().top > gameArea.clientHeight) {
      enemy.remove();
      clearInterval(enemyInterval);
    }
  }, 50);
}

function isCollision(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();

  return !(
    rect1.top > rect2.bottom ||
    rect1.bottom < rect2.top ||
    rect1.right < rect2.left ||
    rect1.left > rect2.right
  );
}  
