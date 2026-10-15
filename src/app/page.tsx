'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

type Product = {
  id: string;
  name: string;
  description: string | null;
  external_link: string | null;
  created_at: string;
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (refresh = false) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    try {
      const url = new URL(`/api/v1/products`, window.location.origin);
      url.searchParams.set('limit', '10');
      if (cursor) {
        url.searchParams.set('cursor', cursor);
      }

      const response = await fetch(url);
      const result = await response.json();

      if (refresh) {
        setProducts(result.products);
      } else {
        setProducts((prev) => [...prev, ...result.products]);
      }

      setCursor(result.nextCursor);
      setHasMore(result.total > products.length);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar produtos',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !isLoading) {
          fetchProducts();
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    const loadMoreElement = document.querySelector('.load-more');
    if (loadMoreElement) {
      observer.observe(loadMoreElement);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, fetchProducts]);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Produtos</h1>

        <div className="grid grid-cols-1 sm:-cols-2 lg:-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group rounded-lg border bg-card p-6 hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square rounded-md overflow-hidden mb-4">
                <Image
                  src="/placeholder-product.jpg"
                  alt={product.name}
                  width={400}
                  height={250}
                  className="object-cover w-full h-full"
                />
              </div>
              <h3 className="text-lg font-medium mb-2 line-clamp-2">
                {product.name}
              </h3>
              {product.description && (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {product.description}
                </p>
              )}
              <div>
                <a
                  href={`/products/${product.id}`}
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Ver detalhes
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Infinite scroll observer */}
        <div
          className="my-12 load-more"
          style={{ height: '40px' }}
        />
      </div>
    </div>
  );
}