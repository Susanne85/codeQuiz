
let quizListQuestions = $('#quiz-list');
let userScores = $('#user-scores');;
let timeResult = $('#time-result');

let startQuiz = '.btn-start';
let answerBtn = '.btn-select';
let submitBtn = '.btn-initials';

let clearBtn = '.btn-clean';
let goBackBtn = '.btn-goBack';
let viewScoresBtn = '.btn-viewScores';

let getStudentScores;

let studentTotal = 0;
let setIndex = 0;
let timeLeft = 75;
let timePenalty = 0;
let waitTime;

let stopTimer = false;

let questionSet = {
  question: ['Commonly used DataTypes DO NOT include', 'The condition in an IF/Else statement is enclosed within _____', 'Arrays in Javascript can be used to store ____', 'A very useful tool used during development and debugging for printing content to the debugger is ____', 'String values must be enclosed within ____ when being assigned to variables'],
  answers: ['strings-boolean-alerts-numbers', 'quotes-curly brackets-square brackets-parenthesis', 'commas-other arrays-booleans-all of the above', 'javascript-terminal/bash-for loops-console log', 'commas-curly brackets-quotes-parenthesis'],
  correctAnswer: ['alerts', 'parenthesis', 'all of the above', 'console log', 'curly brackets']
};

let studentScores = {
  initials: "",
  score: ""
};

function goBack(event) {
  console.log('goBack event');
  event.stopPropagation()
  $('#user-scores').empty();
  $('#time-result').empty();

  setIndex = 0;
  stopTimer = false;
  studentTotal = 0;
  timeLeft = 75;
  timePenalty = 0;

  clearQuestions()
  $("#quiz-list").trigger("reset");
  initialiseQuestions();
}

function setTime() {
  console.log('setTime' + timeLeft + stopTimer);
  let timerResult, timeInterval;

  timeInterval = setInterval(function () {
    timeLeft = timeLeft + timePenalty;

    if (timeLeft < 0) {
      timeLeft = 0;
    }

    timerResult = document.querySelector('#time-result');
    timerResult.lastElementChild.textContent = timeLeft;

    timePenalty = 0;

    if (timeLeft <= 0 || stopTimer) {
      clearTimeout(waitTime);
      clearInterval(timeInterval);
      stopTimer = true;
      finalScores();
    }
    timeLeft--;
  }, 1000);
}

function finalScores() {
  console.log('finalise');
  clearQuestions();

  pItem = $('<p>').text('All Done');
  pItem1 = $('<p>').text('Your score is: ' + studentTotal);
  labelItem = $('<label for="initials">').text('Enter your initials');
  inputItem = $('<input name="initials" type="text" id="initials" class="initials" value="initials" style="margin:15px">');
  buttonItem = $('<button class="btn-initials" style="margin-left:15px">Submit</button>');

  quizListQuestions.append(pItem, pItem1, labelItem, inputItem, buttonItem);
}

function viewScores(event) {
  console.log('view Scores');
  let score;

  event.stopPropagation()

  score = document.querySelector('.view-scores');
  console.log('view-Scores' + score);
  if (score === null) {
    getHighScores();
    if (getStudentScores !== null) {
      ulItem = $('<ul class="view-scores" style="margin-left:55px">').text('High Scores');
      liItem = $('<li class="view-scores" style="margin-left:65px">').text(getStudentScores.initials + ' ' + getStudentScores.score);
      userScores.append(ulItem, liItem);
    }
  } else {
    $('.view-scores').remove();
  }
}

function clearButton(event) {
  console.log('clearing Button');
  let clearScore;

  clearScore = document.querySelector('.show-scores');
  if (clearScore !== null) {
    $('.show-scores').remove();
    localStorage.removeItem("studentScores");
  }
}

function getHighScores(event) {
  console.log("get scores");
  getStudentScores = JSON.parse(localStorage.getItem("studentScores"));

  if (getStudentScores !== null) {
    console.log('Initials ' + getStudentScores.initials + 'Score ' + getStudentScores.score);
  }
}

