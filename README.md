# Fiesta Kid's - Plataforma de Entretenimiento Digital

> **Landing Page Oficial** desarrollada con enfoque Mobile-First, optimización de rendimiento y estándares modernos de la web (W3C).

![Project Status](https://img.shields.io/badge/Status-Production-brightgreen) ![Tech](https://img.shields.io/badge/Stack-Vanilla_Web-blue)

Este proyecto es la presencia digital oficial de **Fiesta Kid's**, una agencia de entretenimiento en Puebla. No es solo un sitio estático; integra **experiencia de usuario sensorial (Audio UX)**, accesibilidad mediante **Text-to-Speech** y una arquitectura CSS moderna utilizando **Container Queries**.

 **Demo en vivo:** [https://fiestakids.com.mx](https://fiestakids.com.mx)

## Características Técnicas Destacadas

Lo que hace especial a este desarrollo bajo el capó:

### UI/UX Avanzado
* **Diseño "Glassmorphism":** Uso intensivo de `backdrop-filter` para efectos de vidrio esmerilado en modales y menús.
* **Animaciones CSS Hardware-Accelerated:** Gradientes animados (`animate-gradient`), efectos glitch y transiciones suaves optimizadas para GPU.
* **Container Queries (`@container`):** El portafolio se adapta no solo al tamaño de la pantalla, sino al tamaño de su contenedor padre, una técnica CSS de vanguardia.
* **Audio Feedback:** Interacciones sonoras al pasar el mouse (hover) y al interactuar con las tarjetas (flip), mejorando la inmersión.

### Ingeniería y Funcionalidad
* **API de Síntesis de Voz:** Integración con `window.speechSynthesis` para que la web "lea" las descripciones de los servicios en los modales (Accesibilidad).
* **Lazy Loading & Performance:** Carga diferida de recursos multimedia y observadores de intersección (`IntersectionObserver`) para animaciones al hacer scroll.
* **SEO Técnico (Schema.org):** Implementación de JSON-LD para `LocalBusiness` y `EntertainmentBusiness`, mejorando la indexación en Google.
* **PWA Ready:** Configuración de `site.webmanifest` y metaetiquetas para instalación en dispositivos móviles.

## Stack Tecnológico

El proyecto evita dependencias pesadas para garantizar la máxima velocidad de carga (Lighthouse Optimization).

| Tecnología | Uso Principal |
| :--- | :--- |
| **HTML5 Semántico** | Estructura, SEO y Accesibilidad (ARIA). |
| **CSS3 (Euforia Style)** | Variables CSS, Grid, Flexbox, Keyframes y Media/Container Queries. |
| **JavaScript (ES6+)** | Lógica del DOM, APIs del navegador (Audio, Speech, Observer) sin frameworks. |
| **Open Graph** | Protocolo para previsualización rica en redes sociales (WhatsApp, Facebook). |

## Estructura del Repositorio

El proyecto mantiene una arquitectura limpia y modular:

```text
fiestakids-landing-page/
├── 📂 css/
│   └── style_euforia.css   # Estilos principales y animaciones
├── 📂 js/
│   └── euforia.js          # Lógica: Modales, Audio, Speech API
├── 📂 imagenes/            # Assets optimizados (.webp / .jpg)
├── 📂 videos/              # Recursos de video para Hero Section
├── 📂 musica/              # Efectos de sonido (UI Sounds)
├── 📂 logos/               # Branding e identidad
├── 📂 og/                  # Imágenes para Open Graph (Redes Sociales)
├── index.html              # Entry point
├── site.webmanifest        # Configuración PWA
└── [Paginas Legales]       # Privacidad, Términos, Reglamento
```


## Contacto y Créditos

Desarrollado y mantenido por **Mars Sotelo**.

* **Portfolio / GitHub:** [MarsSotelo](https://github.com/MarsSotelo)
* **Web Oficial:** [fiestakids.com.mx](https://fiestakids.com.mx)
* **Email:** fiesta_kids2025@outlook.com y mars_sotelo@outlook.com

---
© 2025 Fiesta Kid's. Todos los derechos reservados.
