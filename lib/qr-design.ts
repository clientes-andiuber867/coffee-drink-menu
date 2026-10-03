// The preview and download use the same lossless, print-resolution image.
function loadImage(src:string):Promise<HTMLImageElement>{return new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>reject(Error('No se pudo cargar el logo para el diseño.'));img.src=src;});}
export async function createQrPoster(qr:string):Promise<Blob>{
  const [logo,code]=await Promise.all([loadImage('/logo-large.webp'),loadImage(qr)]);
  const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=2400;
  const c=canvas.getContext('2d');if(!c)throw Error('No se pudo preparar el diseño.');
  const bg=c.createLinearGradient(0,0,1600,2400);bg.addColorStop(0,'#4a2c1a');bg.addColorStop(.45,'#291c14');bg.addColorStop(1,'#18120e');c.fillStyle=bg;c.fillRect(0,0,1600,2400);
  const glow=c.createRadialGradient(800,325,50,800,325,650);glow.addColorStop(0,'#c4864933');glow.addColorStop(1,'#c4864900');c.fillStyle=glow;c.fillRect(0,0,1600,1100);
  c.strokeStyle='#b98a5c';c.lineWidth=2;c.strokeRect(52,52,1496,2296);c.strokeStyle='#b98a5c40';c.strokeRect(68,68,1464,2264);
  // Copper rings around the original logo. Nothing overlaps the QR quiet zone.
  [194,213].forEach((r,i)=>{c.beginPath();c.arc(800,310,r,0,Math.PI*2);c.strokeStyle=i?'#c59a6944':'#c59a6999';c.lineWidth=2;c.stroke()});
  c.save();c.beginPath();c.arc(800,310,172,0,Math.PI*2);c.clip();c.drawImage(logo,628,138,344,344);c.restore();
  c.textAlign='center';c.fillStyle='#f7e9d5';c.font='bold 87px Georgia, serif';c.fillText('Coffee Drink',800,624);
  c.fillStyle='#c99b6c';c.font='24px Arial, sans-serif';c.fillText('C A F É   ·   H E L A D O S   ·   P O S T R E S',800,682);
  c.beginPath();c.moveTo(620,744);c.lineTo(980,744);c.strokeStyle='#9c7049';c.stroke();
  c.fillStyle='#dab184';c.font='23px Arial, sans-serif';c.fillText('E S C A N E A   Y   D I S F R U T A',800,827);
  c.fillStyle='#fff6e9';c.font='70px Georgia, serif';c.fillText('Tu próxima pausa',800,935);c.font='italic 79px Georgia, serif';c.fillStyle='#edbf91';c.fillText('empieza aquí.',800,1026);
  c.fillStyle='#ffffff';c.beginPath();c.roundRect(290,1120,1020,1020,35);c.fill();
  c.imageSmoothingEnabled=false;c.drawImage(code,300,1130,1000,1000);c.imageSmoothingEnabled=true;
  c.fillStyle='#e3b787';c.font='40px Georgia, serif';c.fillText('Nuestra carta digital',800,2225);
  c.fillStyle='#bca58a';c.font='22px Arial, sans-serif';c.fillText('Un buen café. Un momento para ti.',800,2280);
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,'image/png'));
  if(!blob)throw Error('No se pudo generar la descarga.');return blob;
}
