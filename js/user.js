document.addEventListener("DOMContentLoaded", function() {
    // Fetch users and populate the table
    axios.get('http://127.0.0.1:8000/get_users')
        .then(function(response) {
            let data = response.data.resultado;
            let tableBody = document.querySelector("#lista-usuarios tbody");
            tableBody.innerHTML = ""; // Clear existing rows

            function formatTimestamp(timestamp) {
                if (timestamp) {
                    let date = new Date(timestamp);
                    return date.toLocaleString();
                }
                return '';
            }

            data.forEach((user, index) => {
                let row = tableBody.insertRow(index);

                // Create cells in the order specified in the HTML
                let cellId = row.insertCell(0);
                let cellName = row.insertCell(1);
                let cellLastName = row.insertCell(2);
                let cellEmail = row.insertCell(3);
                let cellPhone = row.insertCell(4);
                let cellDocumentType = row.insertCell(5);
                let cellDocumentNumber = row.insertCell(6);
                let cellRole = row.insertCell(7);
                let cellState = row.insertCell(8);
                let cellCreatedAt = row.insertCell(9);
                let cellUpdatedAt = row.insertCell(10);
                let cellActions = row.insertCell(11);

                // Populate cells with user data
                cellId.textContent = user.id;
                cellName.textContent = user.name;
                cellLastName.textContent = user.last_name;
                cellEmail.textContent = user.email;
                cellPhone.textContent = user.phone;
                cellDocumentType.textContent = user.document_type_name; // Correct field name
                cellDocumentNumber.textContent = user.document_number;
                cellRole.textContent = user.role_name; // Correct field name
                cellState.textContent = user.state; // Correct state mapping    
                cellCreatedAt.textContent = formatTimestamp(user.created_at);
                cellUpdatedAt.textContent = formatTimestamp(user.updated_at);

                // Add action buttons
                cellActions.innerHTML = 
                    `<button type="button" class="btn btn-warning" onclick="showUpdateUserModal(${user.id}, '${user.name}', '${user.last_name}', '${user.email}', '${user.phone}', ${user.document_type_id}, '${user.document_number}', '${user.password}', ${user.role_id}, ${user.state})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-danger" onclick="showDeleteUserModal(${user.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>`;
            });

            // Initialize DataTables after adding rows
            $('#lista-usuarios').DataTable({
                language: {
                    "decimal": "",
                    "emptyTable": "No hay información",
                    "info": "Mostrando _START_ a _END_ de _TOTAL_ entradas",
                    "infoEmpty": "Mostrando 0 a 0 de 0 entradas",
                    "infoFiltered": "(Filtrado de _MAX_ entradas totales)",
                    "infoPostFix": "",
                    "thousands": ",",
                    "lengthMenu": "Mostrar _MENU_ entradas",
                    "loadingRecords": "Cargando...",
                    "processing": "Procesando...",
                    "search": "Buscar:",
                    "zeroRecords": "No se encontraron resultados",
                    "paginate": {
                        "first": "Primero",
                        "last": "Último",
                        "next": "Siguiente",
                        "previous": "Anterior"
                    }
                }
            });
        })
        .catch(function(error) {
            console.error('Error fetching users: ', error);
        });
});


function createUser() {
    let user = {
        role_id: document.getElementById("role").value,
        name: document.getElementById("user-name").value,
        last_name: document.getElementById("user-last-name").value,
        email: document.getElementById("user-email").value,
        phone: document.getElementById("user-phone").value,
        document_type_id: document.getElementById("document_type").value,
        document_number: document.getElementById("user-document-number").value,
        password: document.getElementById("user-password").value,
        state: document.getElementById("state").value
    };

    axios.post('http://127.0.0.1:8000/create_user', user)
        .then(function(response) {
            alert(response.data.resultado);
            $('#registerUserModal').modal('hide');
            location.reload(); // Refresh the page to show updated user list
        })
        .catch(function(error) {
            console.error('Error creating user: ', error);
        });
}

