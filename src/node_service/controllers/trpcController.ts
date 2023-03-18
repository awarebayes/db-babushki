import {Grandma, Meal} from "@prisma/client";
import {repositories} from "../data/impl_repositories_server";
import {getGrandmas} from "../entities/busyness_rules/grandmas";
import {getMeals, getMealsForGrandma} from "../entities/busyness_rules/meals";

export const trpcController = {
    ping: async (message: string): Promise<string> => {
        return `Message: ${message}`;
    },

    getGrandmas: async (page: number): Promise<Array<Grandma> | null> => {
        return getGrandmas(repositories, page)
    },

    getMeals: async (page: number): Promise<Array<Meal> | null> => {
        return getMeals(repositories, page)
    },

    getMealsOfGrandma: async (page: number): Promise<Array<Meal> | null> => {
        return getMealsForGrandma(repositories, page)
    }
};

