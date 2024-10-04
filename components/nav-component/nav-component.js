class nav_component extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.cargarHTML("../../../components/nav-component/nav-component.html");
    }

    cargarHTML(url) {
        fetch(url)
            .then(response => {
                return response.text();
            })
            .then(html => {
                this.innerHTML = html;
                this.cargarLOGICA();
            })
            .catch(error => {
                console.error("Error al cargar el archivo HTML:", error);
            });
    }

    cargarLOGICA() {
        const decodedToken = JSON.parse(localStorage.getItem("decodedToken"));
        if (decodedToken) {
            const roleId = decodedToken.role_id;
            console.log("Decoded token found. Role ID:", roleId); 
            this.checkPermissions(roleId); 
        } else {
            console.error("No se encontró el token del usuario");
        }
    }

    checkPermissions(roleId) {
        console.log("Checking permissions for Role ID:", roleId); 
        axios.get(`http://127.0.0.1:8000/get/permissions_role/${roleId}`)
            .then(response => {
                console.log("Permissions response:", response.data); 
                const permissions = response.data.resultado; 
                this.updateNavVisibility(permissions);
            })
            .catch(error => {
                console.error("Error al obtener permisos:", error);
            });
    }

    updateNavVisibility(permissions) {
        permissions.forEach(permission => {
            const moduleItem = document.getElementById(`module-${permission.module_id}`);
            if (moduleItem) {
                if (permission.can_view === true) {
                    moduleItem.style.display = "block"; 
                } if (permission.can_view === false) {
                    moduleItem.style.display = "none";
                }
            } else {
                console.warn(`Module ID ${permission.module_id} not found in the DOM.`);
            }
        });
    }
}

window.customElements.define("nav-component", nav_component);
