/*
  Trivia Game for home work 5 

  In this game I wanted to see if I could apply the layout from the starwars game I did for the previous homework

  Things I learned:

  - setInterval, setTimeout
  - Deeper understanding of Bootstrap data attributes
  - Randomizing arrays is hard and there are alot if opinions about it on stackOverflow
  - state is complicated...
  
*/

// create a list of questions
const questions = [
  {
    question: "What does the following code snippet output?",
    choices: ["Undefined", "Window", "Object", "This"],
    answer: 1,
    snippet: `
    function foo(){
      return this
    }
    console.log(foo());
   `
  },
  {
    question: "What does the following code snippet output?",
    choices: ["Undefined", "Error", "3", "a"],
    answer: 2,
    snippet: `
    var sample = fuction(){
      var a = b = 3;
    };
    sample();
    console.log(b);
    `
  },
  {
    question: "In what order will the numbers 1-4 be logged to the console when the code below is executed?",
    choices: ["1, 4, 3, 2", "1, 2, 3, 4", "3, 2, 4, 1", "4, 3, 2, 1"],
    answer: 0,
    snippet: `
    (function() {
      console.log(1); 
      setTimeout(function(){console.log(2)}, 1000); 
      setTimeout(function(){console.log(3)}, 0); 
      console.log(4);
    })();
   `
  },
  {
    question: "What would the following line of code output to the console?",
    choices: ["True", "False", "0 || 1 = 0", "0 || 1 = 1"],
    answer: 3,
    snippet: `
    console.log("0 || 1 = "+(0 || 1));
   `
  },
  {
    question: "What will the following code output to the console?",
    choices: ["2,000,000", "1", "3,628,800", "628"],
    answer: 2,
    snippet: `
    console.log((function f(n){return ((n > 1) ? n * f(n-1) : n)})(10));
   `
  },
  {
    question: "What will the following code output to the console?",
    choices: ["1", "a", "1, a", "1a"],
    answer: 1,
    snippet: `
    console.log((1,'a'));
   `
  },
  {
    question: "What is the variable a equal to after this code runs",
    choices: ["81", "14", "63", "36"],
    answer: 2,
    snippet: `
    var a = 9;

    function multiply(b){
      var a = 7;
      return function(c){
        return a*c;
      }
    }

    a = multiply(2)(9);
   `
  },
];
const quizzObserver = new observer();
// create the game ob
const quizModel = {
  state: {
    timer: null,
    time: 60,
    currentQuestion: 0,
    screen: "start",
    correct: 0,
    randomizeQuestions: [],
    end: false
  },
  init: function() {
    // create random questions
    this.state.randomizeQuestions = questions.sort(function(a, b) {
      return 0.5 - Math.random();
    });
    // add event listeners for current screens buttons
    this.handleInput();
    // return this object for the observer
    return this;
  },
  timerUpdate: function() {
    // decrement time
    this.state.time -= 1;
    if (this.state.time <= 0) {
      this.lose();
    } else {
      quizzObserver.notify(this.state);
    }
  },
  update: function() {
    if (this.state.end) {
      // set the screen state to end the quiz
      this.state.screen = "end";
      // make sure end flag is reset if changes occured
      this.state.end = false;
      // let the observer know that the state has been updated
      quizzObserver.notify(this.state);
    }
    // set event handler
    this.handleInput();
  },
  lose: function() {
    // remove the timer
    clearInterval(this.state.timer);
    // set the screen state to end
    this.state.screen = "end";
    // tell the observer to update
    quizzObserver.notify(this.state);
  },
  reset: function() {
    // clear the timer
    clearInterval(this.state.timer);
    // reset state
    this.state = {
      time: 60,
      currentQuestion: 0,
      screen: "start",
      correct: 0,
      randomizeQuestions: questions.sort(function(a, b) {
        return 0.5 - Math.random();
      }),
      end: false
    };
    // notify the observer
    quizzObserver.notify(this.state);
  },
  handleInput: function() {
    switch (this.state.screen) {
      case "start":
        handleStartInput(this);
        break;
      case "quiz":
        handleQuizInput(this);
        break;
      case "end":
        handleEndInput(this);
        break;
    }
  },
  checkAnswer: function(answer) {
    // if answer is correct update this.state.correct
    if (
      this.state.randomizeQuestions[this.state.currentQuestion].answer ===
      answer
    ) {
      // increment the correct number of questions
      this.state.correct += 1;
    }
    // move to the next question
    this.incrementCurrentQuestion();
    // tell the observer the state was updated
    quizzObserver.notify(this.state);
  },
  incrementCurrentQuestion: function() {
    this.state.currentQuestion += 1;
    // if our current question is greater than our array set current question to array length
    if (this.state.currentQuestion >= this.state.randomizeQuestions.length) {
      this.state.currentQuestion = this.state.randomizeQuestions.length - 1;
      this.handleEnd();
    }
  },
  handleEnd: function() {
    this.state.end = true;
    clearInterval(this.state.timer);
  }
};

