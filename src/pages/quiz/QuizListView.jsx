import React, { useState, useEffect } from 'react';
import { getQuiz } from '../../services/quiz';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar';
import Footer from '../../examples/Footer';
import { useAuth } from '../../context/userContext';
import { Link, useNavigate } from "react-router-dom";
import { generateQuiz } from "../../services/quiz";
import { Button, Card, CardActions, CardContent, CircularProgress, Grid, TextField, Typography } from '@mui/material';
import MDButton from '../../components/MDButton';
import MDBox from '../../components/MDBox';
import MDTypography from '../../components/MDTypography';
import MDAvatar from '../../components/MDAvatar';
import { IoIosAddCircleOutline } from "react-icons/io";
import anim from "../../assets/images/Animation.gif";



function QuizListView() {
  const { user } = useAuth();

  const [quizzes, setQuizzes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [genQuiz, setGenQuiz] = useState({
    createdBy: "",
    numberOfQuestions: "",
    topic: "",
    difficulty: "",
    name: ""
  });
  useEffect(() => {

    setGenQuiz({ ...genQuiz, createdBy: user._id });
  }, [user]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      const response = await getQuiz();
      console.log(response.quiz);

      setQuizzes(response.quiz);
    };

    fetchQuizzes();

  }, []);




  const handleInputChange = (e, field) => {
    const value = e.target.value;

    setGenQuiz({ ...genQuiz, [field]: value });

  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading state to true

    await generateQuiz(genQuiz);

    setIsLoading(false);
    // Set loading state to false
    setShowForm(false);
    setTimeout(() => {
      window.location.reload();
    }, 100);

  };
  const formatDate = (date) => {
    const commentDate = new Date(date);
    const hours = commentDate.getHours().toString().padStart(2, '0');
    const minutes = commentDate.getMinutes().toString().padStart(2, '0');
    const day = commentDate.getDate().toString().padStart(2, '0');
    const month = (commentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = commentDate.getFullYear();

    return `${day}/${month}/${year}`;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {
        isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
            <CircularProgress />
          </div>
        ) : (
          // Your quiz generation form or results

          <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">Quizzes</h1>
              <Link to="/myquiz">
                <button className="flex items-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
                  <IoIosAddCircleOutline />
                  <span className="ml-2">Create Quiz</span>
                </button>
              </Link>
            </div>
            <Grid container spacing={2}>
              {quizzes.map((quiz) => (
                <Grid item xs={12} sm={6} md={4} key={quiz._id}>
                  <Card key={quiz._id} className="p-4 rounded-lg shadow-md">
                    <CardContent>
                      <MDBox className="flex items-center">
                        <Link className="flex items-center" to={`/profile/${quiz.createdBy._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                          <MDAvatar className="ml-2 mr-2" src={quiz.createdBy.image} alt="profile-image" size="md" shadow="sm" />
                        </Link>
                        <span className="text-sm text-gray-500 ml-auto">{formatDate(quiz.createdAt)}</span>
                      </MDBox>
                      <MDTypography variant="h5" mt={2} ml={1} component="h2" textTransform="capitalize" fontWeight="regular">
                        {quiz.category}
                      </MDTypography>
                      <Typography variant="h5" my={2} component="h2">
                        <div className="text-3xl">{quiz.name}</div>
                      </Typography>
                      <Typography variant="h6" component="h3">
                        <div className="text-xl">Number of Questions: {quiz.quiz.length}</div>
                      </Typography>
                    </CardContent>
                    <Link to={`/updatequiz/${quiz._id}`}>
                      <MDButton variant="gradient" color="light" className="w-[100%]" style={{ marginTop: '1em' }}>
                        Update Quiz
                      </MDButton>
                    </Link>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <div className="mt-8">
              <button onClick={() => setShowForm(true)} className=" px-4 py-2 flex items-center bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded">

                <span className="ml-2">Generate Random Quiz</span>
              </button>

              {showForm && (
                <Card className="mt-4">
                  <CardContent>
                    <form onSubmit={handleFormSubmit}>
                      <div className="mb-4">
                        <TextField
                          label="Number of Questions"
                          type="number"
                          name="numberOfQuestions"
                          value={genQuiz.numberOfQuestions}
                          onChange={(event) => handleInputChange(event, 'numberOfQuestions')}
                          fullWidth
                          margin="normal"
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label="Topic"
                          type="text"
                          name="topic"
                          value={genQuiz.topic}
                          onChange={(event) => handleInputChange(event, 'topic')}
                          fullWidth
                          margin="normal"
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label="Difficulty"
                          type="text"
                          name="difficulty"
                          value={genQuiz.difficulty}
                          onChange={(event) => handleInputChange(event, 'difficulty')}
                          fullWidth
                          margin="normal"
                        />
                      </div>
                      <div className="mb-4">
                        <TextField
                          label="Name"
                          type="text"
                          name="name"
                          value={genQuiz.name}
                          onChange={(event) => handleInputChange(event, 'name')}
                          fullWidth
                          margin="normal"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Done
                      </button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      <Footer />
    </DashboardLayout>
  );
}

export default QuizListView;
