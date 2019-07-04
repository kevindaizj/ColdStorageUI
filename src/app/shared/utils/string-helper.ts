export function trim(str: string): string {
    if (!str)
        return null;

    if (!String.prototype.trim)
        return str.trim();
    else
        return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
}

export function containsStr(str: string, subStr: string, caseSensitive = false): boolean {
    str = trim(str + '');
    subStr = trim(subStr + '');

    if (!str || !subStr)
        return false;

    if (!caseSensitive) {
        str = str.toUpperCase();
        subStr = subStr.toUpperCase();
    }

    if (str.indexOf(subStr) !== -1)
        return true;
    else
        return false;
}
