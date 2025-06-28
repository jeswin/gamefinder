import { component } from "magic-loop";

component("button-primary", async function* (component: any) {
  while (true) {
    yield (
      <button 
        className={`btn-primary ${component.disabled ? 'disabled' : ''}`}
        disabled={component.disabled}
        onclick={component.onclick}
      >
        <slot></slot>
      </button>
    );
  }
}, { disabled: false });