/* eslint-disable react/prop-types */
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useState } from "react";
import { Card, Dialog, DialogActions, DialogTitle, Grid } from "@mui/material";
import DataTable from "../../../examples/Tables/DataTable";
import MDBox from "../../../components/MDBox";
import MDButton from "../../../components/MDButton";
import { useNavigate } from "react-router-dom";
import { deleteOffer, getOffers, getPostedOffers } from "../../../services/offer.service";
import { useAuth } from "../../../context/userContext";
import DashboardLayout from "../../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../../examples/Navbars/DashboardNavbar";
import Footer from "../../../examples/Footer";

const AdminOffersList = () => {
  const [offers, setOffers] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchOffers = () => {
    if (user._id !== '') {
      getPostedOffers(user._id)
        .then((response) => {
          setOffers(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [user]);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  const addButtonsToOffersArray = () => {
    if (offers.length > 0) {
      const newOffersArray = offers.map((offer) => {
        const newOffer = {
          publication: offer.publication,
          type: offer.type,
          sector: offer.sector.name,
          startsAt: new Date(offer.startTime).toLocaleDateString(),
          company: offer.companyName,
          buttons: {
            edit: (
              <MDButton
                variant="gradient"
                color={!offer.isDeleted && (offer.publication.userId._id === user._id || ["ADMIN", "SUPERADMIN"].includes(user.role)) ? "info" : "secondary"}
                size="small"
                onClick={() => navigate("/offers/" + offer._id)}
              >
                {offer.isDeleted || (offer.publication.userId._id !== user._id && !["ADMIN", "SUPERADMIN"].includes(user.role)) ? "View" : "Edit"}
              </MDButton>
            ),
            delete: !offer.isDeleted ? (
              offer.publication.userId._id === user._id || ["ADMIN", "SUPERADMIN"].includes(user.role) ?
                (<MDButton
                  variant="gradient"
                  color="error"
                  size="small"
                  onClick={() => {
                    setSelectedOffer(offer);
                    handleClickOpenDialog();
                  }}
                >
                  Delete
                </MDButton>) : null
            ) : <span>Deleted</span>,
          }
        };
        newOffer.isEnded = offer.isEnded ? "Ended" : "Still Recruiting";
        return newOffer;
      });
      return newOffersArray;
    }
    return [];
  };
  const handleDeleteOffer = (id) => {
    deleteOffer(id)
      .then((response) => {
        if (response.status === 200) {
          const updatedOffers = offers.map((offer) =>
            offer._id === id ? { ...offer, isDeleted: true } : offer
          );
          setOffers(updatedOffers);
          setSelectedOffer(null);
          setOpenDialog(false);
          // toast.success("Offer Deleted !", {
          //   position: "top-right",
          //   autoClose: 5000,
          //   hideProgressBar: false,
          //   closeOnClick: true,
          //   pauseOnHover: false,
          //   draggable: true,
          //   progress: undefined,
          //   theme: "colored",
          //   transition: Bounce,
          // });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox mt={4} className="w-[96%] mx-auto">
                <MDButton
                  variant="gradient"
                  color="error"
                  component="a"
                  onClick={() => navigate("/offers/create")}
                  rel="noreferrer"
                >
                  Add Offer
                </MDButton>
              </MDBox>
              <MDBox>
                <DataTable
                  entriesPerPage={true}
                  showTotalEntries={false}
                  noEndBorder
                  canSearch={true}
                  isSorted={false}
                  table={{
                    columns: [
                      { Header: "Title", accessor: "publication.title", width: "20%" },
                      { Header: "Company", accessor: "company" },
                      { Header: "Sector", accessor: "sector" },
                      { Header: "Type", accessor: "type" },
                      { Header: "Starts At", accessor: "startsAt" },
                      { Header: "Status", accessor: "isEnded" },
                      { Header: "", accessor: "buttons.edit" },
                      { Header: "", accessor: "buttons.delete" },
                    ],
                    rows: addButtonsToOffersArray(),
                  }}
                  pagination={{ variant: "gradient", color: "info" }}
                />
              </MDBox>
            </Card>
          </Grid>
          <Dialog
            open={openDialog}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {`Do you want to delete ${selectedOffer?.companyName} ${selectedOffer?.type} offer ?`}
            </DialogTitle>
            <DialogActions>
              <MDButton onClick={handleClose}>Cancel</MDButton>
              <MDButton
                variant="gradient"
                color="error"
                onClick={() => handleDeleteOffer(selectedOffer?._id)}
                autoFocus
              >
                Yes
              </MDButton>
            </DialogActions>
          </Dialog>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
};

export default AdminOffersList;
