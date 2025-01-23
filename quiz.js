const readline = require('readline');

// Step 1: Define the quiz questions
const questions = [
  {
    question: "What component is considered the brain of the computer?",
    options: ["A. Hard Drive", "B. CPU", "C. RAM", "D. GPU"],
    answer: "B",
  },
  {
    question: "Which of the following is a type of volatile memory?",
    options: ["A. SSD", "B. HDD", "C. RAM", "D. ROM"],
    answer: "C",
  },
  {
    question: "What does BIOS stand for?",
    options: ["A. Basic Integrated Operating System", "B. Basic Input Output System", "C. Binary Input Output System", "D. Basic Input Operational System"],
    answer: "B",
  },
];

// Step 2: Quiz state management variables
let score = 0;
let timedOutQuestions = 0;
let wrongAnswers = 0;
let currentQuestionIndex = 0;

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Step 3: Core function to handle each question with a countdown timer
const askQuestion = async (questionObj, index) => {
  console.log(`\nQuestion ${index + 1}: ${questionObj.question}`);
  questionObj.options.forEach(option => console.log(option)); // Display question options

  // Timer logic to count down from 10 seconds
  let timeLeft = 10;
  const timer = setInterval(() => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Time remaining: ${timeLeft} seconds`);
    timeLeft--;
  }, 1000);

  // Handle user input with a promise that resolves when input is received or time runs out
  const userAnswer = await getUserAnswerOrTimeout(timer);

  // Validate and process the user's answer
  if (userAnswer === 'timeout') {
    timedOutQuestions++;
    console.log("\nTime's up! Moving to the next question.");
  } else if (userAnswer.toUpperCase() === questionObj.answer) {
    console.log("Correct!");
    score++;
  } else {
    console.log(`Wrong answer! The correct answer was ${questionObj.answer}.`);
    wrongAnswers++;
  }
};

// Step 4: Function to handle user input or timeout (resolves after input or timeout)
const getUserAnswerOrTimeout = (timer) => {
  return new Promise((resolve) => {
    let answered = false;

    // Set up listener for user input
    rl.question('\nYour answer: ', (userInput) => {
      if (!answered) {
        clearInterval(timer);
        answered = true;
        resolve(userInput);
      }
    });

    // Resolve as 'timeout' if user didn't answer in time
    setTimeout(() => {
      if (!answered) {
        clearInterval(timer);
        answered = true;
        resolve('timeout');
      }
    }, 10000);
  });
};

// Step 5: Function to manage the entire quiz flow
const startQuiz = async () => {
  console.log("Welcome to the Professional Timed Quiz!\n");

  // Loop through each question asynchronously
  while (currentQuestionIndex < questions.length) {
    await askQuestion(questions[currentQuestionIndex], currentQuestionIndex);
    currentQuestionIndex++;
  }

  // Step 6: Display the final results
  displayQuizSummary();
  rl.close(); // Close readline interface
};

// Step 6: Function to display quiz summary and analysis
const displayQuizSummary = () => {
  console.log(`\n--- Quiz Summary ---`);
  console.log(`Total Questions: ${questions.length}`);
  console.log(`Correct Answers: ${score}`);
  console.log(`Wrong Answers: ${wrongAnswers}`);
  console.log(`Timed-Out Questions: ${timedOutQuestions}`);
  console.log(`Final Score: ${score}/${questions.length}`);
};

// Start the quiz
startQuiz();
