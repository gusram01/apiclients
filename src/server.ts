if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
import App from './app';


const server = App.init(3000);

server.start();



