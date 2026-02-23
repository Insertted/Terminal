export function getProgressBar(current, total) {
    const size = 20;
    const progress = Math.round((current / total) * size);
    const emptyProgress = size - progress;
    
    const progressText = "#".repeat(progress);
    const emptyProgressText = "-".repeat(emptyProgress);
    const percentage = Math.round((current / total) * 100);
    
    return `[${progressText}${emptyProgressText}] ${percentage}%`;
}