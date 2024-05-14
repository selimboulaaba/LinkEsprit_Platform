import React, { useState, useEffect } from 'react';
import { getQuizById } from '../../services/quiz';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar';
import Footer from '../../examples/Footer';
import { useParams } from 'react-router-dom';
import MDButton from '../../components/MDButton';
import { createTest } from '../../services/test';
import { updateApplication } from '../../services/application';
import { useAuth } from '../../context/userContext';
import { async } from 'regenerator-runtime';
import { Box, Button, Card, CardContent, Grid } from '@mui/material';
import { VscDebugStart } from "react-icons/vsc";

function Test() {


  const { user } = useAuth();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [testStarted, setTestStarted] = useState(false);

  const params = useParams();

  // Function to parse query parameters




  useEffect(() => {
    const fetchQuiz = async () => {
      const response = await getQuizById(params.id);

      setQuiz(response);
    };

    fetchQuiz();
  }, []);

  useEffect(() => {
    let timerId;

    if (timeLeft > 0 && testStarted) {
      timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && testStarted) {
      nextQuestion();
    }

    return () => clearTimeout(timerId);
  }, [timeLeft, testStarted]);

  const handleAnswerClick = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const nextQuestion = async () => {
    let final = score
    if (selectedAnswer !== null && selectedAnswer === quiz.quiz[currentQuestionIndex].correctAnswer) {
      setScore(prev => prev + 1);
      final = final + 1
    }

    setSelectedAnswer(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setTimeLeft(10);

    if (currentQuestionIndex === quiz.quiz.length - 1) {
      const response = await createTest({ userId: user._id, quiz: quiz._id, score: final });
      console.log(response);

      updateApplication(params.res, { testId: response._id });
      console.log('Score:', score);
      console.log(quiz) // Log the score to the console once at the end of the test
    }
  };

  const startTest = () => {
    setTestStarted(true);
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  if (currentQuestionIndex >= quiz.quiz.length) {
    return (
      <DashboardLayout>
  <DashboardNavbar />
  <div className="flex justify-center items-center mt-6">
    <Grid item xs={12} sm={6} md={4}>
      <Card className="p-4 rounded-lg shadow-md md:w-[43rem]">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-5 ">Quiz complete!</h1>
          <p className="text-2xl mb-5">Your score is {score} out of {quiz.quiz.length}.</p>
          <button
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={() => window.location.href = '/feed'}
          >
            Go Home
          </button>
        </div>
      </Card>
    </Grid>
  </div>
  <Footer />
</DashboardLayout>


    );
  }

  if (!testStarted) {
    return (
      <DashboardLayout>
  <DashboardNavbar />
  <div className="flex justify-center items-center  mt-6">
    <Grid item xs={12} sm={6} md={4}>
    <Card className="p-4 rounded-lg shadow-md md:w-[43rem]">
      <CardContent>
        <h1 className="text-2xl font-bold mb-2">Instructions</h1>
        <p>This quiz consists of {quiz.quiz.length} questions.</p>
        <p>You will have 5 seconds to answer each question.</p>
        <p>If you quit the test, your score will be 0.</p>
      </CardContent>
      <Box display="flex" justifyContent="center" mt={2}>
      <button onClick={()=>startTest()} className="flex items-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
    <VscDebugStart />
    <span className="ml-2">Start Test</span>
  </button>
      </Box>
    </Card>
  </Grid>
  </div>
  <Footer />
</DashboardLayout>


    );
  }

  const currentQuestion = quiz.quiz[currentQuestionIndex];

  return (
    <DashboardLayout>
  <DashboardNavbar />
  <div className="flex justify-center items-center  mt-6">
  <Grid item xs={12} sm={6} md={4}>
    <Card className="p-10 m-10 rounded-lg shadow-md md:w-[43rem]">
        
          <div>
          <div className="flex justify-between items-center mb-4">
  <div className="text-xl font-medium text-black">Question {currentQuestionIndex + 1} of {quiz.quiz.length}</div>
  <div className="text-lg font-bold">Time left: {timeLeft}</div>
</div>

            <h1 className="text-2xl font-bold mb-2">{currentQuestion.question}</h1>
            
            <div className="flex flex-col space-y-2">
              {currentQuestion.answers.map((answer, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={timeLeft === 0}
                  className={`px-4 py-2 rounded-lg ${selectedAnswer === index
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                >
                  {answer}
                </button>
              ))}
            </div>
            {selectedAnswer !== null && timeLeft > 0 && (
              <div className="mt-4">
                <p className="text-lg font-bold">
                  You selected answer {selectedAnswer + 1}.
                </p>
              </div>

            )}
            <div className="mt-4">
              <p className="text-lg">Time left: {timeLeft}</p>
            </div>
            {timeLeft === 0 && (
              <div className="mt-4">
                <p className="text-lg font-bold">
                  Time's up! The correct answer was {quiz.quiz[currentQuestionIndex].correctAnswer + 1}.
                </p>
              </div>
            )}
          </div>
        
       
        </Card>
  </Grid>
  </div>
  <Footer />
</DashboardLayout>

  );
}

export default Test;
