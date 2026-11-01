// Content for the How to Use page. Each section renders as one card with a matching TOC entry.
// Labels match the sidebar in NavBar.jsx so the guide reads the same as the app.

import {
  FaRocket,
  FaUsers,
  FaEdit,
  FaLayerGroup,
  FaPoll,
  FaHeart,
  FaCog,
  FaLifeRing,
  FaQuestionCircle,
} from 'react-icons/fa';

export const INSTRUCTION_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: FaRocket,
    intro: 'Create an account to save your quizzes, flashcards, and progress.',
    steps: [
      'Click Sign In in the sidebar and sign in with your account.',
      'After signing in you land on your Dashboard, which shows your recent activity and recommended quizzes.',
      'Use the sidebar on the left to move between quizzes, flashcards, polls, and favorites. Click the menu button to expand or collapse it.',
      'Open the profile menu in the top right to reach your Profile and Settings.',
    ],
    link: { label: 'Go to Dashboard', path: '/dashboard', requiresAuth: true },
  },
  {
    id: 'taking-quizzes',
    title: 'Taking a Quiz',
    icon: FaUsers,
    intro: 'Pick from built-in category quizzes or quizzes made by other users and teachers.',
    steps: [
      'Choose Take Quizzes in the sidebar to browse community and teacher quizzes, or start a category quiz from your Dashboard.',
      'Select a quiz to open it. If the quiz is private, enter the password the creator gave you.',
      'You can shuffle the questions before you start. Questions cannot be shuffled once the quiz begins.',
      'Answer every question, then submit the quiz. Each question is worth 1 point.',
      'When you finish, your score is shown and you can download your results as a PDF.',
    ],
    tips: ['Your scores are saved to your profile so you can track your accuracy over time.'],
    link: { label: 'Take Quizzes', path: '/allcustomquizzes', requiresAuth: true },
  },
  {
    id: 'making-quizzes',
    title: 'Making a Quiz',
    icon: FaEdit,
    intro: 'Build your own quizzes to study with or share with others.',
    steps: [
      'Choose Make Quiz in the sidebar and enter a title and details for your quiz.',
      'Add questions one at a time. Questions can be Multiple Choice, True/False, or Fill in the Blank.',
      'To add many questions at once, upload a CSV file in the upload section.',
      'Under privacy settings, choose whether the quiz requires a password to access.',
      'Teachers can mark a quiz as a Teacher Quiz. Teacher quizzes are always private and use a password you set.',
      'Save the quiz. You can edit it later from My Quizzes.',
    ],
    link: { label: 'Make a Quiz', path: '/customquiz', requiresAuth: true },
  },
  {
    id: 'flashcards',
    title: 'Flashcards & Study Mode',
    icon: FaLayerGroup,
    intro: 'Flashcard decks help you review material before a quiz.',
    steps: [
      'Choose Make Flashcards to create a deck and add cards with a term on the front and a definition on the back. You can also upload cards from a CSV file.',
      'Make a deck public to share it, or keep it private for yourself.',
      'Use Browse Flashcards to find public decks made by other users.',
      'Open a deck from My Flashcards and start Study Mode. Flip each card, then mark it as known or still learning.',
      'At the end of a session, the results screen shows how many cards you know.',
    ],
    link: { label: 'Browse Flashcards', path: '/browse-flashcards', requiresAuth: false },
  },
  {
    id: 'polls',
    title: 'Polls',
    icon: FaPoll,
    intro: 'Teachers can run live polls to get real-time feedback from a class.',
    steps: [
      'Choose Take a Poll in the sidebar.',
      'To create a poll, enter a question and answer options. You get a join code to share with your students.',
      'To join a poll, enter the join code you were given and cast your vote. You can vote once per poll, and you do not need an account.',
      'The poll creator can open or close the poll and choose whether students see live results.',
    ],
    link: { label: 'Take a Poll', path: '/poll', requiresAuth: false },
  },
  {
    id: 'favorites',
    title: 'Favorites & Progress',
    icon: FaHeart,
    intro: 'Keep the quizzes you use most close at hand.',
    steps: [
      'Mark a quiz as a favorite with the heart icon.',
      'Find all of your saved quizzes under My Favorite Quizzes in the sidebar.',
      'Open your Profile to see your quiz history and accuracy over time.',
    ],
    link: { label: 'My Favorite Quizzes', path: '/favorites', requiresAuth: true },
  },
  {
    id: 'settings',
    title: 'Profile & Settings',
    icon: FaCog,
    intro: 'Personalize your account and the way QuizMaster looks.',
    steps: [
      'Open the profile menu in the top right and choose Profile to update your details.',
      'Choose Settings to switch between light and dark mode.',
      'Other users can view your public profile page and the public content you share.',
    ],
    link: { label: 'Open Settings', path: '/settings', requiresAuth: false },
  },
  {
    id: 'support',
    title: 'Help & Support',
    icon: FaLifeRing,
    intro: 'Get help when something is not working.',
    steps: [
      'Choose Support in the footer to open a support ticket. You can message the support team from inside the ticket.',
      'Choose Contact Us in the footer to reach the QuizMaster team.',
    ],
    link: { label: 'Get Support', path: '/support', requiresAuth: true },
  },
];

export const INSTRUCTION_FAQS = [
  {
    question: 'Why do some pages send me back to the home page?',
    answer: 'Quizzes, flashcard creation, favorites, and support require an account. Sign in and try again.',
  },
  {
    question: 'How do I take a private quiz?',
    answer: 'Ask the quiz creator for the password, then enter it when you open the quiz.',
  },
  {
    question: 'Can I shuffle questions during a quiz?',
    answer: 'No. Shuffle the questions before you start; the order is locked once the quiz begins.',
  },
  {
    question: 'Do I need an account to join a poll?',
    answer: 'No. Choose Take a Poll in the sidebar and enter the join code. Each visitor can vote once per poll.',
  },
  {
    question: 'How do I change between light and dark mode?',
    answer: 'Open Settings from the profile menu and use the theme toggle.',
  },
];

export const FAQ_SECTION = { id: 'faq', title: 'FAQ', icon: FaQuestionCircle };
