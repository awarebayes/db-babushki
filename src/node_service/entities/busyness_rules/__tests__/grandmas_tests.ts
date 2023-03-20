import { mockRepositories } from "../../../data/impl_mock";
import { getGrandmas, getGrandmaWithUsername } from "../grandmas";

describe('getGrandmas', () => {
  test('should return an array of grandmas', async () => {
    const grandmas = [{ id: 1, name: 'Grandma 1' }, { id: 2, name: 'Grandma 2' }];

    // Mock the getPaged method of the grandmaRepository
    mockRepositories.grandmaRepository.getPaged = jest.fn().mockResolvedValue(grandmas);

    // Call the function with the mocked repositories
    const result = await getGrandmas(mockRepositories, 1);

    // Verify that the result is the expected array of grandmas
    expect(result).toEqual(grandmas);
  });

  test('should return null if no grandmas are found', async () => {
    // Mock the getPaged method of the grandmaRepository to return null
    mockRepositories.grandmaRepository.getPaged = jest.fn().mockResolvedValue(null);

    // Call the function with the mocked repositories
    const result = await getGrandmas(mockRepositories, 1);

    // Verify that the result is null
    expect(result).toBeNull();
  });
});

describe('getGrandmaWithUsername', () => {
  it('returns the grandma with the given username', async () => {
    const grandma = { id: 1, username: 'granny1', name: 'Granny One' };
    mockRepositories.grandmaRepository.getWithUsername = jest.fn().mockResolvedValue(grandma);
    const result = await getGrandmaWithUsername(mockRepositories, 'granny1');
    expect(result).toEqual(grandma);
  });

  it('returns null if grandma with given username is not found', async () => {
    mockRepositories.grandmaRepository.getWithUsername = jest.fn().mockResolvedValue(null);
    const result = await getGrandmaWithUsername(mockRepositories, 'granny2');
    expect(result).toBeNull();
  });
});