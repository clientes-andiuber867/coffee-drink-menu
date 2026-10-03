import 'server-only';
import {createClient, type Client} from '@libsql/client';
import {mkdir} from 'node:fs/promises';
let ready:Promise<Client>|undefined;
export function db(){
  if(!ready) ready=initialize().catch(e=>{ready=undefined;throw e});
  return ready;
}
async function initialize(){
  const url=process.env.DATABASE_URL;
  if(process.env.VERCEL && (!url || url.startsWith('file:'))) throw Error('Configura una base de datos persistente para publicar.');
  if(!url || url.startsWith('file:')) await mkdir('.data',{recursive:true});
  const client=createClient({url:url||'file:.data/coffee.db',authToken:process.env.DATABASE_AUTH_TOKEN});
  await client.batch([
    'CREATE TABLE IF NOT EXISTS sections (id TEXT PRIMARY KEY, name TEXT NOT NULL, description TEXT NOT NULL DEFAULT \'\', position INTEGER NOT NULL DEFAULT 0)',
    'CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, section_id TEXT NOT NULL REFERENCES sections(id) ON DELETE RESTRICT, name TEXT NOT NULL, description TEXT NOT NULL, price REAL NOT NULL CHECK(price>=0), image TEXT NOT NULL, portion TEXT NOT NULL, available INTEGER NOT NULL DEFAULT 1, featured INTEGER NOT NULL DEFAULT 0, position INTEGER NOT NULL DEFAULT 0)',
    'CREATE INDEX IF NOT EXISTS products_section ON products(section_id)',
    'CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, username TEXT NOT NULL, fingerprint TEXT NOT NULL, expires INTEGER NOT NULL)',
    'CREATE TABLE IF NOT EXISTS attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL)',
  ],'write');
  return client;
}
