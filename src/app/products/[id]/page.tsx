'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { Star, StarHalf } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Feedback = {
  id: string;
  score: number;
  comment: string | null;
  created_at: string;
  created_by: string | null;
};

type Product = {
  id: string;
  name: string;
  description: string | null;
  external_link: string | null;
  created_at: string;
};

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [comments, setComments] = useState<Feedback[]>([]);
  const [newScore, setNewScore] = useState(5);
  const [newComment, setNewComment] = useState('');

  const { toast } = useToast();

  // Fetch product details and comments on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      // Fetch product info
      try {
        const productData = await fetch(`/api/products?productId=${id}`, {
          cache: 'no-store',
        }).then(res => res.json());
        setProduct(productData);
      } catch (error) {
        console.error('Error fetching product:', error);
      }

      // Fetch existing comments for this product
      try {
        const commentsData = await fetch(`/api/feedbacks?productId=${id}`, {
          cache: 'no-store',
        }).then(res => res.json());
        setComments(commentsData || []);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchData();
  }, [id]);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = (await import('@/lib/supabase')).supabase;
        const { data: { session} } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        setIsAuthenticated(false);
      }
    };
    checkAuth();
  }, []);

  // Handle form submission
  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/v1/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: newScore,
          comment: newComment,
          product_id: id,
        }),
      });
      const result = await response.json();

      if (response.ok) {
        toast({
          title: 'Feedback enviado!',
          description: 'Sua avaliação foi adicionada com sucesso.',
        });
        setNewScore(5);
        setNewComment('');
      } else {
        toast({
          title: 'Erro',
          description: result.message || 'Erro ao enviar feedback.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao enviar feedback.',
        variant: 'destructive',
      });
    }
  };

  // If no product loaded yet
  if (!product) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center py-12'>
        <p className='text-gray-600'>Carregando produto...</p>
      </div>
    );
  }

  return (
    <div className='max-w-7xl mx-auto px-4 py-8'>
      <h1 className='text-3xl font-bold mb-6'>{product!.name}</h1>
      
      {/* Product description */}
      {product!.description && (
        <p className='text-gray-600 mb-8'>{product!.description}</p>
      )}
      
      {/* Comments section */}
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle>Comentários e Avaliações</CardTitle>
          {comments.length === 0 && (
            <CardDescription>Não há comentários ainda. Seja o primeiro a avaliar!</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {comments.map((comment) => (
            <div key={comment.id} className='mb-4 pb-4 border-b last:border-0'>
              <div className='flex items-center space-x-2 mb-2'>
                <span className='text-sm font-medium'>{comment.created_by || 'Anônimo'}</span>
              </div>
              <div className='flex gap-1'>
                {Array.from({ length: comment.score }, (_, i) => (
                  <Star key={i + 1} className='h-4 w-4 text-yellow-500' />
                ))}
                {comment.score > 0 && comment.score < 5 && (
                  <StarHalf className='h-4 w-4 text-yellow-500' />
                )}
              </div>
              <p className='text-sm text-gray-600'>{comment.comment || '—'}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Feedback form - only for authenticated users */}
      {isAuthenticated ? (
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Deixe sua avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Nota</label>
                <div className='flex gap-1'>
                  {Array.from({ length: 5 }, (_, i) => (
                    <label key={i + 1}>
                      <Star
                        className={`
                          h-6 w-6 text-yellow-500 ${newScore >= i + 1 ? 'fill' : ''}
                          cursor-pointer hover:text-yellow-400 transition-colors
                        `}
                        onClick={() => setNewScore(i + 1)}
                      />
                    </label>
                  ))}
                </div>
                <input
                  type="hidden"
                  name="score"
                  value={newScore}
                  defaultValue={newScore}
                />
              </div>
              
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>Comentário</label>
                <textarea
                  placeholder="Digite seu comentário..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className='mt-1 block w-full rounded-md border-2 border-gray-300 bg-white py-2 px-3 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                  rows={3}
                ></textarea>
              </div>
              
              <div>
                <Button type='submit' className='w-full rounded-lg px-6 py-3 text-lg font-medium'>
                  Enviar Avaliação
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        // Non-authenticated users: show block requiring authentication
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Faça login para avaliar</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-gray-600'>
              Você precisa estar logado para deixar avaliações. <Link href='/auth/sign-in' className='text-primary hover:underline'>Faça login</Link> ou <Link href='/auth/sign-up' className='text-primary hover:underline'>cadastre-se</Link>.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}