<script lang="ts">
	import { Button, Fileupload, Input, Label, Textarea, Alert } from 'flowbite-svelte';
	import type { Grandma } from '../../../../node_service/entities/generated_models';
	import { trpcClient } from '$lib/trpc/client';
	import { onMount } from 'svelte';
	import type { UpdateGrandmaClaim } from '../../../../node_service/entities/models';

	let current_profile: Grandma | null = null;
	let name = '';
	let description = '';
	let profile_pic_url = '';
	let show_success_alert = false;

	async function load_profile() {
		let user = await trpcClient.whoAmI.query();
		current_profile = (await trpcClient.getGrandmaWithUsername.query({username: user?.username!}))!;
		name = current_profile.name;
		description = current_profile.description;
		profile_pic_url = current_profile.pictureUrl;
	}

	let uploaded_pfp: FileList;

	async function update() {
		show_success_alert = false;
		if (uploaded_pfp) {
			if (uploaded_pfp.length > 1) {
				alert('Only 1 meal should be uploaded');
				return;
			}

			let post_image_data = await trpcClient.getUploadImageUrl.query({image_name: uploaded_pfp[0].name});

			await fetch(post_image_data.url, {
				method: 'PUT',
				body: uploaded_pfp[0]
			});
			profile_pic_url = `http://minio1:9000/images/${post_image_data.name}`;
		}

		let updateClaim: UpdateGrandmaClaim = {
			name,
			description,
			pictureUrl: profile_pic_url
		}
		await trpcClient.updateGrandma.query(updateClaim);
		show_success_alert = true;
	}



	onMount(load_profile);

</script>

<section>
	<div>
		<img src={profile_pic_url} alt="profile picture" class="rounded-lg max-w-3xl mx-auto" />
	</div>
	<div class="mb-2">
		<Label class="mb-2">Имя</Label>
		<Input type="text" placeholder="Галина" bind:value={name} required />
	</div>

	<div class="mb-2">
		<Label for="textarea-id" class="mb-2">Описание бабушки</Label>
		<Textarea
			id="textarea-id"
			placeholder="Ваше описание"
			rows="4"
			name="message"
			bind:value={description}
			required
		/>
	</div>

	<Label class="space-y-2 mb-2">
		<span>Аватар</span>
		<Fileupload bind:files={uploaded_pfp} accept="image/png, image/jpeg"/>
	</Label>

	<div class="mt-4">
		<Button on:click={update}>Обновить профиль</Button>
	</div>

	{#if show_success_alert}
		<div class="mt-4">
			<Alert color="green">
				<span class="font-medium">Успех!</span> профиль был успешно обновлен
			</Alert>
		</div>
	{/if}
</section>
