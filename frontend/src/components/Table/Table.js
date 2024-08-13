import React from 'react';
import { useExportData } from "react-table-plugins";
import XLSX from "xlsx";
import JsPDF from "jspdf";
import "jspdf-autotable";
import MaUTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableExport from '../TableExport/TableExport';
import TableContainer from '@mui/material/TableContainer';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
import Button from '@mui/material/Button';
import { exportExcel } from './Export.js';
import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import XlsxPopulate from "xlsx-populate";
import TextField from '@mui/material/TextField';

const today = new Date();

const DEFAULT_SIZE_TABLE = 'small';

export default function BasicTable({ props, isPaginador = true, isBuscador = true, isExportable = false, isReporte = false, isVehiculo = false, sizePro = DEFAULT_SIZE_TABLE, columns, data, pdfExport, inicio, final, className }) {

    const user = JSON.parse(localStorage.getItem('user')).usuario;

    const { getTableProps, headerGroups, rows, prepareRow, exportData, page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        nextPage,
        previousPage,
        setGlobalFilter,
        state: { pageIndex, globalFilter }, } = useTable(
            {
                columns,
                data,
                getExportFileBlob,
                initialState: { pageIndex: 0 }, // Página inicial
                pageCount: Math.ceil(data.length / 2)
            },
            useGlobalFilter,
            useSortBy,
            usePagination,
            useExportData,
        );

    function exportPdf(data = pdfExport, col = columns) {

        if (!isVehiculo) {
            const titleDet = data.columnsDet[0].Header;
            const maxValor = titleDet.split(' ');
            const a = {};
            const titleRes = isReporte ? data.columnsRes[0].Header : '';
            const headerNamesRes = isReporte ? data.columnsRes[0]?.columns
                .filter((c) => c.Header !== "Action")
                .map((column) => column.Header) : '';
            const res = [];
            if (isReporte) data.resumen.map((d) => { res.push(Object.values(d)) });

            const emp = [];
            const headerNames = data.columnsDet[0].columns
                .filter((c) => c.Header !== "Action")
                .map((column) => column.Header);
            const headerKeys = data.columnsDet[0].columns
                .filter((c) => c.Header !== "Action")
                .map((column) => column.accessor);

            for (var i = 0; i < data.empresas.length; i++) {
                var x = [];
                for (var j = 0; j < Object.keys(data.empresas[i]).length; j++) {
                    if (headerKeys.includes(Object.keys(data.empresas[i])[j])) {
                        x.push(Object.values(data.empresas[i])[j])
                    }
                }
                emp.push(x);
            }

            const doc = new JsPDF('l', 'px', 'a4');
            doc.setLanguage("en-ES");
            //fecha de consulta
            doc.setFontSize(8);
            // doc.text('Rango de consulta: ', 480, 12);
            doc.text('Usuario: ' + user + ' - ' + new Date().toLocaleString(), 430, 12);

            //titulo del documento
            doc.setFontSize(13);
            var texto = doc.splitTextToSize(titleDet, 400);
            if ((inicio && final)) doc.text([titleDet, 'Fecha: ' + inicio + ' - ' + final], 300, 70, { align: 'center' });
            if (!(inicio && final)) doc.text(texto, 300, 70, { align: 'center' });

            doc.autoTable({
                head: [headerNames],
                body: emp,
                styles: {
                    minCellHeight: 9,
                    halign: "center",
                    valign: "top",
                    fontSize: 9,
                },
                startY: 90
            });
            if (isReporte) {
                doc.setFontSize(11);
                doc.text(titleRes, 28, doc.lastAutoTable.finalY + 18, { align: 'left' });
                doc.autoTable({
                    head: [headerNamesRes],
                    body: res,
                    styles: {
                        minCellHeight: 9,
                        halign: "left",
                        valign: "top",
                        fontSize: 9
                    },
                    startY: doc.lastAutoTable.finalY + 20

                });
            }
            doc.setFontSize(8);
            doc.save(`${props}.pdf`);
        }
        if (isVehiculo) {
            const titleDet12 = data.columnsDet12[0].Header;
            const titleDet21 = data.columnsDet21[0].Header;
            const titleRes = data.columnsRes[0]?.Header;
            const headerNamesRes = data.columnsRes[0]?.columns
                .filter((c) => c.Header !== "Action")
                .map((column) => column.Header) || '';

            const res = [];
            data.resumen.map((d) => { res.push(Object.values(d)) });

            const emp12 = [];
            const headerNames12 = data.columnsDet12[0].columns
                .filter((c) => c.Header !== "Action")
                .map((column) => column.Header);

            const emp21 = [];
            const headerNames21 = data.columnsDet21[0].columns
                .filter((c) => c.Header !== "Action")
                .map((column) => column.Header);


            data.vehiculos12.map((d) => { emp12.push(Object.values(d)) });
            data.vehiculos21.map((d) => { emp21.push(Object.values(d)) });

            // const image = new Image();s
            // image.src = '/images/logo.png';
            const doc = new JsPDF('l', 'px', 'a4');
            // doc.addImage(image, 'PNG', 10, 10, 260, 35);
            //fecha de consulta
            doc.setFontSize(8);
            doc.text('Usuario: ' + user + ' - ' + new Date().toLocaleString(), 430, 12);

            //titulo del documento
            doc.setFontSize(13);
            var texto = doc.splitTextToSize(titleDet12, 400);
            if ((inicio && final)) doc.text([titleDet12, 'Fecha: ' + inicio + ' - ' + final], 300, 70, { align: 'center' });
            if (!(inicio && final)) doc.text(texto, 300, 70, { align: 'center' });


            doc.autoTable({
                head: [headerNames12],
                body: emp12,
                styles: {
                    minCellHeight: 9,
                    halign: "center",
                    valign: "top",
                    fontSize: 9
                },
                startY: 85
            });

            //titulo 21
            var texto21 = doc.splitTextToSize(titleDet21, 400);
            if ((inicio && final)) doc.text([titleDet21, 'Fecha: ' + inicio + ' - ' + final], 300, doc.lastAutoTable.finalY + 22, { align: 'center' });
            if (!(inicio && final)) doc.text(texto21, 300, doc.lastAutoTable.finalY + 22, { align: 'center' });



            doc.autoTable({
                head: [headerNames21],
                body: emp21,
                styles: {
                    minCellHeight: 9,
                    halign: "center",
                    valign: "top",
                    fontSize: 9
                },
                startY: doc.lastAutoTable.finalY + 35
            });

            if (isReporte) {
                doc.setFontSize(11);
                doc.text(titleRes, 28, doc.lastAutoTable.finalY + 18, { align: 'left' });
                doc.autoTable({
                    head: [headerNamesRes],
                    body: res,
                    styles: {
                        minCellHeight: 9,
                        halign: "left",
                        valign: "top",
                        fontSize: 9
                    },
                    startY: doc.lastAutoTable.finalY + 25

                });
            }
            doc.setFontSize(8);
            doc.save(`${props}.pdf`);
        }

    }

    function getSheetData(data, header) {
        var fields = Object.keys(data[0]);
        var sheetData = data.map(function (row) {
            return fields.map(function (fieldName) {
                return row[fieldName] ? row[fieldName] : "";
            });
        });
        sheetData.unshift(header);
        return sheetData;
    }

    async function saveAsExcel(data = pdfExport) {

        var data2 = isVehiculo ? pdfExport.vehiculos12 : pdfExport.empresas;
        const emp = [];
        const emp2 = [];

        var finicio = pdfExport.inicio ? pdfExport.inicio : inicio;
        var ffinal = pdfExport.final ? pdfExport.final : final;
        const headerNames = isVehiculo ? pdfExport.columnsDet12[0].columns.filter((c) => c.Header !== "Action").map((column) => column.Header) : pdfExport.columnsDet[0].columns
            .filter((c) => c.Header !== "Action")
            .map((column) => column.Header);
        let header = headerNames;

        const headerKeys = isVehiculo ? pdfExport.columnsDet12[0].columns.filter((c) => c.Header !== "Action").map((column) => column.accessor) : pdfExport.columnsDet[0].columns
            .filter((c) => c.Header !== "Action")
            .map((column) => column.accessor);
        console.log("h", headerKeys);
        if (isVehiculo) {
            for (var i = 0; i < data.vehiculos12.length; i++) {
                const x1 = [];
                for (var j = 0; j < Object.keys(data.vehiculos12[i]).length; j++) {
                    if (headerKeys.includes(Object.keys(data.vehiculos12[i])[j])) {
                        x1.push(Object.values(data.vehiculos12[i])[j])
                    }
                }
                emp.push(x1);
            }
            for (var i = 0; i < data.vehiculos21.length; i++) {
                const x2 = [];
                for (var j = 0; j < Object.keys(data.vehiculos21[i]).length; j++) {
                    if (headerKeys.includes(Object.keys(data.vehiculos21[i])[j])) {
                        x2.push(Object.values(data.vehiculos21[i])[j])
                    }
                }
                emp2.push(x2);
            }
        } else {
            for (var i = 0; i < data.empresas.length; i++) {
                const x3 = [];
                for (var j = 0; j < Object.keys(data.empresas[i]).length; j++) {
                    if (headerKeys.includes(Object.keys(data.empresas[i])[j])) {
                        x3.push(Object.values(data.empresas[i])[j])
                    }
                }
                emp.push(x3);
            }
        }

        // console.log("empr",emp);
        const headerNames21 = isVehiculo ? pdfExport.columnsDet21[0].columns.filter((c) => c.Header !== "Action").map((column) => column.Header) : pdfExport.columnsDet[0].columns
            .filter((c) => c.Header !== "Action")
            .map((column) => column.Header);
        let header21 = headerNames21;

        const titleDet = isVehiculo ? pdfExport.columnsDet12[0].Header : pdfExport.columnsDet[0].Header;

        XlsxPopulate.fromBlankAsync().then(async (workbook) => {
            const sheet1 = workbook.sheet(0);

            const sheetData = getSheetData(emp, header);
            const sheetData21 = isVehiculo ? getSheetData(emp2, header21) : '';

            const totalColumns = sheetData[0].length;
            const totalFilas21 = parseInt(sheetData.length) + 7;

            // console.log(sheetData);
            sheet1.cell("A5").value(sheetData);
            isVehiculo ? sheet1.cell("A" + totalFilas21).value(sheetData21) : sheet1.cell("A5").value(sheetData);

            const range = sheet1.usedRange();
            const endColumn = String.fromCharCode(64 + totalColumns);
            const endColumnFech = String.fromCharCode(64 + totalColumns - 1);
            sheet1.cell("A1").value("Fecha de consulta: ");
            sheet1.cell("A2").value("Usuario: ");
            sheet1.cell("A3").value("Reporte : ");
            sheet1.cell("B3").value(titleDet);

            sheet1.cell("B1").value(finicio + " al " + ffinal);
            sheet1.cell("B2").value(user + " - " + new Date().toLocaleString());
            sheet1.row(1).style("bold", true);
            sheet1.row(2).style("bold", true);
            sheet1.row(3).style("bold", true);
            sheet1.row(4).style("bold", true);
            sheet1.row(5).style("bold", true);
            sheet1.range("A5:" + endColumn + "5").style("fill", "2E80BA");
            sheet1.range("A5:" + endColumn + "5").style("fontColor", "FFFFFF");
            sheet1.range("A5:" + endColumn + "5").style("verticalAlignment", "center");
            sheet1.range("A5:" + endColumn + "5").style("horizontalAlignment", "center");
            sheet1.range("A5:" + endColumn + "5").style("wrapText", true);
            sheet1.range("B3:" + endColumn + "3").merged(true);
            sheet1.range("B1:" + endColumn + "1").merged(true);
            sheet1.range("B2:" + endColumn + "2").merged(true);
            if (isVehiculo) {
                sheet1.range("A" + totalFilas21 + ":" + endColumn + totalFilas21).style("fill", "2E80BA");
                sheet1.range("A" + totalFilas21 + ":" + endColumn + totalFilas21).style("fontColor", "FFFFFF");
                sheet1.range("A" + totalFilas21 + ":" + endColumn + totalFilas21).style("verticalAlignment", "center");
                sheet1.range("A" + totalFilas21 + ":" + endColumn + totalFilas21).style("horizontalAlignment", "center");
                sheet1.range("A" + totalFilas21 + ":" + endColumn + totalFilas21).style("wrapText", true);
            }
            range.style("border", true);

            return workbook.outputAsync().then((res) => {
                saveAs(res, `${props}.xlsx`);
            });
        });
    }

    function getExportFileBlob({ headers, columns, data, fileType, fileName }) {

        if (fileType === "xlsx") {
            // XLSX
            const header = columns
                .filter((c) => c.Header !== "Action")
                .map((c) => c.exportValue);
            const compatibleData = data.map((row) => {
                const obj = {};
                header.forEach((col, index) => {
                    obj[col] = row[index];
                });
                return obj;
            });

            // console.log(compatibleData);
            let wb = XLSX.utils.book_new();
            let ws1 = XLSX.utils.json_to_sheet(compatibleData, {
                header
            });

            // let ws1 = XLSX.utils.json_to_sheet([{}, { A: 1, B: 2, C: 3, D: 4 }, { B: 2, E: 3 }], { header: ['X'] })
            // console.log(ws1);

            XLSX.utils.book_append_sheet(wb, ws1, "React Table Data");
            XLSX.writeFile(wb, `${fileName}.xlsx`);

            return false;
        }

        //PDF
        if (fileType === "pdf") {
            const title = columns[0].parent.Header;

            const headerNames = columns
                .filter((c) => c.Header !== "Action")
                .map((column) => column.exportValue);


            // const headerNamesResumen = columnsRes
            // .filter((c) => c.Header !== "Action")
            // .map((column) => column.exportValue);
            // console.log('columnasResumen', cole);


            const image = new Image();
            image.src = '/images/logo.png';
            const doc = new JsPDF('l', 'px', 'a4');
            doc.addImage(image, 'PNG', 10, 10, 260, 35);
            doc.text(title, 295, 70, { align: 'center' });
            doc.autoTable({
                head: [headerNames],
                body: data,
                styles: {
                    minCellHeight: 9,
                    halign: "center",
                    valign: "top",
                    fontSize: 9
                },
                startY: 80
            });
            // doc.autoTable({
            //     head: [headerNamesResumen],
            //     body: dataResumen,
            //     styles: {
            //         minCellHeight: 9,
            //         halign: "center",
            //         valign: "top",
            //         fontSize: 9
            //     },
            //     startY: 160
            // });

            doc.save(`${fileName}.pdf`);

            return false;
        }
        return false;
    }

    return (
        <>
            {isExportable &&
                <TableExport onClickPDF={() => exportPdf()} onClickExcel={() => saveAsExcel()} />
            }
            {isBuscador &&
                <TextField
                    size="small"
                    value={globalFilter || ''} // Utiliza el valor de globalFilter como valor del input
                    onChange={e => setGlobalFilter(e.target.value)} // Actualiza el globalFilter al cambiar el valor del input
                    placeholder="Buscar..."
                />
            }
            <TableContainer sx={{ maxWidth: window.innerWidth - 15 }} style={{ border: '1px solid #D2D2D2', borderRadius: '6px' }}>

                <MaUTable  {...getTableProps()} className={className} size={sizePro} stickyHeader aria-label="sticky table">

                    <TableHead>
                        {headerGroups.map(headerGroup => (
                            <TableRow
                                {...headerGroup.getHeaderGroupProps()}
                                align={headerGroup.alignHeader || 'center'}
                            >
                                {headerGroup.headers.map(column => (
                                    <TableCell
                                        {...column.getHeaderProps(column.getSortByToggleProps())}
                                        align={column.alignHeader || 'left'}
                                        style={{ background: '#EBEBEB', color: '#000', padding: headerGroup.padding }}
                                    >
                                        {column.render('Header')}
                                        {/* Agrega los indicadores de orden */}
                                        <span>
                                            {column.isSorted ? (column.isSortedDesc ? ' 🢃' : ' 🢁') : ''}
                                        </span>
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableHead>
                    <TableBody style={{ background: '#FFF' }}>
                        {page.map((row, i) => {
                            prepareRow(row);
                            return (
                                <TableRow hover {...row.getRowProps()}>
                                    {row.cells.map(cell => {
                                        return (
                                            <TableCell {...cell.getCellProps()} align={cell.column.alignBody || 'left'}>
                                                {cell.render('Cell')}
                                            </TableCell>
                                        )
                                    })}
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </MaUTable>
                {isPaginador && <div>
                    <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                        Anterior
                    </Button>
                    <span>
                        Página{' '}
                        <strong>
                            {pageIndex + 1} de {pageOptions.length}
                        </strong>{' '}
                    </span>
                    <Button onClick={() => nextPage()} disabled={!canNextPage}>
                        Siguiente
                    </Button>
                </div>
                }
            </TableContainer>
        </>
    )
}