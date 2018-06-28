'use strict';

class Ball {
  constructor(column) {
    this.column = column;
    this.shiftIterations = 0;
  }
}

const gameBox = document.getElementById('gamebox');
const gameboxOverlay = document.getElementById('gamebox-overlay');

const gameboxBoundingRect = gameBox.getBoundingClientRect();
console.log(gameboxBoundingRect);
const globalGameTickInMs = 1500;
const activeBalls = [];
let gameStarted = false;
let ballIntervalId = null;

const spawnBall = () => {
  const newBall = new Ball(0);
  const newBallElement = document.createElement('div');
  newBallElement.classList.add('game-ball');

  activeBalls.push(newBall);
  gameBox.appendChild(newBallElement);
};

const destroyBall = (ballElement, ballObjectIdx) => {
  gameBox.removeChild(ballElement);
  activeBalls.pop(ballObjectIdx);
};

const shiftBallDown = (ballElement, ballObject) => {
  const shiftFactor = 100 * ballObject.shiftIterations;
  ballElement.style.transform = `translateY(${shiftFactor}%)`;
  ballObject.shiftIterations += 1;
};

const detectCollision = (ballElement) => {
  const ballElementBoundingRect = ballElement.getBoundingClientRect();
  let didCollisionOccur = false;

  if (ballElementBoundingRect.y > gameboxBoundingRect.bottom) {
    didCollisionOccur = true;
  }

  return didCollisionOccur;
};

const startGame = () => {
  gameboxOverlay.classList.add('hidden');
  ballIntervalId = setInterval(() => {
    const ballElementsArray = [...document.querySelectorAll('.game-ball')];
    ballElementsArray.forEach((ballElement, i) => {
      shiftBallDown(ballElement, activeBalls[i]);
      const collision = detectCollision(ballElement);
      if (collision) {
        destroyBall(ballElement, i);
      }
    });
    spawnBall();
  }, globalGameTickInMs);
};

const startButton = document.getElementById('start-button');
startButton.addEventListener('click', startGame);
