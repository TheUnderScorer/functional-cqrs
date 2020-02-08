import { createCqrs } from '@functional-cqrs/core';
import Path from 'path';
import { createWeatherService } from './services/weather.service';
import { GetWeatherQuery } from './commands';

const weatherService = createWeatherService();
const context = {
  dataPath: Path.join('./', 'data'),
  weatherService,
};

(async () => {
  const [place] = process.argv.slice(2, process.argv.length);

  if (!place) {
    throw new Error(
      'You need to provide location for which weather will be fetched.'
    );
  }

  const {
    loadedHandlers,
    buses: { queriesBus },
  } = await createCqrs({
    queryHandlersPath: [
      Path.join(__dirname, '**', 'query-handlers', '*.handler.?(ts|js)'),
    ],
    eventHandlersPath: [
      Path.join(__dirname, '**', 'event-handlers', '*.handler.?(ts|js)'),
    ],
    commandHandlersPath: [
      Path.join(__dirname, '**', 'handlers', '*.handler.?(ts|js)'),
    ],
    context,
  });

  console.log('✨ Loaded handlers: ', loadedHandlers);
  console.log('☀️ Fetching weather for: ', place);

  const weatherData = await queriesBus.query<GetWeatherQuery>({
    query: 'GetWeather',
    payload: {
      place,
    },
  });

  console.log(JSON.stringify(weatherData, null, ' '));
})().catch(console.error);
