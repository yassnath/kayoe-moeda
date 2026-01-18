import { NextResponse } from "next/server";
import { utils, write } from "xlsx";
import {
  Document,
  Page,
  StyleSheet,
  Text,
  View,
  renderToBuffer,
} from "@react-pdf/renderer";

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

const headerLabels: Record<string, string> = {
  orderCode: "Order",
  customer: "Customer",
  email: "Email",
  phone: "Phone",
  total: "Total",
  paymentStatus: "Payment",
  shippingStatus: "Status",
  createdAt: "Created",
};

const headerAlign: Record<string, "left" | "right" | "center"> = {
  total: "right",
  paymentStatus: "center",
  shippingStatus: "center",
};

const headerWidth: Record<string, number> = {
  orderCode: 90,
  customer: 70,
  email: 120,
  phone: 80,
  total: 60,
  paymentStatus: 60,
  shippingStatus: 70,
  createdAt: 80,
};

const getColumnWidth = (key: string) => headerWidth[key] ?? 70;

export const toPdf = async (
  rows: ReportRow[],
  title: string
): Promise<Buffer> => {
  const headers = rows.length > 0 ? Object.keys(rows[0]) : [];
  const styles = StyleSheet.create({
    page: { padding: 24, fontSize: 10 },
    title: { fontSize: 14, marginBottom: 12 },
    empty: { fontSize: 10, color: "#6b7280" },
    table: {
      borderWidth: 1,
      borderColor: "#E6E0D7",
      borderRadius: 6,
      overflow: "hidden",
    },
    headerRow: {
      flexDirection: "row",
      backgroundColor: "#F6F1E8",
      borderBottomWidth: 1,
      borderBottomColor: "#E6E0D7",
    },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#EFE8DF",
    },
    cell: {
      paddingVertical: 6,
      paddingHorizontal: 8,
      fontSize: 8,
      color: "#1F1A17",
    },
    headerCell: {
      fontSize: 8,
      fontWeight: "bold",
      color: "#6B5A4D",
      paddingVertical: 6,
      paddingHorizontal: 8,
    },
    cellRight: { textAlign: "right" },
    cellCenter: { textAlign: "center" },
  });

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        {rows.length === 0 ? (
          <Text style={styles.empty}>Tidak ada data untuk periode ini.</Text>
        ) : (
          <View style={styles.table}>
            <View style={styles.headerRow}>
              {headers.map((header) => {
                const alignStyle =
                  headerAlign[header] === "right"
                    ? styles.cellRight
                    : headerAlign[header] === "center"
                    ? styles.cellCenter
                    : undefined;
                return (
                <Text
                  key={header}
                  style={[
                    styles.headerCell,
                    { width: getColumnWidth(header) },
                    alignStyle,
                  ].filter(Boolean)}
                >
                  {headerLabels[header] ?? header}
                </Text>
                );
              })}
            </View>
            {rows.map((row, idx) => (
              <View key={idx} style={styles.row}>
                {headers.map((header) => {
                  const alignStyle =
                    headerAlign[header] === "right"
                      ? styles.cellRight
                      : headerAlign[header] === "center"
                      ? styles.cellCenter
                      : undefined;
                  return (
                  <Text
                    key={header}
                    style={[
                      styles.cell,
                      { width: getColumnWidth(header) },
                      alignStyle,
                    ].filter(Boolean)}
                  >
                    {row[header] ?? "-"}
                  </Text>
                  );
                })}
              </View>
            ))}
          </View>
        )}
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
