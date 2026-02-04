// js/app.js

const $ = (id) => document.getElementById(id);

function getQueryParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

function buildWaLink(phone, msg) {
  const text = encodeURIComponent(msg || "Hola! Vengo desde tu Tarjeta Digital + NFC 👋");
  return `https://wa.me/${phone}?text=${text}`;
}

async function loadProfile() {
  // Si no viene id, dejamos uno por defecto para poder probar
  const profileId = getQueryParam("id") || "ID001";

  const res = await fetch("data/data.json", { cache: "no-store" });
  const data = await res.json();

  const p = data[profileId];

  if (!p) {
    $("profileName").textContent = "Perfil no encontrado";
    $("profileRole").textContent = "Verificá el link recibido";
    $("btnWhatsapp").style.display = "none";
    $("btnInstagram").style.display = "none";
    $("btnWeb").style.display = "none";
    $("btnEmail").style.display = "none";
    $("floatBot").style.display = "none";
    return;
  }

  // Foto (si no te mandan foto, podés dejar una por defecto)
  if (p.foto) $("profilePhoto").src = p.foto;

  // Nombre y rol
  $("profileName").textContent = p.nombre || "Sin nombre";
  $("profileRole").textContent = p.rol
    ? `${p.rol} · Tarjeta Digital + NFC`
    : "Tarjeta Digital + NFC";

  // WhatsApp (botón grande + bot flotante)
  if (p.whatsapp) {
    const waLink = buildWaLink(p.whatsapp, p.mensaje);
    $("btnWhatsapp").href = waLink;
    $("floatBot").href = waLink;
    $("whatsappSubtitle").textContent = p.whatsapp_subtitulo || "Escribime al instante";
  } else {
    $("btnWhatsapp").style.display = "none";
    $("floatBot").style.display = "none";
  }

  // Instagram
  if (p.instagram) $("btnInstagram").href = p.instagram;
  else $("btnInstagram").style.display = "none";

  // Web
  if (p.web) $("btnWeb").href = p.web;
  else $("btnWeb").style.display = "none";

  // Email
  if (p.email) {
    const subject = encodeURIComponent("Contacto desde Tarjeta Digital + NFC");
    const body = encodeURIComponent("Hola! Te contacto desde tu Tarjeta Digital + NFC.");
    $("btnEmail").href = `mailto:${p.email}?subject=${subject}&body=${body}`;
    $("emailSubtitle").textContent = p.email;
  } else {
    $("btnEmail").style.display = "none";
  }

  // (Opcional) cambiar imagen del bot por persona/perfil
  // p.botImg = "img/bots/bot1.png"
  if (p.botImg) $("botImg").src = p.botImg;
}

loadProfile().catch(() => {
  $("profileName").textContent = "Error cargando datos";
  $("profileRole").textContent = "Revisá data/data.json y rutas";
});
