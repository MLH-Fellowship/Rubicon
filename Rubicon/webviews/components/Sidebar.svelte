<script lang="ts">
  let todos: Array<{ text: string; completed: boolean }> = [];
  let text = "";
</script>

<h1>Start Documentation</h1>
<img
  src="https://i.pinimg.com/originals/58/69/c3/5869c33465ee74da4d210a02fed95cd7.gif"
  alt="Girl in a jacket"
  width="500"
  height="600"
/>

<p>Write short notes:</p>
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
      class:complete={todo.completed}
      on:click={() => {
        todo.completed = !todo.completed;
      }}
    >
      {todo.text}
    </li>
  {/each}
</ul>

<button
  on:click={() => {
    tsvscode.postMessage({
      type: "onInfo",
      value: "info message ",
    });
  }}
>
  Export File</button
>

<style>
  .complete {
    text-decoration: line-through;
  }
</style>
