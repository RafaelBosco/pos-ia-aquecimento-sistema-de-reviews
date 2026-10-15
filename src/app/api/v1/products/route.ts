import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const cursor = searchParams.get('cursor');
  const limit = parseInt(searchParams.get('limit') || '10');

  let query = supabase.from('products').select('*', { count: 'exact' });

  if (cursor) {
    query = query.limit(limit).eq('id', cursor);
  } else {
    query = query.limit(limit);
  }

  const { data, error, count } = await query.order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let nextCursor: string | undefined;
  if (data && data.length === limit) {
    nextCursor = data[data.length - 1].id;
  }

  return NextResponse.json({
    products: data || [],
    total: count || 0,
    nextCursor,
  });
}