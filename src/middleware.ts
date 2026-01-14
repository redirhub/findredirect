import { NextRequest, NextResponse } from 'next/server'

const locales = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'zh', 'ko']
const defaultLocale = 'en'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Redirect to default locale
  request.nextUrl.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

export const config = {
  matcher: [
    // Match all paths except:
    // - api routes
    // - _next static files
    // - _next image optimization
    // - favicon, images
    // - studio (Sanity Studio)
    '/((?!api|_next/static|_next/image|favicon.ico|images|studio).*)',
  ],
}
