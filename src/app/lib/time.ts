export function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const secondsInMinute = 60;
    const secondsInHour = 3600;
    const secondsInDay = 86400;

    if (diffInSeconds < secondsInMinute) {
        // 1分未満の場合
        return `${diffInSeconds}秒前`;
    } else if (diffInSeconds < secondsInHour) {
        // 1時間未満の場合、分で表示
        const minutes = Math.floor(diffInSeconds / secondsInMinute);
        return `${minutes}分前`;
    } else if (diffInSeconds < secondsInDay) {
        // 24時間未満の場合、時間で表示
        const hours = Math.floor(diffInSeconds / secondsInHour);
        return `${hours}時間前`;
    } else {
        // 24時間以上の場合、日で表示
        const days = Math.floor(diffInSeconds / secondsInDay);
        return `${days}日前`;
    }
}
