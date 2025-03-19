import express from 'express'
import cors from 'cors'
import path from 'path'

const app = express();
const __dirname = path.resolve();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'Frontend/dist')))

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use((req, res, next) => {
    if (req.method === 'POST' && (!req.body || Object.keys(req.body).length === 0)) {
        return res.status(400).json({ error: 'Request body is empty', status: 400 });
    }
    next();
})

let users = []

app.post('/users', (req, res) => {
    try {
        users.push({ ...req.body, id: Date.now().toString(36) })
        res.status(201).send("User created successfully");
    }
    catch (error) {
        next(error)
    }
})

app.get('/users', (req, res) => {
    try {
        res.send(users)
    } catch (error) {
        next(error)
    }
})

app.put('/users/:id', (req, res) => {
    try {
        const { id } = req.params;
        const index = users.findIndex((user) => user.id === id);
        
        if (index === -1) {
            return res.status(404).json({ error: 'User not found', status: 404 });
        }

        users.splice(index, 1, { ...req.body, id });
        res.status(200).send("User updated successfully");
    } catch (error) {
        next(error);
    }
});

app.delete('/users/:id', (req, res) => {
    try {
        const { id } = req.params;
        const index = users.findIndex((user) => user.id === id);
        if(index === -1){
            return res.status(404).json({ error: 'User  not found', status: 404 });
            
        }
        users.splice(index, 1);
        res.status(200).send("User deleted successfully");
    } catch (error) {
        next(error);
    }
})

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'Frontend/dist', 'index.html'));
});


app.use((err, req, res, next) => {
    const status = err.status || 500;
    res.status(status).json({ error: err.message || 'Internal Server Error', status });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})