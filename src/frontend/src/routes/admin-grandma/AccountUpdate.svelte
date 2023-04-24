<script lang="ts">
	import { Button, Fileupload, Input, Label, Textarea } from "flowbite-svelte";
	import type { Grandma } from "../../../../node_service/entities/generated_models";
	import { trpcClient } from "$lib/trpc/client";
	import { onMount } from "svelte";

    let current_profile: Grandma | null = null

    async function load_profile() {
        let user = await trpcClient.whoAmI.query()
        current_profile = await trpcClient.getGrandmaWithUsername.query(user?.username!)
    }

    onMount(load_profile)

    let uploaded_pfp: FileList;
</script>

<section>
    <div class="mb-2">
        <Label for="textarea-id" class="mb-2">Имя</Label>
        <Input type="text" id="first_name" placeholder="Галина" value={current_profile?.name} required  />
    </div>

    <div class="mb-2">
        <Label for="textarea-id" class="mb-2">Описание бабушки</Label>
        <Textarea id="textarea-id" placeholder="Ваше описание" rows="4" name="message" value={current_profile?.description} required/>
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