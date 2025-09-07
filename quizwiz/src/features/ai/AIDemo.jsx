import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Brain,
  Target,
  BarChart3,
  MessageCircle,
  Sparkles,
  ArrowRight,
  Play,
  TrendingUp,
  Lightbulb,
} from "lucide-react";

const AIDemo = () => {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      id: "generator",
      title: "AI Quiz Generator",
      description:
        "Generate intelligent quizzes using AI based on topics, difficulty, and question count.",
      icon: Brain,
      color: "from-purple-500 to-blue-500",
      path: "/admin",
      adminOnly: true,
      features: [
        "Topic-based quiz generation",
        "Multiple difficulty levels",
        "Real-time preview",
        "One-click quiz saving",
      ],
    },
    {
      id: "analytics",
      title: "AI Analytics Dashboard",
      description:
        "Get personalized insights and performance analytics powered by AI.",
      icon: BarChart3,
      color: "from-blue-500 to-cyan-500",
      path: "/ai-analytics",
      features: [
        "Performance trends visualization",
        "Weak areas identification",
        "Personalized recommendations",
        "Interactive charts and graphs",
      ],
    },
    {
      id: "practice",
      title: "AI Practice Questions",
      description:
        "Practice with personalized questions tailored to your weak areas.",
      icon: Target,
      color: "from-orange-500 to-red-500",
      path: "/ai-practice",
      features: [
        "Adaptive difficulty",
        "Progress tracking",
        "Detailed explanations",
        "Performance analysis",
      ],
    },
    {
      id: "tutor",
      title: "AI Tutor Assistant",
      description: "Get real-time help and explanations from your AI tutor.",
      icon: MessageCircle,
      color: "from-green-500 to-emerald-500",
      path: "/quizlist",
      features: [
        "Real-time chat interface",
        "Quick question suggestions",
        "Context-aware responses",
        "Always available help",
      ],
    },
  ];

  const isAdmin = localStorage.getItem("role") === "ROLE_ADMIN";

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
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl">
              <Sparkles className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white">
              AI-Powered Features
            </h1>
          </div>
          <p className="text-xl text-purple-200 max-w-3xl mx-auto">
            Experience the future of learning with our intelligent AI features
            designed to enhance your quiz experience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isDisabled = feature.adminOnly && !isAdmin;

            return (
              <div
                key={feature.id}
                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:scale-105 transition-all duration-300 cursor-pointer ${
                  isDisabled
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/20"
                }`}
                onClick={() => {
                  if (!isDisabled) {
                    if (activeFeature === feature.id) {
                      setActiveFeature(null);
                    } else {
                      setActiveFeature(feature.id);
                    }
                  }
                }}
              >
                <div className="flex items-start gap-4 mb-6">
                  <div
                    className={`p-3 bg-gradient-to-r ${feature.color} rounded-xl`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {feature.title}
                      {feature.adminOnly && (
                        <span className="ml-2 text-xs bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full">
                          Admin Only
                        </span>
                      )}
                    </h3>
                    <p className="text-purple-200">{feature.description}</p>
                  </div>
                </div>

                {/* Feature List */}
                {activeFeature === feature.id && (
                  <div className="space-y-3 mb-6">
                    {feature.features.map((feat, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-white"
                      >
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDisabled) {
                      navigate(feature.path);
                    }
                  }}
                  disabled={isDisabled}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-medium transition-all ${
                    isDisabled
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : `bg-gradient-to-r ${feature.color} text-white hover:scale-105`
                  }`}
                >
                  <Play className="h-5 w-5" />
                  {isDisabled ? "Admin Access Required" : "Try Now"}
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-2">100%</div>
            <div className="text-purple-200">AI Powered</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-2">24/7</div>
            <div className="text-purple-200">AI Tutor Available</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-2">Smart</div>
            <div className="text-purple-200">Adaptive Learning</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 text-center">
            <div className="text-3xl font-bold text-white mb-2">Real-time</div>
            <div className="text-purple-200">Analytics</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <Lightbulb className="h-16 w-16 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Experience AI-Powered Learning?
            </h2>
            <p className="text-purple-200 mb-6 max-w-2xl mx-auto">
              Start exploring our AI features and take your learning to the next
              level. Get personalized insights, practice with intelligent
              questions, and learn with your AI tutor.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/quizlist")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-medium hover:scale-105 transition-all flex items-center gap-2"
              >
                <TrendingUp className="h-5 w-5" />
                Start Learning
              </button>
              <button
                onClick={() => navigate("/ai-analytics")}
                className="bg-white/20 text-white px-8 py-4 rounded-xl font-medium hover:bg-white/30 transition-all flex items-center gap-2"
              >
                <BarChart3 className="h-5 w-5" />
                View Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIDemo;
