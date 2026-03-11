const map = L.map('map').setView([20, 0], 2);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
}).addTo(map);

let timelineChart;
let allData = [];

async function loadDisasterData() {
    const loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.style.display = 'block';

    try {
        const response = await fetch('/api/disasters');
        if (!response.ok) throw new Error('Failed to fetch API');
        allData = await response.json();
        
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const lastUpdatedEl = document.getElementById('last-updated');
        if (lastUpdatedEl) {
            lastUpdatedEl.innerText = `Data updated at: ${timeString}`;
        }
        
        updateDashboard();
    } catch (error) {
        console.error(error);
        alert('Data could not be loaded.');
    } finally {
        if (loadingEl) loadingEl.style.display = 'none';
    }
}

function filterData(data, region) {
    if (region === 'World') return data;

    const regions = {
        'Europe': { lat: [35, 70], lon: [-10, 40] },
        'Asia': { lat: [5, 80], lon: [40, 180] },
        'North America': { lat: [10, 75], lon: [-170, -50] },
        'South America': { lat: [-60, 15], lon: [-90, -30] },
        'Africa': { lat: [-40, 35], lon: [-20, 55] },
        'Oceania': { lat: [-50, 0], lon: [110, 180] },
    };

    const bounds = regions[region];
    return data.filter(target => {
        return target.latitude >= bounds.lat[0] && target.latitude <= bounds.lat[1] &&
               target.longitude >= bounds.lon[0] && target.longitude <= bounds.lon[1];
    });
}

function updateDashboard() {
    const region = document.getElementById('region-filter').value;
    const filteredData = filterData(allData, region);

    updateMap(filteredData);
    updateChart(filteredData);
    updateList(filteredData);
}

const markers = [];
function updateMap(data) {
    markers.forEach(m => map.removeLayer(m));
    markers.length = 0;

    data.forEach(d => {
        let color = 'green';
        if (d.magnitude >= 3 && d.magnitude < 5) color = 'orange';
        else if (d.magnitude >= 5) color = 'red';

        const marker = L.circleMarker([d.latitude, d.longitude], {
            color: color,
            radius: 8,
            fillOpacity: 0.8
        }).addTo(map);

        const timeStr = new Date(d.timestamp).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
        marker.bindPopup(`
            Location: ${d.location_name}<br>
            Magnitude: ${d.magnitude}<br>
            Time: ${timeStr}<br>
            Country: ${d.country || 'Unknown'}<br>
            City: ${d.city || 'Unknown'}<br>
            Temperature: ${d.weather ? d.weather.temperature + '°C' : 'N/A'}<br>
            Wind Speed: ${d.weather ? d.weather.windspeed + ' km/h' : 'N/A'}
        `);
        markers.push(marker);
    });
}

function updateChart(data) {
    const ctx = document.getElementById('timelineChart').getContext('2d');
    
    // Group events by hour
    const countsByHour = {};
    data.forEach(d => {
        const date = new Date(d.timestamp);
        date.setMinutes(0, 0, 0); // truncate to hour
        const hourKey = date.toLocaleString();
        countsByHour[hourKey] = (countsByHour[hourKey] || 0) + 1;
    });

    const labels = Object.keys(countsByHour).sort((a,b) => new Date(a) - new Date(b));
    const counts = labels.map(l => countsByHour[l]);

    if (timelineChart) timelineChart.destroy();

    timelineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Number of Disasters',
                data: counts,
                borderColor: 'blue',
                fill: false,
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateList(data) {
    const ul = document.getElementById('disaster-list');
    ul.innerHTML = '';
    
    // Sort newest first
    const sortedData = [...data].sort((a, b) => b.timestamp - a.timestamp);
    const topData = sortedData.slice(0, 30);
    
    topData.forEach(d => {
        const li = document.createElement('li');
        const timeStr = new Date(d.timestamp).toISOString().replace('T', ' ').slice(0, 16) + ' UTC';
        li.innerText = `${d.location_name} — Magnitude ${d.magnitude} — ${d.country || 'Unknown'} — ${timeStr}`;
        ul.appendChild(li);
    });
}

document.getElementById('region-filter').addEventListener('change', updateDashboard);

loadDisasterData();
setInterval(loadDisasterData, 600000);
