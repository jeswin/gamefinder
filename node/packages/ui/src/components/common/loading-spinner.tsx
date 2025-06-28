import { component } from "magic-loop";

component("loading-spinner", async function* (_component) {
  while (true) {
    yield (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <span>Loading...</span>
      </div>
    );
  }
});