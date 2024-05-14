import React, { useEffect, useState } from 'react';
import { getLikesFromPublications } from '../../../../services/publication';
import MDBox from '../../../../components/MDBox';
import MDAvatar from '../../../../components/MDAvatar';
import MDTypography from '../../../../components/MDTypography';
import { Link } from 'react-router-dom';

function LikesPopUp({ postId, handleDialog, u }) {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchLikes = async () => {
            try {
                const fetchedUsers = await getLikesFromPublications(postId);
                setUsers(fetchedUsers);
            } catch (error) {
                console.error('Error fetching user:', error);
            }
        };

        fetchLikes();
    }, [postId]);


    

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" onClick={() => handleDialog("", false)}></div>
            <div className='flex flex-col items-center justify-center bg-white p-[20px] rounded-[10px] z-10'>
                {users.map((user, index) => (
                    <MDBox key={index} className="flex items-center mb-2 w-full mr-3"  component={Link} to={u._id === user._id ? `/profile` : `/profile/${user._id}`}>
                        <MDAvatar className="mr-5" src={user.image} alt="profile-image" size="md" shadow="sm" />
                        <MDTypography className="text-right" variant="h6" textTransform="capitalize" fontWeight="regular">{user.firstName} {user.lastName}</MDTypography>
                    </MDBox>
                ))}
            </div>
        </div>
    );
}

export default LikesPopUp;
