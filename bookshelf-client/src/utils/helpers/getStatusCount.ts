import BookEntry from "../../types/bookEntry";

type StatusCount = {
    '1': number,
    '2': number,
    '3': number,
    '4': number,
    '5': number,
}
type Status = '1' | '2' | '3' | '4' | '5';

const getStatusCount = (booklist: BookEntry[]) => {
    const statusCount = booklist.reduce( 
        (acc, o) => {
            if(o.status){
                (acc as StatusCount)[o.status as Status] = ((acc as StatusCount)[o.status as Status] || 0) + 1;
            }
            return acc;
        }, {} );
    return statusCount as StatusCount;
}

export default getStatusCount;
