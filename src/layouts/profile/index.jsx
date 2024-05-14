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
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

// Material Dashboard 2 React components
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDButton from "../../components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import ProfileInfoCard from "../../examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "../../examples/Lists/ProfilesList";
import DefaultProjectCard from "../../examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "../../layouts/profile/components/Header";
import PlatformSettings from "../../layouts/profile/components/PlatformSettings";
import { Bounce, ToastContainer, toast } from "react-toastify";
// Data
import profilesListData from "../../layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "../../assets/images/home-decor-1.jpg";
import homeDecor2 from "../../assets/images/home-decor-2.jpg";
import homeDecor3 from "../../assets/images/home-decor-3.jpg";
import blocG from "../../assets/images/blocGjpeg.jpeg";
import team1 from "../../assets/images/team-1.jpg";
import team2 from "../../assets/images/team-2.jpg";
import team3 from "../../assets/images/team-3.jpg";
import team4 from "../../assets/images/team-4.jpg";
import React, { useEffect, useState } from "react";
import { decodeToken } from "../../services/auth";
import { getOwnSkills, getSkills, getUserById, updateSkills } from "../../services/user";
import { useAuth } from "../../context/userContext";
import { useParams } from "react-router";
import {
  getOffersByUserId,
  getRecommendedOffers,
  rejectOffer,
} from "../../services/offer.service";
import CreatableSelect from 'react-select/creatable';

function Overview() {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const [connectedUser, setConnectedUser] = useState({});
  const [offers, setOffers] = useState([]);
  const [myProfile, setMyProfile] = useState(true);
  const [recommendedOffers, setRecommendedOffers] = useState([]);
  const [skills, setSkills] = useState([]);
  const [ownedSkills, setOwnedSkills] = useState([])
  const [followers, setFollowers] = useState([])
  const [maxFollowersShowen, setMaxFollowersShowen] = useState(3);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const currentUser = await getUserById(id);
          setConnectedUser(currentUser);
          setFollowers(currentUser.followersList)
          setMyProfile(false);
        } else {
          setConnectedUser(user);
          setFollowers(user.followersList)
          setMyProfile(true);
          user._id != '' ? setOffers((await getOffersByUserId(user._id)).data) : null;

          const fetchedSkills = await getOwnSkills(user._id)
          setOwnedSkills(listStringToObject(fetchedSkills))
          const allSkills = await getSkills();
          setSkills(listStringToObject(allSkills));
          setRecommendedOffers((await getRecommendedOffers(user._id)).data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchData();
    setMaxFollowersShowen(3);
  }, [id, user]);

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
    await updateSkills(connectedUser._id, listObjectToString(selectedOption))
    setOwnedSkills(selectedOption)
  }

  const handleRejectOffer = async (recommendationId) => {
    try {
      await rejectOffer(recommendationId);
      toast.success("Sector rejected successfully!");
    }
    catch (error) {
      console.error("Error rejecting offer:", error);
      toast.error("Failed to reject offer.");
    }



  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header
        connectedUser={connectedUser}
        trueUser={id ? false : true}
        page="profile"
      >
        <MDBox mt={5} mb={3}>
          <Grid container spacing={1}>
            <Grid container item xs={12} xl={8} spacing={1}>
              <Grid item xs={12} sx={{ display: "flex" }}>
                <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                <ProfileInfoCard
                  title="profile information"
                  description={connectedUser.description}
                  info={{
                    fullName:
                      connectedUser.firstName + " " + connectedUser.lastName,
                    mobile: connectedUser.telephone,
                    email: connectedUser.email,
                    birthDate: connectedUser.birthDate
                      ? connectedUser.birthDate.slice(0, 10)
                      : "",
                  }}
                  action={{ route: "/updateProfile", tooltip: "Edit Profile" }}
                  shadow={false}
                  trueUser={id ? false : true}
                />
              </Grid>
              <MDBox pt={2} px={2} lineHeight={1.25}>
                <MDTypography variant="h6" fontWeight="medium">
                  Skills
                </MDTypography>

              </MDBox>

              {myProfile ?
                <Grid item xs={12} sm={11} mb={10} pr={10} ml={3}>
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
                </Grid> :
                <Grid item xs={12} sm={11} mb={10} pr={10} ml={3}>
                  <div className="flex flex-wrap">
                    {connectedUser.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="text-gray-800 border border-gray-400 rounded-full px-4 py-1 m-1 text-base"
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                </Grid>
              }
            </Grid>
            <Grid container item xs={12} xl={4} spacing={1}>
              <Grid item xs={12}>
                <ProfilesList u={user} title="Following" profiles={followers} maxShowen={maxFollowersShowen} shadow={false} />
              </Grid>
              <Grid item xs={6}>
                <MDButton onClick={() => setMaxFollowersShowen(maxFollowersShowen + 3)} disabled={(maxFollowersShowen + 1) > followers?.length} variant="text" color="error">
                  Show More
                </MDButton>
              </Grid>
              <Grid item xs={6}>
                <MDButton onClick={() => setMaxFollowersShowen(maxFollowersShowen - 3)} disabled={maxFollowersShowen <= 3} variant="text" color="error">
                  Show less
                </MDButton>
              </Grid>
            </Grid>
          </Grid>
        </MDBox>
        {myProfile && <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Applications
          </MDTypography>
        </MDBox>}
        {myProfile ? (
          <MDBox p={2}>
            <Grid container spacing={6}>
              {offers.map((offer, index) => (
                <Grid key={index} item xs={12} md={6} xl={3}>
                  <DefaultProjectCard
                    image={blocG}
                    label={offer.type}
                    title={offer.companyName}
                    description={`Starts: ${offer.startTime.slice(
                      0,
                      10
                    )}, Ends: ${offer.endTime.slice(0, 10)}`}
                    action={{
                      type: "internal",
                      route: "/offers/" + offer._id,
                      color: "info",
                      label: "view offer",
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </MDBox>
        ) : (
          <div></div>
        )}
        {myProfile && <MDBox pt={2} px={2} lineHeight={1.25}>
          <MDTypography variant="h6" fontWeight="medium">
            Recommandations
          </MDTypography>
        </MDBox>}
        {myProfile ? (
          <MDBox p={2}>
            <Grid container spacing={6}>
              {recommendedOffers.map((offer, index) => {
                let rec = {};
                offer.recommendation.map((recommendation) => {
                  if (recommendation.student === connectedUser._id) {
                    rec = recommendation;
                  }
                });
                return (
                  <Grid key={index} item xs={12} md={6} xl={3}>
                    <DefaultProjectCard
                      rec={rec}
                      image={blocG}
                      label={offer.type}
                      title={offer.companyName}
                      description={`Recommanded by: `}
                      action={{
                        type: "internal",
                        route: "/offers/" + offer._id,
                        color: "success",
                        label: "Apply",
                      }}
                      action1={{
                        color: "error",
                        label: "Reject",
                        onClick: handleRejectOffer,
                      }}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </MDBox>
        ) : (
          <div></div>
        )}
      </Header>
      <Footer />
      <ToastContainer />
    </DashboardLayout>
  );
}

export default Overview;
