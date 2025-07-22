# HTML streaming animation

Was curious if it's possible to preview and animate partial HTML which is being streamed (e.g. from an LLM)

It turns out, yes, but with some caveats like performance considerations and subtle visual glitches

https://github.com/user-attachments/assets/d7c89732-ef3a-4bb9-85fe-c906c4093a93

## How it works

- [React implementation (main one)](https://github.com/one-with-violets-in-her-lap/html-streaming-animation/tree/main/src)
- [Vanilla TS implementation (not maintained)](https://github.com/one-with-violets-in-her-lap/html-streaming-animation/tree/vanilla-typescript/src)

If you make an isolated iframe and periodically update the the `srcdoc` attr, you end up with short blinking.
So the current approach is to [update an iframe incrementally](./src/components/page-preview.tsx) via DOM diffing

Then, to add new element animations, I injected custom CSS styles in an iframe. And that's basically all

What is nice is that HTML forgives you any syntax errors and just renders, you don't have to deal with fixing them

## Possible enhancements

- [ ] Use a shadow DOM to isolate styles instead of an iframe
