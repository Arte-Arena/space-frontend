function formatLabel(field: string) {
    return field
        .replace(/_/g, ' ')
        .replace(/^./, str => str.toUpperCase());
}

export default formatLabel;