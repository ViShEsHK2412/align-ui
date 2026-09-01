/**
 * X-ray: outline every element on the page at once.
 *
 * The only thing in the tool that writes to the host document's styles, which
 * is why it is the whole of this file and why it cleans up after itself.
 */
export declare function setXray(on: boolean): void;
