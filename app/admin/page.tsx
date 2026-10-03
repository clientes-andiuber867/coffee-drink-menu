import {currentUser} from '@/lib/server/auth';
import {Login} from '@/components/login';
import {Admin} from '@/components/admin';
export const dynamic='force-dynamic';
export const metadata={title:'Administración · Coffee Drink',robots:{index:false,follow:false}};
export default async function AdminPage(){const user=await currentUser();return user?<Admin username={user}/>:<Login/>}
