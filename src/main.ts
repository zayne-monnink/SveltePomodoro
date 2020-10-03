import App from './App.svelte';
import Timer from './Timer.svelte';

var timer = new Timer({
	//target: document.body
	target: document.querySelector("Timer")
});

export default timer;