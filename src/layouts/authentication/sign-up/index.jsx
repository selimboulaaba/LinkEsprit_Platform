import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
import CoverLayout from "../components/CoverLayout";
import bgImage from "../../../assets/images/ESB-1024x683.jpg";
import { useEffect, useState } from "react";
import { signup } from "../../../services/auth";
import { Bounce, ToastContainer, toast } from "react-toastify";
import Select from "react-select";

function Cover() {
  const navigate = useNavigate();

  const initialUserState = {
    identifiant:"",
    email: "",
    password: "",
    password2: "",
    role: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    enterpriseName: "",
    graduationDate: "",
    isDesactivated: false,
    isVerified: false,
    followersList: [],
  };

  const [user, setUser] = useState(initialUserState);
  const [passwordError2, setPasswordError2] = useState(false);
  const [passwordLengthError, setPasswordLengthError] = useState(false); 
  const [birthDateError, setBirthDateError] = useState(false);
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastNameError, setLastNameError] = useState(false);
  const [enterpriseNameError, setEnterpriseNameError] = useState(false);
  const [graduationDateError, setGraduationDateError] = useState(false);

  const handleUserChange = (event, field) => {
    const value = event.target.value;
    setUser((prevUser) => ({
      ...prevUser,
      [field]: value,
    }));

    if (field === "birthDate") {
      const selectedDate = new Date(value);
      const currentDate = new Date();
      if (selectedDate > currentDate) {
        setBirthDateError(true);
      } else {
        setBirthDateError(false);
      }
    }

    if (field === "password") {
      setPasswordLengthError(value.length < 8); 
      setPasswordError2(value !== user.password2);
    }

    if (field === "password2") {
      setPasswordError2(value !== user.password);
    }

    if (field === "firstName") {
      setFirstNameError(value === "");
    }

    if (field === "lastName") {
      setLastNameError(value === "");
    }

    if (field === "enterpriseName") {
      setEnterpriseNameError(value === "");
    }

    if (field === "graduationDate") {
      const selectedDate = new Date(value);
      const currentDate = new Date();
      if (selectedDate > currentDate) {
        setGraduationDateError(true);
      } else {
        setGraduationDateError(false);
      }
    }
  };

  const roles = [
    { value: "STUDENT", label: "Student" },
    { value: "ALUMNI", label: "Alumni" },
    { value: "TEACHER", label: "Teacher" },
    { value: "ENTREPRISE", label: "Enterprise" },
  ];

  useEffect(() => {
    setUser({
      ...initialUserState,
      role: user.role
    })
  }, [user.role])

  const register = () => {
    console.log(user);
    signup(user)
      .then((response) => {
        console.log(response);
        toast.success("Registered !", {
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
        navigate("/authentication/sign-in");
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
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
        console.log(error);
      });
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <CoverLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="error"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          p={3}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Join us today
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            Enter your email and password to register
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <Select
                className="basic-single"
                classNamePrefix="select"
                name="color"
                options={roles}
                onChange={(selectedOption) =>
                  setUser((prevUser) => ({
                    ...prevUser,
                    role: selectedOption.value,
                  }))
                }
                placeholder="Select a Role..."
                isSearchable={false}
              />
            </MDBox>
            {["STUDENT", "TEACHER"].includes(user.role) && (
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Identifiant"
                variant="standard"
                fullWidth
                value={user.identifiant}
                onChange={(event) => handleUserChange(event, "identifiant")}
              />
              
            </MDBox>
            )}
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                variant="standard"
                fullWidth
                value={user.email}
                onChange={(event) => handleUserChange(event, "email")}
              />
              {!isValidEmail(user.email) && user.email !== "" && (
                <MDTypography color="error">
                  Please enter a valid email address.
                </MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Password"
                variant="standard"
                fullWidth
                value={user.password}
                onChange={(event) => handleUserChange(event, "password")}
              />
              {passwordLengthError && (
                <MDTypography color="error">Password must be at least 8 characters long.</MDTypography>
              )}
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="password"
                label="Confirm Password"
                variant="standard"
                error={passwordError2}
                fullWidth
                value={user.password2}
                onChange={(event) => handleUserChange(event, "password2")}
              />
              {passwordError2 && (
                <MDTypography color="error">Passwords do not match.</MDTypography>
              )}
            </MDBox>
            {["STUDENT", "ALUMNI", "TEACHER"].includes(user.role) && (
              <>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="First Name"
                    variant="standard"
                    fullWidth
                    value={user.firstName}
                    onChange={(event) => handleUserChange(event, "firstName")}
                  />
                  {firstNameError && (
                    <MDTypography color="error">First Name is required.</MDTypography>
                  )}
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="text"
                    label="Last Name"
                    variant="standard"
                    fullWidth
                    value={user.lastName}
                    onChange={(event) => handleUserChange(event, "lastName")}
                  />
                  {lastNameError && (
                    <MDTypography color="error">Last Name is required.</MDTypography>
                  )}
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    type="date"
                    label="Date"
                    variant="standard"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={user.birthDate}
                    onChange={(event) => handleUserChange(event, "birthDate")}
                  />
                  {birthDateError && (
                    <MDTypography color="error">Please select a valid birth date.</MDTypography>
                  )}
                </MDBox>
              </>
            )}
            {user.role === "ENTREPRISE" && (
              <MDBox mb={2}>
                <MDInput
                  type="text"
                  label="Enterprise Name"
                  variant="standard"
                  fullWidth
                  value={user.enterpriseName}
                  onChange={(event) => handleUserChange(event, "enterpriseName")}
                />
                {enterpriseNameError && (
                  <MDTypography color="error">Enterprise Name is required.</MDTypography>
                )}
              </MDBox>
            )}
            {user.role === "ALUMNI" && (
              <MDBox mb={2}>
                <MDInput
                  type="date"
                  label="Graduation Date"
                  variant="standard"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  value={user.graduationDate}
                  onChange={(event) => handleUserChange(event, "graduationDate")}
                />
                {graduationDateError && (
                  <MDTypography color="error">Please select a valid Graduation Date.</MDTypography>
                )}
              </MDBox>
            )}
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="error"
                fullWidth
                onClick={register}
                disabled={
                  !isValidEmail(user.email) ||
                  user.role === "" ||
                  (user.role === "TEACHER" && (user.firstName === "" || user.lastName === "")) ||
                  (user.role === "STUDENT" && (user.firstName === "" || user.lastName === "")) ||
                  (user.role === "ENTREPRISE" && user.enterpriseName === "") ||
                  (user.role === "ALUMNI" &&
                    (user.firstName === "" || user.lastName === "" || user.graduationDate === "")) ||
                  user.email === "" ||
                  user.password === "" ||
                  user.password2 === "" ||
                  passwordError2 ||
                  birthDateError ||
                  firstNameError ||
                  lastNameError ||
                  enterpriseNameError ||
                  graduationDateError ||
                  passwordLengthError
                }
              >
                Sign in
              </MDButton>
            </MDBox>
            <MDBox mt={3} mb={1} textAlign="center">
              <MDTypography variant="button" color="text">
                Already have an account?{" "}
                <MDTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="error"
                  fontWeight="medium"
                  textGradient
                >
                  Sign In
                </MDTypography>
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
      <ToastContainer />
    </CoverLayout>
  );
}

export default Cover;
