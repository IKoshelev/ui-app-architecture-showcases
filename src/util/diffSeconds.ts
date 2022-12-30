import moment from "moment";

export function diffSeconds(expiration: Date, currentDate: Date){
    var duration = moment.duration(moment(expiration).diff(currentDate));
    var seconds = Math.round(duration.asSeconds());
    return seconds;
}