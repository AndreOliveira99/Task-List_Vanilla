/* Esse arquivo contém as funções que se conectam
   diretamente com o banco de dados */

const connection = require('./connection');

const getAll = async () => {
// array destruction para pegar apenas o primeiro elemento do array
    const [tasks] = await connection.execute('SELECT * FROM tasks');
    return tasks;
};

const createTask = async (task) => {
    const { title } = task;
    const dateUTC = new Date(Date.now()).toUTCString();
    const query = 'INSERT INTO tasks(title, status, created_at) VALUES (?, ?, ?)';
    // array destruction para pegar apenas o primeiro elemento do array
    const [createdTask] = await connection.execute(query , [title, 'pendente', dateUTC]);
    return {insertId: createdTask.insertId};
};

const deleteTask = async (id) => {
    const [deletedTask] = await connection.execute('DELETE FROM tasks WHERE id=?', [id])
    return deletedTask
}

const updateTask = async (id, task) => {
    const { title, status } = task
    const query = 'UPDATE tasks SET title=?, status=? WHERE id=?'
    const [updatedTask] = await connection.execute(query, [title, status, id])
    return updatedTask
}

module.exports = {
    getAll,
    createTask,
    deleteTask,
    updateTask
};