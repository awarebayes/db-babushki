<script lang="ts">
	import { Button, Fileupload, Input, Label, Textarea } from "flowbite-svelte";
	import type { Grandma } from "../../../../node_service/entities/generated_models";
	import { trpcClient } from "$lib/trpc/client";
	import { onMount } from "svelte";

    let current_profile: Grandma | null = null
    let name = ""
    let description = ""
    let profile_pic = ""

    async function load_profile() {
        let user = await trpcClient.whoAmI.query()
        current_profile =(await trpcClient.getGrandmaWithUsername.query(user?.username!))!
        name = current_profile.name
        description = current_profile.description
        profile_pic = current_profile.pictureUrl
    }

    onMount(load_profile)

    let uploaded_pfp: FileList;
</script>

<section>
    <div>
        <img src="{profile_pic}" alt="profile picture" class="rounded-lg max-w-3xl mx-auto">
    </div>
    <div class="mb-2">
        <Label class="mb-2">Имя</Label>
        <Input  type="text" placeholder="Галина" bind:value={name} required  />
    </div>

    <div class="mb-2">
        <Label for="textarea-id" class="mb-2">Описание бабушки</Label>
        <Textarea id="textarea-id" placeholder="Ваше описание" rows="4" name="message" bind:value={description} required/>
    </div>

    <Label class="space-y-2 mb-2">
        <span>Аватар</span>
        <Fileupload bind:files={uploaded_pfp}/>
    </Label>

    <div class="mt-4">
        <Button>
            Обновить профиль
        </Button>
    </div>
</section>