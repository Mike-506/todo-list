const express = require('express');
const sqlite =  require('sqlite3').verbose();
const app = express();
const { v4: uuidv4 } = require('uuid');
const cors = require('cors');

const router = express.Router();

const dbPath = process.env.SQLITE_PATH;

const db = new sqlite.Database(dbPath || './server/to_do.db', sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.error(err);
})

let sql;

//setting
app.set('json spaces', 2);
app.set('port', 3001);

//middleware
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // Solo permite solicitudes desde este dominio
  methods: 'GET,POST,DELETE,PUT', // Permite solo los métodos GET, POST, PUT y DELETE
}));

const validateRequestBody = (req, res, next) => {
  const { task } = req.body;
  // Verify if task its not null, undefined or empty string
  if (task === null || task === undefined || task.trim() === "") {
    return res.status(400).json({
      status: 400,
      success: false,
      error: "Invalid request body",
    });
  }
  next();
};

app.get('/tasks', (req, res) => {
  sql = "SELECT * FROM tasks";
  try {
    db.all(sql, [], (err, rows) => {
      if (err) return res.json({status: 300, success: false, error: err});

      if (rows.length < 1) return res.json({status: 300, success: false, error: "No match"});

      return res.json({status: 200, data: rows, success: true})
    })
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
  });
  }
})

app.post('/tasks', validateRequestBody, (req, res) => {
  try {
    const { task } = req.body;
    const task_id = uuidv4();
    const sql = "INSERT INTO tasks(task_id, task) VALUES (?, ?)";
    db.run(sql, [task_id, task], (err) => {
      if (err) return res.json({ status: 300, success: false, error: err });
      console.log("Successful input", task);
    });
    return res.json({
      status: 200,
      success: true,
    });
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});

app.get('/tasks/:id', (req, res) => {
  const id = req.params.id;
  sql = 'SELECT * FROM tasks WHERE task_id = ?';
  db.all(sql, [id], (err, rows) => {
    if (err) {
      return res.status(500).json({status: 500, success: false, error: err.message });
    }
    if (rows.length === 0) {
      return res.status(404).json({status: 404, success: false, error: "No record found" });
    }
    return res.status(200).json({status: 200, success: true, data: rows });
  });
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'DELETE FROM tasks WHERE task_id = ?';
  
  db.run(sql, [id],  function(err) {
    if (err) {
      return res.status(500).json({ status: 500, success: false, error: err.message });
    }
    
    if (this.changes === 0) {
      // No registry was found with the specified Id
      return res.status(404).json({ status: 404, success: false, error: `The record with ID${id}  was not found` });
    }
    
    return res.status(200).json({ status: 200, success: true });
  });
});

app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const { completed } = req.body; // Espera que el cuerpo de la solicitud contenga "completed"
  const sql = 'UPDATE tasks SET completed = ? WHERE task_id = ?';
  db.run(sql, [completed, id], (err) => {
    if (err) {
      console.error('Error al actualizar el estado de la tarea:', err);
      return res.status(500).json({ status: 500, success: false, error: err });
    }
    console.log('Estado de la tarea actualizado correctamente:', id, completed);
    return res.status(200).json({ status: 200, success: true });
  });
});


//starting the server
app.listen(app.get('port'), () => {
  console.log(`The server is listening on port ${app.get('port')}`);
})

module.exports = router;


/*
router.post('/', (req, res, next) => {
  req.body.title = req.body.title.trim();
  next();
}, (req, res, next) => {
  if (req.body.title !== '') { return next(); }
  return res.redirect('/' + (req.body.filter || ''));
}, (req, res, next) => {
  db.run('INSERT INTO todos (title, completed) VALUES (?, ?)', [
    req.body.title,
    req.body.completed === true ? 1 : null
  ], (err) => {
    if (err) { return next(err); }
    return res.redirect('/' + (req.body.filter || ''));
  });
});
*/

/* directly in the POST request

app.post('/tasks', (req, res) => {
  try {
    const { task } = req.body;

    // Verify if task its not null, undefined or empty string
    if (task !== null && task !== undefined && task.trim() !== "") {
      const sql = "INSERT INTO tasksTest(task) VALUES (?)";
      db.run(sql, [task], (err) => {
        if (err) return res.json({ status: 300, success: false, error: err });
        console.log("Successful input", task);
      });
      return res.json({
        status: 200,
        success: true,
      });
    } else {
      // If task is null, undefined or empty, returns an error
      return res.json({
        status: 400,
        success: false,
        error: "Please input a task",
      });
    }
  } catch (error) {
    return res.json({
      status: 400,
      success: false,
    });
  }
});
*/

/*
const fetchTodos = (req, res, next) => {
  db.all('SELECT * FROM tasksTest', [], (err, rows) => {
    if (err) { return next(err); }
    
    const tasks = rows.map((row) => {
      return {
        task_id: row.id,
        task: row.task,
        completed: row.completed === 1 ? true : false,
      }
    });
    res.task = tasks;
    res.completed = tasks.filter((todo) => { return !todo.completed; }).length;
    next();
  });
}


app.get('/tasks', fetchTodos, function(req, res, next) {
  next();
});
*/