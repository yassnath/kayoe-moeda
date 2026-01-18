import { NextResponse } from "next/server";
import { utils, write } from "xlsx";
import { Document, Page, StyleSheet, Text, renderToBuffer } from "@react-pdf/renderer";

export type ReportRow = Record<string, string | number | null>;

export const toCsv = (rows: ReportRow[]) => {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = rows.map((row) =>
    headers.map((h) => JSON.stringify(row[h] ?? "")).join(",")
  );
  return [headers.join(","), ...lines].join("\n");
};

export const toXlsx = (rows: ReportRow[], sheetName = "Report") => {
  const ws = utils.json_to_sheet(rows);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, sheetName);
  return write(wb, { type: "buffer", bookType: "xlsx" }) as Buffer;
};

export const toPdf = async (
  rows: ReportRow[],
  title: string
): Promise<Buffer> => {
  const styles = StyleSheet.create({
    page: { padding: 24, fontSize: 10 },
    title: { fontSize: 14, marginBottom: 12 },
    row: { marginBottom: 6 },
    label: { fontWeight: "bold" },
  });

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        {rows.map((row, idx) => (
          <Text key={idx} style={styles.row}>
            {Object.entries(row)
              .map(([key, value]) => `${key}: ${value ?? "-"}`)
              .join(" | ")}
          </Text>
        ))}
      </Page>
    </Document>
  );
  return renderToBuffer(doc);
};

export const buildResponse = ({
  content,
  format,
  filename,
  meta,
}: {
  content: string | Buffer;
  format: "csv" | "xlsx" | "pdf";
  filename: string;
  meta?: string;
}) => {
  const mime =
    format === "csv"
      ? "text/csv"
      : format === "xlsx"
      ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      : "application/pdf";

  return new NextResponse(content, {
    headers: {
      "Content-Type": mime,
      "Content-Disposition": `attachment; filename="${filename}"`,
      ...(meta ? { "x-report-meta": meta } : {}),
    },
  });
};
