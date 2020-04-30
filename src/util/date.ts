export const hasDateExpired = (date: Date): boolean => {
    return timeRemainingBetweenDateAndNow(date) <= 0;
}
// we can pull in moment to ease our life
export const timeRemainingBetweenDateAndNow = (date: Date): number => {
    const now = new Date();
    const difference = date.getTime() - now.getTime();
    const differenceRounded = Math.round(difference / 1000);
    return differenceRounded;
}