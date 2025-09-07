# QuizWiz AI Features Frontend

This document describes the AI-powered features integrated into the QuizWiz frontend application, designed to work with the Spring Boot backend AI API integration.

## 🚀 Overview

The QuizWiz frontend now includes comprehensive AI-powered features that enhance the learning experience through intelligent quiz generation, personalized analytics, adaptive practice questions, and real-time AI tutoring.

## 🧠 AI Features

### 1. AI Quiz Generator (Admin Only)

**Location**: Admin Panel → AI Generator Tab
**Component**: `src/features/ai/AIQuizGenerator.jsx`

**Features**:

- Generate quizzes using AI based on topic, difficulty, and number of questions
- Real-time preview of generated questions with correct answers highlighted
- Regenerate questions with different parameters
- Save AI-generated quizzes to the database
- Support for multiple difficulty levels (Easy, Medium, Hard)

**API Endpoints Used**:

- `POST /api/ai/generate-quiz` - Generate quiz questions
- `POST /api/admin/quizzes` - Save generated quiz

### 2. AI Analytics Dashboard

**Location**: Quiz List → AI Analytics Button
**Component**: `src/features/ai/AIAnalytics.jsx`

**Features**:

- **Overview Tab**: Key performance metrics and statistics
- **Performance Trends**: Line charts showing score progression over time
- **AI Recommendations**: Personalized study suggestions based on performance
- **Weak Areas Analysis**: Bar charts and detailed breakdown of problematic topics
- Real-time data visualization with interactive charts

**API Endpoints Used**:

- `GET /api/ai/performance-trends/{userId}` - Get performance trends
- `GET /api/ai/study-recommendations/{userId}` - Get personalized recommendations

### 3. AI Practice Questions

**Location**: Quiz List → AI Practice Button
**Component**: `src/features/ai/AIPracticeQuestions.jsx`

**Features**:

- Generate personalized practice questions based on weak areas
- Adaptive difficulty based on user performance
- Progress tracking with visual indicators
- Detailed results with score analysis
- Regenerate new question sets

**API Endpoints Used**:

- `GET /api/ai/study-recommendations/{userId}` - Get weak areas
- `POST /api/ai/practice-questions` - Generate practice questions

### 4. AI Tutor (Real-time Chat)

**Location**: Floating chat widget (bottom-right corner)
**Component**: `src/features/ai/AITutor.jsx`

**Features**:

- Real-time AI chat interface
- Quick question suggestions
- Minimizable chat window
- Context-aware responses
- Support for various topics and concepts

**API Endpoints Used**:

- `POST /api/ai/tutor-help` - Get AI tutor assistance

## 🔧 Technical Implementation

### AI Service Layer

**File**: `src/services/aiService.js`

Centralized service for all AI-related API calls with proper error handling and fallback mechanisms.

```javascript
// Example usage
import aiService from "../services/aiService";

// Generate quiz questions
const quiz = await aiService.generateQuizQuestions("JavaScript", "medium", 10);

// Get study recommendations
const recommendations = await aiService.getStudyRecommendations(userId);

// Get AI tutor help
const response = await aiService.getAITutorHelp(userId, question);
```

### Integration Points

#### Admin Panel Integration

- Added AI Generator tab to the admin panel
- Integrated with existing quiz management system
- Seamless workflow from AI generation to quiz deployment

#### Quiz List Integration

- Added AI Analytics and AI Practice navigation buttons
- Mobile-responsive design with bottom navigation
- Consistent UI/UX with existing components

#### Routing Integration

- Protected routes for AI features requiring authentication
- Global AI Tutor component available on all authenticated pages
- Proper navigation and state management

## 🎨 UI/UX Features

### Design System

- **Color Scheme**: Purple and blue gradients for AI features
- **Icons**: Lucide React icons for consistency
- **Animations**: Smooth transitions and loading states
- **Responsive Design**: Mobile-first approach with adaptive layouts

