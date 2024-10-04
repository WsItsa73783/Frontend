class brand_component extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // Asegúrate de que la ruta sea correcta
        this.cargarHTML("../../../components/brand-component/brand-component.html");
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
        
            const roleInfo = JSON.parse(localStorage.getItem("decodedToken"));
            console.log("informacion:", roleInfo);
            if (roleInfo && roleInfo.role_name) {
                document.getElementById("roleNameDisplay").textContent = roleInfo.role_name;
            }


    }
}

// Define el componente personalizado
window.customElements.define("brand-component", brand_component);