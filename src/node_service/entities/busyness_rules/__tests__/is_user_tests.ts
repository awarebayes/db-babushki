import { repositories } from "../../../data/impl_integration";
import { signUp, SignIn } from "../users";

describe("is user tests", () => {
  it("user should sign up and log in successfully", async () => {
    expect(
      signUp(repositories, {
        name: "JohnDoe",
        password: "jdoe1234",
        password_verification: "jdoe1234",
        username: "jdoe",
        email: "johndoe@gmail.com",
      })
    ).resolves.toBeTruthy();

    let user = await repositories.userRepository.getByUsername("jdoe");
    expect(user).toBeTruthy();
    expect(user?.username).toBe("jdoe");

    expect(
      SignIn(repositories, {
        username: "jdoe",
        password: "jdoe1234",
      })
    ).resolves.toBeTruthy();

    await repositories.userRepository.delete(user!.id);
  });
});
