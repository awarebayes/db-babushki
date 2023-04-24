import { Grandma, Order } from "@prisma/client";
import { mockRepositories } from "../../../data/impl_mock";
import { MealClaim, OrderStatusEnum, UserClaim } from "../../models";
import { cancelOrder, placeOrder, updateOrderStatusAsGrandma } from "../orders";

const repos = mockRepositories;

describe("placeOrder", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw an error if meals cannot be found", async () => {
    repos.mealRepository.getMany = jest.fn().mockResolvedValue(null);
    const userClaim = { username: "mock_user" } as UserClaim;
    const mealClaims: MealClaim[] = [{ mealId: 1, count: 2 }];
    await expect(placeOrder(repos, userClaim, mealClaims)).rejects.toEqual(
      "Cannot find meals specified!"
    );
    expect(repos.mealRepository.getMany).toHaveBeenCalledWith([1]);
  });

  it("should throw an error if meals are from different grandmas", async () => {
    repos.mealRepository.getMany = jest.fn().mockResolvedValue([
      { id: 1, grannyId: 1 },
      { id: 2, grannyId: 2 },
    ]);
    const userClaim = { username: "mock_user" } as UserClaim;
    const mealClaims = [
      { mealId: 1, count: 2 },
      { mealId: 2, count: 1 },
    ];
    await expect(placeOrder(repos, userClaim, mealClaims)).rejects.toEqual(
      "Meals from different grandmas cannot be placed in a single order"
    );
    expect(repos.mealRepository.getMany).toHaveBeenCalledWith([1, 2]);
  });

  it("should create an order successfully", async () => {
    repos.mealRepository.getMany = jest
      .fn()
      .mockResolvedValue([{ id: 1, grannyId: 1 }]);
    const userClaim = { username: "mock_user" } as UserClaim;
    const mealClaims = [{ mealId: 1, count: 2 }];
    const expectedOrder = {
      data: {
        user: {
          connect: {
            username: "mock_user",
          },
        },
        grandma: { connect: { id: 1 } },
        status: { connect: { id: OrderStatusEnum.Initialized } },
        items: { createMany: { data: [{ mealId: 1, count: 2 }] } },
      },
    };
    repos.orderRepository.create = jest.fn().mockResolvedValue(expectedOrder);
    const createdOrder = await placeOrder(repos, userClaim, mealClaims);
    expect(repos.mealRepository.getMany).toHaveBeenCalledWith([1]);
    expect(repos.orderRepository.create).toBeCalledTimes(1);
    expect(repos.orderRepository.create).toHaveBeenCalledWith(expectedOrder);
    expect(createdOrder).toEqual(expectedOrder);
  });
});

describe("cancelOrder", () => {
  it("should throw an error if order is not found", async () => {
    mockRepositories.orderRepository.getSingle = jest
      .fn()
      .mockResolvedValue(null);

    const userClaim: UserClaim = {
      username: "testuser",
      id: "123",
      expiration: 0,
      is_admin: false,
    };
    const orderId = 123;

    await expect(
      cancelOrder(mockRepositories, userClaim, orderId)
    ).rejects.toEqual("Order was not found");
    expect(mockRepositories.orderRepository.getSingle).toHaveBeenCalledWith(
      orderId
    );
  });

  it("should throw an error if user is not found", async () => {
    mockRepositories.orderRepository.getSingle = jest
      .fn()
      .mockResolvedValue({ userId: 456 });
    mockRepositories.userRepository.getByUsername = jest
      .fn()
      .mockResolvedValue(null);

    const userClaim: UserClaim = {
      username: "testuser",
      id: "123",
      expiration: 0,
      is_admin: false,
    };
    const orderId = 123;

    await expect(
      cancelOrder(mockRepositories, userClaim, orderId)
    ).rejects.toEqual("User was not found");
    expect(mockRepositories.orderRepository.getSingle).toHaveBeenCalledWith(
      orderId
    );
    expect(mockRepositories.userRepository.getByUsername).toHaveBeenCalledWith(
      userClaim.username
    );
  });

  it("should throw an error if user tries to cancel an order belonging to a different user", async () => {
    const userClaim: UserClaim = {
      username: "testuser",
      id: "123",
      expiration: 0,
      is_admin: false,
    };
    mockRepositories.orderRepository.getSingle = jest
      .fn()
      .mockResolvedValue({ userId: 456 });
    mockRepositories.userRepository.getByUsername = jest
      .fn()
      .mockResolvedValue({ id: 789 });

    const orderId = 123;

    await expect(
      cancelOrder(mockRepositories, userClaim, orderId)
    ).rejects.toEqual("Trying to cancel order of different user");
    expect(mockRepositories.orderRepository.getSingle).toHaveBeenCalledWith(
      orderId
    );
    expect(mockRepositories.userRepository.getByUsername).toHaveBeenCalledWith(
      userClaim.username
    );
  });

  it("should update order status to cancelled if all checks pass", async () => {
    mockRepositories.orderRepository.getSingle = jest
      .fn()
      .mockResolvedValue({ userId: 123, id: 456 });
    mockRepositories.userRepository.getByUsername = jest
      .fn()
      .mockResolvedValue({ id: 123 });
    const userClaim: UserClaim = {
      username: "testuser",
      id: "123",
      expiration: 0,
      is_admin: false,
    };

    const orderId = 456;

    await cancelOrder(mockRepositories, userClaim, orderId);
    expect(mockRepositories.orderRepository.getSingle).toHaveBeenCalledWith(
      orderId
    );
    expect(mockRepositories.userRepository.getByUsername).toHaveBeenCalledWith(
      userClaim.username
    );
    expect(mockRepositories.orderRepository.updateStatus).toHaveBeenCalledWith(
      456,
      OrderStatusEnum.Cancelled
    );
  });
});

