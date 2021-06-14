import { createCqrs } from 'functional-cqrs';
import { TodoRepository } from './types';
import { CreateTodo, CreateTodoCommand } from './commands/CreateTodo.command';
import { createTodoHandler } from './commands/createTodo.handler';
import express from 'express';
import { GetTodos, GetTodosQuery } from './queries/GetTodos.query';
import { TodoCreatedEvent } from './events/TodoCreated.event';
import { onTodoCreated } from './events/onTodoCreated';
import { GetTodosHandler } from './queries/getTodos.handler';

const app = express();

app.use(express.json());

const repository: TodoRepository = new Map();

const cqrs = createCqrs({
  commandHandlers: {
    [CreateTodo]: createTodoHandler(repository),
  },
  queryHandlers: {
    [GetTodos]: new GetTodosHandler(repository),
  },
  eventHandlers: {
    [TodoCreatedEvent.name]: [onTodoCreated],
  },
});

app.post('/todo', (req, res) => {
  // Typescript knows that this is a "Todo"
  const todo = cqrs.buses.commandsBus.execute(new CreateTodoCommand(req.body));

  res.json(todo);
});

app.get('/todo', (req, res) => {
  // Typescript knows that these are "Todo[]"
  const todos = cqrs.buses.queriesBus.query(
    new GetTodosQuery({
      limit: Number(req.query.limit),
    })
  );

  res.json(todos);
});

const port = 8080;

app.listen(port);

console.log(`Example todo app listening on port ${port}`);
console.log('To add new todo send POST request to /todo');
console.log('To get todos send GET request to /todo');
