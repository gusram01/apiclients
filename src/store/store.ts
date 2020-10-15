import bcrypt from 'bcrypt';
// import crypto from 'crypto';
import { Model } from 'mongoose';
import connect from './database';
import { ErrorResponse } from '../utils/ErrorResponse';
import { validateInputs, encrypter, getToken } from './utilities';

// Database
connect()
  .then(() => console.log('DB online'))
  .catch(console.log);

export const dbMethods = (model: Model<any>) => {
  return {
    getAll: async () => {
      try {
        const data = await model.find({ state: true });
        if (!data) {
          throw new ErrorResponse(400, 'No data');
        }
        return data.map((user) => user.toObject());
      } catch (error) {
        throw new ErrorResponse(400, error.message);
      }
    },
    getOne: async (id: string) => {
      try {
        const user = await model.findById(id);
        if (!user || !user.state) {
          throw new ErrorResponse(400, 'Bad Request');
        }
        return user.toObject();
      } catch (error) {
        throw new ErrorResponse(400, error.message);
      }
    },
    newUser: async (data: any) => {
      if (!validateInputs('newUser', data)) {
        throw new ErrorResponse(400, 'Please verify the request');
      }

      try {
        const user = await model.create({
          nick: data.nick,
          email: data.email,
          password: await encrypter(data.password),
        });
        if (!user) {
          throw new ErrorResponse(400, 'Bad Request');
        }
        return user.toObject();
      } catch (error) {
        throw new ErrorResponse(400, error.message);
      }
    },
    updateUser: async (id: string, data: any) => {
      const { nick, firstname, lastname, phone } = data;
      try {
        const user = await model.findOneAndUpdate(
          { _id: id, state: true },
          {
            nick,
            firstname,
            lastname,
            phone,
          },
          { new: true }
        );
        if (!user) {
          throw new ErrorResponse(400, 'Bad Request');
        }
        return user.toObject();
      } catch (error) {
        throw new ErrorResponse(400, error.message);
      }
    },
    delUser: async (id: string) => {
      try {
        const user = await model.findById(id);
        if (!user || !user.state) {
          throw new ErrorResponse(400, 'User not found');
        }
        await user.set('nick', user.email).save();
        await user.set('state', false).save();
        await user.set('email', `${user._id}@erased.com`).save();
        await user.set('delete', new Date()).save();
        return user.toObject();
      } catch (error) {
        throw new ErrorResponse(400, error.message);
      }
    },
    login: async (data: any) => {
      if (!validateInputs('login', data)) {
        throw new ErrorResponse(400, 'Incorrect login/password');
      }
      try {
        const doc = await model
          .findOne({ email: data.email })
          .select('password');
        if (!doc) {
          throw new ErrorResponse(400, 'Incorrect login/password');
        }
        const validacion = await bcrypt.compare(data.password, doc.password);
        if (!validacion) {
          throw new ErrorResponse(400, 'Incorrect login/password');
        }
        return { token: getToken(doc._id), id: doc._id };
      } catch (error) {
        throw new ErrorResponse(400, error.message);
      }
    },
    findId: async (id: string) => {
      try {
        const user = await model.findOne(
          { _id: id, state: true },
          '_id category nick email'
        );
        if (!user) {
          throw new ErrorResponse(401, 'Acces denied');
        }
        return user;
      } catch (error) {
        throw new ErrorResponse(401, error.message);
      }
    },
  };
};
