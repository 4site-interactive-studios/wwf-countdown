# WWF Countdown Timer

Counts down to a specified DateTime, optionally to a given timezone (UTC offset) or defaults to user's local time.

Include the script in `/src/index.js` on your page and add the following code:

```js
window.CountdownOptions = {
  el: '.countdown', // element where the component should mount
  date: '2023-04-07', // yyyy-mm-dd
  time: '00:00', // hh:mm
  timezone: -4 // hours in relation to UTC || false for local time
}
```

`index.html` contains code for a generator that creates the above snippet from a UI.

`demo.html` has a demo of the component
