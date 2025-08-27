import { fakerPT_BR as faker } from "@faker-js/faker";
import { db } from "../../database/client.ts";
import { users } from "../../database/schema.ts";
import { hash } from "argon2";

export async function makeUser() {
  const passwordBeforeHash = faker.internet.password();

  const result = await db
    .insert(users)
    .values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash(passwordBeforeHash),
    })
    .returning();

  return { user: result[0], passwordBeforeHash };
}
