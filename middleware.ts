import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwtDecode from 'jwt-decode';
import cache from "memory-cache";

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
    const token = request.headers.get('Authorization');
    console.log("pathname:::"+pathname+"------token:::"+token)
    
    if(pathname.startsWith('/api')) { // This is the API Authorization
      if( token != undefined) {
        const updatedToken = token.replace("Bearer ", "").trim()
        const decryptedValue = jwtDecode(updatedToken);
        const clientIdSecret = decryptedValue['sub']?.split(":")[2];
        console.log("User Roles::"+decryptedValue['sub']?.split(":")[3])
        // hasAccess(pathname,updatedToken)
        if(clientIdSecret != undefined && process.env.NEXTAUTH_SECRET === clientIdSecret) {
          return NextResponse.next();
        }else {
          return NextResponse.json({ message: 'Auth required' }, { status: 401 })
        }
      }else {
        return NextResponse.json({ message: 'Auth required' }, { status: 401 })
      }
    }else {
      //Page level auth
      //TODO: Check the role logic here before forwarding
      return NextResponse.next();
    }

    
}

async function hasAccess(url, token){

  const cachedResponse = cache.get(url);
  if (cachedResponse) {
    console.log("cachedResponse:::"+JSON.stringify(cachedResponse))
    return cachedResponse;
  } else {
    const hours = 24;
    const response = await fetch(process.env.BASE_API_URL+`/access/roles/`);
    const rolesData = await response.json();
    cache.put(url, rolesData, hours * 1000 * 60 * 60);
    console.log("Daata Middleware ::"+JSON.stringify(rolesData))
      const decryptedValue = jwtDecode(token);
      const userRoles = decryptedValue['sub']?.split(":")[3];
      const userRolesArray = userRoles.split(",");
      const urlAllowed = userRolesArray?.map((role, index) => {
          if(rolesData[role].allowedPages?.includes(url)){
              return true;
          }else{
              return false;
          }
      });
      return urlAllowed.includes(true);

  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/account/:path*', '/api/account/:path*', '/api/expense/:path*', '/api/calendar/:path*', '/api/notes/:path*', '/api/timesheet/:path*', '/accounts', '/api/access/roles']
}