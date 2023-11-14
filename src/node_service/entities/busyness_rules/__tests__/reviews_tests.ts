import { Grandma, Order, Review, User } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { mockRepositories } from "../../../data/impl_mock";
import { ReviewClaim, UserClaim } from "../../models";
import { addReview, removeReview, updateReview } from "../reviews";

const repos = mockRepositories;

describe("addReview", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  const reviewClaim: ReviewClaim = {
    grandmaId: 0,
    review: "good",
    rating: 5,
  };

  const grandma: Grandma = {
    username: "aboba",
    id: 0,
    description: "hello",
    name: "aboba",
    pictureUrl: "sgsf/asd.jpg",
    timeReply: 4,
    rating: 1,
    verified: true,
  };

  const user: User = {
    id: 0,
    name: "a",
    username: "aboba",
    grannyId: 0,
    isAdmin: false,
  };

  const userClaim: UserClaim = {
    username: "mock_user",
    is_admin: false,
  };

  it("should throw an error if grandma is not found", async () => {
    repos.grandmaRepository.getSingle = jest.fn().mockResolvedValue(null);
    await expect(addReview(repos, userClaim, reviewClaim)).rejects.toEqual(
      new TRPCError({
        message: "Grandma was not found!",
        code: "NOT_FOUND",
      })
    );
    expect(repos.grandmaRepository.getSingle).toHaveBeenCalledWith(0);
  });

  it("should throw an error if grandma rates herself", async () => {
    repos.grandmaRepository.getSingle = jest.fn().mockResolvedValue(grandma);
    repos.userRepository.getByUsername = jest.fn().mockResolvedValue(user);
    const newClaim = { ...userClaim, username: "aboba" };
    await expect(addReview(repos, newClaim, reviewClaim)).rejects.toEqual(
      new TRPCError({
        message: "Grandma cannot rate herself!",
        code: "NOT_FOUND",
      })
    );
    expect(repos.grandmaRepository.getSingle).toHaveBeenCalledWith(0);
    expect(repos.userRepository.getByUsername).toHaveBeenCalledWith("aboba");
  });

  it("should throw an error if user didnt rate anything", async () => {
    const newUser = { ...user, username: "mock_user" };
    repos.mealRepository.getMany = jest
      .fn()
      .mockResolvedValue([{ id: 1, grannyId: 1 }]);
    repos.grandmaRepository.getSingle = jest.fn().mockResolvedValue(grandma);
    repos.userRepository.getByUsername = jest.fn().mockResolvedValue(newUser);
    repos.orderRepository.getOrdersForGrandma = jest.fn().mockResolvedValue([]);
    await expect(addReview(repos, userClaim, reviewClaim)).rejects.toEqual(
      new TRPCError({
        message: "User didnt order from this grandma!",
        code: "FORBIDDEN",
      })
    );
    expect(repos.grandmaRepository.getSingle).toHaveBeenCalledWith(0);
    expect(repos.userRepository.getByUsername).toHaveBeenCalledWith(
      "mock_user"
    );
    expect(repos.orderRepository.getOrdersForGrandma).toHaveBeenCalledWith(0);
  });

  it("should succeed if everything was right", async () => {
    const newUser = { ...user, username: "mock_user" };
    repos.mealRepository.getMany = jest
      .fn()
      .mockResolvedValue([{ id: 1, grannyId: 1 }]);
    repos.grandmaRepository.getSingle = jest.fn().mockResolvedValue(grandma);
    repos.userRepository.getByUsername = jest.fn().mockResolvedValue(newUser);
    repos.orderRepository.getOrdersForGrandma = jest
      .fn()
      .mockResolvedValue([1]);
    repos.reviewRepository.create = jest.fn();
    await addReview(repos, userClaim, reviewClaim);
    expect(repos.grandmaRepository.getSingle).toHaveBeenCalledWith(0);
    expect(repos.userRepository.getByUsername).toHaveBeenCalledWith(
      "mock_user"
    );
    expect(repos.orderRepository.getOrdersForGrandma).toHaveBeenCalledWith(0);
    expect(repos.reviewRepository.create).toHaveBeenCalledTimes(1);
  });
});

