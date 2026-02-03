import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

function formatDate(d?: string) {
  if (!d) return "-";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatMoney(n?: number) {
  const v = Number(n ?? 0);
  return `USD$${v.toFixed(2)}`;
}

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    color: "#111827",
  },

  // Header
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  subText: { fontSize: 9, marginTop: 2 },
  rightBlock: { alignItems: "flex-end" },
  brand: { fontSize: 12, fontWeight: "bold" },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },

  // Meta grid
  metaRow: { flexDirection: "row", justifyContent: "space-between" },
  metaCol: { width: "33.33%" },
  metaLabel: { fontSize: 9, fontWeight: "bold", color: "#374151" },
  metaValue: { fontSize: 9, marginTop: 3, color: "#111827" },
  metaCenter: { textAlign: "center" },
  metaRight: { textAlign: "right" },

  // Table
  table: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    paddingVertical: 8,
    paddingHorizontal: 10,
    fontSize: 9,
    fontWeight: "bold",
    color: "#111827",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },

  c1: { width: "8%" }, // #
  c2: { width: "62%" }, // item
  c3: { width: "15%", textAlign: "center" }, // qty
  c4: { width: "15%", textAlign: "right" }, // price

  // Summary
  summaryWrap: { marginTop: 14 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  payBlock: { width: "33.33%" },
  discountBlock: { width: "33.33%", textAlign: "center" },
  totalBlock: { width: "33.33%", alignItems: "flex-end" },

  totalLabel: { fontSize: 9, fontWeight: "bold", color: "#374151" },
  totalValue: { fontSize: 16, fontWeight: "bold", marginTop: 4 },

  pmRow: { flexDirection: "row", alignItems: "center", marginTop: 6, gap: 6 },
  pmIcon: { width: 14, height: 14, borderRadius: 3 },

  footer: { marginTop: 18, fontSize: 8, color: "#6B7280" },
});

type InvoicePdfProps = {
  order: any; // replace with Order type if you want
  // optional: logo URL/base64
  logo?: string;
};

export default function InvoicePdf({ order, logo }: InvoicePdfProps) {
  const items = order?.cart ?? [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerRow}>
          <View>
            {logo ? (
              <Image
                src={logo}
                style={{ width: 40, height: 40, marginBottom: 6 }}
              />
            ) : null}

            <Text style={styles.title}>INVOICE</Text>
            <Text style={styles.subText}>Status: {order?.status ?? "—"}</Text>
          </View>

          <View style={styles.rightBlock}>
            <Text style={styles.brand}>GAMINGTY</Text>
            <Text style={styles.subText}>FLEXITECH LLC FZ</Text>
            <Text style={styles.subText}>
              The Meydan Hotel, Grandstand, 6th floor,{"\n"}
              Meydan Road, Nad Al Sheba, Dubai, UAE{"\n"}
              support@gamingty.com
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaCol}>
            <Text style={styles.metaLabel}>DATE</Text>
            <Text style={styles.metaValue}>{formatDate(order?.createdAt)}</Text>
          </View>

          <View style={styles.metaCol}>
            <Text style={[styles.metaLabel, styles.metaCenter]}>ORDER NO.</Text>
            <Text style={[styles.metaValue, styles.metaCenter]}>
              #{order?.invoice ?? order?._id ?? "-"}
            </Text>
          </View>

          <View style={styles.metaCol}>
            <Text style={[styles.metaLabel, styles.metaRight]}>ORDER TO.</Text>
            <Text style={[styles.metaValue, styles.metaRight]}>
              {order?.user_info?.name ?? "-"}
              {"\n"}
              {order?.user_info?.email ?? "-"}
              {"\n"}
              {order?.user_info?.address ?? "-"}
              {"\n"}
              {order?.user_info?.country ?? "-"}
            </Text>
          </View>
        </View>

        {/* Items table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.c1}>#</Text>
            <Text style={styles.c2}>ITEM</Text>
            <Text style={styles.c3}>QTY</Text>
            <Text style={styles.c4}>PRICE</Text>
          </View>

          {items.length ? (
            items.map((it: any, idx: number) => (
              <View style={styles.row} key={it?._id ?? idx}>
                <Text style={styles.c1}>{idx + 1}</Text>
                <Text style={styles.c2}>{it?.title ?? "-"}</Text>
                <Text style={styles.c3}>{it?.quantity ?? 0}</Text>
                <Text style={styles.c4}>{formatMoney(it?.price)}</Text>
              </View>
            ))
          ) : (
            <View style={styles.row}>
              <Text>No items</Text>
            </View>
          )}
        </View>

        {/* Summary */}
        <View style={styles.summaryWrap}>
          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <View style={styles.payBlock}>
              <Text style={styles.metaLabel}>PAYMENT METHOD</Text>
              <View style={styles.pmRow}>
                {order?.paymentMethodImage ? (
                  <Image src={order.paymentMethodImage} style={styles.pmIcon} />
                ) : null}
                <Text style={styles.metaValue}>
                  {(order?.paymentMethod ?? "-").toString()}
                </Text>
              </View>
            </View>

            <View style={styles.discountBlock}>
              <Text style={styles.metaLabel}>DISCOUNT</Text>
              <Text style={styles.metaValue}>
                {formatMoney(order?.discount ?? 0)}
              </Text>
            </View>

            <View style={styles.totalBlock}>
              <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
              <Text style={styles.totalValue}>{formatMoney(order?.total)}</Text>
            </View>
          </View>

          <Text style={styles.footer}>
            Thanks for your purchase. This invoice is generated electronically.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
