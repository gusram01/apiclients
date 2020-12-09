import bcrypt from 'bcrypt';
import { Request } from 'express';
import { ExtendedProtocol } from '../../store/database';
import { ErrorResponse } from '../../utils/ErrorResponse';
import { encrypter, getToken } from '../../utils/utilities';
import { transporter } from '../../mailer/mail';

const Controller = (db: ExtendedProtocol) => {
  const roles = async (req: Request) => {
    try {
      const rows = await db.find('roles', { active: true }, [
        '_id',
        'description',
      ]);
      if (!rows) {
        throw new ErrorResponse(404, 'Data not found');
      }
      return rows;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 400, e.message);
    }
  };

  const login = async (req: Request) => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ErrorResponse(400, 'Please send email and password');
    }

    try {
      const rows = await db.find('users', { active: true, email }, [
        '_id',
        'email',
        'roles_id',
        'password',
      ]);
      if (!rows || rows.length === 0) {
        throw new ErrorResponse(400, 'Incorrect email/password');
      }

      const correctPass = await bcrypt.compare(password, rows[0].password);
      if (!correctPass) {
        throw new ErrorResponse(400, 'Incorrect email/password');
      }

      return {
        token: getToken(
          rows[0]._id!,
          rows[0].email!,
          rows[0].roles_id!.toString()
        ),
        id: rows[0]._id,
      };
    } catch (error) {
      throw new ErrorResponse(error.statusCode || 400, error.message);
    }
  };

  const signup = async (req: Request) => {
    const { _id, password, valid, active, ...user } = req.body;
    const newUser = {
      ...user,
      password: await encrypter(password),
      roles_id: 1,
    };
    try {
      const row = await db.create('users', newUser, [
        '_id',
        'roles_id',
        'email',
      ]);
      if (!row) {
        throw new ErrorResponse(400, 'Please send the correct info');
      }

      return {
        token: getToken(row._id!, row.email!, row.roles_id!.toString()),
        id: row._id,
      };
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const forgot = async (req: Request) => {
    const { email } = req.body;
    try {
      const info = await transporter.sendMail({
        from: '"admin" <gram.io.dev@gmail.com>',
        to: email,
        subject: 'Forgot password for MyClient-App',
        text: 'Hello, this is a mail because the password is missing...',
        html: `<h1>Forgot pass</h1>
           <p> The new pass is: 9083145jhnegr9877341587(/) </p>`,
      });
      return info;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  const isValid = async (req: Request) => {
    const item = req.params as { key: string; value: string };
    console.log(item);
    try {
      const flag = await db.isValid(item);
      if (!flag) {
        return true;
      }
      return false;
    } catch (e) {
      throw new ErrorResponse(e.statusCode || 500, e.message);
    }
  };

  return {
    roles,
    isValid,
    login,
    signup,
    forgot,
  };
};

export default Controller;
