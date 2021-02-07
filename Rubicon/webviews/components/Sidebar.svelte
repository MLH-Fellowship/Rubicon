<!--<script lang="ts" ✂prettier:content✂="CiAgbGV0IGRvY3MgPSBbXTsKICBsZXQgY291bnQgPSAwOwo=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=" ✂prettier:content✂="e30=">{}</script><div>{count}</div>
<button
  on:click={() => {
    count++;
  }}
  >increment
</button>
<input /><style ✂prettier:content✂="CiAgZGl2IHsKICAgIGNvbG9yOiBwaW5rOwogIH0K77+977+977+977+9J++/vXLvv73vv716ew==" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂="" ✂prettier:content✂=""></style>-->
<script lan="ts">
  // let todos: Array<{ text: string; completed: boolean }> = [];
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
  // });
</script>

<button
  on:click={() => {
    tsvscode.postMessage({
      type: "onInfo",
      value: "info message ",
    });
  }}
>
  click me</button
>

<button
  on:click={() => {
    tsvscode.postMessage({
      type: "onError",
      value: "error message ",
    });
  }}
>
  error
</button>
