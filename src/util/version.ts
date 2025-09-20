export function constructVersionedFileName(filename: string): string {
    const suffix = Date.now().toString(36);

    const dot = filename.lastIndexOf('.');
    if (dot === -1) {
        return `${filename}_${suffix}`;
    }
    const name = filename.slice(0, dot);
    const ext = filename.slice(dot); // .jpg, .png 등
    return `${name}_${suffix}${ext}`;
}