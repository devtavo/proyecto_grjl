// import React from 'react';
import React, { useState } from 'react';

import SidebarLink from '../SidebarLink/SidebarLink';

import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { useUserState } from "../../context/UserContext";

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(12,0,0,5),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));
export const menu1 = [
    {
        name: "Inicio",
        children: [
            {
                name: "Control Acceso",
                to: ""
            }
        ]
    },
    {
        name: "Supervisión",
        children: [
            {
                name: "Indicadores",
                to: "consultas/1"
            },
            {
                name: "Reportes",
                to: "consultas"
            },
            {
                name: "Constancias",
                to: "validacion"
            },
            
        ]
    },
    {
        name: "Mantenimiento",
        children: [
            {
                name: "Usuarios",
                to: "seguridad"
            },
            // {
            //     name: "Placas",
            //     to: "flotas"
            // },
            {
                name: "Emp. Transporte",
                to: "empresas"
            },
            {
                name: "Contructoras",
                to: "constructoras"
            },
            {
                name: "Obras",
                to: "obras"
            }
        ]
    },
];
export const menu2 = [
    {
        name: "Inicio",
        children: [
            {
                name: "Control Acceso",
                to: ""
            }
        ]
    } 
];
export const menu3 = [
    {
        name: "Inicio",
        children: [
            {
                name: "Control Acceso",
                to: ""
            }
        ]
    }
];
export default function Sidebar({ open, handleDrawerClose, drawerWidth }) {

    var { isAuthenticated, idRol } = useUserState();
    const [idRoles, setIdRoles] = useState(idRol);

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 10,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                {/* <IconButton onClick={handleDrawerClose}>
                    <ChevronLeftIcon />
                </IconButton>Ocultar */}
            </DrawerHeader>
            <Divider />
            <List >
                {
                    idRoles == 1 ? menu1.map(({ name, to, children = [] }, index) => (
                        <React.Fragment key={name}>
                            <SidebarLink name={name} location={to} children={children}></SidebarLink>
                            <Divider />
                        </React.Fragment>
                    )) :
                     idRoles == 2 ? menu2.map(({ name, to, children = [] }, index) => (
                        <React.Fragment key={name}>
                            <SidebarLink name={name} location={to} children={children}></SidebarLink>
                            <Divider />
                        </React.Fragment>
                    )) : idRoles == 3 ? menu3.map(({ name, to, children = [] }, index) => (
                        <React.Fragment key={name}>
                            <SidebarLink name={name} location={to} children={children}></SidebarLink>
                            <Divider />
                        </React.Fragment>
                    )) :
                     ''
                }
            </List>

        </Drawer >
    );
}
