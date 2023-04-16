import { getGrandmas } from "../grandmas";
import { create_dummy_user, create_grandma_for_user } from "../is_utils";
import {
  IntegrationRepositories,
  repositories,
} from "../../../data/impl_integration";
import { Grandma, PrismaClient } from "@prisma/client";
import { User } from "../../generated_models";

describe("isGetGrandmas", () => {
  test("should return an array of grandmas", async () => {
    let user = await create_dummy_user("user_1")!;
    let grandma = await create_grandma_for_user("user_1");

    // Call the function with the mocked repositories
    const result = await getGrandmas(repositories, user.id);

    // Verify that the result is the expected array of grandmas
    expect(result![0]).toEqual(grandma);
    await repositories.userRepository.delete(user!.id);
    await repositories.grandmaRepository.delete(grandma!.id);
  });
});
