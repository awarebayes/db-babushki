import { getGrandmaWithUsername, getGrandmas } from "../grandmas";
import { create_dummy_user, create_grandma_for_user } from "../is_utils";
import { repositories } from "../../../data/impl_integration";

describe("isGetGrandmas", () => {
  jest.setTimeout(160000);
  test("should get grandma by username", async () => {
    let user = await create_dummy_user(repositories)!;
    let grandma = await create_grandma_for_user(repositories, user.username);

    // Call the function with the mocked repositories
    const result = (await getGrandmaWithUsername(
      repositories,
      grandma.username
    ))!;

    // Verify that the result is the expected array of grandmas
    expect(result).toEqual(grandma);
    await repositories.userRepository.delete(user!.id);
    await repositories.grandmaRepository.delete(grandma!.id);
  });

  test("returns null if grandma with given username is not found", async () => {
    let user = await create_dummy_user(repositories)!;
    const result = await getGrandmaWithUsername(repositories, "granny2");
    expect(result).toBeNull();
    await repositories.userRepository.delete(user!.id);
  });
});
