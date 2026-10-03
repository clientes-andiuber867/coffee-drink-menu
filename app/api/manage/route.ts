import {z} from 'zod';
import {randomUUID} from 'node:crypto';
import {authorize,failure,HttpError} from '@/lib/server/auth';
import {db} from '@/lib/server/db';
import {catalog} from '@/lib/server/catalog';
const section=z.object({id:z.string().uuid().optional(),name:z.string().trim().min(2).max(60),description:z.string().trim().max(180),position:z.number().int().min(0).max(9999)});
const product=z.object({id:z.string().uuid().optional(),sectionId:z.string().uuid(),name:z.string().trim().min(2).max(100),description:z.string().trim().max(600),price:z.number().finite().min(0).max(100000),image:z.string().max(1000).refine(v=>!v||/^\/api\/media\/[a-f0-9-]+\.webp$/.test(v)||/^https:\/\/[a-z0-9.-]+\.public\.blob\.vercel-storage\.com\//.test(v)),portion:z.string().trim().max(60),available:z.boolean(),featured:z.boolean(),position:z.number().int().min(0).max(9999)});
export async function POST(request:Request){try{
  await authorize(request);
  if(Number(request.headers.get('content-length')||0)>20000)throw new HttpError(413,'Solicitud demasiado grande.');
  const body=await request.json();const client=await db();
  if(body.kind==='section'){
    const parsed=section.safeParse(body.data);if(!parsed.success)throw new HttpError(400,'Revisa los datos de la sección.');
    const s=parsed.data;
    if(s.id){const result=await client.execute({sql:'UPDATE sections SET name=?,description=?,position=? WHERE id=?',args:[s.name,s.description,s.position,s.id]});if(!result.rowsAffected)throw new HttpError(404,'Esta sección ya no existe.');}
    else await client.execute({sql:'INSERT INTO sections VALUES (?,?,?,?)',args:[randomUUID(),s.name,s.description,s.position]});
  }else if(body.kind==='product'){
    const parsed=product.safeParse(body.data);if(!parsed.success)throw new HttpError(400,'Revisa el nombre, precio, sección y fotografía.');
    const p=parsed.data;
    const exists=await client.execute({sql:'SELECT id FROM sections WHERE id=?',args:[p.sectionId]});if(!exists.rows.length)throw new HttpError(400,'Selecciona una sección existente.');
    const args=[p.sectionId,p.name,p.description,p.price,p.image,p.portion,p.available?1:0,p.featured?1:0,p.position,p.id||randomUUID()];
    const result=await client.execute({sql:p.id?'UPDATE products SET section_id=?,name=?,description=?,price=?,image=?,portion=?,available=?,featured=?,position=? WHERE id=?':'INSERT INTO products (section_id,name,description,price,image,portion,available,featured,position,id) VALUES (?,?,?,?,?,?,?,?,?,?)',args});
    if(p.id&&!result.rowsAffected)throw new HttpError(404,'Este producto ya no existe.');
  }else throw new HttpError(400,'Operación desconocida.');
  return Response.json(await catalog());
}catch(e){return failure(e)}}
export async function DELETE(request:Request){try{
  await authorize(request);const body=await request.json();
  if(!z.string().uuid().safeParse(body.id).success||!['section','product'].includes(body.kind))throw new HttpError(400,'Operación no válida.');
  const client=await db();
  if(body.kind==='section'){
    const result=await client.execute({sql:'DELETE FROM sections WHERE id=? AND NOT EXISTS (SELECT 1 FROM products WHERE section_id=?)',args:[body.id,body.id]});
    if(!result.rowsAffected)throw new HttpError(409,'Mueve o elimina los productos de esta sección antes de quitarla.');
  }else await client.execute({sql:'DELETE FROM products WHERE id=?',args:[body.id]});
  return Response.json(await catalog());
}catch(e){return failure(e)}}
