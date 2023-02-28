<script>
    import {cart} from "../singletons.js";

    export let meal;

    let inCart = false;
    let quantity = 0;

    $: {
        inCart = false;
        $cart.forEach((item) => {
            if (item.id === meal.id) {
                inCart = true;
                quantity = item.quantity;
            }
        });
    }

    function getItemCount(meal)
    {
        let quantity = 0;
        $cart.forEach((item) => {
            if (item.id === meal.id) {
                quantity = item.quantity;
            }
        });
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

<p class="dropdown-item is-flex is-flex-direction-row justify-between">
    <span>{meal.name}</span>
    <span>
        <a class="button is-small border-0" on:click={()=>removeFromCart(meal)}>
            <span class="icon">
                <i class="fas fa-minus"></i>
            </span>
        </a>
        <span>{meal.quantity}</span>
        <a class="button is-small border-0" on:click={()=>addToCart(meal)}>
            <span class="icon">
                <i class="fas fa-plus"></i>
            </span>
        </a>
    </span>
</p>


