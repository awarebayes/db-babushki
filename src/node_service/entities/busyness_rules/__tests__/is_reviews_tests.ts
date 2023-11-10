import { repositories } from "../../../data/impl_integration";
import {
  MealClaim,
  OrderStatusEnum,
  ReviewClaim,
  UserClaim,
} from "../../models";
import {
  create_dummy_user,
  create_grandma_for_user,
  create_meal_for_grandma,
} from "../is_utils";
import { cancelOrder, placeOrder } from "../orders";
import { addReview, getReviewsForGrandma, updateReview } from "../reviews";

describe("isGetReviews", () => {
  it("should return an array of meals when page is valid", async () => {
    let user = await create_dummy_user(repositories)!;
    expect(user).toBeTruthy();

    let grandma_user = await create_dummy_user(repositories)!;
    let grandma = await create_grandma_for_user(
      repositories,
      grandma_user.username
    );

    let meal = await create_meal_for_grandma(repositories, grandma.username);

    let user_claim: UserClaim = {
      username: user.username,
      is_admin: false,
    };

    let meal_claim: MealClaim = {
      mealId: meal.id,
      count: 2,
    };

    let order = (await placeOrder(repositories, user_claim, [meal_claim]))!;
    expect(order).toBeTruthy();

    await repositories.orderRepository.updateStatus(
      order.id,
      OrderStatusEnum.Completed
    );

    let review: ReviewClaim = {
      grandmaId: grandma.id,
      review: "Test test test",
      rating: 5,
    };

    await addReview(repositories, user_claim, review);

    let reviews_for_grandma = (await getReviewsForGrandma(
      repositories,
      grandma.username
    ))!;
    expect(reviews_for_grandma.length).toBe(1);

    let reviewFirst = reviews_for_grandma[0];
    expect(reviewFirst.review).toBe(review.review);

    let updated_review: ReviewClaim = {
      grandmaId: grandma.id,
      review: "Something else",
      rating: 2,
    };

    await updateReview(
      repositories,
      user_claim,
      reviewFirst.id,
      updated_review
    );

    let rev_first = (await repositories.reviewRepository.getSingle(
      reviewFirst.id
    ))!;
    expect(rev_first.review).toBe(updated_review.review);

    let orders_expanded = await repositories.orderRepository.getOrdersOfUser(
      order!.userId
    )!;
    for (let order of orders_expanded) {
      for (let item of order.items) {
        await repositories.orderItemsRepository.delete(item.id);
      }
    }

    await repositories.reviewRepository.delete(rev_first.id);
    await repositories.orderRepository.delete(order!.id);
    await repositories.mealRepository.delete(meal.id);
    await repositories.grandmaRepository.delete(grandma.id);
    await repositories.userRepository.delete(user.id);
  });
});
