import {authorize,failure,HttpError} from '@/lib/server/auth';
import sharp from 'sharp';
import {randomUUID} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
import {put} from '@vercel/blob';
export const runtime='nodejs';
export async function POST(request:Request){try{
  await authorize(request);
  if(Number(request.headers.get('content-length')||0)>4*1024*1024)throw new HttpError(413,'La foto es demasiado grande.');
  const file=(await request.formData()).get('file');
  if(!(file instanceof File)||file.size>3.5*1024*1024||!['image/jpeg','image/png','image/webp'].includes(file.type))throw new HttpError(400,'Usa una foto JPG, PNG o WebP de menos de 3,5 MB.');
  let output:Buffer;
  try{output=await sharp(Buffer.from(await file.arrayBuffer()),{limitInputPixels:40_000_000}).rotate().resize(1200,1200,{fit:'inside',withoutEnlargement:true}).webp({quality:78,effort:5}).toBuffer()}catch{throw new HttpError(400,'No se pudo leer la imagen. Prueba con otra fotografía.');}
  const name=randomUUID()+'.webp';let url:string;
  if(process.env.BLOB_READ_WRITE_TOKEN){url=(await put('products/'+name,output,{access:'public',contentType:'image/webp',addRandomSuffix:false})).url;}
  else{if(process.env.VERCEL)throw new HttpError(503,'Configura el almacenamiento de imágenes antes de subir fotografías.');await mkdir('.data/uploads',{recursive:true});await writeFile('.data/uploads/'+name,output);url='/api/media/'+name;}
  return Response.json({url,bytes:output.length});
}catch(e){return failure(e)}}
