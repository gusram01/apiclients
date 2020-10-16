import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

interface minMax {
  min: number;
  max: number;
}

interface Fields {
  id: string;
  constrain: minMax;
}

interface Validator {
  [key: string]: Fields[];
}

const toValidate: Validator = {
  newUser: [
    { id: 'nick', constrain: { min: 3, max: 38 } },
    { id: 'email', constrain: { min: 6, max: 63 } },
    { id: 'password', constrain: { min: 6, max: 63 } },
  ],
  newCar: [
    { id: 'brand', constrain: { min: 3, max: 38 } },
    { id: 'model', constrain: { min: 6, max: 63 } },
    { id: 'type', constrain: { min: 6, max: 63 } },
  ],
  newClient: [
    { id: 'firstname', constrain: { min: 3, max: 38 } },
    { id: 'lastname', constrain: { min: 6, max: 63 } },
    { id: 'born', constrain: { min: 6, max: 63 } },
  ],
  login: [
    { id: 'email', constrain: { min: 6, max: 63 } },
    { id: 'password', constrain: { min: 6, max: 63 } },
  ],
};

const validateInputs = (type: string, data: any) => {
  const validator = [...toValidate[type]];
  const some = { ...data };
  let flag: boolean;
  if (validator.length !== Object.keys(some).length) {
    flag = false;
  } else {
    flag = validator.every((ele) => {
      if (!some[ele.id]) {
        return false;
      }
      return (
        some[ele.id].length >= ele.constrain.min &&
        some[ele.id].length <= ele.constrain.max
      );
    });
  }
  return flag;
};

const encrypter = async (password: string) => {
  const saltRounds = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, saltRounds);
};

const getToken = (idUser: string) => {
  return jwt.sign({ id: idUser }, process.env.KEYSECRET_JWT!, {
    expiresIn: process.env.EXPIRE_JWT,
  });
};

// const findTokenTemporal = async (token: string, next: NextFunction) => {
//   try {
//     const doc = await injectedModel.findOne({ resetPassword: token });
//     if (!doc) throw new ErrorResponse(403, 'Token expires');

//     const now = new Date(Date.now());

//     if (!doc.resetPaswordExpire) {
//       await doc.set('resetPassword', undefined).save();
//       await doc.set('resetPaswordExpire', undefined).save();
//       throw new ErrorResponse(403, 'Token expires');
//     }
//     if (doc.resetPaswordExpire < now) {
//       await doc.set('resetPassword', undefined).save();
//       await doc.set('resetPaswordExpire', undefined).save();
//       throw new ErrorResponse(403, 'Token expires');
//     }
//     return doc;
//   } catch (error) {
//     throw new ErrorResponse(500, error.message);
//   }
// };

// const getTokenTemporal = async (email: string, next: NextFunction) => {
//   try {
//     const doc = await injectedModel
//       .findOne({ email: email })
//       .select('password');
//     if (!doc) return { ok: false, token: '' };

//     const newToken = crypto.randomBytes(20).toString('hex');
//     const tokenTemporal = crypto
//       .createHash('sha256')
//       .update(newToken)
//       .digest('hex');

//     const expireTokenTemporal = Date.now() + 10 * 60 * 1000;
//     await doc
//       .set({
//         resetPassword: tokenTemporal,
//         resetPaswordExpire: expireTokenTemporal,
//       })
//       .save();

//     return { ok: true, token: newToken };
//   } catch (error) {
//     throw next(error);
//   }
// };

export { validateInputs, getToken, encrypter };
