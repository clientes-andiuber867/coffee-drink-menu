import type {Catalog} from './types';
export async function api<T=Catalog>(path:string,method='GET',data?:unknown):Promise<T>{const response=await fetch(path,{method,headers:data?{'Content-Type':'application/json'}:undefined,body:data?JSON.stringify(data):undefined,cache:'no-store'});let result;try{result=await response.json()}catch{throw Error('No se pudo conectar. Intenta de nuevo.')}if(!response.ok){if(response.status===401&&path!='/api/auth/login')window.location.assign('/admin');throw Error(result.error||'No se pudo completar la acción.')}return result;}
export function announce(){const c=new BroadcastChannel('coffee-catalog');c.postMessage('changed');c.close();}
export const money=(price:number)=>new Intl.NumberFormat('es-BO',{style:'currency',currency:'BOB',maximumFractionDigits:2}).format(price);
export async function optimize(file:File){
  if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Selecciona una imagen JPG, PNG o WebP.');
  if(file.size>20*1024*1024)throw Error('La imagen original debe pesar menos de 20 MB.');
  const bitmap=await createImageBitmap(file);const ratio=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
  const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(bitmap.width*ratio));canvas.height=Math.max(1,Math.round(bitmap.height*ratio));
  const ctx=canvas.getContext('2d');if(!ctx){bitmap.close();throw Error('No pudimos preparar la fotografía.');}ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/webp',0.84));
  if(!blob||blob.size>3.5*1024*1024)throw Error('Prueba con una imagen más pequeña.');
  return new File([blob],'product.webp',{type:'image/webp'});
}
