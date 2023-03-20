import { User } from "@prisma/client";
import { mockRepositories } from "../../../data/impl_mock";
import { UserClaim } from "../../models";
import { whoAmI } from "../users";

describe('whoAmI', () => {
    it('should return user if valid claim is provided', async () => {
      const claim: UserClaim = { id: "11", username: 'testuser', expiration: 1 };
      const user: User = { id: 1, authId: "11", grannyId: null, name: "aboba", username: 'testuser'};

      mockRepositories.userRepository.getByUsername = jest.fn().mockResolvedValue(user);
  
      const result = await whoAmI(mockRepositories, claim);
  
      expect(result).toEqual(user);
      expect(mockRepositories.userRepository.getByUsername).toHaveBeenCalledWith('testuser');
    });
  
    it('should return null if invalid claim is provided', async () => {
      const username = 'testuser';
      const claim: UserClaim = { id: "11", username, expiration: 1 };
      mockRepositories.userRepository.getByUsername = jest.fn().mockResolvedValue(null);
  
      const result = await whoAmI(mockRepositories, claim);
  
      expect(result).toBeNull();
      expect(mockRepositories.userRepository.getByUsername).toHaveBeenCalledWith(username);
    });
  });
  