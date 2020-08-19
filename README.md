# Functional Cqrs
![CI](https://github.com/TheUnderScorer/functional-cqrs/workflows/CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/TheUnderScorer/functional-cqrs/badge.svg?branch=master)](https://coveralls.io/github/TheUnderScorer/functional-cqrs?branch=master)

This library provides functional approach to CQRS (Command Query Responsibility Segregation).

NOTE: Readme is in progress

## Content list

1. [✨ Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
2. [🚀 Usage](#-usage)
3. Examples


## ✨ Getting Started

### Prerequsites

You will need:
- [nodejs](https://nodejs.org/en/) (>=12.13.1, not tested on older versions, but might work)

### Installation

`npm install functional-cqrs` or `yarn add functional-cqrs`

## 🚀 Usage

Functional Cqrs splits into three basic components:

### Commands

Commands are parts of applications that change it's state (for example by creating new record in database) and dispatch events respective to these actions. Commands can be executed by using `CommandsBus`.

> Typescript

```typescript
commandsBus.execute<SaveTodo>({
    name: 'SaveTodo',
    payload: todo,
  });
```

> Javascript

```javascript
commandsBus.execute({
    name: 'SaveTodo',
    payload: todo,
  });
```

Commands always come with two properties: 
- `name` definies name of the command (usually named after certain domain action, ex. "SaveTodo"),
- `payload` Data attached to command (ex. input of entity that should be validated and saved in database)

Every command should have only one handle

>Hint: Commands are usualy named in present tense

Bonus for Typescript users, you can define commands types in following way:

```typescript
import { Command } from 'functional-cqrs';

export name SaveTodo = Command<'SaveTodo', Todo>;
```

First generic argument defines command `name` property, and second defines `payload`. 

#### Command Handlers

#### As function

Handlers are always bound to single command, and they can return value. They can also execute [queries](#queries) and dispatch [events](#events.)

>Typescript

```typescript
import { commandHandler, CommandHandlerFn } from 'functional-cqrs';

export interface Context {
  connection: Connection;
}

const saveTodoHandler: CommandHandlerFn<SaveTodo, Context> = async ({
  context: {
    eventsBus,
    connection,  
  },
  command: {payload}
}) => {
  if (!payload.title) {
    throw new Error('Title is required.');
  }

  const todo = connection.save(payload);

  await eventsBus.dispatch<TodoSaved>({
    name: 'TodoSaved',
    payload: todo,
  });

  return todo;
};

export default commandHandler.asFunction<SaveTodo, Context>('SaveTodo', saveTodoHandler);
```

>Javascript

```javascript
import { commandHandler } from 'functional-cqrs';

const saveTodoHandler = async ({
  context: {
    eventsBus,
    connection,  
  },
  command: {payload}
}) => {
  if (!payload.title) {
    throw new Error('Title is required.');
  }

  const todo = connection.save(payload);

  await eventsBus.dispatch({
    name: 'TodoSaved',
    payload: todo,
  });

  return todo;
};

module.exports = commandHandler.asFunction('SaveTodo', saveTodoHandler);
```

Handler is a function that takes one parameter which contains "Context" (which basically contains all dependencies from your application, such as database connection and also buses related to it's name.) and query, event or command.

<br>
Command handlers get's injected with two buses - [Queries Bus](#queries-bus) and [Events Bus](#events-bus) in addition to the context.
<br>
This function returns another function that takes in this case command as a parameter that then get's resolved.

> Hint: Remember that you always have to "decorate" your handler using "commandHandler.asFunction" or "commandHandler.asClass"
