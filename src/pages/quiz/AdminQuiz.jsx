import React, { useEffect, useState } from "react";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { useAuth } from "../../context/userContext";
import { createQuiz } from "../../services/quiz";
import { useNavigate } from "react-router-dom";

function AdminQuiz() {
  const { user } = useAuth();
  const [createdBy, setCreatedBy] = useState(user._id);
  const [category, setCategory] = useState("");
  const [name, setName] = useState("");
  const [quiz, setQuiz] = useState([
    {
      question: "",
      answers: ["", ""],
      correctAnswer: -1,
    },
  ]);
  const navigate = useNavigate();
  useEffect(() => {
    setCreatedBy(user._id);
  }, [user]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const handleQuizChange = (idx, field, value) => {
    const newQuiz = [...quiz];
    if (field.startsWith("answers[")) {
      const answerIdx = parseInt(field.split("[")[1].split("]")[0], 10);
      newQuiz[idx].answers[answerIdx] = value;
      if (newQuiz[idx].correctAnswer === answerIdx && value.trim() === "") {
        newQuiz[idx].correctAnswer = -1;
      }
    } else {
      newQuiz[idx][field] = value;
    }
    setQuiz(newQuiz);
  };

  const handleAnswerChange = (idxQ, idxA, checked) => {
    const newQuiz = [...quiz];
    newQuiz[idxQ].correctAnswer = checked ? idxA : newQuiz[idxQ].correctAnswer;
    setQuiz(newQuiz);
  };

  const addQuestion = () => {
    setQuiz([...quiz, { question: "", answers: ["", ""], correctAnswer: -1 }]);
  };

  const addAnswer = (idx) => {
    const newQuiz = [...quiz];
    if (newQuiz[idx].question.trim()) {
      newQuiz[idx].answers.push("");
      setQuiz(newQuiz);
    } else {
      setErrorMessage("Please enter a question before adding answers.");
    }
  };

  const submit = () => {
    const filteredQuiz = quiz.filter((q) => q.question.trim());
    if (filteredQuiz.length < 1) {
      setErrorMessage("Please add at least one question before submitting.");
    } else {
      console.log({ createdBy, category, filteredQuiz });
      createQuiz({ createdBy, name, category, quiz: filteredQuiz });
      navigate('/allquizes')
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    } else {
      setErrorMessage("Cannot go back before the first question.");
    }
  };

  const nextQuestion = () => {
    const currentQuestion = quiz[currentQuestionIndex];
    if (currentQuestion.question.trim() && currentQuestion.answers.some((answer) => answer.trim())) {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < quiz.length) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        addQuestion();
        setCurrentQuestionIndex(nextIndex);
      }
    } else {
      setErrorMessage("Please fill out the question and at least one answer before moving on.");
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-10">
        <div className="mb-6">
          <span className="text-lg font-medium">Question {currentQuestionIndex + 1} of {quiz.length}</span>
          {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2 text-sm">
            Name
          </label>
          <input
            id="name"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />

          <label htmlFor="category" className="block text-gray-700 font-medium mb-2 text-sm">
            Category
          </label>
          <input
            id="category"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 text-sm"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
          />

          <div className="mt-6">
            {quiz.map((q, idxQ) => (
              <div key={idxQ} className={`space-y-4 ${idxQ !== currentQuestionIndex ? "hidden" : ""}`}>
                <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
                  <label htmlFor={`question-${idxQ}`} className="block text-gray-700 font-medium mb-2 text-sm">
                    Question
                  </label>
                  <input
                    id={`question-${idxQ}`}
                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                    value={q.question}
                    onChange={(e) => handleQuizChange(idxQ, "question", e.target.value)}
                    placeholder="Question"
                  />

                  {q.answers.map((a, idxA) => (
                    <div key={idxA} className="flex items-center space-x-4">
                      <input
                        type="radio"
                        id={`answer-${idxQ}-${idxA}`}
                        name={`question-${idxQ}`}
                        checked={q.correctAnswer === idxA}
                        onChange={(e) => handleAnswerChange(idxQ, idxA, e.target.checked)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <label htmlFor={`answer-${idxQ}-${idxA}`} className="block text-gray-700 font-medium mb-2 text-sm">
                          Answer
                        </label>
                        <input
                          id={`answer-${idxQ}-${idxA}`}
                          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 text-sm"
                          value={a}
                          onChange={(e) => handleQuizChange(idxQ, `answers[${idxA}]`, e.target.value)}
                          placeholder="Answer"
                        />
                      </div>
                    </div>
                  ))}

                  {q.question && (
                    <button
                      type="button"
                      onClick={() => addAnswer(idxQ)}
                      className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-xs"
                    >
                      Add Answer
                    </button>
                  )}
                </div>

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevQuestion}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-xs"
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous Question
                  </button>

                  <button
                    type="button"
                    onClick={nextQuestion}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center text-xs"
                    disabled={!q.question.trim() || !q.answers.some((answer) => answer.trim())}
                  >
                    Next Question
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-6">
          <button
            onClick={() => submit()}
            type="submit"
            className="mt-6 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Submit
          </button>
          </div>
        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default AdminQuiz;
