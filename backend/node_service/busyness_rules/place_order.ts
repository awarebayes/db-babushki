import {IRepositories} from "../../shared/entities/repository";
import {User} from "@prisma/client";
import {MealClaim, UserClaim} from "../../shared/entities/models";

function placeOrder(repos: IRepositories, userClaim: UserClaim, meal_claims: Array<MealClaim>)
{
    let user: User;
}