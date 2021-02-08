<script lang="ts">
  let todos: Array<{ text: string; completed: boolean }> = [];
  let text = "";

  let files = [];

  let value = `Add description. Some words are *italic*, some are **bold**`;

  // not enough space for these:   let questions = [
  // 	{ id: 1, text: `Export as HTML` },
  // 	{ id: 2, text: `Export as PDF` },
  // 	{ id: 3, text: `Export as Github README` }
  //   { id: 4, text: `Export as text` }
  // ];

  // let selected=[];

  // let answer = '';
  // function handleSubmit() {
  // 	alert(`file has been exported!"`);
  // }
</script>

<h1 class="text-style">Start Documentation</h1>
<ul class="text-style margin">
  <li>text, code snippet, and image support</li>
  <li>export files or save for later</li>
</ul>
<img
  src="https://i.pinimg.com/originals/58/69/c3/5869c33465ee74da4d210a02fed95cd7.gif"
  alt="Girl in a jacket"
  width="500"
  height="600"
/>
<form class="content">
  <label class="text-style"> Project Title</label>
  <input type="text" />
</form>

<textarea bind:value />

<p class="text-style margin">Write short notes:</p>
<form
  on:submit|preventDefault={() => {
    todos = [{ text, completed: false }, ...todos];
    text = "";
  }}
>
  <input bind:value={text} />
</form>

<ul>
  {#each todos as todo (todo.text)}
    <li
      class="content "
      class:complete={todo.completed}
      on:click={() => {
        todo.completed = !todo.completed;
      }}
    >
      {todo.text}
    </li>
  {/each}
</ul>

<div>
  <input class="margin" type="file" bind:files />

  {#if files && files[0]}
    <p>
      {files[0].name}
    </p>
  {/if}
</div>

<form on:submit|preventDefault={handleSubmit}>
  <!-- <select value={selected} on:change={() => (answer = "")}>
    {#each questions as question}
      <option value={question}>
        {question.text}
      </option>
    {/each}
  </select>

  <input bind:value={answer} /> -->

  <button
    class="text-style margin"
    on:click={() => {
      tsvscode.postMessage({
        type: "onInfo",
        value: "info message ",
      });
    }}
  >
    Export File</button
  >
</form>

<style>
  .complete {
    text-decoration: line-through;
  }

  .content {
    display: grid;
    grid-template-columns: 20% 80%;
    grid-column-gap: 10px;
  }

  .text-style {
    font-family: ocr-a-std, monospace;
    font-weight: 500;
    font-style: normal;
  }
  p {
    font-size: 15px;
  }
  textarea {
    width: 100%;
    height: 200px;
  }
  .margin {
    margin-top: 5%;
  }

  button {
    border-radius: 12px;
    box-shadow: 0px 8px 15px rgba(112, 198, 255, 0.1);
    transition: all 0.3s ease 0s;
    cursor: pointer;
    outline: none;
  }

  input {
    display: block;
    width: 500px;
    max-width: 100%;
  }
</style>