function showUpdateUserModal(userId, name, lastName, email, phone, document_type, documentNumber, password, roleId, state) {
    document.getElementById("update-user-id").value = userId;
    document.getElementById("update-user-name").value = name;
    document.getElementById("update-user-last-name").value = lastName;
    document.getElementById("update-user-email").value = email;
    document.getElementById("update-user-phone").value = phone;
    document.getElementById("update_document_type").value = document_type;
    document.getElementById("update-user-document-number").value = documentNumber;
    document.getElementById("update-user-password").value = password;
    document.getElementById("update_role").value = roleId;
    document.getElementById("update_state").value = state;
    $('#updateUserModal').modal('show');
}

function updateUser() {
    let user = {
        id: document.getElementById("update-user-id").value,
        role_id: document.getElementById("update_role").value,
        name: document.getElementById("update-user-name").value,
        last_name: document.getElementById("update-user-last-name").value,
        email: document.getElementById("update-user-email").value,
        phone: document.getElementById("update-user-phone").value,
        document_type_id: document.getElementById("update_document_type").value,
        document_number: document.getElementById("update-user-document-number").value,
        password: document.getElementById("update-user-password").value,
        state: document.getElementById("update_state").value
    };

    axios.put(`http://127.0.0.1:8000/edit_user/${user.id}`, user)
        .then(function(response) {
            alert(response.data.resultado);
            $('#updateUserModal').modal('hide');
            location.reload(); // Refresh the page to show updated user list
        })
        .catch(function(error) {
            console.error('Error updating user: ', error);
        });
}

function showDeleteUserModal(userId) {
    document.getElementById("delete-user-id").value = userId;
    $('#deleteUserModal').modal('show');
}

function deleteUser() {
    let userId = document.getElementById("delete-user-id").value;

    axios.delete(`http://127.0.0.1:8000/delete_user/${userId}`)
        .then(function(response) {
            alert(response.data.resultado);
            $('#deleteUserModal').modal('hide');
            location.reload(); // Refresh the page to show updated user list
        })
        .catch(function(error) {
            console.error('Error deleting user: ', error);
        });
}

document.addEventListener("DOMContentLoaded", function() {
    populateDocumentTypes();
    populateRoles();
    populateStates();
});

function populateDocumentTypes() {
    axios.get('http://127.0.0.1:8000/get_dictypedocument')
        .then(function(response) {
            let data = response.data;
            console.log(response.data)
            let selectElement = document.getElementById('document_type');
            let updateselectElement = document.getElementById('update_document_type');

            selectElement.innerHTML = ""; // Clear existing options
            updateselectElement.innerHTML = ""; // Clear existing options

            data.forEach(function(item) {
                let option = document.createElement("option");
                option.value = item.id;
                option.text = item.name;
                selectElement.appendChild(option.cloneNode(true)); // Clone option to add to both select elements
                updateselectElement.appendChild(option);
            });
        })
        .catch(function(error) {
            console.error('Error fetching document types: ', error);
        });
}

function populateRoles() {
    axios.get('http://127.0.0.1:8000/get_dicrol')
        .then(function(response) {
            let data = response.data;
            let selectElement = document.getElementById('role');
            let updateselectElement = document.getElementById('update_role');
            selectElement.innerHTML = ""; // Clear existing options
            updateselectElement.innerHTML = ""; // Clear existing options

            data.forEach(function(item) {
                let option = document.createElement("option");
                option.value = item.id;
                option.text = item.name;
                selectElement.appendChild(option.cloneNode(true)); // Clone option to add to both select elements
                updateselectElement.appendChild(option);
            });
        })
        .catch(function(error) {
            console.error('Error fetching roles: ', error);
        });
}

function populateStates() {
    const stateSelect = document.getElementById("state");
    const updatestateSelect = document.getElementById("update_state");

    const options = [
        { value: 1, text: "Activo" },  // value as integer
        { value: 0, text: "Inactivo" } // value as integer
    ];

    stateSelect.innerHTML = ""; // Clear existing options
    updatestateSelect.innerHTML = ""; // Clear existing options

    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.text;
        stateSelect.appendChild(opt.cloneNode(true)); // Clone option to add to both select elements
        updatestateSelect.appendChild(opt);
    });
}


