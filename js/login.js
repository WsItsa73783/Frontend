document.addEventListener("DOMContentLoaded", function() {
    async function login(event) {
        event.preventDefault();
        
        const email = document.getElementById("email").value;
        const password = document.getElementById("clave").value;
        
        try {
            const response = await axios.post("http://127.0.0.1:8000/token", {
                email: email,
                password: password
            });
            
            const token = response.data.access_token;
            localStorage.setItem("token", token);

            const decodedToken = parseJwt(token);
            console.log("Decoded Token: ", decodedToken);
            localStorage.setItem("decodedToken", JSON.stringify(decodedToken));

            const roleName = decodedToken.role_name;

            if (roleName === "Administrador") {
                window.location.href = "html/Admin/dashboard.html";
            } else if (roleName === "Coordinador") {
                window.location.href = "html/Coordinador/dashboard.html";
            } else if (roleName === "Estudiante") {
                window.location.href = "html/Estudiante/dashboard.html";
            } else {
                alert("Rol no reconocido. Por favor, contacta al administrador.");
            }

            alert("Inicio de sesión exitoso!");

        } catch (error) {
            console.error("Error during login: ", error);
            alert("¡Error de inicio de sesion! Por favor verifique sus credenciales.");
        }
    }

    function parseJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));

            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Token no valido", e);
            return null;
        }
    }

    const loginForm = document.querySelector("form");
    loginForm.addEventListener("submit", login);
});