import { InitOptions } from '../types/options';
export declare class Options {
    beforeAppAjaxSend: Function;
    afterAppAjaxClose: Function;
    enableTraceId: Boolean;
    filterXhrUrlRegExp: RegExp;
    includeHttpUrlTraceIdRegExp: RegExp;
    traceIdFieldName: string;
    constructor();
    bindOptions(options?: InitOptions): void;
}
declare const options: Options;
export declare function setTraceId(httpUrl: string, callback: (headerFieldName: string, traceId: string) => void): void;
export { options };
