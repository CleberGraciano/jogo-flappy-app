const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let frames = 0;
const gravity = 0.25;
const jump = 4.6;
const state = { current: 0, getReady: 0, game: 1, over: 2 };

const bird = {
  x: 50,
  y: 150,
  w: 34,
  h: 26,
  frame: 0,
  speed: 0,
  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.w, this.h);
  },
  flap() {
    this.speed = -jump;
  },
  update() {
    this.speed += gravity;
    this.y += this.speed;

    if (this.y + this.h >= canvas.height) {
      this.y = canvas.height - this.h;
      if (state.current === state.game) state.current = state.over;
    }
  },
  reset() {
    this.speed = 0;
    this.y = 150;
  }
};

const pipes = {
  position: [],
  width: 50,
  gap: 120,
  maxYPos: -150,
  draw() {
    ctx.fillStyle = "green";
    this.position.forEach(p => {
      // topo
      ctx.fillRect(p.x, p.y, this.width, canvas.height);
      // fundo
      ctx.fillRect(p.x, p.y + canvas.height + this.gap, this.width, canvas.height);
    });
  },
  update() {
    if (state.current !== state.game) return;

    if (frames % 100 === 0) {
      this.position.push({
        x: canvas.width,
        y: this.maxYPos * (Math.random() + 1)
      });
    }

    this.position.forEach(p => {
      p.x -= 2;

      // colisão
      if (
        bird.x + bird.w >= p.x &&
        bird.x <= p.x + this.width &&
        (bird.y <= p.y + canvas.height || bird.y + bird.h >= p.y + canvas.height + this.gap)
      ) {
        state.current = state.over;
      }

      // remover canos que saíram da tela
      if (p.x + this.width <= 0) {
        this.position.shift();
      }
    });
  },
  reset() {
    this.position = [];
  }
};

function draw() {
  ctx.fillStyle = "#70c5ce";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  pipes.draw();
  bird.draw();

  if (state.current === state.getReady) {
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Toque para começar", 60, 200);
  }

  if (state.current === state.over) {
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Game Over! Toque para reiniciar", 20, 200);
  }
}

function update() {
  bird.update();
  pipes.update();
}

function loop() {
  update();
  draw();
  frames++;
  requestAnimationFrame(loop);
}

canvas.addEventListener("click", () => {
  switch (state.current) {
    case state.getReady:
      state.current = state.game;
      break;
    case state.game:
      bird.flap();
      break;
    case state.over:
      pipes.reset();
      bird.reset();
      state.current = state.getReady;
      break;
  }
});

state.current = state.getReady;
loop();
