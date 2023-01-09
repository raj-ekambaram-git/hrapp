import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwtDecode from 'jwt-decode';


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
    const token = request.headers.get('Authorization');
    if(pathname.startsWith('/api')) { // This is the API Authorization
      if( token != undefined) {
        const updatedToken = token.replace("Bearer ", "").trim()
        const decryptedValue = jwtDecode(updatedToken);
        const clientIdSecret = decryptedValue['sub']?.split("_")[2];
        if(clientIdSecret != undefined && process.env.NEXTAUTH_SECRET === clientIdSecret) {
          return NextResponse.next();
        }else {
          return NextResponse.redirect(new URL('/login', request.url))
        }
      }else {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }else {
      //Page level auth
      //TODO: Check the role logic here before forwarding
      return NextResponse.next();
    }

    
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/account/:path*', '/accounts']
}