import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(request: Request) {
  const body = await request.json();
  const { name, description, external_link } = body;

  if (!name) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 });
  }

  const id = nanoid();
  const createdAt = new Date().toISOString();

  const { data, error } = await import('@/lib/supabase-admin')
    .then((mod) => mod.supabaseAdmin)
    .then((supabase) =>
      supabase.from('products').insert({
        id,
        name,
        description,
        external_link,
        created_at: createdAt,
        updated_at: createdAt,
      })
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, product: data }, { status: 200 });
}