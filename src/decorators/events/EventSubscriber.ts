import {
  MethodMetadataKind,
  methodMetadataStore,
} from '../../stores/metadata/methodMetadataStore';

export interface EventSubscriberParams {
  eventName: string;
}

export const EventSubscriber = ({ eventName }: EventSubscriberParams) => (
  target: any,
  propertyKey: string | symbol
) => {
  methodMetadataStore.add({
    kind: MethodMetadataKind.EventSubscriber,
    constructor: target.constructor,
    key: propertyKey,
    meta: {
      eventName,
    },
  });
};
