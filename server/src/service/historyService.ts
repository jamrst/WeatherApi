import { promises as fs } from 'fs';
import { v4 as uuidv4 } from 'uuid';

// TODO: Define a City class with name and id properties
class City {
 constructor(public name: string, public id: string) {
    this.name = name;
    this.id = id;
 }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try {
      const data = await fs.readFile('searchHistory.json', 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        await this.write([]); // Create the file if it doesn't exist
        return [];
      } else {
        throw error;
      }
    }
  }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  
  private async write(cities: City[]) {
    await fs.writeFile('searchHistory.json', JSON.stringify(cities, null, 2));
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read();
    console.log('cities:', cities);
    return cities;
  }
  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    console.log('addCitycity:', city);
    const cities = await this.getCities();
   //console.log('cities:', cities);
    const newCity = new City(city, uuidv4());
    cities.push(newCity);
    await this.write(cities);
    return newCity;
  }
  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.getCities();
    const index: number = cities.findIndex((city: City) => city.id === id);
    if (index === -1) {
      return;
    }
    cities.splice(index, 1);
    await this.write(cities);
  }
}

export default new HistoryService();
