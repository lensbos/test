/**
 * API
 */

var express = require('express');
var app = express();

var repo = require( './TaskRepository.js' );
var TaskRepository = new repo();

app.configure(function () {
    // used to parse JSON object given in the body request
    app.use(express.bodyParser());
});
/**
 * HTTP GET /tasks
 * Returns: the list of tasks in JSON format
 */
app.get('/tasks', function (request, response) {
    response.json({tasks: TaskRepository.findAll()});
});
/**
 * HTTP GET /tasks/:id
 * Param: :id is the unique identifier of the task you want to retrieve
 * Returns: the task with the specified :id in a JSON format
 * Error: 404 HTTP code if the task doesn't exists
 */
app.get('/tasks/:id', function (request, response) {
    var taskId = request.params.id;
    try {
        response.json(TaskRepository.find(taskId));
    } catch (exeception) {
        response.send(404);
    }
    
});
/**
 * HTTP POST /tasks/
 * Body Param: the JSON task you want to create
 * Returns: 200 HTTP code
 */
app.post('/tasks', function (request, response) {
    var task = request.body;
    console.log( 'request' + request.body )
    TaskRepository.save({
        title: task.title || 'Default title',
        description: task.description || 'Default description',
        dueDate: task.dueDate,
        status: task.status || 'not completed'
    });
    response.send(200);
});
/**
 * HTTP PUT /tasks/
 * Param: :id the unique identifier of the task you want to update
 * Body Param: the JSON task you want to update
 * Returns: 200 HTTP code
 * Error: 404 HTTP code if the task doesn't exists
 */
app.put('/tasks/:id', function (request, response) {
    var task = request.body;
    var taskId = request.params.id;
    try {
        var persistedTask = TaskRepository.find(taskId);
        TaskRepository.save({
            taskId: persistedTask.taskId,
            title: task.title || persistedTask.title,
            description: task.description || persistedTask.description,
            dueDate: task.dueDate || persistedTask.dueDate,
            status: task.status || persistedTask.status
        });
        response.send(200);
    } catch (exception) {
        response.send(404);
    }
});
/**
 * HTTP PUT /tasks/
 * Param: :id the unique identifier of the task you want to update
 * Body Param: the JSON task you want to update
 * Returns: 200 HTTP code
 * Error: 404 HTTP code if the task doesn't exists
 */
app.delete('/tasks/:id', function (request, response) {
    try {
        TaskRepository.remove(request.params.id);
        response.send(200);
    } catch (exeception) {
        response.send(404);
    }
});
 
app.listen( process.env.PORT, process.env.IP ); //to port on which the express server listen