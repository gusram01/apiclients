import mongoose, { Error } from 'mongoose';

export default class DataBase {

  static async connect() {

    try {
      return await mongoose.connect(process.env.MONGO_URL!, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      });

    } catch (err) {
      throw new Error('Error on mongoose.connect: ' + err);
    }
  }

}


