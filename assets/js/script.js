                       
var quizListQuestions = $('#quiz-list');
var userScores = $('#user-scores');                   ;
var timeResult = $('#time-result');

var startQuiz = '.btn-start';
var answerBtn = '.btn-select';
var submitBtn = '.btn-initials';
var clearBtn = '.btn-clear';
var goBackBtn = '.btn-goBack';
var viewScoresBtn = '.btn-viewScores';

var getStudentScores;

let studentTotal=0;
let setIndex = 0;
//var parentElement;
let timeLeft = 30;
let timePenalty = 0;
let timeInterval;
let stopTimer = false;
let waitTime;

var questionSet = {
    question: ['Commonly used DataTypes DO NOT include', 'The condition in an IF/Else statement is enclosed within _____'],
    answers: ['strings boolean alerts numbers', 'quotes curly-brackets parenthesis square-brackets'],
    incorrect:['alerts', 'parenthesis']
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
  timeLeft = 30;
  stopTimer = false;
  timePenalty = 0;

  clearQuestions ()
  $("#quiz-list").trigger("reset");
 // clearInterval(timeInterval);
 // clearTimeout(waitTime);
  initialiseQuestions();
}

function setTime() {
  console.log('setTime' + timeLeft);
  let timerResult;

  timeInterval = setInterval(function () {
  timeLeft = timeLeft + timePenalty;

  if (timeLeft < 0) {
    timeLeft = 0;
  }

  timerResult = document.querySelector('#time-result');
  timerResult.lastElementChild.textContent = timeLeft;
      
  timePenalty = 0;

  if (timeLeft <= 0 || stopTimer) {
    clearInterval(timeInterval);
   
    finalScores();
  }
  timeLeft--;
  }, 1000);
}

function clearButton(event) {
  console.log('clearing Button');
  let clearScore;

  event.stopPropagation();

  clearScore  = document.querySelector('.show-scores');

  if (clearScore !== null) {
    $('.show-scores').remove(); 
    localStorage.removeItem("studentScores");
  }
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

function viewScores(event){
  console.log('view Scores');
  let score;

  event.stopPropagation()

  score  = document.querySelector('.view-scores');
  console.log ('view-Scores' + score);
  if (score === null) {
    console.log('getting scores');
    getHighScores();
    if (getStudentScores !== null) {
      ulItem = $('<ul class="view-scores" style="margin-left:55px">').text('High Scores');
      liItem = $('<li class="view-scores" style="margin-left:65px">').text(getStudentScores.initials + ' ' + getStudentScores.score);
      userScores.append(ulItem, liItem);
    }
  } 
  else {
   $('.view-scores').remove();    
  }
}

function getHighScores(event) {
  console.log("get scores");
  getStudentScores = JSON.parse(localStorage.getItem("studentScores"));

  if (getStudentScores !== null) {
    console.log('Initials ' + getStudentScores.initials + 'Score ' + getStudentScores.score);
  }
}

function saveUserScores(event){
  console.log('saveUserDetails');
  event.stopPropagation();
  //parent = document.querySelector('.initials');
  //console.log(parent);

  studentScores.initials =document.querySelector('.initials').value;
  studentScores.score  = studentTotal;

  studentScores = localStorage.setItem("studentScores", JSON.stringify(studentScores));

  clearQuestions();
  
  getHighScores();

  ulItem = $('<ul class="show-scores" style="margin-left:55px">').text('High Scores');
  liItem = $('<li class="show-scores" style="margin-left:65px">').text(getStudentScores.initials + ' ' + getStudentScores.score);
  buttonItem1 = $('<button class="btn-clear" style="margin:15px">Clear</button>');
  buttonItem2 = $('<button class="btn-goBack" style="margin:15px;">Go Back</button>');

  quizListQuestions.append(ulItem, liItem, buttonItem1, buttonItem2);

}

function clearQuestions () {
  
  $('#quiz-list').empty();

}

function checkAnswers(event) {
  console.log('checkAnswers ' + timeLeft);
  event.stopPropagation();
  let answerText, questionChk, waitTime;
  
  questionChk     = event.target.innerText;
  answerTextArray = questionSet.incorrect[setIndex].split(" ");

  answerText = "Wrong!";
  timePenalty = -10;

  for (let i=0; i < answerTextArray.length; i++) {
    if (answerTextArray[i] === questionChk) {
      studentTotal = studentTotal +1;
      answerText = "Correct!";
      timePenalty = 0;
    }
  }
  console.log ('answer ' + answerText);
  pItem = $('<p>').text(answerText);
  quizListQuestions.append(pItem);

  waitTime = setTimeout(askQuestions, 1000, event);
  
}


function askQuestions(event) {
  console.log('askQuestions'  + event + 'Index ' + setIndex);
  event.stopPropagation();
  
  if (event != null) {
    console.log('ask questions event is null or undefined');
    
    if (event.currentTarget.className === 'btn-start') {
     console.log('ask Questions hereA');
     event.preventDefault();
     
     clearQuestions();
     setTime();
    }
    else{
      setIndex = setIndex + 1;
      console.log('ask Questions hereB1');
      clearQuestions();
    }
  }
 // else {
 //   setIndex = setIndex +1;
  //  console.log('ask Questions hereC2');
 //   clearQuestions();
 //
//
//}
 // console.log('displaying Questions');
  if (setIndex < questionSet.question.length) {
    var newQuestionItem = $('<ul>');
    newQuestionItem.text(questionSet.question[setIndex]);
    newQuestionItem.appendTo(quizListQuestions);
  
    answerTextArray = questionSet.answers[setIndex].split(" ");
    for (let i=0; i < answerTextArray.length; i++) {
      var newAnswerText = $('<li button class="btn-select align-left p-2 bg-light text-dark" style="list-style:decimal; margin:15px">');
      newAnswerText.text(answerTextArray[i]);
      newAnswerText.appendTo(quizListQuestions);
    }
  } else {
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
  h3Item = $('<h3>').text('Try to answerthe following code-related questions within the time limit.  Keep in mind that incorrect answers will penalize your core time by ten seconds.');
  buttonItem = $('<button class="btn-start" style="background:purple; margin-left:15px; color:white; font-size:1.5rem">Start Quiz</button>');
  
  quizListQuestions.append(h1Item, hrItem, h3Item, buttonItem);
}

initialiseQuestions();        
                
quizListQuestions.on("click", startQuiz, askQuestions);
quizListQuestions.on("click", answerBtn, checkAnswers);
quizListQuestions.on("click", submitBtn, saveUserScores);      
quizListQuestions.on("click", clearBtn, clearButton);
quizListQuestions.on("click", goBackBtn, goBack);
userScores.on('click', viewScoresBtn, viewScores);