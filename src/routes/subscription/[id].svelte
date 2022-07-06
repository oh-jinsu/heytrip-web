<script context="module" lang="ts">
  export const load = async ({ params, fetch }: any) => {
    const id = params["id"]

    const { ok } = await fetch(`${import.meta.env.VITE_API_HOST}/subscription/${id}/opt-in`, {
			method: 'POST',
			headers: {
				"Content-Type": "application/json;charset=utf-8"
			}
		});

    if (!ok) {
      return {
        status: 302,
        redirect: "/"
      }
    }

    return {
      props: {}
    }
  }
</script>

<svelte:head>
  <title>헤이트립 Heytrip</title>
</svelte:head>

<a href="/">홈으로 돌아가기</a>
<h1>구독을 완료했습니다.</h1>