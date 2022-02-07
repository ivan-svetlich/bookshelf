import { DateTime } from "luxon";

function formatDateTime(date: Date) {
    const dateTime = DateTime.fromISO(date.toString(), {zone: 'utc'}).setZone();

    if(dateTime.startOf('day').diff(DateTime.now().startOf('day'), 'days').days >= -1) {
        return dateTime.toRelativeCalendar() + ', ' + dateTime.toLocaleString(DateTime.TIME_SIMPLE);
    }
    else {
        return dateTime.toLocaleString(DateTime.DATETIME_MED);
    }  
    
}

export default formatDateTime;