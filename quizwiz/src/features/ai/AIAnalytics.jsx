import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  TrendingUp,
  Brain,
  Target,
  BookOpen,
  Lightbulb,
  Loader2,
  BarChart3,
  Users,
  Clock,
  Award,
  RefreshCw,
} from "lucide-react";
import axios from "../../api/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const AIAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [performanceTrends, setPerformanceTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [refreshing, setRefreshing] = useState(false);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const username = localStorage.getItem("username");

      // Fetch user's quiz results
      const userResults = await axios.get("/results/user/me");

      // Fetch all quizzes for analysis
      const allQuizzes = await axios.get("/quizzes");

      // Process real analytics data
      const processedAnalytics = processAnalyticsData(
        userResults.data,
        allQuizzes.data
      );
      setAnalytics(processedAnalytics);

      // Generate recommendations based on weak areas
      const aiRecommendations = generateAIRecommendations(
        processedAnalytics.weakAreas
      );
      setRecommendations(aiRecommendations);

      // Generate performance trends
      const trends = generatePerformanceTrends(userResults.data);
      setPerformanceTrends(trends);
    } catch (error) {
      console.error("Error loading analytics:", error);
      toast.error("Failed to load analytics data");

      // Fallback to minimal data structure
      setAnalytics({
        totalQuizzes: 0,
        averageScore: 0,
        improvementRate: 0,
        weakAreas: [],
        strongAreas: [],
        recentPerformance: [],
      });
      setRecommendations([]);
      setPerformanceTrends([]);
    } finally {
      setLoading(false);
    }
  };

  const refreshAnalytics = async () => {
    setRefreshing(true);
    await loadAnalytics();
    setRefreshing(false);
    toast.success("Analytics refreshed!");
  };

  const processAnalyticsData = (userResults, allQuizzes) => {
    if (!userResults || userResults.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        improvementRate: 0,
        weakAreas: [],
        strongAreas: [],
        recentPerformance: [],
      };
    }

    // Calculate total quizzes attempted
    const totalQuizzes = userResults.length;

    // Calculate average score
    const totalScore = userResults.reduce((sum, result) => {
      return sum + (result.score / result.totalQuestions) * 100;
    }, 0);
    const averageScore = Math.round(totalScore / totalQuizzes);

    // Calculate improvement rate (compare first 50% vs last 50% of attempts)
    let improvementRate = 0;
    if (userResults.length >= 2) {
      const sortedResults = [...userResults].sort(
        (a, b) => new Date(a.submittedAt) - new Date(b.submittedAt)
      );
      const midPoint = Math.floor(sortedResults.length / 2);
      const firstHalf = sortedResults.slice(0, midPoint);
      const secondHalf = sortedResults.slice(midPoint);

      const firstHalfAvg =
        firstHalf.reduce(
          (sum, result) => sum + (result.score / result.totalQuestions) * 100,
          0
        ) / firstHalf.length;

      const secondHalfAvg =
        secondHalf.reduce(
          (sum, result) => sum + (result.score / result.totalQuestions) * 100,
          0
        ) / secondHalf.length;

      improvementRate = Math.round(secondHalfAvg - firstHalfAvg);
    }

    // Analyze weak and strong areas based on quiz titles
    const topicPerformance = {};
    userResults.forEach((result) => {
      const quiz = allQuizzes.find((q) => q.id === result.quizId);
      if (quiz) {
        const topic = extractTopicFromTitle(quiz.title);
        const score = (result.score / result.totalQuestions) * 100;

        if (!topicPerformance[topic]) {
          topicPerformance[topic] = { scores: [], questions: 0 };
        }
        topicPerformance[topic].scores.push(score);
        topicPerformance[topic].questions += result.totalQuestions;
      }
    });

    const weakAreas = [];
    const strongAreas = [];

    Object.entries(topicPerformance).forEach(([topic, data]) => {
      const avgScore = Math.round(
        data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length
      );
      const areaData = {
        topic,
        score: avgScore,
        questions: data.questions,
      };

      if (avgScore < 70) {
        weakAreas.push(areaData);
      } else {
        strongAreas.push(areaData);
      }
    });

    // Sort by score
    weakAreas.sort((a, b) => a.score - b.score);
    strongAreas.sort((a, b) => b.score - a.score);

    // Create performance timeline
    const recentPerformance = userResults
      .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
      .map((result, index) => ({
        date: new Date(result.submittedAt).toLocaleDateString(),
        score: Math.round((result.score / result.totalQuestions) * 100),
        quizId: result.quizId,
      }))
      .slice(-10); // Last 10 attempts

    return {
      totalQuizzes,
      averageScore,
      improvementRate,
      weakAreas: weakAreas.slice(0, 4), // Top 4 weak areas
      strongAreas: strongAreas.slice(0, 2), // Top 2 strong areas
      recentPerformance,
    };
  };

  const generateAIRecommendations = (weakAreas) => {
    const recommendations = [];

    if (weakAreas.length === 0) {
      recommendations.push({
        title: "Great Progress!",
        description:
          "You're performing well across all topics. Consider exploring advanced concepts or helping others learn.",
        tags: ["Advanced", "Mentorship"],
        priority: "low",
      });
      return recommendations;
    }

    weakAreas.forEach((area, index) => {
      const topic = area.topic;
      const score = area.score;

      let recommendation = {
        title: `Focus on ${topic}`,
        description: `Your ${topic} score is ${score}%. Consider reviewing fundamental concepts and practicing more questions in this area.`,
        tags: [topic, "Practice", "Review"],
        priority: "high",
      };

      // Add specific recommendations based on topic
      switch (topic.toLowerCase()) {
        case "javascript":
          recommendation.description +=
            " Focus on ES6+ features, async programming, and DOM manipulation.";
          recommendation.tags.push("ES6", "Async");
          break;
        case "react":
          recommendation.description +=
            " Practice with hooks, state management, and component lifecycle.";
          recommendation.tags.push("Hooks", "State");
          break;
        case "database":
          recommendation.description +=
            " Review SQL queries, normalization, and database design principles.";
          recommendation.tags.push("SQL", "Design");
          break;
        case "algorithms":
          recommendation.description +=
            " Practice with data structures, time complexity, and problem-solving techniques.";
          recommendation.tags.push("Data Structures", "Complexity");
          break;
        default:
          recommendation.description +=
            " Use online resources and practice problems to improve your understanding.";
          recommendation.tags.push("Resources", "Practice");
      }

      recommendations.push(recommendation);
    });

    // Add general study recommendations
    recommendations.push({
      title: "Study Strategy",
      description:
        "Consider using spaced repetition techniques and taking regular practice quizzes to reinforce your learning.",
      tags: ["Strategy", "Consistency"],
      priority: "medium",
    });

    return recommendations;
  };

  const generatePerformanceTrends = (userResults) => {
    if (!userResults || userResults.length === 0) return [];

    const sortedResults = userResults
      .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
      .map((result, index) => ({
        date: new Date(result.submittedAt).toLocaleDateString(),
        score: Math.round((result.score / result.totalQuestions) * 100),
        quizId: result.quizId,
        attempt: index + 1,
      }));

    return sortedResults;
  };

  const extractTopicFromTitle = (title) => {
    // Extract main topic from quiz title
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

    // If no specific topic found, extract first word
    return title.split(" ")[0] || "General";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-white mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">
            Loading AI Analytics...
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

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">
              AI-Powered Analytics
            </h1>
          </div>
          <p className="text-purple-200 text-lg">
            Intelligent insights and personalized recommendations for your
            learning journey
          </p>
          <button
            onClick={refreshAnalytics}
            disabled={refreshing}
            className="mt-4 flex items-center gap-2 mx-auto px-4 py-2 bg-white/10 backdrop-blur-lg rounded-lg text-white hover:bg-white/20 transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            {refreshing ? "Refreshing..." : "Refresh Analytics"}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-1">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "trends", label: "Performance Trends", icon: TrendingUp },
              {
                id: "recommendations",
                label: "AI Recommendations",
                icon: Lightbulb,
              },
              { id: "weak-areas", label: "Weak Areas", icon: Target },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "bg-white text-purple-900 shadow-lg"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stats Cards */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold">Total Quizzes</h3>
                </div>
                <p className="text-3xl font-bold text-white">
                  {analytics.totalQuizzes}
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold">Average Score</h3>
                </div>
                <p
                  className={`text-3xl font-bold ${getScoreColor(
                    analytics.averageScore
                  )}`}
                >
                  {analytics.averageScore}%
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold">Improvement</h3>
                </div>
                <p
                  className={`text-3xl font-bold ${
                    analytics.improvementRate >= 0
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {analytics.improvementRate >= 0 ? "+" : ""}
                  {analytics.improvementRate}%
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-orange-500 rounded-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold">Study Time</h3>
                </div>
                <p className="text-3xl font-bold text-white">
                  {analytics.totalQuizzes * 15}m
                </p>
              </div>
            </div>
          )}

          {activeTab === "trends" && (
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">
                Performance Trends
              </h3>
              {analytics.recentPerformance.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analytics.recentPerformance}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.1)"
                      />
                      <XAxis
                        dataKey="date"
                        stroke="white"
                        tick={{ fill: "white" }}
                      />
                      <YAxis stroke="white" tick={{ fill: "white" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "rgba(0,0,0,0.8)",
                          border: "none",
                          borderRadius: "8px",
                          color: "white",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#8884d8"
                        strokeWidth={3}
                        dot={{ fill: "#8884d8", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-12">
                  <BarChart3 className="h-16 w-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">
                    No performance data available yet. Start taking quizzes to
                    see your trends!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "recommendations" && (
            <div className="space-y-6">
              {recommendations.length > 0 ? (
                recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                        <Lightbulb className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-semibold text-white mb-2">
                          {rec.title}
                        </h4>
                        <p className="text-purple-200 mb-4">
                          {rec.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {rec.tags?.map((tag, tagIndex) => (
                            <span
                              key={tagIndex}
                              className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Lightbulb className="h-16 w-16 text-white/50 mx-auto mb-4" />
                  <p className="text-white/70 text-lg">
                    No AI recommendations available yet. Complete more quizzes
                    to get personalized suggestions!
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "weak-areas" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Weak Areas Chart */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Weak Areas Analysis
                </h3>
                {analytics.weakAreas.length > 0 ? (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analytics.weakAreas}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="rgba(255,255,255,0.1)"
                        />
                        <XAxis
                          dataKey="topic"
                          stroke="white"
                          tick={{ fill: "white" }}
                        />
                        <YAxis stroke="white" tick={{ fill: "white" }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "rgba(0,0,0,0.8)",
                            border: "none",
                            borderRadius: "8px",
                            color: "white",
                          }}
                        />
                        <Bar dataKey="score" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Target className="h-16 w-16 text-white/50 mx-auto mb-4" />
                    <p className="text-white/70 text-lg">
                      No weak areas identified yet. Keep practicing!
                    </p>
                  </div>
                )}
              </div>

              {/* Weak Areas List */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Focus Areas
                </h3>
                {analytics.weakAreas.length > 0 ? (
                  <div className="space-y-4">
                    {analytics.weakAreas.map((area, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                      >
                        <div>
                          <h4 className="text-white font-medium">
                            {area.topic}
                          </h4>
                          <p className="text-purple-200 text-sm">
                            {area.questions} questions attempted
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBadge(
                            area.score
                          )}`}
                        >
                          {area.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-white/70">
                      No weak areas to focus on. Great job!
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;
