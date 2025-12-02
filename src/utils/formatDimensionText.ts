// Utility to format dimension text for PendingPostShow and similar components
export function formatDimensionText(post: any) {
    if (post.dimensionText) {
        const match = post.dimensionText.match(/(\d+)\s*[xX]\s*(\d+)\s*[xX]\s*(\d+)/);
        if (match) {
            return `${match[1]} x ${match[2]} x ${match[3]}`;
        }
    }
    return `${post.length} x ${post.width} x ${post.height}`;
}
