import type { CartItem } from "@/types/cart";
import { calculateCartTotals } from "./format";

const CART_KEY = "mimbre_store_cart";
const CART_EVENTS = ["cart-updated", "cart:updated"] as const;
const EMPTY_CART: CartItem[] = [];

let cachedCartRaw: string | null | undefined;
let cachedCartItems: CartItem[] = EMPTY_CART;

function notifyCartUpdated(): void {
  if (typeof window === "undefined") {
    return;
  }

  CART_EVENTS.forEach((eventName) => {
    window.dispatchEvent(new Event(eventName));
  });
}

/**
 * Fuerza a que la siguiente lectura del carrito genere un snapshot nuevo.
 * Útil al volver desde páginas externas como Webpay.
 */
export function invalidateCartSnapshot(): void {
  cachedCartRaw = undefined;
}

/**
 * Obtiene el carrito desde localStorage.
 * Solo debe utilizarse en cliente.
 */
export function getCart(): CartItem[] {
  if (typeof window === "undefined") {
    return EMPTY_CART;
  }

  try {
    const rawCart = window.localStorage.getItem(CART_KEY);

    if (rawCart === cachedCartRaw) {
      return cachedCartItems;
    }

    cachedCartRaw = rawCart;

    if (!rawCart) {
      cachedCartItems = EMPTY_CART;
      return cachedCartItems;
    }

    const parsedCart: unknown = JSON.parse(rawCart);

    if (!Array.isArray(parsedCart)) {
      cachedCartItems = EMPTY_CART;
      return cachedCartItems;
    }

    cachedCartItems = parsedCart as CartItem[];
    return cachedCartItems;
  } catch (error) {
    console.error("Error reading cart:", error);
    cachedCartRaw = undefined;
    cachedCartItems = EMPTY_CART;
    return EMPTY_CART;
  }
}

/**
 * Guarda el carrito en localStorage.
 */
export function saveCart(items: CartItem[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const nextCartRaw = JSON.stringify(items);

    window.localStorage.setItem(CART_KEY, nextCartRaw);

    cachedCartRaw = nextCartRaw;
    cachedCartItems = items;
    notifyCartUpdated();
  } catch (error) {
    console.error("Error saving cart:", error);
  }
}

/**
 * Agrega un producto al carrito respetando disponibilidad y stock conocido.
 */
export function addToCart(item: Omit<CartItem, "id">): CartItem[] {
  const cart = getCart().map((cartItem) => ({ ...cartItem }));

  const hasNoStock =
    typeof item.stock === "number" && item.stock <= 0;

  if (item.available === false || hasNoStock || item.quantity <= 0) {
    return cart;
  }

  const existingItem = cart.find(
    (cartItem) => cartItem.product_id === item.product_id
  );

  const maxQuantity = item.stock ?? existingItem?.stock;

  if (existingItem) {
    const nextQuantity = existingItem.quantity + item.quantity;

    existingItem.quantity =
      typeof maxQuantity === "number"
        ? Math.min(nextQuantity, maxQuantity)
        : nextQuantity;

    existingItem.stock = item.stock ?? existingItem.stock;
    existingItem.available = item.available ?? existingItem.available;
  } else {
    const quantity =
      typeof maxQuantity === "number"
        ? Math.min(item.quantity, maxQuantity)
        : item.quantity;

    if (quantity <= 0) {
      return cart;
    }

    cart.push({
      ...item,
      quantity,
      id: `${item.product_id}_${Date.now()}`,
    });
  }

  saveCart(cart);
  return cart;
}

/**
 * Aumenta la cantidad de un producto sin superar el stock conocido.
 */
export function increaseQuantity(productId: string): CartItem[] {
  const cart = getCart().map((cartItem) => ({ ...cartItem }));
  const item = cart.find((cartItem) => cartItem.product_id === productId);

  if (!item || item.available === false) {
    return cart;
  }

  const nextQuantity = item.quantity + 1;

  item.quantity =
    typeof item.stock === "number"
      ? Math.min(nextQuantity, item.stock)
      : nextQuantity;

  saveCart(cart);
  return cart;
}

/**
 * Disminuye la cantidad de un producto.
 */
export function decreaseQuantity(productId: string): CartItem[] {
  const cart = getCart().map((cartItem) => ({ ...cartItem }));
  const item = cart.find((cartItem) => cartItem.product_id === productId);

  if (item && item.quantity > 1) {
    item.quantity -= 1;
    saveCart(cart);
  }

  return cart;
}

/**
 * Elimina un producto del carrito.
 */
export function removeFromCart(productId: string): CartItem[] {
  const filteredCart = getCart().filter(
    (item) => item.product_id !== productId
  );

  saveCart(filteredCart);
  return filteredCart;
}

/**
 * Vacía el carrito.
 */
export function clearCart(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(CART_KEY);

  cachedCartRaw = null;
  cachedCartItems = EMPTY_CART;
  notifyCartUpdated();
}

/**
 * Calcula los totales del carrito.
 */
export function getCartTotals(items: CartItem[]) {
  return calculateCartTotals(items);
}

/**
 * Obtiene el número total de unidades en el carrito.
 */
export function getCartItemCount(): number {
  return getCart().reduce((total, item) => total + item.quantity, 0);
}
