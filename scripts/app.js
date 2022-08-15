const fruits = [
  {name: 'Apple', src: "encoded-string-1.jpg"},{name: 'Banana', src: "encoded-string-2.jpg"},{name: 'Cherry', src: "encoded-string-3.jpg"},{name: 'Grape', src: "encoded-string-4.jpg"},{name: 'Orange', src: "encoded-string-5.jpg"},{name: 'Peach', src: "encoded-string-6.jpg"},{name: 'Pear', src: "encoded-string-7.jpg"},{name: 'Strawberry', src: "encoded-string-8.jpg"},{name: 'Watermelon', src: "encoded-string-9.jpg"}
];

let previousAnswers = new Set();
let questionNumber = 1;
let totalQuestions = 5;
let selectedAnswer;
let correctAnswer;
let rightAnswers = 0;

const img = document.getElementById('image');
const answers = document.querySelectorAll('.answer');
const answerBox = document.querySelector('.answers');
const nextButton = document.getElementById('next');
const questionContainer = document.querySelector('.question-container');



function random(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}

function populateAnswers(correct) {
  let choices = [];
  const correctIndex = random(0,3); //random index to put the correct answer in the choices
  let wrongAnswers = fruits.filter(value => value.name != correct); //Array of wrong answers


  while (choices.length < 4) { // create 4 random choices with the correct answer included in a random position
    let wrongFruit = wrongAnswers[random(0, wrongAnswers.length - 1)]; // get a random fruit from wrong answers to fill the choices
    let i = choices.length; //contains current index of choices


    if(i === correctIndex) {choices.push(correct)}
    else if(!choices.includes(wrongFruit.name)) {choices.push(wrongFruit.name)}
  }

  for(let i = 0; i < answers.length; i++) {
    answers[i].innerHTML = choices[i];
  }
}

function generateQuestion() {

  //get a random fruit to put into the image
  let index = random(0, fruits.length - 1)
  let fruit = fruits[index];

  if(previousAnswers.has(fruit.name)) {generateQuestion()} //does not use the same fruit twice
  else{
    img.src = `images/${fruit.src}`;
    previousAnswers.add(fruit.name);

    correctAnswer = fruit.name;

    populateAnswers(correctAnswer);
  }

}

function goNext() {
  if(questionNumber == totalQuestions) {
    questionContainer.innerHTML = `You got ${rightAnswers} / ${totalQuestions} answers right.<button id="again">Play Again </button>`;
    again.onclick = function(event) {location.reload()};
  };

  questionNumber++;
  number.innerHTML = `${questionNumber}/${totalQuestions}`;
  generateQuestion();
}

async function highlightCorrectAnswer() {
  for(let i = 0; i < answers.length; i++) {
    if (answers[i].textContent === correctAnswer) {
      answers[i].classList.add('correct');
    } else {
      answers[i].classList.add('incorrect');
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 1250)); //highlight answers for 1.25 seconds before removing highlights
  answers.forEach(answer => {
    answer.classList.remove('correct');
    answer.classList.remove('incorrect');
    });
}

generateQuestion();

let number = document.getElementById('number');
number.innerHTML = `${questionNumber}/${totalQuestions}`;

let question = document.querySelector('.question');
question.innerHTML = 'What fruit is this?';

//Prevent people from dragging the image or saving it
img.addEventListener('mousedown', (e) => e.preventDefault());
img.addEventListener('contextmenu', (e) => e.preventDefault());

function handleClick(event) {
  let target = event.target;
  if(target.className != 'answer') return;

  answers.forEach(answer => answer.classList.remove('selected'));

  target.classList.add('selected');
  
  selectedAnswer = target.textContent;
}

answerBox.addEventListener('click', handleClick);

async function handleSubmit() {
  answers.forEach(answer => answer.classList.remove('selected'));
  await highlightCorrectAnswer();
  if(selectedAnswer === correctAnswer) rightAnswers++;
  goNext()
}

nextButton.addEventListener('click', handleSubmit);
