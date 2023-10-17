import { IRepositories } from "../repository";
import { UserClaim, SignUpData, LogInData } from "../models";
import { User, UserCreateInput } from "../generated_models";
import { createHash, randomBytes } from "crypto"
import { signJwt } from "../../util/jwt_utils";
import { TRPCError } from "@trpc/server";


export async function whoAmI(
  repos: IRepositories,
  claim: UserClaim
): Promise<User | null> {
  return repos.userRepository.getByUsername(claim.username);
}

export async function signUp(
  repos: IRepositories,
  signUpData: SignUpData
): Promise<User | null> {
  if (signUpData.password != signUpData.password_verification)
    throw new TRPCError({
        message: "Bad passwords dont match!",
        code: "BAD_REQUEST",
      });

  let passwordSalt = randomBytes(16).toString()
  let password = signUpData.password;


  const passwordHash = createHash("sha256")
    .update(password)
    .update(createHash("sha256").update(passwordSalt, "utf8").digest("hex"))
    .digest("hex")

  let userToCreate: UserCreateInput = {
    data: {
      username: signUpData.username,
      name: signUpData.name,
      isAdmin: false,
      AuthRecord: {
        create: {
          username: signUpData.username,
          passwordHash,
          passwordSalt,
        }
      }
    },
  };

  let createdUser = await repos.userRepository.create(userToCreate);
  return createdUser;
}


export async function SignIn(
  repos: IRepositories,
  logInData: LogInData
): Promise<string> {

  let authRecord = await repos.authRecordRepository.getByUsername(logInData.username);
  if (!authRecord)
    throw new TRPCError({
        message: "Credentials not found in database",
        code: "NOT_FOUND",
      });

  const calculatedHash = createHash("sha256")
    .update(logInData.password)
    .update(createHash("sha256").update(authRecord.passwordSalt, "utf8").digest("hex"))
    .digest("hex")

  if (calculatedHash != authRecord.passwordHash)
    throw new TRPCError({
        message: "Password is wrong!",
        code: "BAD_REQUEST",
      });


  let user = await repos.userRepository.getByUsername(logInData.username);
  if (!user)
    throw new TRPCError({
        message: "User was not found!",
        code: "NOT_FOUND",
      });

  let claim: UserClaim = {
    is_admin: user.isAdmin,
    username: user.username
  }
  
  return signJwt(claim);
}
