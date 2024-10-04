document.getElementById('fetchCountries').addEventListener('click', function() {
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            const countryList = document.getElementById('countryList');
            countryList.innerHTML = ''; // Clear previous list
            data.forEach(country => {
                const countryName = country.name.common; // Get the common name
                const countryItem = document.createElement('div');
                countryItem.textContent = countryName;
                countryList.appendChild(countryItem);
            });
            // Show the modal
            $('#countriesModal').modal('show');
        })
        .catch(error => {
            console.error('Error fetching country data:', error);
        });
});