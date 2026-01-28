/* ============================================
   QUIZ MASTER - ENHANCED SCRIPT WITH USER PROGRESS
   ============================================ */

// Quiz State Management
const quizState = {
    selectedCategory: '',
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    score: 0,
    categories: {},
    shuffledQuestions: []
};

// User Progress Tracking
const userProgress = {
    name: 'Guest User',
    avatar: '👤',
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    categoryProgress: {} // Tracks progress per category
};

// Initialize App
function initializeApp() {
    loadUserData();
    loadCategoriesFromDatabase();
    populateDrawerCategories();
    displayDashboard();
}

// Load categories from database
function loadCategoriesFromDatabase() {
    if (typeof quizDatabase !== 'undefined') {
        quizState.categories = quizDatabase;
        
        // Initialize category progress tracking
        for (const category in quizState.categories) {
            if (!userProgress.categoryProgress[category]) {
                userProgress.categoryProgress[category] = {
                    questionsAnswered: 0,
                    correctAnswers: 0
                };
            }
        }
    }
}

// Populate drawer with categories
function populateDrawerCategories() {
    const drawerList = document.getElementById('drawerCategoryList');
    drawerList.innerHTML = '';

    for (const category in quizState.categories) {
        if (quizState.categories.hasOwnProperty(category)) {
            const count = quizState.categories[category].length;
            const progress = userProgress.categoryProgress[category] || { questionsAnswered: 0, correctAnswers: 0 };
            
            const item = document.createElement('div');
            item.className = 'drawer-category-item';
            item.onclick = () => startQuizFromCategory(category);
            
            item.innerHTML = `
                <div>
                    <div class="category-name">${category}</div>
                    <div style="font-size: 0.8rem; color: #64748b; margin-top: 4px;">
                        ${progress.questionsAnswered}/${count} questions
                    </div>
                </div>
                <div class="category-count">${count}</div>
            `;
            
            drawerList.appendChild(item);
        }
    }
}

// Toggle drawer
function toggleDrawer() {
    const drawer = document.getElementById('drawer');
    const overlay = document.getElementById('drawerOverlay');
    
    drawer.classList.toggle('active');
    overlay.classList.toggle('active');
}

// Start quiz from category selection
function startQuizFromCategory(category) {
    toggleDrawer();
    startQuiz(category);
}

// Display Dashboard
function displayDashboard() {
    // Update user info
    document.getElementById('userName').textContent = userProgress.name;
    document.getElementById('userAvatar').textContent = userProgress.avatar;
    document.getElementById('welcomeName').textContent = `Welcome, ${userProgress.name}!`;
    document.getElementById('totalScoreStat').textContent = userProgress.totalCorrectAnswers;

    // Update overall stats
    const totalAnswered = userProgress.totalQuestionsAnswered;
    const totalCorrect = userProgress.totalCorrectAnswers;
    const overallPercentage = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    document.getElementById('totalQuestionsAnswered').textContent = totalAnswered;
    document.getElementById('totalCorrectAnswers').textContent = totalCorrect;
    document.getElementById('overallPercentage').textContent = `${overallPercentage}%`;

    if (totalAnswered > 0) {
        document.getElementById('progressText').textContent = `You have answered ${totalAnswered} questions with ${overallPercentage}% accuracy!`;
        document.getElementById('globalProgressFill').style.width = `${overallPercentage}%`;
    }

    if (totalAnswered > 0) {
        document.getElementById('userStats').textContent = `${totalAnswered} questions answered • ${overallPercentage}% accuracy`;
    }

    // Display category progress cards
    displayCategoryCards();
    
    switchScreen('dashboardScreen');
}

