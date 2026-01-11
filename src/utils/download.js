import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/* Date */
const getFileTimestamp = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}_${String(d.getHours()).padStart(2, "0")}-${String(
    d.getMinutes()
  ).padStart(2, "0")}-${String(d.getSeconds()).padStart(2, "0")}`;
};

const getDisplayTime = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
};

/* Capture element */
const captureElement = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Element not found");

  // Compute summary
  const rows = element.querySelectorAll("tbody tr");
  const totalEmployees = rows.length;
  let activeCount = 0;
  rows.forEach((row) => {
    const toggle = row.querySelector("button");
    if (toggle?.className.includes("bg-indigo-600")) activeCount++;
  });
  const inactiveCount = totalEmployees - activeCount;

  return html2canvas(element, {
    scale: 2,
    backgroundColor: "#ffffff",
    useCORS: true,
    scrollX: -window.scrollX,
    scrollY: -window.scrollY,
    onclone: (clonedDoc) => {
      const root = clonedDoc.getElementById(elementId);
      if (!root) return;

      /* Fix Tailwind oklch colors */
      root.querySelectorAll("*").forEach((el) => {
        const style = getComputedStyle(el);
        if (style.color?.includes("oklch")) el.style.color = "#000";
        if (style.backgroundColor?.includes("oklch"))
          el.style.backgroundColor = "#fff";
      });

      /* Add header timestamp */
      const header = clonedDoc.createElement("div");
      header.innerText = `Downloaded on: ${getDisplayTime()}`;
      header.style.textAlign = "center";
      header.style.fontWeight = "bold";
      header.style.fontSize = "20px";
      header.style.lineHeight = "28px";
      header.style.letterSpacing = "0.5px";
      header.style.margin = "12px 0";
      root.prepend(header);

      /* Remove actions column */
      const table = root.querySelector("table");
      if (table) {
        table.querySelectorAll("tr").forEach((row) => {
          if (row.children.length > 0) {
            row.removeChild(row.lastElementChild);
          }
        });
      }

      /* Replace toggle with active / inactive */
      root.querySelectorAll("button").forEach((btn) => {
        const td = btn.closest("td");
        if (!td) {
          btn.style.display = "none";
          return;
        }
        if (btn.offsetWidth >= 40 && btn.offsetWidth <= 60) {
          const isActive = btn.className.includes("bg-indigo-600");
          const status = clonedDoc.createElement("span");
          status.innerText = isActive ? "Active" : "Inactive";
          status.style.fontWeight = "bold";
          status.style.color = isActive ? "green" : "red";
          td.innerHTML = "";
          td.appendChild(status);
        } else {
          btn.style.display = "none";
        }
      });

      /* Adding summary at bottom left with bigger font and extra margin */
      const summaryDiv = clonedDoc.createElement("div");
      summaryDiv.innerHTML = `
        <p><b>Total Employees:</b> ${totalEmployees}</p>
        <p><b>Active Employees:</b> ${activeCount}</p>
        <p><b>Inactive Employees:</b> ${inactiveCount}</p>
      `;
      summaryDiv.style.marginTop = "20px";      // extra space above
      summaryDiv.style.marginBottom = "40px";   // extra space at bottom to prevent cutting
      summaryDiv.style.textAlign = "left";
      summaryDiv.style.fontWeight = "bold";
      summaryDiv.style.fontSize = "20px";       // increased font
      summaryDiv.style.lineHeight = "1.5em";

      root.appendChild(summaryDiv);
    },
  });
};

/* Img download */
export const downloadAsImage = async (elementId) => {
  try {
    const canvas = await captureElement(elementId);

    const MARGIN_LEFT = 20;
    const MARGIN_RIGHT = 20;
    const MARGIN_TOP = 10;
    const MARGIN_BOTTOM = 60; // increased bottom margin for summary

    const finalCanvas = document.createElement("canvas");
    finalCanvas.width = canvas.width + MARGIN_LEFT + MARGIN_RIGHT;
    finalCanvas.height = canvas.height + MARGIN_TOP + MARGIN_BOTTOM;

    const ctx = finalCanvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
    ctx.drawImage(canvas, MARGIN_LEFT, MARGIN_TOP);

    const link = document.createElement("a");
    link.download = `employees-dashboard_${getFileTimestamp()}.png`;
    link.href = finalCanvas.toDataURL("image/png");
    link.click();
  } catch (err) {
    console.error("Image download failed", err);
    alert("Failed to download image");
  }
};

/* PDF download */
export const downloadAsPDF = async (elementId) => {
  try {
    const canvas = await captureElement(elementId);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const PAGE_WIDTH = pdf.internal.pageSize.getWidth();
    const PAGE_HEIGHT = pdf.internal.pageSize.getHeight();

    const MARGIN_LEFT = 15;
    const MARGIN_RIGHT = 15;
    const MARGIN_TOP = 10;
    const MARGIN_BOTTOM = 10; // Increased bottom margin for extra space
    const usableWidth = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;

    // Compute image height to fit PDF width
    const imgHeight = (canvas.height * usableWidth) / canvas.width;

    // Ensure image doesn't overlap bottom margin
    const finalHeight = Math.min(imgHeight, PAGE_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM);

    pdf.addImage(imgData, "PNG", MARGIN_LEFT, MARGIN_TOP, usableWidth, finalHeight);

    pdf.save(`employees-dashboard_${getFileTimestamp()}.pdf`);
  } catch (err) {
    console.error("PDF download failed", err);
    alert("Failed to download PDF");
  }
};
