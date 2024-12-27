// ARRAY OF QUESTION
const questions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2,
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Jupiter", "Mars", "Venus", "Saturn"],
        correct: 1,
    },
    {
        question: "What is 2 + 2?",
        options: ["3", "4", "5", "6"],
        correct: 1,
    },
    {
        question: "Who painted the Mona Lisa?",
        options: [
            "Vincent Van Gogh",
            "Pablo Picasso",
            "Leonardo da Vinci",
            "Claude Monet",
        ],
        correct: 2,
    },
    {
        question: "Who is The Prophet of Islam?",
        options: ["Vincent Van Gogh", "Abubakar", "Umar Kattab", "Muhammad"],
        correct: 3,
    },
    {
        question: "What is the largest mammal in the world?",
        options: ["Elephant", "Giraffe", "Blue Whale", "Hippopotamus"],
        correct: 2,
    },
];

// QUESTIONS HANDLING
class ExamPortal {
    constructor(questions) {
        this.timerInterval = null;
        this.questions = questions;
        this.currentQuestionIndex = 0;
        this.userAnswers = new Array(questions.length).fill(null);
        this.totalTime = 40 * 60; // Total time in seconds
        this.remainingTime = this.totalTime;

        // DOM Elements
        this.timerElement = document.getElementById("timer");
        this.questionContainer = document.getElementById("question-container");
        this.optionsContainer = document.getElementById("options-container");
        this.prevBtn = document.getElementById("prev-btn");
        this.nextBtn = document.getElementById("next-btn");
        this.statusBar = document.getElementById("status-bar");
        this.resultContainer = document.getElementById("result");
        this.examContainer = document.getElementById("exam");
        this.startBtn = document.getElementById("start-btn");
        this.instruction = document.getElementById("instruction");

        this.initEventListeners();
    }

    // EVENT LISTENERS 
    initEventListeners() {
        this.startBtn.addEventListener("click", () => this.startExam());
        this.nextBtn.addEventListener("click", () => this.navigateQuestion("next"));
        this.prevBtn.addEventListener("click", () => this.navigateQuestion("prev"));
        this.optionsContainer.addEventListener("click", (e) => {
            if (e.target.classList.contains("option")) {
                this.selectOption(e.target);
            }
        });
    }

    // START EXAM
    startExam() {
        this.instruction.style.display = "none";
        this.startBtn.style.display = "none";
        this.examContainer.style.display = "block";
        this.loadQuestion();
        this.updateStatusBar();
        this.startTimer();
    }

    // TIMER
    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.remainingTime <= 0) {
                clearInterval(this.timerInterval);
                this.calculateResult();
            } else {
                this.remainingTime--;
                this.updateTimerDisplay();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.remainingTime / 60).toString().padStart(2, "0");
        const seconds = (this.remainingTime % 60).toString().padStart(2, "0");
        document.getElementById("minutes").textContent = minutes;
        document.getElementById("seconds").textContent = seconds;
    }

    // LOAD QUESTION
    loadQuestion() {
        const current = this.questions[this.currentQuestionIndex];
        this.questionContainer.innerHTML = `<h2>Question ${this.currentQuestionIndex + 1}</h2><p>${current.question}</p>`;
        this.optionsContainer.innerHTML = "";

        current.options.forEach((option, index) => {
            const optionBtn = document.createElement("div");
            optionBtn.classList.add("option");
            optionBtn.textContent = option;
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                optionBtn.classList.add("selected");
            }
            this.optionsContainer.appendChild(optionBtn);
        });

        this.prevBtn.style.display = this.currentQuestionIndex > 0 ? "block" : "none";
        this.nextBtn.textContent = this.currentQuestionIndex === this.questions.length - 1 ? "Finish" : "Next Question";
    }

    selectOption(optionBtn) {
        const options = this.optionsContainer.querySelectorAll(".option");
        options.forEach((opt) => opt.classList.remove("selected"));
        optionBtn.classList.add("selected");
        this.userAnswers[this.currentQuestionIndex] = Array.from(options).indexOf(optionBtn);
    }

    // NAVIGATING THROUGH QUESTIONS
    navigateQuestion(direction) {
        if (direction === "next") {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.loadQuestion();
            } else {
                this.calculateResult();
            }
        } else if (direction === "prev" && this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.loadQuestion();
        }
        this.updateStatusBar();
    }

    // STATUS BAR
    updateStatusBar() {
        const answeredQuestions = this.userAnswers.filter((answer) => answer !== null).length;
        const progressPercentage = Math.round((answeredQuestions / this.questions.length) * 100);

        const width = progressPercentage + "%";
        this.statusBar.style.width = width;

        const statusText = document.querySelector(".status-text");
        statusText.textContent =
            progressPercentage === 0
                ? "0% complete, let's get started!"
                : `${progressPercentage}% complete, keep it up!`;
    }

    // CALCULATE RESULT
    calculateResult() {
        clearInterval(this.timerInterval);

        let score = 0;
        this.userAnswers.forEach((answer, index) => {
            if (answer === this.questions[index].correct) {
                score++;
            }
        });

        const percentage = ((score / this.questions.length) * 100).toFixed(2);
        const timeUsed = this.totalTime - this.remainingTime;
        const minutes = Math.floor(timeUsed / 60);
        const seconds = timeUsed % 60;

        document.getElementById("exam").style.display = "none";
        this.resultContainer.style.display = "block";
        this.resultContainer.innerHTML = `
            <i class="fa fa-check-square-o" aria-hidden="true"></i>
            <h2>Exam Result</h2>
            <p>Total Questions: ${this.questions.length}</p>
            <p>Correct Answers: ${score}</p>
            <p class="resultH1">Score: ${percentage}%</p>
            <p>Time Used: ${minutes} minutes ${seconds} seconds</p>
        `;
    }
}

const examPortal = new ExamPortal(questions);
