import { Menu, MenuItem } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import MDAvatar from '../../../components/MDAvatar'
import MDTypography from '../../../components/MDTypography'
import { useNavigate } from 'react-router-dom';

function Users({users, user, inputRef, setSearch, setOpenUsersMenu}) {
    const navigate = useNavigate();

    const handleUserSelect = (selectedUser) => {
        setSearch("")
        setOpenUsersMenu(false)
        selectedUser._id === user._id ? navigate('/profile') : navigate('/profile/' + selectedUser._id)
    };

    const handleCloseUsersMenu = () => setOpenUsersMenu(false);

    return (
        <Menu
            anchorEl={inputRef.current}
            anchorReference={null}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            open={true}
            onClose={handleCloseUsersMenu}
            autoFocus={false}
            sx={{ mt: 2 }}
        >
            {users.map((user) => (
                <MenuItem key={user._id} onClick={() => handleUserSelect(user)}>
                    <MDAvatar src={user.image} alt={user.firstName} size="xs" />
                    <MDTypography variant="body2" ml={1}>
                        {user.role === "ENTREPRISE" ? user.enterpriseName : user.firstName + " " + user.lastName}
                    </MDTypography>
                </MenuItem>
            ))}
        </Menu>
    )
}

export default Users