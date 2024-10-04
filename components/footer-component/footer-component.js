class footer_component extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Asegúrate de que la ruta sea correcta
        this.cargarHTML("../../../components/footer-component/footer-component.html");
    }

    cargarHTML(url) {
        console.log("Fetching URL:", url); // Para verificar la ruta
        fetch(url)
            .then(response => response.text())
            .then(html => {
                this.innerHTML = html;
                this.cargarLOGICA();
            })
            .catch(error => {
                console.error("Error al cargar el archivo HTML:", error);
            });
    }

    cargarLOGICA() {
        console.log("carga_logica_nav");
    }
}

// Define el componente personalizado
window.customElements.define("footer-component", footer_component);