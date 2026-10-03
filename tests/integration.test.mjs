import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const origin=process.env.TEST_ORIGIN||'http://localhost:3003';
const credentials=await readFile('.data/ACCESOS-LOCALES.txt','utf8');
const accounts=[...credentials.matchAll(/Usuario: (.+)\nContraseña: (.+)/g)].map(m=>({username:m[1],password:m[2]}));
let cookie='';
async function request(path,method='GET',data,auth=true,withOrigin=true){return fetch(origin+path,{method,headers:{...(withOrigin?{Origin:origin}:{}),...(auth&&cookie?{Cookie:cookie}:{}),...(data?{'Content-Type':'application/json'}:{})},body:data?JSON.stringify(data):undefined})}
test('Private access, two accounts, complete catalog lifecycle, optimized photos and logout',async()=>{
  const before=await(await request('/api/catalog')).json();
  assert.equal((await request('/api/manage','POST',{kind:'section',data:{}},false)).status,401);
  assert.equal((await request('/api/upload','POST',undefined,false)).status,401);
  assert.equal((await request('/api/auth/login','POST',accounts[0],false,false)).status,403);
  assert.equal((await request('/api/auth/login','POST',{...accounts[0],password:'wrong-password'},false)).status,401);
  const login=await request('/api/auth/login','POST',accounts[0],false);
  assert.equal(login.status,200);const setCookie=login.headers.get('set-cookie');assert.match(setCookie,/HttpOnly/i);assert.match(setCookie,/SameSite=strict/i);cookie=setCookie.split(';')[0];
  const panel=await request('/admin');assert.match(await panel.text(),/Un buen día empieza aquí/);
  assert.equal((await request('/api/manage','POST',{},true,false)).status,403);
  let sectionId,productId;
  try{
    let response=await request('/api/manage','POST',{kind:'section',data:{name:'Prueba de café',description:'Sección temporal de verificación',position:9999}});assert.equal(response.status,200);
    let catalog=await response.json();sectionId=catalog.sections.find(s=>!before.sections.some(old=>old.id===s.id)).id;
    const form=new FormData();form.set('file',new File([await readFile('public/coffee-hero.jpg')],'photo.jpg',{type:'image/jpeg'}));
    const upload=await fetch(origin+'/api/upload',{method:'POST',headers:{Origin:origin,Cookie:cookie},body:form});assert.equal(upload.status,200);const photo=await upload.json();assert.ok(photo.bytes<200000);assert.match(photo.url,/\.webp$/);const media=await request(photo.url);assert.equal(media.headers.get('content-type'),'image/webp');
    const draft={sectionId,name:'Café temporal',description:'Descripción de prueba',price:18.5,image:photo.url,portion:'250 ml',available:true,featured:true,position:0};
    assert.equal((await request('/api/manage','POST',{kind:'product',data:{...draft,price:-1}})).status,400);
    assert.equal((await request('/api/manage','POST',{kind:'product',data:{...draft,image:'javascript:alert(1)'}})).status,400);
    response=await request('/api/manage','POST',{kind:'product',data:draft});assert.equal(response.status,200);catalog=await response.json();productId=catalog.products.find(p=>p.sectionId===sectionId).id;
    const publicCatalog=await(await request('/api/catalog','GET',undefined,false)).json();assert.equal(publicCatalog.products.find(p=>p.id===productId).price,18.5);
    response=await request('/api/manage','POST',{kind:'product',data:{...draft,id:productId,name:'Café editado',available:false,price:20}});assert.equal(response.status,200);
    const changed=await(await request('/api/catalog','GET',undefined,false)).json();assert.equal(changed.products.find(p=>p.id===productId).available,false);assert.equal(changed.products.find(p=>p.id===productId).name,'Café editado');
    assert.equal((await request('/api/manage','DELETE',{kind:'section',id:sectionId})).status,409);
    assert.equal((await request('/api/manage','POST',{kind:'section',data:{id:sectionId,name:'Sección editada',description:'Editada',position:9998}})).status,200);
    assert.equal((await request('/menu','GET',undefined,false)).status,200);
  }finally{
    if(productId)assert.equal((await request('/api/manage','DELETE',{kind:'product',id:productId})).status,200);
    if(sectionId)assert.equal((await request('/api/manage','DELETE',{kind:'section',id:sectionId})).status,200);
  }
  assert.deepEqual(await(await request('/api/catalog')).json(),before);
  assert.equal((await request('/api/auth/logout','POST')).status,200);
  assert.equal((await request('/api/manage','POST',{kind:'section',data:{}})).status,401);
  const owner=await request('/api/auth/login','POST',accounts[1],false);assert.equal(owner.status,200);cookie=owner.headers.get('set-cookie').split(';')[0];assert.equal((await request('/api/auth/logout','POST')).status,200);
});
