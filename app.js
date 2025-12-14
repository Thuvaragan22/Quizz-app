let questions = [];
let index = 0;
let score = 0;
let timer;
let timeLeft = 10;
let answered = false;

/* ---------- Navigation ---------- */
function showLogin() {
  toggleSection("login");
}

function login() {
  const user = username.value.trim();
  if (!user) return alert("Enter username");

  localStorage.setItem("user", user);
  welcome.innerText = "Hi, " + user;
  toggleSection("quiz");
  startQuiz();
}

function toggleSection(id) {
  document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* ---------- Quiz ---------- */
fetch("questions.json")
  .then(res => res.json())
  .then(data => questions = data);

function startQuiz() {
  index = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  answered = false;
  timeLeft = 10;
  updateTimer();
  updateProgress();

  const q = questions[index];
  question.innerText = q.question;
  options.innerHTML = "";
  message.innerText = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(btn, opt, q.answer);
    options.appendChild(btn);
  });

  startTimer();
}

function checkAnswer(btn, selected, correct) {
  if (answered) return;
  answered = true;
  clearInterval(timer);

  if (selected === correct) {
    btn.classList.add("correct");
    score++;
    message.innerText = "✅ Correct!";
  } else {
    btn.classList.add("wrong");
    message.innerText = "❌ Wrong!";
  }
}

function nextQuestion() {
  if (!answered) return alert("Answer first!");

  index++;
  if (index < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

/* ---------- Timer ---------- */
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();

    if (timeLeft === 0) {
      clearInterval(timer);
      answered = true;
      message.innerText = "⏱ Time Up!";
    }
  }, 1000);
}

function updateTimer() {
  document.getElementById("timer").innerText = timeLeft;
}

/* ---------- Progress ---------- */
function updateProgress() {
  const percent = ((index + 1) / questions.length) * 100;
  document.getElementById("progress-bar").style.width = percent + "%";
}

/* ---------- Result ---------- */
function showResult() {
  toggleSection("result");
  finalScore.innerText = `Your Score: ${score} / ${questions.length}`;
}

function restartQuiz() {
  toggleSection("landing");
}

/* ---------- Theme ---------- */
function toggleTheme() {
  document.body.classList.toggle("dark");
}
