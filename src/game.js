const CONSTANTS = {
  COLLISION_TYPE_FLOOR: 'COLLISION_TYPE_FLOOR',
  COLLISION_TYPE_PLAYER: 'COLLISION_TYPE_PLAYER',
  COLLISION_TYPE_NONE: 'COLLISION_TYPE_NONE',
  GAME_STATUS_NOT_STARTED: 'GAME_STATUS_NOT_STARTED',
  GAME_STATUS_IN_PROGRESS: 'GAME_STATUS_IN_PROGRESS',
  GAME_STATUS_ENDED: 'GAME_STATUS_ENDED',
};

class Ball {
  constructor(ballElementRef) {
    this.shiftIterations = 0;
    this.ballElement = ballElementRef;
  }

  shiftDown(factor) {
    const shiftFactor = factor * this.shiftIterations;
    this.ballElement.style.transform = `translateY(${shiftFactor}%)`;
    this.shiftIterations += 1;
  }
}

class Player {
  constructor(playerElementRef) {
    this.playerElement = playerElementRef;
    this.playerBoundingRect = playerElementRef.getBoundingClientRect();
  }
}

class Game {
  constructor(tickSpeed, gameBoxRef, gameScoreRef, gameLivesRef) {
    this.tickSpeed = tickSpeed;
    this.activeBalls = [];
    this.score = 0;
    this.lives = 3;
    this.gameBox = gameBoxRef;
    this.gameboxBoundingRect = gameBoxRef.getBoundingClientRect();
    this.gameScore = gameScoreRef;
    this.gameLives = gameLivesRef;
    this.gameStatus = CONSTANTS.GAME_STATUS_NOT_STARTED;
  }

  spawnBall() {
    const column = Math.floor(Math.random() * 4);
    const newBallElement = document.createElement('div');
    newBallElement.classList.add('game-ball');
    newBallElement.style.left = (column * (this.calculateSize() / 4));
    this.activeBalls.push(new Ball(newBallElement));
    this.gameBox.appendChild(newBallElement);
  }

  spawnPlayer() {
    const newPlayerElement = document.createElement('div');
    newPlayerElement.classList.add('game-player');
    newPlayerElement.style.left = (2 * (this.calculateSize() / 4));
    this.gameBox.appendChild(newPlayerElement);

    return newPlayerElement;
  }

  destroyBall(ball, ballIdx) {
    this.gameBox.removeChild(ball.ballElement);
    this.activeBalls.splice(ballIdx, 1);
  }

  calculateSize() {
    return this.gameboxBoundingRect.x + this.gameboxBoundingRect.width;
  }

  updateScore(updateAmount) {
    this.score += updateAmount;
    this.gameScore.innerHTML = this.score;
  }

  updateGameStatus(status) {
    this.gameStatus = status;
  }

  clearGame() {
    this.score = 0;
    this.lives = 3;
    this.gameLives.innerHTML = this.lives;
    this.activeBalls.forEach((ball, i) => this.destroyBall(ball, i));
  }

  removeLife() {
    this.lives = this.lives - 1;
    this.gameLives.innerHTML = this.lives;
    if (this.lives < 1) {
      this.updateGameStatus(CONSTANTS.GAME_STATUS_ENDED);
    }
  }

  detectCollision(ball, ballIdx, player) {
    const ballElementBoundingRect = ball.ballElement.getBoundingClientRect();
    let collisionType = CONSTANTS.COLLISION_TYPE_NONE;

    if (ballElementBoundingRect.y > this.gameboxBoundingRect.bottom) {
      collisionType = CONSTANTS.COLLISION_TYPE_FLOOR;
    }

    if (ballElementBoundingRect.y > player.playerBoundingRect.y
      && ballElementBoundingRect.x > player.playerBoundingRect.x) {
      collisionType = CONSTANTS.COLLISION_TYPE_PLAYER;
    }

    switch (collisionType) {
      case CONSTANTS.COLLISION_TYPE_FLOOR:
        this.destroyBall(ball, ballIdx);
        this.removeLife();
        console.log('fail collision');
        break;
      case CONSTANTS.COLLISION_TYPE_PLAYER:
        // TODO: do something
        this.destroyBall(ball, ballIdx);
        this.updateScore(10);
        console.log('score collision');
        break;
      case CONSTANTS.COLLISION_TYPE_NONE:
        break;
      default:
        break;
    }
  }
}

const gameBox = document.getElementById('gamebox');
const gameboxOverlay = document.getElementById('gamebox-overlay');
const gameScore = document.getElementById('game-score');
const gameLives = document.getElementById('game-lives');
const globalGameTickInMs = 1500;
const gameController = new Game(globalGameTickInMs, gameBox, gameScore, gameLives);
const playerController = new Player(gameController.spawnPlayer());
let ballIntervalId = null;

const stopGame = () => {
  gameboxOverlay.classList.remove('hidden');
  clearInterval(ballIntervalId);
  gameController.clearGame();
};

const startGame = () => {
  // hide the overlay
  gameboxOverlay.classList.add('hidden');

  console.log(gameController.lives);
  gameController.updateGameStatus(CONSTANTS.GAME_STATUS_IN_PROGRESS);

  ballIntervalId = setInterval(() => {
    // iterate through each active ball
    gameController.activeBalls.forEach((ball, ballIdx) => {
      ball.shiftDown(400);
      gameController.detectCollision(ball, ballIdx, playerController);
    });

    if (gameController.gameStatus === CONSTANTS.GAME_STATUS_ENDED) {
      stopGame();
    }

    // spawn a new ball once per tick
    gameController.spawnBall();
  }, globalGameTickInMs);
};


const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);
