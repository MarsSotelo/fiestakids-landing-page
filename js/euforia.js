// helper
function reproducirVideoSuavemente(video){
  if(!video) return;

  // 1 Lazy-load
  if(!video.src) video.src = video.dataset.src;

  // 2 Reinicia y reproduce cuando esté listo
  video.pause();
  video.currentTime = 0;

  const play = () => video.play().catch(()=>{});
  (video.readyState >= 3)         // HAVE_FUTURE_DATA
    ? play()
    : video.addEventListener('canplay', () => play(), { once:true });
}


/* 
  ESTO ES PARA PODER TENER TODOS LOS LINKS PROTEGIDOS
*/
document.addEventListener("DOMContentLoaded", () => {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
    const rel = link.getAttribute("rel") || "";
    
    if (!rel.includes("noopener") || !rel.includes("noreferrer")) {
        link.setAttribute("rel", "noopener noreferrer");
        }
    });
});


// ESTO ES PARA LA ANIMACION DEL HEADER AL PASAR EL MOUSE SOBRE EL BOTTON UNETE AHORA
const header = document.querySelector('.header');
const button = document.querySelector('.btn');

button.addEventListener('mouseenter', () => {
header.classList.add('animate-gradient');
});
button.addEventListener('mouseleave', () => {
header.classList.remove('animate-gradient');
});



// MEJORAMOS LA ANIMACION EN FIRS MOBILE DEL 'UNETE AHORA'
document.addEventListener("DOMContentLoaded", () => {
  const header       = document.querySelector(".header");
  const menuCheckbox = document.getElementById("open-menu");
  const ctaButton    = document.getElementById("cta-button");
  const hoverSound   = document.getElementById("btn-sound");

  function pararAnimHeader(){ header.classList.remove("animate-gradient"); }

  menuCheckbox.addEventListener("change", () => {
    const isActive = menuCheckbox.checked;

    // ⬇️ Antes: toggle("animate-gradient", isActive)
    // Ahora: la encendemos SOLO una vez y la apagamos al terminar el audio
    if (isActive) {
      header.classList.add("animate-gradient");  // dispara la animación

      // Fallback por si el audio no suena: parar a los N ms (ajusta 2500 a tu gusto)
      const fallback = setTimeout(pararAnimHeader, 9500);

      if (hoverSound) {
        try {
          hoverSound.currentTime = 0;
          hoverSound.play().catch(()=>{});
          hoverSound.onended = () => {            // al acabar el sonido, paramos la animación
            clearTimeout(fallback);
            pararAnimHeader();
          };
        } catch(e){}
      }
    } else {
      // Si se cierra el menú, asegúrate de parar
      pararAnimHeader();
      if (hoverSound) { hoverSound.pause(); hoverSound.currentTime = 0; }
    }

    // Lo demás queda igual
    ctaButton.classList.toggle("btn-active",   isActive);
    ctaButton.classList.toggle("parpadear",    isActive);
  });
});



  // MODALES sin overlay: usando <dialog>::backdrop
