<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	interface Student {
		name: string;
		score: number;
		student_id: number;
		comment: string;
	}

	export let question: string = '';
	export let maxScore = 0;
	export let students: Student[] = [];

	const dispatch = createEventDispatcher();

	const handleScoreInput = (event: Event, student: Student) => {
		let scores: number[] = students.map((s) => s.score);
		const score = parseInt((event.target as HTMLInputElement).value);
		scores[student.student_id] = score;
		dispatch('scoreChange', {
			student_id: student.student_id,
			score: score,
			comment: student.comment
		});
	};

	const handleCommentInput = (event: Event, student: Student) => {
		let comments: string[] = students.map((s) => s.comment);
		const comment = (event.target as HTMLInputElement).value;
		comments[student.student_id] = comment;
		dispatch('commentChange', {
			student_id: student.student_id,
			score: student.score,
			comment: comment
		});
	};
</script>

<div class="comp">
	<h1 class="question">{question}</h1>
	{#each students as student}
		<div class="flex flex-row question-content">
			<h2 class="self-center">{student.name}</h2>
			<input
				class="input"
				type="number"
				min="0"
				max={maxScore}
				value={student.score || 0}
				on:input={(e) => handleScoreInput(e, student)}
			/>
			<!-- Maximum score in inactive text-->
			<p class="text-gray-400 ml-2 self-center">/{maxScore}</p>
		</div>
		<!-- Textarea for comments-->
		<textarea
			class="input-area"
			placeholder="Leave any comments here..."
			value={student.comment || ''}
			on:input={(e) => handleCommentInput(e, student)}
		/>
	{/each}
</div>

<style>
	.comp {
		@apply my-10;
	}

	.question {
		@apply text-xl font-bold text-primary;
	}

	.input {
		@apply w-48 h-10 px-4 py-2 ml-10 border-none bg-[#F0F0F0] focus:ring-transparent rounded-md;
	}

	.input-area {
		@apply w-full h-20 px-4 py-2 border-none bg-[#F0F0F0] focus:ring-transparent rounded-md;
	}

	.question-content {
		@apply my-5;
	}
</style>
