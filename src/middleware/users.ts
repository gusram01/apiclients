import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { NextFunction, Request } from 'express';
import { err400 } from '../middleware/errorResponse';
import User from '../models/users';
import Mailer from './mailjet';
import { ErrorResponse } from './errorResponse';


export default class UserMiddleware {

  static async encrypter(password: string) {
    const saltRounds = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, saltRounds);
  }


  static getToken(idUser: string) {
    return jwt.sign({ id: idUser },
      process.env.KEYSECRET_JWT!,
      { expiresIn: process.env.EXPIRE_JWT });
  }

  static async saveToDB(req: Request, next: NextFunction) {

    const { firstname, lastname, email, password } = req.body;

    const encryptPass = await this.encrypter(password);

    const user = new User({
      firstname,
      lastname,
      email,
      password: encryptPass
    });

    try {
      const doc = await user.save();
      if (!doc) throw next(err400)
      const docObj = doc.toObject();
      return docObj;

    } catch (error) { throw next(error) };

  }


  static async validatePassword(email: string, password: string, next: NextFunction) {
    try {
      const doc = await User.findOne({ email: email }).select('password');
      if (!doc) throw next(err400);
      const validacion = await bcrypt.compare(password, doc.password);

      return (!validacion) ? validacion : doc._id;

    } catch (error) { throw next(error) }

  }

  static async findTokenTemporal(token: string, next: NextFunction) {

    try {
      const doc = await User.findOne({ resetPassword: token });
      if (!doc) throw next(new ErrorResponse(403, 'The request expires'));

      const now = new Date(Date.now());

      if (!doc.resetPaswordExpire) {
        await doc.set('resetPassword', undefined).save();
        await doc.set('resetPaswordExpire', undefined).save();
        throw next(new ErrorResponse(403, 'Token expires'));
      }
      if (doc.resetPaswordExpire < now) {
        await doc.set('resetPassword', undefined).save();
        await doc.set('resetPaswordExpire', undefined).save();
        throw next(new ErrorResponse(403, 'Token expires'));
      }
      return doc;

    } catch (error) { throw next(error) }

  }


  static async getTokenTemporal(email: string, next: NextFunction) {
    try {
      const doc = await User.findOne({ email: email }).select('password');
      if (!doc) throw next(err400);

      const newToken = crypto.randomBytes(20).toString('hex');
      const tokenTemporal = crypto.createHash('sha256')
        .update(newToken).digest('hex');

      const expireTokenTemporal = Date.now() + 10 * 60 * 1000;
      await doc.set({
        resetPassword: tokenTemporal,
        resetPaswordExpire: expireTokenTemporal
      }).save();

      const request = Mailer.sendEmail(email, tokenTemporal);

      request.then((result: Request) => {
        console.log(result.body)
        return newToken;
      })
        .catch(console.log);



    } catch (error) { throw next(error) }

  }

}

