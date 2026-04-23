import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('resume').select('*').limit(1).maybeSingle();
  
  if (data) {
    return NextResponse.json({ 
      projects: data.projects, 
      isArray: Array.isArray(data.projects),
      type: typeof data.projects
    });
  }
  return NextResponse.json({ error });
}
