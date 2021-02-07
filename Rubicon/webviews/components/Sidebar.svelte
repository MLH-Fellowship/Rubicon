<!--<script lang="ts" ✂prettier:content✂="CiAgbGV0IGRvY3MgPSBbXTsKICBsZXQgY291bnQgPSAwOwo=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=">{}</script><div>{count}</div>
<button
  on:click={() => {
    count++;
  }}
  >increment
</button>
<input /><style ✂prettier:content✂="CiAgZGl2IHsKICAgIGNvbG9yOiBwaW5rOwogIH0K77+977+977+977+9J++/vXLvv73vv716ew==" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂=""></style>-->
<script lang="ts">
  let todos: Array<{ text: string; completed: boolean }> = [];
  let text = "";
</script>

<!-- // let todos: Array<{ text: string; completed: boolean }> = [];
  // let text = "";
  // onMount(() => {
  //   // Handle messages sent from the extension to the webview
  //   window.addEventListener("message", (event) => {
  //     const message = event.data; // The json data that the extension sent
  //     console.log({ message });
  //     switch (message.type) {
  //       case "new-doc":
  //         newDoc = [{ text: message.value, completed: false }, ...todos];
  //         break;
  //     }
  //   });
  // }); -->

<img
  src="https://i.pinimg.com/originals/58/69/c3/5869c33465ee74da4d210a02fed95cd7.gif"
  alt="Girl in a jacket"
  width="500"
  height="600"
/>

<h2>Write bullet points or short notes:</h2>
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
    <li>{todo.text}</li>
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

<!-- <button
  on:click={() => {
    tsvscode.postMessage({
      type: "onError",
      value: "error message ",
    });
  }}
>
  error
</button>

<button
  on:click={() => {
    tsvscode.postMessage({
      type: "onInfo",
      value: "info message ",
    });
  }}
>
  click me</button
> -->
