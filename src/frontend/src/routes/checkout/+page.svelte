<script lang="ts">
	import { cart, loggedInUser } from "$lib/misc/singletons";
    import Meal from "../meals/meal.svelte"

    let user = $loggedInUser;
</script>

<div class="columns is-flex is-centered min-h-screen">
    <div class="column is-half-desktop mt-7">
        <h1 class="title has-text-centered">Заказ еды!</h1>
        <h1 class="subtitle has-text-centered">Мы быстро до вас доставим!</h1>
        {#if $cart.length > 0}
            <section>
                {#each $cart as item}
                    <Meal mealClaim={item}></Meal>
                {/each}
            </section>
            <br/>
            <section class="bt-2 border-t-grey-100 border-t-2">
                <br/>
                <h1 class="title has-text-centered">Детали заказа</h1>
                <div class="is-flex is-flex-direction-column is-align-content-center">

                    <div class="field is-horizontal">
                        <div class="field-label is-normal">
                            <label class="label">На кого</label>
                        </div>
                        <div class="field-body">
                            <div class="field">
                                <p class="control is-expanded has-icons-left">
                                    <input class="input" type="text" placeholder="Name" value="{user?.name}">
                                    <span class="icon is-small is-left">
                                      <i class="fas fa-user"></i>
                                    </span>
                                </p>
                            </div>
                            <div class="field">
                                <p class="control is-expanded has-icons-left has-icons-right">
                                    <input class="input" type="email" placeholder="Email" value="email@example.com">
                                    <span class="icon is-small is-left">
                                      <i class="fas fa-envelope"></i>
                                    </span>
                                    <span class="icon is-small is-right">
                                      <i class="fas fa-check"></i>
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div class="field is-horizontal">
                        <div class="field-label">
                            <label class="label">Улица</label>
                        </div>
                        <div class="field-body">
                                <input class="input" type="text" placeholder="ул. Пушкина" value="Пушкина">
                        </div>
                    </div>

                    <div class="field is-horizontal">
                        <div class="field-label">
                            <label class="label">Дом</label>
                        </div>
                        <div class="field-body">
                            <input class="input" type="text" placeholder="Колотушкина" value="Колотушкина">
                        </div>
                    </div>


                    <div class="field is-horizontal">
                        <div class="field-label">
                            <label class="label">Квартира</label>
                        </div>
                        <div class="field-body">
                            <input class="input" type="text" placeholder="Петрова" value="Петрова">
                        </div>
                    </div>

                    <div class="field is-horizontal has-addons">
                        <div class="field-label is-normal">
                            <label class="label">Номер</label>
                        </div>
                        <div class="field-body">
                            <div class="control">
                                <input class="input" type="text" placeholder="+8-800-555-35-35" value="+8-800-555-35-35">
                            </div>
                            <div class="control">
                                <a class="button">
                                    Получить код
                                </a>
                            </div>
                        </div>
                    </div>

                    <br>

                    <div class="field is-horizontal has-text-centered">
                        <div class="field-label">
                            <!-- Left empty for spacing -->
                        </div>
                        <div class="field-body">
                            <div class="field">
                                <div class="control">
                                    <button class="button is-primary is-medium">
                                        Заказать
                                    </button>
                                </div>
                            </div>
                        </div>

                </div>
            </div>

            </section>
            {:else}
                <div class="mt-100">
                    <h1 class="title text-center">Корзина пуста :(</h1>
                </div>
        {/if}
    </div>
</div>