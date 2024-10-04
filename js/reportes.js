document.addEventListener("DOMContentLoaded", function() {
    axios.get('http://127.0.0.1:8000/get_reports')
        .then(function(response) {
            let data = response.data.resultado;
            let tableBody = document.querySelector("#lista-reportes tbody");
            tableBody.innerHTML = "";

            data.forEach((report, index) => {
                let row = tableBody.insertRow(index);
                let cellId = row.insertCell(0);
                let cellTypeReportId = row.insertCell(1);
                let cellReporterName = row.insertCell(2);
                let cellReportedUserName = row.insertCell(3);
                let cellDescription = row.insertCell(4);
                let cellActions = row.insertCell(5);

                cellId.textContent = report.id;
                cellTypeReportId.textContent = report.type_report_id;
                cellReporterName.textContent = report.reporter_name;  // Asegúrate de usar el nombre correcto aquí
                cellReportedUserName.textContent = report.reported_user_name;  // Asegúrate de usar el nombre correcto aquí
                cellDescription.textContent = report.description;

                let descriptionEscaped = report.description.replace(/'/g, "\\'");

                cellActions.innerHTML = `
                    <button type="button" class="btn btn-primary" onclick="showUpdateModal(${report.id}, ${report.type_report_id}, '${report.reporter_name}', '${report.reported_user_name}', '${descriptionEscaped}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button type="button" class="btn btn-warning" onclick="showUpdateModal(${report.id}, ${report.type_report_id}, '${report.reporter_name}', '${report.reported_user_name}', '${descriptionEscaped}')">
                        <i class="fas fa-edit"></i>
                    </button> 
                    <button type="button" class="btn btn-danger" onclick="showDeleteModal(${report.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
            });
        })
        .catch(function(error) {
            console.error('Error fetching data: ', error);
        });

    $('#lista-reportes').DataTable({
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
});

function showUpdateModal(reportId, typeReportId, reporterName, reportedUserName, description) {
    document.getElementById("update-report-id").value = reportId;
    document.getElementById("update-type_report_id").value = typeReportId;
    document.getElementById("update-reporter_id").value = reporterName;
    document.getElementById("update-reported_user_id").value = reportedUserName;
    document.getElementById("update-description").value = description;
    $('#updateReportModal').modal('show');
}

function updateReport() {
    const reportId = document.getElementById('update-report-id').value;
    const typeReportId = parseInt(document.getElementById('update-type_report_id').value, 10);
    const reporterName = document.getElementById('update-reporter_id').value;
    const reportedUserName = document.getElementById('update-reported_user_id').value;
    const description = document.getElementById('update-description').value;


    console.log({
        type_report_id: typeReportId,
        reporter_name: reporterName,
        reported_user_name: reportedUserName,
        description: description
    });

    if (!isNaN(typeReportId) && reporterName && reportedUserName && description) {
        axios.put(`http://127.0.0.1:8000/edit_report/${reportId}`, {
            type_report_id: typeReportId,
            reporter_name: reporterName,
            reported_user_name: reportedUserName,
            description: description
        })
        .then(response => {
            Swal.fire({
                icon: 'success',
                title: 'Reporte Actualizado',
                text: 'El reporte ha sido actualizado exitosamente.',
                timer: 2000
            }).then(function () {
                $('#updateReportModal').modal('hide');  // Oculta el modal
                window.location.reload();  // Recargar la página
            });
        })
        .catch(error => {
            console.error('Error actualizando el reporte:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al actualizar el reporte.'
            });
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, complete todos los campos correctamente.'
        });
    }
}


function showDeleteModal(reportId) {
    document.getElementById("delete-id").value = reportId;
    $('#deleteModal').modal('show');
}

function deleteReport() {
    const reportId = document.getElementById("delete-id").value;

    axios.delete(`http://127.0.0.1:8000/delete_reports/${reportId}`)
    .then(response => {
        Swal.fire({
            icon: 'success',
            title: 'Reporte Eliminado',
            text: 'El reporte ha sido eliminado exitosamente.',
            timer: 2000
        }).then(function () {
            $('#deleteModal').modal('hide');
            window.location.reload();  // Recargar la página
        });
    })
    .catch(error => {
        console.error('Error deleting report:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error al eliminar el reporte.'
        });
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const typeReportSelect = document.getElementById("type_report_id");

    // Aquí puedes agregar manualmente los tipos de reportes
    const options = [
        { value: 1, text: "Tipo 1" },
        { value: 2, text: "Tipo 2" }
    ];

    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.text;
        typeReportSelect.appendChild(opt);
    });
});

function createReport() {
    const typeReportId = document.getElementById("type_report_id").value;
    const reporterId = document.getElementById("reporter_id").value;
    const reportedUserId = document.getElementById("reported_user_id").value;
    const description = document.getElementById("description").value;

    const newReport = {
        type_report_id: parseInt(typeReportId),
        reporter_id: reporterId,
        reported_user_id: reportedUserId,
        description: description
    };

    if (newReport.type_report_id && newReport.reporter_id && newReport.reported_user_id && description) {
        axios.post('http://127.0.0.1:8000/create_reports', newReport)
            .then(function (response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Reporte Creado',
                    text: 'El reporte ha sido creado exitosamente.',
                    timer: 2000
                }).then(function () {
                    window.location.reload();  // Recargar la página
                });
            })
            .catch(function (error) {
                console.error('Error creating report:', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al crear el reporte: ' + error.response.data.detail
                });
            });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, complete todos los campos.'
        });
    }
}
