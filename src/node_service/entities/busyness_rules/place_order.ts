import {IRepositories} from "../repository";
import {User} from "@prisma/client";
import {MealClaim, UserClaim} from "../models";

function placeOrder(repos: IRepositories, userClaim: UserClaim, meal_claims: Array<MealClaim>)
{
    let user: User;
}