// Display category progress cards
function displayCategoryCards() {
    const grid = document.getElementById('categoriesGrid');
    grid.innerHTML = '';

    for (const category in quizState.categories) {
        if (!quizState.categories.hasOwnProperty(category)) continue;

        const totalQuestions = quizState.categories[category].length;
        const progress = userProgress.categoryProgress[category] || { questionsAnswered: 0, correctAnswers: 0 };
        const percentage = progress.questionsAnswered > 0 
            ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100) 
            : 0;

        const card = document.createElement('div');
        card.className = 'category-card';
        card.onclick = () => startQuizFromCategory(category);

        card.innerHTML = `
            <div class="category-header">
                <h4 class="category-title">${category}</h4>
                <span class="category-icon">📚</span>
            </div>
            <div class="category-stats">
                ${progress.questionsAnswered}/${totalQuestions} answered
            </div>
            <div class="category-progress-bar">
                <div class="category-progress" style="width: ${(progress.questionsAnswered / totalQuestions) * 100}%"></div>
            </div>
            <div class="category-percentage">${percentage}% accuracy</div>
        `;

        grid.appendChild(card);
    }
}

// Start Quiz
function startQuiz(category = null) {
    if (!category) {
        const selectedValue = document.getElementById('categorySelect')?.value;
        if (!selectedValue) {
            alert('Please select a category!');
            return;
        }
        category = selectedValue;
    }

    quizState.selectedCategory = category;

    // Get questions
    if (category === 'all') {
        quizState.questions = getAllQuestionsShuffled();
    } else {
        quizState.questions = [...quizState.categories[category]];
    }

    // Shuffle questions
    quizState.questions = shuffleArray(quizState.questions);

    // Shuffle options for each question
    quizState.shuffledQuestions = quizState.questions.map(question => shuffleQuestionOptions(question));

    // Reset state
    quizState.currentQuestionIndex = 0;
    quizState.userAnswers = new Array(quizState.questions.length).fill(null);
    quizState.score = 0;

    // Show quiz screen
    switchScreen('quizScreen');
    displayQuestion();
    updateNavigationButtons();
}

// Get all questions shuffled
function getAllQuestionsShuffled() {
    const allQuestions = [];
    
    for (const category in quizState.categories) {
        if (quizState.categories.hasOwnProperty(category)) {
            allQuestions.push(...quizState.categories[category]);
        }
    }

    return shuffleArray(allQuestions);
}

// Shuffle array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Shuffle question options
function shuffleQuestionOptions(question) {
    const optionsWithIndex = question.options.map((option, index) => ({
        option: option,
        originalIndex: index
    }));

    const shuffledOptions = shuffleArray(optionsWithIndex);

    const newCorrectAnswerIndex = shuffledOptions.findIndex(
        item => item.originalIndex === question.correctAnswer
    );

    return {
        ...question,
        options: shuffledOptions.map(item => item.option),
        correctAnswer: newCorrectAnswerIndex
    };
}

// Display current question
function displayQuestion() {
    const question = quizState.shuffledQuestions[quizState.currentQuestionIndex];
    const questionNumber = quizState.currentQuestionIndex + 1;
    const totalQuestions = quizState.shuffledQuestions.length;

    document.getElementById('questionNumber').textContent = `Question ${questionNumber} of ${totalQuestions}`;
    document.getElementById('scoreDisplay').textContent = `Score: ${quizState.score}`;

    const progress = (questionNumber / totalQuestions) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressPercentage').textContent = `${Math.round(progress)}%`;

    document.getElementById('categoryTag').textContent = question.category;
    document.getElementById('questionText').textContent = question.question;

    displayOptions(question);
}

// Display options
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

// Select answer
function selectAnswer(optionIndex) {
    quizState.userAnswers[quizState.currentQuestionIndex] = optionIndex;
    
    const question = quizState.shuffledQuestions[quizState.currentQuestionIndex];
    if (optionIndex === question.correctAnswer) {
        quizState.score++;
    }
    
    document.getElementById('scoreDisplay').textContent = `Score: ${quizState.score}`;
    
    displayOptions(question);
    
    const radioButtons = document.querySelectorAll('input[name="quiz-option"]');
    radioButtons.forEach(radio => radio.disabled = true);
}

// Next question
function nextQuestion() {
    const userAnswer = quizState.userAnswers[quizState.currentQuestionIndex];
    
    if (userAnswer === null) {
        alert('Please select an answer before proceeding!');
        return;
    }

    if (quizState.currentQuestionIndex < quizState.shuffledQuestions.length - 1) {
        quizState.currentQuestionIndex++;
        displayQuestion();
        updateNavigationButtons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        finishQuiz();
    }
}

