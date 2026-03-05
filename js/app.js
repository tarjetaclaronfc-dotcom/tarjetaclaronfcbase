const $ = (id) => document.getElementById(id);
let qrGenerated = false;

function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

async function loadProfile() {
    // Usamos el DNI de Ramiro como fallback si no hay ID en la URL
    const profileId = getQueryParam("id") || "43344258";

    try {
        const res = await fetch("data/data.json", { cache: "no-store" });
        const data = await res.json();
        const p = data[profileId];

        if (!p) {
            $("profileName").textContent = "ID no encontrado";
            return;
        }

        // Renderizado de datos
        if (p.foto) $("profilePhoto").src = p.foto;
        $("profileName").textContent = p.nombre;
        $("profileRole").textContent = p.rol;
        
        const dniElement = document.querySelector(".dni-badge span");
        if (dniElement) dniElement.textContent = p.dni;

        // Configuración de enlaces
        const cleanPhone = p.whatsapp.replace(/\s/g, '');
        const waMsg = encodeURIComponent(p.mensaje || "Hola! Vengo desde tu Tarjeta Digital.");
        
        // Asignar links a los contenedores de los botones (clase .btn)
        const btnWa = $("btnWhatsapp");
        if (btnWa) btnWa.href = `https://wa.me/${cleanPhone}?text=${waMsg}`;

        const btnMail = $("btnEmail");
        if (btnMail) btnMail.href = `mailto:${p.email}`;

    } catch (e) {
        console.error("Error cargando perfil:", e);
    }
}

// Lógica del QR
function openQR() {
    const modal = $("qrModal");
    if (modal) {
        modal.style.display = "flex";
        if (!qrGenerated) {
            new QRCode($("qrcode"), {
                text: window.location.href,
                width: 200,
                height: 200,
                colorDark: "#e60012",
                colorLight: "#ffffff"
            });
            qrGenerated = true;
        }
    }
}

function closeQR() {
    const modal = $("qrModal");
    if (modal) modal.style.display = "none";
}

// Guardar Contacto (VCF)
async function generateVCard() {
    const profileId = getQueryParam("id") || "43344258";
    try {
        const res = await fetch("data/data.json");
        const data = await res.json();
        const p = data[profileId];

        const tel = p.whatsapp.replace(/\D/g, '');
        const vcard = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `FN:${p.nombre}`,
            "ORG:Claro Argentina;ITEC",
            `TEL;TYPE=CELL;TYPE=VOICE;TYPE=pref:+${tel}`,
            `EMAIL;TYPE=INTERNET:${p.email}`,
            "END:VCARD"
        ].join("\n");

        const blob = new Blob([vcard], { type: "text/vcard" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `${p.nombre.replace(/ /g, "_")}.vcf`;
        link.href = url;
        link.click();
    } catch (e) {
        alert("Error al generar contacto");
    }
}

document.addEventListener("DOMContentLoaded", loadProfile);