import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "../features/auth/Login.jsx";
import QuizList from "../features/quiz/QuizList.jsx";
import Register from "../features/auth/Register.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminPanel from "../admin/AdminPanel.jsx";
import UserResultPage from "../pages/UserResultPage.jsx";
import AdminResultPage from "../pages/AdminResultPage.jsx";
import ProtectedAdminRoute from "./ProtectedAdminRoute .jsx";
import QuizInstructions from "../features/quiz/QuizInstructions.jsx";
import AttemptQuiz from "../features/quiz/QuizAttempt.jsx";


const AppRoutes = () => {
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const isAuthenticated = username && role;

  return (
    <Router>
      <Routes>
        {/* Redirect from "/" */}
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/quizlist" /> : <Navigate to="/login" />
        } />

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
        <Route path="/admin/results/quiz/:quizId" element={<AdminResultPage />} />
        <Route path="/admin/results/user/:userId" element={<AdminResultPage />} />

        {/* Protected route for quiz list */}
        <Route path="/quizlist" element={
          isAuthenticated ? <QuizList /> : <Navigate to="/login" />
        } />

        {/* User Results Page */}
        <Route path="/results/me" element={
          isAuthenticated ? <UserResultPage /> : <Navigate to="/login" />
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />

         {/* routes for the quiz page and instruction page */}

        <Route path="/quiz/:quizId/instructions" element={<QuizInstructions />} />
        <Route path="/quiz/:quizId/attempt" element={<AttemptQuiz />} />

      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </Router>
  );
};

export default AppRoutes;
