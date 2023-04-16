import "../../data/impl_integration";
import { repositories } from "../../data/impl_repositories_server";
import { Grandma, User } from "../generated_models";

export async function create_dummy_user(username: string): Promise<User> {
  return (await repositories.userRepository.create({
    data: {
      authId: "1",
      username,
      name: "test user",
    },
  }))!;
}

export async function create_grandma_for_user(
  username: string
): Promise<Grandma> {
  let grandma = await repositories.grandmaRepository.create({
    data: {
      User: { connect: { username } },
      description: "test",
      name: "test user",
      pictureUrl: "test url",
      rating: 1,
      timeReply: 1,
      username,
      verified: false,
    },
  });

  return grandma!;
}
