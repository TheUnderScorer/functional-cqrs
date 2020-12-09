export enum HandlerType {
  Function = 'Function',
  Class = 'Class',
}

export interface BaseHandlerMetadata {
  name: string;
  type: HandlerType;
}

export interface HandlerMetadata<HandlerType = any>
  extends BaseHandlerMetadata {
  handler: HandlerType;
  targetName: string;
}
