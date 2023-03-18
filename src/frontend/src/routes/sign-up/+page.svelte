<script lang="ts">
	import { authRepository } from "$lib/misc/impl_pocketbase_browser";

    let name = "";
    let username = "";
    let email = "";
    let password = "";
    let password_verification = "";
    let sign_up_failed = false;
    let error_message = "";

    async function signUp() {
        try {
            await authRepository.signUp({
                name: name,
                username: username,
                email: email,
                password: password,
                password_verification: password_verification
            })
            window.location.href = "/";
        } catch (e) {
            sign_up_failed = true;
            error_message = e.data;
            console.log(e);
        }

    }

</script>

<section class="hero is-fullheight-with-navbar">
    <div class="hero-body columns is-vcentered is-flex h-max">
        <div class="column is-half-desktop is-offset-one-quarter mt-7">
            <form class="box">

                <div class="field">
                    <label class="label">Имя</label>
                    <div class="control">
                        <input class="input" type="text" bind:value={name} placeholder="Alex Willson">
                    </div>
                </div>

                <div class="field">
                    <label class="label">Имя пользователя</label>
                    <div class="control">
                        <input class="input" type="text" bind:value={username} placeholder="alex123">
                    </div>
                </div>

                <div class="field">
                    <label class="label">Email</label>
                    <div class="control">
                        <input class="input" type="email" bind:value={email} placeholder="e.g. alex@example.com">
                    </div>
                </div>

                <div class="field">
                    <label class="label">Пароль</label>
                    <div class="control">
                        <input class="input" type="password" bind:value={password} placeholder="********">
                    </div>
                </div>

                <div class="field">
                    <label class="label">Повторить пароль</label>
                    <div class="control">
                        <input class="input" type="password" bind:value={password_verification} placeholder="********">
                    </div>
                </div>
                <button class="button is-primary" on:click={signUp}>Зарегистрироваться</button>
            </form>


            {#if sign_up_failed}
                <div class="notification is-danger">
                    Something went wrong! Try again...
                </div>
            {/if}

        </div>
    </div>
</section>