import Stack from '@mui/material/Stack';
import BackButton from '../BackButton/BackButton';
import TableExport from '../TableExport/TableExport';

export default function ReportActions({ backIsVisible = false, handleClickBack }) {
    return (
        <>
            <Stack direction="row" spacing={1} style={{ float: 'right' }}>
                <TableExport />
                {backIsVisible && <BackButton handleClickBack={handleClickBack} />}
            </Stack>
        </>
    );
}


