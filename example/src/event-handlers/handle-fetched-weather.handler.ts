import { EventHandler } from '@functional-cqrs/typings';
import { SaveWeatherCommand, WeatherFetchedEvent } from '../commands';
import { eventHandler } from '@functional-cqrs/stores';

const handler: EventHandler<WeatherFetchedEvent, object> = ({
  commandsBus,
}) => async ({ payload: { data, place } }) => {
  if (!data) {
    return;
  }

  await commandsBus.execute<SaveWeatherCommand>({
    type: 'SaveWeather',
    payload: {
      data,
      place,
    },
  });
};

export default eventHandler<WeatherFetchedEvent>('WeatherFetched', handler);
