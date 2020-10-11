import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { NextFunction, Request, RequestHandler } from 'express';
import { err400 } from '../../../middleware/errorResponse';
import { ErrorResponse } from '../../../middleware/errorResponse';
import mongoose from 'mongoose';
import { Users } from '../../../interfaces/users';

const Controller = (injectedModel: mongoose.Model<Users>) => {
  const encrypter = async (password: string) => {
    const saltRounds = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, saltRounds);
  };

  const getToken = (idUser: string) => {
    return jwt.sign({ id: idUser }, process.env.KEYSECRET_JWT!, {
      expiresIn: process.env.EXPIRE_JWT,
    });
  };

  const getAll = async () => {
    try {
      const data = await injectedModel.find({ state: true });
      if (!data) {
        throw new Error('No data');
      }
      return data.map((user) => user.toObject());
    } catch (error) {
      throw new Error('Internal Server Error from catch');
    }
  };
  const getOne = async (id: string) => {
    try {
      const user = await injectedModel.findById(id);
      if (!user || !user.state) {
        throw new Error('No data');
      }
      return user.toObject();
    } catch (error) {
      throw new Error('Internal Server Error from catch');
    }
  };

  const saveToDB = async (req: Request, next: NextFunction) => {
    const { firstname, lastname, email, password } = req.body;

    const encryptPass = await encrypter(password);

    const user = new injectedModel({
      firstname,
      lastname,
      email,
      password: encryptPass,
    });

    try {
      const doc = await user.save();
      if (!doc) throw next(err400);
      const docObj = doc.toObject();
      return docObj;
    } catch (error) {
      throw next(error);
    }
  };

  const validatePassword = async (
    email: string,
    password: string,
    next: NextFunction
  ) => {
    try {
      const doc = await injectedModel
        .findOne({ email: email })
        .select('password');
      if (!doc) throw next(err400);
      const validacion = await bcrypt.compare(password, doc.password);

      return !validacion ? validacion : doc._id;
    } catch (error) {
      throw next(error);
    }
  };

  const findTokenTemporal = async (token: string, next: NextFunction) => {
    try {
      const doc = await injectedModel.findOne({ resetPassword: token });
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
    } catch (error) {
      throw next(error);
    }
  };

  const getTokenTemporal = async (email: string, next: NextFunction) => {
    try {
      const doc = await injectedModel
        .findOne({ email: email })
        .select('password');
      if (!doc) return { ok: false, token: '' };

      const newToken = crypto.randomBytes(20).toString('hex');
      const tokenTemporal = crypto
        .createHash('sha256')
        .update(newToken)
        .digest('hex');

      const expireTokenTemporal = Date.now() + 10 * 60 * 1000;
      await doc
        .set({
          resetPassword: tokenTemporal,
          resetPaswordExpire: expireTokenTemporal,
        })
        .save();

      return { ok: true, token: newToken };
    } catch (error) {
      throw next(error);
    }
  };

  return {
    encrypter,
    getToken,
    saveToDB,
    validatePassword,
    findTokenTemporal,
    getTokenTemporal,
    getAll,
    getOne,
  };
};

export default Controller;
