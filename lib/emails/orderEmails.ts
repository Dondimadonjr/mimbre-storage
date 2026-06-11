import "server-only";

import { Resend } from "resend";
import { formatCurrency } from "@/lib/format";
import type { Order, OrderItem } from "@/types/order";

type SendOrderPaidEmailsParams = {
  order: Order;
  items: OrderItem[];
};

function escapeHtml(value: string | number | null | undefined) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-CL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function getAddress(order: Order) {
  return [
    order.customer_address,
    order.customer_commune,
    order.customer_region,
  ]
    .filter(Boolean)
    .join(", ");
}

function getFromAddress() {
  const fromName = process.env.EMAIL_FROM_NAME;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;

  if (!fromName || !fromAddress) return null;

  return `${fromName} <${fromAddress}>`;
}

function renderItemsTable(items: OrderItem[]) {
  if (items.length === 0) {
    return `
      <p style="margin:0;color:#6f6257;font-size:14px;">
        No hay productos asociados a esta orden.
      </p>
    `;
  }

  return `
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <thead>
        <tr>
          <th align="left" style="padding:10px 0;border-bottom:1px solid #eadfce;color:#6f6257;">Producto</th>
          <th align="center" style="padding:10px 0;border-bottom:1px solid #eadfce;color:#6f6257;">Cant.</th>
          <th align="right" style="padding:10px 0;border-bottom:1px solid #eadfce;color:#6f6257;">Unitario</th>
          <th align="right" style="padding:10px 0;border-bottom:1px solid #eadfce;color:#6f6257;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f2eadf;color:#1f2a1f;font-weight:700;">
                  ${escapeHtml(item.product_name)}
                </td>
                <td align="center" style="padding:12px 0;border-bottom:1px solid #f2eadf;color:#1f2a1f;">
                  ${escapeHtml(item.quantity)}
                </td>
                <td align="right" style="padding:12px 0;border-bottom:1px solid #f2eadf;color:#1f2a1f;">
                  ${escapeHtml(formatCurrency(item.unit_price))}
                </td>
                <td align="right" style="padding:12px 0;border-bottom:1px solid #f2eadf;color:#9a663d;font-weight:800;">
                  ${escapeHtml(formatCurrency(item.subtotal))}
                </td>
              </tr>
            `
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderEmailShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  children: string;
}) {
  return `
    <div style="margin:0;padding:0;background:#FAF6F0;font-family:Arial,Helvetica,sans-serif;color:#1f2a1f;">
      <div style="max-width:640px;margin:0 auto;padding:28px 16px;">
        <div style="border-radius:24px;background:#ffffff;border:1px solid #eadfce;overflow:hidden;">
          <div style="background:#2E3B1F;padding:26px 28px;color:#ffffff;">
            <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.18em;text-transform:uppercase;color:#d8b48a;font-weight:800;">
              ${escapeHtml(eyebrow)}
            </p>
            <h1 style="margin:0;font-size:28px;line-height:1.15;color:#ffffff;">
              ${escapeHtml(title)}
            </h1>
            <p style="margin:14px 0 0;font-size:15px;line-height:1.6;color:#f7efe5;">
              ${escapeHtml(intro)}
            </p>
          </div>
          <div style="padding:28px;">
            ${children}
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildOwnerHtml(order: Order, items: OrderItem[]) {
  const address = getAddress(order);

  return renderEmailShell({
    eyebrow: "Pedido pagado",
    title: "Nuevo pedido pagado en Raíz y Mimbre",
    intro:
      "Webpay confirmó un pago aprobado. Revisa el detalle del pedido y coordina entrega o retiro con el cliente.",
    children: `
      <div style="display:block;border-radius:18px;background:#FAF6F0;padding:18px;margin-bottom:22px;">
        <p style="margin:0 0 8px;color:#6f6257;font-size:13px;">Pedido</p>
        <p style="margin:0;font-size:22px;font-weight:800;color:#1f2a1f;">#${escapeHtml(
          order.id.slice(0, 8)
        )}</p>
        <p style="margin:8px 0 0;color:#9a663d;font-size:20px;font-weight:800;">${escapeHtml(
          formatCurrency(order.total)
        )}</p>
      </div>

      <h2 style="margin:0 0 12px;font-size:16px;color:#1f2a1f;">Cliente</h2>
      <p style="margin:0 0 6px;color:#1f2a1f;"><strong>Nombre:</strong> ${escapeHtml(
        order.customer_name
      )}</p>
      <p style="margin:0 0 6px;color:#1f2a1f;"><strong>Email:</strong> ${escapeHtml(
        order.customer_email
      )}</p>
      <p style="margin:0 0 6px;color:#1f2a1f;"><strong>Teléfono:</strong> ${escapeHtml(
        order.customer_phone || "No informado"
      )}</p>
      <p style="margin:0 0 6px;color:#1f2a1f;"><strong>Dirección:</strong> ${escapeHtml(
        address || "No informada"
      )}</p>
      <p style="margin:0 0 22px;color:#1f2a1f;"><strong>Fecha:</strong> ${escapeHtml(
        formatDate(order.created_at)
      )}</p>

      <h2 style="margin:0 0 12px;font-size:16px;color:#1f2a1f;">Productos</h2>
      ${renderItemsTable(items)}

      <p style="margin:24px 0 0;border-radius:16px;background:#FAF6F0;padding:16px;color:#6f6257;line-height:1.6;">
        Revisa el pedido en el panel de administración y coordina entrega o retiro con el cliente.
      </p>
    `,
  });
}

function buildCustomerHtml(order: Order, items: OrderItem[]) {
  return renderEmailShell({
    eyebrow: "Compra confirmada",
    title: "Recibimos tu compra en Raíz y Mimbre",
    intro: `Hola ${order.customer_name || ""}, tu pago fue aprobado correctamente.`,
    children: `
      <div style="border-radius:18px;background:#FAF6F0;padding:18px;margin-bottom:22px;">
        <p style="margin:0 0 8px;color:#6f6257;font-size:13px;">Pedido #${escapeHtml(
          order.id.slice(0, 8)
        )}</p>
        <p style="margin:0;color:#9a663d;font-size:24px;font-weight:800;">${escapeHtml(
          formatCurrency(order.total)
        )}</p>
      </div>

      <h2 style="margin:0 0 12px;font-size:16px;color:#1f2a1f;">Productos comprados</h2>
      ${renderItemsTable(items)}

      <p style="margin:24px 0 0;color:#1f2a1f;line-height:1.7;">
        Nos contactaremos contigo para coordinar despacho, retiro o detalles de entrega.
      </p>
      <p style="margin:14px 0 0;color:#1f2a1f;font-weight:800;">
        Gracias por apoyar el trabajo artesanal.
      </p>
    `,
  });
}

function buildOwnerText(order: Order, items: OrderItem[]) {
  const address = getAddress(order);
  const products = items
    .map(
      (item) =>
        `- ${item.product_name} x ${item.quantity} | ${formatCurrency(
          item.unit_price
        )} | subtotal ${formatCurrency(item.subtotal)}`
    )
    .join("\n");

  return [
    "Nuevo pedido pagado en Raíz y Mimbre",
    `Pedido: #${order.id.slice(0, 8)}`,
    "Estado: pagado",
    `Total: ${formatCurrency(order.total)}`,
    `Fecha: ${formatDate(order.created_at)}`,
    `Cliente: ${order.customer_name}`,
    `Email: ${order.customer_email}`,
    `Teléfono: ${order.customer_phone || "No informado"}`,
    `Dirección: ${address || "No informada"}`,
    "Productos:",
    products || "No hay productos asociados a esta orden.",
    "Revisa el pedido en el panel de administración y coordina entrega o retiro con el cliente.",
  ].join("\n");
}

