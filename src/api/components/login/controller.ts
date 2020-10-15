import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { NextFunction } from 'express';
import mongoose from 'mongoose';
import { Users } from '../users/users.interface';
import { ErrorResponse } from '../../../network/response';

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

  const validatePassword = async (
    email: string,
    password: string,
    next: NextFunction
  ) => {
    try {
      const doc = await injectedModel
        .findOne({ email: email })
        .select('password');
      if (!doc) throw new ErrorResponse(400, 'Bad Request');
      const validacion = await bcrypt.compare(password, doc.password);

      return !validacion ? validacion : doc._id;
    } catch (error) {
      throw new ErrorResponse(400, error.message);
    }
  };

  const findTokenTemporal = async (token: string, next: NextFunction) => {
    try {
      const doc = await injectedModel.findOne({ resetPassword: token });
      if (!doc) throw new ErrorResponse(403, 'Token expires');

      const now = new Date(Date.now());

      if (!doc.resetPaswordExpire) {
        await doc.set('resetPassword', undefined).save();
        await doc.set('resetPaswordExpire', undefined).save();
        throw new ErrorResponse(403, 'Token expires');
      }
      if (doc.resetPaswordExpire < now) {
        await doc.set('resetPassword', undefined).save();
        await doc.set('resetPaswordExpire', undefined).save();
        throw new ErrorResponse(403, 'Token expires');
      }
      return doc;
    } catch (error) {
      throw new ErrorResponse(500, error.message);
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
    validatePassword,
    findTokenTemporal,
    getTokenTemporal,
  };
};

export default Controller;
