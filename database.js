/* ============================================
   QUIZ DATABASE - ORGANIZE QUESTIONS BY CATEGORY
   ============================================ */

/* 
   HOW TO ADD NEW CATEGORIES:
   1. Add a new category with questions array following the format below
   2. Each question object should have:
      - category: The category name
      - question: The question text
      - options: Array of 4 answer options
      - correctAnswer: Index of the correct answer (0-3)
   3. The dropdown will automatically populate with new categories
   
   EXAMPLE:
   "Your Category Name": [
       {
           category: "Your Category Name",
           question: "Your question here?",
           options: ["Option 1", "Option 2", "Option 3", "Option 4"],
           correctAnswer: 0
       }
   ]
*/

const quizDatabase = {
    "General Knowledge": [
        {
            category: "General Knowledge",
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correctAnswer: 2
        },
        {
            category: "General Knowledge",
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Saturn"],
            correctAnswer: 1
        },
        {
            category: "General Knowledge",
            question: "What is the largest ocean on Earth?",
            options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
            correctAnswer: 3
        },
        {
            category: "General Knowledge",
            question: "Who wrote 'Romeo and Juliet'?",
            options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
            correctAnswer: 1
        },
        {
            category: "General Knowledge",
            question: "What is the smallest country in the world?",
            options: ["Monaco", "San Marino", "Vatican City", "Liechtenstein"],
            correctAnswer: 2
        }
    ],

    "Science": [
        {
            category: "Science",
            question: "What is the chemical symbol for Gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            correctAnswer: 2
        },
        {
            category: "Science",
            question: "How many bones are in the human body?",
            options: ["186", "206", "226", "246"],
            correctAnswer: 1
        },
        {
            category: "Science",
            question: "What is the speed of light?",
            options: ["300,000 km/s", "150,000 km/s", "450,000 km/s", "600,000 km/s"],
            correctAnswer: 0
        },
        {
            category: "Science",
            question: "Which gas do plants absorb from the atmosphere?",
            options: ["Oxygen", "Hydrogen", "Carbon Dioxide", "Nitrogen"],
            correctAnswer: 2
        },
        {
            category: "Science",
            question: "What is the process by which plants make their own food?",
            options: ["Respiration", "Photosynthesis", "Fermentation", "Transpiration"],
            correctAnswer: 1
        }
    ],

    "History": [
        {
            category: "History",
            question: "In which year did World War II end?",
            options: ["1943", "1944", "1945", "1946"],
            correctAnswer: 2
        },
        {
            category: "History",
            question: "Who was the first President of the United States?",
            options: ["Thomas Jefferson", "George Washington", "Benjamin Franklin", "John Adams"],
            correctAnswer: 1
        },
        {
            category: "History",
            question: "In which year did the Titanic sink?",
            options: ["1910", "1911", "1912", "1913"],
            correctAnswer: 2
        },
        {
            category: "History",
            question: "Which ancient wonder of the world still stands today?",
            options: ["Hanging Gardens", "Colossus of Rhodes", "Great Pyramid of Giza", "Lighthouse of Alexandria"],
            correctAnswer: 2
        },
        {
            category: "History",
            question: "In which decade did the internet become publicly available?",
            options: ["1970s", "1980s", "1990s", "2000s"],
            correctAnswer: 2
        }
    ],

    "Technology": [
        {
            category: "Technology",
            question: "Which company developed the Java programming language?",
            options: ["Microsoft", "Apple", "Sun Microsystems", "IBM"],
            correctAnswer: 2
        },
        {
            category: "Technology",
            question: "What does 'HTTP' stand for?",
            options: ["High Transfer Text Protocol", "HyperText Transfer Protocol", "Home Text Transfer Protocol", "High Tech Transfer Protocol"],
            correctAnswer: 1
        },
        {
            category: "Technology",
            question: "Which company is known for the Android operating system?",
            options: ["Apple", "Microsoft", "Google", "Samsung"],
            correctAnswer: 2
        },
        {
            category: "Technology",
            question: "What does 'RAM' stand for?",
            options: ["Read Access Memory", "Random Access Memory", "Run-time Access Memory", "Rapid Access Memory"],
            correctAnswer: 1
        },
        {
            category: "Technology",
            question: "Who is considered the father of modern computers?",
            options: ["Bill Gates", "Steve Jobs", "Alan Turing", "Charles Babbage"],
            correctAnswer: 3
        }
    ],

    "Sports": [
        {
            category: "Sports",
            question: "How many players are on a basketball team on the court?",
            options: ["4", "5", "6", "7"],
            correctAnswer: 1
        },
        {
            category: "Sports",
            question: "In which sport is the Stanley Cup awarded?",
            options: ["American Football", "Basketball", "Ice Hockey", "Baseball"],
            correctAnswer: 2
        },
        {
            category: "Sports",
            question: "How many sets are typically played in a tennis match?",
            options: ["2", "3", "4", "5"],
            correctAnswer: 1
        },
        {
            category: "Sports",
            question: "What is the maximum number of points in a volleyball game?",
            options: ["21", "25", "30", "35"],
            correctAnswer: 1
        },
        {
            category: "Sports",
            question: "In which year was the first modern Olympic Games held?",
            options: ["1894", "1896", "1900", "1912"],
            correctAnswer: 1
        }
    ],

    "Literature": [
        {
            category: "Literature",
            question: "Who wrote 'Pride and Prejudice'?",
            options: ["Emily Brontë", "Jane Austen", "Charlotte Brontë", "George Eliot"],
            correctAnswer: 1
        },
        {
            category: "Literature",
            question: "What is the main theme of 'Animal Farm'?",
            options: ["Rural life", "Political allegory", "Adventure", "Romance"],
            correctAnswer: 1
        },
        {
            category: "Literature",
            question: "Who wrote 'The Great Gatsby'?",
            options: ["Ernest Hemingway", "F. Scott Fitzgerald", "William Faulkner", "Sinclair Lewis"],
            correctAnswer: 1
        },
        {
            category: "Literature",
            question: "In '1984', what is the name of the totalitarian state?",
            options: ["Eurasia", "Oceania", "Big Brother Land", "New Order"],
            correctAnswer: 1
        },
        {
            category: "Literature",
            question: "How many books are in the Harry Potter series?",
            options: ["5", "6", "7", "8"],
            correctAnswer: 2
        }
    ]
};

/* 
   TO ADD A NEW CATEGORY:
   1. Copy the template below
   2. Replace "New Category" with your category name
   3. Add your questions following the format
   4. Ensure correctAnswer is 0, 1, 2, or 3 (index of correct option)
   5. Save the file and refresh the page
   
   TEMPLATE:
   "New Category": [
       {
           category: "New Category",
           question: "Question 1?",
           options: ["A", "B", "C", "D"],
           correctAnswer: 0
       },
       {
           category: "New Category",
           question: "Question 2?",
           options: ["A", "B", "C", "D"],
           correctAnswer: 1
       }
   ]
*/
