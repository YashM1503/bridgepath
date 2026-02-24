import type { PipelineOutput } from "@/schemas/intake";

declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: Record<string, unknown>) => void;
    lastAutoTable: { finalY: number };
  }
}

export async function exportToPDF(output: PipelineOutput, userName?: string): Promise<void> {
  const { jsPDF } = await import("jspdf");
  await import("jspdf-autotable");

  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = doc.internal.pageSize.getWidth();
  const margin = 14;
  let y = 0;

  // Colors
  const navy = [27, 79, 114] as [number, number, number];
  const accentBlue = [56, 152, 208] as [number, number, number];
  const gray = [107, 114, 128] as [number, number, number];
  const lightGray = [243, 244, 246] as [number, number, number];

  function addPage() {
    doc.addPage();
    y = 20;
  }

  function checkPageBreak(needed: number) {
    if (y + needed > 270) addPage();
  }

  // ─── Cover Header ────────────────────────────────────────────────────────
  doc.setFillColor(...navy);
  doc.rect(0, 0, W, 50, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("BridgePath", margin, 22);

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("Your First 30 Days, Handled.", margin, 30);

  doc.setFontSize(9);
  doc.setTextColor(180, 200, 220);
  doc.text(`Generated: ${new Date(output.generatedAt).toLocaleDateString()}`, margin, 40);
  if (userName) doc.text(`Prepared for: ${userName}`, margin, 45);

  y = 60;

  // ─── Disclaimer ──────────────────────────────────────────────────────────
  doc.setFillColor(...lightGray);
  doc.roundedRect(margin, y, W - margin * 2, 18, 2, 2, "F");
  doc.setFontSize(7.5);
  doc.setTextColor(...gray);
  doc.setFont("helvetica", "italic");
  const disclaimerLines = doc.splitTextToSize(output.disclaimer, W - margin * 2 - 4);
  doc.text(disclaimerLines.slice(0, 3), margin + 2, y + 5);
  y += 24;

  // ─── Profile Summary ─────────────────────────────────────────────────────
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...navy);
  doc.text("Your Profile", margin, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  doc.text(`Corridor: ${output.profile.corridorId.toUpperCase()}`, margin, y);
  y += 5;
  doc.text(`Risk Level: ${output.profile.riskLevel.toUpperCase()}`, margin, y);
  y += 5;
  doc.text(`Primary Constraint: ${output.profile.primaryConstraint}`, margin, y);
  y += 12;

  // ─── Pathways ────────────────────────────────────────────────────────────
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...navy);
  doc.text("Transition Pathways", margin, y);
  y += 8;

  output.pathways.forEach((pathway, idx) => {
    checkPageBreak(50);

    if (pathway.recommended) {
      doc.setFillColor(...accentBlue);
      doc.roundedRect(margin, y - 2, W - margin * 2, 4, 1, 1, "F");
      doc.setFontSize(7);
      doc.setTextColor(255, 255, 255);
      doc.text("★ RECOMMENDED", margin + 2, y + 1);
      y += 5;
    }

    doc.setFillColor(...(idx % 2 === 0 ? lightGray : [255, 255, 255] as [number, number, number]));
    const cardH = 42;
    doc.roundedRect(margin, y, W - margin * 2, cardH, 2, 2, "F");

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...navy);
    doc.text(`${idx + 1}. ${pathway.name}`, margin + 3, y + 7);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text(pathway.tagline, margin + 3, y + 13);

    // Score bars (text)
    const scores = [
      ["Cost", pathway.scores.cost],
      ["Speed", pathway.scores.speed],
      ["Access", pathway.scores.access],
      ["Risk", pathway.scores.risk],
    ] as [string, number][];

    const colW = (W - margin * 2 - 6) / 4;
    scores.forEach(([label, score], si) => {
      const sx = margin + 3 + si * colW;
      doc.setFontSize(7);
      doc.setTextColor(...gray);
      doc.text(label, sx, y + 21);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...navy);
      doc.text(`${score}/100`, sx, y + 28);
    });

    doc.setFontSize(7.5);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(200, 100, 0);
    doc.text(`⚠ ${pathway.verifyNote}`, margin + 3, y + 37);

    y += cardH + 4;
  });

  // ─── Risk Flags ──────────────────────────────────────────────────────────
  checkPageBreak(40);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...navy);
  doc.text("Risk Flags & Mitigations", margin, y);
  y += 8;

  const riskTableData = output.riskFlags.map((flag) => [
    flag.severity.toUpperCase(),
    flag.title,
    flag.mitigation.slice(0, 100) + (flag.mitigation.length > 100 ? "..." : ""),
  ]);

  doc.autoTable({
    startY: y,
    head: [["Severity", "Risk", "Mitigation"]],
    body: riskTableData,
    margin: { left: margin, right: margin },
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: navy, textColor: [255, 255, 255], fontStyle: "bold" },
    columnStyles: { 0: { cellWidth: 18 }, 1: { cellWidth: 50 } },
    alternateRowStyles: { fillColor: lightGray },
  });

  y = doc.lastAutoTable.finalY + 10;

  // ─── 30-Day Checklist ────────────────────────────────────────────────────
  checkPageBreak(40);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...navy);
  doc.text("30-Day Action Plan", margin, y);
  y += 8;

  [1, 2, 3, 4].forEach((week) => {
    const weekItems = output.checklist.filter((c) => c.week === week);
    if (!weekItems.length) return;

    checkPageBreak(20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...navy);
    doc.text(`Week ${week}`, margin, y);
    y += 5;

    const weekData = weekItems.map((item) => [
      item.priority === "critical" ? "●" : item.priority === "high" ? "◐" : "○",
      item.task,
      item.category,
    ]);

    doc.autoTable({
      startY: y,
      body: weekData,
      margin: { left: margin, right: margin },
      styles: { fontSize: 8, cellPadding: 2.5 },
      columnStyles: { 0: { cellWidth: 8 }, 2: { cellWidth: 20 } },
      alternateRowStyles: { fillColor: lightGray },
    });

    y = doc.lastAutoTable.finalY + 6;
  });

  // ─── Templates TOC ───────────────────────────────────────────────────────
  checkPageBreak(30);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...navy);
  doc.text("Document Templates Included", margin, y);
  y += 8;

  output.templates.forEach((template) => {
    checkPageBreak(10);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50, 50, 50);
    doc.text(`• ${template.title}`, margin, y);
    y += 4;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text(template.description, margin + 4, y);
    y += 6;
  });

  // ─── Footer on each page ─────────────────────────────────────────────────
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(...gray);
    doc.text(
      `BridgePath — General information only. Not financial, legal, or immigration advice. Verify all information with providers. Page ${i}/${pageCount}`,
      margin,
      287
    );
  }

  doc.save(`BridgePath-Plan-${new Date().toISOString().slice(0, 10)}.pdf`);
}
