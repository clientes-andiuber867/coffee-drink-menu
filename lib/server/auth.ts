import 'server-only';
import {randomBytes,createHash,scryptSync,timingSafeEqual} from 'node:crypto';
import {cookies} from 'next/headers';
import {db} from './db';
export const cookieName='coffee_session';
export const digest=(value:string)=>createHash('sha256').update(value).digest('hex');
export function accountHash(username:string){
  if(username===process.env.ADMIN_USERNAME)return process.env.ADMIN_PASSWORD_HASH;
  if(username===process.env.OWNER_USERNAME)return process.env.OWNER_PASSWORD_HASH;
}
export function verify(password:string,encoded?:string){
  const [salt,hash]=(encoded||'invalid:').split(':');
  const actual=scryptSync(password,salt,64);
  const expected=Buffer.from(hash||'','hex');
  return expected.length===actual.length && timingSafeEqual(actual,expected);
}
export async function currentUser(){
  const token=(await cookies()).get(cookieName)?.value;
  if(!token)return null;
  const result=await (await db()).execute({sql:'SELECT username,fingerprint FROM sessions WHERE token=? AND expires>?',args:[digest(token),Date.now()]});
  const row=result.rows[0];
  if(!row)return null;
  const hash=accountHash(String(row.username));
  return hash && digest(hash)===row.fingerprint?String(row.username):null;
}
export async function session(username:string){
  const token=randomBytes(32).toString('hex');
  const client=await db();
  await client.batch([{sql:'DELETE FROM sessions WHERE expires<?',args:[Date.now()]},{sql:'INSERT INTO sessions VALUES (?,?,?,?)',args:[digest(token),username,digest(accountHash(username)!),Date.now()+8*3600000]}],'write');
  return token;
}
export function assertOrigin(request:Request){
  const origin=request.headers.get('origin');
  const host=request.headers.get('host')||new URL(request.url).host;
  let valid=false;
  try{const parsed=new URL(origin||'');valid=['http:','https:'].includes(parsed.protocol)&&parsed.origin===origin&&parsed.host===host;}catch{}
  if(!valid)throw new HttpError(403,'Solicitud no permitida.');
}
export async function authorize(request:Request){assertOrigin(request);if(!await currentUser())throw new HttpError(401,'Tu sesión terminó. Vuelve a ingresar.');}
export class HttpError extends Error {constructor(public status:number,message:string){super(message)}}
export function failure(e:unknown){
  if(e instanceof HttpError)return Response.json({error:e.message},{status:e.status});
  console.error(e);
  return Response.json({error:'No se pudo completar la operación. Intenta de nuevo.'},{status:500});
}
