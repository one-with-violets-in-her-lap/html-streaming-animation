export function getHtmlElementBySelectorOrThrow(selector: string) {
  const element = document.querySelector(selector);

  if (!(element instanceof HTMLElement)) {
    throw new Error(
      `Element ${selector} cannot be found (or it is not an HTMLElement)`,
    );
  }

  return element;
}
