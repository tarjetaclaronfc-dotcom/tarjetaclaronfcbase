// js/app.js - Lógica Dinámica para V-Cards Claro NFC
const $ = (id) => document.getElementById(id);

/**
 * Obtiene el ID del perfil desde la URL (ej: index.html?id=ID005)
 * Si no hay ID, por defecto carga el ID001.
 */
function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

/**
 * Función principal que carga los datos del JSON
 */
async function loadProfile() {
    // 1. Identificar al vendedor
    const profileId = getQueryParam("id") || "ID001";

    try {
        // 2. Traer la base de datos (evitamos cache para ver cambios al instante)
        const res = await fetch("data/data.json", { cache: "no-store" });
        if (!res.ok) throw new Error("No se pudo cargar la base de datos.");

        const data = await res.json();
        const p = data[profileId];

        // 3. Si el ID no existe, mostrar error visual
        if (!p) {
            $("profileName").textContent = "Perfil no encontrado";
            $("profileRole").textContent = `Error: El ID ${profileId} no existe.`;
            $("profileDniContainer").style.display = "none";
            return;
        }

        // --- CARGA DE DATOS DINÁMICOS ---

        // Foto de Perfil
        if (p.foto) $("profilePhoto").src = p.foto;

        // Nombre y Rol
        $("profileName").textContent = p.nombre || "Nombre no disponible";
        $("profileRole").textContent = p.rol || "Asesor Comercial";

        // DNI (Dato Crítico de Verificación)
        if (p.dni) {
            $("profileDni").textContent = p.dni;
            $("profileDniContainer").style.display = "inline-block";
        } else {
            $("profileDniContainer").style.display = "none";
        }

        // WhatsApp (Botón Principal y Botón Flotante)
        if (p.whatsapp) {
            const mensajeWa = encodeURIComponent(p.mensaje || "¡Hola! Vengo desde tu Tarjeta Digital Claro 👋");
            const waLink = `https://wa.me/${p.whatsapp}?text=${mensajeWa}`;
            
            $("btnWhatsapp").href = waLink;
            $("floatBot").href = waLink;
        } else {
            $("btnWhatsapp").style.display = "none";
            $("floatBot").style.display = "none";
        }

        // Email Oficial
        if (p.email && p.email.trim() !== "") {
            $("btnEmail").href = `mailto:${p.email}`;
            $("btnEmail").style.display = "flex";
        } else {
            $("btnEmail").style.display = "none";
        }

    } catch (error) {
        console.error("Fallo en la carga del perfil:", error);
        $("profileName").textContent = "Error de Conexión";
        $("profileRole").textContent = "No se pudo cargar la información.";
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", loadProfile);