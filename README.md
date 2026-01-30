# MindPause – App móvil (Expo)

## Descripción

Aplicación móvil para el bienestar digital y control de estrés. Arquitectura preparada para integrar un backend posteriormente sin reescrituras en el front.

## Estado actual

- Router con **Stack + Drawer** (`app/_layout.tsx`, `app/(drawer)/_layout.tsx`).
- Onboarding de **3 pasos** y splash (`app/index.tsx`).
- UI con **React Native Paper** y tema claro/oscuro MD3.
- Datos con **Axios** + **TanStack React Query** (`lib/api.ts`, `hooks/use-data.ts`).
- Autenticación con **Clerk**:
  - Login email/contraseña y **OAuth Google**.
  - Protección de rutas: `SignedIn`/`SignedOut` con redirect a `'/auth/sign-in'`.
  - Manejo seguro de tokens con `expo-secure-store`.
- Callback OAuth manejado en `app/oauth-native-callback.tsx` para cerrar el popup y activar sesión.

## Objetivo final

- Dashboard de estadísticas de consumo (promedios, tendencias, alertas).
- Integración backend real (endpoints, validación de token `Bearer`).
- Gestión de flotas y estaciones, registros de repostaje, reportes.
- Roles/permisos y notificaciones.

## Ejecutar

- Instalar dependencias:
  
  ```bash
  npm install
  ```

- Iniciar en desarrollo:
  
  ```bash
  npx expo start
  ```

## Variables de entorno

- `EXPO_PUBLIC_API_URL`: base URL del backend (mock por ahora).
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: clave publicable de Clerk.

## Configuración de Clerk (dev)

- Habilita Google OAuth en el Dashboard.
- Allowlist de Redirect URLs:
  - Web: `http://localhost:8081/--/oauth-native-callback`
  - Expo Go: `exp://<IP>:<PORT>/--/oauth-native-callback`
  - Dev build nativo: `mindpause://oauth-native-callback`
- Si hay bloqueos de CAPTCHA/Turnstile en dev, desactívalo temporalmente o usa Chrome sin bloqueos.

## Estructura relevante

- `app/_layout.tsx`: Providers (Clerk, Paper, React Query) y navegación raíz.
- `app/(drawer)/_layout.tsx`: Drawer con `Stats`, `Settings`.
- `app/index.tsx`: onboarding y redirección a `'/auth/sign-in'`.
- `app/auth/*`: `sign-in`, `sign-up`, `verify-email` y callback OAuth.
- `lib/api.ts`: cliente Axios.
- `hooks/use-data.ts`: hook genérico con React Query.

## Flujo de navegación

- Onboarding → Login (`/auth/sign-in`) → Drawer (`/(drawer)`).
- En sesión activa, se redirige automáticamente al Drawer.

## Notas

- Cuando se agregue el backend: añadir validación del token, endpoints reales y roles. El front ya deja espacio para enviar `Authorization: Bearer <token>`.
