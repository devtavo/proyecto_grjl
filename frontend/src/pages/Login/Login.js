import React, { useState } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { Grid, Typography, TextField, Button ,Fade} from '@mui/material';
import SesionService from '../../services/SesionService';

import { useUserDispatch } from "../../context/UserContext";
import panel from '../../assets/images/main-logo2.png';
import mtcLogo from '../../assets/images/mtc-logo.png';
import munArequipaLogo from '../../assets/images/munarequipa-logo.png';
import sitransporteLogo from '../../assets/images/sitransporte-logo.png';
import promovilidadLogo from '../../assets/images/promovilidad-logo.png';
import gizLogo from '../../assets/images/logo3.png';

import '../../assets/styles/pages/login.css';

function Login() {

    var userDispatch = useUserDispatch();

    const [usuario, setUsuario] = useState();
    const [contrasena, setContrasena] = useState();
    const [error, setError] = useState(null);

    const history = useHistory();

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await SesionService.login(userDispatch, setError,{
                usuario,
                contrasena
            });
            // history.push('/');
        } catch (error) {
            setError(true)
            console.error('error', error);
        }
    }

    return (
        <Grid
            container
            spacing={0}
            direction="row"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: 'calc(100vh - 100px)' }
            }
        >
             <Grid item xs={0} md={4} className="login__panel">
               <div style={
                   {backgroundImage:`url(${panel})`,
                   height:'100vh',
                   padding:'50px 24px 24px 24px',
                   backgroundRepeat:'no-repeat',
                   backgroundSize:'cover',
                   display:'flex',
                   flexDirection:'column',
                   alignItems:'center',
                   boxSizing:'border-box'}}>
                <div className="" >
                <Typography style={{ textAlign: 'center', fontWeight: 'lighter', marginBottom: 15,color:'#FFF' }} variant='h5' >
                        Plataforma de Control de Acceso
                    </Typography>
                </div>
                <div className="login__panel--separator">

                </div>
                <div className="">
                <img src={gizLogo} className="App-logo" alt="logo" style={{ marginRight: 6, width:240,height:'66px', maxWidth:300}} />
                </div>
              
               </div>
               
            </Grid>
            <Grid item xs={12} md={8} className="login__container">

            <div>
                <div className="" >
                <img src={gizLogo} className="App-logo" alt="logo" style={{ width:170, maxWidth:200}} />
                </div>
                <div className="login__container--form" >
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: 500, minWidth: 300}}>

                    <Typography style={{ textAlign: 'center', fontWeight: 'regular', marginBottom: 15 }} variant='h5' >
                        Inicia sesión
                    </Typography>
                    <TextField autoFocus name="usuario" required label="Usuario" margin="normal" variant="outlined" onChange={e => {setUsuario(e.target.value);setError(false)}} />
                    <TextField name="contrasenia" required label="Contraseña" margin="normal" type="password" variant="outlined" onChange={e => {setContrasena(e.target.value);setError(false)}} />
                    <Fade in={error}>
                        <Typography color="secondary" >
                            El usuario y/o contraseña errada
                        </Typography>
                    </Fade>
                    <Button type="submit" color="primary" variant="contained" size="large">Ingresar</Button>
                </form>
                </div>
                <div className="login__logos--container">
                    {/* <img src={mtcLogo} className="App-logo" alt="logo" style={{  width:200, maxWidth:243}} />
                    <img src={promovilidadLogo} className="App-logo" alt="logo" style={{ width:140, maxWidth:140}} />
                    <img src={munArequipaLogo} className="App-logo" alt="logo" style={{  width:80, maxWidth:80}} /> */}
                </div>

            </div>

            </Grid>
        </Grid>
    );
}

export default withRouter(Login);
