import React, { useState } from 'react';
import { Link } from "react-router-dom";

import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

export default function SidebarLink({ name, to, children = [] }) {
    const [open, setOpen] = useState(true);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleListItemClick = (event, index) => {
      setSelectedIndex(index);
    };
  
    const handleClick = (e) => {
        e.preventDefault();
        setOpen(!open);
    };

    return (
        <>
            <ListItemButton onClick={handleClick}>
                <ListItemText primary={name} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {children.map(({ name, to }) =>
                        <Link key={name} to={`/${to}`} style={{ textDecoration: 'none', color: '#000' }} >
                            <ListItemButton sx={{ pl: 4 }} key={name} >
                                <ListItemText  primary={name} onClick={(event) => handleListItemClick(event, 0)}/>
                            </ListItemButton>
                        </Link>
                    )}
                </List>
            </Collapse>
        </>
    );
}