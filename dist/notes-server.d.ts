/**
 * The dev-server half of notes: take a screenshot from the page, put it on
 * disk inside the project, and say where.
 *
 * A page can save a file only by downloading it, and it is never told where
 * the download went — so a pasted note could name a file but not find it. A
 * dev server can write wherever it likes and knows the absolute path it wrote
 * to, which is what makes "open this path" work for the agent reading the
 * paste. That is the whole reason this exists.
 *
 * It writes files on request, so it is written like it does:
 *
 * - The name is chosen here, never taken from the request. Nothing a page
 *   sends can steer where a file lands.
 * - Only PNGs, checked by their signature rather than by what the request
 *   claims, and only up to a size a screenshot can reasonably be.
 * - Cross-site requests are refused. A dev server reachable on the network
 *   (`--host`) is visitable by any page in a browser on that network, and
 *   `Sec-Fetch-Site` is set by the browser, not by the page, so it cannot be
 *   forged from one.
 * - Deletes take a name that matches the pattern names are made with, so a
 *   delete can only ever reach a file this wrote.
 *
 * No dependencies and no Vite types, so the same function mounts in any
 * Connect-style server.
 */
export declare const NOTES_ROUTE = "/__align/notes";
/** The only names this ever writes, and so the only ones it will delete. */
export declare const NOTE_FILE: RegExp;
export declare function isPng(bytes: Uint8Array): boolean;
export declare function noteFileName(now?: number, rand?: string): string;
/** The subset of Node's request and response this touches. */
interface Req {
    method?: string;
    url?: string;
    headers: Record<string, string | string[] | undefined>;
    on(event: 'data', cb: (chunk: Uint8Array) => void): unknown;
    on(event: 'end' | 'error', cb: (err?: unknown) => void): unknown;
    destroy(): void;
}
interface Res {
    statusCode: number;
    setHeader(name: string, value: string): void;
    end(body?: string | Uint8Array): void;
}
export type Next = (err?: unknown) => void;
export declare function notesMiddleware(root: string): (req: Req, res: Res, next: Next) => Promise<void>;
export {};
