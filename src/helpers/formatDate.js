export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
}

export const formatTime = (dateString) => {
    const timer = new Date(dateString);
    const hours = timer.getHours().toString();
    const mins = timer.getMinutes().toString();
    return `${hours}:${mins}`;
}