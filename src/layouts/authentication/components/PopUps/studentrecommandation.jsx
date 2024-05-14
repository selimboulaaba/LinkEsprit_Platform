import React, { useEffect, useState } from 'react';
import { getStudent } from '../../../../services/user';
import MDBox from '../../../../components/MDBox';
import MDAvatar from '../../../../components/MDAvatar';
import MDTypography from '../../../../components/MDTypography';
import { FaStar } from 'react-icons/fa'; 
import { verifyStudentRecommendation } from '../../../../services/offer.service';

function StudentrecommandationPopUp({ handleDialog, handleRecommend, offerId }) {    
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await getStudent("STUDENT");
                console.log('Fetched students:', response);
                setStudents(response);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };
    
        fetchStudents();
    }, []);

    useEffect(() => {
        const updateRecommendationStatus = async () => {
            try {
                const updatedStudents = await Promise.all(students.map(async student => {
                    const isRecommended = await verifyStudentRecommendation(offerId, student._id);
                    return {
                        ...student,
                        isRecommended: isRecommended 
                    };
                }));
                console.log('Updated students:', updatedStudents);
                setStudents(updatedStudents);
            } catch (error) {
                console.error('Error updating recommendation status:', error);
            }
        };
        
        if (students.length > 0) {
            updateRecommendationStatus();
        }
    }, [students, offerId]);
    
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.5)]" onClick={() => handleDialog(false, '')}></div>
            <div className='flex flex-col items-center justify-center bg-white p-[20px] rounded-[10px] z-10'>
                {students.map((student, index) => (
                    <MDBox key={index} onClick={() => { handleDialog(false, ''); handleRecommend(student._id) }} className="flex items-center mb-2 w-full mr-3 cursor-pointer">
                        <MDAvatar className="mr-5" src={student.image} alt="profile-image" size="md" shadow="sm" />
                        <MDTypography className="text-right" variant="h6" textTransform="capitalize" fontWeight="regular">
                            {student.firstName} {student.lastName}
                            {student.isRecommended ? (
                                <FaStar className="ml-1 text-yellow-500" />
                            ) : (
                                <FaStar className="ml-1 text-gray-400"/>
                            )}
                        </MDTypography>
                    </MDBox>
                ))}
            </div>
        </div>
    );
}

export default StudentrecommandationPopUp;
