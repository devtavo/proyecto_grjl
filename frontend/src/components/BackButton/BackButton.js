import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ArrowBack from '@mui/icons-material/ArrowBack';
import { useHistory } from "react-router-dom";
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Lin from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";

export default function BackButton({ handleClickBack, to, bread }) {
    let history = useHistory();

    const handleClickBackTo = () => {
        history.push(to);
    }
    function handleClick(event) {
        event.preventDefault();
        console.info(event);
    }
    if (handleClickBack)
        return (
            <>
                
                <Stack direction="row" spacing={1} style={{marginBottom:'5px'}} >
                    <Button variant="text" size="small" startIcon={<ArrowBack />} onClick={handleClickBack}>
                        Volver
                    </Button>
                </Stack>
            </>
        )

    if (to)
        return (
            <>
                
                <Stack direction="row" spacing={1} style={{marginBottom:'5px'}}>
                    <Button variant="text" size="small" startIcon={<ArrowBack />} onClick={handleClickBackTo}>
                        Volver
                    </Button>
                    
                </Stack>
            </>
        )
}