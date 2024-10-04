document.addEventListener("DOMContentLoaded", function() {
    axios.get('http://127.0.0.1:8000/get_schools')
        .then(function(response) {
            let data = response.data.resultado;
            let tableBody = document.querySelector("#lista-colegios tbody");
            tableBody.innerHTML = "";

            function formatTimestamp(timestamp) {
                if (timestamp) {
                    let date = new Date(timestamp);
                    return date.toLocaleString();
                }
                return '';
            }

            data.forEach((school, index) => {
                let row = tableBody.insertRow(index);
                let cellId = row.insertCell(0);
                let cellName = row.insertCell(1);
                let cellState = row.insertCell(2);
                let cellAdded = row.insertCell(3);
                let cellUpdated = row.insertCell(4);
                let cellDeleted = row.insertCell(5);

                cellId.textContent = school.id;
                cellName.textContent = school.name;
                cellState.textContent = school.state;
                cellAdded.textContent = formatTimestamp(school.created_at);
                cellUpdated.textContent = formatTimestamp(school.updated_at);

                cellDeleted.innerHTML = `
                    <button type="button" class="btn btn-primary" onclick="showViewModal(${school.id}, '${school.name}', '${school.state}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button type="button" class="btn btn-warning" onclick="showUpdateModal(${school.id}, '${school.name}', '${school.state}')">
                        <i class="fas fa-edit"></i>
                    </button> 
                    <button type="button" class="btn btn-danger" onclick="showDeleteModal(${school.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>

                `;
            });
            $('#lista-colegios').DataTable({
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
                },
                dom: 'Bfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        title: 'Lista de Colegios'
                    },
                    {
                        extend: 'pdfHtml5',
                        title: 'Lista de Colegios'
                    }
                ]
            });
            
        })
        .catch(function(error) {
            console.error('Error fetching data: ', error);
        });

    
});

function showUpdateModal(schoolId, name, state) {
    document.getElementById("update-id").value = schoolId;
    document.getElementById("update-name").value = name;
    populateStates("update-state", state);
    $('#updateModal').modal('show');
}


function populateStates(selectId, selectedState) {
    axios.get('http://127.0.0.1:8000/get_parameter_values/2')
        .then(function(response) {
            let data = response.data.resultado;
            let selectState = document.getElementById(selectId);
            selectState.innerHTML = "";

            data.forEach(param => {
                let option = document.createElement("option");
                option.value = param.id;
                option.text = param.name;
                if (param.id == selectedState) {
                    option.selected = true;
                }
                selectState.appendChild(option);
            });
        })
        .catch(function(error) {
            console.error('Error fetching states: ', error);
        });
}

function updateSchool() {
    const schoolId = document.getElementById("update-id").value;
    const schoolName = document.getElementById("update-name").value;
    const schoolState = document.getElementById("update-state").value;
    console.log("schoolState:", schoolId);
    axios.put(`http://127.0.0.1:8000/edit_school/${schoolId}`, {
        name: schoolName,
        state: schoolState
    })
    .then(response => {
        $('#updateModal').modal('hide');
        location.reload();
    })
    .catch(error => {
        console.error('Error updating school: ', error);
    });
}

function showDeleteModal(schoolId) {
    document.getElementById("delete-id").value = schoolId;
    $('#deleteModal').modal('show');}

function deleteSchool() {
    const schoolId = document.getElementById("delete-id").value;

    axios.delete(`http://127.0.0.1:8000/delete_school/${schoolId}`)
    .then(response => {
        $('#deleteModal').modal('hide');
        location.reload();
    })
    .catch(error => {
        console.error('Error deleting school: ', error);
    });
}

$('#registerModal').on('show.bs.modal', function (event) {
    populateStates('create-state');
});

function createSchool() {
    const name = document.getElementById("name").value;
    alert(name)
    const state = document.getElementById("create-state").value;

    const newSchool = {
        name: name,
        state: state
    };

    alert(JSON.stringify(newSchool, null, 2))

    if (name !== ""){
        axios.post('http://127.0.0.1:8000/create_Schools', newSchool)
            .then(function (response) {
                console.log('School created:', response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'School Created',
                    text: 'The school has been successfully created.',
                    timer: 2000
                }).then(function () {
                    window.location.reload(); // Reload the page or handle navigation
                });
            })
            .catch(function (error) {
                console.error('Error creating school:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'There was an error creating the school. Please try again later.'
                });
            });
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter the name of the school.'
        });
    }
}


function exportTableToExcel(tableId, filename = '') {
    let table = document.getElementById(tableId);
    let workbook = XLSX.utils.table_to_book(table, { sheet: "Sheet1" });
    let exportFilename = filename ? filename + '.xlsx' : 'exported_data.xlsx';
    XLSX.writeFile(workbook, exportFilename);
}

function exportTableToPDF(tableId, filename = '') {
    let doc = new jspdf.jsPDF('p', 'pt', 'a4');
    let table = document.getElementById(tableId);

    html2canvas(table, {
        onrendered: function(canvas) {
            let imgData = canvas.toDataURL('image/png');
            let imgWidth = doc.internal.pageSize.getWidth();
            let imgHeight = (canvas.height * imgWidth) / canvas.width;
            doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            let exportFilename = filename ? filename + '.pdf' : 'exported_data.pdf';
            doc.save(exportFilename);
        }
    });
}
