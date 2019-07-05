

// create a list of questions
const questions = [];
const quizzObserver = new observer();
// create the game ob
const  quizModel = {
  state: {
    timer: null,
    time: 0,
    currentQuestion: 0
  },
  init: function(){
    this.state.timer = setInterval(this.timerUpdate.bind(this),1000);
  },
  timerUpdate: function(){
    console.log(this.state.time)
    this.state.time +=1;
    if(this.state.time >= 10){
      this.lose();
    }
  },
  update: function(){

  },
  lose: function(){
    console.log('you have lost');
    clearInterval(this.state.timer);
  },
  reset: function(){
    clearInterval(this.state.timer);
    this.state.timer = null;
    this.state.time = 0;
  }
}

const quizView = {
  init: function(){},
  update: function(data){},
  render: function(data){},
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

$(document).ready(function(){
  console.log('ready');
  // initialize the observer
  quizzObserver.subscribe(quizModel.init());
  quizzObserver.subscribe(quizView.init());
})