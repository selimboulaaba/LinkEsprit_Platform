import React, { useState, useEffect } from "react";
import { Card, CardContent, Grid, Typography, TextField, Box } from "@mui/material";
import MDButton from "../../../components/MDButton";
import Autocomplete from "@mui/material/Autocomplete";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/userContext";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import MDBox from "../../../components/MDBox";
import Footer from "../../../examples/Footer";
import { getOffers, recommendStudentForOffer } from "../../../services/offer.service";
import StudentrecommandationPopUp from "../../../layouts/authentication/components/PopUps/studentrecommandation";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import MDAvatar from "../../../components/MDAvatar";
import MDTypography from "../../../components/MDTypography";
const UserOffersList = () => {
  const [offers, setOffers] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [filteredOffers, setFilteredOffers] = useState(offers);
  const [filterOptions, setFilterOptions] = useState({
    sector: null,
    type: null,
  });
  const fetchOffers = () => {
    getOffers()
      .then((response) => {
        setOffers(response.data.offers);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    setFilteredOffers(offers);
  }, [offers]);

  const handleFilterChange = (event, value, field) => {
    const newFilterOptions = { ...filterOptions, [field]: value };

    if (!newFilterOptions.sector && !newFilterOptions.type) {
       
        setFilteredOffers(offers);
    } else if (!newFilterOptions.sector || !newFilterOptions.type) {
       
        const filterField = newFilterOptions.sector ? "sector" : "type";
        filterOffers(newFilterOptions[filterField], filterField);
    } else {
    
        filterOffers(newFilterOptions.sector, "sector");
        filterOffers(newFilterOptions.type, "type");
    }

    setFilterOptions(newFilterOptions);
};

   

  const filterOffers = (value, field) => {
    let filtered = offers;
    if (field === "sector") {
      filtered = offers.filter((offer) => offer.sector.name === value);
    } else if (field === "type") {
      filtered = offers.filter((offer) => offer.type === value);
    }
    setFilteredOffers(filtered);
  };
  //






  const handleRecommend = async (studentId) => {
    console.log(studentId);
    try {
      await recommendStudentForOffer(dialog.offerId, user._id, studentId);
      toast.success("Student recommended for offer successfully!");
    } catch (error) {

      toast.error("Student is already recommended for this offer!");

    }
  };


  const [dialog, setDialog] = useState({ isLoading: false, offerId: '' });

  const handleDialog = (isLoading, offerId) => {
    setDialog({
      isLoading,
      offerId
    });
  };

  const formatDate = (date) => {
    const commentDate = new Date(date);
    const day = commentDate.getDate().toString().padStart(2, '0');
    const month = (commentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = commentDate.getFullYear();

    return `${day}/${month}/${year}`;
  };


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={4}>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={6}>
              <Autocomplete
                disablePortal
                id="combo-box-demo-sector"
                options={Array.from(
                  new Set(offers.map((offer) => offer.sector.name))
                )}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "sector")
                }
                renderInput={(params) => <TextField {...params} label="Sector" />}
              />
            </Grid>
            <Grid item xs={6}>
              <Autocomplete
                disablePortal
                id="combo-box-demo-type"
                options={Array.from(new Set(offers.map((offer) => offer.type)))}
                onChange={(event, newValue) =>
                  handleFilterChange(event, newValue, "type")
                }
                renderInput={(params) => <TextField {...params} label="Type" />}
              />
            </Grid>
          </Grid>
          {filteredOffers.map((offer) => (
            <Grid item xs={12} sm={6} md={4} key={offer._id}>
              <Card className="p-2 pt-3">
                <CardContent>
                  <MDBox className="flex items-center">
                    <Link className="flex items-center" to={`/profile/${offer.publication.userId._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                      <MDAvatar className="ml-2 mr-2" src={offer.publication.userId.image} alt="profile-image" size="md" shadow="sm" />
                    </Link>
                    <span className="text-sm text-gray-500 ml-auto">{formatDate(offer.createdAt)}</span>
                  </MDBox>
                  <MDTypography variant="h5" mt={2} ml={1} component="h2" textTransform="capitalize" fontWeight="regular">{offer.companyName}</MDTypography>
                  <Typography variant="h5" my={2} component="h2">
                    <div className="text-3xl truncate">{offer.publication.title}</div>
                  </Typography>
                  <div className="flex flex-wrap mb-9">
                    <div className="text-gray-800 border border-gray-400 rounded-full px-4 py-1 m-1 text-base">
                      {offer.sector.name}
                    </div>
                    <div className="text-gray-800 border border-gray-400 rounded-full px-4 py-1 m-1 text-base">
                      {offer.type}
                    </div>
                  </div>
                  <Grid container className="items-center">
                    <Grid item xs={7} mt={1}>
                      <Typography color="textSecondary">
                        Starting: {new Date(offer.startTime).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item xs={5}>
                      <MDButton
                        variant="gradient"
                        color={user.role === "TEACHER" ? "success" : "light"}
                        className="w-[100%]"
                        style={{ marginTop: '1em' }}
                        onClick={user.role === "TEACHER" ? () => handleDialog(true, offer._id) : () => navigate('/offers/' + offer._id)}
                      >
                        {user.role === "TEACHER" ? "Recommend Student" : "Apply"}
                      </MDButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </MDBox>
      <Footer />
      {dialog.isLoading && (
        <StudentrecommandationPopUp
          offerId={dialog.offerId}
          handleDialog={handleDialog}
          handleRecommend={handleRecommend}
        />
      )}
      <ToastContainer />
    </DashboardLayout>
  );
};

export default UserOffersList;