function saveUserScores(event) {
  console.log('saveUserDetails', event);
  event.stopPropagation();

  studentScores.initials = document.querySelector('.initials').value;
  studentScores.score = studentTotal;

  localStorage.setItem("studentScores", JSON.stringify(studentScores));
   
  clearQuestions();

  getHighScores();

  ulItem = $('<ul class="show-scores" style="margin-left:55px">').text('High Scores');
  liItem = $('<li class="show-scores" style="margin-left:65px">').text(getStudentScores.initials + ' ' + getStudentScores.score);

  buttonItem1 = $('<button class="btn-clean" style="margin:15px">Clear</button>');
  buttonItem2 = $('<button class="btn-goBack" style="margin:40px;">Go Back</button>');

  quizListQuestions.append(ulItem, liItem, buttonItem1, buttonItem2);

}

function clearQuestions() {
  $('#quiz-list').empty();
}

function checkAnswers(event) {
  console.log('checkAnswers ' + timeLeft);
  event.stopPropagation();
  let answerText, questionChk;

  questionChk = event.target.innerText;
  answerTextArray = questionSet.correctAnswer[setIndex].split("-");

  answerText = "Wrong!";
  timePenalty = -10;

  for (let i = 0; i < answerTextArray.length; i++) {
    if (answerTextArray[i] === questionChk) {
      studentTotal = studentTotal + 1;
      answerText = "Correct!";
      timePenalty = 0;
    }
  }

  pItem = $('<p>').text(answerText);
  quizListQuestions.append(pItem);

  waitTime = setTimeout(askQuestions, 500, event);
}

function askQuestions(event) {
  console.log('askQuestions' + 'stopTimer ' + stopTimer + 'index' + setIndex);

  if (event != null) {

    if (event.currentTarget.className === 'btn-start') {
      event.stopPropagation();
      event.preventDefault();
      clearQuestions();
      setTime();
    }
    else {
      setIndex = setIndex + 1;
      clearQuestions();
    }
  }
  
  if (setIndex < questionSet.question.length) {
    let newQuestionItem = $('<ul>');
    let newAnswerText;

    newQuestionItem.text(questionSet.question[setIndex]);
    newQuestionItem.appendTo(quizListQuestions);

    answerTextArray = questionSet.answers[setIndex].split("-");
    for (let i = 0; i < answerTextArray.length; i++) {
      newAnswerText = $('<li button class="btn-select align-left p-2 bg-light text-dark" style="list-style:decimal; margin:15px">');
      newAnswerText.text(answerTextArray[i]);
      newAnswerText.appendTo(quizListQuestions);
    }
  }
  else {
    stopTimer = true;
  }
}

function initialiseQuestions(event) {
  console.log('initialise');

  buttonItem = $('<button class="btn-viewScores" style="background:purple; margin-left:5px; color:white; font-size:1.5rem">View Scores</button>');
  userScores.append(buttonItem);

  h4Item = $('<h4>').text('Time:');
  pItem = $('<p>');
  timeResult.append(h4Item, pItem);

  h1Item = $('<h1>').text('Coding Quiz Challenge');
  hrItem = $('<hr>');
  h3Item = $('<h3>').text('Try to answer the following code-related questions within the time limit.  Keep in mind that incorrect answers will penalize your core time by ten seconds.');
  buttonItem = $('<button class="btn-start" style="background:purple; margin-left:15px; color:white; font-size:1.5rem">Start Quiz</button>');

  quizListQuestions.append(h1Item, hrItem, h3Item, buttonItem);
}

// InitialQuestions sets up the first page of the Quiz and allows the user to determine when to start the quiz by clicking
// on the Start Buttton

initialiseQuestions();

// When the user clicks on the Start Button then the quiz commences and a question and the possible answers to that question are
// displayed

quizListQuestions.on("click", startQuiz, askQuestions);

// When the user has selected a particular answer then it is checked as to whether it is correct.
quizListQuestions.on("click", answerBtn, checkAnswers);

// After the end of the quiz the user will have the option to save their score to local storage.
quizListQuestions.on("click", submitBtn, saveUserScores);

// The user has the option of clearing their score from local storage.
quizListQuestions.on("click", clearBtn, clearButton);

// The user has the option of restarting the quiz.
quizListQuestions.on("click", goBackBtn, goBack);

//At the top of each page the user has an option of viewing the scores of students that are stored in local storage.
userScores.on('click', viewScoresBtn, viewScores);