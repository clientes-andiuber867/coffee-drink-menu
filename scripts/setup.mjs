import {randomBytes,scryptSync} from 'node:crypto';
import {existsSync,mkdirSync,writeFileSync} from 'node:fs';
if(existsSync('.env.local')){console.log('Ya existe .env.local. No se sobrescribieron los accesos.');process.exit(0);}
mkdirSync('.data',{recursive:true});
const accounts=['administrador','propietario'].map(username=>{const password=randomBytes(15).toString('base64url');const salt=randomBytes(16).toString('hex');return {username,password,hash:salt+':'+scryptSync(password,salt,64).toString('hex')}});
writeFileSync('.env.local',`DATABASE_URL=file:.data/coffee.db\nADMIN_USERNAME=${accounts[0].username}\nADMIN_PASSWORD_HASH=${accounts[0].hash}\nOWNER_USERNAME=${accounts[1].username}\nOWNER_PASSWORD_HASH=${accounts[1].hash}\n`);
writeFileSync('.data/ACCESOS-LOCALES.txt',accounts.map(a=>`Usuario: ${a.username}\nContraseña: ${a.password}`).join('\n\n')+'\n\nAccesos locales privados. No publicar ni subir a GitHub.\n');
console.log('Dos accesos creados. Consulta .data/ACCESOS-LOCALES.txt. Este archivo y .env.local están excluidos de Git.');
