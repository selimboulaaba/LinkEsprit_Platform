import React, { useEffect, useState } from 'react';
import { decodeToken } from "../../services/auth";
import { getUserById } from "../../services/user";
import { updateUser } from "../../services/user";
import { Bounce, ToastContainer, toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import Footer from "../../examples/Footer";
import Header from "../../layouts/profile/components/Header";
import MDBox from "../../components/MDBox";
import MDTypography from "../../components/MDTypography";
import MDInput from "../../components/MDInput";
import MDButton from "../../components/MDButton";
import ConfirmationPopUp from '../authentication/components/PopUps/confirmation';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import { useAuth } from '../../context/userContext';

function UpdateProfile() {
    const navigate = useNavigate();

    const { user, setUser } = useAuth();
    const [newUser, setNewUser] = useState({
        ...user,
        password: ''
      });
    const [passwordError, setPasswordError] = useState(false);
    const [role, setRole] = useState('');
    const [tel, setTel] = useState('');
    

    useEffect(() => {
        setNewUser({
            ...user,
            password: ''
        });
        setRole(user.role);
        setTel(user.telephone);
    }, [user])

    useEffect(() => {
        setNewUser({
            ...newUser,
            telephone: tel
        });
    }, [tel]);

    const handleUserChange = (event, field) => {
        setNewUser({
            ...newUser,
            [field]: event.target.value
        });
    };

    useEffect(() => {
        if (newUser.password !== newUser.password2) {
            setPasswordError(true);
        } else {
            setPasswordError(false);
        }
    }, [newUser.password, newUser.password2]);

    const update = () => {
        console.log(newUser)
        handleDialog("Confirm to Update", "Are you sure you want to update !",true);
    };

    const [dialog, setDialog] = useState({ title: "", message: "" ,isLoading: false});

    const handleDialog = (title, message,isLoading) => {
        setDialog({
            title,
            message,
            isLoading
        });
    };

    const responseUpdate = (confirmed, password) => {
        if (confirmed) {
                updateUser(newUser, password)
                .then((response) => {
                    setUser(response)
                    toast.success('Updated!', {
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
                })
                
                .catch((error) => {
                    console.log(error)
                    toast.error('Wrong password!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        transition: Bounce,
                        });
                });
        }
        setDialog({ ...dialog, isLoading: false })
    };
    
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox mb={2} />
            <Header connectedUser={user} setConnectedUser={setNewUser} trueUser = {true} page="update">
                <MDBox mb={2}>
                    <MDInput type="email" label="Email" variant="standard" fullWidth value={newUser.email} onChange={(event) => handleUserChange(event, 'email')} />
                </MDBox>

                {role === "ENTREPRISE" && (
                    <MDBox mb={2}>
                        <MDInput type="text" label="Enterprise Name" variant="standard" fullWidth value={newUser.enterpriseName} onChange={(event) => handleUserChange(event, 'enterpriseName')} />
                    </MDBox>
                )}

                {["ALUMNI", "STUDENT", "TEACHER", "ADMIN"].includes(role) && (
                    <>
                        <MDBox mb={2}>
                            <MDInput type="text" label="First Name" variant="standard" fullWidth value={newUser.firstName} onChange={(event) => handleUserChange(event, 'firstName')} />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput type="text" label="Last Name" variant="standard" fullWidth value={newUser.lastName} onChange={(event) => handleUserChange(event, 'lastName')} />
                        </MDBox>
                        <MDBox mb={2}>
                            <MDInput type="date" label="Birth Date" variant="standard" fullWidth InputLabelProps={{ shrink: true }} value={newUser.birthDate} onChange={(event) => handleUserChange(event, 'birthDate')} />
                        </MDBox>
                    </>
                )}

                {role === "ALUMNI" && (
                    <MDBox mb={2}>
                        <MDInput type="date" label="Graduation Date" variant="standard" fullWidth InputLabelProps={{ shrink: true }} value={newUser.graduationDate} onChange={(event) => handleUserChange(event, 'graduationDate')} />
                    </MDBox>
                )}
                <MDBox mb={2}>
                    <MDInput type="text" label="Description" variant="standard" multiline rows={5} fullWidth value={newUser.description} onChange={(event) => handleUserChange(event, 'description')} />
                </MDBox>
                <MDBox mb={2}>
                    <PhoneInput placeholder="Enter phone number" defaultCountry="TN" value={tel} onChange={setTel} />
                </MDBox>

                <MDBox mb={2}>
                    <MDInput type="password" label="Password" variant="standard" fullWidth value={newUser.password} onChange={(event) => handleUserChange(event, 'password')} />
                </MDBox>
                <MDBox mb={2}>
                    <MDInput type="password" label="Confirm Password" variant="standard" error={passwordError} fullWidth value={newUser.password2} onChange={(event) => handleUserChange(event, 'password2')} />
                </MDBox>

                <MDBox mt={4} mb={1}>
                    <MDButton
                        variant="gradient"
                        color="error"
                        fullWidth
                        onClick={update}
                        disabled={
                            (role === "TEACHER" && (newUser.firstName === '' || newUser.lastName === '' || newUser.birthDate === '')) ||
                            (role === "STUDENT" && (newUser.firstName === '' || newUser.lastName === '' || newUser.birthDate === '')) ||
                            (role === "ENTREPRISE" && newUser.enterpriseName === '') ||
                            (role === "ALUMNI" && (newUser.firstName === '' || newUser.lastName === '' || newUser.birthDate === '' || newUser.graduationDate === '')) ||
                            (newUser.email === '')
                        }
                    >
                        Update
                    </MDButton>
                </MDBox>
            </Header>

            {dialog.isLoading && (
                <ConfirmationPopUp
                    title={dialog.title}
                    message={dialog.message}
                    onDialog={responseUpdate}
                />
            )}
            <ToastContainer/>

            <Footer />
        </DashboardLayout>
    );
}

export default UpdateProfile;
