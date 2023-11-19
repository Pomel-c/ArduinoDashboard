// Función para establecer la cookie del modo
function setModeCookie(mode) {
    document.cookie = `mode=${mode}; path=/`;
}

// Función para leer la cookie del modo cuando se carga la página y establecer el modo correspondiente
function setModeFromCookie() {
    let mode = document.cookie.replace(/(?:(?:^|.*;\s*)mode\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    let nightModeCss = document.getElementById('night-mode');
    nightModeCss.disabled = (mode !== 'night');
}

// Llamada a la función cuando se carga la página
setModeFromCookie();

// Evento para cambiar el modo cuando se hace clic en el botón de alternar
document.getElementById('modeToggle').addEventListener('click', function() {
    let nightModeCss = document.getElementById('night-mode');
    if (nightModeCss.disabled) {
        nightModeCss.disabled = false;
        setModeCookie('night');
    } else {
        nightModeCss.disabled = true;
        setModeCookie('light');
    }
});