/**
 * Lets the studio preview a prop change on the running page. React's dev build only offers `overrideProps` (its way of
 * changing a mounted component's props) to a `__REACT_DEVTOOLS_GLOBAL_HOOK__` that exists before react-dom loads, so
 * this installs a bare one first. Development only, only when framed by the studio, and never over a hook that is
 * already there (the React DevTools extension): a normal visit changes nothing.
 */
const STUB = `(function(){
  var w = window;
  if (w.parent === w || w.__REACT_DEVTOOLS_GLOBAL_HOOK__) return;
  var renderers = new Map(), id = 0, noop = function(){};
  w.__REACT_DEVTOOLS_GLOBAL_HOOK__ = {
    supportsFiber: true, renderers: renderers,
    inject: function(r){ renderers.set(++id, r); return id; },
    onCommitFiberRoot: noop, onCommitFiberUnmount: noop, onPostCommitFiberRoot: noop, checkDCE: noop
  };
})();`;

/**
 * A plain inline script, rendered inside <head>: `next/script`'s beforeInteractive is queued behind Next's own chunks in
 * a dev build, and runs after react-dom has already loaded, which is too late.
 */
export function StudioPreviewHook() {
  if (process.env.NODE_ENV !== "development") return null;
  return <script dangerouslySetInnerHTML={{ __html: STUB }} />;
}
