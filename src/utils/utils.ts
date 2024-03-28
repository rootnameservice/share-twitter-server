export function getNHoursAfterDate(now: Date, hours: number) {
    now.setHours(now.getHours() + hours);
    return now;
}