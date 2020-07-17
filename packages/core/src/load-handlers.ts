export type HandlerToRegister = (store: Store) => any;

export type Store = Map<string, any | any[]>;

export interface LoadHandlersConfig {
  handlers: HandlerToRegister[];
  store: Store;
}

const loadHandlers = ({ handlers, store }: LoadHandlersConfig): number => {
  handlers.forEach((handler) => handler(store));

  return handlers.length;
};

export default loadHandlers;
