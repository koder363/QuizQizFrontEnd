import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AttemptQuiz = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`/quizzes/${quizId}`);
        setQuiz(response.data);
      } catch (error) {
        console.error("Failed to fetch quiz:", error);
        alert("Failed to load quiz. Please try again.");
      }
    };

    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (quiz) {
      const answered = Object.keys(answers).length;
      setProgress((answered / quiz.questions.length) * 100);
    }
  }, [answers, quiz]);

  const handleChange = (questionId, selectedOption) => {
    setAnswers({ ...answers, [questionId]: selectedOption });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.post("/quizzes/submit", {
        quizId: parseInt(quizId),
        answers,
      });
      toast.success("Quiz submitted successfully!");
      navigate("/quizzes");
    } catch (err) {
      toast.error("Submission Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestion(index);
  };

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading your quiz...</p>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];
  const totalQuestions = quiz.questions.length;
  const answeredQuestions = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 sm:p-6 md:p-10 lg:p-16 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            {quiz.title}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 text-white/80 text-sm">
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Question {currentQuestion + 1} of {totalQuestions}
            </span>
            <span className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {answeredQuestions} answered
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="w-full bg-white/20 rounded-full h-3">
            <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-white/80 text-sm mt-1 text-center">{Math.round(progress)}% Complete</p>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center flex-wrap gap-2 mb-6">
          {quiz.questions.map((_, index) => (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentQuestion
                  ? 'bg-cyan-400 scale-125 shadow-lg shadow-cyan-400/50'
                  : answers[quiz.questions[index].id]
                  ? 'bg-green-400'
                  : 'bg-white/30 hover:bg-white/50'
              } transition-all duration-300`}
            />
          ))}
        </div>

        {/* Question Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">{currentQ.questionText}</h2>
          <div className="space-y-4">
            {currentQ.options.map((opt, i) => (
              <label key={i} className="group block">
                <div className={`relative p-4 sm:p-6 rounded-2xl border-2 ${
                  answers[currentQ.id] === opt
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400 shadow-lg'
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40'
                }`}>
                  <div className="flex items-center">
                    <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 mr-3 ${
                      answers[currentQ.id] === opt ? 'border-cyan-400 bg-cyan-400' : 'border-white/40'
                    }`}>
                      {answers[currentQ.id] === opt && (
                        <div className="w-3 h-3 bg-white rounded-full animate-ping mx-auto mt-[2px]"></div>
                      )}
                    </div>
                    <span className="text-white text-base sm:text-lg">{opt}</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name={`q_${currentQ.id}`}
                  value={opt}
                  checked={answers[currentQ.id] === opt}
                  onChange={() => handleChange(currentQ.id, opt)}
                  className="sr-only"
                />
              </label>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-semibold ${
              currentQuestion === 0
                ? 'bg-white/10 text-white/50 cursor-not-allowed'
                : 'bg-white/20 text-white hover:bg-white/30 hover:scale-105 border border-white/20'
            } transition-all`}
          >
            ← Previous
          </button>

          {currentQuestion === totalQuestions - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || answeredQuestions !== totalQuestions}
              className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold ${
                isSubmitting || answeredQuestions !== totalQuestions
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-105'
              } text-white transition-all`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                `Submit Quiz`
              )}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700 hover:scale-105 transition-all"
            >
              Next →
            </button>
          )}
        </div>

        {/* Footer Summary */}
        <div className="mt-8 text-center text-white/60 text-sm">
          <div className="flex flex-wrap justify-center gap-2">
            <span>Total Questions: {totalQuestions}</span>
            <span>•</span>
            <span>Answered: {answeredQuestions}</span>
            <span>•</span>
            <span>Remaining: {totalQuestions - answeredQuestions}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AttemptQuiz;
