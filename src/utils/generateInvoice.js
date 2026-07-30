import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function generateInvoice(order) {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("Sweetly Sweet", 14, 18);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Premium Handmade Chocolates", 14, 25);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("INVOICE", 150, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  doc.text(`Invoice #: ${String(order.id).padStart(6, "0")}`, 14, 40);
  doc.text(
    `Order Date: ${new Date(order.createdAt).toLocaleDateString("en-IN")}`,
    14,
    47
  );

  doc.text("Customer", 14, 62);

  doc.setFontSize(10);

  doc.text(order.fullName || "", 14, 69);
  doc.text(order.phone || "", 14, 75);

  doc.text(
    `${order.street}, ${order.city}`,
    14,
    81
  );

  doc.text(
    `${order.state} - ${order.pincode}`,
    14,
    87
  );

  autoTable(doc, {
    startY: 100,

    head: [["Product", "Qty", "Price", "Total"]],

    body: order.items.map((item) => [
      item.productName,
      item.quantity,
      `₹${Number(item.priceAtPurchase).toFixed(2)}`,
      `₹${(item.quantity * item.priceAtPurchase).toFixed(2)}`
    ]),

    styles: {
      fontSize: 10,
    },

    headStyles: {
      fillColor: [45, 110, 48],
    },
  });

  const y = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(12);

  doc.text(
    `Payment Status: ${order.paymentStatus}`,
    14,
    y
  );

  doc.text(
    `Order Status: ${order.orderStatus.replaceAll("_", " ")}`,
    14,
    y + 8
  );

  doc.setFont("helvetica", "bold");

  doc.text(
    `Grand Total: ₹${Number(order.totalAmount).toFixed(2)}`,
    14,
    y + 22
  );

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    "Thank you for shopping with Sweetly Sweet!",
    14,
    y + 40
  );

  doc.save(`Invoice-${order.id}.pdf`);
}