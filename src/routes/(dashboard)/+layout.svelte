<!-- TODO: Fix highlighted state of mobile nav icon -->
<script lang="ts">
	import NavGroup from '$components/NavGroup.svelte';
	import NavItem from '$components/NavItem.svelte';
	import PageTransition from '$lib/components/PageTransition.svelte';
	import Modal from '$components/Modal.svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import '../../app.postcss';
	import PeerReview from '$components/Modals/CreatePeerReview.svelte';
	import AddClass from '$components/Modals/AddClass.svelte';
	import {
		getUser,
		refreshUser,
		getClasses,
		type ExtendedAPIResponse,
		getTemplates
	} from '$lib/api/api';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user';
	import type {
		AuthenticationResultType,
		GetUserResponse
	} from 'aws-sdk/clients/cognitoidentityserviceprovider';
	import ActionButton from '$components/ActionButton.svelte';
	import CreateClass from '$components/Modals/CreateClass.svelte';
	import type { Class, ClassData } from '$lib/types/Classes';
	import CreateTemplate from '$components/Modals/CreateTemplate.svelte';
	// Import any necessary components, such as the navigation menu
	// layout
	export let data;

	let navIsOpen = false;
	let modals: any = [];
	let user_classes: Class[] = [];
	let user_templates: any[] = [];

	const retry = async () => {
		await getUser(localStorage.getItem('token') || '', localStorage.getItem('id_token') || '').then(
			async (res) => {
				let r = res as ExtendedAPIResponse;

				if (r.message.includes('NotAuthorizedException')) {
					localStorage.removeItem('token');
					localStorage.removeItem('refresh_token');
					localStorage.removeItem('id_token');
					goto('/login');
				}
			}
		);
	};

	const refresh = async () => {
		await refreshUser(localStorage.getItem('refresh_token') || '').then(async (res) => {
			let d = res.data as AuthenticationResultType;
			localStorage.setItem('token', d.AccessToken || '');
			localStorage.setItem('id_token', d.IdToken || '');
		});
	};

	onMount(async () => {
		// TODO: Call API to get user data
		await getUser(localStorage.getItem('token') || '', localStorage.getItem('id_token') || '').then(
			async (res) => {
				let r = res as ExtendedAPIResponse;

				if (r.message.includes('NotAuthorizedException')) {
					await refresh();
					await retry();
				}

				let info = r.data as GetUserResponse;

				user.set({
					id: info.UserAttributes?.find((attr) => attr.Name === 'sub')?.Value || '',
					name: info.UserAttributes?.find((attr) => attr.Name === 'name')?.Value || '',
					email: info.UserAttributes?.find((attr) => attr.Name === 'email')?.Value || '',
					type: info.UserAttributes?.find((attr) => attr.Name === 'custom:user_type')?.Value || ''
				});
			}
		);

		await getClasses(
			localStorage.getItem('token') || '',
			localStorage.getItem('id_token') || '',
			0
		).then(async (res) => {
			let r = res as ExtendedAPIResponse;
			let dat = r.data as ClassData;
			user_classes = dat.classes as Class[];
		});

		await getTemplates(
			localStorage.getItem('token') || '',
			localStorage.getItem('id_token') || '',
			0
		).then(async (res) => {
			let r = res as ExtendedAPIResponse;
			let dat = r.data;
			user_templates = dat as any[];
		});

		
		user.subscribe(async (user) => {
			console.log(user);
		});

		if ($user.type?.toLowerCase() === 'instructor') {
			await getTemplates(
				localStorage.getItem('token') || '',
				localStorage.getItem('id_token') || '',
				0
			).then(async (res) => {
				console.log(res);
			});
		}
	});

	function toggleNav() {
		navIsOpen = !navIsOpen;
		console.log(navIsOpen);
	}

	const openModal = (data: any) => {
		modals = [...modals, data];

		console.log(modals);
	};
	const closeModal = (modalId: any) => {
		modals = modals.filter((modal: any) => modal.id !== modalId);
	};

	const addClass = () => {
		openModal({
			id: 'addClass',
			title: 'Create a Class',
			content: $user.type?.toLowerCase() === 'instructor' ? CreateClass : AddClass,
			onSubmit: () => {
				console.log('Form submitted!');
				closeModal('addClass');
			},
			onClose: () => {
				console.log('Modal closed!');
				closeModal('addClass');
			}
		});
	};

	const addPeerReview = () => {
		openModal({
			id: 'addPeerReview',
			title: 'Create a New Peer Review',
			content: PeerReview,
			onSubmit: () => {
				console.log('Form submitted!');
				closeModal('addPeerReview');
			},
			onClose: () => {
				console.log('Modal closed!');
				closeModal('addPeerReview');
			}
		});
	};

	const addTemplate = () => {
		openModal({
			id: 'addTemplate',
			title: 'Create a New Template',
			content: CreateTemplate,
			onSubmit: () => {
				closeModal('addTemplate');
			},
			onClose: () => {
				console.log('Modal closed!');
				closeModal('addTemplate');
			}
		});
	};
</script>

<svelte:head>
	<title>Dashboard</title>
	<meta name="description" content="Peer8" />
</svelte:head>

