
export const formatDate = (datetime) => {
    const dateTime = new Date(datetime);

    const year = dateTime.getUTCFullYear();
    const month = ('0' + (dateTime.getUTCMonth() + 1)).slice(-2); // Months are zero-based
    const day = ('0' + dateTime.getUTCDate()).slice(-2);
    const hours = ('0' + dateTime.getUTCHours()).slice(-2);
    const minutes = ('0' + dateTime.getUTCMinutes()).slice(-2);
    const seconds = ('0' + dateTime.getUTCSeconds()).slice(-2);

    // Format the date and time in UTC
    const formattedDateTimeManual = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedDateTimeManual;
}
