<script lang="ts">
	import { categories } from '$lib/constants/categories';
	import { regions } from '$lib/constants/regions';
	import { email } from '$lib/stores/email';
	import { isPrivacyAgreed } from '$lib/stores/is_privacy_agreed';
	import { selectedCategories } from '$lib/stores/selected_categories';
	import { selectedRegions } from '$lib/stores/selected_regions';
	import { onDestroy } from 'svelte';

	let emailMessage = '';

	const UnsubscribeEmail = email.subscribe((value) => {
		if (emailMessage) {
			if (value) {
				emailMessage = '';
			}
		}
	});

	let privacyMessage = '';

	const UnsubscribePrivacy = isPrivacyAgreed.subscribe((value) => {
		if (privacyMessage) {
			if (value) {
				privacyMessage = '';
			}
		}
	});

	let regionMessage = '';

	const UnsubscribeLocation = selectedRegions.subscribe((value) => {
		if (regionMessage) {
			if (value.length > 0) {
				regionMessage = '';
			}
		}
	});

	let categoryMessage = '';

	const UnsubscribeCategory = selectedCategories.subscribe((value) => {
		if (categoryMessage) {
			if (value.length > 0) {
				categoryMessage = '';
			}
		}
	});

	const onSelectLocation = (value: string) => {
		if ($selectedRegions.includes(value)) {
			selectedRegions.set($selectedRegions.filter((e) => e !== value));
		} else {
			selectedRegions.set([...$selectedRegions, value]);
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

		if ($selectedRegions.length === 0) {
			regionMessage = '관심 지역을 선택해 주세요.';
		}

		if ($selectedCategories.length === 0) {
			categoryMessage = '관심 분야를 선택해 주세요.';
		}
	};

	const onSubmit = async () => {
		if (
			!$email ||
			!$isPrivacyAgreed ||
			$selectedRegions.length === 0 ||
			$selectedCategories.length === 0
		) {
			return showReason();
		}

		const res = await fetch('https://api.heytrip.kr/v1/subscription', {
			method: 'POST',
			body: JSON.stringify({
				email: $email,
				regions: $selectedRegions,
				categories: $selectedCategories
			})
		});

		if (res.status !== 204) {
			const { code } = await res.json()

			if (code === 1) {
				alert("이미 구독을 완료했어요.")
			} else {
				alert('잠시 오류가 생겼어요. 다음에 다시 시도해 주세요.');
			}

			return
		}

		alert(`헤이트립을 구독해 주셔서 감사해요! 확인용 메일을 보내드렸어요. 내용을 확인하시고 구독 신청을 완료해 주세요.`);

		email.set('');
		isPrivacyAgreed.set(false)
		selectedCategories.set([])
		selectedRegions.set([])
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
		<input type="email" placeholder="example@email.com" bind:value={$email} />
	</label>
	{#if emailMessage}
		<p class="error">{emailMessage}</p>
	{/if}
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label> 관심 지역 </label>
	<div class="chip-container">
		{#each regions as region}
			<button
				type="button"
				class="chip {$selectedRegions.includes(region) && 'active'}"
				on:click={() => onSelectLocation(region)}
				>{region}
			</button>
		{/each}
	</div>
	{#if regionMessage}
		<p class="error">{regionMessage}</p>
	{/if}
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label> 관심 분야 </label>
	<div class="chip-container">
		{#each categories as category}
			<button
				type="button"
				class="chip {$selectedCategories.includes(category) && 'active'}"
				on:click={() => onSelectCategory(category)}
			>
				{category}
			</button>
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
		color: var(--error-color);

		font-size: 12px;
	}
</style>
