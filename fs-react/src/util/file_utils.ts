
function formatTimestamp(date: Date): string {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}`
        + `_${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function downloadURLWithTimestamp(url: string, filename: string) {
    const timestamp = formatTimestamp(new Date());
    const dotIndex = filename.lastIndexOf('.');
    const stampedFilename = dotIndex >= 0
        ? `${filename.substring(0, dotIndex)}_${timestamp}${filename.substring(dotIndex)}`
        : `${filename}_${timestamp}`;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = stampedFilename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

export default downloadURLWithTimestamp;