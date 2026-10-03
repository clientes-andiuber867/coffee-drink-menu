import 'server-only';
import {db} from './db';
import type {Catalog} from '../types';
export async function catalog():Promise<Catalog>{
  const client=await db();
  const results=await client.batch(['SELECT * FROM sections ORDER BY position,name,id','SELECT * FROM products ORDER BY position,name,id'],'read');
  return {sections:results[0].rows.map(r=>({id:String(r.id),name:String(r.name),description:String(r.description),position:Number(r.position)})),products:results[1].rows.map(r=>({id:String(r.id),sectionId:String(r.section_id),name:String(r.name),description:String(r.description),price:Number(r.price),image:String(r.image),portion:String(r.portion),available:!!r.available,featured:!!r.featured,position:Number(r.position)}))};
}
