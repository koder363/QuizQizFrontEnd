// src/pages/UserResultPage.jsx
import React, { useEffect, useState } from "react";
import axios from "../api/axios";

export default function UserResultPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/results/user/me")
      .then((res) => {
        setResults(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user results:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-600 animate-pulse">
          Loading your quiz results...
        </div>
      </div>
    );

  if (!results.length)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-gray-500">No quiz results found.</div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">
        Your Quiz Results
      </h2>

      {/* Desktop Table View */}
      <div className="hidden md:block">
        <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-indigo-100 text-indigo-700">
              <th className="border border-gray-300 p-3 text-left">Quiz ID</th>
              <th className="border border-gray-300 p-3 text-left">Score</th>
              <th className="border border-gray-300 p-3 text-left">Total Questions</th>
              <th className="border border-gray-300 p-3 text-left">Submitted At</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-3">{r.quizId}</td>
                <td className="border border-gray-300 p-3">{r.score}</td>
                <td className="border border-gray-300 p-3">{r.totalQuestions}</td>
                <td className="border border-gray-300 p-3">
                  {new Date(r.submittedAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden flex flex-col gap-4">
        {results.map((r) => (
          <div key={r.id} className="bg-white rounded-xl shadow p-4 border border-gray-200">
            <h3 className="text-indigo-600 font-semibold text-lg mb-2">
              Quiz ID: {r.quizId}
            </h3>
            <p className="text-gray-700">
              <strong>Score:</strong> {r.score}
            </p>
            <p className="text-gray-700">
              <strong>Total Questions:</strong> {r.totalQuestions}
            </p>
            <p className="text-gray-700">
              <strong>Submitted At:</strong>{" "}
              {new Date(r.submittedAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
