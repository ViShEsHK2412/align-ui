export interface Config {
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
}
export declare const DEFAULTS: Config;
export declare function mergeConfig(partial?: Partial<Config>): Config;
/** Elements that are never worth measuring, plus the user's escape hatch. */
export declare const SKIP_SELECTOR: string;
export declare function skipSelector(cfg: Config): string;