describe("updateReview", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const reviewClaim: ReviewClaim = {
    grandmaId: 0,
    review: "good",
    rating: 5,
  };

  const review: Review = {
    id: 0,
    userId: 0,
    grandmaId: 0,
    rating: 5,
    review: "good",
  };

  const grandma: Grandma = {
    username: "aboba",
    id: 0,
    description: "hello",
    name: "aboba",
    pictureUrl: "sgsf/asd.jpg",
    timeReply: 4,
    rating: 1,
    verified: true,
  };

  const user: User = {
    id: 0,
    name: "a",
    username: "aboba",
    grannyId: 0,
    isAdmin: false,
  };

  const userClaim: UserClaim = {
    username: "mock_user",
    is_admin: false,
  };

  it("should throw an error if review is not found", async () => {
    repos.reviewRepository.getSingle = jest.fn().mockResolvedValue(null);
    await expect(
      updateReview(repos, userClaim, 0, reviewClaim)
    ).rejects.toEqual(
      new TRPCError({ message: "Review was not posted!", code: "NOT_FOUND" })
    );
    expect(repos.reviewRepository.getSingle).toHaveBeenCalledWith(0);
  });

  it("should throw an error if user tries to update different users review", async () => {
    const otherUsersReview = { ...review, userId: 1 };
    repos.reviewRepository.getSingle = jest
      .fn()
      .mockResolvedValue(otherUsersReview);
    repos.userRepository.getByUsername = jest.fn().mockResolvedValue(userClaim);
    await expect(
      updateReview(repos, userClaim, 0, reviewClaim)
    ).rejects.toEqual(
      new TRPCError({
        message: "Trying to update a review of different user!",
        code: "FORBIDDEN",
      })
    );
    expect(repos.reviewRepository.getSingle).toHaveBeenCalledWith(0);
    expect(repos.userRepository.getByUsername).toHaveBeenCalledWith(
      "mock_user"
    );
  });

  it("should succeed if everything was right", async () => {
    repos.reviewRepository.getSingle = jest.fn().mockResolvedValue(review);
    repos.userRepository.getByUsername = jest.fn().mockResolvedValue(user);
    repos.reviewRepository.update = jest.fn();
    await updateReview(repos, userClaim, 0, reviewClaim);
    expect(repos.reviewRepository.getSingle).toHaveBeenCalledWith(0);
    expect(repos.userRepository.getByUsername).toHaveBeenCalledWith(
      "mock_user"
    );
    expect(repos.reviewRepository.update).toHaveBeenCalledTimes(1);
  });
});

describe("deleteReview", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  const reviewClaim: ReviewClaim = {
    grandmaId: 0,
    review: "good",
    rating: 5,
  };

  const review: Review = {
    id: 0,
    userId: 0,
    grandmaId: 0,
    rating: 5,
    review: "good",
  };

  const grandma: Grandma = {
    username: "aboba",
    id: 0,
    description: "hello",
    name: "aboba",
    pictureUrl: "sgsf/asd.jpg",
    timeReply: 4,
    rating: 1,
    verified: true,
  };

  const user: User = {
    id: 0,
    name: "a",
    username: "aboba",
    grannyId: 0,
    isAdmin: false,
  };

  const userClaim: UserClaim = {
    username: "mock_user",
    is_admin: false,
  };

  it("should throw an error if review is not found", async () => {
    repos.reviewRepository.getSingle = jest.fn().mockResolvedValue(null);
    await expect(removeReview(repos, userClaim, 0)).rejects.toEqual(
      new TRPCError({ message: "Review was not posted!", code: "NOT_FOUND" })
    );
    expect(repos.reviewRepository.getSingle).toHaveBeenCalledWith(0);
  });

  it("should throw an error if user tries to delete different users review", async () => {
    const otherUsersReview = { ...review, userId: 1 };
    repos.reviewRepository.getSingle = jest
      .fn()
      .mockResolvedValue(otherUsersReview);
    repos.userRepository.getByUsername = jest.fn().mockResolvedValue(user);
    await expect(removeReview(repos, userClaim, 0)).rejects.toEqual(
      new TRPCError({
        message: "Review was for different user!",
        code: "FORBIDDEN",
      })
    );
    expect(repos.reviewRepository.getSingle).toHaveBeenCalledWith(0);
    expect(repos.userRepository.getByUsername).toHaveBeenCalledWith(
      "mock_user"
    );
  });

  it("should succeed if everything was right", async () => {
    repos.reviewRepository.getSingle = jest.fn().mockResolvedValue(review);
    repos.userRepository.getByUsername = jest.fn().mockResolvedValue(user);
    repos.reviewRepository.delete = jest.fn();
    await removeReview(repos, userClaim, 0);
    expect(repos.reviewRepository.getSingle).toHaveBeenCalledWith(0);
    expect(repos.userRepository.getByUsername).toHaveBeenCalledWith(
      "mock_user"
    );
    expect(repos.reviewRepository.delete).toHaveBeenCalledTimes(1);
  });
});
