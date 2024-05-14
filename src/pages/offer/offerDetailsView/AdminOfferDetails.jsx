/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import MDBox from "../../../components/MDBox";
import axios from "axios";
import { Autocomplete, Card, Grid, TextField, Typography } from "@mui/material";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
import { endOfferById, updateOffer } from "../../../services/offer.service";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAuth } from "../../../context/userContext";
import { useEffect } from "react";
import { getSectors } from "../../../services/sector";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {
  getApplicationsByOffer,
  replyToApplication,
} from "../../../services/application";
import { Document, Page, pdfjs } from "react-pdf";
import CreatableSelect from 'react-select/creatable';
import { getSkills } from "../../../services/user";

import { FaStar } from 'react-icons/fa';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

function AdminOfferDetails({ offer, setOffer }) {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [pdf, setPdf] = useState({
    active: false,
    url: "",
    id: "",
  });
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [acceptedApplication, setAcceptedApplication] = useState(false)
  const [interviewedApplication, setInterviewedApplication] = useState(false)
  const [refusedApplication, setRefusedApplication] = useState(false)
  const [waitingApplication, setWaitingApplication] = useState(false)
  const [showAccepted, setShowAccepted] = useState(false)
  const [showInterviewed, setshowInterviewed] = useState(false);
  const [showRejected, setShowRejected] = useState(false);
  const [showWaiting, setShowWaiting] = useState(false)
  const [skills, setSkills] = useState([]);
  const [ownedSkills, setOwnedSkills] = useState([])
  const [applicationLength, setApplicationLength] = useState({
    accepted: 0,
    interviewed: 0,
    rejected: 0,
    waiting: 0
  })

  const handleOfferChange = (event, field) => {
    const { value } = event.target;
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
    fetchSkills();
    setOwnedSkills(listStringToObject(offer.skills))
    fetchSectors();
    if (offer._id) {
      getApplicationsByOffer(offer._id)
        .then((response) => {
          setApplications(response);
          console.log(response)
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [user]);

  const isAnyFieldEmpty = () => {
    return Object.values(offer).some((value) => value === "");
  };

  const save = () => {
    offer.sector = offer.sector.id;
    updateOffer(offer)
      .then((response) => {
        toast.success("Offer Updated !", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "colored",
          transition: Bounce,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showCV = async (applicationId, pdfFile) => {
    if (!pdf.active || applicationId != pdf.id) {
      setPdf({
        url: "http://localhost:3000/CVs/" + pdfFile,
        active: true,
        id: applicationId,
      });
    } else {
      setPdf({
        url: "",
        active: false,
        id: "",
      });
    }
  };

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const reply = (applicationId, state) => {
    replyToApplication(applicationId, state)
      .then((response) => {
        const index = applications.findIndex(
          (app) => app._id === applicationId
        );
        const updatedApplications = [...applications];
        updatedApplications[index] = response;
        setApplications(updatedApplications);
        console.log(updatedApplications);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const createChatroom = (application) => {
    axios
      .post("http://localhost:3000/api/chatroom", {
        name:
          application.userId.firstName +
          " " +
          application.userId.lastName +
          " & " +
          offer.companyName,
        id: user._id,
        userId: application.userId._id,
      })
      .catch((err) => {
        // console.log(err);
        if (
          err &&
          err.response &&
          err.response.data &&
          err.response.data.message
        )
          makeToast("error", err.response.data.message);
      });
  };

  const handleButtonClick = (application) => {
    reply(application._id, "INTERVIEWED");
    // Call your second function here
    createChatroom(application);
  };

  const endOffer = async () => {
    try {
      const response = await endOfferById(offer._id, !offer.isEnded);
      setOffer({
        ...offer,
        isEnded: !offer.isEnded,
      });
    } catch (error) {
      console.error("Error ending offer:", error);
    }
  };
  const isRecommended = async (studentId) => {
    for (let index = 0; index < offer.recommendation.length; index++) {
      const recommendation = offer.recommendation[index];
      if (recommendation.student === studentId._id) {
        console.log(index);
        return index;
      }
    }
    return null;
  };

  useEffect(() => {
    setApplicationLength({
      accepted: 0,
      interviewed: 0,
      rejected: 0,
      waiting: 0
    });
    applications.map((application) => {
      if (application.state === "ACCEPTED") {
        setAcceptedApplication(true);
        setApplicationLength(prevState => ({
          ...prevState,
          accepted: prevState.accepted + 1
        }));
      }
      if (application.state === "INTERVIEWED") {
        setInterviewedApplication(true);
        setApplicationLength(prevState => ({
          ...prevState,
          interviewed: prevState.interviewed + 1
        }));
      }
      if (application.state === "REJECTED") {
        setRefusedApplication(true);
        setApplicationLength(prevState => ({
          ...prevState,
          rejected: prevState.rejected + 1
        }));
      }
      if (application.state === "WAITING") {
        setWaitingApplication(true)
        setApplicationLength(prevState => ({
          ...prevState,
          waiting: prevState.waiting + 1
        }));
      }

    })
  }, [applications])

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
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card className="mx-auto">
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form">
              <fieldset disabled={offer.isDeleted}>
                <MDBox mb={2} className="w-[70%] m-auto">
                  <MDInput
                    type="text"
                    label="Title"
                    fullWidth
                    name="title"
                    value={offer.publication?.title || ""}
                    onChange={(event) =>
                      handleOfferChange(event, "publication.title")
                    }
                  />
                </MDBox>
                <MDBox mb={2} className="w-[70%] m-auto">
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    value={offer.type || ""}
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
                {user.role != "ENTREPRISE" && (
                  <MDBox mb={2} className="w-[70%] m-auto">
                    <MDInput
                      type="text"
                      label="Company"
                      fullWidth
                      name="companyName"
                      value={offer.companyName || ""}
                      onChange={(event) =>
                        handleOfferChange(event, "companyName")
                      }
                    />
                  </MDBox>
                )}
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
                        {
                          target: {
                            value: { id: newValue?.id, name: newValue?.label },
                          },
                        },
                        "sector"
                      );
                    }}
                    value={offer.sector?.name || ""}
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
                          value={dayjs(offer.startTime)}
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
                          value={dayjs(offer.endTime)}
                          renderInput={(params) => <TextField {...params} />}
                        />
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
                    value={offer.publication?.description || ""}
                    onChange={(event) =>
                      handleOfferChange(event, "publication.description")
                    }
                  />
                </MDBox>
                <MDBox className="w-[70%] m-auto">
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
                {!offer.isDeleted && (offer.publication?.userId?._id === user?._id || ["ADMIN", "SUPERADMIN"].includes(user?.role))
                  ? <Grid container xs={12}>
                    <MDBox mt={4} mb={1} xs={6} className="w-[20%] mx-auto">
                      <MDButton
                        variant="gradient"
                        color="error"
                        fullWidth
                        onClick={save}
                        disabled={isAnyFieldEmpty()}
                      >
                        Save Offer
                      </MDButton>
                    </MDBox>
                    <MDBox mt={4} mb={1} xs={6} className="w-[20%] mx-auto">
                      <MDButton
                        variant="gradient"
                        color="dark"
                        fullWidth
                        onClick={endOffer}
                      >
                        {offer.isEnded ? "Start Offer" : "End Offer"}
                      </MDButton>
                    </MDBox>
                  </Grid>
                  : null}
              </fieldset>
            </MDBox>
          </MDBox>
        </Card>
      </Grid>
      {pdf.active &&
        <Grid item xs={12} justifyContent="center">
          <MDBox mb={2} className="w-fit m-auto">
            <Card>
              <p className="text-center">
                Page {pageNumber} of {numPages}
              </p>
              <Document file={pdf.url} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.apply(null, Array(numPages))
                  .map((x, i) => i + 1)
                  .map((page) => (
                    <Page
                      key={page}
                      pageNumber={page}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      width={Math.min(600, window.innerWidth)}
                    />
                  ))}
              </Document>
            </Card>
          </MDBox>
        </Grid>
      }
      <Grid item xs={12} className="text-center">
        <MDBox mt={4} mb={1} xs={12} className="w-[80%] mx-auto">
          <MDButton
            variant="gradient"
            color="success"
            fullWidth
            disabled={!acceptedApplication}
            onClick={() => setShowAccepted(!showAccepted)}
          >
            Accepted: {applicationLength.accepted}
          </MDButton>
        </MDBox>
      </Grid>
      {applications.map((application) => ((showAccepted) && (application.state === "ACCEPTED")) ? (
        <Grid item xs={4}>
          <Card className="mx-auto">
            <MDBox pt={4} pb={3} px={3}>
              <MDBox>
                <Typography className="text-black inline text-bold"> {application.userId.firstName} {application.userId.lastName}</Typography>
              </MDBox>
              <MDBox>
                <Typography className="text-black inline text-bold"> {application.userId.email}</Typography>
              </MDBox>
              <MDBox>
                <Typography className="text-black inline text-bold"> Compatibility: {application.compatibility ? (application.compatibility * 100).toFixed(2) : 0}%</Typography>
              </MDBox>
              {application.offerId.recommendation.map((object, idx) => {
                  if (object.student === application.userId._id) {
                    // Check if the student is recommended
                    const recommended = isRecommended(object.student);

                    return (
                      <div key={idx}>
                        <p className="text-black inline text-bold">Recommended By: {object.teacher.firstName} {object.teacher.lastName}</p>
                        {recommended !== null ? (
                          recommended ? (
                            <span>
                              <FaStar className="ml-1 text-yellow-500" />

                            </span>
                          ) : (
                            <span>
                              <FaStar className="ml-1 text-gray-400" />

                            </span>
                          )
                        ) : null}
                      </div>
                    );
                  }
                  return null;
                })}
                {application.testId != null ? <MDBox >
                  <Typography className="text-black inline text-bold">Quiz Score:  {((application.testId.score / application.testId.quiz.quiz.length)*100).toFixed(2)}%</Typography>
                </MDBox> : null}
              <MDBox>
                <MDButton
                  variant="gradient"
                  color="light"
                  size="small"
                  className="w-[100%]"
                  style={{ marginTop: '1em', textTransform: 'none' }}
                  onClick={() => showCV(application._id, application.pdfFile)}
                >
                  Show CV: {application.fileName}
                </MDButton>
              </MDBox>
              <MDBox>
                <MDButton
                  variant="gradient"
                  color="success"
                  size="small"
                  className="w-[100%]"
                  style={{ marginTop: '1em', textTransform: 'none' }}
                  disabled={true}
                >
                  {application.state}
                </MDButton>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      ) : null)}
      <Grid item xs={12} className="text-center">
        <MDBox mt={4} mb={1} xs={12} className="w-[80%] mx-auto">
          <MDButton
            variant="gradient"
            color="warning"
            fullWidth
            disabled={!interviewedApplication}
            onClick={() => setshowInterviewed(!showInterviewed)}
          >
            Interviewing {applicationLength.interviewed}
          </MDButton>
        </MDBox>
      </Grid>
      {applications.map((application) => showInterviewed && (application.state === "INTERVIEWED") ? (
        <Grid item xs={4}>
          <Card className="mx-auto">
            <MDBox pt={4} pb={3} px={3}>
              <MDBox>
                <Typography className="text-black inline text-bold"> {application.userId.firstName} {application.userId.lastName}</Typography>
              </MDBox>
              <MDBox>
                <Typography className="text-black inline text-bold"> {application.userId.email}</Typography>
              </MDBox>
              <MDBox>
                <Typography className="text-black inline text-bold"> Compatibility: {application.compatibility ? (application.compatibility * 100).toFixed(2) : 0}%</Typography>
              </MDBox>
              {application.offerId.recommendation.map((object, idx) => {
                  if (object.student === application.userId._id) {
                    // Check if the student is recommended
                    const recommended = isRecommended(object.student);

                    return (
                      <div key={idx}>
                        <p className="text-black inline text-bold">Recommended By: {object.teacher.firstName} {object.teacher.lastName}</p>
                        {recommended !== null ? (
                          recommended ? (
                            <span>
                              <FaStar className="ml-1 text-yellow-500" />

                            </span>
                          ) : (
                            <span>
                              <FaStar className="ml-1 text-gray-400" />

                            </span>
                          )
                        ) : null}
                      </div>
                    );
                  }
                  return null;
                })}
                {application.testId != null ? <MDBox >
                  <Typography className="text-black inline text-bold">Quiz Score:  {((application.testId.score / application.testId.quiz.quiz.length)*100).toFixed(2)}%</Typography>
                </MDBox> : null}
              <MDBox>
                <MDButton
                  variant="gradient"
                  color="light"
                  size="small"
                  className="w-[100%]"
                  style={{ marginTop: '1em', textTransform: 'none' }}
                  onClick={() => showCV(application._id, application.pdfFile)}
                >
                  Show CV: {application.fileName}
                </MDButton>
              </MDBox>
              <MDBox>
                <MDButton
                  variant="gradient"
                  color="warning"
                  size="small"
                  className="w-[100%]"
                  style={{ marginTop: '1em', textTransform: 'none' }}
                  disabled={true}
                >
                  {application.state}
                </MDButton>
              </MDBox>
              <Grid container>
                <Grid item className="w-[50%] px-[5%]">
                  <MDButton
                    variant="gradient"
                    color="success"
                    size="small"
                    className="w-[100%]"
                    style={{ marginTop: '1em', textTransform: 'none' }}
                    onClick={() => reply(application._id, "ACCEPTED")}
                  >
                    Accept
                  </MDButton>
                </Grid>
                <Grid item className="w-[50%] px-[5%]">
                  <MDButton
                    variant="gradient"
                    color="error"
                    size="small"
                    className="w-[100%]"
                    style={{ marginTop: '1em', textTransform: 'none' }}
                    onClick={() => reply(application._id, "REJECTED")}
                  >
                    Reject
                  </MDButton>
                </Grid>
              </Grid>
            </MDBox>
          </Card>
        </Grid>
      ) : null)}
      <Grid item xs={12} className="text-center">
        <MDBox mt={4} mb={1} xs={12} className="w-[80%] mx-auto">
          <MDButton
            variant="gradient"
            color="error"
            fullWidth
            disabled={!refusedApplication}
            onClick={() => setShowRejected(!showRejected)}
          >
            Rejected {applicationLength.rejected}
          </MDButton>
        </MDBox>
      </Grid>
      {applications.map((application) => showRejected && (application.state === "REJECTED") ? (
        <Grid item xs={4}>
          <Card className="mx-auto">
            <MDBox pt={4} pb={3} px={3}>
              <MDBox>
                <Typography className="text-black inline text-bold"> {application.userId.firstName} {application.userId.lastName}</Typography>
              </MDBox>
              <MDBox>
                <Typography className="text-black inline text-bold"> {application.userId.email}</Typography>
              </MDBox>
              <MDBox>
                <Typography className="text-black inline text-bold"> Compatibility: {application.compatibility ? (application.compatibility * 100).toFixed(2) : 0}%</Typography>
              </MDBox>
              {application.offerId.recommendation.map((object, idx) => {
                  if (object.student === application.userId._id) {
                    // Check if the student is recommended
                    const recommended = isRecommended(object.student);
                    console.log("skouzaaaaaaaa", recommended)
                    return (
                      <div key={idx}>
                        <p className="text-black inline text-bold">Recommended By: {object.teacher.firstName} {object.teacher.lastName}</p>
                        {recommended !== null ? (
                          recommended ? (
                            <span>
                              <FaStar className="ml-1 text-yellow-500" />

                            </span>
                          ) : (
                            <span>
                              <FaStar className="ml-1 text-gray-400" />

                            </span>
                          )
                        ) : null}
                      </div>
                    );
                  }
                  return null;
                })}
                {application.testId != null ? <MDBox >
                  <Typography className="text-black inline text-bold">Quiz Score:  {((application.testId.score / application.testId.quiz.quiz.length)*100).toFixed(2)}%</Typography>
                </MDBox> : null}
              <MDBox>
                <MDButton
                  variant="gradient"
                  color="light"
                  size="small"
                  className="w-[100%]"
                  style={{ marginTop: '1em', textTransform: 'none' }}
                  onClick={() => showCV(application._id, application.pdfFile)}
                >
                  Show CV: {application.fileName}
                </MDButton>
              </MDBox>
              <MDBox>
                <MDButton
                  variant="gradient"
                  color="error"
                  size="small"
                  className="w-[100%]"
                  style={{ marginTop: '1em', textTransform: 'none' }}
                  disabled={true}
                >
                  {application.state}
                </MDButton>
              </MDBox>
            </MDBox>
          </Card>
        </Grid>
      ) : null)}
      <Grid item xs={12} className="text-center">
        <MDBox mt={4} mb={1} xs={12} className="w-[80%] mx-auto">
          <MDButton
            variant="gradient"
            color="light"
            fullWidth
            disabled={!waitingApplication}
            onClick={() => setShowWaiting(!showWaiting)}

          >
            Awaiting {applicationLength.waiting}
          </MDButton>
        </MDBox>
      </Grid>
      {applications.map((application) => showWaiting && (application.state === "WAITING") ? (
        <Grid item xs={4}>
          <Card className="mx-auto">
            <MDBox pt={4} pb={3} px={3}>
              <MDBox>
                <Typography className="text-black inline text-bold"> {application.userId.firstName} {application.userId.lastName}</Typography>
              </MDBox>
              <MDBox>
                <Typography className="text-black inline text-bold"> {application.userId.email}</Typography>
              </MDBox>
              <MDBox>
                <Typography className="text-black inline text-bold"> Compatibility: {application.compatibility ? (application.compatibility * 100).toFixed(2) : 0}%</Typography>
              </MDBox>
              {application.offerId.recommendation.map((object, idx) => {
                  if (object.student === application.userId._id) {
                    // Check if the student is recommended
                    const recommended = isRecommended(object.student);
                    return (
                      <div key={idx}>
                        <p className="text-black inline text-bold">Recommended By: {object.teacher.firstName} {object.teacher.lastName}</p>
                        {recommended !== null ? (
                          recommended ? (
                            <span>
                              <FaStar className="ml-1 text-yellow-500" />

                            </span>
                          ) : (
                            <span>
                              <FaStar className="ml-1 text-gray-400" />

                            </span>
                          )
                        ) : null}
                      </div>
                    );
                  }
                  return null;
                })}
                {application.testId != null ? <MDBox >
                  <Typography className="text-black inline text-bold">Quiz Score:  {((application.testId.score / application.testId.quiz.quiz.length)*100).toFixed(2)}%</Typography>
                </MDBox> : null}
              <MDBox>
                <MDButton
                  variant="gradient"
                  color="light"
                  size="small"
                  className="w-[100%]"
                  style={{ marginTop: "1em", textTransform: "none" }}
                  onClick={() =>
                    showCV(application._id, application.pdfFile)
                  }
                >
                  Show CV: {application.fileName}
                </MDButton>
              </MDBox>
              <Grid container>
                <Grid item className="w-[50%] px-[5%]">
                  <MDButton
                    variant="gradient"
                    color="success"
                    size="small"
                    className="w-[100%]"
                    style={{ marginTop: '1em', textTransform: 'none' }}
                    onClick={() => handleButtonClick(application)}
                  >
                    Accept
                  </MDButton>
                </Grid>
                <Grid item className="w-[50%] px-[5%]">
                  <MDButton
                    variant="gradient"
                    color="error"
                    size="small"
                    className="w-[100%]"
                    style={{ marginTop: '1em', textTransform: 'none' }}
                    onClick={() => reply(application._id, "REJECTED")}
                  >
                    Reject
                  </MDButton>
                </Grid>
              </Grid>
            </MDBox>
          </Card>
        </Grid>
      ) : null
      )}
      <ToastContainer />
    </Grid>
  );
}

export default AdminOfferDetails;
