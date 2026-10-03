# Coffee Drink

Carta digital y panel privado de cafetería. Next.js, React y TypeScript, preparados para GitHub y Vercel.

Repositorio: [clientes-andiuber867/coffee-drink-menu](https://github.com/clientes-andiuber867/coffee-drink-menu).

Web: [Coffee Drink](https://coffee-drink-menu.vercel.app).

## Uso local

Requiere Node.js 22.13 o posterior.

```sh
npm ci
npm run setup
npm run dev
```

- Panel y login: http://localhost:3003/admin
- Carta de clientes: http://localhost:3003/menu
- Dos cuentas independientes: `administrador` y `propietario`. Las contraseñas aleatorias locales se generan en `.data/ACCESOS-LOCALES.txt`. Ese archivo nunca debe compartirse ni subirse a GitHub. `setup` no sobrescribe accesos existentes.
- En esta instalación el acceso del administrador se cambió a `admin` con la contraseña solicitada por el propietario. Consulta el archivo privado de accesos para los valores vigentes; el segundo acceso se conserva.
- Productos y sesiones se guardan en SQLite, en `.data/coffee.db`; fotos en `.data/uploads`. No utiliza localStorage como base de datos.
- El catálogo empieza sin productos. En esta instalación local ya están preparadas las secciones Cafés, Helados y Postres. En una instalación nueva, primero crea secciones, luego productos. Los precios usan bolivianos (Bs).

## Funciones

Login con dos cuentas privadas, resumen de productos disponibles/no disponibles, secciones editables, altas/ediciones/bajas de productos, orden numérico de secciones y productos, fotografías, porciones y especiales de la casa. No incluye pedidos, pagos ni control de cantidades en inventario.

El QR apunta exclusivamente a `/menu` y se descarga en dos formatos: solo QR en PNG de 1000 × 1000 px, o cartel completo de 1600 × 2400 px con el logo original y diseño espresso/cobre. La vista previa usa la misma imagen que se descarga, conserva el margen blanco del QR y no superpone el logo sobre el código. La carta pública es de solo lectura. La disponibilidad se señala en cada producto. Misma pestaña/origen: BroadcastChannel; otros dispositivos: actualización cada 15 segundos mientras la página está visible.

El navegador y los accesos directos usan el logo original: favicon ICO multirresolución, iconos PNG de 192/512 px, variante maskable y Apple Touch Icon. El manifiesto identifica la aplicación como Coffee Drink y abre `/admin`. No incluye funcionamiento sin conexión. Para regenerar estos recursos si cambia el logo: `node scripts/brand-icons.mjs`.

Las imágenes JPG, PNG y WebP (original de hasta 20 MB) se redimensionan en el navegador a 1600 px antes de enviarse. El servidor valida y convierte a WebP de hasta 1200 px, calidad 78, elimina metadatos y limita la cantidad de píxeles decodificados. Los productos usan imágenes con carga diferida. Las imágenes eliminadas o reemplazadas permanecen en el almacenamiento; no se borran automáticamente para evitar referencias rotas.

## Publicar con GitHub y Vercel

1. Crea un repositorio privado o público en GitHub y sube el proyecto sin `.env.local`, `.data`, `node_modules` ni `.next`. `.gitignore` ya excluye estos archivos.
2. Crea una base de datos en **Turso**. Copia su URL `libsql://…` y token. La aplicación crea las tablas al conectarse por primera vez. No copies la URL `file:` a Vercel.
3. Importa el repositorio en **Vercel** como proyecto Next.js. No requiere un archivo `vercel.json` ni comando personalizado.
4. Crea un almacén **Vercel Blob público** y conéctalo al proyecto para obtener `BLOB_READ_WRITE_TOKEN`. Solo las fotos son públicas; las cargas pasan por el servidor y requieren sesión privada.
5. Configura las variables de abajo en Vercel y despliega. No marques ningún secreto como `NEXT_PUBLIC_`.
6. Desde el dominio público, entra al panel, carga la carta y descarga su QR definitivo. Comprueba el enlace en un teléfono sin sesión. Si Vercel tiene protección de despliegue activa, el dominio de la carta debe permitir acceso público.

| Variable | Valor |
| --- | --- |
| `DATABASE_URL` | URL `libsql://…` de Turso |
| `DATABASE_AUTH_TOKEN` | Token privado de Turso |
| `BLOB_READ_WRITE_TOKEN` | Token privado de Vercel Blob |
| `ADMIN_USERNAME` | Nombre de acceso en minúsculas |
| `ADMIN_PASSWORD_HASH` | Hash del administrador de `.env.local` |
| `OWNER_USERNAME` | Segundo nombre de acceso, distinto del primero |
| `OWNER_PASSWORD_HASH` | Hash del propietario de `.env.local` |
| `NEXT_PUBLIC_SITE_URL` | Dominio final, por ejemplo `https://coffee-drink.vercel.app` |

Si conectas Turso desde el Marketplace de Vercel, la aplicación reconoce directamente `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN`, sin copiar las claves ni renombrarlas. Estas variables tienen prioridad sobre `DATABASE_URL` y `DATABASE_AUTH_TOKEN`.

Es posible usar los hashes locales en Vercel para conservar las mismas contraseñas. Preferiblemente genera contraseñas nuevas para producción. Para generar un hash propio sin imprimir la contraseña en el historial: `node scripts/password.mjs`; copia el hash resultante en la variable correspondiente y vuelve a desplegar. Cambiar el hash invalida las sesiones anteriores de esa cuenta.

Los datos locales y los publicados son independientes. Antes de producción, configura Turso, Vercel Blob y las variables privadas, y carga los productos definitivos en el panel publicado. Subir el código a GitHub no crea automáticamente la base de datos ni el sitio en Vercel.

## Seguridad

Contraseñas con scrypt y salt aleatorio; sesiones de 256 bits guardadas como SHA-256, con caducidad de 8 horas. Cookie HttpOnly, SameSite=Strict y Secure en Vercel/HTTPS. La salida revoca la sesión en la base. Protección de origen en todas las escrituras; permisos comprobados en el servidor, validación con Zod y SQL parametrizado. Diez intentos por cuenta cada 15 minutos, persistidos en base de datos. No existe registro público ni recuperación por correo.

En Vercel no se admite almacenamiento local de datos ni fotos; la configuración incompleta se rechaza para evitar pérdidas entre ejecuciones.

## Comprobaciones

```sh
npm run build
npm run start
# En otra terminal, con el servidor local activo:
npm test
```

Las pruebas crean y eliminan una sección y un producto temporales, comprueban las dos cuentas, sesión y revocación, rechazo de escrituras públicas y origen ajeno, validación, fotos optimizadas, catálogo público y protección de secciones con productos. Una foto temporal de prueba permanece en `.data/uploads`.

## Recursos

Logo original proporcionado por el usuario: `coffee drink logo.jfif`, convertido a WebP para la web.

Fotografía: [Brennan Martinez, Unsplash](https://unsplash.com/photos/black-ceramic-teacup-with-coffee--fDgl2HSng4), [licencia Unsplash](https://unsplash.com/license). Fuentes DM Sans y Manrope, Google Fonts, con fallback local si no hay conexión.

Referencias de despliegue: [Next.js en Vercel](https://vercel.com/docs/frameworks/full-stack/nextjs), [Turso y libSQL](https://docs.turso.tech/sdk/ts/quickstart), [Vercel Blob](https://vercel.com/docs/vercel-blob), [límite de cargas en Vercel Functions](https://vercel.com/docs/functions/limitations).
