<script lang="ts">
  let email: string
  let username: string
  let isPrivacyAgreed: boolean
  
  const onSubmit = async () => {    
    if (!email) {
      alert("뉴스레터를 구독하려면 이메일을 입력해 주세요.")

      return
    }
    
    if (!username) {
      alert("뉴스레터를 구독하려면 별명을 입력해 주세요.")

      return
    }
    
    if (!isPrivacyAgreed) {
      alert("뉴스레터를 구독하려면 개인정보 수집 및 이용에 동의해 주세요.")

      return
    }
    
    const res = await fetch("https://api.heytrip.kr/v1/subscribes", {
      method: "POST",
      body: JSON.stringify({
        email,
        username,
        isPrivacyAgreed,
      })
    })

    if (res.status !== 201) {
      alert("잠시 오류가 생겼어요. 다음에 다시 시도해 주세요.")

      return
    }

    alert(`${username}님, 구독해 주셔서 감사해요!`)

    email = ""
    username = ""
  }
</script>

<svelte:head>
	<title>헤이트립 Heytrip</title>
</svelte:head>

<h1>Heytrip</h1>
<p>🥱 모처럼 있는 휴일을 뻔하게 보내지 않고 매번 특별한 경험을 남기고 싶은 여러분께.</p>
<p>😫 다가오는 주말엔 또 어디를 가야 좋을지 여기저기 찾아다니는 일이 귀찮은 여러분께.</p>
<p>📨 매주 지금이 아니면 갈 수 없는 장소들을 찾아 성향에 꼭 맞게끔 추려 보내드릴게요.</p>
<form on:submit|preventDefault={onSubmit}>
  <label>
    이메일
    <input type="email" bind:value={email}/>
  </label>
  <label>
    별명
    <input type="text" bind:value={username}/>
  </label>
  <label>
    <input type="checkbox" bind:checked={isPrivacyAgreed}>
    <a href="/privacy">개인정보 수집 및 이용</a>에 동의합니다.
  </label>
  <button type="submit">무료로 구독하기</button>
</form>

<style>
	h1 {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		font-size: 64px;
		font-family: 'Happiness-Sans-Title';
		height: 92px;
	}

  label {
    margin-top: 16px;
  }

  p + p {
    margin-top: 0px;
  }

  button {
    margin-top: 24px;
  }
</style>
