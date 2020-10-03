<script type="text/typescript" lang="ts">
    let sessionLength  : number = 1;//25;
    let breakLength  : number = 2;//5;
    let currentTime : number = 0;
    let intervalMs = 1000; // 1 second

    let timerInterval = null;

    let sessionIsRunning = false;
    let breakIsRunning = false;

    $: minutes = Math.floor(Number(currentTime / 60000)).toString();
    $: seconds = right("0" + Number((currentTime % 60000) / 1000).toString(), 2);

    $: taskTimeMs = sessionLength * 60 * 1000;
    $: breakTimeMs = breakLength * 60 * 1000;

    function handleTimerTick() {
        currentTime += intervalMs;
        if ((sessionIsRunning && currentTime >= taskTimeMs)
            || (breakIsRunning && currentTime >= breakTimeMs)) {
            console.log("TIME REACHED");
            currentTime = 0;
            if (sessionIsRunning) {
                sessionIsRunning = false;
                breakIsRunning = true;
            }
            else if (breakIsRunning) {
                sessionIsRunning = true;
                breakIsRunning = false;
            }
            else {
                clearInterval(timerInterval); // Should never reach here
            }
            playBeep(5, 500);
        }
    }

    function startClicked() {
        sessionIsRunning = true;
        breakIsRunning = false;

        timerInterval = setInterval(handleTimerTick, intervalMs);
        console.log("STARTED");
    }

    function stopClicked() {
        sessionIsRunning = false;
        breakIsRunning = false;

        clearInterval(timerInterval);
        timerInterval = null;
        console.log("STOPPED");
    }

    function resetClicked() {
        sessionIsRunning = false;
        breakIsRunning = false;

        clearInterval(timerInterval);
        timerInterval = null;
        currentTime = 0;
        console.log("RESET");
    }

    function right(s, len) {
        let slen = s.length;
        let last = slen;
        let first = slen - len;
        if (first < 0)
            first = 0;
        return s.substring(first, last);
    }

    function addAboveOne(num, add) {
        return num + add >= 1 ? num + add : num;
    }

    function playBeep(times, intervalMs) {
        let audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'+Array(1e3).join(123));
        let currentTime = 0;
        let intRef = setInterval(
        function() {
            currentTime++;
            if (currentTime <= times) {
                audio.play();
            }
            else{
            clearInterval(intRef);
        }
        },intervalMs);
    }
</script>

<style>
    body {
        background: #006;
    }
    .length-arrow {
        font-size: 200%;
        text-decoration: none;
    }
</style>

<p>
    Session Length: <a href="#" class="length-arrow" on:click|preventDefault={() => sessionLength = addAboveOne(sessionLength,1)}>&uarr;</a>
    {sessionLength}
    <a href="#" class="length-arrow" on:click|preventDefault={() => sessionLength = addAboveOne(sessionLength,-1)}>&darr;</a>
</p>

<p>
    Break Length: <a href="#" class="length-arrow" on:click|preventDefault={() => breakLength = addAboveOne(breakLength,1)}>&uarr;</a>
    {breakLength}
    <a href="#" class="length-arrow" on:click|preventDefault={() => breakLength = addAboveOne(breakLength,-1)}>&darr;</a>
</p>

{#if sessionIsRunning}
Session is running
{:else if breakIsRunning}
Break time
{:else}
Timer has not been started
{/if}

<h1>Time: {minutes}:{seconds}</h1>

<button on:click={startClicked} disabled="{timerInterval != null}">Start</button>
<button on:click={stopClicked} disabled="{timerInterval == null}">Stop</button>
<button on:click={resetClicked}>Reset</button>
