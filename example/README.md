## Example Cqrs App

> What's the weather today?
> ~ My Grandma

Simple application that fetches JSON with weather data (using OpenWeather API) for given location. 
The application also stores the fetched weather data in json file that can be used for further analyse.

### Usage

`yarn run start <place>`

Fetch weather for given place.

`yarn run build`

Build application.

`yarn run prod <place>`

Fetch weather for given place (in production mode). Note, you need to build the application first.
