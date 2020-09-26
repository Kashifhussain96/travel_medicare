import moment from 'moment';


export function getDateStringFromDate(date) {
    try {
        return moment(date).format('YYYY-MM-DD');
    } catch (e) {
        return ''
    }
}