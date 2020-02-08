import fetch from 'node-fetch';

export interface WeatherService {
  getWeather(location: string): Promise<object>;
}

const defaultApiKey = '76c0abeb8d461871db40ae5f66564562';

export const createWeatherService = (
  apiKey = defaultApiKey
): WeatherService => {
  const baseUrl = `http://api.openweathermap.org/data/2.5`;

  return {
    async getWeather(location: string): Promise<object> {
      const response = await fetch(
        `${baseUrl}/weather?q=${location}&appid=${apiKey}`
      );

      return response.json();
    },
  };
};
