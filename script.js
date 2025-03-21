document.addEventListener("DOMContentLoaded", function () {
    fetch("sensors.csv")
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.split("\n").map(row => row.split(","));
            const headers = rows[0];
            const data = rows.slice(1).map(row => Object.fromEntries(row.map((val, i) => [headers[i], val])));

            const manufacturers = [...new Set(data.map(item => item.Manufacturer))];
            const manufacturerSelect = document.getElementById("manufacturer");
            manufacturers.forEach(manufacturer => {
                const option = document.createElement("option");
                option.value = manufacturer;
                option.textContent = manufacturer;
                manufacturerSelect.appendChild(option);
            });

            manufacturerSelect.addEventListener("change", () => updateCameraModels(data));
            document.getElementById("camera").addEventListener("change", () => updateResolutions(data));
            document.getElementById("resolution").addEventListener("change", () => showSensorInfo(data));

            function updateCameraModels(data) {
                const manufacturer = manufacturerSelect.value;
                const cameras = [...new Set(data.filter(item => item.Manufacturer === manufacturer).map(item => item.Model))];
                const cameraSelect = document.getElementById("camera");
                cameraSelect.innerHTML = "";
                cameras.forEach(camera => {
                    const option = document.createElement("option");
                    option.value = camera;
                    option.textContent = camera;
                    cameraSelect.appendChild(option);
                });
                updateResolutions(data);
            }

            function updateResolutions(data) {
                const manufacturer = manufacturerSelect.value;
                const camera = document.getElementById("camera").value;
                const resolutions = [...new Set(data.filter(item => item.Manufacturer === manufacturer && item.Model === camera).map(item => `${item["Resolution Width"]}x${item["Resolution Height"]}`))];
                const resolutionSelect = document.getElementById("resolution");
                resolutionSelect.innerHTML = "";
                resolutions.forEach(res => {
                    const option = document.createElement("option");
                    option.value = res;
                    option.textContent = res;
                    resolutionSelect.appendChild(option);
                });
                showSensorInfo(data);
            }

            function showSensorInfo(data) {
                const manufacturer = manufacturerSelect.value;
                const camera = document.getElementById("camera").value;
                const resolution = document.getElementById("resolution").value;
                const sensorData = data.find(item => 
                    item.Manufacturer === manufacturer && 
                    item.Model === camera && 
                    `${item["Resolution Width"]}x${item["Resolution Height"]}` === resolution
                );
                if (sensorData) {
                    document.getElementById("sensor-info").innerHTML = `
                        <h2>Sensor Information</h2>
                        <p><strong>Sensor Width:</strong> ${sensorData["Sensor mm Width"]} mm</p>
                        <p><strong>Sensor Height:</strong> ${sensorData["Sensor mm Height"]} mm</p>
                        <p><strong>Sensor Diagonal:</strong> ${sensorData["Sensor mm Diagonal"]} mm</p>
                        <p><strong>Sensor Width (Inches):</strong> ${sensorData["Sensor Inches Width"]} inches</p>
                        <p><strong>Sensor Height (Inches):</strong> ${sensorData["Sensor Inches Height"]} inches</p>
                        <p><strong>Sensor Diagonal (Inches):</strong> ${sensorData["Sensor Inches Diagonal"]} inches</p>
                    `;
                }
            }
        });
});
