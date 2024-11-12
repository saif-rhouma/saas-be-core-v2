/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer';
@Injectable()
export class PdfService {
  // async generatePdf(htmlContent: string, outputFilePath: string): Promise<string> {
  //   return new Promise((resolve, reject) => {
  //     const doc = new jsPDF();
  //     doc.html(htmlContent, {
  //       callback: function (doc) {
  //         const pdfBuffer = doc.output('arraybuffer');
  //         return Buffer.from(pdfBuffer); // return the PDF buffer
  //       },
  //       x: 10,
  //       y: 10,
  //     });
  //   });
  // }

  async generatePdf(htmlContent: string, outputFilePath: string): Promise<string> {
    const browser = await puppeteer.launch({
      executablePath: '/usr/bin/chromium-browser',
      ignoreDefaultArgs: ['--disable-extensions'],
    });
    const page = await browser.newPage();

    // Set the content of the page to the provided HTML
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

    // Generate the PDF and save it to the file system
    await page.pdf({ path: outputFilePath, format: 'A4' });

    // Close the browser after generating the PDF
    await browser.close();

    // Return the path to the saved PDF file
    return outputFilePath;
  }
}
