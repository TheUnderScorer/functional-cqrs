# Functional Cqrs

This library provides functional approach to CQRS (Command Query Responsibility Segregation).

It includes all basic components - Commands Bus, Queries Bus and Events Bus with advanced typescript support.

![CI](https://github.com/TheUnderScorer/functional-cqrs/workflows/CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/TheUnderScorer/functional-cqrs/badge.svg?branch=master)](https://coveralls.io/github/TheUnderScorer/functional-cqrs?branch=master)

## ✨ Getting Started

### Prerequsites

You will need:

- [nodejs](https://nodejs.org/en/) (>=12.13.1, not tested on older versions, but might work). It should also work in browsers (not tested).

### Installation

`npm install functional-cqrs` or `yarn add functional-cqrs`

## 🚀 Usage

Let's say that we have a simple to-do app:

```ts
import {
  Command,
  CommandContext,
  createCqrs,
  Event,
  EventContext,
} from 'functional-cqrs';
import { connectToDatabse } from 'your-database-library';

interface Task {
  id: string;
  title: string;
  done: boolean;
}

// Command name - required for type inference
const AddTask = 'AddTask' as const;

// Your command for adding new Task
class AddTaskCommand implements Command<Task> {
  readonly name = AddTask;

  constructor(readonly payload: Task) {}
}

// Event emitted after Task have been created
class TaskAddedEvent implements Event<Task> {
  constructor(readonly payload: Task) {}
}

// Your handler for adding new Task
const addTaskHandler = (connection: Connection) => async (
  command: AddTaskCommand,
  // CommandContext includes EventsBus for dispatching events
  ctx: CommandContext
) => {
  await connection.saveTask(command.payload);

  await ctx.eventsBus.dispatch(new TaskAddedEvent(command.payload));

  // Note that we return created task here
  return command.payload;
};

const onTaskAdded = (
  event: TaskAddedEvent,
  // EventContext includes CommandsBus so we can execute commands from here
  context: EventContext
) => {
  // Log created Task into console
  console.log(event.payload);
};

// Let's bootstrap our app

const connection = connectToDatabse();
const cqrs = createCqrs({
  commandHandlers: {
    // Here we create and register our command handler
    [AddTask]: addTaskHandler(connection),
  },
  eventHandlers: {
    // Events can have multiple handlers
    [TaskAddedEvent.name]: [onTaskAdded],
  },
});

const task = await cqrs.buses.commandsBus.execute(
  new AddTaskCommand({
    id: '1',
    done: false,
    title: 'Test task',
  })
);

// Typescript knows that this is a "Task"!
console.log(task.id);
```
You can very quickly integrate above example with any kind of application.

Now, you might ask:
> Why do we need to set command name as "'AddTask' as const;" and then use it to register the command handler, but we don't do the same for events?

In order to get the type inference from Typescript, we need a way to map command to handler - and we use it's name for it.
We have to define it "as const" so Typescript knows it's exact value.

We don't do that for events, because they always return `void | Promise<void>` :)

## 📖 Learn more

* [Commands](docs/commands.md)
* [Queries](docs/commands.md)
* [Events](docs/commands.md)
