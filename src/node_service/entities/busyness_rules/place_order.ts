import {IRepositories} from "../repository";
import {OrderItem, Prisma, User} from "@prisma/client";
import {MealClaim, UserClaim} from "../models";

function placeOrder(repos: IRepositories, userClaim: UserClaim, mealClaims: Array<MealClaim>)
{
    let username = userClaim.username;
    let items: Array<OrderItem> = [];

    for (const c of mealClaims)
    {
        
    }
}