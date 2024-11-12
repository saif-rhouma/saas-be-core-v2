/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import * as pdf from 'html-pdf';

@Injectable()
export class PdfService {
  async generatePdf(htmlContent: string, outputFilePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const options = {
        phantomPath: './node_modules/phantomjs/bin/phantomjs',
        format: 'A4',
        orientation: 'portrait',
        border: '10mm',
      };

      pdf.create(htmlContent, options).toFile(outputFilePath, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.filename);
        }
      });
    });
  }
}
