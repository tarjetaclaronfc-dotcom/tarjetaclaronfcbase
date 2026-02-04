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
  const profileId = getQueryParam("id") || "ID001";

  const res = await fetch("data/data.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`No se pudo abrir data/data.json (HTTP ${res.status})`);

  const data = await res.json();
  const p = data[profileId];

  if (!p) {
    $("profileName").textContent = "Perfil no encontrado";
    $("profileRole").textContent = `No existe el id: ${profileId}`;
    $("btnWhatsapp").style.display = "none";
    $("btnInstagram").style.display = "none";
    $("btnWeb").style.display = "none";
    $("floatBot").style.display = "none";
    return;
  }

  // Foto
  if (p.foto) $("profilePhoto").src = p.foto;

  // Nombre y rol
  $("profileName").textContent = p.nombre || "Sin nombre";
  $("profileRole").textContent = p.rol
    ? `${p.rol} · Tarjeta Digital + NFC · Claro`
    : "Tarjeta Digital + NFC · Claro";

  // WhatsApp (botón grande + flotante)
  if (p.whatsapp) {
    const waLink = buildWaLink(p.whatsapp, p.mensaje);
    $("btnWhatsapp").href = waLink;
    $("floatBot").href = waLink;
  } else {
    $("btnWhatsapp").style.display = "none";
    $("floatBot").style.display = "none";
  }

  // Instagram
  if (p.instagram && p.instagram.trim()) $("btnInstagram").href = p.instagram;
  else $("btnInstagram").style.display = "none";

  // Web
  if (p.web && p.web.trim()) $("btnWeb").href = p.web;
  else $("btnWeb").style.display = "none";

  // Bot image opcional (si algún día lo agregás en el JSON)
  // Para que funcione, agregá id="botImg" en el HTML
  const botImg = $("botImg");
  if (botImg && p.botImg) botImg.src = p.botImg;
}

loadProfile().catch((err) => {
  console.error("Fallo loadProfile:", err);
  const name = $("profileName");
  const role = $("profileRole");
  if (name) name.textContent = "Error cargando datos";
  if (role) role.textContent = err.message || "Revisá data/data.json y rutas";
});
