interface InjectScriptOptions {
    code?: string;
    file?: string;
    isFromExtension?: boolean;
}

function injectScript({ code, file, isFromExtension }: InjectScriptOptions): boolean {
    if (!code && !file) return false;

    const script = document.createElement('script') as any;
    script.type = 'text/javascript';

    if (code && typeof code === 'string') {
        script.innerHTML = code;
        setTimeout(() => script.remove(), 0);
    } else if (file && typeof file === 'string') {
        isFromExtension = isFromExtension === undefined ? true : isFromExtension;
        script.src = isFromExtension ? chrome.runtime.getURL(file) : file;
        script.onload = script.onreadystatechange = function () {
            if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
                script.onload = script.onreadystatechange = null;
                script.remove();
            }
        };
    }

    document.body.appendChild(script);
    return true;
}

export default injectScript;
