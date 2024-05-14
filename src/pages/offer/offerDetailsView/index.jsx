/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import MDBox from "../../../components/MDBox";
import Footer from "../../../examples/Footer";
import { getOfferById } from "../../../services/offer.service";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";
import AdminOfferDetails from "./AdminOfferDetails";
import CandidatOfferDetails from "./CandidatOfferDetails";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../context/userContext";

function Index() {
  const { user } = useAuth();
  const params = useParams();

  const [offer, setOffer] = useState({publication: {
    title: ''
  }});

  const fetchOffer = () => {
    getOfferById(params.id)
      .then((response) => {
        setOffer(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };
 
  useEffect(() => {
    fetchOffer();
  }, [user]);
 
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
      {offer.publication.userId?._id === user?._id ? ( 
          <AdminOfferDetails offer={offer} setOffer={setOffer} />
        ) : ( 
          <CandidatOfferDetails offerId={params.id} offer={offer} setOffer={setOffer} />
        )}
        
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Index;
