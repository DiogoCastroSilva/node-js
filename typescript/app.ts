// Packages
import express from 'express';
import bodyParser from 'body-parser';

// Routes
import todosRoutes from './routes/todos';

const app = express();

// Config
app.use(bodyParser.json());

// Routes
app.use(todosRoutes);


app.listen(8080);