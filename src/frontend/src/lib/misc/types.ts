import type { Meal } from '@prisma/client';

interface FrontEndMealClaim {
	meal: Meal;
	mealId: number;
	count: number;
}

export type { FrontEndMealClaim };
