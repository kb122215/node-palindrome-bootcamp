const wordInput = document.querySelector("#word-input");

const checkButton = document.querySelector("#check-button");
const resetButton = document.querySelector("#reset-button");
const resultMessage = document.querySelector("#result-message");

const reversedWord = document.querySelector("#reversed-word");
const pendulumScene = document.querySelector("#pendulum-scene");

const ballTexts = document.querySelectorAll(".ball-text");
const balls = document.querySelectorAll(".ball");

function getDisplayCharacters(text) {
  return text
    .trim()
    .split("")
    .filter(function (char) {
      return char !== " ";
    });
}

function createPendulumBalls(text) {
  pendulumScene.innerHTML = "";

  const characters = getDisplayCharacters(text);

  if (characters.length === 0) {
    return;
  }

  characters.forEach(function (char, index) {
    const pendulum = document.createElement("div");
    pendulum.classList.add("pendulum");

    if (index === 0) {
      pendulum.classList.add("left-ball");
    }

    if (index === characters.length - 1) {
      pendulum.classList.add("right-ball");
    }

    pendulum.innerHTML = `<div class="string"></div>
    <div class="ball">
    <span class="ball-text">${char}</span>
    </div>`;

    pendulumScene.appendChild(pendulum);
  });
}

function getAllBalls() {
  return document.querySelectorAll(".ball");
}

function resetBallColors() {
  const balls = getAllBalls();

  balls.forEach(function (ball) {
    ball.classList.remove("palindrome");
    ball.classList.remove("not-palindrome");
  });
}

function colorBalls(isPalindrome) {
  const balls = getAllBalls();
  balls.forEach(function (ball) {
    if (isPalindrome) {
      ball.classList.add("palindrome");
    } else {
      ball.classList.add("not-palindrome");
    }
  });
}

function triggerSwingAnimation() {
  pendulumScene.classList.remove("swinging");

  void pendulumScene.offsetWidth;

  pendulumScene.classList.add("swinging");

  setTimeout(function () {
    pendulumScene.classList.remove("swinging");
  }, 2600);
}

checkButton.addEventListener("click", function () {
  const userWord = wordInput.value.trim();

  if (userWord === "") {
    resultMessage.textContent = "Please enter a word or phrase.";
    reversedWord.textContent = "-";
    placeTextOnBalls("");
    resetBallColors();
    return;
  }

  fetch(`/api?word=${encodeURIComponent(userWord)}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      createPendulumBalls(data.cleaned);
      reversedWord.textContent = data.reversed;

      resetBallColors();
      colorBalls(data.isPalindrome);
      triggerSwingAnimation();

      if (data.isPalindrome === true) {
        resultMessage.textContent = `"${data.original}" is a palindrome!`;
      } else {
        resultMessage.textContent = `"${data.original}" is not a palindrome.`;
      }
    })

    .catch(function (error) {
      console.log(error);

      resultMessage.textContent = "Something went wrong.";
    });
});

resetButton.addEventListener("click", function () {
  wordInput.value = "";

  resultMessage.textContent = "";

  reversedWord.textContent = "-";
  pendulumScene.innerHTML = "";

  wordInput.focus();
});
