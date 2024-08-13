import Typography from '@mui/material/Typography';
import Breadcrumb from './Breadcrumb';

export default function Navigation({title,subtitle,breadcrumb}){
    return(
        <div style={{display:'block',alignItems:'center', marginBottom:'5px' }}>
                <Breadcrumb
                breadcrumb={breadcrumb}
                title={title}
                style={{display:'block'}}
                />
                <Typography
                variant="h5"
                style={{fontWeight:'regular',
                        marginBottom:'8px',
                        display:'block',fontSize:'21px'}}>
                    {title}
                </Typography>
        </div>

    );
}