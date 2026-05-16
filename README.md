# Student Wellness Hub — Mental Health Support Platform

A comprehensive mental health support platform designed specifically for students, featuring mood tracking, journaling, peer support forums, AI-powered chatbot, and resource management.

## 🌟 Features

### Core Functionality
- **Mood Tracker** - Track daily moods with visual charts and history
- **Journal** - Personal journaling with secure storage
- **Forum** - Peer support community for students
- **AI Chatbot** - 24/7 mental health support powered by OpenAI
- **Booking System** - Schedule appointments with counselors
- **Resource Hub** - Access mental health resources and articles
- **Admin Dashboard** - Administrative tools for counselors

### Technical Features
- **Authentication** - Secure user authentication with Firebase
- **Real-time Updates** - Live chat and forum interactions
- **Responsive Design** - Mobile-first, beautiful UI with Tailwind CSS
- **Data Visualization** - Interactive charts for mood tracking
- **Modern Stack** - React, Firebase, Node.js, and OpenAI integration

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Chart.js** - Data visualization for mood tracking
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time communication
- **OpenAI API** - AI-powered chatbot responses
- **CORS** - Cross-origin resource sharing

### Database & Authentication
- **Firebase Firestore** - NoSQL database
- **Firebase Authentication** - User management
- **Firebase Security Rules** - Data protection

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup
- OpenAI API key

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anshuman-codes05/Student-Mental-Health-Support.git
   cd dmhs-starter-react-firebase-openai
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   HUGGINGFACE_API_KEY=your_huggingface_api_key_here
   PORT=5000
   ```

4. **Firebase Configuration**
   
   Update `frontend/src/firebase.js` with your Firebase project credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: "your-api-key",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-sender-id",
     appId: "your-app-id"
   };
   ```

5. **Firebase Security Rules**
   
   Update your Firestore security rules in Firebase Console:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

## 🚀 Running the Application

### Development Mode

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Production Build

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Serve the production build**
   ```bash
   npm run preview
   ```

## 📱 Usage

### For Students
1. **Sign Up/Login** - Create an account or sign in
2. **Track Mood** - Log daily moods and view progress
3. **Journal** - Write personal thoughts and reflections
4. **Connect** - Join the forum community
5. **Get Support** - Chat with AI assistant
6. **Book Sessions** - Schedule counselor appointments
7. **Access Resources** - Browse mental health materials

### For Counselors/Admins
1. **Admin Access** - Use admin@example.com for admin features
2. **Manage Users** - View and manage student accounts
3. **Monitor Activity** - Track platform usage and engagement
4. **Resource Management** - Add and update resources

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication and Firestore Database
3. Add your web app to the project
4. Copy the configuration to `firebase.js`

### OpenAI Integration
1. Get an API key from [OpenAI](https://platform.openai.com)
2. Add the key to your backend `.env` file
3. The chatbot will use this for AI responses

## 🛡️ Security

- **Authentication Required** - All data operations require user authentication
- **Firebase Security Rules** - Database access is restricted to authenticated users
- **Input Validation** - All user inputs are validated
- **HTTPS** - Secure communication in production

## 📊 Project Structure

```
dmhs-starter-react-firebase-openai/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── firebase.js      # Firebase configuration
│   │   └── ...
│   ├── public/              # Static assets
│   └── package.json
├── backend/                 # Node.js backend server
│   ├── server.js           # Main server file
│   └── package.json
├── .gitignore              # Git ignore rules
└── README.md               # Project documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Anshuman**
- GitHub: [@Anshuman-codes05](https://github.com/Anshuman-codes05)
- Email: anshuman@example.com

## 🙏 Acknowledgments

- Firebase for backend services
- OpenAI for AI capabilities
- React team for the amazing framework
- Tailwind CSS for beautiful styling
- All contributors and users

## 📞 Support

If you have any questions or need help, please:
1. Check the [Issues](https://github.com/Anshuman-codes05/Student-Mental-Health-Support/issues) page
2. Create a new issue if your problem isn't already reported
3. Contact the maintainer directly

---

**Made with ❤️ for student mental health support**
