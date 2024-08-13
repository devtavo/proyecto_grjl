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
import TableExport from './TableExport';
import TableContainer from '@mui/material/TableContainer';
import { useTable } from 'react-table';
import Button from '@mui/material/Button';
import { exportExcel } from './Export.js';
import { useState, useEffect } from 'react';
import { saveAs } from 'file-saver';
import XlsxPopulate from "xlsx-populate";

const today = new Date();

const DEFAULT_SIZE_TABLE = 'small';

export default function Export({ props,isExportable = false, isReporte = false, isVehiculo = false, sizePro = DEFAULT_SIZE_TABLE, columns, data, pdfExport,isDisabled, inicio, final, className }) {

    const user = JSON.parse(localStorage.getItem('user')).usuario;

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

    async function saveAsExcel() {

        var data = pdfExport.excel;
        var cabecera=pdfExport.alertaId;
        var finicio = pdfExport.inicio;
        // var ffinal = pdfExport.final ? pdfExport.final : final;
        const headerNames = pdfExport.columnsAler[0].columns.filter((c) => c.Header !== "Action").map((column) => column.Header);
        let header = headerNames;

        const titleDet = pdfExport.columnsAler[0].Header;

        XlsxPopulate.fromBlankAsync().then(async (workbook) => {
            const sheet1 = workbook.sheet(0);

            const sheetData = getSheetData(data, header);

            const totalColumns = sheetData[0].length;

            sheet1.cell("A5").value(sheetData);

            const range = sheet1.usedRange();
            const endColumn = String.fromCharCode(64 + totalColumns);
            const endColumnFech = String.fromCharCode(64 + totalColumns - 1);
            sheet1.cell("A1").value("Fecha de consulta: ");
            sheet1.cell("A2").value("Usuario: ");
            sheet1.cell("A3").value("Reporte : ");
            sheet1.cell("B3").value(titleDet);

            sheet1.cell("B1").value(finicio);
            sheet1.cell("B2").value(user + " - " + new Date().toLocaleString());
            // sheet1.cell("B2").value();
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
            range.style("border", true);

            return workbook.outputAsync().then((res) => {
                saveAs(res, `${props}.xlsx`);
            });
        });
    }

    return (
        <>
            {isExportable &&
                <TableExport  isDisabled={isDisabled} onClickExcel={() => saveAsExcel()} />
            }

          
        </>
    )
}