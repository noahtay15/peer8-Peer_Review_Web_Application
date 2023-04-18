<script lang="ts">
	import ActionButton from '$components/ActionButton.svelte';
	import Button from '$components/Button.svelte';
	import Question from '$components/Question.svelte';
	import { className } from '$lib/stores/info';
	import { onMount } from 'svelte';
	import { getAssignment, sendSubmission } from '$lib/api/api';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ChevronLeftIcon } from 'svelte-feather-icons';

	interface Question {
		question: string;
		maxScore: number;
		id: number;
	}

	interface Student {
		name: string;
		score: number;
		student_id: number;
		comment: string;
	}

	let questions: Question[] = [];
	let students: Student[] = [];
	let students_copy: Student[] = [];
	let error = '';

	const submitAssignment = async () => {
		console.log(
			questions.map((q, i) => {
				return {
					question_id: q.id,
					scores: students.map((s) => {
						return {
							student_id: s.student_id,
							score: s.score,
							comment: s.comment
						};
					})
				};
			})
		);
		await sendSubmission({
			assignment_id: parseInt($page.params.id),
			responses: scores
		}).then((res) => {
			let r = res.data as any;
			if (res.status === 201) {
				window.history.back();
			} else {
				error = res.message;
			}
		});
	};

	interface ScoreEntry {
		question_id: number;
		scores: {
			student_id: number;
			score: number;
			comment: string;
		}[];
	}

	let scores: ScoreEntry[] = [];

	const goBack = () => {
		window.history.back();
	};

	onMount(async () => {
		await getAssignment(parseInt($page.params.id)).then((res) => {
			let r = res.data as any;
			if (r) {
				questions = r.assignment.questions.map((q: any) => {
					return {
						question: q.question,
						maxScore: q.max_score,
						id: q.id
					};
				});

				students = r.group.students.map((s: any) => {
					return {
						name: s.name,
						student_id: s.id
					};
				});

				scores = r.assignment.questions.map((q: any) => {
					return {
						question_id: q.id,
						scores: r.group.students.map((s: any) => {
							return {
								student_id: s.id,
								score: 0,
								comment: ''
							};
						})
					};
				});

				students_copy = students;
			}
		});
	});
</script>

<div>
	<h1 class="page-heading">{className.name}</h1>
	<div class="flex flex-row">
		<!-- Go back chevron left click-->
		<div class="self-center mt-[4rem] mr-5 cursor-pointer" on:click={goBack} on:keyup={goBack}>
			<ChevronLeftIcon/>
		</div>
		<h2 class="subheading">Assignment</h2>
		<Button classNames="ml-auto pt-10" action="Submit" onClick={submitAssignment} />
		<!-- <ActionButton
		classNames="ml-5 pt-10"
		action="Save"
		animation={false}
		onClick={async () => {}}
		/> -->
	</div>
	
	<h1 class="text-red-500 font-semibold text-xl mt-10">{error}</h1>
	{#each questions as question, i}
		<Question
			question={question.question}
			maxScore={question.maxScore}
			bind:students
			on:scoreChange={(e) => {
				const { student_id, score, comment } = e.detail;
				const question_id = question.id;

				// find the ScoreEntry object in the scores array for this question
				const scoreEntryIndex = scores.findIndex((se) => se.question_id === question_id);
				if (scoreEntryIndex === -1) {
					// if no ScoreEntry exists for this question yet, create a new one
					scores.push({
						question_id,
						scores: [{ student_id, score: score ? score : 0, comment: comment ? comment : '' }]
					});
				} else {
					// if a ScoreEntry exists, update the score and comment for the student
					const studentIndex = scores[scoreEntryIndex].scores.findIndex(
						(s) => s.student_id === student_id
					);
					if (studentIndex === -1) {
						// if the student hasn't been scored yet, add a new entry for them
						scores[scoreEntryIndex].scores.push({ student_id, score: score ? score : 0, comment: comment ? comment : '' });
					} else {
						// if the student already has a score, update it
						scores[scoreEntryIndex].scores[studentIndex].score = score ? score : 0;
						scores[scoreEntryIndex].scores[studentIndex].comment = comment ? comment : '';
					}
				}

				console.log(scores);
			}}
			on:commentChange={(e) => {
				const { student_id, score, comment } = e.detail;
				const question_id = question.id;

				// find the ScoreEntry object in the scores array for this question
				const scoreEntryIndex = scores.findIndex((se) => se.question_id === question_id);
				if (scoreEntryIndex === -1) {
					// if no ScoreEntry exists for this question yet, create a new one
					scores.push({
						question_id,
						scores: [{ student_id, score: score ? score : 0, comment: comment ? comment : '' }]
					});
				} else {
					// if a ScoreEntry exists, update the score and comment for the student
					const studentIndex = scores[scoreEntryIndex].scores.findIndex(
						(s) => s.student_id === student_id
					);
					if (studentIndex === -1) {
						// if the student hasn't been scored yet, add a new entry for them
						scores[scoreEntryIndex].scores.push({ student_id, score: score ? score : 0, comment: comment ? comment : '' });
					} else {
						// if the student already has a score, update it
						scores[scoreEntryIndex].scores[studentIndex].score = score ? score : 0;
						scores[scoreEntryIndex].scores[studentIndex].comment = comment ? comment : '';
					}
				}
			}}
		/>
	{/each}

	<Button classNames="ml-auto pt-10" action="Submit" onClick={submitAssignment} />
	<div class="pb-10" />
</div>

<style>
	.page-heading {
		@apply font-bold text-3xl mt-2;
	}

	.subheading {
		@apply font-bold text-2xl mt-[5rem] text-primary;
	}
</style>
