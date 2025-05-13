const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Carregar imagens
const sprite = {};

function loadImages() {
  sprite.bird = new Image();
  sprite.bird.src = "img/bird2.png";

  sprite.pipeTop = new Image();
  sprite.pipeTop.src = "img/pipe-top.png";

  sprite.pipeBottom = new Image();
  sprite.pipeBottom.src = "img/pipe-botton.png";

  sprite.background = new Image();
  sprite.background.src = "img/background.png";
}

loadImages();

// Pássaro
const bird = {
  x: 50,
  y: 150,
  w: 34,
  h: 26,
  gravity: 0.6,
  lift: -10,
  velocity: 0,
  draw() {
    ctx.drawImage(sprite.bird, this.x, this.y);
  },
  update() {
    this.velocity += this.gravity;
    this.y += this.velocity;

    if (this.y + this.h > canvas.height) {
      this.y = canvas.height - this.h;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  },
  flap() {
    this.velocity = this.lift;
  }
};

// Canos
const pipes = {
  position: [],
  width: 52,
  gap: 120,
  speed: 2,
  spawnRate: 90,
  frameCount: 0,

  update() {
    this.frameCount++;

    if (this.frameCount % this.spawnRate === 0) {
      const topY = -Math.floor(Math.random() * 150);
      this.position.push({ x: canvas.width, y: topY });
    }

    this.position.forEach((p, i) => {
      p.x -= this.speed;

      // Remove canos fora da tela
      if (p.x + this.width < 0) {
        this.position.splice(i, 1);
      }

      // Colisão
      if (
        bird.x + bird.w > p.x &&
        bird.x < p.x + this.width &&
        (
          bird.y < p.y + sprite.pipeTop.height ||
          bird.y + bird.h > p.y + sprite.pipeTop.height + this.gap
        )
      ) {
        resetGame();
      }
    });
  },

  draw() {
    this.position.forEach(p => {
      ctx.drawImage(sprite.pipeTop, p.x, p.y);
      ctx.drawImage(sprite.pipeBottom, p.x, p.y + sprite.pipeTop.height + this.gap);
    });
  },

  reset() {
    this.position = [];
    this.frameCount = 0;
  }
};

function resetGame() {
  bird.y = 150;
  bird.velocity = 0;
  pipes.reset();
}

// Loop principal
function draw() {
  ctx.drawImage(sprite.background, 0, 0, canvas.width, canvas.height);
  pipes.draw();
  bird.draw();
}

function update() {
  bird.update();
  pipes.update();
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// Input
document.addEventListener("keydown", function (e) {
  if (e.code === "Space") {
    bird.flap();
  }
});

// Iniciar o jogo quando as imagens estiverem carregadas
sprite.background.onload = () => {
  loop();
};