document.addEventListener("DOMContentLoaded", () => {
  /* ================== Preferencias de VOZ ================== */
  const PREFERRED_VOICE_NAMES = [
    "Google español de España", "Microsoft Helena", "Microsoft Laura", "Microsoft Monica", "Monica",  "Google español de España"
  ];
  let cachedVoice = null;

  function pickVoice() {
    if (cachedVoice) return cachedVoice;
    const voices = speechSynthesis.getVoices();
    if (!voices.length) return null;

    const esES = voices.filter(v => (v.lang || "").toLowerCase() === "es-es");
    for (const name of PREFERRED_VOICE_NAMES) {
      const found = esES.find(v => v.name.toLowerCase().includes(name.toLowerCase()));
      if (found) return (cachedVoice = found);
    }
    if (esES.length) return (cachedVoice = esES[0]);

    const anyES = voices.filter(v => (v.lang || "").toLowerCase().startsWith("es-"));
    if (anyES.length) return (cachedVoice = anyES[0]);

    return null;
  }
  // Cargar voces (Chrome/Edge lo hace de forma asíncrona)
  window.speechSynthesis.onvoiceschanged = () => { cachedVoice = pickVoice(); };
  cachedVoice = pickVoice();

  /* ================== Helper de modales ================== */
  function crearModalConVoz({ openBtnId, modalId, closeBtnId, textoVoz }) {
    const openBtn  = document.getElementById(openBtnId);
    const modal    = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);
    if (!openBtn || !modal || !closeBtn) return;

    const video = modal.querySelector("video");

    function leerTexto(texto) {
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(texto);
        u.lang = "es-ES";   // voz original
        u.rate = 0.95;      // un pelín más natural
        u.pitch = 1;
        const v = pickVoice();
        if (v) u.voice = v;
        speechSynthesis.speak(u);
      } catch (_) {}
    }

    function stopMedia() {
      if (video) { video.pause(); video.currentTime = 0; }
    }

    function closeModalWithTransition(modalEl) {
      modalEl.classList.remove("fade-in");
      modalEl.classList.add("fade-out");
      speechSynthesis.cancel();
      stopMedia();
      setTimeout(() => {
        modalEl.close();
        const portfolio = document.getElementById("portfolio");
        if (portfolio) portfolio.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }

    openBtn.addEventListener("click", () => {
      modal.showModal();
      modal.classList.remove("fade-out");
      modal.classList.add("fade-in");

      if (typeof reproducirVideoSuavemente === "function") {
        reproducirVideoSuavemente(video);
      } else if (video) {
        video.muted = true;
        video.play().catch(() => {});
        setTimeout(() => { video.muted = false; }, 250);
      }
      if (textoVoz) leerTexto(textoVoz);
    });

    closeBtn.addEventListener("click", () => closeModalWithTransition(modal));

    // Cerrar clic fuera del contenido
    modal.addEventListener("click", (e) => {
      const content = modal.querySelector(".card-modal__content");
      if (!content) return;
      const r = content.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        closeModalWithTransition(modal);
      }
    });

    // Cerrar con ESC
    modal.addEventListener("cancel", (ev) => {
      ev.preventDefault();
      closeModalWithTransition(modal);
    });
  }

  /* ================== Instancias ================== */
  crearModalConVoz({
    openBtnId: "open-one-modal",
    modalId: "modalOne",
    closeBtnId: "closeOneBtn",
    textoVoz: "Plimplim y sus amigos,para una fiesta inolvidable."
  });

  crearModalConVoz({
    openBtnId: "open-two-modal",
    modalId: "modalTwo",
    closeBtnId: "closeTwoBtn",
    textoVoz: "Vive la magia y alegría del show de vely y Beto"
  });

  crearModalConVoz({
    openBtnId: "open-three-modal",
    modalId: "modalThree",
    closeBtnId: "closeThreeBtn",
    textoVoz: "Luli pampin, una experiencia que recordarán por siempre"
  });

  crearModalConVoz({
    openBtnId: "open-four-modal",
    modalId: "modalFour",
    closeBtnId: "closeFourBtn",
    textoVoz: "El show de Frozen, la fantasía que quedará grabada en sus corazones!"
  });

  crearModalConVoz({
    openBtnId: "open-five-modal",
    modalId: "modalFive",
    closeBtnId: "closeFiveBtn",
    textoVoz: "Mickey y Minnie llevan la magia de Disney a tu fiesta."
  });

  crearModalConVoz({
    openBtnId: "open-six-modal",
    modalId: "modalSix",
    closeBtnId: "closeSixBtn",
    textoVoz: "Spiderman, el musculoso hombre araña."
  });

  crearModalConVoz({
    openBtnId: "open-seven-modal",
    modalId: "modalSeven",
    closeBtnId: "closeSevenBtn",
    textoVoz: "inflables, una aventura llena de saltos, risas y energía"
  });

  crearModalConVoz({
    openBtnId: "open-eight-modal",
    modalId: "modalEight",
    closeBtnId: "closeEightBtn",
    textoVoz: "Brincolines: ¡salta, ríe y disfruta!"
  });

  crearModalConVoz({
    openBtnId: "open-nine-modal",
    modalId: "modalNine",
    closeBtnId: "closeNineBtn",
    textoVoz: "Mesa de dulces, ¡Un toque delicioso que hará que tu celebración sea inolvidable!"
  });

  crearModalConVoz({
    openBtnId: "open-ten-modal",
    modalId: "modalTen",
    closeBtnId: "closeTenBtn",
    textoVoz: "¿Si no encuentras tu personaje favorito o lo que buscas, pregunta por ello, seguro lo tenemos."
  });
});



// animation de aparecer
/* scroll-fade ----------------------------------------------*/
const observer = new IntersectionObserver(
  ([entry], obs) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      obs.disconnect();
    }
  },
  { rootMargin: '0px 0px -20% 0px' }
);

document.querySelectorAll('.location-section')
        .forEach(el => observer.observe(el));



















// Opción con JS mantener el <button> Unete Ahora-->

  const whatsappURL =
    "https://wa.me/522331106612?text=" +
    encodeURIComponent("Hola, quiero contratar sus servicios");

  document.getElementById("cta-button")
          .addEventListener("click", () =>
            window.open(whatsappURL, "_blank", "noopener"));




          // Efecto de sonido de burbuja en el horario, para los bloques


document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("hover-sound");

  if (!audio) {
    console.warn("Audio file not found.");
    return;
  }

  audio.load();

  // Seleccionamos todos los bloques que comienzan con class__ y que NO tienen class__down
  const classBlocks = document.querySelectorAll("[class^='class__']:not(.class__down)");

  const playSound = () => {
    try {
      audio.pause();
      audio.currentTime = 0;
      audio.play();
    } catch (err) {
      console.error("Error al reproducir el sonido:", err);
    }
  };

  classBlocks.forEach(block => {
    block.addEventListener("touchstart", playSound, { passive: true });
    block.addEventListener("click", playSound);
    block.addEventListener("mouseenter", playSound); // hover
  });
});




