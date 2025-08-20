'use client';

import React from 'react';
import { Button } from '../ui/button';
import { FileDown } from 'lucide-react';
import moment from 'moment';
import { useRate } from '@/hooks/useRate';

interface Props {
  createdAt: Date;
  id?: string;
  courseTitle: string;
  currency?: string;
  price?: number;
}

const DownloadOrderPDF = ({ createdAt, id, courseTitle, currency, price }: Props) => {
  const handleDownload = () => {
    const newWindow = window.open('', '', 'width=800,height=600');
    const { rate } = useRate();

    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Orden de compra - Finanflix</title>
            <style>
              body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #333;
              }
              .container {
                width: 80%;
                max-width: 800px;
                margin: 20px auto;
                padding: 30px;
                background-color: #BCBCBC;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
              }
              .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 2px solid #e3e3e3;
                padding-bottom: 15px;
              }
              .header img {
                width: 120px;
              }
              .header .date {
                font-size: 14px;
                color: #888;
              }
              h1, h2 {
                font-size: 24px;
                color: #444;
                margin-top: 20px;
              }
              h2 {
                font-size: 20px;
                color: #555;
                border-bottom: 2px solid #ccc;
                padding-bottom: 5px;
              }
              p {
                font-size: 14px;
                line-height: 1.6;
                margin: 10px 0;
                color: #666;
              }
              .table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
              }
              .table th, .table td {
                padding: 12px;
                border: 1px solid #ddd;
                text-align: left;
              }
              .table th {
                background-color: #f9f9f9;
                color: #555;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #777;
                border-top: 1px solid #e3e3e3;
                padding-top: 10px;
              }
              .footer p {
                margin: 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <img src="https://res.cloudinary.com/drlottfhm/image/upload/v1750703510/logof_iwnccv.png" alt="Finanflix Logo">
                <div class="date">
                  <p>Fecha: <strong>${moment(createdAt).format('MMMM DD, YYYY')}</strong></p>
                </div>
              </div>

              <h1>Detalles de la Orden</h1>
              
              <h2>Resumen de la Compra</h2>
              <p>Gracias por elegir Finanflix. A continuación, encontrarás los detalles de tu orden reciente, que incluye los servicios que has reservado y los costos asociados.</p>
              <p>Nos complace acompañarte en este camino.</p>

              <h2>Detalles de la Orden</h2>
              <table class="table">
                <tr>
                  <th>Order ID</th>
                  <td>${id?.toString()}</td>
                </tr>
                <tr>
                  <th>Vendedor</th>
                  <td>Finanflix</td>
                </tr>
                <tr>
                  <th>Compra</th>
                  <td>${courseTitle}</td>
                </tr>
                <tr>
                  <th>Precio</th>
                  <td>${currency === 'USD' ? 'USD' : 'ARS'} - ${
        currency === 'USD' ? price : price! * Number(rate)
      }</td>
                </tr>
              </table>

              <h2>Soporte</h2>
              <p>Si tienes algún problema o pregunta, no dudes en ponerte en contacto con nosotros. Estamos aquí para ayudarte con cualquier inquietud.</p>

              <div class="footer">
                <p>© 2025 Finanflix. Todos los derechos reservados.</p>
              </div>
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
      newWindow.focus();
      newWindow.print();
      newWindow.close();
    }
  };

  return (
    <div>
      <Button onClick={handleDownload}>
        <FileDown className="mr-2 h-4 w-4" />

        <span className="text-[12px]">Descargar PDF</span>
      </Button>
    </div>
  );
};

export default DownloadOrderPDF;
