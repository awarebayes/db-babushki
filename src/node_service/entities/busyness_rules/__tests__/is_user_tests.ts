import { repositories } from "../../../data/impl_integration";
import { faker } from "@faker-js/faker";
import { signUp, SignIn } from "../users";

describe("is user tests", () => {
  jest.setTimeout(160000);

  it("user should sign up and log in successfully", async () => {
    let uname = faker.internet.userName();

    expect(
      signUp(repositories, {
        name: "JohnDoe",
        password: "jdoe1234",
        password_verification: "jdoe1234",
        username: uname,
        email: faker.internet.email(),
      })
    ).resolves.toBeTruthy();

    let user = await repositories.userRepository.getByUsername(uname);
    expect(user).toBeTruthy();
    expect(user?.username).toBe(uname);

    expect(
      SignIn(repositories, {
        username: uname,
        password: "jdoe1234",
      })
    ).resolves.toBeTruthy();

    await repositories.userRepository.delete(user!.id);
  });
});
