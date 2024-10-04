document.addEventListener("DOMContentLoaded", function() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("Token no encontrado. Por favor, inicia sesión.");
        window.location.href = "../../index.html";
        return;
    }

    async function validateToken() {
        try {
            const response = await axios.post("http://127.0.0.1:8000/verifytoken", {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            console.log("Token valido: ", response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                alert(error.response.data.message);
                localStorage.removeItem("token");
                localStorage.removeItem("decodedToken");
                window.location.href = "../../index.html";
            } else {
                console.error("Error during token validation: ", error);
                alert("Error durante la validación del token. Inténtalo de nuevo.");
            }
        }
    }
    validateToken();
});