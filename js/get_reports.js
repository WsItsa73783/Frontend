document.addEventListener("DOMContentLoaded", function() {
    axios.get('http://127.0.0.1:8000/get_reports')
        .then(function(response) {
            let data = response.data.resultado;
            let tableBody = document.querySelector("#lista-reportes tbody");
            tableBody.innerHTML = "";

            data.forEach((report, index) => {
                let row = tableBody.insertRow(index);
                let cellTypeReportId = row.insertCell(0);
                let cellReporterName = row.insertCell(1);
                let cellReportedUserName = row.insertCell(2);
                let cellDescription = row.insertCell(3);

                cellTypeReportId.textContent = report.type_report_id;
                cellReporterName.textContent = report.reporter_name;  // Asegúrate de usar el nombre correcto aquí
                cellReportedUserName.textContent = report.reported_user_name;  // Asegúrate de usar el nombre correcto aquí
                cellDescription.textContent = report.description;

                let descriptionEscaped = report.description.replace(/'/g, "\\'");
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