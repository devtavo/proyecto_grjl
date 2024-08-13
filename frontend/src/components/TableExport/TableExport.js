import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

export default function TableExport({ isDisabled=false,onClickPDF, onClickExcel }) {
    return (
        < >
            {onClickPDF ?
                <Stack direction="row" spacing={1} style={{ float: 'right', marginBottom: '5px' }}>
                    <Button variant="outlined" onClick={onClickPDF}>Exportar PDF</Button>
                    <Button variant="outlined" onClick={onClickExcel}>Exportar Excel</Button>
                </Stack>
                :
                <Button disabled={!isDisabled} variant="outlined" onClick={onClickExcel}>Exportar Excel</Button>
            }

        </>
    )
}