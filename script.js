/* ============================================
   QUIZ MASTER - JAVASCRIPT FUNCTIONALITY
   ============================================ */

// Quiz State Management
const quizState = {
    selectedCategory: '',
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    score: 0,
    categories: {}
};

// Initialize Quiz Application
function initializeApp() {
    loadCategoriesFromDatabase();
    populateCategoryDropdown();
}

// Load categories from database
function loadCategoriesFromDatabase() {
    // Access the quizDatabase from database.js
    if (typeof quizDatabase !== 'undefined') {
        quizState.categories = quizDatabase;
    }
}

// Populate the category dropdown
function populateCategoryDropdown() {
    const categorySelect = document.getElementById('categorySelect');
    
    // Clear existing options except the first two
    while (categorySelect.options.length > 2) {
        categorySelect.remove(2);
    }

    // Add categories dynamically
    for (const category in quizState.categories) {
        if (quizState.categories.hasOwnProperty(category)) {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        }
    }
}

// Start Quiz
function startQuiz() {
    const selectedValue = document.getElementById('categorySelect').value;

    if (!selectedValue) {
        alert('Please select a category!');
        return;
    }

    quizState.selectedCategory = selectedValue;

    // Get questions based on selection
    if (selectedValue === 'all') {
        // Mix all questions from all categories
        quizState.questions = getAllQuestionsShuffled();
    } else {
        // Get questions from selected category
        quizState.questions = [...quizState.categories[selectedValue]];
    }

    // Shuffle questions
    quizState.questions = shuffleArray(quizState.questions);

    // Reset state
    quizState.currentQuestionIndex = 0;
    quizState.userAnswers = new Array(quizState.questions.length).fill(null);
    quizState.score = 0;

    // Show quiz screen
    switchScreen('quizScreen');
    displayQuestion();
    updateNavigationButtons();
}

