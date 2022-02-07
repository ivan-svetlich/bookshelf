import { DateTime } from "luxon";

function formatDate(date: Date) {
    const dateTime = DateTime.fromISO(date.toString(), {zone: 'utc'}).setZone();

    if(Math.floor(dateTime.diffNow('days').days) > 1) {
        return dateTime.toRelativeCalendar();
    }
    else {
        return dateTime.toRelative();
    }  
}

export default formatDate;