import bcrypt from 'bcrypt';
import { ErrorResponse } from '../network/response';
import { Model } from 'mongoose';
import connect from './database';

// Database
connect()
  .then(() => console.log('DB online'))
  .catch(console.log);

export const dbMethods = (model: Model<any>) => {
  const encrypter = async (password: string) => {
    const saltRounds = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, saltRounds);
  };
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
    postOne: async (data: any) => {
      const { nick, email, password } = data;
      const encryptPass = await encrypter(password);

      try {
        const user = await model.create({
          nick,
          email,
          password: encryptPass,
        });
        if (!user) {
          throw new ErrorResponse(400, 'Bad Request');
        }
        return user.toObject();
      } catch (error) {
        throw new ErrorResponse(400, error.message);
      }
    },
    updateOne: async (id: string, data: any) => {
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
    delOne: async (id: string) => {
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
  };
};
