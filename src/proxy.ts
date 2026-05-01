import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch (err) {
    // Session is invalid or refresh token is missing - ignore noisy logs
  }

  // Hardcoded fallback for production if Vercel env vars are missing
  const adminEmail = process.env.ADMIN_EMAIL || 'idhamyazim1234@yahoo.com';
  const userEmail = user?.email?.toLowerCase().trim();
  const isAdminEmail = userEmail && adminEmail && userEmail === adminEmail.toLowerCase().trim();
  const hasAdminRole = user?.user_metadata?.role === 'admin';
  let isAdmin = hasAdminRole || isAdminEmail;

  // Fallback: Check the database using service role if email/metadata check fails
  if (user && !isAdmin && userEmail && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
      const adminClient = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
          cookies: {
            getAll() { return request.cookies.getAll() },
            setAll() {} // Service role doesn't need to set cookies back
          },
        }
      );

      const { data: roleData } = await adminClient
        .from('user_roles')
        .select('role')
        .eq('email', userEmail)
        .maybeSingle();
      
      if (roleData?.role === 'admin') {
        isAdmin = true;
      }
    } catch (err) {
      console.error('Proxy role check error:', err);
    }
  }

  // Protect admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user || !isAdmin) {
      const url = new URL('/login', request.url)
      const redirectResponse = NextResponse.redirect(url)
      
      // Copy cookies from supabaseResponse to the redirect (crucial for session persistence)
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
      })
      
      return redirectResponse
    }
  }

  // Redirect from login if already logged in
  if (request.nextUrl.pathname === '/login' && user) {
    const targetUrl = isAdmin ? '/admin/dashboard' : '/';
    const redirectResponse = NextResponse.redirect(new URL(targetUrl, request.url))
    
    // Copy cookies to redirect
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie)
    })
    
    return redirectResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
