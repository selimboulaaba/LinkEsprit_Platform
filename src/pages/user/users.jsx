import React, { useEffect, useState } from 'react';
import { activateUser, desactivateUser, getUsers, verifyUser } from '../../services/user';
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import MDBox from '../../components/MDBox';
import { Card, Grid } from '@mui/material';
import MDTypography from '../../components/MDTypography';
import Footer from '../../examples/Footer';
import DataTable from '../../examples/Tables/DataTable';
import MDButton from '../../components/MDButton';
import { useAuth } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';

function Users() {
  const { user } = useAuth();
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [desactivatedUsers, setDesactivatedUsers] = useState([]);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);
  const navigate = useNavigate();

  const setUsers = (users) => {
    const verified = [];
    const desactivated = [];
    const unverified = [];

    users.forEach(u => {
      if (u.isDesactivated) {
        const name = u.role === "ENTREPRISE" ? u.enterpriseName : u.lastName + " " + u.firstName
        desactivated.push({
          ...u,
          name: name,
          activate: (
            <MDButton
              variant="gradient"
              color="warning"
              size="small"
              onClick={() => {
                activateUser(u._id)
                  .then(response => {
                    console.log(response)
                    fetchUsers()
                  })
                  .catch(error => {
                    console.log(error)
                  })
              }}
            >
              Activate
            </MDButton>
          ),
          edit: (
            <MDButton
              variant="gradient"
              color="info"
              size="small"
              onClick={() => {
                u._id === user._id ? navigate('/profile') : navigate('/profile/'+u._id)
              }}
            >
              Profile
            </MDButton>
          )
        });
      } else if (!u.isVerified) {
        const name = u.role === "ENTREPRISE" ? u.enterpriseName : u.lastName + " " + u.firstName
        unverified.push({
          ...u,
          name: name,
          edit: (
            <MDButton
              variant="gradient"
              color="info"
              size="small"
              onClick={() => {
                u._id === user._id ? navigate('/profile') : navigate('/profile/'+u._id)
              }}
            >
              Profile
            </MDButton>
          ),
          verify: (
            <>
              <div className="flex space-x-4"> {/* Apply space between buttons */}
                <MDButton
                  variant="gradient"
                  color="success"
                  size="small"
                  onClick={() => {
                    verifyUser(u._id)
                      .then(response => {
                        console.log(response)
                        fetchUsers()
                      })
                      .catch(error => {
                        console.log(error)
                      })
                  }}
                >
                  Accept
                </MDButton>
                <MDButton
                  variant="gradient"
                  color="error"
                  size="small"
                  onClick={() => {
                    desactivateUser(u._id)
                      .then(response => {
                        console.log(response)
                        fetchUsers()
                      })
                      .catch(error => {
                        console.log(error)
                      })
                  }}
                >
                  Reject
                </MDButton>
              </div>
            </>

          )
        });
      } else {
        const name = u.role === "ENTREPRISE" ? u.enterpriseName : u.lastName + " " + u.firstName
        verified.push({
          ...u,
          name: name,
          delete: (
            <MDButton
              variant="gradient"
              color="error"
              size="small"
              onClick={() => {
                desactivateUser(u._id)
                  .then(response => {
                    console.log(response)
                    fetchUsers()
                  })
                  .catch(error => {
                    console.log(error)
                  })
              }}
            >
              Delete
            </MDButton>
          ),
          edit: (
            <MDButton
              variant="gradient"
              color="info"
              size="small"
              onClick={() => {
                u._id === user._id ? navigate('/profile') : navigate('/profile/'+u._id)
              }}
            >
              Profile
            </MDButton>
          )
        });
      }
    });

    setVerifiedUsers(verified);
    setDesactivatedUsers(desactivated);
    setUnverifiedUsers(unverified);
  };

  const fetchUsers = () => {
    getUsers()
      .then(response => {
        setUsers(response.data.users);
      })
      .catch(error => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="error"
              >
                <MDTypography variant="h6" color="white">
                  Users
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  entriesPerPage={true}
                  showTotalEntries={false}
                  noEndBorder
                  canSearch={true}
                  table={{
                    columns: [
                      { Header: "Email", accessor: "email" },
                      { Header: "Name", accessor: "name" },
                      { Header: "Role", accessor: "role", width: "20%" },
                      { Header: "Edit", accessor: "edit", width: "10%", align: "center" },
                      { Header: "Delete", accessor: "delete", width: "10%", align: "center" },
                    ],
                    rows: verifiedUsers
                  }}
                  pagination={{ variant: "gradient", color: "info" }}
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="error"
              >
                <MDTypography variant="h6" color="white">
                  Unverified Users
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  entriesPerPage={true}
                  showTotalEntries={false}
                  noEndBorder
                  canSearch={true}
                  table={{
                    columns: [
                      { Header: "Email", accessor: "email" },
                      { Header: "Name", accessor: "name" },
                      { Header: "Role", accessor: "role", width: "20%" },
                      { Header: "Edit", accessor: "edit", width: "10%", align: "center" },
                      { Header: "Verify", accessor: "verify", width: "10%", align: "center" },
                    ],
                    rows: unverifiedUsers
                  }}
                  pagination={{ variant: "gradient", color: "info" }}
                />
              </MDBox>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="error"
                borderRadius="lg"
                coloredShadow="error"
              >
                <MDTypography variant="h6" color="white">
                  Desactivated Users
                </MDTypography>
              </MDBox>
              <MDBox pt={3}>
                <DataTable
                  entriesPerPage={true}
                  showTotalEntries={false}
                  noEndBorder
                  canSearch={true}
                  table={{
                    columns: [
                      { Header: "Email", accessor: "email" },
                      { Header: "Name", accessor: "name" },
                      { Header: "Role", accessor: "role", width: "20%" },
                      { Header: "Edit", accessor: "edit", width: "10%", align: "center" },
                      { Header: "Activate", accessor: "activate", width: "10%", align: "center" },
                    ],
                    rows: desactivatedUsers
                  }}
                  pagination={{ variant: "gradient", color: "info" }}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Users;
