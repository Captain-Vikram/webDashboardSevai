"use client";
import sampleData from "../data/sampleData.json";
import { useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
// Note: `jspdf` and `jspdf-autotable` are imported dynamically in `downloadPDF`



export function SampleDataTable() {
  const [showMenu, setShowMenu] = useState(false);

  const downloadPDF = async () => {
    try {
      // Dynamically import to avoid build-time module resolution errors
      // @ts-ignore - dynamic import to avoid build-time errors if package/types are not installed
      const { jsPDF } = await import('jspdf');
      // @ts-ignore - dynamic import to avoid build-time errors if package/types are not installed
      const autoTable = (await import('jspdf-autotable')).default;

      const doc = new jsPDF();

      // Add title
      doc.setFontSize(18);
      doc.text('User Transactions Report', 14, 22);

      // Add date
      doc.setFontSize(11);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 32);

      // Create table
      autoTable(doc, {
        startY: 40,
        head: [['ID', 'Name', 'Email', 'Status', 'Amount']],
        body: sampleData.map(row => [
          row.id,
          row.name,
          row.email,
          row.status,
          row.amount
        ]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 10 },
      });

      // Save the PDF
      doc.save('transactions.pdf');
    } catch (error) {
      console.error('PDF generation failed. Ensure `jspdf` and `jspdf-autotable` are installed.', error);
      // Fallback: alert user
      alert('PDF export is unavailable (missing dependencies).');
    } finally {
      setShowMenu(false);
    }
  };

  const downloadWord = () => {
    // Create Word document content (HTML format compatible with Word)
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head><meta charset='utf-8'><title>User Transactions</title></head>
      <body>
        <h1>User Transactions Report</h1>
        <table border="1" cellpadding="5" cellspacing="0">
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Status</th><th>Amount</th>
          </tr>
          ${sampleData.map(row => `
            <tr>
              <td>${row.id}</td>
              <td>${row.name}</td>
              <td>${row.email}</td>
              <td>${row.status}</td>
              <td>${row.amount}</td>
            </tr>
          `).join('')}
        </table>
      </body>
      </html>
    `;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.doc';
    a.click();
    URL.revokeObjectURL(url);
    setShowMenu(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Transactions</CardTitle>
        <CardDescription>A list of recent user transactions and their status</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Recent transaction data</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sampleData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    row.status === 'Active' ? 'bg-green-100 text-green-800' :
                    row.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {row.status}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">{row.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Download Button at Bottom Center */}
        <div className="flex justify-center mt-6">
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="group relative w-40 cursor-pointer overflow-hidden rounded-full border bg-background p-2 text-center font-semibold text-primary shadow-sm transition-colors duration-300"
            >
              <span className="relative z-20">
                Download
              </span>
              <div className="pointer-events-none absolute inset-0 bg-transparent transition-colors duration-300 group-hover:bg-black/10"></div>
            </button>
            {showMenu && (
              <div className="absolute bottom-full left-1/2 mb-2 w-48 -translate-x-1/2 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-30">
                <div className="py-1">
                  <button
                    onClick={downloadPDF}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Download as PDF
                  </button>
                  <button
                    onClick={downloadWord}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    Download as Word
                  </button>
                </div>
              </div>
            )}
          </div>
  </div>
      </CardContent>
    </Card>
  )
}