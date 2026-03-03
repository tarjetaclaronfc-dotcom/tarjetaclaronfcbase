const $ = (id) => document.getElementById(id);

function getQueryParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
}

async function loadProfile() {
    const profileId = getQueryParam("id") || "ID001";

    try {
        const res = await fetch("data/data.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Error cargando base de datos.");

        const data = await res.json();
        const p = data[profileId];

        if (!p) {
            $("profileName").textContent = "Perfil no encontrado";
            $("profileRole").textContent = `ID inexistente: ${profileId}`;
            $("profileDniContainer").style.display = "none";
            return;
        }

        // Renderizado
        if (p.foto) $("profilePhoto").src = p.foto;
        $("profileName").textContent = p.nombre;
        $("profileRole").textContent = p.rol;

        // DNI Suave
        if (p.dni) {
            $("profileDni").textContent = p.dni;
            $("profileDniContainer").style.display = "inline-block";
        } else {
            $("profileDniContainer").style.display = "none";
        }

        // WhatsApp
        if (p.whatsapp) {
            const msg = encodeURIComponent(p.mensaje || "Hola! Vengo desde tu Tarjeta Digital 👋");
            const waLink = `https://wa.me/${p.whatsapp}?text=${msg}`;
            $("btnWhatsapp").href = waLink;
            $("floatBot").href = waLink;
        }

        // Email
        if (p.email) {
            $("btnEmail").href = `mailto:${p.email}`;
            $("btnEmail").style.display = "flex";
        } else {
            $("btnEmail").style.display = "none";
        }

    } catch (e) {
        console.error(e);
    }
}

document.addEventListener("DOMContentLoaded", loadProfile);