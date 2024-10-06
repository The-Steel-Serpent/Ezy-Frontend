export const handleBeforeInput = (e) => {
    const char = e.data;
    if (!char.match(/[0-9]/)) {
        e.preventDefault();
    }
};

