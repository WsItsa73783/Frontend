
const pie = document.getElementById('state_schools').getContext('2d');

const Suicidios = new Chart(pie, {
    type: 'pie',
    data: {
        labels: ['Activos', 'Inactivos'],
        datasets: [{
            label: 'Colegios Activos y Inactivos',
            data: [10, 5],
            backgroundColor: [
                '#FF6384', // Rosa
                '#36A2EB', // Azul
                '#FFCE56'  // Amarillo
            ],
            borderColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ],
            borderWidth: 1
        }]
    }
});

const bar = document.getElementById('Activites').getContext('2d');

const activities = new Chart(bar, {
    type: 'bar',
    data: {
        labels: ['Activos', 'Inactivos'],
        datasets: [{
            label: 'Actividades Activos y Inactivos',
            data: [10, 10],
            backgroundColor: [
                '#FF6384', // Rosa
                '#36A2EB', // Azul
                '#FFCE56'  // Amarillo
            ],
            borderColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ],
            borderWidth: 1
        }]
    }
});

const line = document.getElementById('user_Ac').getContext('2d');

const usu_AC = new Chart(line, {
    type: 'line',
    data: {
        labels: ['Activos', 'Inactivos'],
        datasets: [{
            label: 'Usuarios Activos',
            data: [10, 20],
            backgroundColor: [
                '#FF6384', // Rosa
                '#36A2EB', // Azul
                '#FFCE56'  // Amarillo
            ],
            borderColor: [
                'rgb(75, 192, 192)'
            ],
            borderWidth: 1
        }]
    }
});

const redondo = document.getElementById('Ac_school').getContext('2d');

const ACtividades_por_colegios = new Chart(redondo, {
    type: 'pie',
    data: {
        labels: ['Dolores', 'Santander', 'Caparroso', 'Unibarranquilla'],
        datasets: [{
            label: 'Actividades por Colegios',
            data: [100, 150, 200, 250],
            backgroundColor: [
                '#FF6384', // Rosa
                '#36A2EB', // Azul
                '#FFCE56',  // Amarillo
                'rgb(54, 162, 235)'
            ],
            borderColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ],
            borderWidth: 1
        }]
    }
});

const barra = document.getElementById('type_reports').getContext('2d');

const type_reports = new Chart(barra, {
    type: 'bar',
    data: {
        labels: ['Comportamineto', 'Contenido Inapropiado', 'Otros'],
        datasets: [{
            label: 'Numero de resportes por tipo',
            data: [20, 20, 20],
            backgroundColor: [
                '#FF6384', // Rosa
                '#36A2EB', // Azul
                '#FFCE56'  // Amarillo
            ],
            borderColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56'
            ],
            borderWidth: 1
        }]
    }
});
