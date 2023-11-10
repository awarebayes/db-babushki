import type { ReviewClaim, UserClaim } from "../models";
import { IRepositories } from "../repository";
import type {
  Grandma,
  Review,
  ReviewCreateInput,
  ReviewUpdateInput,
  User,
} from "../generated_models";
import { logger } from "../../util/logger";
import { TRPCError } from "@trpc/server";

export async function addReview(
  repos: IRepositories,
  userClaim: UserClaim,
  reviewClaim: ReviewClaim
) {
  let maybeGrandma = await repos.grandmaRepository.getSingle(
    reviewClaim.grandmaId
  );
  if (!maybeGrandma)
    throw new TRPCError({
      message: "Grandma was not found!",
      code: "NOT_FOUND",
    });
  let grandma: Grandma = maybeGrandma!;

  let user: User = (await repos.userRepository.getByUsername(
    userClaim.username
  )!) as User;
  if (grandma.username == user.username) {
    throw new TRPCError({
      message: "Grandma cannot rate herself!",
      code: "FORBIDDEN",
    });
  }

  let ordersForGrandma = await repos.orderRepository.getOrdersForGrandma(
    grandma.id
  );

  if (!ordersForGrandma || ordersForGrandma.length === 0) {
    logger.error(
      `${user.username} tried to review ${
        maybeGrandma!.username
      } but didnt actually order anything!`
    );
    throw new TRPCError({
      message: "User didnt order from this grandma!",
      code: "FORBIDDEN",
    });
  }

  let reviewToCreate: ReviewCreateInput = {
    data: {
      review: reviewClaim.review,
      rating: reviewClaim.rating,
      grandma: {
        connect: {
          id: grandma.id,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      },
    },
  };

  logger.info(`${user.username} revieved ${grandma.username}`);
  await repos.reviewRepository.create(reviewToCreate);
}

export async function removeReview(
  repos: IRepositories,
  userClaim: UserClaim,
  reviewId: number
) {
  let user: User = (await repos.userRepository.getByUsername(
    userClaim.username
  )!) as User;

  let maybeReview = await repos.reviewRepository.getSingle(reviewId);
  if (!maybeReview)
    throw new TRPCError({
      message: "Review was not posted!",
      code: "NOT_FOUND",
    });

  let review: Review = maybeReview!;
  if (review.userId != user.id) {
    logger.error(
      `${user.username} tried to delete review ${
        review!.id
      } but it was not theirs!`
    );
    throw new TRPCError({
      message: "Review was for different user!",
      code: "FORBIDDEN",
    });
  }

  await repos.reviewRepository.delete(reviewId);
}

export async function updateReview(
  repos: IRepositories,
  userClaim: UserClaim,
  reviewId: number,
  reviewClaim: ReviewClaim
) {
  let maybeReview = await repos.reviewRepository.getSingle(reviewId);
  if (!maybeReview)
    throw new TRPCError({
      message: "Review was not posted!",
      code: "NOT_FOUND",
    });

  let user: User = (await repos.userRepository.getByUsername(
    userClaim.username
  )!) as User;
  let review: Review = maybeReview!;
  if (review.userId != user.id) {
    logger.error(
      `${user.username} tried to update review ${
        review!.id
      } but it was not theirs!`
    );

    throw new TRPCError({
      message: "Trying to update a review of different user!",
      code: "FORBIDDEN",
    });
  }

  let reviewToUpdate: ReviewUpdateInput = {
    data: {
      review: reviewClaim.review,
      rating: reviewClaim.rating,
    },
    where: { id: reviewId },
  };

  await repos.reviewRepository.update(reviewToUpdate);
}

export async function getReviewsForGrandma(
  repos: IRepositories,
  username: string
) {
  return await repos.reviewRepository.getForGrandma(username);
}
