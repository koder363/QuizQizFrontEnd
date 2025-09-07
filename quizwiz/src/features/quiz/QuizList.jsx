// src/pages/QuizList.jsx
import { useRef, useEffect, useState } from "react";
import axios from "../../api/axios";
import getDescription from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaTools,
  FaPlay,
  FaChartBar,
  FaDownload,
  FaSignOutAlt,
  FaBrain,
  FaLightbulb,
  FaBullseye,
} from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { CSVLink } from "react-csv";
import "react-toastify/dist/ReactToastify.css";
import "./slide.css";

const QuizList = () => {
  const resultPanelRef = useRef(null);
  const [quizzes, setQuizzes] = useState([]);
  const [wikiSummaries, setWikiSummaries] = useState({});
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [myResults, setMyResults] = useState([]);
  const [filter, setFilter] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("role");
    setRole(userRole);
  }, []);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (!username) {
      toast.error("You must be logged in to view quizzes.");
      return;
    }

    const fetchQuizzes = async () => {
      try {
        const res = await axios.get("/quizzes");
        setQuizzes(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch quizzes.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  useEffect(() => {
    const fetchWikiSummaries = async () => {
      try {
        const promises = quizzes.map((quiz) => {
          const topic = quiz.title.split(" ")[0] + " (programming language)";
          const encoded = encodeURIComponent(topic);
          return getDescription
            .get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encoded}`)
            .then((res) => ({
              id: quiz.id,
              extract: res.data.extract,
              image: res.data.thumbnail?.source || null,
            }))
            .catch(() => ({
              id: quiz.id,
              extract: "No description available.",
              image: null,
            }));
        });

        const results = await Promise.all(promises);
        const summaries = {};
        results.forEach((r) => {
          summaries[r.id] = { extract: r.extract, image: r.image };
        });
        setWikiSummaries(summaries);
      } catch (err) {
        console.error("Error fetching Wikipedia summaries:", err);
      }
    };

    if (quizzes.length > 0) fetchWikiSummaries();
  }, [quizzes]);

  const handleAdminClick = () => navigate("/admin");

  const fetchUserResults = async () => {
    try {
      const res = await axios.get("/results/user/me");
      setMyResults(res.data);
    } catch (err) {
      console.error("Failed to fetch user results", err);
      toast.error("Unable to load your results.");
    }
  };

  const toggleResults = () => {
    if (!showResults) fetchUserResults();
    setShowResults(!showResults);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      localStorage.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      // console.error("Logout failed", err);
      toast.error("Logout failed");
    }
  };

  const filteredResults = myResults.filter((res) =>
    (res.quizTitle || "").toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 pb-24">
        <div className="relative z-10 p-6">
          {/* Desktop Only: Top-Right Controls */}
          <div className="hidden md:flex absolute top-6 right-6 gap-4 z-20">
            {role === "ROLE_ADMIN" && (
              <button
                onClick={handleAdminClick}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:scale-105 text-white px-5 py-3 rounded-full shadow-lg transition-all"
              >
                <FaTools />
                <span>Admin Panel</span>
              </button>
            )}

            <button
              onClick={toggleResults}
              className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105 text-white px-5 py-3 rounded-full shadow-lg transition-all"
            >
              <FaChartBar />
              <span>My Results</span>
            </button>

            <button
              onClick={() => navigate("/ai-analytics")}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:scale-105 text-white px-5 py-3 rounded-full shadow-lg transition-all"
            >
              <FaBrain />
              <span>AI Analytics</span>
            </button>

            <button
              onClick={() => navigate("/ai-practice")}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:scale-105 text-white px-5 py-3 rounded-full shadow-lg transition-all"
            >
              <FaBullseye />
              <span>AI Practice</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 hover:scale-105 text-white px-5 py-3 rounded-full shadow-lg transition-all"
            >
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>

          {/* Heading */}
          <div className="text-center mb-12 pt-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-full mb-6 shadow-lg">
              <FaPlay className="text-white text-2xl ml-1" />
            </div>
            <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-purple-600 to-indigo-800">
              Quiz Arena
            </h1>
            <p className="text-xl text-gray-600 mt-2">
              Challenge yourself with programming quizzes
            </p>
          </div>

          {/* Quiz Cards */}
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {quizzes.map((quiz) => {
              const summary = wikiSummaries[quiz.id];
              return (
                <div
                  key={quiz.id}
                  className="group bg-white rounded-3xl shadow-lg hover:scale-105 transition-all"
                >
                  <div className="bg-indigo-600 p-6 text-white">
                    {summary?.image ? (
                      <img
                        src={summary.image}
                        className="w-16 h-16 rounded-full mb-2"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
                        <FaPlay />
                      </div>
                    )}
                    <h3 className="text-xl font-bold">{quiz.title}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                      {summary?.extract}
                    </p>
                    <button
                      onClick={() => navigate(`/quiz/${quiz.id}/instructions`)}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg hover:scale-105 transition-all"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Sticky Navbar (Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t shadow-lg flex justify-around py-2 z-50">
          {role === "ROLE_ADMIN" && (
            <button
              onClick={handleAdminClick}
              className="flex flex-col items-center text-sm text-amber-600"
            >
              <FaTools className="text-xl" />
              Admin
            </button>
          )}
          <button
            onClick={toggleResults}
            className="flex flex-col items-center text-sm text-green-600"
          >
            <FaChartBar className="text-xl" />
            Results
          </button>
          <button
            onClick={() => navigate("/ai-analytics")}
            className="flex flex-col items-center text-sm text-purple-600"
          >
            <FaBrain className="text-xl" />
            Analytics
          </button>
          <button
            onClick={() => navigate("/ai-practice")}
            className="flex flex-col items-center text-sm text-orange-600"
          >
            <FaBullseye className="text-xl" />
            Practice
          </button>
          <button
            onClick={handleLogout}
            className="flex flex-col items-center text-sm text-red-600"
          >
            <FaSignOutAlt className="text-xl" />
            Logout
          </button>
        </div>
      </div>

      {/* Results Panel */}
      <CSSTransition
        in={showResults}
        timeout={300}
        classNames="slide"
        unmountOnExit
        nodeRef={resultPanelRef}
      >
        <div
          ref={resultPanelRef}
          className="fixed top-0 right-0 w-full sm:w-[500px] h-full bg-white z-50 shadow-lg overflow-y-auto transition-transform"
        >
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">My Results</h2>
            <button
              onClick={toggleResults}
              className="text-red-500 font-semibold hover:underline"
            >
              Close
            </button>
          </div>

          <div className="p-6">
            <input
              type="text"
              placeholder="Filter by quiz title..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-lg shadow-sm"
            />

            {filteredResults.length > 0 && (
              <div className="mb-4">
                <CSVLink
                  data={filteredResults}
                  filename={"quiz_results.csv"}
                  className="text-sm text-white bg-green-600 px-4 py-2 rounded shadow hover:bg-green-700 inline-flex items-center gap-2"
                >
                  <FaDownload />
                  Download CSV
                </CSVLink>
              </div>
            )}

            <div className="h-[300px] mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredResults}>
                  <XAxis dataKey="quizTitle" />
                  <YAxis />
                  <Tooltip />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#6366f1"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {filteredResults.length === 0 ? (
              <p className="text-gray-500">No results found.</p>
            ) : (
              filteredResults.map((res, i) => (
                <div
                  key={i}
                  className="bg-indigo-50 p-4 rounded-lg shadow mb-4"
                >
                  <h3 className="text-lg font-semibold text-indigo-800">
                    {res.quizTitle}
                  </h3>
                  <p className="text-sm text-gray-600">Score: {res.score}</p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(res.timestamp).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </CSSTransition>
    </>
  );
};

export default QuizList;
