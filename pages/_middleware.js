import { getToken } from "next-auth/jwt";
import {NextResponse} from 'next/server';

export async function middleware(req){
    const token = await getToken({req,secret:process.env.JWT_SECRET});
    const validToken = await getToken({req,secret:process.env.NEXT_PUBLIC_CLIENT_ID})

    //if token exists then allow to go through

    const {pathname} = req.nextUrl
    if(pathname.includes('/api/auth') || token){
        return NextResponse.next();
    }
    //protected route
    if(!token && pathname !== '/login'){
        return NextResponse.redirect('/login');
    }
}