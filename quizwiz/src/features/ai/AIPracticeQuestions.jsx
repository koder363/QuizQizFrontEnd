import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  Target,
  Brain,
  Play,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  BookOpen,
  TrendingUp,
  Clock,
  Award,
} from "lucide-react";
import aiService from "../../services/aiService";
import axios from "../../api/axios";

const AIPracticeQuestions = () => {
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [weakTopics, setWeakTopics] = useState([]);
  const [userResults, setUserResults] = useState([]);

  useEffect(() => {
    loadWeakTopics();
  }, []);

  const loadWeakTopics = async () => {
    try {
      // Get user's quiz results to analyze weak areas
      const resultsResponse = await axios.get("/results/user/me");
      setUserResults(resultsResponse.data);

      // Get all quizzes to analyze topics
      const quizzesResponse = await axios.get("/quizzes");
      const allQuizzes = quizzesResponse.data;

      // Analyze weak topics based on actual performance
      const topics = analyzeWeakTopics(resultsResponse.data, allQuizzes);
      setWeakTopics(topics);

      // Generate practice questions
      generatePracticeQuestions(topics);
    } catch (error) {
      console.error("Error loading weak topics:", error);
      toast.error("Failed to load practice data");

      // Fallback to default topics
      const defaultTopics = ["JavaScript", "React", "Database", "Algorithms"];
      setWeakTopics(defaultTopics);
      generatePracticeQuestions(defaultTopics);
    }
  };

  const analyzeWeakTopics = (userResults, allQuizzes) => {
    if (!userResults || userResults.length === 0) {
      return ["JavaScript", "React", "Database", "Algorithms"];
    }

    // Group results by quiz topic and calculate average scores
    const topicPerformance = {};

    userResults.forEach((result) => {
      const quiz = allQuizzes.find((q) => q.id === result.quizId);
      if (quiz) {
        const topic = extractTopicFromTitle(quiz.title);
        const score = (result.score / result.totalQuestions) * 100;

        if (!topicPerformance[topic]) {
          topicPerformance[topic] = { scores: [], count: 0 };
        }
        topicPerformance[topic].scores.push(score);
        topicPerformance[topic].count++;
      }
    });

    // Find weak topics (average score < 70%)
    const weakTopics = [];
    Object.entries(topicPerformance).forEach(([topic, data]) => {
      const avgScore =
        data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length;
      if (avgScore < 70) {
        weakTopics.push(topic);
      }
    });

    // If no weak topics found, return default topics
    return weakTopics.length > 0
      ? weakTopics.slice(0, 4)
      : ["JavaScript", "React", "Database", "Algorithms"];
  };

  const extractTopicFromTitle = (title) => {
    const commonTopics = [
      "JavaScript",
      "React",
      "Node.js",
      "Python",
      "Java",
      "C++",
      "HTML",
      "CSS",
      "Database",
      "SQL",
      "MongoDB",
      "Git",
      "Docker",
      "AWS",
      "Linux",
      "Algorithms",
      "Data Structures",
      "Machine Learning",
      "Web Development",
      "Mobile Development",
    ];

    for (const topic of commonTopics) {
      if (title.toLowerCase().includes(topic.toLowerCase())) {
        return topic;
      }
    }

    return title.split(" ")[0] || "General";
  };

  const generatePracticeQuestions = async (topics) => {
    setIsGenerating(true);
    try {
      const userId = localStorage.getItem("userId") || "1";
      const result = await aiService.generatePracticeQuestions(userId, topics);

      if (result && result.questions) {
        setPracticeQuestions(result.questions);
      } else {
        // Fallback to generated questions based on topics
        setPracticeQuestions(generateFallbackQuestions(topics));
      }

      setCurrentQuestion(0);
      setSelectedAnswers({});
      setShowResults(false);
      setScore(0);
    } catch (error) {
      console.error("Error generating practice questions:", error);
      toast.error("Failed to generate practice questions");

      // Fallback to generated questions
      setPracticeQuestions(generateFallbackQuestions(topics));
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  const generateFallbackQuestions = (topics) => {
    const questions = [];
    topics.forEach((topic, topicIndex) => {
      for (let i = 0; i < 3; i++) {
        questions.push({
          id: `${topic}-${i}`,
          questionText: `What is a key concept in ${topic}?`,
          options: [
            `Option A: ${topic} fundamental`,
            `Option B: ${topic} advanced`,
            `Option C: ${topic} intermediate`,
            `Option D: ${topic} basic`,
          ],
          correctAnswer: `Option A: ${topic} fundamental`,
          topic: topic,
          explanation: `This question tests your understanding of ${topic} fundamentals.`,
        });
      }
    });
    return questions;
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = () => {
    let correctAnswers = 0;
    practiceQuestions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const finalScore = Math.round(
      (correctAnswers / practiceQuestions.length) * 100
    );
    setScore(finalScore);
    setShowResults(true);
  };

  const handleRegenerate = () => {
    setShowResults(false);
    setScore(0);
    setSelectedAnswers({});
    setCurrentQuestion(0);
    generatePracticeQuestions(weakTopics);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">
            Loading Practice Questions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Target className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              AI Practice Questions
            </h1>
          </div>
          <p className="text-purple-200 text-lg">
            Personalized practice questions based on your weak areas
          </p>
        </div>

        {/* Weak Areas Summary */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Focus Areas
          </h3>
          <div className="flex flex-wrap gap-2">
            {weakTopics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {!showResults ? (
          /* Practice Questions */
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
              <div className="flex items-center justify-between text-white mb-2">
                <span>Progress</span>
                <span>
                  {currentQuestion + 1} / {practiceQuestions.length}
                </span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${
                      ((currentQuestion + 1) / practiceQuestions.length) * 100
                    }%`,
                  }}
                ></div>
              </div>
            </div>

            {/* Current Question */}
            {practiceQuestions.length > 0 && (
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-purple-200 text-sm">
                    Question {currentQuestion + 1} of {practiceQuestions.length}
                  </span>
                  <span className="text-purple-200 text-sm">
                    Topic: {practiceQuestions[currentQuestion].topic}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-6">
                  {practiceQuestions[currentQuestion].questionText}
                </h3>

                <div className="space-y-3">
                  {practiceQuestions[currentQuestion].options.map(
                    (option, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          handleAnswerSelect(
                            practiceQuestions[currentQuestion].id,
                            option
                          )
                        }
                        className={`w-full p-4 text-left rounded-lg transition-all duration-300 ${
                          selectedAnswers[
                            practiceQuestions[currentQuestion].id
                          ] === option
                            ? "bg-purple-500 text-white"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        {option}
                      </button>
                    )
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    onClick={() =>
                      setCurrentQuestion(Math.max(0, currentQuestion - 1))
                    }
                    disabled={currentQuestion === 0}
                    className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
                  >
                    Previous
                  </button>

                  {currentQuestion < practiceQuestions.length - 1 ? (
                    <button
                      onClick={() => setCurrentQuestion(currentQuestion + 1)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmit}
                      disabled={
                        Object.keys(selectedAnswers).length <
                        practiceQuestions.length
                      }
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50"
                    >
                      Submit Answers
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Regenerate Button */}
            <div className="text-center">
              <button
                onClick={handleRegenerate}
                disabled={isGenerating}
                className="flex items-center mx-auto px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="w-4 h-4 mr-2" />
                )}
                {isGenerating ? "Generating..." : "Generate New Questions"}
              </button>
            </div>
          </div>
        ) : (
          /* Results */
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 border border-white/20">
            <div className="text-center mb-8">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Award className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                Practice Complete!
              </h2>
              <p className="text-purple-200">
                You scored {score}% on this practice session
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {practiceQuestions.length}
                </div>
                <div className="text-purple-200 text-sm">Total Questions</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div
                  className={`text-2xl font-bold mb-1 ${getScoreColor(score)}`}
                >
                  {score}%
                </div>
                <div className="text-purple-200 text-sm">Score</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {Math.round((score / 100) * practiceQuestions.length)}
                </div>
                <div className="text-purple-200 text-sm">Correct</div>
              </div>
            </div>

            <div className="text-center space-y-4">
              <button
                onClick={handleRegenerate}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                Practice Again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIPracticeQuestions;
