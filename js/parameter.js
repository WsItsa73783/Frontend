document.addEventListener("DOMContentLoaded", function() {
    // Fetch parameters and populate the table
    axios.get('http://127.0.0.1:8000/get_parameters')
        .then(function(response) {
            let data = response.data.resultado;
            let tableBody = document.querySelector("#lista-parametros tbody");
            tableBody.innerHTML = ""; // Clear existing rows

            data.forEach((parameter, index) => {
                let row = tableBody.insertRow(index);

                // Create cells in the order specified in the HTML
                let cellId = row.insertCell(0);
                let cellReference = row.insertCell(1);
                let cellName = row.insertCell(2);
                let cellDescription = row.insertCell(3);
                let cellActions = row.insertCell(4);

                // Populate cells with parameter data
                cellId.textContent = parameter.id;
                cellReference.textContent = parameter.reference;
                cellName.textContent = parameter.name;
                cellDescription.textContent = parameter.description;

                // Add action buttons
                cellActions.innerHTML = 
                    `<button type="button" class="btn btn-warning" onclick="showUpdateParameterModal(${parameter.id}, '${parameter.reference}', '${parameter.name}', '${parameter.description}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button type="button" class="btn btn-danger" onclick="showDeleteParameterModal(${parameter.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>`;
            });

            // Initialize DataTables after adding rows
            $('#lista-parametros').DataTable({
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
            console.error('Error fetching parameters: ', error);
        });
});

function createParameter() {
    let parameter = {
        reference: document.getElementById("parameter-reference").value,
        name: document.getElementById("parameter-name").value,
        description: document.getElementById("parameter-description").value
    };

    alert(parameter)

    axios.post('http://127.0.0.1:8000/create_parameter', parameter)
        .then(function(response) {
            alert(response.data.resultado);
            $('#registerParameterModal').modal('hide');
            location.reload(); // Refresh the page to show updated parameter list
        })
        .catch(function(error) {
            console.error('Error creating parameter: ', error);
        });
}

function showUpdateParameterModal(parameterId, reference, name, description) {
    document.getElementById("update-parameter-id").value = parameterId;
    document.getElementById("update-parameter-reference").value = reference;
    document.getElementById("update-parameter-name").value = name;
    document.getElementById("update-parameter-description").value = description;
    $('#updateParameterModal').modal('show');
}

function updateParameter() {
    let parameter = {
        id: document.getElementById("update-parameter-id").value,
        reference: document.getElementById("update-parameter-reference").value,
        name: document.getElementById("update-parameter-name").value,
        description: document.getElementById("update-parameter-description").value
    };

    axios.put(`http://127.0.0.1:8000/edit_parameter/${parameter.id}`, parameter)
        .then(function(response) {
            alert(response.data.resultado);
            $('#updateParameterModal').modal('hide');
            location.reload(); // Refresh the page to show updated parameter list
        })
        .catch(function(error) {
            console.error('Error updating parameter: ', error);
        });
}

function showDeleteParameterModal(parameterId) {
    document.getElementById("delete-parameter-id").value = parameterId;
    $('#deleteParameterModal').modal('show');
}

function deleteParameter() {
    let parameterId = document.getElementById("delete-parameter-id").value;

    axios.delete(`http://127.0.0.1:8000/delete_parameter/${parameterId}`)
        .then(function(response) {
            alert(response.data.resultado);
            $('#deleteParameterModal').modal('hide');
            location.reload(); // Refresh the page to show updated parameter list
        })
        .catch(function(error) {
            console.error('Error deleting parameter: ', error);
        });
}


