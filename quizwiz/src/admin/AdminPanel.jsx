import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Eye,
  BarChart3,
  Users,
  Trophy,
  Calendar,
  X,
  ChevronDown,
  ChevronUp,
  Menu,
} from "lucide-react";
import axios from "../api/axios";
import { toast } from "react-toastify";

const AdminPanel = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
  ]);
  const [quizzes, setQuizzes] = useState([]);
  const [quizResultsCache, setQuizResultsCache] = useState({});
  const [viewingResultsQuizId, setViewingResultsQuizId] = useState(null);
  const [questionsCache, setQuestionsCache] = useState({});
  const [viewingQuestionsQuizId, setViewingQuestionsQuizId] = useState(null);
  const [activeTab, setActiveTab] = useState("create");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-emerald-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-500";
  };

  const calculateTotalSubmissions = () => {
    return Object.values(quizResultsCache).reduce((total, results) => {
      return total + results.length;
    }, 0);
  };

  const fetchQuizzes = async () => {
    try {
      const res = await axios.get("/quizzes");
      setQuizzes(
        res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    } catch (err) {
      console.error("Failed to fetch quizzes:", err);
      toast.error("Failed to fetch quizzes.");
    }
  };

  const handleCreateQuiz = async () => {
    try {
      const isValid = questions.every(
        (q) =>
          q.questionText.trim() &&
          q.options.every((opt) => opt.trim()) &&
          q.correctAnswer.trim()
      );

      if (!isValid) {
        toast.error("Please fill in all question fields");
        return;
      }

      const payload = {
        title: title.trim(),
        questions: questions.map((q) => ({
          questionText: q.questionText.trim(),
          options: q.options.map((opt) => opt.trim()),
          correctAnswer: q.correctAnswer.trim(),
        })),
      };

      await axios.post("/admin/quizzes", payload);
      toast.success("Quiz created successfully!");
      setTitle("");
      setQuestions([
        { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
      ]);
      fetchQuizzes();
      setActiveTab("manage");
    } catch (error) {
      console.error("Error creating quiz:", error);
      toast.error("Failed to create quiz. Please check your input.");
    }
  };

  const deleteQuiz = async (id) => {
    try {
      await axios.delete(`/admin/quizzes/${id}`);
      toast.success("Quiz deleted successfully!");
      fetchQuizzes();
      setQuizResultsCache((prev) => {
        const newCache = { ...prev };
        delete newCache[id];
        return newCache;
      });
      setQuestionsCache((prev) => {
        const newCache = { ...prev };
        delete newCache[id];
        return newCache;
      });
      if (viewingResultsQuizId === id) setViewingResultsQuizId(null);
      if (viewingQuestionsQuizId === id) setViewingQuestionsQuizId(null);
    } catch (err) {
      console.error("Error deleting quiz:", err);
      toast.error("Failed to delete quiz.");
    }
  };

  const toggleQuizResults = async (quizId) => {
    if (viewingResultsQuizId === quizId) {
      setViewingResultsQuizId(null);
    } else {
      if (!quizResultsCache[quizId]) {
        try {
          const res = await axios.get(`/results/quiz/${quizId}`);
          setQuizResultsCache((prev) => ({
            ...prev,
            [quizId]: res.data,
          }));
        } catch (err) {
          console.error(`Failed to fetch results for quiz ${quizId}:`, err);
          toast.error("Failed to fetch quiz results.");
          return;
        }
      }
      setViewingResultsQuizId(quizId);
    }
  };

  const toggleQuizQuestions = async (quizId) => {
    if (viewingQuestionsQuizId === quizId) {
      setViewingQuestionsQuizId(null);
    } else {
      if (!questionsCache[quizId]) {
        try {
          const res = await axios.get(`/quizzes/${quizId}`);
          setQuestionsCache((prev) => ({
            ...prev,
            [quizId]: res.data.questions,
          }));
        } catch (err) {
          console.error(`Failed to fetch questions for quiz ${quizId}:`, err);
          toast.error("Failed to fetch questions.");
          return;
        }
      }
      setViewingQuestionsQuizId(quizId);
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "options") {
      updatedQuestions[index].options = [...value];
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswer: "" },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Responsive Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start flex-1">
              <button
                className="md:hidden mr-4 text-slate-600 hover:text-slate-900"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Quiz Admin Panel
                </h1>
                <p className="text-slate-600 mt-1 text-sm sm:text-base">
                  Manage your quizzes and track performance
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                <Users className="w-4 h-4 inline mr-2" />
                Admin Dashboard
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/50 shadow hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Quizzes
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                  {quizzes.length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 sm:p-3 rounded-xl">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/50 shadow hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Total Submissions
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                  {calculateTotalSubmissions()}
                </p>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 sm:p-3 rounded-xl">
                <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/50 shadow hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">
                  Active Users
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                  N/A
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 sm:p-3 rounded-xl">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/50 shadow hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Avg Score</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                  N/A
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 sm:p-3 rounded-xl">
                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="bg-white w-3/4 h-full p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setActiveTab("create");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg font-medium ${
                    activeTab === "create"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <Plus className="w-4 h-4 inline mr-2" />
                  Create Quiz
                </button>
                <button
                  onClick={() => {
                    setActiveTab("manage");
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-lg font-medium ${
                    activeTab === "manage"
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Manage Quizzes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation - Responsive */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-1 sm:p-2 mb-8 border border-white/50 shadow-lg">
          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
            <button
              onClick={() => setActiveTab("create")}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 ${
                activeTab === "create"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              <span className="text-sm sm:text-base">Create Quiz</span>
            </button>
            <button
              onClick={() => setActiveTab("manage")}
              className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-300 ${
                activeTab === "manage"
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg"
                  : "text-slate-600 hover:bg-white/50"
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              <span className="text-sm sm:text-base">Manage Quizzes</span>
            </button>
          </div>
        </div>

        {/* Create Quiz Tab - Responsive */}
        {activeTab === "create" && (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-8 border border-white/50 shadow-lg">
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3">
                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                Create New Quiz
              </h2>
            </div>

            <div className="mb-6 sm:mb-8">
              <label className="block text-slate-700 font-medium mb-2">
                Quiz Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter an engaging quiz title..."
                className="w-full p-3 sm:p-4 bg-white/50 border border-slate-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 placeholder-slate-400"
              />
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800">
                  Questions
                </h3>
                <span className="text-slate-500 text-sm">
                  {questions.length}question{questions.length !== 1 ? "s" : ""}
                </span>
              </div>

              {questions.map((q, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-r from-white/60 to-white/40 p-4 sm:p-6 rounded-lg sm:rounded-xl border border-white/50 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <h4 className="font-semibold text-slate-700">
                      Question {idx + 1}
                    </h4>
                    {questions.length > 1 && (
                      <button
                        onClick={() => handleRemoveQuestion(idx)}
                        className="p-1 sm:p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <input
                      type="text"
                      placeholder="Enter your question here..."
                      value={q.questionText}
                      onChange={(e) =>
                        handleQuestionChange(
                          idx,
                          "questionText",
                          e.target.value
                        )
                      }
                      className="w-full p-2 sm:p-3 bg-white/70 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                      {q.options.map((opt, i) => (
                        <input
                          key={i}
                          type="text"
                          placeholder={`Option ${i + 1}`}
                          value={opt}
                          onChange={(e) => {
                            const newOptions = [...q.options];
                            newOptions[i] = e.target.value;
                            handleQuestionChange(idx, "options", newOptions);
                          }}
                          className="p-2 sm:p-3 bg-white/70 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                        />
                      ))}
                    </div>

                    <select
                      value={q.correctAnswer}
                      onChange={(e) =>
                        handleQuestionChange(
                          idx,
                          "correctAnswer",
                          e.target.value
                        )
                      }
                      className="w-full p-2 sm:p-3 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select correct answer</option>
                      {q.options.map((opt, i) => (
                        <option key={i} value={opt} disabled={!opt.trim()}>
                          Option {i + 1}: {opt || "[Not set]"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 sm:mt-8 space-y-4 sm:space-y-0">
              <button
                onClick={handleAddQuestion}
                className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-lg sm:rounded-xl hover:from-slate-700 hover:to-slate-800 transition-all duration-300 shadow hover:shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </button>

              <button
                onClick={handleCreateQuiz}
                disabled={
                  !title.trim() ||
                  questions.length === 0 ||
                  questions.some(
                    (q) =>
                      !q.questionText.trim() ||
                      q.options.some((opt) => !opt.trim()) ||
                      !q.correctAnswer.trim() ||
                      !q.options.includes(q.correctAnswer)
                  )
                }
                className="w-full sm:w-auto flex items-center justify-center px-4 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trophy className="w-4 h-4 mr-2" />
                Create Quiz
              </button>
            </div>
          </div>
        )}

        {/* Manage Quizzes Tab - Responsive */}
        {activeTab === "manage" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="flex items-center mb-3 sm:mb-0">
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-2 rounded-lg mr-3">
                  <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                  Manage Quizzes
                </h2>
              </div>
              <div className="text-slate-600 text-sm">
                {quizzes.length} quiz{quizzes.length !== 1 ? "es" : ""} total
              </div>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white/70 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-white/50 shadow hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-1 sm:mb-2">
                          {quiz.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-xs sm:text-sm text-slate-600">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {new Date(quiz.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {quiz.questions?.length || 0} questions
                          </span>
                          <span className="flex items-center">
                            <Users className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                            {quizResultsCache[quiz.id]?.length || 0} submissions
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        <button
                          onClick={() => toggleQuizResults(quiz.id)}
                          className="flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md sm:rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-sm sm:shadow-md text-xs sm:text-sm"
                        >
                          <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Results
                          {viewingResultsQuizId === quiz.id ? (
                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                          ) : (
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                          )}
                        </button>
                        <button
                          onClick={() => toggleQuizQuestions(quiz.id)}
                          className="flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-md sm:rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-sm sm:shadow-md text-xs sm:text-sm"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Questions
                          {viewingQuestionsQuizId === quiz.id ? (
                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                          ) : (
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
                          )}
                        </button>
                        <button
                          onClick={() => deleteQuiz(quiz.id)}
                          className="flex items-center px-3 sm:px-4 py-1 sm:py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-md sm:rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-sm sm:shadow-md text-xs sm:text-sm"
                        >
                          <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quiz Results - Responsive */}
                  {viewingResultsQuizId === quiz.id && (
                    <div className="bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-4 sm:p-6 border-t border-white/50">
                      <h4 className="font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                        <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Quiz Results ({quizResultsCache[quiz.id]?.length || 0})
                      </h4>
                      {(quizResultsCache[quiz.id]?.length ?? 0) === 0 ? (
                        <div className="text-center py-6 sm:py-8">
                          <div className="bg-slate-200 rounded-full w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                            <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-slate-500" />
                          </div>
                          <p className="text-slate-600 text-sm sm:text-base">
                            No results available for this quiz yet.
                          </p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[600px] sm:min-w-0">
                            <thead>
                              <tr className="bg-white/50 rounded-lg">
                                <th className="text-left p-2 sm:p-3 font-medium text-slate-700 text-xs sm:text-sm">
                                  User
                                </th>
                                <th className="text-left p-2 sm:p-3 font-medium text-slate-700 text-xs sm:text-sm">
                                  Score
                                </th>
                                <th className="text-left p-2 sm:p-3 font-medium text-slate-700 text-xs sm:text-sm">
                                  Submitted
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {quizResultsCache[quiz.id].map((result) => (
                                <tr
                                  key={result.id}
                                  className="bg-white/30 hover:bg-white/50 transition-colors duration-200"
                                >
                                  <td className="p-2 sm:p-3 font-medium text-slate-800 text-xs sm:text-sm">
                                    {result.userId || "Anonymous"}
                                  </td>
                                  <td className="p-2 sm:p-3 text-xs sm:text-sm">
                                    <span
                                      className={`font-bold ${getScoreColor(
                                        result.score,
                                        result.totalQuestions
                                      )}`}
                                    >
                                      {result.score}/{result.totalQuestions}
                                    </span>
                                  </td>
                                  <td className="p-2 sm:p-3 text-slate-600 text-xs sm:text-sm">
                                    {new Date(
                                      result.submittedAt
                                    ).toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quiz Questions - Responsive */}
                  {viewingQuestionsQuizId === quiz.id && (
                    <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 p-4 sm:p-6 border-t border-white/50">
                      <h4 className="font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Quiz Questions ({questionsCache[quiz.id]?.length || 0})
                      </h4>
                      <div className="space-y-3 sm:space-y-4">
                        {questionsCache[quiz.id]?.map((question, i) => (
                          <div
                            key={i}
                            className="bg-white/60 p-3 sm:p-5 rounded-lg sm:rounded-xl border border-white/50"
                          >
                            <p className="font-semibold text-slate-800 mb-2 sm:mb-3 text-sm sm:text-base">
                              Q{i + 1}: {question.questionText}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 sm:mb-3">
                              {question.options.map((option, j) => (
                                <div
                                  key={j}
                                  className={`p-2 sm:p-3 rounded-md sm:rounded-lg transition-all duration-200 text-xs sm:text-sm ${
                                    option === question.correctAnswer
                                      ? "bg-emerald-100 border border-emerald-300 text-emerald-800 font-semibold"
                                      : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {option}
                                </div>
                              ))}
                            </div>
                            <div className="text-xs sm:text-sm text-slate-600">
                              <span className="font-medium">
                                Correct Answer:
                              </span>{" "}
                              <span className="font-bold text-emerald-600">
                                {question.correctAnswer}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {quizzes.length === 0 && (
              <div className="text-center py-12 sm:py-16">
                <div className="bg-slate-200 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <BarChart3 className="w-8 h-8 sm:w-10 sm:h-10 text-slate-500" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-slate-800 mb-2">
                  No quizzes yet
                </h3>
                <p className="text-slate-600 mb-4 sm:mb-6 text-sm sm:text-base">
                  Get started by creating your first quiz!
                </p>
                <button
                  onClick={() => setActiveTab("create")}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 shadow hover:shadow-lg text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Create Your First Quiz
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
