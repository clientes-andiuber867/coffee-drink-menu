import {ArrowUpRight, Coffee, CheckCircle2, Clock3, Layers3, QrCode, Sparkles} from 'lucide-react';
import type {Catalog} from '@/lib/types';
import styles from './overview.module.css';

export function Overview({data,loading,onQr,onProducts,onSections}:{data:Catalog;loading:boolean;onQr:()=>void;onProducts:(filter:string)=>void;onSections:()=>void}){
  const available=data.products.filter(p=>p.available).length;
  const paused=data.products.length-available;
  const percent=data.products.length?Math.round(available/data.products.length*100):0;
  const stats=[
    {label:'Sabores en la carta',value:data.products.length,note:'Tu colección de favoritos',icon:Coffee,action:()=>onProducts('all'),tone:'coffee'},
    {label:'Listos para servir',value:available,note:'Disponibles para tus clientes',icon:CheckCircle2,action:()=>onProducts('available'),tone:'sage'},
    {label:'En pausa',value:paused,note:'Revisa su disponibilidad',icon:Clock3,action:()=>onProducts('unavailable'),tone:'copper'},
    {label:'Secciones de la casa',value:data.sections.length,note:'Cada sabor, en su lugar',icon:Layers3,action:onSections,tone:'cream'},
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
    <div className={styles.sectionLabel}><span>TU CARTA, DE UN VISTAZO</span><span>El sabor de tu negocio en números</span></div>
    <div className={styles.stats}>{stats.map((stat,index)=><button key={stat.label} disabled={loading} className={`${styles.stat} ${styles[stat.tone]}`} onClick={stat.action} style={{animationDelay:`${index*65}ms`}}><span className={styles.statTop}><span className={styles.statIcon}><stat.icon size={21} strokeWidth={1.5}/></span><ArrowUpRight size={16}/></span><strong>{loading?'—':String(stat.value).padStart(2,'0')}</strong><span className={styles.statLabel}>{stat.label}</span><small>{stat.note}</small></button>)}</div>
    <div className={styles.workbench}>
      <section className={styles.readiness}>
        <div className={styles.cardTop}><span className={styles.eyebrow}>ANTES DE SERVIR</span><Sparkles size={19}/></div>
        <h3>{loading?'Preparando tu resumen…':!data.products.length?'Tu historia empieza con un sabor.':paused?'Cada favorito merece estar listo.':'Tu carta está lista para disfrutar.'}</h3>
        <p>{loading?'Consultando los productos de tu carta.':!data.products.length?'Agrega tus cafés, postres y helados para dar vida a tu carta.':paused?`${paused} ${paused===1?'producto está en pausa. Revísalo':'productos están en pausa. Revísalos'} antes de volver a ofrecerlo${paused===1?'':'s'}.`:'Todos tus productos están marcados como disponibles en la carta.'}</p>
        <div className={styles.progressLabel}><span>Disponibilidad de la carta</span><strong>{loading?'—':`${percent}%`}</strong></div>
        <div className={styles.progress} role="progressbar" aria-label="Porcentaje de productos disponibles" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><span style={{width:`${percent}%`}}/></div>
        <button disabled={loading} className={styles.detailLink} onClick={()=>onProducts(paused?'unavailable':'all')}>{paused?'Revisar productos en pausa':'Gestionar mi carta'}<ArrowUpRight size={17}/></button>
      </section>
      <section className={styles.qrCard}>
        <div><span className={styles.eyebrow}>DE NUESTRA BARRA A SU MESA</span><h3>Un escaneo.<br/><em>Mil pequeños antojos.</em></h3><p>Comparte el sabor de Coffee Drink con una carta que siempre está al día.</p><button onClick={onQr}>Ver mi código QR <ArrowUpRight size={17}/></button></div>
        <div className={styles.qrArt} aria-hidden="true"><span>COFFEE DRINK</span><QrCode size={75} strokeWidth={1.4}/><small>EXPLORA NUESTRA CARTA</small></div>
      </section>
    </div>
  </div>;
}
