export class NoHandlerFoundError extends Error {
  constructor(name: string) {
    super(`No handler for ${name} found.`);
  }
}
