export interface Config {
    /**
     * The design grid to check against, if the project has one. There is no
     * sensible default — twelve columns at 24 means nothing without knowing the
     * system — so it stays off until described.
     */
    grid: {
        columns: number;
        gutter: number;
        margin: number;
        maxWidth: number;
    } | null;
    /** Extra CSS selector to skip when hit-testing. */
    ignore: string;
    hotkey: string;
    /** Hides or brings back the box model panel, while the tool is open. */
    panelKey: string;
    /** Shows or hides the rulers, while the tool is open. */
    rulerKey: string;
    /**
     * Drops a guide at the cursor. Two keys rather than one key plus shift:
     * anyone told to "press G" types a capital G, and a modifier you hold by
     * reflex cannot carry meaning.
     */
    guideKeys: {
        vertical: string;
        horizontal: string;
    };
    /**
     * Which way the tool's own surfaces read.
     *
     * `auto` works out whether the page is dark from an explicit `color-scheme`,
     * then from the background it actually paints, and only falls back to the
     * machine's preference when the page says nothing. That is right almost
     * always, and it can be fooled: a mid-grey ground sits near the threshold,
     * and a transparent body over a full-page image tells it nothing true. This
     * is the way out when it guesses wrong.
     */
    theme: 'auto' | 'light' | 'dark';
}
export declare const DEFAULTS: Config;
export declare function mergeConfig(partial?: Partial<Config>): Config;
/** Elements that are never worth measuring, plus the user's escape hatch. */
export declare const SKIP_SELECTOR: string;
export declare function skipSelector(cfg: Config): string;
