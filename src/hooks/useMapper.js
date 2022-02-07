// eslint-disable-next-line import/prefer-default-export
export const useMapper = () => {
    const mapObj = (data, dataType) => {
        let value;
        switch (dataType) {
            case "drag": {
                value = {
                    index: data.index,
                    point: data.data.reverse(),
                    order: data.card.order,
                    id: data.card.id,
                };
                break;
            }

            case "pushPoint": {
                value = {
                    id: data.coordinates.id,
                    order: data.coordinates.order,
                    coordinates: data.coordinates.point,
                    name: data.draggedName,
                    request: "",
                };
                break;
            }
            default:
                break;
        }
        return value;
    };
    return mapObj;
};