// Previous question
function previousQuestion() {
    if (quizState.currentQuestionIndex > 0) {
        quizState.currentQuestionIndex--;
        displayQuestion();
        updateNavigationButtons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const isFirstQuestion = quizState.currentQuestionIndex === 0;
    const isLastQuestion = quizState.currentQuestionIndex === quizState.shuffledQuestions.length - 1;

    prevBtn.style.display = isFirstQuestion ? 'none' : 'block';
    nextBtn.textContent = isLastQuestion ? 'Finish Quiz' : 'Next →';
}

// Finish quiz
function finishQuiz() {
    // Update user progress
    const category = quizState.selectedCategory;
    if (category && category !== 'all') {
        if (!userProgress.categoryProgress[category]) {
            userProgress.categoryProgress[category] = { questionsAnswered: 0, correctAnswers: 0 };
        }
        userProgress.categoryProgress[category].questionsAnswered += quizState.questions.length;
        userProgress.categoryProgress[category].correctAnswers += quizState.score;
    } else {
        // For mixed questions, update all categories proportionally
        const categoryProgress = calculateCategoryProgression();
        for (const cat in categoryProgress) {
            if (!userProgress.categoryProgress[cat]) {
                userProgress.categoryProgress[cat] = { questionsAnswered: 0, correctAnswers: 0 };
            }
            userProgress.categoryProgress[cat].questionsAnswered += categoryProgress[cat].answered;
            userProgress.categoryProgress[cat].correctAnswers += categoryProgress[cat].correct;
        }
    }

    // Update total progress
    userProgress.totalQuestionsAnswered += quizState.questions.length;
    userProgress.totalCorrectAnswers += quizState.score;

    // Save data
    saveUserData();

    // Display results
    displayResults();
    switchScreen('resultsScreen');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Calculate category progression for mixed quizzes
function calculateCategoryProgression() {
    const progression = {};
    
    quizState.shuffledQuestions.forEach((question, index) => {
        const category = question.category;
        if (!progression[category]) {
            progression[category] = { answered: 0, correct: 0 };
        }
        progression[category].answered++;
        
        if (quizState.userAnswers[index] === question.correctAnswer) {
            progression[category].correct++;
        }
    });

    return progression;
}

// Display results
function displayResults() {
    const totalQuestions = quizState.shuffledQuestions.length;
    const percentage = Math.round((quizState.score / totalQuestions) * 100);

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

    displayResultDetails();
}

// Display result details
function displayResultDetails() {
    const resultDetails = document.getElementById('resultDetails');
    resultDetails.innerHTML = '<h3 style="text-align: left; margin-bottom: 1rem; color: var(--dark);">Review Your Answers</h3>';

    quizState.shuffledQuestions.forEach((question, index) => {
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

// Retake quiz
function retakeQuiz() {
    startQuiz(quizState.selectedCategory);
}

// Back to dashboard
function backToDashboard() {
    displayDashboard();
}

// Switch screen
function switchScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

// User Profile Functions
function showUserModal() {
    document.getElementById('userModal').classList.add('active');
    document.getElementById('userNameInput').value = userProgress.name;
    document.getElementById('userAvatarSelect').value = userProgress.avatar;
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('active');
}

function saveUserProfile() {
    userProgress.name = document.getElementById('userNameInput').value || 'Guest User';
    userProgress.avatar = document.getElementById('userAvatarSelect').value;
    
    saveUserData();
    closeUserModal();
    displayDashboard();
    populateDrawerCategories();
}

// Local storage functions
function saveUserData() {
    localStorage.setItem('quizMasterUser', JSON.stringify(userProgress));
}

function loadUserData() {
    const saved = localStorage.getItem('quizMasterUser');
    if (saved) {
        const data = JSON.parse(saved);
        userProgress.name = data.name || 'Guest User';
        userProgress.avatar = data.avatar || '👤';
        userProgress.totalQuestionsAnswered = data.totalQuestionsAnswered || 0;
        userProgress.totalCorrectAnswers = data.totalCorrectAnswers || 0;
        userProgress.categoryProgress = data.categoryProgress || {};
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeApp);
