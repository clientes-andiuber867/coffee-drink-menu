'use client';
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="error-page"><h1>Hagamos una pequeña pausa.</h1><p>No pudimos cargar esta página. Intenta nuevamente.</p><button className="button primary" onClick={reset}>Volver a intentar</button></main>}
