import React, { useState } from "react";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';

import mtcLogo from '../../assets/images/mtc-logo-header.png';
import munArequipaLogo from '../../assets/images/munarequipa-logo-header.png';
import siTransporteLogo from '../../assets/images/sitransporte-logo-header.png';
import gizLogo from '../../assets/images/logo3.png';

import '../../assets/styles/components/header.css';

import {
   
    MailOutline as MailIcon,
    NotificationsNone as NotificationsIcon,
    Person as AccountIcon,
    Search as SearchIcon,
    Send as SendIcon,
    ArrowBack as ArrowBackIcon,
  } from "@material-ui/icons";
import useStyles from "./styles";

import classNames from "classnames";
import { useUserDispatch, signOut } from "../../context/UserContext";

export default function Header({ handleDrawerOpen },props) {
    var classes = useStyles();
    const user = JSON.parse(localStorage.getItem('user')).usuario;
    // console.log(user);
    var userDispatch = useUserDispatch();

    var [mailMenu, setMailMenu] = useState(null);
    var [isMailsUnread, setIsMailsUnread] = useState(true);
    var [notificationsMenu, setNotificationsMenu] = useState(null);
    var [isNotificationsUnread, setIsNotificationsUnread] = useState(true);
    var [profileMenu, setProfileMenu] = useState(null);
    var [isSearchOpen, setSearchOpen] = useState(false);
    var [name, setName] = useState(user);

    return (
        <Box sx={{ display: 'flex' }}>
            {/* <AppBar position="fixed" > */}
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            >
                            <Tooltip title="Menú Principal" placement="right-start">
                                <MenuIcon />
                            </Tooltip>
                        </IconButton>
                    <img src={gizLogo} className="header__logo--mun" alt="logo" />
                    <Typography
                        variant="h6" noWrap component="div" className="header__title"
                        style={{
                            fontWeight:'lighter',
                            borderLeft: '2px solid #FFF',
                            paddingLeft: '24px',
                            marginLeft:'24px',
                        }}>
                        Plataforma del Control de Acceso
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'flex', md: 'flex' } }}>
                        <div className="" onClick={e => { setProfileMenu(e.currentTarget); }} style={{cursor:'pointer'}}>
                            <span>
                                {name}
                            </span>
                            <IconButton aria-haspopup="true"
                                color="inherit"
                                className={classes.headerMenuButton}
                                aria-controls="profile-menu"
                                onClick={e => { setProfileMenu(e.currentTarget); }}
                                style={{marginLeft:'0px'}}>
                                <AccountCircle />
                            </IconButton>
                        </div>
                        <Menu 
                            id="profile-menu"
                            open={Boolean(profileMenu)}
                            anchorEl={profileMenu}
                            onClose={() => setProfileMenu(null)}
                            className={classes.headerMenu}
                            classes={{ paper: classes.profileMenu }}
                            disableAutoFocusItem
                        >
                            {/* <div className={classes.profileMenuUser}>
                                <Typography variant="h6" weight="medium">
                                    {name}
                                </Typography>
                            </div>
                            <MenuItem
                                className={classNames(
                                    classes.profileMenuItem,
                                    classes.headerMenuItem,
                                )}
                            >
                                <AccountIcon className={classes.profileMenuIcon} /> Perfil
                            </MenuItem> */}
                            <div className={classes.profileMenuUser}>
                                <Typography
                                    className={classes.profileMenuLink}
                                    color="primary"
                                    onClick={() => signOut(userDispatch, props.history)}
                                >
                                    Cerrar sesión
                                </Typography>
                            </div>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}
