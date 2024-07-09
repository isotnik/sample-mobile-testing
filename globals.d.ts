
declare global {
    // @ts-expect-error for eslint
    const driver: WebdriverIO.Browser;
    // @ts-expect-error for eslint
    const $: typeof import('@wdio/globals').$;
    // @ts-expect-error for eslint
    const $$: typeof import('@wdio/globals').$$;
    // @ts-expect-error for eslint
    const expect: typeof import('@wdio/globals').expect;
}

export {}