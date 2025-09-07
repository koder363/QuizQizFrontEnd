import axios from "../api/axios";

// AI Service for handling all AI-related API calls
class AIService {
  // Generate quiz questions using AI
  async generateQuizQuestions(topic, difficulty, numQuestions) {
    try {
      const response = await axios.post("/ai/generate-quiz", {
        topic,
        difficulty,
        numQuestions,
      });
      return response.data;
    } catch (error) {
      console.error("Error generating quiz questions:", error);
      throw error;
    }
  }

  // Analyze quiz results and provide insights
  async analyzeQuizResults(quizId, userId) {
    try {
      const response = await axios.get(
        `/ai/analyze-results/${quizId}/${userId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error analyzing quiz results:", error);
      throw error;
    }
  }

  // Get personalized study recommendations
  async getStudyRecommendations(userId) {
    try {
      const response = await axios.get(`/ai/study-recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting study recommendations:", error);
      // Return fallback recommendations
      return {
        recommendations: [
          {
            title: "Practice Regularly",
            description: "Consistent practice is key to improving your skills.",
            tags: ["Practice", "Consistency"],
          },
        ],
      };
    }
  }

  // Generate practice questions based on weak areas
  async generatePracticeQuestions(userId, weakTopics) {
    try {
      const response = await axios.post("/ai/practice-questions", {
        userId,
        weakTopics,
      });
      return response.data;
    } catch (error) {
      console.error("Error generating practice questions:", error);
      throw error;
    }
  }

  // Get AI-powered quiz explanations
  async getQuestionExplanation(questionId) {
    try {
      const response = await axios.get(`/ai/explain-question/${questionId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting question explanation:", error);
      throw error;
    }
  }

  // Analyze user performance trends
  async analyzePerformanceTrends(userId) {
    try {
      const response = await axios.get(`/ai/performance-trends/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error analyzing performance trends:", error);
      // Return fallback trends
      return {
        trends: [],
      };
    }
  }

  // Generate adaptive quiz based on user level
  async generateAdaptiveQuiz(userId, topic) {
    try {
      const response = await axios.post("/ai/adaptive-quiz", {
        userId,
        topic,
      });
      return response.data;
    } catch (error) {
      console.error("Error generating adaptive quiz:", error);
      throw error;
    }
  }

  // Get AI tutor assistance
  async getAITutorHelp(userId, question) {
    try {
      const response = await axios.post("/ai/tutor-help", {
        userId,
        question,
      });
      return response.data;
    } catch (error) {
      console.error("Error getting AI tutor help:", error);
      throw error;
    }
  }

  // Get AI reports for user
  async getAIReports(userId) {
    try {
      const response = await axios.get(`/ai-reports/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting AI reports:", error);
      return [];
    }
  }

  // Get AI reports for quiz
  async getQuizAIReports(quizId) {
    try {
      const response = await axios.get(`/ai-reports/quiz/${quizId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting quiz AI reports:", error);
      return [];
    }
  }

  // Get specific AI report by ID
  async getAIReportById(reportId) {
    try {
      const response = await axios.get(`/ai-reports/${reportId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting AI report by ID:", error);
      throw error;
    }
  }

  // Get latest AI report for user and quiz
  async getLatestAIReport(userId, quizId) {
    try {
      const response = await axios.get(
        `/ai-reports/user/${userId}/quiz/${quizId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error getting latest AI report:", error);
      throw error;
    }
  }

  // Generate AI report for quiz result
  async generateAIReport(resultData) {
    try {
      const response = await axios.post("/ai-reports/generate", resultData);
      return response.data;
    } catch (error) {
      console.error("Error generating AI report:", error);
      throw error;
    }
  }

  // Get user performance analytics
  async getUserAnalytics(userId) {
    try {
      const response = await axios.get(`/ai/analytics/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting user analytics:", error);
      throw error;
    }
  }

  // Get quiz performance insights
  async getQuizInsights(quizId) {
    try {
      const response = await axios.get(`/ai/quiz-insights/${quizId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting quiz insights:", error);
      throw error;
    }
  }

  // Get personalized learning path
  async getLearningPath(userId) {
    try {
      const response = await axios.get(`/ai/learning-path/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error getting learning path:", error);
      throw error;
    }
  }

  // Submit feedback for AI improvement
  async submitFeedback(feedbackData) {
    try {
      const response = await axios.post("/ai/feedback", feedbackData);
      return response.data;
    } catch (error) {
      console.error("Error submitting feedback:", error);
      throw error;
    }
  }

  // Get AI model status
  async getAIStatus() {
    try {
      const response = await axios.get("/ai/status");
      return response.data;
    } catch (error) {
      console.error("Error getting AI status:", error);
      return { status: "unavailable" };
    }
  }
}

export default new AIService();
