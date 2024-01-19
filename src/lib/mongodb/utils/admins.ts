import { CredentialsSignUpFormSchema } from '@/lib/zod/schema';
import { z } from 'zod';
import { compareSync, hashSync } from 'bcrypt-ts';
import { getUniqueAdminId } from '@/lib/server/utils';
import { ClientSession } from 'mongoose';
import { ADMIN_HASH_SALT } from '@/lib/constants';
import dbConnect from './mongoosedb';
import Admin from '../models/Admin';

type CredentialsSignUpForm = z.infer<typeof CredentialsSignUpFormSchema>;

export async function signIn(form: Record<'email' | 'password', string>) {
  await dbConnect();
  try {
    const email = form.email.trim();
    const password = form.password.trim();

    // Check if email and password are not empty.
    if (email === '' || password === '')
      throw { error: 'Fields can not be empty !' };

    // Check if email is valid.
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    if (!email.match(regEx)) throw { error: 'Email is not valid !' };

    const existingAdmin = await Admin.findOne({ email: email });

    if (!existingAdmin) {
      throw Error('Account does not exist');
    }

    if (!compareSync(password, existingAdmin.password)) {
      throw Error('Bad password!');
    }
    return {
      success: true,
      id: existingAdmin.adminId,
    };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}

export async function signUp(
  form: CredentialsSignUpForm,
  session?: ClientSession
) {
  try {
    const name = form.name.trim();
    const email = form.email.trim();
    let password = form.password.trim();
    const confirmPassword = form.confirmPassword.trim();

    // Check if name is empty;
    if (name === '') return { error: 'Name must not be empty !' };

    // Check if email is empty.
    if (email === '') return { error: 'Email must not be empty !' };

    // Check if email is valid.
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    if (!email.match(regEx)) return { error: 'Email is not valid !' };

    const existingHost = await Admin.findOne(
      {
        email,
      },
      null,
      { session }
    );

    if (existingHost) return { error: 'Email already taken!' };

    // Check if passwords are empty.
    if (password === '' || confirmPassword === '')
      return { error: 'Passwords must not be empty !' };

    // Check if password are identical.
    if (password !== confirmPassword)
      return { error: 'Passwords should be identical !' };

    // Hash the password.
    password = hashSync(password, ADMIN_HASH_SALT);

    const adminId = await getUniqueAdminId();

    const newAdmin = await Admin.create(
      [
        {
          adminId,
          name,
          email,
          password,
        },
      ],
      { session }
    );

    return { success: true, id: adminId };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}
