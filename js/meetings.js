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
                let cellDeleted = row.insertCell(7);

                cellId.textContent = meeting.id;
                cellTitle.textContent = meeting.title;
                cellDescription.textContent = meeting.description;
                cellDate.textContent = formatTimestamp(meeting.date);
                cellTime.textContent = meeting.time;
                cellSchoolId.textContent = meeting.school_id;
                cellState.textContent = meeting.state;

                cellDeleted.innerHTML = `
                    <button type="button" class="btn btn-primary" onclick="showViewModal(${meeting.id}, '${meeting.title}', '${meeting.description}', '${meeting.date}', '${meeting.time}', '${meeting.school_id}', '${meeting.state}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button type="button" class="btn btn-warning" onclick="showUpdateModal(${meeting.id}, '${meeting.title}', '${meeting.description}', '${meeting.date}', '${meeting.time}', '${meeting.school_id}', '${meeting.state}')">
                        <i class="fas fa-edit"></i>
                    </button> 
                    <button type="button" class="btn btn-danger" onclick="showDeleteModal(${meeting.id})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
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

function showUpdateModal(meetingId, title, description, date, time, schoolId, state) {
    document.getElementById("update-meeting-id").value = meetingId;
    document.getElementById("update-title").value = title;
    document.getElementById("update-description").value = description;
    document.getElementById("update-date").value = date;
    document.getElementById("update-time").value = time;
    populateSchools("update-school", schoolId);
    populateStates("update-state", state);
    $('#updateMeetingModal').modal('show');
}

function populateSchools(selectId, selectedSchoolId) {
    const schoolSelect = document.getElementById(selectId);
    if (!schoolSelect) {
        console.error('Element with ID', selectId, 'not found');
        return;
    }

    axios.get('http://127.0.0.1:8000/get_dicschools')
        .then(function(response) {
            console.log('Schools received:', response.data);
            const schools = response.data;
            schoolSelect.innerHTML = '';  // Limpiar opciones actuales
            schools.forEach(school => {
                const opt = document.createElement("option");
                opt.value = school.id;
                opt.textContent = school.name;
                if (school.id == selectedSchoolId) {
                    opt.selected = true; // Seleccionar el colegio actual
                }
                schoolSelect.appendChild(opt);
            });
        })
        .catch(function(error) {
            console.error('Error fetching schools:', error);
        });
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

function updateMeeting() {
    const meetingId = parseInt(document.getElementById("update-meeting-id").value, 10);
    const title = document.getElementById("update-title").value;
    const description = document.getElementById("update-description").value;
    const date = document.getElementById("update-date").value; // Format: YYYY-MM-DD
    const time = document.getElementById("update-time").value; // Format: HH:MM
    const schoolId = parseInt(document.getElementById("update-school").value, 10);
    const state = parseInt(document.getElementById("update-state").value, 10);

    console.log("Updating meeting with ID:", meetingId);

    if (!isNaN(meetingId) && title && description && date && time && !isNaN(schoolId) && !isNaN(state)) {
        axios.put(`http://127.0.0.1:8000/edit_meetings/${meetingId}`, {
            title: title,
            description: description,
            date: date,
            time: time,
            school_id: schoolId,
            state: state
        })
        .then(response => {
            Swal.fire({
                icon: 'success',
                title: 'Meeting Updated',
                text: 'The meeting has been successfully updated.',
                timer: 2000
            }).then(function () {
                $('#updateMeetingModal').modal('hide');
                location.reload(); // Reload the page or handle navigation
            });
        })
        .catch(error => {
            console.error('Error updating meeting: ', error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'There was an error updating the meeting. Please try again later.'
            });
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill out all fields correctly.'
        });
    }
}



function showDeleteModal(schoolId) {
    document.getElementById("delete-id").value = schoolId;
    $('#deleteModal').modal('show');}

function deleteMeeting() {
    const meeting_id = document.getElementById("delete-id").value;

    axios.delete(`http://127.0.0.1:8000/delete_meetings/${meeting_id}`)
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

document.addEventListener("DOMContentLoaded", function() {
    const stateSelect = document.getElementById("state");

    const options = [
        { value: 1, text: "Activo" },  // value as integer
        { value: 0, text: "Inactivo" } // value as integer
    ];

    options.forEach(option => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.text;
        stateSelect.appendChild(opt);
    });
    const schoolSelect = document.getElementById("school");

    axios.get('http://127.0.0.1:8000/get_dicschools')
        .then(function(response) {
            const schools = response.data;
            schools.forEach(school => {
                const opt = document.createElement("option");
                opt.value = school.id;
                opt.textContent = school.name;
                schoolSelect.appendChild(opt);
            });
        })
        .catch(function(error) {
            console.error('Error fetching schools:', error);
        });
});



function createMeeting() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const school_id = document.getElementById("school").value;
    const state = document.getElementById("state").value;

    // Convertir el state a número entero
    const stateInt = parseInt(state);

    // Formatear la fecha y la hora si es necesario
    const formattedDate = new Date(date).toISOString().split('T')[0];
    const formattedTime = time;

    const newMeeting = {
        title: title,
        description: description,
        date: formattedDate,
        time: formattedTime,
        school_id: parseInt(school_id),
        state: stateInt // enviar el state como número entero
    };

    if (title && description && date && time && school_id && !isNaN(stateInt)) {
        axios.post('http://127.0.0.1:8000/create_meetings', newMeeting)
            .then(function (response) {
                console.log('Meeting created:', response.data);
                Swal.fire({
                    icon: 'success',
                    title: 'Meeting Created',
                    text: 'The meeting has been successfully created.',
                    timer: 2000
                }).then(function () {
                    window.location.reload(); // Reload the page or handle navigation
                });
            })
            .catch(function (error) {
                console.error('Error creating meeting:', error.response.data);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'There was an error creating the meeting: ' + error.response.data.message
                });
            });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please fill out all fields.'
        });
    }
}



