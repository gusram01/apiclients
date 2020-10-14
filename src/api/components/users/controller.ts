import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { Users } from '../../../interfaces/users';
import { Error } from 'mongoose';
import { ErrorResponse } from '../../../middleware/errorResponse';
import { nextTick } from 'process';
import { NextFunction } from 'express';

const Controller = (injectedModel: mongoose.Model<Users>) => {
  const encrypter = async (password: string) => {
    const saltRounds = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, saltRounds);
  };

  const getAll = async () => {
    try {
      const data = await injectedModel.find({ state: true });
      if (!data) {
        throw new ErrorResponse(400, 'No data');
      }
      return data.map((user) => user.toObject());
    } catch (error) {
      throw new ErrorResponse(400, error);
    }
  };
  const getOne = async (id: string) => {
    try {
      const user = await injectedModel.findById(id);
      if (!user || !user.state) {
        throw new ErrorResponse(400, 'Bad Request');
      }
      return user.toObject();
    } catch (error) {
      throw new ErrorResponse(400, error);
    }
  };
  const postOne = async (user: Users, next: NextFunction) => {
    const { nick, email, password } = user;
    const encryptPass = await encrypter(password);

    try {
      const user = await injectedModel.create({
        nick,
        email,
        password: encryptPass,
      });
      if (!user) {
        throw new ErrorResponse(400, 'Bad Request');
      }
      return user.toObject();
    } catch (error) {
      throw new ErrorResponse(400, error);
    }
  };

  const updateOne = async (id: string, user: Users) => {
    const { nick, firstname, lastname, phone } = user;
    try {
      const user = await injectedModel.findOneAndUpdate(
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
      throw new ErrorResponse(400, error);
    }
  };

  const delOne = async (id: string) => {
    try {
      const user = await injectedModel.findOneAndUpdate(
        { _id: id, state: true },
        {
          delete: new Date(),
          email: undefined,
          state: false,
        },
        { new: true }
      );
      if (!user) {
        throw new ErrorResponse(400, 'Bad Request');
      }
      return user.toObject();
    } catch (error) {
      throw new ErrorResponse(400, error);
    }
  };

  return {
    getAll,
    getOne,
    postOne,
    updateOne,
    delOne,
  };
};

export default Controller;
