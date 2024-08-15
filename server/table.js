const sqlite = require('sqlite3').verbose();

const db = new sqlite.Database('C:\\Users\\user\\Desktop\\Proyectos React\\4to Proyecto React\\ToDo-List\\server/to_do.db', sqlite.OPEN_READWRITE, (err) => {
  if (err) return console.error(err);
})


const sql = `CREATE TABLE tasks(
  task_id TEXT PRIMARY KEY,
  task TEXT,
  completed INTEGER DEFAULT 0
)`;

//const deleteSqlTable = `DROP TABLE tasksTest;`

db.run(sql, (err) => {
  if (err) return console.error(err);
  console.log("'tasks' Table has been successfully created");
});

