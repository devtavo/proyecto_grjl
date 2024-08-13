import Breadcrumbs from '@mui/material/Breadcrumbs';
import {Link as RouterLink} from 'react-router-dom';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import Typography from '@mui/material/Typography';
export default function Breadcrumb({breadcrumb, title}){
    return(
        <Breadcrumbs separator="›" maxItems={4} aria-label="breadcrumb" style={{display:'block',marginBottom:'5px'}}>
        {
            breadcrumb.map((e,i)=>{
                    return(
                    <Link 
                    underline="hover" 
                    color="inherit"
                    sx={{ display: 'flex', alignItems: 'center' }}
                    component={RouterLink} to={e.path}
                    >
                        {e.name==='Inicio'?<HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />:<span></span>}
                        {e.name}
                    </Link>
                    )
            })
        }
                   
        <Typography color="#BF0909">{title}</Typography>

        </Breadcrumbs>
    )
}