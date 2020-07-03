import { Person } from '../../interfaces/persons.interface';
import { personSchema } from '../../models/persons.model';
import { ErrorResponse } from '../../classes/errors/errorResponse';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import slugify from 'slugify';


personSchema.pre<Person>('save', async function (next: mongoose.HookNextFunction) {

  if (this.category === 'CLIENT') {
    if (!this.state) {
      this.emailstatefalse = this.email;
      this.email = undefined;
    }
    return next();
  };

  if (!this.isModified('password')) next();

  if (this.password.length < 6) {
    return new ErrorResponse(400,
      `Password con longitud mínima de 6 caracteres`);
  };

  this.slug = slugify(`${this.nombre} ${this.apellidos}`);

  const saltRounds = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, saltRounds);

  return next();

});

personSchema
  .methods
  .validateSign = async function (passLogin: string) {

    return await bcrypt.compare(passLogin, this.password);
  };

personSchema
  .methods
  .getSignJWT = function () {

    return jwt.sign({ id: this._id },
      process.env.KEYSECRET_JSONWEBT!,
      { expiresIn: process.env.EXPIN_JSONWEBT });
  };

personSchema
  .methods
  .getTokenTemporal = async function () {

    const resetToken = crypto.randomBytes(20).toString('hex');

    const resetPassword = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetPaswordExpire = Date.now() + 10 * 60 * 1000;

    await this.set({
      resetPassword: resetPassword,
      resetPaswordExpire: resetPaswordExpire
    }).save();

    return resetToken;
  };


personSchema.set('toObject', {
  transform: function (doc, ret, options) {
    if (doc.category === 'CIENT') delete ret.category;
    delete ret.resetPassword;
    delete ret.resetPaswordExpire;
    delete ret.password;
    delete ret.state;
    delete ret.slug;
    return ret;
  }
});

export default mongoose.model<Person>('Persons', personSchema);
