const exspress = require('express');
const path = require('path');
const app = exspress();
const PORT = process.env.PORT || 3000;
app.use(exspress.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'Index.html'));
});
app.get('/charactersheet', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'charactersheet.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});