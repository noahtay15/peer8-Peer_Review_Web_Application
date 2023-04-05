<script lang="ts">
	export let questions: { question: string; max_points: number | null }[] = [];

	let newQuestion: { question: string; max_points: number | null } = { question: '', max_points: null };

	const addQuestion = () => {
		if (newQuestion.question.trim() === '') return;

		// add new question
		questions = [...questions, { ...newQuestion }];

		// clear inputs
		newQuestion.question = '';
		newQuestion.max_points = null;
	};

	const deleteQuestion = (index: number) => {
		questions = questions.filter((_, i) => i !== index);
	};
</script>

<div class="comp">
	<h2 class="label">Questions</h2>
	<div class="mb-2">
		<input
			type="text"
			class="input"
			placeholder="Enter a question"
			bind:value={newQuestion.question}
		/>
		<input
			type="number"
			class="input-small"
			placeholder="Max score"
			min="0"
			bind:value={newQuestion.max_points}
		/>
		<button
			class="h-10 w-28 px-4 ml-2 border-2 border-gray-300 rounded-md shadow-sm bg-secondary text-primary font-light cursor-pointer"
			on:click={addQuestion}
		>
			Add
		</button>
	</div>

	<p class="text-sm my-6 text-gray-500">
		{questions.length === 0
			? 'Questions (No questions added yet)'
			: `Questions (${questions.length} questions)`}
	</p>
	<ul>
		{#each questions as question, index}
			<li class="mb-2">
				<input type="text" class="input" bind:value={question.question} />
				<input
					type="number"
					class="input-small"
					placeholder="Max score"
					min="0"
					bind:value={question.max_points}
				/>
				<button
					class="h-10 w-28 px-4 ml-2 border-2 border-gray-300 rounded-md shadow-sm bg-secondary text-primary font-light cursor-pointer"
					on:click={() => deleteQuestion(index)}
				>
					Delete
				</button>
			</li>
		{/each}
	</ul>
</div>

<style>
	.comp {
		@apply mt-4;
	}

	.label {
		@apply text-base font-medium mb-3 text-primary;
	}

	.input {
		@apply w-72 h-10 px-4 py-2 border-2 border-[#D2D1D1] rounded-md shadow-sm bg-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
	}

	.input-small {
		@apply w-36 h-10 px-4 py-2 border-2 border-[#D2D1D1] rounded-md shadow-sm bg-[#F0F0F0] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent;
	}
</style>
