import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public country: string,
    public description: string,
    public temperature: number,
    public feelsLike: number,
    public humidity: number,
    public windSpeed: number,
    public icon: string,
    public date?: string
  ) {
    this.city = city;
    this.country = country;
    this.description = description;
    this.temperature = temperature;
    this.feelsLike = feelsLike;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
    this.icon = icon;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;
  constructor() {
    this.baseURL = process.env.API_BASE_URL || ' ';
    this.apiKey = process.env.API_KEY || '';
    this.cityName = '';
  }
  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    return response.json();
  }
  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any[]): Coordinates {
    if (locationData.length === 0) {
      throw new Error('No location data found');
    }
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }
  // TODO: Create buildGeocodeQuery method https://api.openweathermap.org
  private buildGeocodeQuery(): string {
    const { baseURL, apiKey, cityName } = this;
    return `${baseURL}/geo/1.0/direct?q=${cityName}&appid=${apiKey}`;
  } 

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const { baseURL, apiKey } = this;
    const { lat, lon } = coordinates;
    return `${baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`;
  }
  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    //console.log('query:', query);
    const locationData = await this.fetchLocationData(query);
    //console.log('locationData:', locationData);
    return this.destructureLocationData(locationData);
  }
  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates) {

    const query = this.buildWeatherQuery(coordinates);
    //console.log('query:', query);
    const response = await fetch(query);
    if (!response.ok) {
      throw new Error('Failed to fetch weather data');
    }
    return response.json();
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const city = response.city.name;
    const country = response.city.country;
    const description = response.list[0].weather[0].description;
    //console.log('description:', description);
    const temperature = response.list[0].main.temp;
    const feelsLike = response.list[0].main.feels_like;
    const humidity = response.list[0].main.humidity;
    const windSpeed = response.list[0].wind.speed;
    const icon = response.list[0].weather[0].icon;
    const date = response.list[0].dt_txt;

    return new Weather(city, country, description, temperature, feelsLike, humidity, windSpeed, icon, date);
}
    // TODO: Complete buildForecastArray method
    private buildForecastArray(currentWeather: Weather, weatherData: any): Weather[] {
      if (!weatherData || !weatherData.list) {
        return [];
      }
    
      const forecastArray = weatherData.list.map((weather: any) => {
        const date = weather.dt_txt;
        const description = weather.weather[0].description;
        const temperature = weather.main.temp;
        const feelsLike = weather.main.feels_like;
        const humidity = weather.main.humidity;
        const windSpeed = weather.wind.speed;
        const icon = weather.weather[0].icon;
    
        return new Weather(
          currentWeather.city,
          currentWeather.country,
          description,
          temperature,
          feelsLike,
          humidity,
          windSpeed,
          icon,
          date
        );
      });
    
      return forecastArray;
    }

 
  
  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    //console.log('coordinates:', coordinates);
    const weatherData = await this.fetchWeatherData(coordinates);
    //console.log('weatherData:', weatherData);
    const currentWeather = this.parseCurrentWeather(weatherData);
    //console.log('currentWeather:', currentWeather);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData);
    //console.log('forecastArray:', forecastArray);
    return { currentWeather, forecastArray };
  }
}

export default new WeatherService();
