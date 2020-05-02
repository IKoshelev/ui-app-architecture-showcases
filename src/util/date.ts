export const hasDateExpired = (date: Date): boolean => {
    return timeRemainingBetweenDateAndNow(date) <= 0;
}

export const timeRemainingBetweenDateAndNow = (date: Date): number => {
    const now = new Date();
    const difference = date.getTime() - now.getTime();
    const differenceRounded = Math.round(difference / 1000);
    return differenceRounded;
}


export const secondsBetween = (dateA: Date, dateB: Date): number => {
    const difference = dateA.getTime() - dateB.getTime();
    const differenceRounded = Math.round(difference / 1000);
    return Math.abs(differenceRounded);
}