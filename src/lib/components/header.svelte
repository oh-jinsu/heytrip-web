<header>
  <img src="hanriver.jpg" alt="" />
  <div class="shadow" />
  <a href="/">
    <h1>Heytrip</h1>
  </a>
</header>

<style>
  header {
    position: relative;

    display: flex;

    flex-direction: column;

    align-items: center;

    width: 100%;
    height: 128px;

    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;

    object-position: 50% 56%;
  }

  .shadow {
    position: absolute;

    content: "";

    width: 100%;
    height: 100%;

    background-color: black;

    opacity: .125;
  }

  a {
    position: absolute;

    bottom: 0;

    text-decoration: none;
  }

  h1 {
    font-size: 48px;

		font-family: 'Happiness-Sans-Title';

		color: white;
  }
</style>