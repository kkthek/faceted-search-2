function downloadURLWithTimestamp(url: string, filename: string) {

    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}

export default downloadURLWithTimestamp;