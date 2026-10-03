import type {MetadataRoute} from 'next';
export default function manifest():MetadataRoute.Manifest{return {
  id:'/',name:'Coffee Drink',short_name:'Coffee Drink',description:'Tu cafetería, tu carta y tus buenos momentos.',lang:'es',start_url:'/admin',scope:'/',display:'standalone',background_color:'#faf5ed',theme_color:'#2d1d13',
  icons:[{src:'/brand/icon-192.png',sizes:'192x192',type:'image/png',purpose:'any'},{src:'/brand/icon-512.png',sizes:'512x512',type:'image/png',purpose:'any'},{src:'/brand/icon-maskable-512.png',sizes:'512x512',type:'image/png',purpose:'maskable'}]
}}
