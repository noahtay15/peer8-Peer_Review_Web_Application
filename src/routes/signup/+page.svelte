<!-- Parent component -->
<script lang="ts">
	import Field from '$components/Field.svelte';
	import Form from '$components/Form.svelte';
	import Heading from '$components/Heading.svelte';
	import Button from '$components/Button.svelte';
	import Switch from '$components/Switch.svelte';
	import {validateEmail, validatePassword} from '$lib/utils/validate';

	const validateConfirm = (value: string) => value.length > 0;
  
	let email = '';
	let password = '';
	let confirmPassword = '';
	let userType = '';
	let classCode = '';

	let validEmail = false;
	let validPassword = false;
	let validConfirmPassword = false;
	let validClassCode = false;
  
	const signupUser = async () => {
	  /*const res = await fetch('/api/signup', {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify({
		  email,
		  password,
		  name: '',
		  class_code: classCode,
		})
	  });*/

	  console.log(validEmail)
	}
  </script>
  
  <div class="h-full">
	<slot name="heading">
	  <Heading heading="Sign Up" subheading="Get started below." navigation>Form</Heading>
	</slot>
	<Form onSubmit={signupUser}>
	  <Field inputFor="email address" placeholder="ex: example@gmail.com" label="Email Address" type="text" bind:value={email} bind:valid={validEmail} validator={validateEmail} />
	  <Field inputFor="password" placeholder="**********" label="Password" type="password" bind:value={password} bind:valid={validPassword} validator={validatePassword} />
	  <Field inputFor="password" placeholder="**********" label="Confirm Password" type="text" bind:value={confirmPassword} bind:valid={validConfirmPassword} validator={validateConfirm} />
	  <Switch options={['Student', 'Instructor']} />
	  <Field inputFor="class code" placeholder="ex: A52E1AE" label="Class Code (optional)" type="text" bind:value={classCode} />
	  <Button action="Sign Up" />
	</Form>
  </div>
  
