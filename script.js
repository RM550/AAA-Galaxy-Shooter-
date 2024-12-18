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
let enemies = []; // Array to track enemies

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
  autoFireInterval = setInterval(shootBullet, 200);  // Player bullet interval
  gameInterval = setInterval(spawnEnemy, 800);  // Enemy spawn interval
}

// Player movement
gameArea.addEventListener('mousemove', (event) => {
  const areaRect = gameArea.getBoundingClientRect();
  const mouseX = event.clientX - areaRect.left;

  if (mouseX > 0 && mouseX < gameArea.clientWidth - player.offsetWidth) {
    player.style.left = `${mouseX}px`;
  }
});

// Shoot Bullet (Player)
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
        enemy.health--;
        bullet.remove();
        clearInterval(bulletInterval);

        if (enemy.health <= 0) {
          explodeEnemy(enemy);  // Trigger explosion when enemy is destroyed
          score++;
          scoreBoard.textContent = score;

          if (score > highScore) {
            highScore = score;
            highScoreBoard.textContent = highScore;
          }
        }
      }
    });

    if (parseInt(bullet.style.bottom) > gameArea.clientHeight) {
      bullet.remove();
      clearInterval(bulletInterval);
    }
  }, 20);
}

// Spawn Enemies
function spawnEnemy() {
  const enemy = document.createElement('div');
  enemy.classList.add('enemy');
  enemy.health = 5; // Enemy health is 5 bullets

  // Enemy position randomize
  enemy.style.left = `${Math.random() * (gameArea.clientWidth - 60)}px`;
  enemy.style.animationDuration = `${Math.random() * 2 + 3}s`; // Random fall speed
  enemy.style.transform = `rotate(${Math.random() * 360}deg)`; // Random rotation angle
  gameArea.appendChild(enemy);
  
  // Add enemy to array to track it
  enemies.push(enemy);

  // Ensure enemy shoots bullet after a delay
  setInterval(() => {
    shootEnemyBullet(enemy); // This will make the enemy shoot
  }, 1000); // Adjust the interval as needed

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
      enemies = enemies.filter(e => e !== enemy); // Remove from array
    }
  }, 50);
}

// Enemy Shoots Bullet
function shootEnemyBullet(enemy) {
  // Create an enemy bullet
  const enemyBullet = document.createElement('div');
  enemyBullet.classList.add('enemy-bullet');

  // Position the enemy bullet at the center top of the enemy
  enemyBullet.style.left = `${enemy.offsetLeft + (enemy.offsetWidth / 2) - 4}px`;
  enemyBullet.style.top = `${enemy.offsetTop + enemy.offsetHeight - 10}px`;  // Start just above the enemy

  gameArea.appendChild(enemyBullet);

  // Make the bullet move downwards
  const enemyBulletInterval = setInterval(() => {
    enemyBullet.style.top = `${parseInt(enemyBullet.style.top) + 5}px`; // Move the bullet down

    // Check for collision with player
    if (isCollision(player, enemyBullet)) {
      alert('Game Over! Final Score: ' + score);
      clearInterval(autoFireInterval);
      clearInterval(gameInterval);
      location.reload();
    }

    // Remove the bullet if it goes off-screen
    if (parseInt(enemyBullet.style.top) > gameArea.clientHeight) {
      enemyBullet.remove();
      clearInterval(enemyBulletInterval);
    }
  }, 50);
}

// Check collision between two elements
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

// Enemy Explodes
function explodeEnemy(enemy) {
  // Add explosion effect
  const explosion = document.createElement('div');
  explosion.classList.add('explosion');
  explosion.style.left = `${enemy.offsetLeft + enemy.offsetWidth / 2 - 20}px`;
  explosion.style.top = `${enemy.offsetTop + enemy.offsetHeight / 2 - 20}px`;
  gameArea.appendChild(explosion);

  // Remove enemy and explosion after animation
  setTimeout(() => {
    explosion.remove();
    enemy.remove();
    enemies = enemies.filter(e => e !== enemy); // Remove from array
  }, 500); // Wait for explosion animation to finish
}
