import { Response, Request, Router, NextFunction } from 'express';
import { ErrorResponse } from '../errors/errorResponse';
import Persons from '../../middleware/persons/persons.midd';

class RoutesSignup {

  router: Router;

  constructor() {
    this.router = Router();
    this.routesSignup();
  }

  private async newPerson(
    req: Request,
    res: Response,
    next: NextFunction) {

    const newPerson = new Persons({
      nombre: req.body.nombre,
      apellidos: req.body.apellidos,
      email: req.body.email,
      password: req.body.password,
      telefono: req.body.telefono,
      category: req.body.category
    });
    try {
      const doc = await newPerson.save();
      const docObj = doc.toObject();
      return res.status(201).json({ ok: true, data: docObj });

    } catch (error) {
      next(error);
    }

  }

  private async forgotPass(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | NextFunction> {

    const person = await Persons.findOne({ email: req.body.email });
    if (!person) {
      next(new ErrorResponse(404,
        `The email ${req.body.email} was not found`));

    }

    if (person!.category === 'CLIENT') {
      next(new ErrorResponse(404,
        `The email ${req.body.email} was not found`));

    }

    person!.getTokenTemporal();

    const data = person!.toObject();

    return res.status(200).json({
      ok: true,
      message: 'Please verify your mailbox',
      data
    });

  }

  private routesSignup() {
    this.router.post('/new', this.newPerson);
    this.router.post('/forgotpass', this.forgotPass);
  }

}

const Signup = new RoutesSignup();

export default Signup.router;