const blockSize = 25;

class Position {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Snake {
  constructor() {
    this.snakeHeadPosition = new Position(0, 0);
    this.body = [];
  }

  addBody(position) {
    this.body.push(position);
  }

  get headPosition() {
    return this.snakeHeadPosition;
  }

  newPosition(velocity) {
    this.snakeHeadPosition.x += velocity.x * blockSize;
    this.snakeHeadPosition.y += velocity.y * blockSize;
  }
}

class BuddhasHand {
  constructor() {
    this.position = new Position(0, 0);
  }

  newPosition(position) {
    this.position = position;
  }
}

class Board {
  constructor(rows, cols) {
    this.board = document.getElementById("snake");
    this.ctx = this.board.getContext("2d");
    //this.ctx.imageSmoothingEnabled = true;
    this.height = cols * blockSize;
    this.width = rows * blockSize;
    this.board.height = this.height;
    this.board.width = this.width;
  }

  updateBoard(snake, buddhasHand) {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(
      0,
      0,
      this.board.width * blockSize,
      this.board.height * blockSize
    );

    this.ctx.fillStyle = "green";
    this.ctx.fillRect(
      snake.snakeHeadPosition.x,
      snake.snakeHeadPosition.y,
      blockSize,
      blockSize
    );

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(
      buddhasHand.position.x,
      buddhasHand.position.y,
      blockSize,
      blockSize
    );
  }
}

class SnakeGame {
  constructor() {
    this.snake = new Snake();
    this.board = new Board(12, 12);
    this.velocity = new Position(1, 0);
    this.gameOver = false;
    this.buddhasHand = new BuddhasHand();
  }

  startGame() {
    this.buddhasHand.newPosition(this.generateRandomPosition());
    this.board.updateBoard(
      this.snake,
      this.buddhasHand,
      this.snake,
      this.buddhasHand
    );
    setInterval(() => {
      this.gameInteration();
    }, 100);
  }
  gameInteration() {
    this.snake.newPosition(this.velocity);
    this.gameOver = this.isGameOver();
    if (!this.gameOver) {
      this.board.updateBoard(this.snake, this.buddhasHand);

      if (this.hitBuddhasHand()) {
        console.log("Buddhas hand hit!");
        this.buddhasHand.newPosition(this.generateRandomPosition());
      }
    }
  }

  hitBuddhasHand() {
    return (
      this.snake.snakeHeadPosition.x === this.buddhasHand.position.x &&
      this.snake.snakeHeadPosition.y === this.buddhasHand.position.y
    );
  }

  generateRandomPosition() {
    const rows = this.board.width / blockSize;
    const cols = this.board.height / blockSize;
    const position = new Position(
      Math.floor(Math.random() * rows) * blockSize,
      Math.floor(Math.random() * cols) * blockSize
    );

    return position;
  }

  isGameOver() {
    const xPos = this.snake.snakeHeadPosition.x;
    const yPos = this.snake.snakeHeadPosition.y;
    if (
      xPos == this.board.width ||
      xPos < 0 ||
      yPos == this.board.height ||
      yPos < 0
    ) {
      this.velocity = new Position(0, 0);
      document.getElementById("state").innerHTML = "GAME OVER BITCH";
      return true;
    }
    return false;
  }
}

const snakeGame = new SnakeGame();

snakeGame.startGame();

const keyPressedHandler = (e) => {
  switch (e.key) {
    case "ArrowLeft":
      snakeGame.velocity = new Position(-1, 0);
      break;
    case "ArrowRight":
      snakeGame.velocity = new Position(1, 0);
      break;
    case "ArrowUp":
      snakeGame.velocity = new Position(0, -1);
      break;
    case "ArrowDown":
      snakeGame.velocity = new Position(0, 1);
      break;
  }
};

window.addEventListener("keydown", keyPressedHandler);