<div class="main-block">
	<div class="main">
		<!-- Navigation column (for larger screens) -->
		<div class="hidden lg:block h-full w-[25rem] px-8 sidebar pb-8">
			<p on:click={() => {}} on:keyup={() => {}} class="logomark">peer8</p>
			<!-- Make a circle with the first letter from the user's name-->
			<div class="fixed right-0 top-0 justify-between">
				<div class="flex flex-row">
					<div class="flex flex-row justify-between mr-6 mt-10">
						<div class="flex flex-row items-center">
							<div class="rounded-full bg-primary w-10 h-10 flex items-center justify-center">
								<p class="text-white text-2xl font-light">{$user.name?.charAt(0)}</p>
							</div>
							<div class="ml-2">
								<!-- Only get the first name from our user.name store-->
								<p class="text-lg font-semibold">{$user.name?.split(' ')[0]}</p>
							</div>
						</div>
					</div>
					<ActionButton
						onClick={async () => {
							localStorage.removeItem('token');
							localStorage.removeItem('refresh_token');
							goto('/login');
						}}
						action="Logout"
						animation={false}
						classNames="md:mr-8 bg-secondary"
					/>
				</div>
			</div>
			<!-- Nav groups for sidebar -->
			<NavGroup category="Classes" searchable onAdd={addClass}>
				{#each user_classes as cl}
					<NavItem
						href={`/class/${cl.id}`}
						active={data.pathname === `/class/${cl.id}`}
						className="Class"
					/>
				{/each}
			</NavGroup>
			{#if $user.type?.toLowerCase() === 'instructor'}
				<NavGroup category="Templates" searchable onAdd={addTemplate}>
					{#each user_templates as template}
						<NavItem
							href={`/template/${template.id}`}
							active={data.pathname === `/template/${template.id}`}
							className="Template"
						/>
					{/each}
				</NavGroup>
			{/if}
		</div>

		<!-- Navigation dropdown (for smaller screens) -->
		<!-- class:bg-primary={navIsOpen} -->
		<div class="lg:hidden w-full sidebarMobile">
			<div class="flex flex-row items-center justify-between px-8">
				<p on:click={toggleNav} on:keyup={toggleNav} class="logomark">peer8</p>
				<div class="flex flex-row">
					<div class="flex flex-row justify-between mt-8 mr-6">
						<div class="flex flex-row items-center">
							<div class="rounded-full bg-primary w-10 h-10 flex items-center justify-center">
								<p class="text-white text-2xl font-light">A</p>
							</div>
							<div class="ml-2">
								<!-- Only get the first name from our user.name store-->
								<p class="text-lg font-semibold">{$user.name?.split(' ')[0]}</p>
							</div>
						</div>
					</div>
					<button
						on:click={toggleNav}
						aria-label="Toggle Navigation"
						class="text-gray-600 hover:text-primary focus:outline-none self-end pb-2"
					>
						<svg class="w-6 h-6 fill-current" viewBox="0 0 24 24">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M3 6C3 5.44772 3.44772 5 4 5H20C20.5523 5 21 5.44772 21 6C21 6.55228 20.5523 7 20 7H4C3.44772 7 3 6.55228 3 6ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19H16C16.5523 19 17 18.5523 17 18C17 17.4477 16.5523 17 16 17H4Z"
							/>
						</svg>
					</button>
				</div>
			</div>
			<!-- Hide sidebar for mobile, makes everything easier -->
			{#if navIsOpen}
				<div class="mx-8">
					<ActionButton
						onClick={async () => {
							localStorage.removeItem('token');
							localStorage.removeItem('refresh_token');
							goto('/login');
						}}
						action="Logout"
						transition
					/>
				</div>
				<div
					class="flex flex-col items-center px-8"
					in:fade={{ duration: 500 }}
					out:fade={{ duration: 500 }}
				>
					<!-- Sidebar stuff but actually column stuff for mobile, navigation -->
					<div class="w-full">
						<NavGroup category="Classes" searchable onAdd={addClass}>
							{#each user_classes as cl}
								<NavItem
									href={`/class/${cl.id}`}
									active={data.pathname === `/class/${cl.id}`}
									className="Class"
								/>
							{/each}
						</NavGroup>
					</div>
					<div class="w-full">
						<NavGroup category="Templates" searchable onAdd={addTemplate}>
							<NavItem
								href="/template/1"
								active={data.pathname === '/template/1'}
								className="Template"
							/>
						</NavGroup>
					</div>
				</div>
			{/if}
		</div>

		<!-- Main content column -->
		<div class="w-full p-8 main-content">
			<PageTransition pathname={data.pathname}>
				<slot />
			</PageTransition>
		</div>
	</div>
	<div>
		{#each modals as modal}
			<Modal title={modal.title} showModal={true} onSubmit={modal.onSubmit} onClose={modal.onClose}>
				{#if modal.content}
					<svelte:component
						this={modal.content}
						onSubmit={modal.onSubmit}
						onClose={modal.onClose}
					/>
				{/if}
			</Modal>
		{/each}
	</div>
</div>

<style>
	.main-block {
		@apply flex flex-col h-full w-full;
	}

	.logomark {
		@apply text-4xl font-bold text-primary mt-10 lg:mb-20 cursor-pointer;
	}

	.main {
		@apply flex flex-col lg:flex-row h-screen;
	}

	@media (min-width: 1024px) {
		.main {
			@apply h-auto;
		}
	}

	.main-content {
		height: calc(100vh);
		overflow-y: auto;
	}

	.sidebar {
		height: calc(100vh);
		overflow-y: auto;
	}

	/* mobile */
	.sidebarMobile {
		overflow-y: auto;
	}

	.sidebarMobile::-webkit-scrollbar {
		display: none;
	}

	/* Define the appearance of the custom scrollbar */
	.main-content::-webkit-scrollbar,
	.sidebar::-webkit-scrollbar {
		width: 6px;
	}
	body {
		@apply overflow-hidden;
	}
</style>
