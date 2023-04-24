<script lang="ts">
	import { Button, ButtonGroup, Card } from "flowbite-svelte";
	import type { Meal } from "../../../../node_service/entities/generated_models";
    export let meal: Meal;
</script>

<section>
    <Card img={meal.pictureUrl}>
        <h1 class="text-center text-2xl text-gray-700">
            {meal.name}
        </h1> 
        <p class="mt-2">
            {meal.description}
        </p>
        <div class="text-center mt-2">
            <ButtonGroup>
                <Button color="yellow">Изменить</Button>
                <Button color="red">Удалить</Button>
            </ButtonGroup>
        </div>
    </Card>
</section>