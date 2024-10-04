document.addEventListener("DOMContentLoaded", function() {
    fetchActivities();
});

function fetchActivities() {
    axios.get('http://127.0.0.1:8000/get_activities')
        .then(function(response) {
            let data = response.data.resultado;
            let tableBody = document.querySelector("#lista-actividades tbody");
            tableBody.innerHTML = "";

            function formatTimestamp(timestamp) {
                if (timestamp) {
                    let date = new Date(timestamp);
                    return date.toLocaleString();
                }
                return '';
            }

            data.forEach((activity, index) => {
                let row = tableBody.insertRow(index);
                let cellTitle = row.insertCell(0);
                let cellDescription = row.insertCell(1);
                let cellStartDate = row.insertCell(2);
                let cellEndDate = row.insertCell(3);
                let cellSchoolId = row.insertCell(4);

                cellTitle.textContent = activity.title;
                cellDescription.textContent = activity.description;
                cellStartDate.textContent = formatTimestamp(activity.start_date);
                cellEndDate.textContent = formatTimestamp(activity.end_date);
                cellSchoolId.textContent = activity.school_id;

            });
            $('#activities-table').DataTable({
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
            console.error('Error fetching data: ', error);
        });
}