import {accountHash,assertOrigin,cookieName,digest,failure,HttpError,session,verify} from '@/lib/server/auth';
import {db} from '@/lib/server/db';
import {NextResponse} from 'next/server';
export async function POST(request:Request){try{
  assertOrigin(request);
  if(Number(request.headers.get('content-length')||0)>4096)throw new HttpError(413,'Solicitud demasiado grande.');
  const data=await request.json();
  if(typeof data.username!=='string'||typeof data.password!=='string'||data.username.length>80||data.password.length>256)throw new HttpError(400,'Revisa el usuario y la contraseña.');
  const username=data.username.trim().toLowerCase();
  if(!process.env.ADMIN_PASSWORD_HASH||!process.env.OWNER_PASSWORD_HASH)throw new HttpError(503,'Primero configura los accesos privados de la cafetería.');
  const client=await db(); const now=Date.now();const key=digest(accountHash(username)?username:'unknown');
  const limit=await client.execute({sql:'INSERT INTO attempts (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=CASE WHEN expires<? THEN 1 ELSE count+1 END, expires=CASE WHEN expires<? THEN ? ELSE expires END RETURNING count',args:[key,now+900000,now,now,now+900000]});
  if(Number(limit.rows[0].count)>10)throw new HttpError(429,'Demasiados intentos. Intenta en 15 minutos.');
  if(!verify(data.password,accountHash(username)))throw new HttpError(401,'El usuario o la contraseña no son correctos.');
  await client.execute({sql:'DELETE FROM attempts WHERE key=?',args:[key]});
  const response=NextResponse.json({ok:true});
  response.cookies.set(cookieName,await session(username),{httpOnly:true,sameSite:'strict',secure:!!process.env.VERCEL||new URL(request.url).protocol==='https:',path:'/',maxAge:28800});
  return response;
}catch(e){return failure(e)}}
