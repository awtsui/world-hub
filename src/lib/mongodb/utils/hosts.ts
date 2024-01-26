import { CredentialsSignUpFormSchema } from '@/lib/zod/schema';
import { z } from 'zod';
import Host from '../models/Host';
import { compareSync, hashSync } from 'bcrypt-ts';
import HostProfile from '../models/HostProfile';
import { generateUUID } from '@/lib/server/utils';
import { ClientSession } from 'mongoose';
import { HOST_HASH_SALT } from '@/lib/constants';
import dbConnect from './mongoosedb';
import { HostApprovalStatus } from '@/lib/types';

type CredentialsSignUpForm = z.infer<typeof CredentialsSignUpFormSchema>;

export async function signIn(form: Record<'email' | 'password', string>) {
  await dbConnect();
  try {
    const email = form.email.trim();
    const password = form.password.trim();

    // Check if email and password are not empty.
    if (email === '' || password === '') throw { error: 'Fields can not be empty !' };

    // Check if email is valid.
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    if (!email.match(regEx)) throw { error: 'Email is not valid !' };

    const existingHost = await Host.findOne({ email: email });

    if (!existingHost) {
      throw Error('Account does not exist');
    }

    // TODO: Refactor - currently sneaking in host id into error string to send user into status awaiting page
    if (existingHost.approvalStatus !== HostApprovalStatus.Approved) {
      throw Error(`Account has not been approved,${existingHost.hostId}`);
    }

    if (!compareSync(password, existingHost.password)) {
      throw Error('Bad password!');
    }
    return {
      success: true,
      id: existingHost.hostId,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function signUp(form: CredentialsSignUpForm, session?: ClientSession) {
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
    const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;

    if (!email.match(regEx)) return { error: 'Email is not valid !' };

    const existingHost = await Host.findOne(
      {
        email,
      },
      null,
      { session },
    );

    if (existingHost) return { error: 'Email already taken!' };

    // Check if passwords are empty.
    if (password === '' || confirmPassword === '') return { error: 'Passwords must not be empty !' };

    // Check if password are identical.
    if (password !== confirmPassword) return { error: 'Passwords should be identical !' };

    // Hash the password.
    password = hashSync(password, HOST_HASH_SALT);

    const hostId = generateUUID();

    const newHost = await Host.create(
      [
        {
          hostId,
          name,
          email,
          password,
          approvalStatus: HostApprovalStatus.Pending,
        },
      ],
      { session },
    );

    // TODO: decouple into hostprofile/utils file
    const newHostProfile = await HostProfile.create(
      [
        {
          hostId,
          name,
          biography: '',
          mediaId: '',
          events: [],
        },
      ],
      { session },
    );

    return { success: true, id: hostId };
  } catch (error) {
    return { success: false, error: JSON.stringify(error) };
  }
}
