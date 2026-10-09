//! Wed Mar 13 2024 00:00:00 GMT+0600 (Bangladesh Standard Time) => 2024-03-12 18:00:00
export const formatDate = (date, endTime = false) => {

    let year = date.getFullYear();
    let month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero based
    let day = ("0" + date.getDate()).slice(-2);
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let seconds = ("0" + date.getSeconds()).slice(-2);
    if (endTime) {
        return `${year}-${month}-${day} 23:59:59`;
    } 
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
