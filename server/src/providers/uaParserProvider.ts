import UAParser from "ua-parser-js";

// types and interfaces
export interface IuaParserProvider {
    getCleanUserAgent(userAgent : string) : string;
}


export class UAParserJsUaParserProvider implements IuaParserProvider {
    getCleanUserAgent(userAgent: string): string {
        const parser = new UAParser(userAgent);

        const browserName = parser.getBrowser().name || 'unknown';
        const osName = parser.getOS().name || 'unknown';
        const deviceType = parser.getDevice().type || 'unknown'
        const engineName = parser.getEngine().name || 'unknown';

        return `${browserName}-${osName}-${deviceType}-${engineName}`;
    }
}