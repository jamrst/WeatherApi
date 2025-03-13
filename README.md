# WeatherApi

## Description
WeatherApi is a simple API server that provides weather information. It serves static files from the client distribution folder and includes middleware for parsing JSON and urlencoded form data.

## Setup Instructions
1. Clone the repository:
    ```sh
    git clone https://github.com/jamrst/WeatherApi.git
    cd WeatherApi
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your environment variables:
    ```env
    PORT=3001
    ```

4. Build the client:
    ```sh
    cd client
    npm install
    npm run build
    cd ..
    ```

5. Start the server:
    ```sh
    npm start
    ```

## Usage
- The server will start on the port specified in the `.env` file or default to port 3001.
- Access the API endpoints via `http://localhost:3001`.

## License
This project is licensed under the MIT License.
