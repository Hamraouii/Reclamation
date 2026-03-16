import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as html2pdf from 'html2pdf.js';


@Injectable({
  providedIn: 'root'
})
export class PdfService {

  generatePDF(tableId: string) {
    const element = document.getElementById(tableId);
    html2pdf().from(element).save('table.pdf');
   
  }
}
