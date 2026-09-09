# Ritmo Gym

Diario de entrenamiento en español para iOS, Android y web, construido con Expo, React Native y TypeScript. Supabase gestiona las cuentas y la copia sincronizada de cada usuario.

## Funciones

- Registro de fecha, ejercicio de un catálogo de 61 opciones, series, repeticiones, kg y notas.
- Volumen = suma de kg × repeticiones de cada serie. Los ejercicios con 0 kg cuentan series/repeticiones, pero no volumen externo. No estima calorías ni trabajo mecánico.
- Dashboard de volumen por día, ejercicios con más volumen, carga máxima por ejercicio y contadores.
- Historial y filtros por ejercicio, últimos 7/30/90 días, todo o fechas inclusivas.
- Registro/inicio de sesión con correo y contraseña y confirmación por correo cuando se habilita en Supabase.
- Guardado local primero, cola persistente y reintentos automáticos. Modo local separado para probar sin backend; sus registros no se migran automáticamente a una cuenta.
- PWA instalable con recursos precargados para abrir sin internet después de una primera carga completa.

## Ejecutar

Requiere una versión de Node compatible con Expo 57.

```sh
npm install
npm run web
# o npm run ios / npm run android
npm run typecheck
npm test
npm run build:web
```

El servidor de desarrollo no prueba el modo PWA sin conexión: servir `dist` por HTTP en localhost o HTTPS después de `npm run build:web`.

## Conectar un Supabase independiente

1. Crear un proyecto Supabase. Si la cuenta alcanzó su cupo de proyectos gratuitos, liberar uno o elegir conscientemente un plan antes de continuar.
2. Ejecutar, en orden, `supabase/migrations/001_gym.sql` y `supabase/migrations/002_expand_exercises.sql` en SQL Editor del nuevo proyecto. La migración crea únicamente objetos `gym_*` y políticas por usuario. Ejecutarla una sola vez.
3. Copiar `.env.example` a `.env`; añadir la URL y la clave pública anon/publishable de ese proyecto. Nunca usar `service_role` en la app.
4. En Authentication, habilitar email/contraseña y configurar Site URL con la URL final HTTPS. El despliegue actual permite registro con contraseña sin confirmar email, por decisión del propietario. Activar confirmación requiere configurar SMTP para enviar a personas ajenas a la organización. Tras confirmar en el navegador se puede volver a la app nativa e iniciar sesión con contraseña.
5. Reiniciar Expo y reconstruir la web. Las variables `EXPO_PUBLIC_*` forman parte del paquete público y no son secretos.
6. Validar con dos cuentas reales: una nunca debe poder consultar eventos de la otra. Ver `supabase/verify-rls.sql`.

El proyecto independiente está conectado y el esquema aplicado. No se reutilizó el backend de finanzas. En un clon sin variables, la pantalla de acceso explica la conexión pendiente y permite la prueba local.

## Cómo sincroniza

Cada registro es un evento inmutable con UUID. Al eliminar se añade otro evento que oculta el registro. No se modifican registros existentes y una copia antigua nunca puede revivir un entrenamiento eliminado. Las ediciones se realizan eliminando y registrando de nuevo.

El almacenamiento local se separa por ID de usuario. Cada escritura se confirma al usuario solo tras persistirla. Un bloqueo por instancia serializa las operaciones; en navegadores con Web Locks también coordina las pestañas; los cambios añadidos durante un envío permanecen en la cola. Los reintentos usan inserción idempotente (`ON CONFLICT DO NOTHING`). Se descargan todas las páginas antes de confirmar la sincronización, preservando datos y cola ante fallos. Se privilegia simplicidad y consistencia para un diario personal; a gran escala conviene sustituir la descarga completa por un cursor servidor.

La sincronización ocurre al entrar, recuperar la conexión web, volver al primer plano, manualmente y cada 30 segundos con la app abierta. iOS/Android pueden suspender la app cerrada: en ese caso sincroniza al volver a abrirla. El primer inicio de sesión, crear cuentas y renovar una sesión caducada requieren internet. Una sesión guardada permite consultar y añadir registros locales sin conexión.

La PWA necesita una primera carga online completa para instalar su caché. La caché guarda exclusivamente la aplicación, no las respuestas de Supabase. Actualizaciones nuevas esperan a que se cierren las pestañas de la versión anterior. No borrar los datos del navegador ni desinstalar con cambios pendientes. AsyncStorage no cifra los registros en reposo; el aislamiento de cuentas no sustituye la protección del dispositivo. En navegadores antiguos sin Web Locks, usar una sola pestaña activa por dispositivo. Las pestañas abiertas actualizan su vista en la siguiente sincronización.

## Publicación

GitHub Actions publica `dist` en GitHub Pages al actualizar `main`. Configurar las variables del repositorio `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`. Para alojamiento en una subcarpeta, definir `APP_BASE_PATH` antes de compilar; el flujo usa `/ritmo-gym`. iOS y Android comparten el código; generar binarios y publicar en tiendas requiere configurar firma/cuentas de desarrollador. No se han generado binarios firmados ni publicado en las tiendas.

## Validación

`npm test` cubre cálculo, validación, persistencia tras reapertura, aislamiento local, cortes de red, reintentos sin duplicados, cambios concurrentes durante sincronización y eliminación sin resurrección. Los tests no sustituyen la prueba real de autenticación y RLS con el proyecto Supabase conectado, ni pruebas en dispositivos físicos.

Referencias técnicas: [Expo y Supabase](https://docs.expo.dev/guides/using-supabase/), [Arquitectura local-first en Expo](https://docs.expo.dev/guides/local-first/), [Upsert de Supabase](https://supabase.com/docs/reference/javascript/upsert).
