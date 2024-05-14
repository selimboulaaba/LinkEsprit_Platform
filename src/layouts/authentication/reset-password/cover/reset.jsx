/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 WebMasters (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Card from "@mui/material/Card";
import React, { useState,useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDInput from "../../../../components/MDInput";
import MDButton from "../../../../components/MDButton";

// Authentication layout components
import CoverLayout from "../../components/CoverLayout";

// Images
import bgImage from "../../../../assets/images/bg-reset-cover.jpeg";
import { resetPassword } from "../../../../services/auth";
import { Bounce, ToastContainer, toast } from "react-toastify";

function Reset() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, SetPasswordError] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const navigate = useNavigate();

  const reset = () => {
    
      resetPassword(password)
      .then((response) => {
        console.log(response)
        toast.success('password updated !', {
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
        navigate('/authentication/sign-in')
      })
      .catch((error) => {
        console.log(error)
      })

    
    
    
  };
  useEffect(() => {
    if (password !== confirmPassword) {
      SetPasswordError(true);
      setButtonDisabled(true);
    } else {
      SetPasswordError(false);
      setButtonDisabled(false);
    }
  }, [password, confirmPassword]);

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const handlePasswordChange = (event) => {

    setPassword(event.target.value);}
  return (
    <CoverLayout coverHeight="50vh" image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="error"
          borderRadius="lg"
          coloredShadow="success"
          mx={2}
          mt={-3}
          py={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h3" fontWeight="medium" color="white" mt={1}>
            Reset Password
          </MDTypography>
          <MDTypography display="block" variant="button" color="white" my={1}>
            choose new password
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={4}>
              <MDInput type="password" label="password" variant="standard" fullWidth value={password}
                onChange={handlePasswordChange}/>
            </MDBox>
            <MDBox mb={4}>
              <MDInput type="password" label="confirm password"  error={passwordError} variant="standard" fullWidth  value={confirmPassword}
              onChange={handleConfirmPasswordChange} />
            </MDBox>
            <MDBox mt={6} mb={1}>
              <MDButton variant="gradient" color="error" disabled={buttonDisabled} fullWidth onClick={reset}>
                reset
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Reset;
