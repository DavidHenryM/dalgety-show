// Ensure React act(...) is enabled before React is imported in tests.
// @ts-expect-error - set for tests
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
// @ts-expect-error - set for tests
global.IS_REACT_ACT_ENVIRONMENT = true;
if (typeof window !== "undefined") {
	// @ts-expect-error - set for tests
	window.IS_REACT_ACT_ENVIRONMENT = true;
}
