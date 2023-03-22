import {Grandma, Meal, User} from "@prisma/client";
import {repositories} from "../data/impl_repositories_server";
import {getGrandmas, getGrandmaWithUsername} from "../entities/busyness_rules/grandmas";
import {getMeals, getMealsForGrandma} from "../entities/busyness_rules/meals";
import {SignUpData, UserClaim} from "../entities/models";
import {signUp, whoAmI} from "../entities/busyness_rules/users";

export const trpcController = {
    ping: async (uname: string): Promise<string> => {
        return `Your JWT username: ${uname}`
    },

    getGrandmas: async (page: number): Promise<Grandma[] | null> => {
        return getGrandmas(repositories, page)
    },

    whoAmI: async (userClaim: UserClaim): Promise<User | null> => {
        return whoAmI(repositories, userClaim)
    },

    getMeals: async (page: number): Promise<Meal[] | null> => {
        return getMeals(repositories, page)
    },

    getMealsOfGrandma: async (page: number): Promise<Meal[] | null> => {
        return getMealsForGrandma(repositories, page)
    },

    getGrandmaWithUsername: async (username: string): Promise<Grandma | null> => {
        return getGrandmaWithUsername(repositories, username)
    },

    signUp: async (signUpData: SignUpData): Promise<User | null> => {
        return signUp(repositories, signUpData)
    },
};

