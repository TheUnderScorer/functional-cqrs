import { Buses } from './buses';

export type ContextCreator<Context = any> = (buses: Buses) => Context;
