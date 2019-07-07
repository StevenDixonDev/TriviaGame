

// create a list of questions
const questions = [
  //{question: '', choices: [], answer, snippet: ``},
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
    choices: ["Undefined", "Window", "Object", "This"],
    answer: 1,
    snippet: `
    function foo(){
      return this
    }
    console.log(foo());
    `
  },
];
const quizzObserver = new observer();
// create the game ob
const quizModel = {
  state: {
    timer: null,
    time: 300,
    currentQuestion: 0,
    screen: 'start',
    correct: 0,
    randomizeQuestions: [],
    end: false
  },
  init: function () {
    this.state.timer = setInterval(this.timerUpdate.bind(this), 1000);
    this.state.randomizeQuestions = questions.sort(function (a, b) { return 0.5 - Math.random() })
    this.handleInput();
    return this;
  },
  timerUpdate: function () {
    //console.log(this.state.time)
    this.state.time -= 1;
    if (this.state.time <= 0) {
      this.lose();
    }
  },
  update: function () {
    if(this.state.end){
      // set the screen state to end the quiz
      this.state.screen = 'end';
      this.state.end = false;
      // let the observer know that the state has been updated
      quizzObserver.notify(this.state);
    }

    this.handleInput();
    //quizzObserver.notify(this.state);
  },
  lose: function () {
    // remove the timer
    clearInterval(this.state.timer);
    // set the screen state to end
    this.state.screen = "end";
    // tell the observer to update
    quizzObserver.notify(this.state);
  },
  reset: function () {
    // clear the timer
    clearInterval(this.state.timer);
    // reset state timer
    this.state.timer = null;
    // set time to default
    this.state.time = 300;
    // notify the observer
    quizzObserver.notify(this.state);
  },
  handleInput: function () {
    switch (this.state.screen) {
      case 'start': handleStartInput(this); break;
      case 'quiz': handleQuizInput(this); break;
      case 'end': handleEndInput(this); break;
    }
  },
  checkAnswer: function (answer) {
    // if answer is correct update this.state.correct
    console.log(answer)
    if(this.state.randomizeQuestions[this.state.currentQuestion].answer === answer){
      console.log('correct');
      // increment the correct number of questions
      this.state.correct += 1;
    }
    // move to the next question
    this.incrementCurrentQuestion();
    // tell the observer the state was updated
    quizzObserver.notify(this.state);
  },
  incrementCurrentQuestion: function () {
    this.state.currentQuestion += 1;
    console.log(this.state.currentQuestion)
    // if our current question is greater than our array set current question to array length
    if (this.state.currentQuestion >= this.state.randomizeQuestions.length) {
      this.state.currentQuestion = this.state.randomizeQuestions.length -1;
      this.state.end = true;
    }
  }
}

function handleStartInput(context) {
  $('#start-button').on('click', () => {
    context.state.screen = 'quiz';
    quizzObserver.notify(context.state);
  })
}

function handleQuizInput(context) {
  $(".question-answer").on('click', function(){
    context.checkAnswer($(this).data('index'))
  })
}

function handleEndInput(context) {

}


const quizView = {
  init: function () {
    return this;
  },
  update: function (data) {
    this.render(data);
  },
  render: function (data) {
    switch (data.screen) {
      case 'start': renderStart(); break;
      case 'quiz': renderQuiz(data); break;
      case 'end': renderEnd(data); break;
    }
  },
}

function renderStart() {
  $("#starting-section").addClass('d-flex');
  $('#question-section').addClass('d-none');
}

function renderQuiz(data) {
  $("#starting-section").removeClass('d-flex');
  $('#question-section').empty();
  $('#question-section').append(`
  <div class="card text-center">
  <h5 class="card-header">Question ${data.currentQuestion} </h5>
  <div class="card-body text-left">
      <p class="card-title">Q: ${data.randomizeQuestions[data.currentQuestion].question}</p>
      ${!data.randomizeQuestions[data.currentQuestion].snippet ? "" :
      '<code style="white-space: pre-wrap" class="border-primary">' + data.randomizeQuestions[data.currentQuestion].snippet + '</code>'
    }
    <ul class="list-group list-group-flush">
      ${data.randomizeQuestions[data.currentQuestion].choices.reduce(function(acc, cur, index){
        acc += `<li class="list-group-item"><button class="btn-primary btn-lg btn-block question-answer" data-index=${index}>${cur}</button></li>`;
        return acc;
      },"")}
    </ul>
  </div>
  </div>
  `);
  $('#question-section').removeClass('d-none');
  $('#question-section').addClass('d-flex');
}

function renderEnd() {
  console.log('rendering')
  $('#question-section').addClass('d-none');
  $('#question-section').removeClass('d-flex');
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

$(document).ready(function () {
  console.log('ready');
  // initialize the observer
  //quizzObserver.subscribe(quizModel.init());
  quizzObserver.subscribe(quizView.init());
  quizzObserver.subscribe(quizModel.init());
})