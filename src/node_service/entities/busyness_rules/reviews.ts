import { Grandma, Prisma, Review, User } from "@prisma/client";
import { ReviewClaim, UserClaim } from "../models";
import { IRepositories } from "../repository";

export async function addReview(repos: IRepositories, userClaim: UserClaim, reviewClaim: ReviewClaim) {
    let maybeGrandma = await repos.grandmaRepository.getSingle(reviewClaim.grandmaId);
    if (!maybeGrandma)
        throw "Respected grandma not found!";
    let grandma: Grandma = maybeGrandma!;

    let user: User = await repos.userRepository.getByUsername(userClaim.username)! as User;
    if (grandma.username == user.username)
        throw "Grandma cannot rate herself!";
    
    let ordersForGrandma = await repos.orderRepository.getOrdersOfUserForGrandma(user.id, grandma.id);
    if (ordersForGrandma.length === 0)
        throw "User didnt order anything!";

    let reviewToCreate: Prisma.ReviewCreateInput = {
        review: reviewClaim.review,
        rating: reviewClaim.rating,
        grandma: {
            connect: {
                id: grandma.id,
            }
        },
        user: {
            connect: {
                id: user.id,
            }
        }
    };

    await repos.reviewRepository.create(reviewToCreate);
}

export async function removeReview(repos: IRepositories, userClaim: UserClaim, reviewId: number) {
    let user: User = await repos.userRepository.getByUsername(userClaim.username)! as User;

    let maybeReview = await repos.reviewRepository.getSingle(reviewId);
    if (!maybeReview)
        throw "Review was not found";
    
    let review: Review = maybeReview!;
    if (review.userId != user.id)
        throw "Trying to delete a review of different user!";

    await repos.reviewRepository.remove(reviewId);
}

export async function updateReview(repos: IRepositories, userClaim: UserClaim, reviewId: number, reviewClaim: ReviewClaim) {

    let maybeReview = await repos.reviewRepository.getSingle(reviewId);
    if (!maybeReview)
        throw "Review was not found";
    
    let user: User = await repos.userRepository.getByUsername(userClaim.username)! as User;
    let review: Review = maybeReview!;
    if (review.userId != user.id)
        throw "Trying to update a review of different user!";
    
    let reviewToUpdate: Prisma.ReviewUpdateInput = {
        review: reviewClaim.review,
        rating: reviewClaim.rating,
    };

    await repos.reviewRepository.update(reviewId, reviewToUpdate);
}

export async function getReviewsForGrandma(repos: IRepositories, username: string) {
    return await repos.reviewRepository.getForGrandma(username);
}

