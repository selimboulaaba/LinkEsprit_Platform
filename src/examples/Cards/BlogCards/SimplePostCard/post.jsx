import React, { useEffect, useState } from 'react';
import PropTypes from "prop-types";
import Card from "@mui/material/Card";
import MDBox from "../../../../components/MDBox";
import MDInput from "../../../../components/MDInput";
import MDTypography from "../../../../components/MDTypography";
import MDButton from "../../../../components/MDButton";
import MDAvatar from "../../../../components/MDAvatar";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from "@mui/icons-material/Share";
import TextsmsIcon from '@mui/icons-material/Textsms';
import { Link } from "react-router-dom";
import { getUserById } from '../../../../services/user';
import { updateLikes } from '../../../../services/publication';

import burceMars from "../../../../assets/images/bruce-mars.jpg"
import Comments from './comments';
import LikesPopUp from '../../../../layouts/authentication/components/PopUps/likes';
import { getOffferByPublication } from '../../../../services/offer.service';



function SimpleBlogCard({ post, likeUser }) {
  const [commentOpen, setCommentOpen] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes.length);
  const [liked, setLiked] = useState(false);
  const [offer, setOffer] = useState({});
  useEffect(() => {
    // Check if userId exists in publication.likes
    if (post.likes.some(like => like.userId === likeUser._id)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [post, likeUser]);

  const handleLike = () => {
    setLiked(!liked);

    updateLikes(post._id, likeUser._id)
    setLikeCount(liked ? likeCount - 1 : likeCount + 1); // Incrementing like count
    // You can add your logic to update likes on the backend here
  };
  const showComments = () => {
    setCommentOpen(!commentOpen)
  }
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true);
  useEffect(() => {

    const fetchOffer = async () => {
      try {
        const response = await getOffferByPublication(post._id);
        setOffer(response);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    }
    fetchOffer();

    const fetchUser = async () => {
      try {
        const fetchedUser = await getUserById(post.userId);
        setUser(fetchedUser);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const formatDate = (date) => {
    const commentDate = new Date(date);
    const hours = commentDate.getHours().toString().padStart(2, '0');
    const minutes = commentDate.getMinutes().toString().padStart(2, '0');
    const day = commentDate.getDate().toString().padStart(2, '0');
    const month = (commentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = commentDate.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const [dialog, setDialog] = useState({ postId: "", isLoading: false });

  const handleDialog = (postId, isLoading) => {
    setDialog({
      postId,
      isLoading
    });
  };

  return (
    <Card>
      <MDBox p={3}>
        {loading ? (
          <p>Loading...</p> // Render loading indicator while data is being fetched
        ) : (
          <MDBox className="flex mb-5">
            <Link className="flex items-center" to={likeUser._id === post.userId ? `/profile` : `/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
              <MDAvatar className="mr-2" src={user.image} alt="profile-image" size="md" shadow="sm" />
              <MDTypography variant="h6" textTransform="capitalize" fontWeight="regular">{user.role === "ENTREPRISE" ? user.enterpriseName : user.firstName + " " + user.lastName}</MDTypography>
            </Link>
            <span className="text-xs text-gray-500 ml-auto">{formatDate(post.publicationDate)}</span>
          </MDBox>
        )}
        {offer &&
          <>
            <Link className="flex items-center" mt={2} to={`/offers/${offer._id}`} style={{ textDecoration: "none", color: "inherit" }}>
              <MDTypography variant="h6" textTransform="capitalize" fontWeight="regular" className="underline"><div className='underline'>{post.title}</div></MDTypography>
            </Link>

            <div className="flex flex-wrap mt-5 items-center">
              <div className='text-lg text-[#7B809A] me-2'>Skills: </div>
              {offer.skills && offer.skills.map((skill, index) => (
                <div key={index} className="text-[#7B809A] border border-gray-400 rounded-full px-4 py-1 m-1 text-sm">
                  {skill}
                </div>
              ))}
            </div>
          </>
        }
        <MDTypography mt={2} mb={3} variant="body2" component="p" color="text">{post.description}</MDTypography>
        <MDBox className="flex item-center" mt={2} mb={3}>
          <IconButton onClick={handleLike}>
            {liked ? (<FavoriteIcon fontSize="small" color='primary' />) : (<FavoriteBorderIcon fontSize="small" />)}
          </IconButton>
          <IconButton onClick={() => handleDialog(post._id, true)}>
            <span className="text-sm">{likeCount} Likes</span>
          </IconButton>
          <IconButton onClick={showComments} >
            <TextsmsIcon fontSize="small" />
          </IconButton>
          <IconButton>
            <ShareIcon fontSize="small" />
          </IconButton>
        </MDBox>
      </MDBox>
      {commentOpen && <Comments post={post} user={likeUser} />}
      {dialog.isLoading && (
        <LikesPopUp
          postId={dialog.postId}
          handleDialog={handleDialog}
          u={likeUser}
        />
      )}
    </Card >
  );
}


export default SimpleBlogCard;