function buildCustomerText(order: Order, items: OrderItem[]) {
  const products = items
    .map(
      (item) =>
        `- ${item.product_name} x ${item.quantity} | ${formatCurrency(
          item.subtotal
        )}`
    )
    .join("\n");

  return [
    `Hola ${order.customer_name || ""},`,
    "Recibimos tu compra en Raíz y Mimbre y tu pago fue aprobado.",
    `Pedido: #${order.id.slice(0, 8)}`,
    `Total: ${formatCurrency(order.total)}`,
    "Productos:",
    products || "No hay productos asociados a esta orden.",
    "Nos contactaremos contigo para coordinar despacho, retiro o detalles de entrega.",
    "Gracias por apoyar el trabajo artesanal.",
  ].join("\n");
}

export async function sendOrderPaidEmails({
  order,
  items,
}: SendOrderPaidEmailsParams) {
  const apiKey = process.env.RESEND_API_KEY;
  const notificationEmail = process.env.STORE_NOTIFICATION_EMAIL;
  const from = getFromAddress();

  if (!apiKey || !notificationEmail || !from) {
    console.warn("Order paid email skipped: missing Resend email env vars.");
    return;
  }

  const resend = new Resend(apiKey);
  const emails = [
    resend.emails.send({
      from,
      to: notificationEmail,
      subject: "Nuevo pedido pagado en Raíz y Mimbre",
      html: buildOwnerHtml(order, items),
      text: buildOwnerText(order, items),
    }),
  ];

  if (order.customer_email) {
    emails.push(
      resend.emails.send({
        from,
        to: order.customer_email,
        subject: "Recibimos tu compra en Raíz y Mimbre",
        html: buildCustomerHtml(order, items),
        text: buildCustomerText(order, items),
      })
    );
  }

  const results = await Promise.allSettled(emails);

  results.forEach((result) => {
    if (result.status === "rejected") {
      console.error("Error sending order paid email:", result.reason);
      return;
    }

    if (result.value.error) {
      console.error("Error sending order paid email:", result.value.error);
    }
  });
}
