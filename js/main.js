const wordInput = document.querySelector("#word-input");

const checkButton = document.querySelector("#check-button");

const resultMessage = document.querySelector("#result-message");

const reversedWord = document.querySelector("#reversed-word");

checkButton.addEventListener("click", function () {
  const userWord = wordInput.value.trim();

  if (userWord === "") {
    resultMessage.textContent = "Please enter a word or phrase.";

    return;
  }

  fetch(`/api?word=${encodeURIComponent(userWord)}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      reversedWord.textContent = data.reversed;

      if (data.isPalindrome === true) {
        resultMessage.textContent = `"${data.original}" is a palidrome!`;
      } else {
        resultMessage.textContent = `"${data.original}" is not a palidrome.`;
      }
    })

    .catch(function (error) {
      console.log(error);

      resultMessage.textContent = "Something went wrong.";
    });
});
