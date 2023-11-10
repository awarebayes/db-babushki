import { User } from "@prisma/client";
import { mockRepositories } from "../../../data/impl_mock";
import { UserClaim } from "../../models";
import { whoAmI } from "../users";

describe("whoAmI", () => {
  it("should return user if valid claim is provided", async () => {
    const claim: UserClaim = {
      username: "testuser",
      is_admin: false,
    };
    const user: User = {
      id: 1,
      grannyId: null,
      name: "aboba",
      username: "testuser",
      isAdmin: false,
    };

    mockRepositories.userRepository.getByUsername = jest
      .fn()
      .mockResolvedValue(user);

    const result = await whoAmI(mockRepositories, claim);

    expect(result).toEqual(user);
    expect(mockRepositories.userRepository.getByUsername).toHaveBeenCalledWith(
      "testuser"
    );
  });

  it("should return null if invalid claim is provided", async () => {
    const username = "testuser";
    const claim: UserClaim = {
      username,
      is_admin: false,
    };
    mockRepositories.userRepository.getByUsername = jest
      .fn()
      .mockResolvedValue(null);

    const result = await whoAmI(mockRepositories, claim);

    expect(result).toBeNull();
    expect(mockRepositories.userRepository.getByUsername).toHaveBeenCalledWith(
      username
    );
  });
});
