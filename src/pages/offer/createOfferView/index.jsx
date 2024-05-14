// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/userContext";
import { useNavigate } from "react-router-dom";
import { getSectors } from "../../../services/sector";
import { addOffer } from "../../../services/offer.service";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import MDBox from "../../../components/MDBox";
import { Autocomplete, Card, Grid, TextField, FormControlLabel, Switch, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import MDInput from "../../../components/MDInput";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import MDButton from "../../../components/MDButton";
import Footer from "../../../examples/Footer";
import { ToastContainer } from "react-toastify";
import { Typography } from "@mui/material";
import CreatableSelect from 'react-select/creatable';
import { getSkills } from "../../../services/user";
import { getQuiz } from '../../../services/quiz';
import useSocketIo from "../../../hooks/useSocketIo";

function Index() {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState([]);
  const { socket } = useSocketIo();

  useEffect(() => {
    const fetchQuizzes = async () => {
      const response = await getQuiz();
      console.log(response.quiz);

      setQuizzes(response.quiz);
    };

    fetchQuizzes();
  }, []);

  const navigate = useNavigate();
  const [offer, setOffer] = useState({
    publication: {
      title: "",
      description: "",
      userId: "",
    },
    companyName: user.role === "ENTREPRISE" ? user.enterpriseName : "",
    type: "",
    sector: "",
    startTime: null,
    endTime: null,
    skills: [],
    quizId: null,
  });
  const [skills, setSkills] = useState([]);
  const [ownedSkills, setOwnedSkills] = useState([])

  const handleOfferChange = (event, field) => {
    const { value } = event.target;
    if (!addQuizId) {
      offer.quizId = null;
    }
    if (field.split(".").length > 1) {
      setOffer({
        ...offer,
        publication: {
          ...offer.publication,
          [field.split(".")[1]]: value,
        },
      });
    } else {
      setOffer({
        ...offer,
        [field]: value,
      });
    }
  };

  const [sectors, setSectors] = useState([]);

  const fetchSectors = () => {
    getSectors()
      .then((response) => {
        setSectors(response.data.sectors);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchSkills = async () => {
    const allSkills = await getSkills();
    setSkills(listStringToObject(allSkills));
  }

  useEffect(() => {
    fetchSectors();
    fetchSkills();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [addQuizId, setAddQuizId] = useState(false);

  const isAnyFieldEmpty = () => {
    return (
      Object.values(offer).some((value) => value === "") ||
      (offer.startTime &&
        offer.endTime &&
        offer.startTime > offer.endTime)
    );
  };

  const save = () => {
    offer.publication.userId = user._id;
    addOffer(offer)
      .then((response) => {
        if (response.status === 200) {
          const offer = response.data
          socket.emit('createOffer', {offerId: offer._id, userId: user._id});
          navigate("/myOffers");
          
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const listStringToObject = (listOfString) => {
    const listOfObjects = [];
    listOfString.map(skill => {
      listOfObjects.push({
        value: skill,
        label: skill
      })
    })
    return (listOfObjects)
  }

  const listObjectToString = (listOfObjects) => {
    const listOfString = [];
    listOfObjects.map(skill => {
      listOfString.push(skill.value)
    })
    return (listOfString)
  }

  const refreshSkills = async (selectedOption) => {
    const list = listObjectToString(selectedOption)
    setOwnedSkills(selectedOption)
    setOffer({
      ...offer,
      skills: list,
    });
  }
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card className="mx-auto">
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <MDBox mb={2} className="w-[70%] m-auto">
                    <MDInput
                      type="text"
                      label="Title"
                      fullWidth
                      name="title"
                      value={offer.publication.title}
                      onChange={(event) =>
                        handleOfferChange(event, "publication.title")
                      }
                    />
                  </MDBox>
                  <MDBox mb={2} className="w-[70%] m-auto">
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={["Job", "Intership"]}
                      onChange={(event, newValue) => {
                        handleOfferChange(
                          { target: { value: newValue } },
                          "type"
                        );
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Type" />
                      )}
                    />
                  </MDBox>
                  {user.role != "ENTREPRISE" && <MDBox mb={2} className="w-[70%] m-auto">
                    <MDInput
                      type="text"
                      label="Company"
                      fullWidth
                      name="companyName"
                      value={offer.companyName}
                      onChange={(event) =>
                        handleOfferChange(event, "companyName")
                      }
                    />
                  </MDBox>}
                  <MDBox mb={2} className="w-[70%] m-auto">
                    <Autocomplete
                      disablePortal
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      id="combo-box-demo-sector"
                      options={sectors.map((sector) => {
                        return { label: sector.name, id: sector._id };
                      })}
                      onChange={(event, newValue) => {
                        handleOfferChange(
                          { target: { value: newValue.id } },
                          "sector"
                        );
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Sector" />
                      )}
                    />
                  </MDBox>
                  <MDBox mb={2} className="w-[70%] m-auto">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <Grid container spacing={4}>
                        <Grid item xs={6}>
                          <DesktopDatePicker
                            className="w-[100%]"
                            label="Start Time"
                            format="DD-MM-YYYY"
                            onChange={(newValue) =>
                              handleOfferChange(
                                { target: { value: newValue } },
                                "startTime"
                              )
                            }
                            renderInput={(params) => <TextField {...params} />}
                          />
                        </Grid>
                        <Grid item xs={6}>
                          <DesktopDatePicker
                            className="w-[100%]"
                            label="End Time"
                            format="DD-MM-YYYY"
                            onChange={(newValue) =>
                              handleOfferChange(
                                { target: { value: newValue } },
                                "endTime"
                              )
                            }
                            renderInput={(params) => <TextField {...params} />}
                          />
                          {offer.startTime &&
                            offer.endTime &&
                            offer.startTime > offer.endTime && (
                              <Typography color="error">
                                End Time must be after Start Time
                              </Typography>
                            )}
                        </Grid>
                      </Grid>
                    </LocalizationProvider>
                  </MDBox>
                  <MDBox mb={2} className="w-[70%] m-auto">
                    <MDInput
                      type="text"
                      label="Description"
                      fullWidth
                      multiline
                      rows={4}
                      name="description"
                      value={offer.publication.description}
                      onChange={(event) =>
                        handleOfferChange(event, "publication.description")
                      }
                    />
                  </MDBox>
                  <MDBox  className="w-[70%] m-auto">
                    <CreatableSelect
                      isClearable={false}
                      closeMenuOnSelect={false}
                      placeholder="Add Skills"
                      isMulti
                      options={skills}
                      value={ownedSkills}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      onChange={(selectedOption) => refreshSkills(selectedOption)}
                    />
                  </MDBox>
                  <MDBox mb={2} className="w-[70%] mt-3 m-auto">
                  <label className="inline-flex items-center me-5 cursor-pointer">
      <input
        type="checkbox"
        value=""
        className="sr-only peer"
        checked={addQuizId}
        onChange={(event) => setAddQuizId(event.target.checked)}
      />
      <div className={`relative w-9 h-5 bg-white-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 dark:bg-white-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-white-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-white-600 ${
          addQuizId ? 'peer-checked:bg-red-600' : 'peer-checked:bg-white-300'
        }`}
      ></div>
      <span className="ms-2 text-m font-medium text-white-900 dark:text-white-300">Add Quiz</span>
    </label>
                  </MDBox>
                  {addQuizId && (
                    <MDBox mb={2} className="w-[50%] m-auto ">
                      <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Quiz</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={offer.quizId}
    label="Quiz"
    onChange={(event) => handleOfferChange(event, "quizId")}
    sx={{
      height: 40, // adjust the height as needed
       // adjust the font size as needed
    }}
  >
    {quizzes.map((quiz) => (
      <MenuItem key={quiz._id} value={quiz._id}>
        {quiz.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
                    </MDBox>
                  )}
                  <MDBox mt={4} mb={1} className="w-[20%] mx-auto">
                    <MDButton
                      variant="gradient"
                      color="error"
                      fullWidth
                      onClick={save}
                      disabled={isAnyFieldEmpty()}
                    >
                      Add Offer
                    </MDButton>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
      <ToastContainer />
    </DashboardLayout>
  );
}

export default Index;
