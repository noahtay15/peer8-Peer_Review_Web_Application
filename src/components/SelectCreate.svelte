<script lang="ts">
	import { EyeIcon, EyeOffIcon } from 'svelte-feather-icons';

	export let label: string = '';

	const validateEmail = (email: any) => {
		// Use your custom email validation logic here
		return email.match(emailRegex);
	};

	const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;

	let emailInput = '';
	let emails: any[] = [];
	let showEmails = false;
	let selectedEmails: any[] = [];

	const addEmail = () => {
		if (validateEmail(emailInput)) {
			emails = [...emails, emailInput];
			emailInput = '';
			selectedEmails = [];
		}
	};

	const deleteEmail = (index: any) => {
		emails.splice(index, 1);
		if (selectedEmails.includes(index)) {
			selectedEmails = selectedEmails.filter((i) => i !== index);
		}
	};

	const bulkDelete = () => {
		selectedEmails.forEach((index) => {
			emails.splice(index, 1);
		});
		selectedEmails = [];
	};

	const toggleEmails = () => {
		showEmails = !showEmails;
	};

	const selectEmail = (index: any) => {
		if (selectedEmails.includes(index)) {
			selectedEmails = selectedEmails.filter((i) => i !== index);
		} else {
			selectedEmails = [...selectedEmails, index];
		}
	};

	const getEmailDisplayText = () => {
		if (selectedEmails.length === 0) {
			return 'No emails selected';
		} else if (selectedEmails.length === 1) {
			return `${selectedEmails.length} email selected`;
		} else {
			return `${selectedEmails.length} emails selected`;
		}
	};
</script>

<div class="comp">
	<h1 class="label">{label}</h1>
	<div class="flex">
		<!--${!validateEmail(emailInput) && 'invalid'}-->
		<input
			type="text"
			class={`input mr-2 ml-1 normal`}
			placeholder="Enter an email address"
			bind:value={emailInput}
		/>
		<button class="button" disabled={!validateEmail(emailInput)} on:click={addEmail}> Add </button>
	</div>

	{#if emails.length > 0}
		<div class="mt-4">
			<!-- <p class="label">Emails:</p> -->

			{#if showEmails}
				<div>
					<ul>
						{#each emails as email, i}
							<li class="flex items-center mb-2">
								<input
									type="checkbox"
									class="mr-2"
									checked={selectedEmails.includes(i)}
									on:change={() => selectEmail(i)}
								/>
								<p>{email.length > 16 ? `${email.slice(0, 16)}...` : email}</p>
								<button class="buttonDelete ml-auto" on:click={() => deleteEmail(i)}> Delete </button>
							</li>
						{/each}
					</ul>

					{#if selectedEmails.length > 0}
						<div class="mt-4">
							<p class="mr-2">{getEmailDisplayText()}</p>
							<button class="button" on:click={bulkDelete}> Delete Selected </button>
						</div>
					{:else}
						<p>No emails selected</p>
					{/if}

					<button class="visibilityButton mt-4" on:click={toggleEmails}>
						<div class="flex flex-row">
							<span class="mr-2"> <EyeOffIcon class="ml-2 text-black" /></span>
							<span class="font-medium">Hide Emails</span>
						</div>
					</button>
				</div>
			{:else}
				<button class="visibilityButton" on:click={toggleEmails}>
					<div class="flex flex-row">
						<span class="mr-2"> <EyeIcon class="ml-2 text-black" /></span>
						<span class="font-medium">Show Emails</span>
					</div>
				</button>
			{/if}
		</div>
	{/if}
</div>

<style lang="scss">
	.comp {
		@apply mt-10;
	}

	.input {
		@apply w-full h-10 px-4 py-2 border-2 border-[#D2D1D1] rounded-md shadow-sm bg-[#F0F0F0];
	}

	.button {
		@apply h-10 w-48 px-4 ml-auto border-2 border-[#D2D1D1] rounded-md shadow-sm bg-secondary text-primary font-light cursor-pointer;
	}

	.buttonDelete {
		@apply h-10 w-36 px-4 ml-auto border-2 border-[#D2D1D1] rounded-md shadow-sm bg-secondary text-primary font-light cursor-pointer;
	}

	.visibilityButton {
		@apply ml-auto text-primary font-light cursor-pointer;
	}

	.label {
		@apply text-base font-medium mb-3 text-primary;
	}

	.error {
		@apply text-red-500 text-base font-light mt-3;
	}

	.normal {
		@apply border-[#D2D1D1] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
	}

	.invalid {
		@apply border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent;
	}

	.disabled {
		@apply cursor-not-allowed text-inactive;
	}
</style>
