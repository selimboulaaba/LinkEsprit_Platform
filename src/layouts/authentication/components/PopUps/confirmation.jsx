import React, { useState } from 'react';

import MDButton from "../../../../components/MDButton";
import MDInput from "../../../../components/MDInput";


function ConfirmationPopUp({ title, message, onDialog }) {
    const [password, setPassword] = useState('');

    const handleUpdate = () => {
        // Pass the password to the parent component
        onDialog(true, password);
    };

    return (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] px-[20px]" onClick={() => onDialog(false)}>
        <div onClick={(e) => e.stopPropagation()} className='flex flex-col items-center justify-center absolute top-[35%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-white p-[20px] rounded-[10px]'>
         
                <h3>{title}</h3>
                <p>{message}</p>
                <MDInput
                    type="password"
                    label="Password"
                    variant="standard"
                    fullWidth
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <div className="confirmation-popup-buttons">
                    <MDButton
                        variant="gradient"
                        color="primary"
                        onClick={handleUpdate}
                    >
                        Update
                    </MDButton>
                    <MDButton
                        variant="gradient"
                        color="error"
                        onClick={() => onDialog(false, '')}
                    >
                        Cancel
                    </MDButton>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationPopUp;
