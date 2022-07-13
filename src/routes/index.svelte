<script lang="ts" context="module">
	import { endpoint } from '$lib/functions/fetch';

	export const load = async ({ fetch }: any) => {
		try {
			await fetch(endpoint('health'));
		} catch {
			return {
				status: 302,
				redirect: '/service-unavailable'
			};
		}

		const [regions, categories] = await Promise.all([
			fetch(endpoint('regions')).then((e: any) => e.json()),
			fetch(endpoint('categories')).then((e: any) => e.json())
		]);

		return {
			props: {
				regions,
				categories
			}
		};
	};
</script>

<script lang="ts">
	import Meta from '$lib/components/meta.svelte';
	import { email } from '$lib/stores/email';
	import { isPrivacyAgreed } from '$lib/stores/is_privacy_agreed';
	import { selectedCategories } from '$lib/stores/selected_categories';
	import { selectedRegions } from '$lib/stores/selected_regions';
	import { onDestroy } from 'svelte';
	import { writable } from 'svelte/store';

	export let regions: string[];
	export let categories: string[];

	const treeRegions = (() => {
		const result: Record<string, string[]> = {};

		regions.forEach((e) => {
			const [preffix] = e.split('/');

			const array = result[preffix];

			if (!array) {
				result[preffix] = [];
			}

			result[preffix].push(e);
		});

		return result;
	})();

	const selectedPreffix = writable<string[]>([]);

	const onSelectPreffix = (value: string) => {
		if (isPending) {
			return;
		}

		if ($selectedPreffix.includes(value)) {
			selectedPreffix.set($selectedPreffix.filter((e) => e !== value));
			selectedRegions.set($selectedRegions.filter((e) => !treeRegions[value].includes(e)));
		} else {
			selectedPreffix.set([...$selectedPreffix, value]);
			selectedRegions.set([...$selectedRegions, ...treeRegions[value]]);
		}
	};

	let isPending = false;

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

	const onSelectRegion = (value: string) => {
		if (isPending) {
			return;
		}

		if ($selectedRegions.includes(value)) {
			selectedRegions.set($selectedRegions.filter((e) => e !== value));

			for (const [preffix, array] of Object.entries(treeRegions)) {
				if (array.every((e) => !$selectedRegions.includes(e))) {
					selectedPreffix.set($selectedPreffix.filter((e) => e !== preffix));
				}
			}
		} else {
			selectedRegions.set([...$selectedRegions, value]);
		}
	};

	const onSelectCategory = (value: string) => {
		if (isPending) {
			return;
		}

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
		if (isPending) {
			return;
		}

		if (
			!$email ||
			!$isPrivacyAgreed ||
			$selectedRegions.length === 0 ||
			$selectedCategories.length === 0
		) {
			return showReason();
		}

		isPending = true;

		const res = await fetch(`${import.meta.env.VITE_API_HOST}/subscription`, {
			method: 'POST',
			body: JSON.stringify({
				email: $email,
				regions: $selectedRegions,
				categories: $selectedCategories
			}),
			headers: {
				'Content-Type': 'application/json;charset=utf-8'
			}
		});

		if (res.status !== 204) {
			const { code } = await res.json();

			if (code === 5) {
				alert('이미 구독을 신청했어요');
			} else {
				alert('잠시 오류가 생겼어요. 다음에 다시 시도해 주세요.');
			}

			isPending = false;

			return;
		}

		alert(
			`헤이트립을 구독해 주셔서 감사해요! 확인용 메일을 보내드렸어요. 내용을 확인하시고 구독 신청을 완료해 주세요.`
		);

		email.set('');
		isPrivacyAgreed.set(false);
		selectedCategories.set([]);
		selectedRegions.set([]);
		selectedPreffix.set([]);

		isPending = false;
	};

	const description = '시즌 맞춤 데이트 및 나들이 장소 추천 뉴스레터';

	const painpoints = [
		'🥱 뻔한 카페나 식당 혹은 영화관에 질려버린 분들께',
		'😔 웬만한 장소는 모두 한 번쯤 가 본 적 있는 분들께',
		'🥲 재밌는 행사가 있는 줄도 모르고 지나치던 분들께',
		'😩 주말마다 어디 갈지 찾아보는 일이 귀찮은 분들께'
	];

	const proposition =
		'📨 매주 지금이 아니면 갈 수 없는 색다른 장소를 찾아 성향에 맞게끔 간추려 보내드려요.';

	onDestroy(() => {
		UnsubscribeEmail();
		UnsubscribePrivacy();
		UnsubscribeLocation();
		UnsubscribeCategory();
	});
</script>

<Meta
	description="{description} {proposition}"
	keywords={['시즌', '데이트', '나들이', '추천', '뉴스레터']}
/>

<ul class="painpoints">
	{#each painpoints as item}
		<li>
			{item}
		</li>
	{/each}
</ul>
<p class="proposition">{proposition}</p>
<form on:submit|preventDefault={onSubmit}>
	<label class="first">
		이메일
		<input type="email" placeholder="example@email.com" bind:value={$email} disabled={isPending} />
	</label>
	{#if emailMessage}
		<p class="error">{emailMessage}</p>
	{/if}
	<!-- svelte-ignore a11y-label-has-associated-control -->
	<label> 관심 지역 </label>
	<div class="chip-container">
		{#each Object.keys(treeRegions) as preffix}
			<button
				type="button"
				class="chip {$selectedPreffix.includes(preffix) && 'active'} {isPending && 'pending'}"
				on:click={() => onSelectPreffix(preffix)}
				disabled={isPending}
			>
				{preffix}
			</button>
			{#if $selectedPreffix.includes(preffix)}
				{#each treeRegions[preffix] as region}
					<button
						type="button"
						class="chip {$selectedRegions.includes(region) && 'active'} {isPending && 'pending'}"
						on:click={() => onSelectRegion(region)}
						disabled={isPending}
						>{region.substring(region.indexOf('/') + 1)}
					</button>
				{/each}
			{/if}
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
				class="chip {$selectedCategories.includes(category) && 'active'} {isPending && 'pending'}"
				on:click={() => onSelectCategory(category)}
				disabled={isPending}
			>
				{category}
			</button>
		{/each}
	</div>
	{#if categoryMessage}
		<p class="error">{categoryMessage}</p>
	{/if}
	<label>
		<input type="checkbox" bind:checked={$isPrivacyAgreed} disabled={isPending} />
		<a href="/privacy">개인정보 수집 및 이용</a>에 동의합니다.
	</label>
	{#if privacyMessage}
		<p class="error">{privacyMessage}</p>
	{/if}
	<input
		type="submit"
		class={isPending ? 'pending' : ''}
		value={isPending ? '잠시만 기다려 주세요' : '무료로 구독하기'}
		disabled={isPending}
	/>
</form>

<style>
	.painpoints {
		list-style: none;

		margin: 0;
		margin-top: 8px;
		padding: 0;
	}

	.proposition {
		margin-top: 0;
	}

	label:not(.first) {
		margin-top: 8px;
	}

	input[type='submit'] {
		margin-top: 8px;
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
