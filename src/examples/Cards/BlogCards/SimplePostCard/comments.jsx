import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import MDBox from "../../../../components/MDBox";
import MDInput from "../../../../components/MDInput";
import MDButton from "../../../../components/MDButton";
import burceMars from "../../../../assets/images/bruce-mars.jpg"
import MDAvatar from "../../../../components/MDAvatar";
import { useEffect } from "react";
import { getCommentsByPublicationId, createComment } from '../../../../services/comment';
import { getUserById } from '../../../../services/user';
import MDTypography from "../../../../components/MDTypography";
const Comments = ({ post, user }) => {
  const [desc, setDesc] = useState("");
  const [comments, setComments] = useState([]);
  const postId = post._id;
  const [replyIndex, setReplyIndex] = useState(null);
  const [reply, setReply] = useState('');

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const response = await getCommentsByPublicationId(postId);
      setComments(response);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const sendComment = async () => {
    try {
      const response = await createComment({ content: desc, publicationId: postId, userId: user._id });
      fetchComments();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  }

  const formatDate = (date) => {
    const commentDate = new Date(date);
    const hours = commentDate.getHours().toString().padStart(2, '0');
    const minutes = commentDate.getMinutes().toString().padStart(2, '0');
    const day = commentDate.getDate().toString().padStart(2, '0');
    const month = (commentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = commentDate.getFullYear();

    return `${hours}:${minutes} ${day}/${month}/${year}`;
  };

  const handleReply = (index) => {
    setReplyIndex(index);
  }

  const sendReply = async (commentId) => {
    const response = await createComment({ content: reply, publicationId: postId, userId: user._id, parentCommentId: commentId });
    fetchComments();
  }

  return (
    <MDBox p={3}>

      <MDBox display="flex" alignItems="center">
        <MDAvatar className="mr-2" src={user.image} alt="profile-image" size="sm" shadow="sm" />
        <MDInput
          type="text"
          placeholder="Write a comment .."
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          style={{ flex: 1 }}
        />
        <MDButton onClick={() => {sendComment(); setDesc('')}} >Send</MDButton>
      </MDBox>

      <MDBox className="comment mt-[20px]">
        {comments.map((comment, index) => {
          return (
            <div key={index} className="bg-white shadow-md rounded-md p-4 mb-4">
              <div className="flex items-center mb-2">
                <Link to={user._id === comment.userId._id ? `/profile` : `/profile/${comment.userId._id}`} className="flex items-center hover:underline">
                  <img src={comment.userId.image} alt="profile" className="w-8 h-8 rounded-full mr-2" />
                  <span className="text-lg">{comment.userId.role === "ENTREPRISE" ? comment.userId.enterpriseName : comment.userId.firstName + " " + comment.userId.lastName}</span>
                </Link>
                <span className="text-xs text-gray-500 ml-auto">{formatDate(comment.commentDate)}</span>
              </div>
              <p className="text-gray-800 text-base">{comment.content}</p>
              <button className="text-sm text-blue-500 hover:underline" onClick={() => handleReply(index)}>Reply</button>

              {replyIndex === index && (
                <MDBox display="flex" alignItems="center">
                  <MDAvatar className="mr-2" src={user.image} alt="profile-image" size="sm" shadow="sm" />
                  <MDInput
                    type="text"
                    placeholder="Reply to this comment .."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <MDButton onClick={() => {sendReply(comment._id); setReply('')}} >Reply</MDButton>
                </MDBox>
              )}
              {comment.replies && comment.replies.map((reply, replyIndex) => (
                <div key={replyIndex} className="bg-gray-100 shadow-md rounded-md p-4 ml-8 mt-2">
                  <div className="flex items-center mb-2">
                    <Link to={user._id === reply.userId._id ? `/profile` : `/profile/${reply.userId._id}`} className="flex items-center hover:underline">
                      <img src={reply.userId.image} alt="profile" className="w-8 h-8 rounded-full mr-2" />
                      <span className="text-lg">{reply.userId.role === "ENTREPRISE" ? reply.userId.enterpriseName : reply.userId.firstName + " " + reply.userId.lastName}</span>
                    </Link>
                    <span className="text-xs text-gray-500 ml-auto">{formatDate(reply.commentDate)}</span>
                  </div>
                  <p className="text-gray-800 text-base">{reply.content}</p>
                </div>
              ))}
            </div>
          )
        })}
      </MDBox>
    </MDBox >
  );
};

export default Comments;
