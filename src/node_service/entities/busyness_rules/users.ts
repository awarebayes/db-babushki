import { IRepositories } from "../repository";
import { UserClaim, SignUpData, LogInData } from "../models";
import { User, UserCreateInput } from "../generated_models";
import { createHash, randomBytes } from "crypto"
import { signJwt } from "../../util/jwt_utils";


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
    throw "Passwords do not match"

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
      passwordHash,
      passwordSalt,
    },
  };

  let createdUser = await repos.userRepository.create(userToCreate);
  return createdUser;
}


export async function SignIn(
  repos: IRepositories,
  logInData: LogInData
): Promise<string> {

  let user = await repos.userRepository.getByUsername(logInData.username)
  if (!user)
    throw "User not found"

  const calculatedHash = createHash("sha256")
    .update(logInData.password)
    .update(createHash("sha256").update(user.passwordSalt, "utf8").digest("hex"))
    .digest("hex")

  if (calculatedHash != user.passwordHash)
    throw "bad user access"

  let claim: UserClaim = {
    is_admin: user.isAdmin,
    username: user.username
  }
  
  return signJwt(claim);
}
