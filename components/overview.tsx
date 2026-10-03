import {ArrowUpRight, Coffee, CheckCircle2, Clock3, Layers3} from 'lucide-react';
import type {Catalog} from '@/lib/types';
import styles from './overview.module.css';

export function Overview({data,loading,onProducts,onSections}:{data:Catalog;loading:boolean;onProducts:(filter:string)=>void;onSections:()=>void}){
  const available=data.products.filter(p=>p.available).length;
  const paused=data.products.length-available;
  const stats=[
    {label:'Total de productos',value:data.products.length,note:'Todos los productos de tu carta',icon:Coffee,action:()=>onProducts('all'),tone:'coffee'},
    {label:'Productos disponibles',value:available,note:'Disponibles para tus clientes',icon:CheckCircle2,action:()=>onProducts('available'),tone:'sage'},
    {label:'Productos no disponibles',value:paused,note:'Agotados o fuera de servicio',icon:Clock3,action:()=>onProducts('unavailable'),tone:'copper'},
    {label:'Cantidad de secciones',value:data.sections.length,note:'Categorías de tu carta',icon:Layers3,action:onSections,tone:'cream'},
  ];
  return <div className={styles.overview}>
    <section className={styles.welcome}>
      <img className={styles.photo} src="/coffee-hero.webp" alt=""/>
      <div className={styles.welcomeCopy}>
        <span className={styles.eyebrow}>EL CORAZÓN DE TU CAFETERÍA</span>
        <h2>El arte de servir<br/><em>buenos momentos.</em></h2>
        <p>Tu esencia está en cada detalle. Prepara la carta de Coffee Drink para la próxima pausa de tus clientes.</p>
        <a href="/menu" target="_blank" rel="noreferrer" className={styles.menuLink}>Así se ve nuestra carta <ArrowUpRight size={17}/></a>
        <span className={styles.signature}>CAFÉ · HELADOS · POSTRES <i/> HECHO CON AMOR</span>
      </div>
      <div className={styles.emblem}><div><img src="/logo.webp" width="180" height="180" alt="Coffee Drink"/></div><span>PEQUEÑOS DETALLES. GRANDES MOMENTOS.</span></div>
    </section>
    <div className={styles.sectionLabel}><span>TU CARTA, DE UN VISTAZO</span><span>Selecciona un indicador para ver el detalle</span></div>
    <div className={styles.stats}>{stats.map((stat,index)=><button key={stat.label} disabled={loading} className={`${styles.stat} ${styles[stat.tone]}`} onClick={stat.action} style={{animationDelay:`${index*65}ms`}}><span className={styles.statTop}><span className={styles.statIcon}><stat.icon size={21} strokeWidth={1.5}/></span><ArrowUpRight size={16}/></span><strong>{loading?'—':stat.value}</strong><span className={styles.statLabel}>{stat.label}</span><small>{stat.note}</small></button>)}</div>
  </div>;
}
