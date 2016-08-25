
// Return a multiplier in range [1,inf) (where 1 means no bonus)
export function ancestryBonusForLevel(level: number) {
    if (level <= 10) {
        return 1;
    }
    return 1 + Math.log10(level - 9);
}

// Return a multiplier in range [1,inf) (where 1 means no bonus)
export function ancestryBonus(levels: number[]) {
    let multiplier = 1;
    for (let klassLevel of levels) {
        multiplier *= ancestryBonusForLevel(klassLevel);
    }
    return multiplier;
}
