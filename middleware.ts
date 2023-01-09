import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwtDecode from 'jwt-decode';


// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const token = request.headers.get('Authorization');
    if( token != undefined) {
      const updatedToken = token.replace("Bearer ", "").trim()
      const decryptedValue = jwtDecode(updatedToken);
      const clientIdSecret = decryptedValue['sub']?.split("_")[2];
      if(clientIdSecret != undefined && process.env.NEXTAUTH_SECRET === clientIdSecret) {
        console.log("GOT ACCESS")
      }else {
        console.log("ROUter to login...")
      }
    }
    
  // return NextResponse.redirect(new URL('/about-2', request.url))

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/account/users', '/api/:path*']
}