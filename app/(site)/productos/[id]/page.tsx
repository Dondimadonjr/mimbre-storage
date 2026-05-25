'use client'

import { use, useEffect, useState } from "react";
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { formatCurrency } from '@/lib/format'
import { addToCart } from '@/lib/cart'
import type { Product } from '@/types/product'
import SectionTitle from '@/components/SectionTitle'
import ProductsGrid from '@/components/ProductsGrid'

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq("id", id)
          .single()

        if (error) throw error
        setProduct(data)
      } catch (err) {
        console.error('Error loading product:', err)
      } finally {
        setLoading(false)
      }
    }

    loadProduct()
  },  [id]);

  const handleAddToCart = () => {
    if (!product) return

    addToCart({
      product_id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image_url: product.image_url,
    })

    setAddedToCart(true)
    window.dispatchEvent(new CustomEvent('cart-updated'))
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-80 w-80 bg-coffee/20 rounded-lg" />
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-text-dark mb-4">
            Producto no encontrado
          </h1>
          <Link href="/" className="text-coffee hover:text-coffee-dark">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-8 pb-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-coffee hover:text-coffee-dark text-sm font-medium"
        >
          ← Volver
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Imagen */}
          <div className="relative h-96 md:h-full min-h-96 bg-cream rounded-lg overflow-hidden">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <svg
                  className="w-32 h-32 text-coffee/30"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
              </div>
            )}
          </div>

          {/* Detalles */}
          <div className="space-y-8">
            {/* Categoría */}
            {product.category && (
              <p className="text-xs font-medium text-coffee uppercase tracking-wide">
                {product.category}
              </p>
            )}

            {/* Nombre */}
            <h1 className="text-4xl font-bold text-text-dark">{product.name}</h1>

            {/* Descripción */}
            {product.description && (
              <p className="text-lg text-text-secondary leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Disponibilidad */}
            <div className="flex items-center gap-3">
              {product.available ? (
                <>
                  <div className="w-3 h-3 bg-green-600 rounded-full" />
                  <span className="text-green-600 font-medium">Disponible</span>
                </>
              ) : (
                <>
                  <div className="w-3 h-3 bg-red-600 rounded-full" />
                  <span className="text-red-600 font-medium">Agotado</span>
                </>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <span className="text-orange-600 font-medium">
                  Solo {product.stock} izq.
                </span>
              )}
            </div>

            {/* Precio */}
            <div className="py-6 border-y border-border">
              <p className="text-5xl font-bold text-coffee">
                {formatCurrency(product.price)}
              </p>
            </div>

            {/* Cantidad y Agregar al carrito */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-text-secondary">Cantidad:</span>
                <div className="flex items-center gap-3 border border-border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={!product.available}
                    className="w-10 h-10 flex items-center justify-center hover:bg-cream disabled:opacity-50"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={!product.available}
                    className="w-10 h-10 flex items-center justify-center hover:bg-cream disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botones */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.available}
                  className={`w-full py-4 font-semibold rounded-lg transition-all duration-300 text-white ${
                    addedToCart
                      ? 'bg-green-600'
                      : product.available
                        ? 'bg-coffee hover:bg-coffee-dark'
                        : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {addedToCart ? '✓ Agregado al carrito' : 'Agregar al Carrito'}
                </button>

                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP}?text=Me%20interesa%20${encodeURIComponent(
                    product.name
                  )}%20-%20${encodeURIComponent(
                    formatCurrency(product.price)
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-4 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-center"
                >
                  Consultar por WhatsApp
                </a>
              </div>
            </div>

            {/* Info adicional */}
            <div className="bg-cream p-6 rounded-lg space-y-3">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-coffee flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z" />
                </svg>
                <div>
                  <p className="font-medium text-text-dark">Hecho a mano</p>
                  <p className="text-sm text-text-secondary">
                    Cada pieza es única y artesanal
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-coffee flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 1C6.48 1 2 5.48 2 11s4.48 10 10 10 10-4.48 10-10S17.52 1 12 1zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
                <div>
                  <p className="font-medium text-text-dark">Calidad garantizada</p>
                  <p className="text-sm text-text-secondary">
                    Materiales premium seleccionados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Productos Relacionados"
            subtitle={`Otros artículos de ${product.category || 'nuestra tienda'}`}
          />
          {product.category && (
            <div className="flex gap-6 max-w-md mb-8">
              <div className="text-sm text-text-secondary">
                Categoría: <span className="font-medium">{product.category}</span>
              </div>
            </div>
          )}
          <ProductsGrid featured={false} />
        </div>
      </section>
    </>
  )
}
