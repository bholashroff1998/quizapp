/* ============================================
   QUIZMASTER - PROFESSIONAL SCRIPT
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
    avatar: 'fa-user',
    totalQuestionsAnswered: 0,
    totalCorrectAnswers: 0,
    categoryProgress: {},
    quizzesTaken: []
};

// Initialize App
function initializeApp() {
    loadUserData();
    loadCategoriesFromDatabase();
    populateDrawerCategories();
    updateAllUserDisplays();
    showHomeScreen(); // Show home screen by default
    updateActiveNavButton('home');
    setupAvatarPreview(); // Setup avatar preview listener
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
                    correctAnswers: 0,
                    quizzesCompleted: 0,
                    lastAttemptDate: null
                };
            }
        }
    }
}

// Update all user displays
function updateAllUserDisplays() {
    updateDrawerUserInfo();
    updateHeaderStats();
}

// Update drawer user information
function updateDrawerUserInfo() {
    const avatarElement = document.getElementById('drawerUserAvatar');
    avatarElement.innerHTML = `<i class="fas ${userProgress.avatar}"></i>`;
    
    document.getElementById('drawerUserName').textContent = userProgress.name;
    
    const totalAnswered = userProgress.totalQuestionsAnswered;
    const overallPercentage = totalAnswered > 0 
        ? Math.round((userProgress.totalCorrectAnswers / totalAnswered) * 100) 
        : 0;
    
    if (totalAnswered > 0) {
        document.getElementById('drawerUserStats').textContent = `${overallPercentage}% accuracy • ${totalAnswered} questions`;
    } else {
        document.getElementById('drawerUserStats').textContent = 'No quizzes yet';
    }
    
    // Update quick stats in drawer
    document.getElementById('drawerTotalScore').textContent = userProgress.totalCorrectAnswers;
    document.getElementById('drawerAccuracy').textContent = `${overallPercentage}%`;
}

// Update header stats
function updateHeaderStats() {
    const totalAnswered = userProgress.totalQuestionsAnswered;
    const overallPercentage = totalAnswered > 0 
        ? Math.round((userProgress.totalCorrectAnswers / totalAnswered) * 100) 
        : 0;
    
    document.getElementById('totalScoreStat').textContent = userProgress.totalCorrectAnswers;
    document.getElementById('accuracyStat').textContent = `${overallPercentage}%`;
}

// Navigate to home
function navigateToHome() {
    toggleDrawer();
    showHomeScreen();
}

// Navigate to dashboard
function navigateToDashboard() {
    toggleDrawer();
    displayDashboard();
}

// Show home screen (categories only)
function showHomeScreen() {
    // Update welcome message
    const totalQuizzes = userProgress.quizzesTaken.length;
    const welcomeMsg = totalQuizzes > 0 
        ? `Welcome back, ${userProgress.name}! Ready for another quiz?`
        : `Welcome, ${userProgress.name}! Select a category to begin`;
    
    document.getElementById('welcomeMessage').textContent = welcomeMsg;
    
    // Display category cards on home screen
    displayCategoryCards('categoriesGrid', false); // false = simple view
    
    switchScreen('homeScreen');
    updateActiveNavButton('home');
}

// Show all categories (can be extended)
function showAllCategories() {
    toggleDrawer();
    showHomeScreen();
}

// Show quiz history (placeholder for future feature)
function showQuizHistory() {
    toggleDrawer();
    // This can be implemented to show a history of all quiz attempts
    alert('Quiz history feature coming soon!');
}

// Update active navigation button
function updateActiveNavButton(screen) {
    // Remove active class from all nav buttons
    document.querySelectorAll('.drawer-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Add active class to current screen button
    if (screen === 'home') {
        document.getElementById('homeNavBtn')?.classList.add('active');
    } else if (screen === 'dashboard') {
        document.getElementById('dashboardNavBtn')?.classList.add('active');
    }
}

// Populate drawer with categories
function populateDrawerCategories() {
    const drawerList = document.getElementById('drawerCategoryList');
    drawerList.innerHTML = '';

    for (const category in quizState.categories) {
        if (quizState.categories.hasOwnProperty(category)) {
            const count = quizState.categories[category].length;
            const progress = userProgress.categoryProgress[category] || { 
                questionsAnswered: 0, 
                correctAnswers: 0,
                quizzesCompleted: 0
            };
            
            const accuracy = progress.questionsAnswered > 0 
                ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100) 
                : 0;
            
            const item = document.createElement('div');
            item.className = 'drawer-category-item';
            item.onclick = () => startQuizFromCategory(category);
            
            item.innerHTML = `
                <div class="drawer-category-content">
                    <div class="category-name">${category}</div>
                    <div class="drawer-category-meta">
                        ${progress.quizzesCompleted > 0 ? `${accuracy}% accuracy` : `${count} questions`}
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

// Display Dashboard (Progress Overview)
function displayDashboard() {
    // Update overall stats
    const totalAnswered = userProgress.totalQuestionsAnswered;
    const totalCorrect = userProgress.totalCorrectAnswers;
    const overallPercentage = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    const totalQuizzes = userProgress.quizzesTaken.length;

    document.getElementById('totalQuestionsAnswered').textContent = totalAnswered;
    document.getElementById('totalCorrectAnswers').textContent = totalCorrect;
    document.getElementById('overallPercentage').textContent = `${overallPercentage}%`;
    document.getElementById('totalQuizzesTaken').textContent = totalQuizzes;
    
    // Update dashboard message
    document.getElementById('dashboardMessage').textContent = 
        totalQuizzes > 0 
            ? `Great work, ${userProgress.name}! You've completed ${totalQuizzes} quiz${totalQuizzes > 1 ? 'zes' : ''}.`
            : `Start taking quizzes to track your progress here, ${userProgress.name}!`;

    // Update progress bar
    document.getElementById('progressPercentageLabel').textContent = `${overallPercentage}%`;
    document.getElementById('globalProgressFill').style.width = `${overallPercentage}%`;

    // Display category progress cards on dashboard
    displayCategoryCards('dashboardCategoriesGrid', true); // true = detailed view
    
    // Update all user displays
    updateAllUserDisplays();
    
    switchScreen('dashboardScreen');
    updateActiveNavButton('dashboard');
}

// Display category progress cards
function displayCategoryCards(gridId = 'categoriesGrid', detailedView = false) {
    const grid = document.getElementById(gridId);
    if (!grid) return;
    
    grid.innerHTML = '';

    // Get category icons mapping
    const categoryIcons = {
        'Science': 'fa-flask',
        'History': 'fa-landmark',
        'Geography': 'fa-globe',
        'Mathematics': 'fa-calculator',
        'Literature': 'fa-book',
        'Technology': 'fa-laptop-code',
        'Sports': 'fa-football-ball',
        'Music': 'fa-music',
        'Art': 'fa-palette',
        'General Knowledge': 'fa-brain'
    };

    for (const category in quizState.categories) {
        if (!quizState.categories.hasOwnProperty(category)) continue;

        const totalQuestions = quizState.categories[category].length;
        const progress = userProgress.categoryProgress[category] || { 
            questionsAnswered: 0, 
            correctAnswers: 0,
            quizzesCompleted: 0
        };
        
        const percentage = progress.questionsAnswered > 0 
            ? Math.round((progress.correctAnswers / progress.questionsAnswered) * 100) 
            : 0;
        
        const progressBarWidth = progress.quizzesCompleted > 0 
            ? Math.min(100, (progress.quizzesCompleted / 5) * 100)
            : 0;

        const icon = categoryIcons[category] || 'fa-folder';

        const card = document.createElement('div');
        card.className = 'category-card';
        card.onclick = () => startQuizFromCategory(category);

        if (detailedView) {
            // Detailed view for dashboard
            card.innerHTML = `
                <div class="category-header">
                    <h4 class="category-title">${category}</h4>
                    <i class="fas ${icon} category-icon"></i>
                </div>
                <div class="category-stats">
                    ${progress.quizzesCompleted > 0 
                        ? `${progress.quizzesCompleted} quiz${progress.quizzesCompleted > 1 ? 'zes' : ''} completed • ${progress.questionsAnswered} questions answered` 
                        : `${totalQuestions} questions available • Not started`}
                </div>
                <div class="category-progress-bar">
                    <div class="category-progress" style="width: ${progressBarWidth}%"></div>
                </div>
                <div class="category-percentage">${percentage > 0 ? `${percentage}% accuracy` : 'No data yet'}</div>
            `;
        } else {
            // Simple view for home screen
            card.innerHTML = `
                <div class="category-header">
                    <h4 class="category-title">${category}</h4>
                    <i class="fas ${icon} category-icon"></i>
                </div>
                <div class="category-stats">
                    ${totalQuestions} questions available
                </div>
                <div class="category-progress-bar">
                    <div class="category-progress" style="width: ${progressBarWidth}%"></div>
                </div>
                <div class="category-percentage">${progress.quizzesCompleted > 0 ? `${progress.quizzesCompleted} completed` : 'Start quiz'}</div>
            `;
        }

        grid.appendChild(card);
    }
}

// Start Quiz
function startQuiz(category = null) {
    if (!category) {
        return;
    }

    quizState.selectedCategory = category;
    quizState.currentQuestionIndex = 0;
    quizState.userAnswers = [];
    quizState.score = 0;

    // Get questions for selected category
    if (category === 'all') {
        quizState.questions = [];
        for (const cat in quizState.categories) {
            quizState.questions = quizState.questions.concat(quizState.categories[cat]);
        }
    } else {
        quizState.questions = [...quizState.categories[category]];
    }

    // Shuffle questions
    quizState.shuffledQuestions = shuffleArray([...quizState.questions]);
    
    // Initialize answers array
    quizState.userAnswers = new Array(quizState.shuffledQuestions.length).fill(null);

    displayQuestion();
    switchScreen('quizScreen');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

// Display current question
function displayQuestion() {
    const question = quizState.shuffledQuestions[quizState.currentQuestionIndex];
    const totalQuestions = quizState.shuffledQuestions.length;
    const currentProgress = Math.round(((quizState.currentQuestionIndex + 1) / totalQuestions) * 100);

    // Update category badge
    document.getElementById('categoryName').textContent = quizState.selectedCategory;
    document.getElementById('questionNumber').textContent = 
        `Question ${quizState.currentQuestionIndex + 1} of ${totalQuestions}`;
    document.getElementById('progressPercentage').textContent = `${currentProgress}%`;
    document.getElementById('scoreDisplay').textContent = quizState.score;
    
    // Update progress bar
    document.getElementById('progressFill').style.width = `${currentProgress}%`;

    // Display question
    document.getElementById('questionText').textContent = question.question;

    // Display options
    const optionsContainer = document.getElementById('optionsContainer');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn';
        
        if (quizState.userAnswers[quizState.currentQuestionIndex] === index) {
            optionBtn.classList.add('selected');
        }

        const optionLabel = String.fromCharCode(65 + index); // A, B, C, D

        optionBtn.innerHTML = `
            <span class="option-label">${optionLabel}</span>
            <span class="option-text">${option}</span>
        `;

        optionBtn.onclick = () => selectOption(index);
        optionsContainer.appendChild(optionBtn);
    });

    updateNavigationButtons();
}

// Select option
function selectOption(optionIndex) {
    const currentQuestion = quizState.shuffledQuestions[quizState.currentQuestionIndex];
    const previousAnswer = quizState.userAnswers[quizState.currentQuestionIndex];
    
    // Update score
    if (previousAnswer !== null && previousAnswer === currentQuestion.correctAnswer) {
        quizState.score--;
    }
    
    quizState.userAnswers[quizState.currentQuestionIndex] = optionIndex;
    
    if (optionIndex === currentQuestion.correctAnswer) {
        quizState.score++;
    }

    // Update UI
    document.getElementById('scoreDisplay').textContent = quizState.score;
    displayQuestion();
}

// Next question
function nextQuestion() {
    const isLastQuestion = quizState.currentQuestionIndex === quizState.shuffledQuestions.length - 1;

    if (isLastQuestion) {
        finishQuiz();
    } else {
        quizState.currentQuestionIndex++;
        displayQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Previous question
function previousQuestion() {
    if (quizState.currentQuestionIndex > 0) {
        quizState.currentQuestionIndex--;
        displayQuestion();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Update navigation buttons
function updateNavigationButtons() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const isFirstQuestion = quizState.currentQuestionIndex === 0;
    const isLastQuestion = quizState.currentQuestionIndex === quizState.shuffledQuestions.length - 1;

    prevBtn.style.display = isFirstQuestion ? 'none' : 'flex';
    
    if (isLastQuestion) {
        nextBtn.innerHTML = 'Finish Quiz <i class="fas fa-check"></i>';
    } else {
        nextBtn.innerHTML = 'Next <i class="fas fa-chevron-right"></i>';
    }
}

// Finish quiz
function finishQuiz() {
    const category = quizState.selectedCategory;
    const totalQuestions = quizState.questions.length;
    const score = quizState.score;
    
    // Update category-specific progress
    if (category && category !== 'all') {
        if (!userProgress.categoryProgress[category]) {
            userProgress.categoryProgress[category] = { 
                questionsAnswered: 0, 
                correctAnswers: 0,
                quizzesCompleted: 0,
                lastAttemptDate: null
            };
        }
        userProgress.categoryProgress[category].questionsAnswered += totalQuestions;
        userProgress.categoryProgress[category].correctAnswers += score;
        userProgress.categoryProgress[category].quizzesCompleted += 1;
        userProgress.categoryProgress[category].lastAttemptDate = new Date().toISOString();
    }

    // Update total progress
    userProgress.totalQuestionsAnswered += totalQuestions;
    userProgress.totalCorrectAnswers += score;
    
    // Record this quiz attempt
    userProgress.quizzesTaken.push({
        category: category,
        score: score,
        total: totalQuestions,
        percentage: Math.round((score / totalQuestions) * 100),
        date: new Date().toISOString()
    });

    // Save data
    saveUserData();

    // Display results
    displayResults();
    switchScreen('resultsScreen');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Display results
function displayResults() {
    const totalQuestions = quizState.shuffledQuestions.length;
    const percentage = Math.round((quizState.score / totalQuestions) * 100);
    const incorrect = totalQuestions - quizState.score;

    let resultTitle, resultMessage, iconClass;
    
    if (percentage === 100) {
        resultTitle = 'Perfect Score!';
        resultMessage = 'Outstanding! You got every question right!';
        iconClass = 'fa-trophy';
    } else if (percentage >= 80) {
        resultTitle = 'Excellent Work!';
        resultMessage = 'Great job! You really know your stuff!';
        iconClass = 'fa-medal';
    } else if (percentage >= 60) {
        resultTitle = 'Good Job!';
        resultMessage = 'Well done! Keep practicing to improve further.';
        iconClass = 'fa-thumbs-up';
    } else if (percentage >= 40) {
        resultTitle = 'Keep Practicing!';
        resultMessage = 'You\'re making progress. Review and try again!';
        iconClass = 'fa-book-open';
    } else {
        resultTitle = 'Don\'t Give Up!';
        resultMessage = 'Learning takes time. Keep studying and you\'ll improve!';
        iconClass = 'fa-dumbbell';
    }

    document.getElementById('resultIcon').innerHTML = `<i class="fas ${iconClass}"></i>`;
    document.getElementById('resultTitle').textContent = resultTitle;
    document.getElementById('resultMessage').textContent = resultMessage;
    document.getElementById('finalScore').textContent = `${quizState.score}/${totalQuestions}`;
    document.getElementById('finalPercentage').textContent = `${percentage}%`;
    document.getElementById('correctCount').textContent = quizState.score;
    document.getElementById('incorrectCount').textContent = incorrect;

    displayResultDetails();
}

// Display result details
function displayResultDetails() {
    const resultDetails = document.getElementById('resultDetails');
    resultDetails.innerHTML = '<h3>Review Your Answers</h3>';

    quizState.shuffledQuestions.forEach((question, index) => {
        const userAnswerIndex = quizState.userAnswers[index];
        const isCorrect = userAnswerIndex === question.correctAnswer;

        const resultQuestion = document.createElement('div');
        resultQuestion.className = `result-question ${isCorrect ? 'correct' : 'incorrect'}`;

        const correctAnswerText = question.options[question.correctAnswer];
        const userAnswerText = userAnswerIndex !== null ? question.options[userAnswerIndex] : 'Not answered';
        
        const optionLabel = userAnswerIndex !== null ? String.fromCharCode(65 + userAnswerIndex) : '-';
        const correctLabel = String.fromCharCode(65 + question.correctAnswer);

        resultQuestion.innerHTML = `
            <div class="result-question-text">Q${index + 1}: ${question.question}</div>
            <div class="result-answer ${isCorrect ? 'correct' : 'incorrect'}">
                <i class="fas ${isCorrect ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                Your answer: (${optionLabel}) ${userAnswerText}
            </div>
            ${!isCorrect ? `<div class="result-answer correct">
                <i class="fas fa-check-circle"></i>
                Correct answer: (${correctLabel}) ${correctAnswerText}
            </div>` : ''}
        `;

        resultDetails.appendChild(resultQuestion);
    });
}

// Retake quiz
function retakeQuiz() {
    startQuiz(quizState.selectedCategory);
}

// Back to home
function backToHome() {
    showHomeScreen();
}

// Back to dashboard (kept for compatibility)
function backToDashboard() {
    showHomeScreen();
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
    updateAvatarPreview();
}

function closeUserModal() {
    document.getElementById('userModal').classList.remove('active');
}

function setupAvatarPreview() {
    const avatarSelect = document.getElementById('userAvatarSelect');
    if (avatarSelect) {
        avatarSelect.addEventListener('change', updateAvatarPreview);
    }
}

function updateAvatarPreview() {
    const selectedAvatar = document.getElementById('userAvatarSelect').value;
    const previewElement = document.getElementById('avatarPreview');
    if (previewElement) {
        previewElement.innerHTML = `<i class="fas ${selectedAvatar}"></i>`;
    }
}

function saveUserProfile() {
    const newName = document.getElementById('userNameInput').value.trim();
    userProgress.name = newName || 'Guest User';
    userProgress.avatar = document.getElementById('userAvatarSelect').value;
    
    saveUserData();
    closeUserModal();
    
    // Refresh current screen
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen && activeScreen.id === 'dashboardScreen') {
        displayDashboard();
    } else {
        showHomeScreen();
    }
    
    populateDrawerCategories();
}

// Local storage functions
function saveUserData() {
    localStorage.setItem('quizMasterUser', JSON.stringify(userProgress));
}

function loadUserData() {
    const saved = localStorage.getItem('quizMasterUser');
    if (saved) {
        try {
            const data = JSON.parse(saved);
            userProgress.name = data.name || 'Guest User';
            userProgress.avatar = data.avatar || 'fa-user';
            userProgress.totalQuestionsAnswered = data.totalQuestionsAnswered || 0;
            userProgress.totalCorrectAnswers = data.totalCorrectAnswers || 0;
            userProgress.categoryProgress = data.categoryProgress || {};
            userProgress.quizzesTaken = data.quizzesTaken || [];
        } catch (e) {
            console.error('Error loading user data:', e);
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initializeApp);
