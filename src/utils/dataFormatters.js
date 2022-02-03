const indexedArray = (array) =>
    array.map((item, i) => {
        return { ...item, id: i + 1, order: i + 1 };
    });

const sortPoints = (a, b) => {
    if (a.order > b.order) {
        return 1;
    }
    return -1;
};

export { indexedArray, sortPoints };