### Interactive Elements

- **Loading States**: Spinner animations during AI processing
- **Progress Indicators**: Visual feedback for multi-step processes
- **Toast Notifications**: Success/error feedback using react-toastify
- **Hover Effects**: Enhanced user interaction feedback

### Accessibility

- **Keyboard Navigation**: Full keyboard support for all AI features
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG compliant color combinations
- **Focus Management**: Proper focus handling for modal dialogs

## 📱 Mobile Responsiveness

All AI features are fully responsive and optimized for mobile devices:

- **Touch-friendly interfaces** with appropriate button sizes
- **Swipe gestures** for navigation where applicable
- **Adaptive layouts** that work on all screen sizes
- **Mobile-specific navigation** with bottom tab bar

## 🔒 Security & Performance

### Security

- **Authentication Required**: All AI features require user authentication
- **Input Validation**: Client-side validation for all user inputs
- **Error Handling**: Graceful error handling with user-friendly messages
- **API Security**: Proper CORS and credential handling

### Performance

- **Lazy Loading**: Components loaded only when needed
- **Caching**: Intelligent caching of AI responses
- **Optimized Bundles**: Tree-shaking and code splitting
- **Fallback Mechanisms**: Graceful degradation when AI services are unavailable

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- React 19+
- Spring Boot backend with AI API endpoints

### Installation

```bash
cd quizwiz
npm install
```

### Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

## 🔗 API Integration

The frontend expects the following Spring Boot backend endpoints:

### Quiz Generation

```
POST /api/ai/generate-quiz
{
  "topic": "JavaScript",
  "difficulty": "medium",
  "numQuestions": 10
}
```

### Analytics

```
GET /api/ai/performance-trends/{userId}
GET /api/ai/study-recommendations/{userId}
GET /api/ai/analyze-results/{quizId}/{userId}
```

### Practice Questions

```
POST /api/ai/practice-questions
{
  "userId": "1",
  "weakTopics": ["JavaScript", "React"]
}
```

### AI Tutor

```
POST /api/ai/tutor-help
{
  "userId": "1",
  "question": "How do React hooks work?"
}
```

## 🧪 Testing

### Manual Testing Checklist

- [ ] AI Quiz Generator creates valid quizzes
- [ ] AI Analytics displays correct data
- [ ] AI Practice generates appropriate questions
- [ ] AI Tutor responds to user queries
- [ ] All features work on mobile devices
- [ ] Error handling works correctly
- [ ] Loading states display properly

### Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🐛 Troubleshooting

### Common Issues

1. **AI Services Not Responding**

   - Check backend API endpoints are running
   - Verify network connectivity
   - Check browser console for CORS errors

2. **Authentication Issues**

   - Ensure user is logged in
   - Check localStorage for valid tokens
   - Verify backend authentication is working

3. **Mobile Display Issues**
   - Test on different screen sizes
   - Check responsive breakpoints
   - Verify touch interactions work

### Debug Mode

Enable debug logging by setting:

```javascript
localStorage.setItem("debug", "true");
```

## 📈 Future Enhancements

### Planned Features

- **Voice Integration**: Speech-to-text for AI Tutor
- **Offline Support**: Cached AI responses for offline use
- **Advanced Analytics**: Machine learning insights
- **Social Features**: Share AI-generated quizzes
- **Multi-language Support**: Internationalization for AI features

### Performance Optimizations

- **Service Workers**: Background sync for AI requests
- **WebAssembly**: Performance-critical AI operations
- **Progressive Web App**: Native app-like experience

## 🤝 Contributing

When contributing to AI features:

1. Follow the existing code style and patterns
2. Add proper error handling for all AI API calls
3. Include loading states for better UX
4. Test on multiple devices and browsers
5. Update this documentation for new features

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Note**: This frontend is designed to work with the Spring Boot backend that includes AI API integration. Ensure the backend is properly configured and running before testing these features.
