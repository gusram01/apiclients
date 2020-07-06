import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import { Users } from '../interfaces/users';

const categoryUsers: { values: string[], message: string } = {
  values: ['ADMIN', 'USER'],
  message: '{VALUE} is not a valid entry'
}

const Schema = mongoose.Schema;

const userSchema = new Schema<Users>({

  create: {
    type: Date,
    default: new Date().getTime()
  },
  delete: Date,
  born: Date,
  firstname: {
    type: String,
    maxlength: [38, 'Fisrt Name max length: 38 char']
  },
  lastname: {
    type: String,
    maxlength: [50, 'Last Name max length: 50 char']
  },
  phone: [{
    type: String,
    maxlength: [10, 'Phone max length: 10 char']
  }],
  email: {
    type: String,
    match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    lowercase: true,
    unique: true,
    required: [true, 'Email is required']
  },
  category: {
    type: String,
    enum: categoryUsers,
    default: 'USER'
  },
  password: {
    type: String,
    select: false,
    required: [true, 'Password is required'],
    minlength: [6, 'Password min length: 6 char']
  },
  state: {
    type: Boolean,
    default: true
  },
  resetPassword: String,
  resetPaswordExpire: Date,

});


userSchema.set('toObject', {
  transform: function (doc, ret, options) {
    if (doc.category === 'CIENT') delete ret.category;
    delete ret.resetPassword;
    delete ret.resetPaswordExpire;
    delete ret.password;
    delete ret.state;
    return ret;
  }
});

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

export default mongoose.model<Users>('User', userSchema);