import { faker } from '@faker-js/faker';

export function generateUser(otp) {
  return {
    userName: faker.internet.userName(),
    password: otp?.password ?? faker.internet.password(32, false, /[a-zA-Z0-9!@#$%^&*]/)
  }
}
