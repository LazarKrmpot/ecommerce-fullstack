// src/utils/pdf/generateOrderPDF.ts

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Order } from "@/models/order";
import logoImg from "@/assets/XtreamMotoShopBaner.jpg";

export const generateOrderPDF = (order: Order) => {
  const doc = new jsPDF();

  // --- BRAND COLORS ---
  const brandColor: [number, number, number] = [40, 116, 166];
  const lightGray: [number, number, number] = [240, 240, 240];

  // --- LOGO ---
  // Add logo image (fit in 40x18 area)

  if (logoImg) {
    try {
      doc.addImage(logoImg, "JPEG", 14, 10, 40, 18);
    } catch (e) {
      // fallback to placeholder if image fails
      console.error("Failed to load logo image:", e);
      doc.setFillColor(brandColor[0], brandColor[1], brandColor[2]);
      doc.rect(14, 10, 16, 16, "F");
      doc.setFontSize(16);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.text("MS", 18, 22);
      doc.setTextColor(0, 0, 0);
    }
  }

  // --- COMPANY INFO ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
  doc.text("MotoShop", 60, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text("Your one-stop shop for all your motorcycle needs", 60, 23);
  doc.text("support@motoshop.com", 60, 28);
  doc.setTextColor(0, 0, 0);

  // --- HEADER ---
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("Order Summary", 105, 38, { align: "center" });

  doc.setDrawColor(brandColor[0], brandColor[1], brandColor[2]);
  doc.setLineWidth(1);
  doc.line(14, 42, 196, 42);

  const createdAt = new Date(order.createdAt).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const updatedAt = new Date(order.updatedAt).toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const status = order.status || "N/A";

  const fullName =
    order.orderedByUser?.name ||
    `${order.deliveryAddress.firstName} ${order.deliveryAddress.lastName}`;

  const email = order.orderedByUser?.email || order.deliveryAddress.email;
  const addr = order.deliveryAddress;

  // --- ORDER INFO ---
  let y = 48;
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Order ID: ${order._id}`, 14, y);
  doc.text(`Created: ${createdAt}`, 14, y + 6);
  doc.text(`Updated: ${updatedAt}`, 14, y + 12);
  doc.text(`Status: ${status}`, 14, y + 18);
  y += 24;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(14, y, 196, y);
  y += 8;

  // --- CUSTOMER ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
  doc.text("Customer Information", 14, y);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${fullName}`, 14, y + 6);
  doc.text(`Email: ${email}`, 14, y + 12);
  y += 18;

  if (!order.orderedByUser) {
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("(Guest user – not registered)", 14, y);
    doc.setTextColor(0);
    y += 8;
  }

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(14, y, 196, y);
  y += 8;

  // --- SHIPPING ---
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
  doc.text("Shipping Address", 14, y);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`${addr.address}`, 14, y + 6);
  doc.text(`${addr.city}, ${addr.state}`, 14, y + 12);
  doc.text(
    `${addr.zipcode || addr.postalCode || ""}, ${addr.country}`,
    14,
    y + 18
  );
  let shippingEndY = y + 24;
  if (addr.phoneNumber) {
    doc.text(`Phone: ${addr.phoneNumber}`, 14, y + 24);
    shippingEndY += 6;
  }
  // Add shipping method here
  if (order.shippingMethod) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
    doc.text(`Shipping Method: ${order.shippingMethod}`, 14, shippingEndY);
    doc.setTextColor(0, 0, 0);
    shippingEndY += 8;
  }

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(14, shippingEndY, 196, shippingEndY);

  // --- ORDER NOTES ---
  // (Removed: order.notes, not present in Order model)
  const itemsTableStartY = shippingEndY + 8;
  autoTable(doc, {
    startY: itemsTableStartY,
    head: [["Product Name (ID)", "Quantity", "Unit Price", "Total"]],
    body: order.orderedItems.map((item) => [
      `${item.productId.name}\n(${item.productId._id})`,
      item.quantity.toString(),
      `$${item.productId.price.toFixed(2)}`,
      `$${(item.productId.price * item.quantity).toFixed(2)}`,
    ]),
    styles: {
      cellPadding: 3,
      fontSize: 10,
      valign: "middle",
      lineColor: 220,
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: brandColor,
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 11,
    },
    alternateRowStyles: {
      fillColor: lightGray,
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { halign: "center" },
      2: { halign: "right" },
      3: { halign: "right" },
    },
    margin: { left: 14, right: 14 },
    tableLineColor: 200,
    tableLineWidth: 0.2,
    didParseCell: function (data) {
      if (data.section === "head") {
        if (data.column.index === 2 || data.column.index === 3) {
          data.cell.styles.halign = "right";
        }
        if (data.column.index === 1) {
          data.cell.styles.halign = "center";
        }
      }
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const finalY = (doc as any).lastAutoTable?.finalY ?? itemsTableStartY + 20;
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
  doc.text(`Total to Pay: $${order.priceToPay.toFixed(2)}`, 14, finalY + 12);
  doc.setTextColor(0, 0, 0);

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.5);
  doc.line(14, finalY + 16, 196, finalY + 16);

  // --- THANK YOU & SUPPORT ---
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(brandColor[0], brandColor[1], brandColor[2]);
  doc.text("Thank you for your order!", 14, finalY + 24);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(
    "If you have any questions, contact support@motoshop.com",
    14,
    finalY + 30
  );
  doc.setTextColor(0, 0, 0);

  // --- FOOTER ---
  const year = new Date().getFullYear();
  doc.setFontSize(9);
  doc.setTextColor(150);
  doc.text(
    `© ${year} MotoShop. All rights reserved. www.motoshop.com`,
    105,
    287,
    { align: "center" }
  );
  doc.setTextColor(0, 0, 0);

  // --- SAVE FILE ---
  doc.save(`Order_${order._id}.pdf`);
};