// Get all questions from all categories shuffled
function getAllQuestionsShuffled() {
    const allQuestions = [];
    
    for (const category in quizState.categories) {
        if (quizState.categories.hasOwnProperty(category)) {
            allQuestions.push(...quizState.categories[category]);
        }
    }

    return shuffleArray(allQuestions);
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Display current question
function displayQuestion() {
    const question = quizState.questions[quizState.currentQuestionIndex];
    const questionNumber = quizState.currentQuestionIndex + 1;
    const totalQuestions = quizState.questions.length;

    // Update question number and score
    document.getElementById('questionNumber').textContent = `Question ${questionNumber} of ${totalQuestions}`;
    document.getElementById('scoreDisplay').textContent = `Score: ${quizState.score}`;

    // Update progress bar
    const progress = (questionNumber / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;

    // Update category tag
    document.getElementById('categoryTag').textContent = question.category;

    // Update question text
    document.getElementById('questionText').textContent = question.question;

    // Display options
    displayOptions(question);
}

// Display options for current question
function displayOptions(question) {
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    const userAnswer = quizState.userAnswers[quizState.currentQuestionIndex];
    const isAnswered = userAnswer !== null;

    question.options.forEach((option, index) => {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        
        const optionId = `option-${index}`;
        const isChecked = userAnswer === index;

        // Determine styling based on answer feedback
        let feedbackClass = '';
        if (isAnswered) {
            if (index === question.correctAnswer) {
                feedbackClass = 'correct-answer';
            } else if (isChecked && index !== question.correctAnswer) {
                feedbackClass = 'wrong-answer';
            }
        }

        optionDiv.innerHTML = `
            <input 
                type="radio" 
                id="${optionId}" 
                name="quiz-option" 
                value="${index}"
                ${isChecked ? 'checked' : ''}
                onchange="selectAnswer(${index})"
                ${isAnswered ? 'disabled' : ''}
            >
            <label for="${optionId}" class="option-label ${feedbackClass}">
                <span class="option-checkmark"></span>
                <span>${option}</span>
            </label>
        `;

        optionsContainer.appendChild(optionDiv);
    });
}

// Select an answer
function selectAnswer(optionIndex) {
    quizState.userAnswers[quizState.currentQuestionIndex] = optionIndex;
    
    // Calculate score immediately
    const question = quizState.questions[quizState.currentQuestionIndex];
    if (optionIndex === question.correctAnswer) {
        quizState.score++;
    }
    
    // Update score display
    document.getElementById('scoreDisplay').textContent = `Score: ${quizState.score}`;
    
    // Refresh options to show feedback
    displayOptions(question);
    
    // Disable further changes after answer is selected
    const radioButtons = document.querySelectorAll('input[name="quiz-option"]');
    radioButtons.forEach(radio => radio.disabled = true);
}

// Move to next question
function nextQuestion() {
    const userAnswer = quizState.userAnswers[quizState.currentQuestionIndex];
    
    if (userAnswer === null) {
        alert('Please select an answer before proceeding!');
        return;
    }

    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
        quizState.currentQuestionIndex++;
        displayQuestion();
        updateNavigationButtons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        // Quiz finished
        finishQuiz();
    }
}

// Move to previous question
function previousQuestion() {
    if (quizState.currentQuestionIndex > 0) {
        quizState.currentQuestionIndex--;
        displayQuestion();
        updateNavigationButtons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}


// Update navigation buttons visibility
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const isFirstQuestion = quizState.currentQuestionIndex === 0;
    const isLastQuestion = quizState.currentQuestionIndex === quizState.questions.length - 1;

    prevBtn.style.display = isFirstQuestion ? 'none' : 'block';
    nextBtn.textContent = isLastQuestion ? 'Finish Quiz' : 'Next →';
}

// Finish Quiz
function finishQuiz() {
    // The score is already calculated as user answers questions
    // (No need to recalculate the last question since it's done in nextQuestion)
    
    // Display results
    displayResults();
    switchScreen('resultsScreen');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Display Results
function displayResults() {
    const totalQuestions = quizState.questions.length;
    const percentage = Math.round((quizState.score / totalQuestions) * 100);

    // Update result title and icon
    let resultTitle, resultIcon;
    if (percentage === 100) {
        resultTitle = '🌟 Perfect Score!';
        resultIcon = '🏆';
    } else if (percentage >= 80) {
        resultTitle = '🎉 Excellent!';
        resultIcon = '😊';
    } else if (percentage >= 60) {
        resultTitle = '👍 Good Job!';
        resultIcon = '😌';
    } else if (percentage >= 40) {
        resultTitle = '📚 Keep Practicing!';
        resultIcon = '🤔';
    } else {
        resultTitle = '💪 Don\'t Give Up!';
        resultIcon = '😅';
    }

    document.getElementById('resultIcon').textContent = resultIcon;
    document.getElementById('resultTitle').textContent = resultTitle;
    document.getElementById('finalScore').textContent = `${quizState.score}/${totalQuestions}`;
    document.getElementById('finalPercentage').textContent = `${percentage}%`;
    document.getElementById('correctCount').textContent = quizState.score;

    // Display detailed results
    displayResultDetails();
}

// Display detailed results for each question
function displayResultDetails() {
    const resultDetails = document.getElementById('resultDetails');
    resultDetails.innerHTML = '<h3 style="text-align: left; margin-bottom: 1rem; color: var(--dark);">Review Your Answers</h3>';

    quizState.questions.forEach((question, index) => {
        const userAnswerIndex = quizState.userAnswers[index];
        const isCorrect = userAnswerIndex === question.correctAnswer;

        const resultQuestion = document.createElement('div');
        resultQuestion.className = 'result-question';

        const correctAnswerText = question.options[question.correctAnswer];
        const userAnswerText = userAnswerIndex !== null ? question.options[userAnswerIndex] : 'Not answered';

        resultQuestion.innerHTML = `
            <div class="result-question-text">Q${index + 1}: ${question.question}</div>
            <div class="result-answer ${isCorrect ? 'correct' : 'incorrect'}">
                ${isCorrect ? '✓' : '✗'} Your answer: ${userAnswerText}
            </div>
            ${!isCorrect ? `<div class="result-answer correct">✓ Correct answer: ${correctAnswerText}</div>` : ''}
        `;

        resultDetails.appendChild(resultQuestion);
    });
}

// Retake Quiz
function retakeQuiz() {
    startQuiz();
}

// Back to Home
function backToHome() {
    quizState.currentQuestionIndex = 0;
    quizState.userAnswers = [];
    quizState.score = 0;
    switchScreen('welcomeScreen');
    document.getElementById('categorySelect').value = '';
}

// Switch between screens
function switchScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// Initialize app on page load
document.addEventListener('DOMContentLoaded', initializeApp);
