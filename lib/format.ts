/**
 * Formatea un número como moneda chilena (CLP)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Valida un email
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Valida un teléfono chileno (9 dígitos)
 */
export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length >= 9;
}

/**
 * Genera un buy_order único
 */
export function generateBuyOrder(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `${timestamp}${random}`.slice(0, 12);
}

/**
 * Genera un session_id único
 */
export function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15).toUpperCase();
}

/**
 * Calcula el subtotal y total del carrito
 */
export function calculateCartTotals(items: Array<{ price: number; quantity: number }>) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  // Podrías agregar impuestos o costos de envío aquí
  const total = subtotal;
  return { subtotal, total };
}

/**
 * Genera URL de WhatsApp con mensaje
 */
export function generateWhatsAppURL(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}
