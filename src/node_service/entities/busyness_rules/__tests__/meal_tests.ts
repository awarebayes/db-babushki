import { mockRepositories } from "../../../data/impl_mock";
import { getMeals, getMealsForGrandma } from "../meals";
describe("getMeals", () => {
    it("should return an array of meals when page is valid", async () => {
      const mockMeals = [{ id: 1, name: "Spaghetti" }, { id: 2, name: "Pizza" }];
      mockRepositories.mealRepository.getPaged = jest.fn().mockResolvedValue(mockMeals);
      const meals = await getMeals(mockRepositories, 1);
      expect(meals).toEqual(mockMeals);
      expect(mockRepositories.mealRepository.getPaged).toHaveBeenCalledWith(1, 25);
    });
  
    it("should return null when page is invalid", async () => {
      mockRepositories.mealRepository.getPaged = jest.fn().mockResolvedValue(null);
      const meals = await getMeals(mockRepositories, -1);
      expect(meals).toBeNull();
      expect(mockRepositories.mealRepository.getPaged).toHaveBeenCalledWith(-1, 25);
    });
});
  

describe('getMealsForGrandma function', () => {
    it('should return an array of meals', async () => {
      const mockedMeals = [{id: 1, name: 'Pizza'}, {id: 2, name: 'Burger'}];
      mockRepositories.mealRepository.getMealsOfGrandma = jest.fn().mockResolvedValue(mockedMeals);
  
      const result = await getMealsForGrandma(mockRepositories, 1);
  
      expect(mockRepositories.mealRepository.getMealsOfGrandma).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockedMeals);
    });
  
    it('should return null if no meals found', async () => {
      mockRepositories.mealRepository.getMealsOfGrandma = jest.fn().mockResolvedValue(null);
  
      const result = await getMealsForGrandma(mockRepositories, 1);
  
      expect(mockRepositories.mealRepository.getMealsOfGrandma).toHaveBeenCalledWith(1);
      expect(result).toBeNull();
    });
  });
