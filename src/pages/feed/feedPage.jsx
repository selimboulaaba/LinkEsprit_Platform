import React, { useEffect, useState, useRef } from 'react';
import DashboardLayout from '../../examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from '../../examples/Navbars/DashboardNavbar';
import { Card, CircularProgress, Grid } from '@mui/material';
import Footer from '../../examples/Footer';
import SimpleBlogCard from '../../examples/Cards/BlogCards/SimplePostCard/post';
import { getPublications, createPublication } from '../../services/publication';
import { Bounce, ToastContainer, toast } from "react-toastify";
import MDBox from '../../components/MDBox';
import MDInput from '../../components/MDInput';
import MDAvatar from '../../components/MDAvatar';
import burceMars from "../../assets/images/bruce-mars.jpg"
import MDButton from '../../components/MDButton';
import Image from "../../assets/images/img.png"
import Map from "../../assets/images/map.png"
import Friend from "../../assets/images/friend.png"
import { useAuth } from "../../context/userContext";

function FeedPage() {
    const { user } = useAuth();
    const [thisUser, setThisUser] = useState({ user })
    const [publications, setPublications] = useState([]);
    const [publication, setPublication] = useState({
        title: '',
        likes: [],
        description: '',
        userId: user._id,
    })
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true); // Track if there are more publications to fetch
    const containerRef = useRef(null);

    const fetchFeed = async () => {
        if (user._id) {
            try {
                setIsLoading(true);
                const response = await getPublications(page, user._id);

                const newPublications = response.publications;
                setPublications(prevPublications => [
                    ...prevPublications,
                    ...newPublications
                ]);
                setHasMore(newPublications.length > 0); // Update hasMore based on whether new publications were fetched
            } catch (error) {
                console.error('Error fetching publications:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        setThisUser(user)
        setPage(1)
        setHasMore(false)
    }, [user]);

    useEffect(() => {
        fetchFeed();
    }, [page, user]);

    useEffect(() => {
        if (!hasMore) return; // If there are no more publications to fetch, do nothing
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading) {
                setPage(prevPage => prevPage + 1);
            }
        }, {
            threshold: 1
        });

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [isLoading, hasMore]);



    const handlePublicationChange = (event, field) => {
        setPublication({
            ...publication,
            [field]: event.target.value,
            userId: (user._id).toString()

        });
    };
    const post = () => {
        createPublication(publication)
            .then((response) => {

                toast.success('Posted !', {
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
                setPublication({
                    ...publication,
                    description: '',
                });
                setPublications([response, ...publications]);
            })
            .catch((error) => {
                console.log(error)
            })
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <Grid justifyContent="center">
                <Grid item xs={12}>
                    <Grid container justifyContent="center">
                        <Grid item xs={8} mb={5}>
                            <Card className='container flex row'>
                                <Grid container alignItems="center">
                                    <Grid ml={1} item>
                                        <MDAvatar className="mr-2" src={thisUser.image} alt="profile-image" size="md" shadow="sm" />
                                    </Grid>
                                    <Grid item p={2} xs>
                                        <MDInput multiline rows={1} value={publication.description} onChange={(event) => handlePublicationChange(event, 'description')} fullWidth placeholder="Whats on your mind" />
                                    </Grid>
                                    <hr />
                                    <Grid pb={2} container alignItems="center">
                                        <Grid item xs={10}>
                                            <Grid container >
                                                <Grid item>
                                                    <MDButton>
                                                        <img className='h-6' src={Image} alt="" />
                                                        <p className='pl-1'>Add Image</p>
                                                    </MDButton>
                                                </Grid>
                                                <Grid item>
                                                    <MDButton>
                                                        <img className='h-6' src={Map} alt="" />
                                                        <p className='pl-1'>Add Place</p>
                                                    </MDButton>
                                                </Grid>
                                                <Grid item>
                                                    <MDButton>
                                                        <img className='h-6' src={Friend} alt="" />
                                                        <p className='pl-1'>Tag Friends</p>
                                                    </MDButton>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <MDButton onClick={post} color="info">
                                                Post
                                            </MDButton>
                                        </Grid>
                                    </Grid>




                                </Grid>
                            </Card>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>


            <Grid container spacing={3} justifyContent="center">
                {publications.map((publication, index) => (
                    <Grid item xs={12} key={index}>
                        <Grid container justifyContent="center">
                            <Grid item xs={7} mb={5}>
                                <SimpleBlogCard
                                    post={publication} likeUser={thisUser}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
            </Grid>
            <div ref={containerRef} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
                {isLoading && <CircularProgress />}
            </div>


            <Footer />
            <ToastContainer />
        </DashboardLayout>
    );
}

export default FeedPage;
