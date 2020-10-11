import mongoose from 'mongoose';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const connect = async () => {
  try {
    return await mongoose.connect(process.env.MONGO_URL!, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  } catch (err) {
    throw new Error('Error on mongoose.connect: ' + err);
  }
};

export default connect;
