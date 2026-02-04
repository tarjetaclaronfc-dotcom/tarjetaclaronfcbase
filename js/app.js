// js/app.js
const $ = (id) => document.getElementById(id);

function safeSetText(id, value) {
  const el = $(id);
  if (!el) return console.warn(`Falta en HTML el id #${id}`);
  el.textContent = value;
}

function safeSetHref(id, value) {
  const el = $(id);
  if (!el) return console.warn(`Falta en HTML el id #${id}`);
  el.href = value;
}

function safeShow(id, show) {
  const el = $(id);
  if (!el) return console.warn(`Falta en HTML el id #${id}`);
  el.style.display = show ? "" : "none";
}

function safeSetSrc(id, value) {
  const el = $(id);
  if (!el) return console.warn(`Falta en HTML el id #${id}`);
  el.src = value;
}

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function buildWaLink(phone, msg) {
  const text = encodeURIComponent(msg || "Hola! Vengo desde tu Tarjeta Digital + NFC 👋");
  return `https://wa.me/${phone}?text=${text}`;
}

async function loadProfile() {
  const profileId = getQueryParam("id") || "ID001";

  const res = await fetch("data/data.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`No se pudo abrir data/data.json (HTTP ${res.status})`);

  const data = await res.json();
  const p = data[profileId];

  if (!p) {
    safeSetText("profileName", "Perfil no encontrado");
    safeSetText("profileRole", `No existe el id: ${profileId}`);
    safeShow("btnWhatsapp", false);
    safeShow("btnInstagram", false);
    safeShow("btnWeb", false);
    safeShow("btnEmail", false);
    safeShow("floatBot", false);
    return;
  }

  // Foto
  if (p.foto) safeSetSrc("profilePhoto", p.foto);

  // Nombre y rol
  safeSetText("profileName", p.nombre || "Sin nombre");
  safeSetText(
    "profileRole",
    p.rol ? `${p.rol} · Tarjeta Digital + NFC` : "Tarjeta Digital + NFC"
  );

  // WhatsApp
  if (p.whatsapp) {
    const waLink = buildWaLink(p.whatsapp, p.mensaje);
    safeSetHref("btnWhatsapp", waLink);
    safeSetHref("floatBot", waLink);
    safeSetText("whatsappSubtitle", p.whatsapp_subtitulo || "Escribime al instante");
    safeShow("btnWhatsapp", true);
    safeShow("floatBot", true);
  } else {
    safeShow("btnWhatsapp", false);
    safeShow("floatBot", false);
  }

  // Instagram
  if (p.instagram && p.instagram.trim()) {
    safeSetHref("btnInstagram", p.instagram);
    safeShow("btnInstagram", true);
  } else {
    safeShow("btnInstagram", false);
  }

  // Web
  if (p.web && p.web.trim()) {
    safeSetHref("btnWeb", p.web);
    safeShow("btnWeb", true);
  } else {
    safeShow("btnWeb", false);
  }

  // Email
  if (p.email && p.email.trim()) {
    const subject = encodeURIComponent("Contacto desde Tarjeta Digital + NFC");
    const body = encodeURIComponent("Hola! Te contacto desde tu Tarjeta Digital + NFC.");
    safeSetHref("btnEmail", `mailto:${p.email}?subject=${subject}&body=${body}`);
    safeSetText("emailSubtitle", p.email);
    safeShow("btnEmail", true);
  } else {
    safeShow("btnEmail", false);
  }

  // Bot image opcional
  if (p.botImg) safeSetSrc("botImg", p.botImg);
}

loadProfile().catch((err) => {
  console.error("Fallo loadProfile:", err);
  safeSetText("profileName", "Error cargando datos");
  safeSetText("profileRole", err.message || "Revisá data/data.json y rutas");
});
