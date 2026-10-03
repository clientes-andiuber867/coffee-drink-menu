import sharp from 'sharp';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('public/brand',{recursive:true});
async function roundLogo(size){return sharp('public/logo.jpg').resize(size,size).composite([{input:Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2}" fill="white"/></svg>`),blend:'dest-in'}]).png().toBuffer();}
for(const size of [192,512,32])await writeFile(`public/brand/${size===32?'favicon-32':`icon-${size}`}.png`,await roundLogo(size));
for(const [name,size,logoSize] of [['icon-maskable-512',512,380],['apple-touch-icon',180,150]]){
  await sharp({create:{width:size,height:size,channels:4,background:'#2d1d13'}}).composite([{input:await roundLogo(logoSize),gravity:'centre'}]).png().toFile(`public/brand/${name}.png`);
}
const sizes=[16,32,48,256];const images=await Promise.all(sizes.map(roundLogo));
const header=Buffer.alloc(6+16*sizes.length);header.writeUInt16LE(1,2);header.writeUInt16LE(sizes.length,4);let offset=header.length;
images.forEach((image,i)=>{const at=6+i*16;header[at]=sizes[i]===256?0:sizes[i];header[at+1]=header[at];header.writeUInt16LE(1,at+4);header.writeUInt16LE(32,at+6);header.writeUInt32LE(image.length,at+8);header.writeUInt32LE(offset,at+12);offset+=image.length});
const ico=Buffer.concat([header,...images]);await writeFile('public/brand/favicon.ico',ico);await writeFile('public/favicon.ico',ico);
console.log('Iconos de Coffee Drink creados: favicon, escritorio, Android y Apple.');
