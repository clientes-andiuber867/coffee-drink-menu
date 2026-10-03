'use client';
import {useEffect,useRef,useId} from 'react';
import {X} from 'lucide-react';
export function Modal({title,children,onClose,busy=false,wide=false}:{title:string;children:React.ReactNode;onClose:()=>void;busy?:boolean;wide?:boolean}){
  const ref=useRef<HTMLDialogElement>(null),id=useId();
  useEffect(()=>{const d=ref.current;const previous=document.activeElement as HTMLElement|null;d?.showModal();const overflow=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{d?.close();document.body.style.overflow=overflow;previous?.focus()}},[]);
  return <dialog ref={ref} className={`modal ${wide?'wide':''}`} aria-labelledby={id} onCancel={e=>{e.preventDefault();if(!busy)onClose()}} onClick={e=>{if(e.target===ref.current&&!busy){const r=ref.current.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose()}}}><div className="modal-heading"><h2 id={id}>{title}</h2><button type="button" className="icon-button" aria-label="Cerrar ventana" onClick={onClose} disabled={busy}><X size={22}/></button></div>{children}</dialog>
}
