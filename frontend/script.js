function createInfographics() {
    const color1 = document.getElementById('color1').value;
    const color2 = document.getElementById('color2').value;
    const color3 = document.getElementById('color3').value;
    const url = document.getElementById('url').value;

    // Prepare the data to be sent to the backend
    const requestData = {
        "color1": "#fff",
        "color2": "#fff",
        "color3": "#fff",
        "url": "https://shiftyourcareer.de/job-kuendigen/"
    };


    // Make a POST request to the backend
    fetch('http://localhost:3000/generate-infographics', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
    })
    .then(response => response.json())
    .then(data => {
        // Handle the response from the server
        console.log('Server Response:', data);

        // Add code to dynamically generate and display infographics based on the response.
        // You'll replace this with the actual logic to create infographics on the frontend.
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors as needed
    });
}
