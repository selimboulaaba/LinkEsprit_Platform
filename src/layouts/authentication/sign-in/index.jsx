import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import MDBox from "../../../components/MDBox";
import MDTypography from "../../../components/MDTypography";
import MDInput from "../../../components/MDInput";
import MDButton from "../../../components/MDButton";
import BasicLayout from "../components/BasicLayout";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import bgImage from "../../../assets/images/ESB-1024x683.jpg";
import {
  signin,
  signinWithGoogle,
  verifyExistingUser,
} from "../../../services/auth";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../../context/userContext";
//
import IdentifiantPopUp from "../components/PopUps/identifant";
import ReCAPTCHA from "react-google-recaptcha";
function Basic() {
  const { login,setupSocket } = useAuth();

  const [user, setUser] = useState({
    identifiant: "",
    email: "",
    password: "",
  });

  const [showIdentifiantPopup, setShowIdentifiantPopup] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [capVal,setcapVal] = useState(null)
  const handleUserChange = (event, field) => {
    const value = event.target.value;
    setUser({
      ...user,
      [field]: value,
    });

    if (field === "email") {
      setEmailError(!isValidEmail(value));
    }

    if (field === "password") {
      setPasswordError(value === user.password);
    }
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  //
  const handleIdentifiantSave = (identifiant) => {
    // Handle identifier save logic here
    console.log("Identifiant saved:", identifiant);
    const newUser = user
    newUser.identifiant = identifiant
    // Perform the login operation with the saved identifier
    signinWithGoogle(newUser)
      .then((response) => {
        if (response.data.success === true) {
          login(response.data.token);
          setupSocket();
          toast.success("Logged in !", {
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
        }  else if (response.data.success === false) {
                          toast.error(response.data.message, {
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
                        } 
        //
      })
      .catch((error) => {
        console.log(error);
      });

    // Close the identifier popup after saving and processing
    setShowIdentifiantPopup(false);
  };

  const logginIn = () => {
    if (!isValidEmail(user.email) || user.password === "") {
      setPasswordError(true);
      return;
    } else {
      setPasswordError(false);
    }

    signin(user)
      .then((response) => {
        if (response.data.success === true) {
          login(response.data.token);
          setupSocket();
          toast.success("Logged in !", {
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
        }
        //
        else if (response.data.success === false) {
          // User not found, show identifiant popup
          setShowIdentifiantPopup(true);
        }
      })
      .catch((error) => {
        console.log(error);
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
      });
  };

  return (
    <React.Fragment>
      <BasicLayout image={bgImage}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="error"
            borderRadius="lg"
            coloredShadow="error"
            mx={2}
            mt={-3}
            p={2}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Sign in
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Sign in with a LinkEsprit Account Or with Gmail
            </MDTypography>
          </MDBox>
          <MDBox pt={8} pb={3} px={3}>
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput
                  type="email"
                  label="Email"
                  fullWidth
                  value={user.email}
                  onChange={(event) => handleUserChange(event, "email")}
                  error={emailError}
                />
                {emailError && (
                  <MDTypography color="error">
                    Please enter a valid email address.
                  </MDTypography>
                )}
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  type="password"
                  label="Password"
                  fullWidth
                  value={user.password}
                  onChange={(event) => handleUserChange(event, "password")}
                  error={passwordError}
                />
                {passwordError && (
                  <MDTypography color="error">
                    Password is required.
                  </MDTypography>
                )}
              </MDBox>
               <ReCAPTCHA 
               sitekey="6LehhMwpAAAAANaZ0yKYCHYMKec5blF0SjFhE6Gz"
               onChange={(val)=>setcapVal(val)}
               />
              <MDBox mt={4} mb={1}>
                <MDButton
                  variant="gradient"
                  color="error"
                  fullWidth
                  onClick={logginIn}
                  disabled={emailError || passwordError || !capVal}
                >
                  sign in
                </MDButton>
              </MDBox>
              <MDBox mt={4} mb={1} ml={2}>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    if (!credentialResponse) {
                      console.error("Réponse de l'identification invalide");
                      return;
                    }
                    setUser(jwtDecode(credentialResponse.credential))
                    const user = jwtDecode(credentialResponse.credential);
                    verifyExistingUser(user.email)
                      .then((response) => {
                        signinWithGoogle(user)
                        .then((response) => {
                          if (response.data.success === true) {
                            login(response.data.token);
                            setupSocket();
                            toast.success("Logged in !", {
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
                          }  else if (response.data.success === false) {
                                            toast.error(response.data.message, {
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
                                          } 
                          //
                        })
                      })
                      .catch((error) => {
                        setShowIdentifiantPopup(true);
                      });

                    //////////////////////
                    console.log("credential", credentialResponse);
                  }}
                  onError={() => {
                    console.log("Login Failed");
                  }}
                />
              </MDBox>
              {/* Identifier Popup */}
              {showIdentifiantPopup && (
                <IdentifiantPopUp
                  title="Enter Identifier"
                  message=""
                  onDialog={setShowIdentifiantPopup}
                  onSave={handleIdentifiantSave}
                />
              )}
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="button" color="text">
                  Don&apos;t have an account?{" "}
                  <MDTypography
                    component={Link}
                    to="/authentication/sign-up"
                    variant="button"
                    color="error"
                    fontWeight="medium"
                    textGradient
                  >
                    Sign up
                  </MDTypography>
                </MDTypography>
              </MDBox>
              <MDBox mt={1} mb={1} textAlign="center">
                <MDTypography variant="button" color="text">
                  Forget Password?{" "}
                  <MDTypography
                    component={Link}
                    to="/requestReset"
                    variant="button"
                    color="error"
                    fontWeight="medium"
                    textGradient
                  >
                    Reset Password
                  </MDTypography>
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </BasicLayout>
      <ToastContainer />
    </React.Fragment>
  );
}

export default Basic;
