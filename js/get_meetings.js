document.addEventListener("DOMContentLoaded", function() {
    axios.get('http://127.0.0.1:8000/get_meetings')
        .then(function(response) {
            let data = response.data.resultado;
            let tableBody = document.querySelector("#lista-reuniones tbody");
            tableBody.innerHTML = "";

            function formatTimestamp(timestamp) {
                if (timestamp) {
                    let date = new Date(timestamp);
                    return date.toLocaleString();
                }
                return '';
            }

            data.forEach((meeting, index) => {
                let row = tableBody.insertRow(index);
                let cellId = row.insertCell(0);
                let cellTitle = row.insertCell(1);
                let cellDescription = row.insertCell(2);
                let cellDate = row.insertCell(3);
                let cellTime = row.insertCell(4);
                let cellSchoolId = row.insertCell(5);
                let cellState = row.insertCell(6);

                cellId.textContent = meeting.id;
                cellTitle.textContent = meeting.title;
                cellDescription.textContent = meeting.description;
                cellDate.textContent = formatTimestamp(meeting.date);
                cellTime.textContent = meeting.time;
                cellSchoolId.textContent = meeting.school_id;
                cellState.textContent = meeting.state;
            });
            $('#lista-reuniones').DataTable({
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

    
});