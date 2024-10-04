class top_navbar_component extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.cargarHTML("../../../components/top-navbar-component/top-navbar-component.html");
    }

    cargarHTML(url) {
        console.log("Fetching URL:", url);
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
        if (roleInfo && roleInfo.name) {
            document.getElementById("name").textContent = roleInfo.name;
        }

        const logoutButton = this.querySelector("#logout-button");
        if (logoutButton) {
            logoutButton.addEventListener("click", (event) => {
                event.preventDefault();
                this.logout();
            });
        }
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('decodedToken'); 
    
        // Modificar el historial del navegador
        window.history.replaceState({}, document.title, window.location.pathname);
        window.location.replace("../../../index.html");
    }
}

window.customElements.define("top-navbar-component", top_navbar_component);
