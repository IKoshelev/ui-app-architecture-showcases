let app = 0;
let app2 = 0;

export function onRenderCallback(
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions // the Set of interactions belonging to this update
  ) {
    console.log('id', id);
    // console.log('actualDuration', actualDuration);
    // console.log('interactions', interactions)
    if (id === 'App') {
      app = app + actualDuration;
      console.log('total duration app', app);
    }
    if (id === 'App2') {
      app2 = app2 + actualDuration;
      console.log('total duration app2', app2);
    }
  }