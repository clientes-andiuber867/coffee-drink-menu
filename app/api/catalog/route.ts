import {catalog} from '@/lib/server/catalog';
import {failure} from '@/lib/server/auth';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await catalog(),{headers:{'Cache-Control':'no-store'}})}catch(e){return failure(e)}}
