import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "../features/auth/Login.jsx";
import QuizList from "../features/quiz/QuizList.jsx";
import Register from "../features/auth/Register.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPanel from "../admin/AdminPanel.jsx";
import UserResultPage from "../pages/UserResultPage.jsx";
import AdminResultPage from "../pages/AdminResultPage.jsx";
import ProtectedAdminRoute from "./ProtectedAdminRoute .jsx";
import QuizInstructions from "../features/quiz/QuizInstructions.jsx";
import AttemptQuiz from "../features/quiz/QuizAttempt.jsx";
import AIAnalytics from "../features/ai/AIAnalytics.jsx";
import AIPracticeQuestions from "../features/ai/AIPracticeQuestions.jsx";
import AITutor from "../features/ai/AITutor.jsx";

const AppRoutes = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const isAuthenticated = username && role;

  return (
    <Router>
      <Routes>
        {/* Redirect from "/" */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/quizlist" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminPanel />
            </ProtectedAdminRoute>
          }
        />


        {/* this page is available and currently working but no use in ui wise */}
        {/* <Route
          path="/admin/results/quiz/:quizId"
          element={<AdminResultPage />}
        /> */}


        {/* this route is currently unavailable we have to builded the backend api for this */}
        {/* <Route
          path="/admin/results/user/:userId"
          element={<AdminResultPage />}
        /> */}

        {/* Protected route for quiz list */}
        <Route
          path="/quizlist"
          element={isAuthenticated ? <QuizList /> : <Navigate to="/login" />}
        />

        {/* User Results Page */}
        <Route
          path="/results/me"
          element={
            isAuthenticated ? <UserResultPage /> : <Navigate to="/login" />
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

        {/* routes for the quiz page and instruction page */}

        <Route
          path="/quiz/:quizId/instructions"
          element={<QuizInstructions />}
        />
                 <Route path="/quiz/:quizId/attempt" element={<AttemptQuiz />} />

         {/* AI Features Routes */}
         <Route
           path="/ai-analytics"
           element={isAuthenticated ? <AIAnalytics /> : <Navigate to="/login" />}
         />
         <Route
           path="/ai-practice"
           element={isAuthenticated ? <AIPracticeQuestions /> : <Navigate to="/login" />}
         />
        </Routes>
        
        {/* AI Tutor - Always available when authenticated */}
        {isAuthenticated && <AITutor />}
        
        <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default AppRoutes;
