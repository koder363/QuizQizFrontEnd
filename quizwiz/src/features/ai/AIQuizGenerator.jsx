import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  Brain,
  Loader2,
  Save,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import aiService from "../../services/aiService";
import axios from "../../api/axios";

const AIQuizGenerator = ({ onQuizGenerated }) => {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [generatedQuiz, setGeneratedQuiz] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await aiService.generateQuizQuestions(
        topic,
        difficulty,
        numQuestions
      );

      if (response && response.questions) {
        setGeneratedQuiz(response);
        toast.success("Quiz generated successfully!");
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast.error("Failed to generate quiz. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuiz = async () => {
    if (!generatedQuiz) return;

    setIsSaving(true);
    try {
      const quizData = {
        title: generatedQuiz.title,
        questions: generatedQuiz.questions.map((q) => ({
          questionText: q.questionText,
          options: q.options,
          correctAnswer: q.correctAnswer,
        })),
      };

      await axios.post("/admin/quizzes", quizData);
      toast.success("Quiz saved successfully!");
      setGeneratedQuiz(null);
      setTopic("");
      if (onQuizGenerated) {
        onQuizGenerated();
      }
    } catch (error) {
      console.error("Error saving quiz:", error);
      toast.error("Failed to save quiz. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = () => {
    setGeneratedQuiz(null);
    handleGenerateQuiz();
  };

  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/50 shadow-lg">
      <div className="flex items-center mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg mr-3">
          <Brain className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">AI Quiz Generator</h2>
      </div>

      {/* Input Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <label className="block text-slate-700 font-medium mb-2">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., JavaScript, React, Database"
            className="w-full p-3 bg-white/70 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-medium mb-2">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 bg-white/70 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block text-slate-700 font-medium mb-2">
            Questions
          </label>
          <select
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value))}
            className="w-full p-3 bg-white/70 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
            <option value={20}>20 Questions</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleGenerateQuiz}
            disabled={isGenerating || !topic.trim()}
            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Brain className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? "Generating..." : "Generate Quiz"}
          </button>
        </div>
      </div>

      {/* Generated Quiz Preview */}
      {generatedQuiz && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-slate-800">
              Generated Quiz: {generatedQuiz.title}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={handleRegenerate}
                className="flex items-center px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all duration-300"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate
              </button>
              <button
                onClick={handleSaveQuiz}
                disabled={isSaving}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50"
              >
                {isSaving ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save Quiz"}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg border border-purple-200">
            <div className="space-y-4">
              {generatedQuiz.questions.map((question, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg border border-purple-100 shadow-sm"
                >
                  <h4 className="font-semibold text-slate-800 mb-3">
                    Question {index + 1}: {question.questionText}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {question.options.map((option, optionIndex) => (
                      <div
                        key={optionIndex}
                        className={`p-2 rounded-md transition-all duration-200 ${
                          option === question.correctAnswer
                            ? "bg-green-100 border border-green-300 text-green-800 font-semibold"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {option}
                        {option === question.correctAnswer && (
                          <CheckCircle className="w-4 h-4 inline ml-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!generatedQuiz && (
        <div className="text-center py-8">
          <div className="bg-slate-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-slate-600" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">
            Generate AI-Powered Quizzes
          </h3>
          <p className="text-slate-600">
            Enter a topic, select difficulty and number of questions, then let
            AI create engaging quiz content for you.
          </p>
        </div>
      )}
    </div>
  );
};

export default AIQuizGenerator;
