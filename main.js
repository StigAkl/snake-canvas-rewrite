const blockSize = 25;

class Vector2D {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Snake {
  constructor() {
    this.snakeHeadPosition = new Vector2D(0, 0);
    this.body = [];
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
    this.position = new Vector2D(0, 0);
  }

  newPosition(position) {
    this.position = position;
  }
}

class Board {
  constructor(rows, cols) {
    this.board = document.getElementById("snake");
    this.ctx = this.board.getContext("2d");
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

    for (let i = 0; i < snake.body.length; i++) {
      this.ctx.fillRect(snake.body[i].x, snake.body[i].y, blockSize, blockSize);
    }

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
    this.board = new Board(40, 40);
    this.velocity = new Vector2D(1, 0);
    this.gameOver = false;
    this.buddhasHand = new BuddhasHand();
    this.points = 0;
  }

  startGame() {
    this.buddhasHand.newPosition(this.generateRandomPosition());
    setInterval(() => {
      this.gameInteration();
    }, 69);
  }
  gameInteration() {
    this.gameOver = this.isGameOver();
    if (!this.gameOver) {
      this.board.updateBoard(this.snake, this.buddhasHand);

      if (this.hitBuddhasHand()) {
        this.points += 1;
        const newBuddhasHandPosition = this.generateRandomPosition();
        this.snake.body.push(
          new Vector2D(this.buddhasHand.position.x, this.buddhasHand.position.y)
        );
        this.buddhasHand.newPosition(
          new Vector2D(newBuddhasHandPosition.x, newBuddhasHandPosition.y)
        );
      }

      for (let i = this.snake.body.length - 1; i > 0; i--) {
        this.snake.body[i].x = this.snake.body[i - 1].x;
        this.snake.body[i].y = this.snake.body[i - 1].y;
      }

      if (this.snake.body.length) {
        this.snake.body[0].x = this.snake.snakeHeadPosition.x;
        this.snake.body[0].y = this.snake.snakeHeadPosition.y;
      }
      this.snake.newPosition(this.velocity);
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
    const position = new Vector2D(
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
      this.velocity = new Vector2D(0, 0);
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
      snakeGame.velocity = new Vector2D(-1, 0);
      break;
    case "ArrowRight":
      snakeGame.velocity = new Vector2D(1, 0);
      break;
    case "ArrowUp":
      snakeGame.velocity = new Vector2D(0, -1);
      break;
    case "ArrowDown":
      snakeGame.velocity = new Vector2D(0, 1);
      break;
  }
};

window.addEventListener("keydown", keyPressedHandler);
