import { component } from "magic-loop";

component("main-layout", async function* (component: any) {
  while (true) {
    yield (
      <div className="main-layout">
        <app-header user={component.user}></app-header>
        <main className="main-content">
          <slot></slot>
        </main>
      </div>
    );
  }
});