function handleStartInput(context) {
  $("#start-button").on("click", () => {
    // clear timer
    clearInterval(context.state.timer);
    // set the state to quiz
    context.state.screen = "quiz";
    context.state.timer = setInterval(context.timerUpdate.bind(context), 1000);
    quizzObserver.notify(context.state);
  });
}

function handleQuizInput(context) {
  $(".question-answer").on("click", function() {
    context.checkAnswer($(this).data("index"));
  });
}

function handleEndInput(context) {
  $("#end-button").on("click", function() {
    context.reset();
  });
}

const quizView = {
  init: function() {
    return this;
  },
  update: function(data) {
    this.render(data);
  },
  render: function(data) {
    switch (data.screen) {
      case "start":
        renderStart();
        break;
      case "quiz":
        renderQuiz(data);
        break;
      case "end":
        renderEnd(data);
        break;
    }
  }
};

function renderStart() {
  $("#starting-section").addClass("d-flex");
  $("#end-section").removeClass("d-flex");
  $("#question-section").removeClass("d-flex");
}

function renderQuiz(data) {
  $("#starting-section").removeClass("d-flex");
  $("#end-section").removeClass("d-flex");

  $("#question-section").empty();
  $("#question-section").append(`
  <div class="card text-center w-50">
  <h5 class="card-header">Question: ${data.currentQuestion + 1} | Time: ${
    data.time
  }</h5>
  <div class="card-body text-left">
      <p class="card-title">Q: ${
        data.randomizeQuestions[data.currentQuestion].question
      }</p>
      ${
        !data.randomizeQuestions[data.currentQuestion].snippet
          ? ""
          : '<div class="border border-primary rounded m-3"><code style="white-space: pre-wrap" >' +
            data.randomizeQuestions[data.currentQuestion].snippet +
            "</code></div>"
      }
    <ul class="list-group list-group-flush">
      ${data.randomizeQuestions[data.currentQuestion].choices.reduce(function(
        acc,
        cur,
        index
      ) {
        acc += `<li class="list-group-item"><button class="btn-primary btn-lg btn-block question-answer" data-index=${index}>${cur}</button></li>`;
        return acc;
      },
      "")}
    </ul>
  </div>
  </div>
  `);
  $("#question-section").addClass("d-flex");
}

function renderEnd(data) {
  $("#question-section").removeClass("d-flex");
  $("#end-section").addClass("d-flex");
  $("#end-card-body").empty();
  $("#end-card-body").append(`
    <h1 class="card-title">
      ${
        Math.floor(data.correct / data.randomizeQuestions.length) * 100 > 90
          ? "<span class='text-success'>You have Passed!</span>"
          : "<span class='text-danger'>You have Failed!</span>"
      }
    </h1>
    <p class="card-text">Answers ${data.correct} / ${
    data.randomizeQuestions.length
  } correct</p>
  `);
}

// create an observer that will update our object when things change
function observer() {
  let observers = [];
  return {
    subscribe(callback) {
      observers.push(callback);
    },
    unsubscribe(f) {
      observers = observers.filter(subsciber => subsciber !== f);
    },
    notify(data) {
      observers.forEach(observer => observer.update(data));
    }
  };
}

$(document).ready(function() {
  // initialize the observer
  quizzObserver.subscribe(quizView.init());
  quizzObserver.subscribe(quizModel.init());
});
