import type {Metadata,Viewport} from 'next';
import './globals.css';
import './brand-motion.css';
import './login-identity.css';
import './qr-studio.css';
import './admin-premium.css';
import './menu-editorial.css';
export const metadata:Metadata={title:'Coffee Drink · Un buen café, un buen momento',applicationName:'Coffee Drink',description:'Café, postres y pequeños momentos para disfrutar. Descubre la carta de Coffee Drink.',manifest:'/manifest.webmanifest',appleWebApp:{capable:true,title:'Coffee Drink',statusBarStyle:'default'},icons:{icon:[{url:'/brand/favicon.ico',sizes:'any'},{url:'/brand/favicon-32.png',sizes:'32x32',type:'image/png'},{url:'/brand/icon-192.png',sizes:'192x192',type:'image/png'}],shortcut:'/brand/favicon.ico',apple:[{url:'/brand/apple-touch-icon.png',sizes:'180x180',type:'image/png'}]}};
export const viewport:Viewport={themeColor:'#2d1d13'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es"><body>{children}</body></html>}
