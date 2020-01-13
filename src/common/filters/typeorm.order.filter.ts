function generateOrderFilter(filter: string, entity: string): any {
    switch (filter) {
        case 'revert_alphabet':
            return {[`${entity}.title`]: 'DESC'};
        case 'alphabet':
            return {[`${entity}.title`]: 'ASC'};
        case 'newest':
            return {[`${entity}.createdAt`]: 'ASC'};
        case 'popular':
            return {[`${entity}.viewCount`]: 'DESC'};
        case 'favorite':
            return {[`${entity}.favorite`]: 'DESC'};
        default:
            return {[`${entity}.createdAt`]: 'ASC'};
    }
}

export { generateOrderFilter };
