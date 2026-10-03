import {cookies} from 'next/headers';
import {assertOrigin,cookieName,digest,failure} from '@/lib/server/auth';
import {db} from '@/lib/server/db';
import {NextResponse} from 'next/server';
export async function POST(request:Request){try{assertOrigin(request);const token=(await cookies()).get(cookieName)?.value;if(token)await(await db()).execute({sql:'DELETE FROM sessions WHERE token=?',args:[digest(token)]});const response=NextResponse.json({ok:true});response.cookies.set(cookieName,'',{httpOnly:true,sameSite:'strict',secure:!!process.env.VERCEL,path:'/',maxAge:0});return response;}catch(e){return failure(e)}}
