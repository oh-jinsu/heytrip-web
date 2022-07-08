<script>
import { goto } from "$app/navigation";

import { page } from "$app/stores";
import { endpoint } from "$lib/functions/fetch";
import { onMount } from "svelte";

let message = "잠시만 기다려 주세요."

onMount(async () => {
  const id = $page.params["id"]
  
  const { ok } = await fetch(endpoint(`subscription/${id}/opt-in`), {
    method: 'POST',
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    }
  });

  if (!ok) {
    goto("/", { replaceState: true })

    return
  }

  message = "구독을 완료했어요."
})
</script>

<svelte:head>
  <title>헤이트립 Heytrip</title>
</svelte:head>

<a href="/">홈으로 돌아가기</a>
<h1>{message}</h1>