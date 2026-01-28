# QuizMaster - Interactive Quiz Application

A modern, mobile-friendly quiz application built with vanilla HTML, CSS, and JavaScript. Perfect for learning and knowledge assessment!

## 🎯 Features

- **Category Selection**: Choose from multiple quiz categories or mix questions from all categories
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Progress Tracking**: Visual progress bar and real-time score display
- **Detailed Results**: Complete review of answers with correct solutions
- **Beautiful UI**: Modern gradient design with smooth animations
- **Easy Database Management**: Simple JavaScript-based database that auto-updates dropdown
- **Quiz Navigation**: Navigate between questions or complete the quiz at once

## 📁 File Structure

```
quiz-app/
├── index.html       # Main HTML structure
├── styles.css       # Complete styling and animations
├── script.js        # Quiz functionality and state management
├── database.js      # Quiz questions database
└── README.md        # This file
```

## 🚀 Getting Started

1. **Download all files** to the same folder
2. **Open `index.html`** in your web browser
3. **Select a category** or choose "Mix All Categories"
4. **Start answering questions** and track your progress!

## 📊 File Details

### index.html
- Semantic HTML5 structure
- Organized into three main screens: Welcome, Quiz, Results
- Responsive meta viewport for mobile optimization
- Loads external CSS and JavaScript files

### styles.css
- CSS variables for easy theme customization
- Mobile-first responsive design
- Gradient backgrounds and smooth animations
- Accessibility-focused color contrast
- Custom scrollbar styling

### script.js
- Complete quiz logic and state management
- Category dropdown population from database
- Question shuffling and randomization
- Score calculation and results generation
- Screen navigation system
- No external dependencies required

### database.js
- Question database organized by category
- 6 pre-loaded categories with 5 questions each:
  - General Knowledge
  - Science
  - History
  - Technology
  - Sports
  - Literature

## 📝 How to Add New Categories

### Method 1: Add to Existing File

Edit `database.js` and add a new category object:

```javascript
"Your Category Name": [
    {
        category: "Your Category Name",
        question: "Your question here?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: 0  // Index of correct answer (0-3)
    },
    {
        category: "Your Category Name",
        question: "Another question?",
        options: ["A", "B", "C", "D"],
        correctAnswer: 2
    }
]
```

### Quick Template

Copy and paste this template:

```javascript
"New Category Name": [
    {
        category: "New Category Name",
        question: "Q1?",
        options: ["A", "B", "C", "D"],
        correctAnswer: 0
    },
    {
        category: "New Category Name",
        question: "Q2?",
        options: ["Option 1", "Option 2", "Option 3", "Option 4"],
        correctAnswer: 1
    }
]
```

### Important Rules:
- ✅ `correctAnswer` must be 0, 1, 2, or 3 (array index)
- ✅ Each question must have exactly 4 options
- ✅ `category` field should match the category name
- ✅ Save `database.js` and refresh the page
- ✅ Your new category will automatically appear in the dropdown!

## 🎨 Customization

### Change Colors

Edit CSS variables in `styles.css`:

```css
:root {
    --primary: #6366f1;           /* Main brand color */
    --secondary: #ec4899;          /* Accent color */
    --success: #10b981;            /* Success green */
    --danger: #ef4444;             /* Error red */
    --dark: #1f2937;               /* Dark text */
    --light: #f9fafb;              /* Light background */
}
```

### Change Fonts

In `styles.css`, modify the body font-family:

```css
body {
    font-family: 'Your Font Name', sans-serif;
}
```

### Adjust Question Count

The app automatically uses all questions in a category. To limit:

Edit `script.js` in the `startQuiz()` function and add a slice:

```javascript
quizState.questions = [...quizState.categories[selectedValue]].slice(0, 10);
```

## 🎮 How It Works

1. **Welcome Screen**: User selects a category
2. **Quiz Screen**: Questions displayed one at a time
3. **Score Tracking**: Real-time score updates
4. **Navigation**: Users can go back/forward between questions
5. **Results Screen**: Detailed breakdown with all answers reviewed
6. **Retry**: Option to take the quiz again or return home

## 📱 Mobile Optimization

- Fully responsive layout adapts to all screen sizes
- Touch-friendly button sizes (44-48px minimum)
- Optimized spacing and typography for mobile
- Smooth scrolling and transitions
- No horizontal scrolling required

## 🔧 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📊 Quiz Statistics

- **Default Categories**: 6
- **Questions per Category**: 5 (expandable)
- **Options per Question**: 4
- **Total Questions Available**: 30+

## 🎯 Example Database Structure

```javascript
const quizDatabase = {
    "Category Name": [
        {
            category: "Category Name",
            question: "What is...?",
            options: ["Option A", "Option B", "Option C", "Option D"],
            correctAnswer: 0
        }
    ]
};
```

## ✨ Features Explained

### Mix All Categories
- Combines questions from every category
- Randomizes question order
- Great for comprehensive practice

### Progress Bar
- Visual indicator of quiz completion
- Updates in real-time as you progress

### Score Display
- Shows current score while taking quiz
- Detailed breakdown on results screen
- Percentage calculation

### Answer Review
- See your answer vs correct answer
- Green checkmark for correct answers
- Red X for incorrect answers

## 🐛 Troubleshooting

**Categories not appearing?**
- Ensure `database.js` is loaded before `script.js`
- Check for syntax errors in database.js
- Refresh the page after editing

**Quiz not starting?**
- Select a category from the dropdown
- Ensure database has questions
- Check browser console for errors

**Styling looks off?**
- Clear browser cache (Ctrl+Shift+Delete)
- Ensure styles.css is in the same folder
- Check that file paths are correct

## 📄 License

Free to use and modify for personal and educational purposes.

## 🚀 Future Enhancements

Consider adding:
- Timer functionality
- Difficulty levels
- Question explanations
- User statistics tracking
- Dark mode toggle
- Multiple correct answers support
- Image support in questions

## 💡 Tips for Best Results

1. **Add variety**: Mix easy, medium, and hard questions
2. **Keep it organized**: Use clear category names
3. **Proofread**: Double-check question text and answers
4. **Test thoroughly**: Try the quiz before sharing
5. **Regular updates**: Keep adding new questions to keep it fresh

---

**Enjoy QuizMaster! Happy Learning! 📚**
