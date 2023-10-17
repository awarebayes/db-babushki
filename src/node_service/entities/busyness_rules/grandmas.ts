import type { IRepositories } from "../repository";
import type { Grandma } from "../generated_models";
import { UpdateGrandmaClaim, UserClaim } from "../models";
import { create_grandma_for_user_full } from "./is_utils";
import { repositories } from "../../data/impl_repositories_server";
import { TRPCError } from "@trpc/server";

export async function getGrandmas(
  repos: IRepositories,
  page: number
): Promise<Grandma[] | null> {
  return repos.grandmaRepository.getPaged(page, 25);
}

export async function getGrandmaWithUsername(
  repos: IRepositories,
  username: string
): Promise<Grandma | null> {
  return repos.grandmaRepository.getWithUsername(username);
}

export async function deleteGrandma(
  repos: IRepositories,
  id: number
): Promise<void> {
  return repos.grandmaRepository.delete(id);
}

export async function createGrandma(
  repos: IRepositories,
  claim: UserClaim
): Promise<Grandma> {
  let user = await repos.userRepository.getByUsername(claim.username);
  if (!user) throw new TRPCError({
        message: "User was not found",
        code: "NOT_FOUND",
      });
  if (claim.username != user.username)
    throw new TRPCError({
        message: "User is different",
        code: "FORBIDDEN",
      });
  return create_grandma_for_user_full(repositories, user);
}

export async function createGrandmaAdmin(
  repos: IRepositories,
  userId: number
): Promise<Grandma> {
  let user = await repos.userRepository.getSingle(userId);
  if (!user) throw  new TRPCError({
        message: "User was not found",
        code: "NOT_FOUND",
      });;

  return create_grandma_for_user_full(repositories, user);
}

export async function verifyGrandma(
  repos: IRepositories,
  grandmaId: number,
  status: boolean
): Promise<void> {
  repositories.grandmaRepository.changeVerified(grandmaId, status);
}

export async function getUnverified(): Promise<Grandma[]> {
  return repositories.grandmaRepository.getUnverified();
}


export async function UpdateGrandma(repositories: IRepositories, username: string, updateClaim: UpdateGrandmaClaim): Promise<Grandma> {
  return repositories.grandmaRepository.update(username, updateClaim);
}

