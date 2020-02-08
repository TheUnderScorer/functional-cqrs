import { Command, Event, Query } from '@functional-cqrs/typings';

export interface GetWeatherPayload {
  place: string;
}
export type GetWeatherQuery = Query<'GetWeather', GetWeatherPayload>;

export interface WeatherFetchedPayload {
  data: any;
  place: string;
}
export type WeatherFetchedEvent = Event<
  'WeatherFetched',
  WeatherFetchedPayload
>;

export type SaveWeatherCommand = Command<'SaveWeather', WeatherFetchedPayload>;
