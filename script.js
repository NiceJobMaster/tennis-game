let canvas,
  ctx,
  ballX,
  ballSpeedX,
  ballY,
  ballSpeedY,
  paddleLeftX,
  paddleLeftY,
  paddleRightX,
  paddleRightY,
  playerLeftScore,
  playerRightScore,
  showingWinScreen;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const WINNING_SCORE = 3;

window.onload = () => {
  canvas = document.getElementById("game");
  ctx = canvas.getContext("2d");

  setInitialValues();

  const framesPerSecond = 144;
  setInterval(update, 1000 / framesPerSecond);

  canvas.addEventListener("mousedown", handleMouseClick);
  canvas.addEventListener("mousemove", handleMouseMove);
};

const setInitialValues = () => {
  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = 1;
  ballSpeedY = 1;
  paddleLeftX = 0;
  paddleRightX = canvas.width - PADDLE_WIDTH;
  paddleLeftY = canvas.height / 2 - PADDLE_HEIGHT / 2;
  paddleRightY = canvas.height / 2 - PADDLE_HEIGHT / 2;
  playerLeftScore = 0;
  playerRightScore = 0;
  showingWinScreen = false;
};

const update = () => {
  moveAll();
  drawAll();
};

const moveAll = () => {
  if (showingWinScreen) {
    return;
  }

  computerMove();

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (ballX < 0) {
    if (ballY > paddleLeftY && ballY < paddleLeftY + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      const deltaY = ballY - (paddleLeftY + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.05;
    } else {
      playerRightScore++;
      resetBall();
    }
  }

  if (ballX > canvas.width) {
    if (ballY > paddleRightY && ballY < paddleRightY + PADDLE_HEIGHT) {
      ballSpeedX = -ballSpeedX;

      const deltaY = ballY - (paddleRightY + PADDLE_HEIGHT / 2);
      ballSpeedY = deltaY * 0.05;
    } else {
      playerLeftScore++;
      resetBall();
    }
  }

  if (ballY < 0) {
    ballSpeedY = -ballSpeedY;
  }

  if (ballY > canvas.height) {
    ballSpeedY = -ballSpeedY;
  }
};

const computerMove = () => {
  const paddleRightYCenter = paddleRightY + PADDLE_HEIGHT / 2;
  if (paddleRightYCenter < ballY - 35) {
    paddleRightY += 1;
  } else if (paddleRightYCenter > ballY + 35) {
    paddleRightY -= 1;
  }
};

const resetBall = () => {
  if (playerLeftScore >= WINNING_SCORE || playerRightScore >= WINNING_SCORE) {
    showingWinScreen = true;
  }

  ballX = canvas.width / 2;
  ballY = canvas.height / 2;
  ballSpeedX = -ballSpeedX;
  ballSpeedY = 1;
};

const drawNet = () => {
  for (let i = 10; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, "white");
  }
};

const drawAll = () => {
  // background screen
  colorRect(0, 0, canvas.width, canvas.height, "black");

  if (showingWinScreen) {
    ctx.fillStyle = "white";

    if (playerLeftScore >= WINNING_SCORE) {
      ctx.fillText("Left player won!", 350, 200);
    } else if (playerRightScore >= WINNING_SCORE) {
      ctx.fillText("Right player won!", 350, 200);
    }

    ctx.fillText("Click to continue", 350, 500);
    return;
  }

  drawNet();

  // left player
  colorRect(paddleLeftX, paddleLeftY, PADDLE_WIDTH, PADDLE_HEIGHT, "white");

  // right player
  colorRect(paddleRightX, paddleRightY, PADDLE_WIDTH, PADDLE_HEIGHT, "white");

  // ball
  colorCircle(ballX, ballY, 10, "white");

  // score
  ctx.fillText(playerLeftScore, canvas.width / 2 - canvas.width / 4, 100);
  ctx.fillText(playerRightScore, canvas.width / 2 + canvas.width / 4, 100);
};

const colorRect = (leftX, topY, width, height, drawColor) => {
  ctx.fillStyle = drawColor;
  ctx.fillRect(leftX, topY, width, height);
};

const colorCircle = (centerX, centerY, radius, drawColor) => {
  ctx.fillStyle = drawColor;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
  ctx.fill();
};

const handleMouseClick = (e) => {
  if (showingWinScreen) {
    playerLeftScore = 0;
    playerRightScore = 0;
    showingWinScreen = false;
  }
};

const handleMouseMove = (e) => {
  const mousePosition = calculateMousePosition(e);
  paddleLeftY = mousePosition.y - PADDLE_HEIGHT / 2;
};

const calculateMousePosition = (e) => {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  const mouseX = e.clientX - rect.left - root.scrollLeft;
  const mouseY = e.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY,
  };
};
