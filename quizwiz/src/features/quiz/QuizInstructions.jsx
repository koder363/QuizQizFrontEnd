// src/pages/QuizInstructions.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";

const QuizInstructions = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quizTitle, setQuizTitle] = useState("");

  useEffect(() => {
    const fetchQuizTitle = async () => {
      try {
        const res = await axios.get(`/quizzes/${quizId}`);
        setQuizTitle(res.data.title);
      } catch (err) {
        toast.error("Failed to fetch quiz details.");
      }
    };
    fetchQuizTitle();
  }, [quizId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-2xl bg-white p-6 md:p-10 rounded-2xl shadow-lg transition-all">
        <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-6 text-center">
          Instructions for: <span className="text-black">{quizTitle}</span>
        </h2>

        <ul className="list-disc list-inside text-gray-800 space-y-3 text-base sm:text-lg">
          <li>The quiz contains multiple choice questions.</li>
          <li>Only one option can be selected for each question.</li>
          <li>You cannot go back once you submit the quiz.</li>
          <li>Each question carries equal marks.</li>
          <li>Make sure to attempt all questions before submitting.</li>
        </ul>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate(`/quiz/${quizId}/attempt`)}
            className="bg-green-600 hover:bg-green-700 text-white text-lg px-6 py-3 rounded-lg shadow-md w-full sm:w-auto transition duration-300"
          >
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizInstructions;
