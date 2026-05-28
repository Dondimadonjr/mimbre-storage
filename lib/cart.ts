import type { CartItem } from '@/types/cart'
import { calculateCartTotals } from './format'

const CART_KEY = 'mimbre_store_cart'
const EMPTY_CART: CartItem[] = []

let cachedCartRaw: string | null | undefined
let cachedCartItems: CartItem[] = EMPTY_CART

/**
 * Obtiene el carrito del localStorage
 * Solo debe usarse en cliente (side effects)
 */
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return EMPTY_CART
  }
  try {
    const cart = localStorage.getItem(CART_KEY)

    if (cart === cachedCartRaw) {
      return cachedCartItems
    }

    cachedCartRaw = cart
    cachedCartItems = cart ? JSON.parse(cart) : EMPTY_CART

    return cachedCartItems
  } catch (error) {
    console.error('Error reading cart:', error)
    cachedCartRaw = undefined
    cachedCartItems = EMPTY_CART
    return EMPTY_CART
  }
}

/**
 * Guarda el carrito en localStorage
 */
export function saveCart(items: CartItem[]): void {
  if (typeof window === 'undefined') {
    return
  }
  try {
    const nextCartRaw = JSON.stringify(items)
    localStorage.setItem(CART_KEY, nextCartRaw)
    cachedCartRaw = nextCartRaw
    cachedCartItems = items
  } catch (error) {
    console.error('Error saving cart:', error)
  }
}

/**
 * Agrega un producto al carrito
 */
export function addToCart(item: Omit<CartItem, 'id'>): CartItem[] {
  const cart = getCart().map((cartItem) => ({ ...cartItem }))
  const existingItem = cart.find((i) => i.product_id === item.product_id)

  if (existingItem) {
    existingItem.quantity += item.quantity
  } else {
    cart.push({
      ...item,
      id: `${item.product_id}_${Date.now()}`,
    })
  }

  saveCart(cart)
  return cart
}

/**
 * Aumenta la cantidad de un producto
 */
export function increaseQuantity(productId: string): CartItem[] {
  const cart = getCart().map((cartItem) => ({ ...cartItem }))
  const item = cart.find((i) => i.product_id === productId)
  if (item) {
    item.quantity += 1
  }
  saveCart(cart)
  return cart
}

/**
 * Disminuye la cantidad de un producto
 */
export function decreaseQuantity(productId: string): CartItem[] {
  const cart = getCart().map((cartItem) => ({ ...cartItem }))
  const item = cart.find((i) => i.product_id === productId)
  if (item && item.quantity > 1) {
    item.quantity -= 1
  }
  saveCart(cart)
  return cart
}

/**
 * Elimina un producto del carrito
 */
export function removeFromCart(productId: string): CartItem[] {
  const cart = getCart()
  const filtered = cart.filter((i) => i.product_id !== productId)
  saveCart(filtered)
  return filtered
}

/**
 * Vacía el carrito
 */
export function clearCart(): void {
  if (typeof window === 'undefined') {
    return
  }
  localStorage.removeItem(CART_KEY)
  cachedCartRaw = null
  cachedCartItems = EMPTY_CART
}

/**
 * Calcula totales del carrito
 */
export function getCartTotals(items: CartItem[]) {
  return calculateCartTotals(items)
}

/**
 * Obtiene el número de items en el carrito
 */
export function getCartItemCount(): number {
  const cart = getCart()
  return cart.reduce((acc, item) => acc + item.quantity, 0)
}
