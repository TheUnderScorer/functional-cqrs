export interface BaseHandlerMetadata {
  name: string;
  type: 'function' | 'class';
}

export interface SingularHandlerMetadata<HandlerType = any>
  extends BaseHandlerMetadata {
  handler: HandlerType;
  targetName: string;
}