describe("updateOrder", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("should throw an error if order cannot be found", async () => {
    repos.orderRepository.getSingle = jest.fn().mockResolvedValue(null);
    const userClaim: UserClaim = {
      username: "mock_user",
      id: "1",
      expiration: 0,
      is_admin: false,
    };
    await expect(
      updateOrderStatusAsGrandma(repos, userClaim, 2, OrderStatusEnum.Confirmed)
    ).rejects.toEqual("Order was not found");
    expect(repos.orderRepository.getSingle).toHaveBeenCalledWith(2);
  });

  it("should throw an error if meals are from different grandmas", async () => {
    let otherOrder: Order = {
      id: 1,
      userId: 1,
      statusId: 3,
      grandmaId: 10,
    };

    let mock_grandma: Grandma = {
      id: 1,
      username: "other_grandma",
      name: "temp",
      description: "134",
      pictureUrl: "",
      timeReply: 2,
      rating: 3,
      verified: false,
    };
    repos.orderRepository.getSingle = jest.fn().mockResolvedValue(otherOrder);
    repos.grandmaRepository.getSingle = jest
      .fn()
      .mockResolvedValue(mock_grandma);
    const userClaim: UserClaim = {
      username: "mock_grandma",
      id: "1",
      expiration: 0,
      is_admin: false,
    };
    await expect(
      updateOrderStatusAsGrandma(repos, userClaim, 1, OrderStatusEnum.Confirmed)
    ).rejects.toEqual("Order was created for other grandma");
    expect(repos.orderRepository.getSingle).toHaveBeenCalledWith(1);
    expect(repos.grandmaRepository.getSingle).toHaveBeenCalledWith(10);
  });

  it("should update order successfully", async () => {
    let otherOrder: Order = {
      id: 1,
      userId: 1,
      statusId: 3,
      grandmaId: 10,
    };

    let mock_grandma: Grandma = {
      id: 1,
      username: "mock_grandma",
      name: "temp",
      description: "134",
      pictureUrl: "",
      timeReply: 2,
      rating: 3,
      verified: false,
    };
    repos.orderRepository.getSingle = jest.fn().mockResolvedValue(otherOrder);
    repos.grandmaRepository.getSingle = jest
      .fn()
      .mockResolvedValue(mock_grandma);
    const userClaim: UserClaim = {
      username: "mock_grandma",
      id: "1",
      expiration: 0,
      is_admin: false,
    };
    await expect(
      updateOrderStatusAsGrandma(repos, userClaim, 1, OrderStatusEnum.Confirmed)
    );
    expect(repos.orderRepository.getSingle).toHaveBeenCalledWith(1);
    expect(repos.grandmaRepository.getSingle).toHaveBeenCalledWith(10);
  });
});
