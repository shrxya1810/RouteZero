import React from 'react';
import jsPDF from 'jspdf';

interface CarbonReceiptData {
  orderNumber: string;
  date: string;
  customerName: string;
  deliveryAddress: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  shippingCost: number;
  total: number;
  routeType: string;
  carbonEmissionsSaved: number;
  estimatedDeliveryTime: string;
  ecoPointsEarned: number;
}

interface Props {
  receiptData: CarbonReceiptData;
  onGenerate?: () => void;
}

const CarbonReceiptGenerator: React.FC<Props> = ({ receiptData, onGenerate }) => {
  // Calculate tree equivalent (1 tree absorbs ~22kg CO2 per year)
  const treesEquivalent = Math.round((receiptData.carbonEmissionsSaved / 22) * 100) / 100;
  
  // Debug: log the receipt data
  console.log('CarbonReceiptGenerator received data:', receiptData);

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Header with company logo area
      doc.setFillColor(0, 113, 220); // Walmart blue
      doc.rect(0, 0, pageWidth, 35, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text('CARBON IMPACT RECEIPT', pageWidth / 2, 15, { align: 'center' });
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('RouteZero - Sustainable Delivery Solutions', pageWidth / 2, 25, { align: 'center' });

      // Reset text color
      doc.setTextColor(0, 0, 0);
      
      // Order details section
      let yPosition = 50;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('ORDER DETAILS', 20, yPosition);
      
      // Add a line under the header
      doc.setDrawColor(0, 113, 220);
      doc.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
      
      yPosition += 12;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      
      // Order details in a more structured format
      const orderDetails = [
        ['Order Number:', receiptData.orderNumber],
        ['Date:', receiptData.date],
        ['Customer:', receiptData.customerName],
        ['Delivery Address:', receiptData.deliveryAddress]
      ];
      
      orderDetails.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 85, yPosition);
        yPosition += 10;
      });
      
      // Items section with table-like formatting
      yPosition += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('ITEMS ORDERED', 20, yPosition);
      doc.line(20, yPosition + 2, pageWidth - 20, yPosition + 2);
      
      yPosition += 12;
      doc.setFontSize(11);
      
      // Table headers
      doc.setFont('helvetica', 'bold');
      doc.text('Item', 20, yPosition);
      doc.text('Qty', 110, yPosition);
      doc.text('Price', 135, yPosition);
      doc.text('Total', pageWidth - 30, yPosition, { align: 'right' });
      
      yPosition += 10;
      doc.setFont('helvetica', 'normal');
      
      // Items with better formatting
      receiptData.items.forEach((item) => {
        doc.text(item.name, 20, yPosition);
        doc.text(item.quantity.toString(), 110, yPosition);
        doc.text(`Rs ${item.price.toFixed(2)}`, 135, yPosition);
        doc.text(`Rs ${(item.price * item.quantity).toFixed(2)}`, pageWidth - 30, yPosition, { align: 'right' });
        yPosition += 10;
      });
      
      // Totals section
      yPosition += 15;
      doc.line(110, yPosition, pageWidth - 20, yPosition);
      yPosition += 10;
      
      const totals = [
        ['Subtotal:', `Rs ${receiptData.subtotal.toFixed(2)}`],
        [`Shipping (${receiptData.routeType}):`, `Rs ${receiptData.shippingCost.toFixed(2)}`],
        ['TOTAL:', `Rs ${receiptData.total.toFixed(2)}`]
      ];
      
      totals.forEach(([label, value], index) => {
        if (index === totals.length - 1) {
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(12);
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(11);
        }
        doc.text(label, 110, yPosition);
        doc.text(value, pageWidth - 30, yPosition, { align: 'right' });
        yPosition += 10;
      });
      
      // Environmental Impact section - professional box
      yPosition += 20;
      doc.setFillColor(240, 253, 244); // Light green background
      doc.rect(15, yPosition - 5, pageWidth - 30, 70, 'F');
      doc.setDrawColor(34, 197, 94); // Green border
      doc.setLineWidth(1);
      doc.rect(15, yPosition - 5, pageWidth - 30, 70, 'S');
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 101, 52); // Dark green
      doc.text('ENVIRONMENTAL IMPACT', 20, yPosition + 8);
      
      yPosition += 20;
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      
      const environmentalData = [
        ['Route Type:', receiptData.routeType],
        ['Carbon Emissions Saved:', `${receiptData.carbonEmissionsSaved} kg CO2`],
        ['Trees Equivalent:', `${treesEquivalent} trees per year`],
        ['Eco Points Earned:', `${receiptData.ecoPointsEarned} points`],
        ['Estimated Delivery:', receiptData.estimatedDeliveryTime]
      ];
      
      environmentalData.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.text(label, 20, yPosition);
        doc.setFont('helvetica', 'normal');
        doc.text(value, 110, yPosition);
        yPosition += 10;
      });
      
      // Thank you message
      yPosition += 20;
      doc.setFillColor(255, 247, 237); // Light orange background
      doc.rect(15, yPosition - 5, pageWidth - 30, 30, 'F');
      doc.setDrawColor(251, 191, 36); // Orange border
      doc.rect(15, yPosition - 5, pageWidth - 30, 30, 'S');
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(146, 64, 14); // Dark orange
      doc.text('Thank you for choosing eco-friendly delivery!', pageWidth / 2, yPosition + 8, { align: 'center' });
      
      yPosition += 18;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(92, 92, 92);
      doc.text('Every eco-friendly choice makes a difference for our planet.', pageWidth / 2, yPosition, { align: 'center' });
      
      // Footer
      yPosition = pageHeight - 25;
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text('Generated by RouteZero - Sustainable Delivery Solutions', pageWidth / 2, yPosition, { align: 'center' });
      doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition + 8, { align: 'center' });
      
      // Save the PDF
      doc.save(`carbon-receipt-${receiptData.orderNumber}.pdf`);
      
      if (onGenerate) {
        onGenerate();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  return (
    <button
      onClick={generatePDF}
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
    >
      <span>📄</span>
      Download Carbon Receipt
    </button>
  );
};

export default CarbonReceiptGenerator;