// efecto de sonido flipscards

// Efecto de sonido para las flip-cards
document.addEventListener('DOMContentLoaded', () => {
  const flipAudio = document.getElementById('flip-sound');
  if (!flipAudio) return;

  flipAudio.load();                       // Pre-carga para evitar retrasos
  const flipCards = document.querySelectorAll('.flip-card');

  // Dispositivos sin hover → coarse pointer (móvil / táctil)
  const isMobile = window.matchMedia('(hover: none), (pointer: coarse)').matches;

  const playFlipSound = () => {
    flipAudio.pause();
    flipAudio.currentTime = 0;
    flipAudio.play().catch(() => { /* ignore autoplay errors */ });
  };

  flipCards.forEach(card => {
    if (isMobile) {
      // Solo click en móviles
      card.addEventListener('click', playFlipSound);
    } else {
      // Solo hover en escritorio
      card.addEventListener('mouseenter', playFlipSound);
      // Asegúrate de NO registrar el click (si tuvieras otro script que lo hizo, elimínalo):
      // card.removeEventListener('click', playFlipSound);
    }
  });
});





// <!-- ========== MAILTO SCRIPT Snipet ========== -->

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contactForm');
  if (!form) return; // Evita errores si no está en el DOM

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const get = id => (document.getElementById(id)?.value || '').trim();

    const nombre    = get('name');
    const apellido  = get('lastname');
    const correo    = get('email');
    const mensaje   = get('message');
    const identidad = get('identy');

    const asunto = `Contacto Web – ${nombre} ${apellido}`.trim();

    // Usa CRLF (\r\n) para máxima compatibilidad con Outlook
    const cuerpo = [
      `Nombre: ${nombre} ${apellido}`,
      `ID: ${identidad}`,
      `E-mail: ${correo}`,
      '',
      'Mensaje:',
      mensaje
    ].join('\r\n');

    const mailto = `mailto:fiesta_kids2025@outlook.com` +
                   `?subject=${encodeURIComponent(asunto)}` +
                   `&body=${encodeURIComponent(cuerpo)}`;

    window.location.href = mailto;   // o window.open(mailto, '_self');
    form.reset();
  });
});



















// Mensaje para Los pases de batalla
document.addEventListener('DOMContentLoaded', () => {
  // Configuración de teléfonos y mensajes para cada pase
  const config = {
    1: {
      phone: '522331106612',
      message: 'Hola, me interesa contratar al Patron.'
    },
    2: {
      phone: '522331106612',
      message: 'Hola, me interesa un show con Animador'
    },
    3: {
      phone: '522331106612',
      message: 'Hola, me interesa un show de Payaso'
    },
    4: {
      phone: '522331106612',
      message: 'Hola, me interesa un show de striper'
    }
  };

  // Recorremos cada entrada de la configuración
  Object.entries(config).forEach(([btnId, { phone, message }]) => {
    const button = document.getElementById(`cta-button-${btnId}`);
    if (!button) return; // si no existe el botón, seguimos

    button.addEventListener('click', () => {
      const text = encodeURIComponent(message);
      const url = `https://wa.me/${phone}?text=${text}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    });
  });
});





//  animacion barras modales 
function animateCounter(counterEl, target, duration = 900) {
  // Evita múltiples animaciones simultáneas
  if (counterEl._animating) return;
  counterEl._animating = true;

  let start = 0;
  const startTimestamp = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTimestamp;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.round(progress * target);

    counterEl.textContent = current + "%";
    if (progress < 1) {
      counterEl._animationFrame = requestAnimationFrame(update);
    } else {
      counterEl.textContent = target + "%";
      counterEl._animating = false;
    }
  }
  counterEl._animationFrame = requestAnimationFrame(update);
}

function resetCounter(counterEl) {
  if (counterEl._animationFrame) {
    cancelAnimationFrame(counterEl._animationFrame);
    counterEl._animationFrame = null;
  }
  counterEl.textContent = "0%";
  counterEl._animating = false;
}

const observar = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const bar = entry.target;
    const percent = parseInt(bar.getAttribute('data-percent'), 10) || 0;
    const counterEl = bar.querySelector('.counter');
    if (!counterEl) return;
    if (entry.isIntersecting) {
      // Solo animar si aún no llegó al valor final
      if (bar.style.width !== percent + "%") {
        bar.style.width = percent + "%";
        animateCounter(counterEl, percent);
      }
    } else {
      // Resetear barra y contador
      bar.style.width = "0";
      resetCounter(counterEl);
    }
  });
}, { threshold: 0.5 }); // Cuando la mitad es visible

// Inicializa observer para todas las barras actuales y futuras (por si agregas dinámicamente)
document.querySelectorAll('.card__bar-fill').forEach(bar => {
  bar.style.width = "0";
  const counter = bar.querySelector('.counter');
  if (counter) resetCounter(counter);
  observar.observe(bar);
});
