const express = require('express');
const app = express();
const disasterRoutes = require('./routes/disasterRoutes');

app.use(express.static('public'));
app.use('/api', disasterRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
