# Ritmo Gym — estado de entrega

- Backend independiente: proyecto Supabase `hfevonirqcxwjpaqtevf`, región Ohio.
- Esquema `001_gym.sql` aplicado el 8 de septiembre de 2026.
- Pruebas SQL reales completadas: lectura privada por cuenta, rechazo de escritura a otra cuenta, eventos inmutables, reintentos sin duplicados y validación de fecha. Los usuarios y registros de prueba se crearon dentro de una transacción revertida.
- Pruebas locales: 9 casos automatizados aprobados. Exportaciones de Expo para web, iOS y Android correctas; no equivalen a binarios nativos firmados.
- PWA: comprobado arranque y lectura del registro local con el servidor HTTP detenido.
- Configuración pública Supabase guardada en `.env`, excluida de Git. No hay claves de servicio en la app.
- Publicación activa: https://pincho23.github.io/ritmo-gym/
- La primera creación de cuenta e inicio de sesión requieren conexión. Con una sesión guardada, los entrenamientos se conservan offline. Sincroniza con la app abierta o al volver a abrirla.
- Registro abierto con correo y contraseña, sin confirmación de email por elección del propietario.
- Pendiente de prueba por el propietario: crear su cuenta, entrar en dos dispositivos y comprobar sincronización con un entrenamiento real.
