<script lang="ts">
	import { onDestroy } from 'svelte';

	import { writable } from 'svelte/store';

	let email = writable('');

	let emailMessage = '';

	const UnsubscribeEmail = email.subscribe((value) => {
		if (emailMessage) {
			if (value) {
				emailMessage = '';
			}
		}
	});

	let isPrivacyAgreed = writable(false);

	let privacyMessage = '';

	const UnsubscribePrivacy = isPrivacyAgreed.subscribe((value) => {
		if (privacyMessage) {
			if (value) {
				privacyMessage = '';
			}
		}
	});

	const selectedLocations = writable<string[]>([]);

	let locationMessage = '';

	const UnsubscribeLocation = selectedLocations.subscribe((value) => {
		if (locationMessage) {
			if (value.length > 0) {
				locationMessage = '';
			}
		}
	});

	const selectedCategories = writable<string[]>([]);

	let categoryMessage = '';

	const UnsubscribeCategory = selectedCategories.subscribe((value) => {
		if (categoryMessage) {
			if (value.length > 0) {
				categoryMessage = '';
			}
		}
	});

	const locations = [
		'강남구',
		'강동구',
		'강북구',
		'강서구',
		'관악구',
		'광진구',
		'구로구',
		'금천구',
		'노원구',
		'도봉구',
		'동대문구',
		'동작구',
		'마포구',
		'서대문구',
		'서초구',
		'성동구',
		'성북구',
		'송파구',
		'양천구',
		'영등포구',
		'용산구',
		'은평구',
		'종로구',
		'중구',
		'중랑구'
	];

	const categories = [
		'전시',
		'축제',
		'레저',
		'콘서트',
		'연극',
		'뮤지컬',
		'문학',
		'서양음악',
		'무용',
		'전통예술'
	];

	const onSelectLocation = (value: string) => {
		if ($selectedLocations.includes(value)) {
			selectedLocations.set([]);
		} else {
			selectedLocations.set([...$selectedLocations, value]);
		}
	};

	const onSelectCategory = (value: string) => {
		if ($selectedCategories.includes(value)) {
			selectedCategories.set($selectedCategories.filter((e) => e !== value));
		} else {
			selectedCategories.set([...$selectedCategories, value]);
		}
	};

	const showReason = () => {
		if (!$email) {
			emailMessage = '이메일을 입력해 주세요.';
		}

		if (!$isPrivacyAgreed) {
			privacyMessage = '개인정보 수집 및 이용에 동의해 주세요.';
		}

		if ($selectedLocations.length === 0) {
			locationMessage = '관심 지역을 선택해 주세요.';
		}

		if ($selectedCategories.length === 0) {
			categoryMessage = '관심 분야를 선택해 주세요.';
		}
	};

	const onSubmit = async () => {
		if (
			!$email ||
			!$isPrivacyAgreed ||
			$selectedLocations.length === 0 ||
			$selectedCategories.length === 0
		) {
			return showReason();
		}

		const res = await fetch('https://api.heytrip.kr/v1/subscribes', {
			method: 'POST',
			body: JSON.stringify({
				email: $email,
				locations: $selectedLocations,
				categories: $selectedCategories
			})
		});

		if (res.status !== 201) {
			alert('잠시 오류가 생겼어요. 다음에 다시 시도해 주세요.');

			return;
		}

		alert(`감사합니다. 구독 확인 메일을 보냈어요. 확인해 주세요!`);

		email.set('');
	};

	onDestroy(() => {
		UnsubscribeEmail();
		UnsubscribePrivacy();
		UnsubscribeLocation();
		UnsubscribeCategory();
	});
</script>

<svelte:head>
	<title>헤이트립 Heytrip</title>
</svelte:head>

<h1>Heytrip</h1>
<p>
	🥱 모처럼 있는 휴일을 뻔하게 보내지 않고 매번 특별한 경험을 남기고 싶은 여러분께.
	<br />
	😫 다가오는 주말엔 또 어디를 가야 좋을지 여기저기 찾아다니는 일이 귀찮은 여러분께.
	<br />
	📨 매주 지금이 아니면 갈 수 없는 장소들을 찾아 성향에 꼭 맞게끔 간추려 보내드릴게요.
</p>
<form on:submit|preventDefault={onSubmit}>
	<label>
		이메일
		<input type="email" bind:value={$email} />
	</label>
	{#if emailMessage}
		<p class="error">{emailMessage}</p>
	{/if}
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label> 관심 지역 </label>
	<div class="chip-container">
		{#each locations as location}
			{#if $selectedLocations.includes(location)}
				<button type="button" class="chip active" on:click={() => onSelectLocation(location)}
					>{location}
				</button>
			{:else}
				<button type="button" class="chip" on:click={() => onSelectLocation(location)}>
					{location}
				</button>
			{/if}
		{/each}
	</div>
	{#if locationMessage}
		<p class="error">{locationMessage}</p>
	{/if}
	{$selectedLocations}
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label> 관심 분야 </label>
	<div class="chip-container">
		{#each categories as category}
		  {#if $selectedCategories.includes(category)}
				<button type="button" class="chip active" on:click={() => onSelectCategory(category)}>
          {category}
				</button>
			{:else}
				<button type="button" class="chip" on:click={() => onSelectCategory(category)}>
					{category}
				</button>
			{/if}
		{/each}
	</div>
	{#if categoryMessage}
		<p class="error">{categoryMessage}</p>
	{/if}
	<label>
		<input type="checkbox" bind:checked={$isPrivacyAgreed} />
		<a href="/privacy">개인정보 수집 및 이용</a>에 동의합니다.
	</label>
	{#if privacyMessage}
		<p class="error">{privacyMessage}</p>
	{/if}
	<input type="submit" value="무료로 구독하기" />
</form>

<style>
	h1 {
		font-size: 64px;
		font-family: 'Happiness-Sans-Title';
		text-align: center;
	}

	label {
		margin-top: 8px;
	}

	input[type='submit'] {
		margin-top: 24px;
	}

	.chip-container {
		display: flex;

		flex-wrap: wrap;

		gap: 4px;

		padding: 4px 0;
	}

	.error {
		color: red;

		font-size: 12px;
	}
</style>
