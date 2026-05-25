/**
 * ATENCIÓN:
 * Este archivo SOLO debe ejecutarse en el servidor.
 * Nunca expongas TRANSBANK_API_KEY en el cliente.
 * Nunca importes esto en componentes React.
 */

import {
  Environment,
  IntegrationApiKeys,
  IntegrationCommerceCodes,
  Options,
  WebpayPlus,
} from "transbank-sdk";

const isProduction = process.env.TRANSBANK_ENVIRONMENT === "production";

const commerceCode =
  process.env.TRANSBANK_COMMERCE_CODE || IntegrationCommerceCodes.WEBPAY_PLUS;

const apiKey = process.env.TRANSBANK_API_KEY || IntegrationApiKeys.WEBPAY;

const environment = isProduction
  ? Environment.Production
  : Environment.Integration;

const transaction = new WebpayPlus.Transaction(
  new Options(commerceCode, apiKey, environment)
);

/**
 * Genera un buy_order válido para Transbank.
 * Debe ser único y no demasiado largo.
 */
export function generateBuyOrder() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 9999).toString().padStart(4, "0");

  return `ORD-${timestamp}-${random}`;
}

/**
 * Genera un session_id simple.
 */
export function generateSessionId() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 999999).toString().padStart(6, "0");

  return `SES-${timestamp}-${random}`;
}

/**
 * Crea una transacción con Webpay Plus
 */
export async function createWebpayTransaction(
  buyOrder: string,
  sessionId: string,
  amount: number,
  returnUrl: string
) {
  const response = await transaction.create(
    buyOrder,
    sessionId,
    amount,
    returnUrl
  );

  return {
    url: response.url,
    token: response.token,
    success: true,
  };
}

/**
 * Confirma una transacción con Transbank
 */
export async function confirmWebpayTransaction(token: string) {
  const response = await transaction.commit(token);

  return {
    buyOrder: response.buy_order,
    orderId: response.session_id,
    cardNumber: response.card_detail?.card_number || "",
    amount: response.amount,
    status: response.status,
    authorizationCode: response.authorization_code || "",
    paymentTypeCode: response.payment_type_code || "",
    responseCode: response.response_code,
    installmentsNumber: response.installments_number || 0,
    transactionDate: response.transaction_date || "",
    raw: response,
    success: true,
  };
}

/**
 * Revierte/anula una transacción.
 */
export async function refundWebpayTransaction(token: string, amount: number) {
  const response = await transaction.refund(token, amount);
  return response;
}

/**
 * Valida un monto
 */
export function validateAmount(amount: number): {
  valid: boolean;
  message?: string;
} {
  if (!Number.isFinite(amount)) {
    return {
      valid: false,
      message: "El monto no es válido",
    };
  }

  if (amount < 100) {
    return {
      valid: false,
      message: "El monto mínimo es $100 CLP",
    };
  }

  if (!isProduction) {
    if (amount < 500 || amount > 9999999) {
      return {
        valid: false,
        message:
          "En ambiente de integración, el monto debe estar entre $500 y $9.999.999 CLP",
      };
    }
  }

  return { valid: true };
}