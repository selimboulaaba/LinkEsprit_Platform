import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../../context/userContext";
import { useDropzone } from "react-dropzone";
import { Document, Page } from 'react-pdf';
import MDButton from "../../../components/MDButton";
import { postApplication, verifyUserApplying } from "../../../services/application";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import MDBox from "../../../components/MDBox";

import YesNoPopUp from "../../../layouts/authentication/components/PopUps/YesNo";
import { useNavigate } from "react-router-dom";

function CandidatOfferDetails({ offerId, offer }) {

    const { user } = useAuth();
    const [application, setApplication] = useState({ pdfFile: '' })
    const [applied, setApplied] = useState(false)
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setApplication({
            offerId: offerId,
            userId: user._id
        })
        const test = async () => {
            try {
                const response = await verifyUserApplying(user._id, offerId);
                setApplied(response)
            } catch (error) {
                console.error('Error creating application:', error);
            }
        }
        if (offerId && user._id) test()
    }, [user])

    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles?.length) {
            setApplication(prev => ({
                ...prev,
                pdfFile: acceptedFiles[0],
            }))
        }
    }, [])

    const {
        getRootProps,
        getInputProps
    } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': [],
        },
        maxSize: 1024 * 2000
    });

    const post = async () => {
        if (offer.quizId == null) {
            try {
                setLoading(true)
                const response = await postApplication(application);
                setLoading(false)
                setApplied(response) 
            } catch (error) {
                console.error('Error creating application:', error);
            }
        }else {
            handleDialog("Confirm to Quizz", "Are you sure you want to pass The quizz", true);
        }
    }

    const [dialog, setDialog] = useState({ title: "", message: "", isLoading: false });

    const handleDialog = (title, message, isLoading) => {
        setDialog({
            title,
            message,
            isLoading
        });
    };
    const confirmQuiz = async (confirmed) => {
        if (confirmed) {
            setDialog({ ...dialog, isLoading: false })
            try {
                setLoading(true)
                const response = await postApplication(application);
                setLoading(false)
                setApplied(response)
                navigate(`/test/${offer.quizId}/${response._id}`)
            } catch (error) {
                console.error('Error creating application:', error);
            }
        }
    };

    return (
        <Card>
            <CardContent>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                        <CircularProgress />
                    </div>
                ) : (
                    <section className="container mx-auto mt-4 p-4">
                        <Grid container px={20}>
                            {applied ? <Grid item xs={9} mb={15}></Grid>
                                : <Grid item xs={9} mb={5}></Grid>}
                            {applied &&
                                <Grid item xs={3}>
                                    <MDBox>
                                        <MDButton
                                            variant="gradient"
                                            color={applied.state === "REJECTED" ? "error" : applied.state === "ACCEPTED" ? "success" : "warning"}
                                            size="big"
                                            className="w-[100%]"
                                            style={{ marginTop: '1em', textTransform: 'none' }}
                                            disabled={true}
                                        >
                                            {applied.state}
                                        </MDButton>
                                    </MDBox>
                                </Grid>
                            }
                            <Grid item xs={12} className="pl-8 text-center">
                                <Typography variant="h5" component="h1">
                                    <div className="text-5xl underline mb-7">{offer.publication.title}</div>
                                </Typography>
                                <Typography mt={5} variant="h2" color="textSecondary" className="text-black">
                                    <div className="text-3xl underline">Details:</div>
                                </Typography>
                                <Typography color="textSecondary" className="text-black">
                                    Posted by: <span className="font-bold">{offer.companyName}</span>
                                </Typography>
                                <Typography color="textSecondary" className="text-black font-bold">
                                    From: {new Date(offer.startTime).toLocaleDateString()} - To: {new Date(offer.endTime).toLocaleDateString()}
                                </Typography>
                                <Typography color="textSecondary" className="text-black">
                                    Type: <span className="font-bold">{offer.type}</span>
                                </Typography>
                                <Typography color="textSecondary" className="text-black">
                                    Sector: <span className="font-bold">{offer.sector ? offer.sector.name : ""}</span>
                                </Typography>
                                <Typography mt={5} variant="h2" color="textSecondary" className="text-black">
                                    <div className="text-3xl underline">Skills:</div>
                                </Typography>
                                <div className="flex flex-wrap justify-center">
                                    {offer.skills && offer.skills.map((skill, index) => (
                                        <div key={index} className="text-gray-800 border border-gray-400 rounded-full px-4 py-1 m-1 text-base">
                                            {skill}
                                        </div>
                                    ))}
                                </div>
                                <Typography mt={5} variant="h2" color="textSecondary" className="text-black">
                                    <div className="text-3xl underline">Description:</div>
                                </Typography>
                                <Typography color="textSecondary" className="text-black">
                                    <pre className="inline-block font-bold text-wrap">{offer.publication.description}</pre>
                                </Typography>
                                <Typography mt={5} variant="h2" color="textSecondary" className="text-black">
                                    <div className="text-3xl underline">Quizz:</div>
                                </Typography>
                                <Typography className="text-gray-800 text-base"> {offer.quizId == null ? "No Quiz Needed" : "Quiz Needed"}</Typography>

                            </Grid>

                        </Grid>
                        {!['TEACHER', 'ENTREPRISE', 'ADMIN', 'SUPERADMIN'].includes(user.role) && <div> <div {...getRootProps({ className: 'p-16 mt-10 border border-neutral-200 text-center' })}>
                            <input {...getInputProps()} />
                            <p>Drag and drop some files here, or click to select files</p>
                            <em>(Only pdf files with less than 2Mb will be accepted)</em>
                        </div>
                            <aside>
                                <h4 className="mt-4 ml-6 text-sm">Accepted files: {application.pdfFile && <section className="inline text-red-600">{application.pdfFile.name}</section>}</h4>
                                <MDButton
                                    variant="gradient"
                                    color="warning"
                                    size="small"
                                    className="w-[100%]"
                                    style={{ marginTop: '1em' }}
                                    onClick={post}
                                    disabled={(applied || application.pdfFile === '' || (user.role === 'ALUMNI' && offer.type === 'Intership')) ? true : false}
                                >
                                    {applied ? "Already applied" : "Apply"}
                                </MDButton>
                            </aside>
                        </div>
                        }
                    </section>
                )}
                {dialog.isLoading && (
                    <YesNoPopUp
                        title={dialog.title}
                        message={dialog.message}
                        onDialog={confirmQuiz}
                        setDialog={setDialog}
                    />
                )}
                <ToastContainer />
            </CardContent>
        </Card >

    );
}

export default CandidatOfferDetails;
