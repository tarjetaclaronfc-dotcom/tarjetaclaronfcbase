const $ = (id) => document.getElementById(id);
let qrGenerated = false;

function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

async function loadProfile() {
    // Usamos el DNI de Ramiro como fallback
    const profileId = getQueryParam("id") || "43344258";

    try {
        const res = await fetch("data/data.json", { cache: "no-store" });
        const data = await res.json();
        const p = data[profileId];

        if (!p) {
            $("profileName").textContent = "ID no encontrado";
            return;
        }

        // Renderizado de datos básicos
        if (p.foto) $("profilePhoto").src = p.foto;
        $("profileName").textContent = p.nombre;
        $("profileRole").textContent = p.rol;
        
        const dniSpan = document.querySelector(".dni-badge span");
        if (dniSpan) dniSpan.textContent = p.dni;

        // Configuración de enlaces dinámicos
        const cleanPhone = p.whatsapp.replace(/\s/g, '');
        const waMsg = encodeURIComponent(p.mensaje || "Hola! Vengo desde tu Tarjeta Digital.");
        
        if ($("btnWhatsapp")) $("btnWhatsapp").href = `https://wa.me/${cleanPhone}?text=${waMsg}`;
        if ($("btnEmail")) $("btnEmail").href = `mailto:${p.email}`;

    } catch (e) {
        console.error("Error cargando perfil:", e);
    }
}

// Lógica para el QR
function openQR() {
    const modal = $("qrModal");
    if (modal) {
        modal.style.display = "flex";
        if (!qrGenerated) {
            new QRCode($("qrcode"), {
                text: window.location.href,
                width: 200, height: 200,
                colorDark: "#e60012", colorLight: "#ffffff"
            });
            qrGenerated = true;
        }
    }
}

function closeQR() {
    if ($("qrModal")) $("qrModal").style.display = "none";
}

// Guardar Contacto Profesional
async function generateVCard() {
    const profileId = getQueryParam("id") || "43344258";
    try {
        const res = await fetch("data/data.json");
        const data = await res.json();
        const p = data[profileId];

        if (!p) return;

        const tel = p.whatsapp.replace(/\D/g, '');
        // Formato solicitado: Nombre Apellido - Claro ITEC
        const nombreVCard = `${p.nombre} - Claro ITEC`;

        const vcard = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `FN:${nombreVCard}`,
            `N:;${nombreVCard};;;`,
            "ORG:Claro Argentina;ITEC",
            `TITLE:${p.rol}`,
            `TEL;TYPE=CELL;TYPE=VOICE;TYPE=pref:+54${tel}`,
            `EMAIL;TYPE=INTERNET:${p.email}`,
            `URL:https://claro-itec.netlify.app/?id=${profileId}`,
            "END:VCARD"
        ].join("\n");

        const blob = new Blob([vcard], { type: "text/vcard" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${p.nombre.replace(/ /g, "_")}_Claro_ITEC.vcf`;
        link.href = url;
        link.click();
        window.URL.revokeObjectURL(url);
    } catch (e) {
        alert("Error al generar contacto");
    }
}

document.addEventListener("DOMContentLoaded", loadProfile);