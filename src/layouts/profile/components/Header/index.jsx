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

import { useState, useEffect, useCallback } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "../../../../components/MDBox";
import MDTypography from "../../../../components/MDTypography";
import MDAvatar from "../../../../components/MDAvatar";

// Material Dashboard 2 React base styles
import breakpoints from "../../../../assets/theme/base/breakpoints";

// Images
import burceMars from "../../../../assets/images/bruce-mars.jpg";
import backgroundImage from "../../../../assets/images/bg-profile.jpeg";
import { useAuth } from "../../../../context/userContext";
import { followUser, unfollowUser } from "../../../../services/user";
import { useDropzone } from "react-dropzone";
import { Tooltip } from "chart.js";
import { Link } from "react-router-dom";
import bgImage from "../../../../assets/images/ESB-1024x683.jpg";

function Header({ connectedUser, setConnectedUser, trueUser, page, children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  const [tabValue, setTabValue] = useState(0);
  const { user, setUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(null)
  const [img, setImg] = useState(connectedUser.image)

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles?.length) {
      setImg(URL.createObjectURL(acceptedFiles[0]));
      const file = acceptedFiles[0]
      const fileObject = Object.assign(file);
      setConnectedUser(prevConnectedUser => ({
        ...prevConnectedUser,
        file: fileObject
      }));
    }
  }, [])
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noDrag: true,
    accept: {
      'image/*': []
    },
    maxSize: 1024 * 1000
  })

  useEffect(() => {
    if (user.followersList && connectedUser._id) {
      const isFollowingUser = user.followersList.some(u => u._id === connectedUser._id);
      setIsFollowing(isFollowingUser);
      if (!connectedUser.file) {
        setImg(connectedUser.image)
      }
    }
  }, [connectedUser, user])

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const name = () => {
    if (connectedUser.role === "ENTREPRISE") {
      return (<MDTypography variant="h5" fontWeight="medium">
        {connectedUser.enterpriseName}
      </MDTypography>)
    } else {
      return (<MDTypography variant="h5" fontWeight="medium">
        {connectedUser.firstName} {connectedUser.lastName}
      </MDTypography>)
    }
  }

  const follow = async () => {
    await followUser(user._id, connectedUser._id)
      .then((response) => {
        console.log(response)
        setUser(prevUser => ({
          ...prevUser,
          followersList: [...prevUser.followersList, connectedUser]
        }))
        setIsFollowing(true)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const unfollow = async () => {
    await unfollowUser(user._id, connectedUser._id)
      .then((response) => {
        console.log(response)
        setUser(prevUser => ({
          ...prevUser,
          followersList: prevUser.followersList.filter(user => user._id !== connectedUser._id)
        }));
        setIsFollowing(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            ` url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          {page === 'update' ?
            <Grid item direction="column" alignItems="center" position="relative">
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div style={{ position: 'relative' }}>
                  <MDAvatar src={img} alt="profile-image" size="xl" shadow="sm" />
                  <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                    <Icon className="text-gray-600">edit</Icon>
                  </div>
                </div>
              </div>
            </Grid> :
            <Grid item>
              <MDAvatar src={connectedUser.image} alt="profile-image" size="xl" shadow="sm" />
            </Grid>}

          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              {name()}

              <MDTypography variant="button" color="text" fontWeight="regular">
                {connectedUser.role}
              </MDTypography>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              {!trueUser && <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                {!trueUser && (
                  isFollowing ?
                    <Tab onClick={unfollow} label="Unfollow" icon={<Icon fontSize="small" sx={{ mt: -0.25 }}>unfollow</Icon>} />
                    :
                    <Tab onClick={follow} label="Follow" icon={<Icon fontSize="small" sx={{ mt: -0.25 }}>follow</Icon>} />
                )}
                {/* <Tab
                  label="App"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      home
                    </Icon>
                  }
                />
                <Tab
                  label="Message"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      email
                    </Icon>
                  }
                />
                <Tab
                  label="Settings"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      settings
                    </Icon>
                  }
                /> */}
              </Tabs>}
            </AppBar>
          </Grid>
        </Grid>
        {children}
      </Card >
    </MDBox >
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
