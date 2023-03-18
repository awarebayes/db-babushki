import {Grandma, Meal, User} from "@prisma/client";
import {repositories} from "../data/impl_repositories_server";
import {getGrandmas, getGrandmaWithUsername} from "../entities/busyness_rules/grandmas";
import {getMeals, getMealsForGrandma} from "../entities/busyness_rules/meals";
import {UserClaim} from "../entities/models";
import {whoAmI} from "../entities/busyness_rules/users";

export const trpcController = {
    ping: async (uname: string): Promise<string> => {
        return `Your JWT username: ${uname}`
    },

    getGrandmas: async (page: number): Promise<Array<Grandma> | null> => {
        return getGrandmas(repositories, page)
    },

    whoAmI: async (userClaim: UserClaim): Promise<User | null> => {
        return whoAmI(repositories, userClaim)
    },

    getMeals: async (page: number): Promise<Array<Meal> | null> => {
        return getMeals(repositories, page)
    },

    getMealsOfGrandma: async (page: number): Promise<Array<Meal> | null> => {
        return getMealsForGrandma(repositories, page)
    },

    getGrandmaWithUsername: async (username: string): Promise<Grandma | null> => {
        return getGrandmaWithUsername(repositories, username)
    }
};

