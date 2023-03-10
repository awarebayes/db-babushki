<script lang="ts">

    import {Meal} from "../data/models";

    export let meal: Meal;
    import { cart } from '../singletons.js';

    let inCart: boolean;
    let quantity = 0;

    $: {
        inCart = false;
        for (const item of $cart) {
            if (item.id === meal.id) {
                inCart = true;
                quantity = item.quantity;
            }
        }
    }

    function getItemCount(meal)
    {
        let quantity = 0;
        for (const item of $cart) {
            if (item.id === meal.id) {
                quantity = item.quantity;
            }
        }
        return quantity;
    }

    function addToCart(meal) {
        let quantity = getItemCount(meal);
        let updatedCart;
        if (quantity === 0) {
            updatedCart = [...$cart, { ...meal, quantity: 1 }];
        } else {
            updatedCart = $cart;
            for (let item of $cart)
            {
                if (item.id === meal.id)
                {
                    item.quantity++;
                }
            }
        }
        cart.set(updatedCart);
    }

    function removeFromCart(meal) {
        let updatedCart;
        let quantity = getItemCount(meal);
        if (quantity <= 0) {
            return;
        }
        if (quantity === 1)
        {
            updatedCart = $cart.filter((el) => {
                return el.id !== meal.id;
            });
        } else {
            updatedCart = $cart;
            for (let item of $cart)
            {
                if (item.id === meal.id)
                {
                    item.quantity--;
                }
            }
        }
        cart.set(updatedCart);
    }

</script>

<div class="box">
    <div class="columns">
        <div class="column is-two-fifths">
            <figure class="image is-256x256">
                <img src={meal.picture_url} alt="Meal photo" class="rounded">
            </figure>
        </div>
        <div class="column">
            <div class="is-flex is-justify-content-space-between">
                <span class="subtitle is-4">{meal.name}</span>
                {#if !inCart}
                    <a class="button is-small is-success" on:click={()=>addToCart(meal)}>
                        <span class="icon">
                            <i class="fas fa-shopping-basket"></i>
                        </span>
                    </a>
                {:else}
                    <span>
                        <a class="button is-small border-0" on:click={()=>removeFromCart(meal)}>
                            <span class="icon">
                                <i class="fas fa-minus"></i>
                            </span>
                        </a>
                        {quantity}
                        <a class="button is-small border-0" on:click={()=>addToCart(meal)}>
                            <span class="icon">
                                <i class="fas fa-plus"></i>
                            </span>
                        </a>
                        <span class="icon">
                            <i class="fas fa-shopping-basket"></i>
                        </span>
                    </span>
                {/if}
            </div>
            <p class="icon-text">
                <span class="icon">
                    <i class="fas fa-star text-yellow-400"></i>
                </span>
                <span>{meal.rating}/5</span>
                <span class="sep"></span>
                <span>by <a class="text-blue-900" href="/grandmas/{meal.cooked_by_username}">{meal.cooked_by}</a></span>
            </p>
            <p class="pt-2">{@html meal.description}</p>
        </div>
    </div>
</div>

<style>
    .sep {
        padding-left: 5px;
        padding-right: 5px;
    }
</style>
