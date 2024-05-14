import React, { useState } from 'react'
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout'
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar'
import MDBox from '../../components/MDBox'
import { Card, Grid } from '@mui/material'
import MDTypography from '../../components/MDTypography'
import Footer from '../../examples/Footer'
import MDInput from '../../components/MDInput'
import MDButton from '../../components/MDButton'
import { addAdmin } from '../../services/user'
import { Bounce, ToastContainer, toast } from 'react-toastify'
import { useNavigate } from 'react-router'

function AdminCreation() {

    const [emailConfirmed, setEmailConfirmed] = useState(false)
    const navigate = useNavigate();
    const [admin, setAdmin] = useState({
        email: '',
        isDesactivated: false,
        role: "ADMIN",
        firstName: '',
        lastName: '',
        birthDate: new Date().toISOString().split('T')[0],
        establishment: '',
        followersList: []
    })

    const handleUserChange = (event, field) => {
        const { name, value } = event.target;
        if (name === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const isValidEmail = value === '' || emailRegex.test(value);
            setEmailConfirmed(!isValidEmail);
        }
        setAdmin({
            ...admin,
            [field]: event.target.value
        });
    };

    const isAnyFieldEmpty = () => {
        return Object.values(admin).some(value => value === '') || emailConfirmed;
    };

    const login = () => {
        addAdmin(admin)
            .then((response) => {
                console.log(response)
                if (response.status === 201) {
                    toast.success('Admin Created !', {
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
                    navigate("/users")
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }


    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card className='w-[50%] mx-auto'>
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
                                <MDTypography display="block" variant="h5" color="white" my={1}>
                                    Create an Admin Account
                                </MDTypography>
                            </MDBox>
                            <MDBox pt={4} pb={3} px={3}>
                                <MDBox component="form" role="form">
                                    <MDBox mb={2} className="w-[70%] mx-auto">
                                        <MDInput type="email" label="Email" fullWidth name="email" value={admin.email} error={emailConfirmed} onChange={(event) => handleUserChange(event, 'email')} />
                                    </MDBox>
                                    <MDBox mb={2} className="w-[70%] mx-auto">
                                        <MDInput type="text" label="First Name" fullWidth name="firstName" value={admin.firstName} onChange={(event) => handleUserChange(event, 'firstName')} />
                                    </MDBox>
                                    <MDBox mb={2} className="w-[70%] mx-auto">
                                        <MDInput type="text" label="Last Name" fullWidth name="lastName" value={admin.lastName} onChange={(event) => handleUserChange(event, 'lastName')} />
                                    </MDBox>
                                    <MDBox mb={2} className="w-[70%] mx-auto">
                                        <MDInput type="text" label="Establishment" fullWidth name="establishment" value={admin.establishment} onChange={(event) => handleUserChange(event, 'establishment')} />
                                    </MDBox>
                                    <MDBox mb={2} className="w-[70%] mx-auto">
                                        <MDInput type="date" label="Birth Date" variant="standard" fullWidth name="birthDate" InputLabelProps={{ shrink: true }} value={admin.birthDate} onChange={(event) => handleUserChange(event, 'birthDate')} />
                                    </MDBox>
                                    <MDBox mt={4} mb={1} className="w-[90%] mx-auto">
                                        <MDButton variant="gradient" color="error" fullWidth onClick={login} disabled={isAnyFieldEmpty()}>
                                            Register
                                        </MDButton>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>
            <Footer />
            <ToastContainer />
        </DashboardLayout>
    )
}

export default AdminCreation