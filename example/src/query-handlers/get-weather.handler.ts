import { QueryHandler } from '@functional-cqrs/typings';
import { GetWeatherQuery, WeatherFetchedEvent } from '../commands';
import { queryHandler } from '@functional-cqrs/stores';
import { WeatherService } from '../services/weather.service';

export interface GetWeatherConfig {
  weatherService: WeatherService;
}

const getWeather: QueryHandler<GetWeatherQuery, GetWeatherConfig> = ({
  weatherService,
  eventsBus,
}) => async ({ payload: { place } }) => {
  const data = await weatherService.getWeather(place);

  await eventsBus.dispatch<WeatherFetchedEvent>({
    event: 'WeatherFetched',
    payload: {
      data,
      place,
    },
  });

  return data;
};

export default queryHandler<GetWeatherQuery, GetWeatherConfig>(
  'GetWeather',
  getWeather
);
