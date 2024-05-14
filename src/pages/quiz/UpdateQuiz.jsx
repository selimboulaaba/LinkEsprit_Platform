import React, { useEffect, useState } from "react";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import { useParams } from "react-router";
import { getQuizById, updateQuiz } from "../../services/quiz";

function UpdateQuiz() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await getQuizById(id);
      setQuiz(response);
    };

    fetchQuiz();
  }, [id]);

  const handleQuizChange = (idx, field, value) => {
    const newQuiz = { ...quiz };
    if (field.startsWith("answers[")) {
      const answerIdx = parseInt(field.split("[")[1].split("]")[0], 10);
      newQuiz.quiz[idx].answers[answerIdx] = value;
      if (
        newQuiz.quiz[idx].correctAnswer === answerIdx &&
        value.trim() === ""
      ) {
        newQuiz.quiz[idx].correctAnswer = -1;
      }
    } else {
      newQuiz.quiz[idx][field] = value;
    }
    setQuiz(newQuiz);
  };

  const handleAnswerChange = (idxQ, idxA, checked) => {
    const newQuiz = { ...quiz };
    newQuiz.quiz[idxQ].correctAnswer = checked
      ? idxA
      : newQuiz.quiz[idxQ].correctAnswer;
    setQuiz(newQuiz);
  };

  const deleteQuestion = (idx) => {
    const newQuiz = { ...quiz };
    newQuiz.quiz.splice(idx, 1);
    setQuiz(newQuiz);
    if (currentQuestionIndex >= idx) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const addAnswer = (idx) => {
    const newQuiz = { ...quiz };
    newQuiz.quiz[idx].answers.push("");
    setQuiz(newQuiz);
  };

  const submit = () => {
    const filteredQuiz = quiz.quiz.filter((q) => q.question.trim());
    if (filteredQuiz.length < 1) {
      setErrorMessage("Please add at least one question before submitting.");
    } else {
      updateQuiz(id, { ...quiz, quiz: filteredQuiz });
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
    const currentQuestion = quiz.quiz[currentQuestionIndex];
    if (
      currentQuestion.question.trim() &&
      currentQuestion.answers.some((answer) => answer.trim())
    ) {
      const nextIndex = currentQuestionIndex + 1;
      if (nextIndex < quiz.quiz.length) {
        setCurrentQuestionIndex(nextIndex);
      } else {
        setErrorMessage("You have reached the end of the quiz.");
      }
    } else {
      setErrorMessage(
        "Please fill out the question and at least one answer before moving on."
      );
    }
  };

  if (!quiz.quiz) {
    return <div>Loading...</div>;
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <div className="p-10">
        <div className="mb-6">
          <span className="text-lg font-medium">
            Question {currentQuestionIndex + 1} of {quiz.quiz.length}
          </span>
          {errorMessage && (
            <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
          <label
            htmlFor="title"
            className="block text-gray-700 font-medium mb-2 text-sm"
          >
            name
          </label>
          <input
            id="title"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 text-sm py-1"
            value={quiz.name}
            onChange={(e) => setQuiz({ ...quiz, name: e.target.value })}
            placeholder="Title"
          />

          <label
            htmlFor="description"
            className="block text-gray-700 font-medium mb-2 text-sm"
          >
            Topic
          </label>
          <input
            id="description"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 text-sm py-1"
            value={quiz.category}
            onChange={(e) => setQuiz({ ...quiz, category: e.target.value })}
            placeholder="Description"
          />

          <div className="flex justify-between mt-6">
            <div className="flex-1">
              {quiz.quiz.map((q, idxQ) => (
                <div
                  key={idxQ}
                  className={`space-y-4 ${
                    idxQ !== currentQuestionIndex ? "hidden" : ""
                  }`}
                >
                  <div className="bg-white p-6 rounded-lg shadow-md border border-gray-300">
                    <label
                      htmlFor={`question-${idxQ}`}
                      className="block text-gray-700 font-medium mb-2 text-sm"
                    >
                      Question
                    </label>
                    <input
                      id={`question-${idxQ}`}
                      className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 text-sm py-1"
                      value={q.question}
                      onChange={(e) =>
                        handleQuizChange(idxQ, "question", e.target.value)
                      }
                      placeholder="Question"
                    />

                    {q.answers.map((a, idxA) => (
                      <div key={idxA} className="flex items-center space-x-4">
                        <input
                          type="radio"
                          id={`answer-${idxQ}-${idxA}`}
                          name={`question-${idxQ}`}
                          checked={q.correctAnswer === idxA}
                          onChange={(e) =>
                            handleAnswerChange(idxQ, idxA, e.target.checked)
                          }
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <label
                            htmlFor={`answer-${idxQ}-${idxA}`}
                            className="block text-gray-700 font-medium mb-2 text-sm"
                          >
                            Answer
                          </label>
                          <input
                            id={`answer-${idxQ}-${idxA}`}
                            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 text-sm py-1"
                            value={a}
                            onChange={(e) =>
                              handleQuizChange(
                                idxQ,
                                `answers[${idxA}]`,
                                e.target.value
                              )
                            }
                            placeholder="Answer"
                          />
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-between mt-4">
                      <button
                        type="button"
                        onClick={() => addAnswer(idxQ)}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        Add Answer
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteQuestion(idxQ)}
                        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        Delete Question
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={prevQuestion}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      disabled={currentQuestionIndex === 0}
                    >
                      Previous Question
                    </button>

                    <button
                      type="button"
                      onClick={nextQuestion}
                      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      disabled={
                        !q.question.trim() ||
                        !q.answers.some((answer) => answer.trim())
                      }
                    >
                      Next Question
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={() => submit()}
              type="submit"
              className="mt-6 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
            >
              Update Quiz
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </DashboardLayout>
  );
}

export default UpdateQuiz;
