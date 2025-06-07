// src/pages/AdminResultPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AdminResultPage() {
  const { quizId, userId } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUserId, setSearchUserId] = useState("");
  const [sortField, setSortField] = useState("submittedAt");
  const [sortDirection, setSortDirection] = useState("desc");

  useEffect(() => {
    setLoading(true);

    if (quizId) {
      axios
        .get(`/api/results/quiz/${quizId}`)
        .then((res) => setResults(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else if (userId) {
      axios
        .get(`/api/results/user/${userId}`)
        .then((res) => setResults(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [quizId, userId]);

  const handleSearch = () => {
    if (!searchUserId) return;
    setLoading(true);
    axios
      .get(`/api/results/user/${searchUserId}`)
      .then((res) => setResults(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const clearSearch = () => {
    setSearchUserId("");
    setLoading(true);
    if (quizId) {
      axios
        .get(`/api/results/quiz/${quizId}`)
        .then((res) => setResults(res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setResults([]);
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    if (sortField === "submittedAt") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    return sortDirection === "asc"
      ? aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      : aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
  });

  const getScoreBadge = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin h-16 w-16 border-t-4 border-b-4 border-cyan-400 rounded-full mb-4"></div>
          <p className="text-white text-xl font-semibold">Loading results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Background Glow Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            📊 Quiz Results Dashboard
          </h1>
          <div className="flex items-center justify-center space-x-4 text-white/80">
            {quizId && (
              <span className="flex items-center bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                <span className="font-semibold">Quiz ID:</span> {quizId}
              </span>
            )}
            {userId && (
              <span className="flex items-center bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                <span className="font-semibold">User ID:</span> {userId}
              </span>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="bg-white/10 p-6 rounded-3xl border border-white/20 shadow-lg backdrop-blur-xl mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="number"
              placeholder="Search results by User ID..."
              value={searchUserId}
              onChange={(e) => setSearchUserId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <div className="flex gap-3">
              <button
                onClick={handleSearch}
                disabled={!searchUserId}
                className={`px-6 py-3 rounded-xl font-semibold transition ${
                  searchUserId
                    ? "bg-cyan-600 hover:bg-cyan-700 text-white"
                    : "bg-gray-600 text-gray-300 cursor-not-allowed"
                }`}
              >
                🔍 Search
              </button>
              {searchUserId && (
                <button
                  onClick={clearSearch}
                  className="px-6 py-3 rounded-xl bg-white/20 text-white hover:bg-white/30"
                >
                  ❌ Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Table */}
        {results.length === 0 ? (
          <p className="text-white text-center text-xl">No results found.</p>
        ) : (
          <div className="overflow-x-auto bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-lg">
            <table className="w-full table-auto text-white text-sm sm:text-base">
              <thead className="bg-white/20">
                <tr>
                  <th className="p-4 cursor-pointer" onClick={() => handleSort("userId")}>User ID</th>
                  <th className="p-4 cursor-pointer" onClick={() => handleSort("quizId")}>Quiz ID</th>
                  <th className="p-4 cursor-pointer" onClick={() => handleSort("score")}>Score</th>
                  <th className="p-4 cursor-pointer" onClick={() => handleSort("submittedAt")}>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((result, idx) => (
                  <tr
                    key={idx}
                    className="even:bg-white/10 hover:bg-white/20 transition"
                  >
                    <td className="p-4 text-center">{result.userId}</td>
                    <td className="p-4 text-center">{result.quizId}</td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full font-medium text-sm ${getScoreBadge(result.score, result.totalQuestions)}`}>
                        {result.score}/{result.totalQuestions}
                      </span>
                    </td>
                    <td className="p-4 text-center">{new Date(result.submittedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}