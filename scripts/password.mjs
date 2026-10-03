import {randomBytes,scryptSync} from 'node:crypto';
import {createInterface} from 'node:readline/promises';
const input=createInterface({input:process.stdin,output:process.stdout});
console.log('Escribe una contraseña nueva (mínimo 12 caracteres). La entrada es visible solo en esta terminal.');
const password=await input.question('Contraseña: ');input.close();
if(password.length<12||password.length>256){console.error('Debe tener entre 12 y 256 caracteres.');process.exit(1)}
const salt=randomBytes(16).toString('hex');
console.log('Hash para la variable privada:');console.log(salt+':'+scryptSync(password,salt,64).toString('hex'));
