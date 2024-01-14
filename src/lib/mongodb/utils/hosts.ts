import { HostSignUpFormSchema } from '@/lib/zod/schema';
import { z } from 'zod';
import Host from '../models/Host';
import { compareSync, hashSync } from 'bcrypt-ts';
import HostProfile from '../models/HostProfile';
import { Role } from '@/lib/types';
import { getUniqueHostId } from '@/lib/server/utils';
import { ClientSession } from 'mongoose';
import { HOST_HASH_SALT } from '@/lib/constants';
import dbConnect from './mongoosedb';

type HostSignUpSchema = z.infer<typeof HostSignUpFormSchema>;

export async function signIn(host: Record<'email' | 'password', string>) {
  await dbConnect();
  try {
    const email = host.email.trim();
    const password = host.password.trim();

    // Check if email and password are not empty.
    if (email === '' || password === '')
      throw { error: 'Fields can not be empty !' };

    // Check if email is valid.
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    if (!email.match(regEx)) throw { error: 'Email is not valid !' };

    const existingHost = await Host.findOne({ email: email });

    if (existingHost) {
      if (!compareSync(password, existingHost.password)) {
        throw { error: 'Bad password!' };
      }
      return {
        host: {
          id: existingHost.hostId,
          role: Role.host,
          provider: 'hostcredentials',
        },
      };
    }
    throw { error: 'Account does not exist' };
  } catch (error) {
    return { error, host: null };
  }
}

export async function signUp(host: HostSignUpSchema, session?: ClientSession) {
  try {
    const name = host.name.trim();
    const email = host.email.trim();
    let password = host.password.trim();
    const confirmPassword = host.confirmPassword.trim();

    // Check if name is empty;
    if (name === '') return { error: 'Name must not be empty !' };

    // Check if email is empty.
    if (email === '') return { error: 'Email must not be empty !' };

    // Check if email is valid.
    const regEx =
      /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    if (!email.match(regEx)) return { error: 'Email is not valid !' };

    const existingHost = await Host.findOne(
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
    password = hashSync(password, HOST_HASH_SALT);

    const hostId = await getUniqueHostId();

    const newHost = await Host.create(
      [
        {
          hostId,
          name,
          email,
          password,
        },
      ],
      { session }
    );

    // TODO: decouple into hostprofile/utils file
    const newHostProfile = await HostProfile.create(
      [
        {
          hostId,
          name,
          biography: '',
          events: [],
        },
      ],
      { session }
    );

    return { success: true, hostId };
  } catch (error) {
    console.log(error);
    return { success: false, error: error as string };
  }
}
