import React from 'react';
import { HashRouter, Switch, Route, withRouter, Redirect } from "react-router-dom";
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';

import { useUserState } from "../../context/UserContext";

//Components
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import { UserProvider } from '../../context/UserContext'

//Pages
import Inicio from '../../pages/Inicio/Inicio';
import Login from '../../pages/Login/Login';
import Consultas from '../../pages/Consultas/Consultas';
import Consulta from '../../pages/Consulta';
import Reportes from '../../pages/Reportes/Reportes';
import Reporte from '../../pages/Reporte';
import Alertas from '../../pages/Alertas/Alertas';
import AlertasAdmin from '../../pages/Alertas/AlertasAdmin';
import Empresas from '../../pages/Empresas/Empresas';
import Flotas from '../../pages/Flota/Flotas';
import Paraderos from '../../pages/Paraderos/Paraderos';
import Parametros from '../../pages/Parametros/Parametros';
import Emv from '../../pages/Emv/Emv';
import Rutas from '../../pages/Rutas/Rutas';
import Seguridad from '../../pages/Seguridad/Seguridad';
import Sanciones from '../../pages/Sanciones/Sanciones';
import Obras from '../../pages/Obras/Obras';
import Constructora from '../../pages/Constructora/Constructora';
import Conductores from '../../pages/Conductores/Conductores';
import Validacion from '../../pages/Validacion/Validacion';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        flexGrow: 1,
        padding: theme.spacing(3),
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: `-${drawerWidth}px`,
        ...(open && {
            transition: theme.transitions.create('margin', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
            marginLeft: 0,
        }),
    }),
);

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

const Layout = () => {
    var { isAuthenticated, idRol } = useUserState();
    // console.log('lay', isAuthenticated, idRol);

    const [open, setOpen] = React.useState(false);
    
    const handleDrawerOpen = () => {
       open? setOpen(false):setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    if (idRol == 1)
        return (
            <>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    {/* <Sidebar open={open} handleDrawerClose={handleDrawerClose} drawerWidth={drawerWidth} /> */}
                    <Header handleDrawerOpen={handleDrawerOpen} />
                    <Sidebar open={open} handleDrawerClose={handleDrawerClose} drawerWidth={drawerWidth} />
                    <Main open={open} style={{ minHeight:'100vh',height: 'auto',width: '100%',background:'#F8F7F7' }}>
                        <DrawerHeader />
                        <Switch>
                            <Route path="/login" component={Login} />
                            <Route path='/' exact component={Inicio} />
                            <Route exact path="/consultas" component={Consultas} />
                            <Route exact path="/consultas/:consultaId" component={Consulta} />
                            <Route exact path="/reportes" component={Reportes} />
                            <Route exact path="/reportes/:reporteId" component={Reporte} />
                            {/* <Route path="/alertas" component={Alertas} />
                            <Route path="/alertasAdmin" component={AlertasAdmin} /> */}
                            <Route exact path="/empresas" component={Empresas} />
                            <Route path="/flotas/:flotaId" component={Flotas} />
                            {/* <Route path="/validacion/:token" component={Validacion} /> */}
                            {/* <Route path="/paraderos" component={Paraderos} /> */}
                            {/* <Route path="/paraderos/:rutaIdRuta" component={Paraderos} /> */}
                            {/* <Route path="/parametros" component={Parametros} /> */}
                            {/* <Route path="/emv" component={Emv} /> */}
                            <Route path="/rutas" component={Rutas} />
                            <Route path="/seguridad" component={Seguridad} />
                            {/* <Route path="/sanciones" component={Sanciones} /> */}
                            <Route path="/constructoras" component={Constructora} />
                            <Route path="/obras" component={Obras} />
                            {/* <Route path="/conductores" component={Conductores} /> */}
                            <Route path="/validacion" component={Validacion} />
                        </Switch>
                    </Main>
                </Box>
            </>
        );

    if (idRol == 2)
        return (
            <>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <Header handleDrawerOpen={handleDrawerOpen} />
                    <Sidebar open={open} handleDrawerClose={handleDrawerClose} drawerWidth={drawerWidth} />
                    <Main open={open} style={{minHeight:'100vh', height: 'auto',width: '100%',background:'#F8F7F7' }}>
                        <DrawerHeader />
                        <Switch>
                            <Route path="/login" component={Login} />
                            <Route path='/' exact component={Inicio} />
                            {/* <Route exact path="/consultas/:consultaId" component={Consulta} /> */}
                        </Switch>
                    </Main>
                </Box>
            </>
        );
    if (idRol == 3)
        return (
            <>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <Header handleDrawerOpen={handleDrawerOpen} />
                    <Sidebar open={open} handleDrawerClose={handleDrawerClose} drawerWidth={drawerWidth} />
                    <Main open={open} style={{ minHeight:'100vh',height: 'auto',width: '100%',background:'#F8F7F7' }}>
                        <DrawerHeader />
                        <Switch>
                            <Route path="/login" component={Login} />
                            <Route path='/' exact component={Inicio} />
                            {/* <Route exact path="/consultas/:consultaId" component={Consulta} /> */}
                        </Switch>
                    </Main>
                </Box>
            </>
        );

};

//export default Layout;
export default withRouter(Layout);
