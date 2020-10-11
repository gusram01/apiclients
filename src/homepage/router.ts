import { Router, RequestHandler } from 'express';
import { EventEmitter } from 'events';

const myEmitter = new EventEmitter();

// First listener
myEmitter.on('event', function firstListener() {
  console.log('Helloooo! first listener');
});

console.log(myEmitter.listeners('event'));
const router = Router();

const renderIndex: RequestHandler = (req, res, next) => {
  if (req.path === '/') {
    myEmitter.emit('event', 1);
  }
  return res.render('index', {
    title: 'Home Page',
    message: 'Cool!! you are in!!',
  });
};

router.get('/', renderIndex);

export default router;
