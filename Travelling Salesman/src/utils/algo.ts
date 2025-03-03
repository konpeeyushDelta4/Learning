const algo = (pos: number, mask: number, dp: number[][], allCitiesAreVisited: number, cost: number[][]): number => {
    //if all cities are visited
    if (mask === allCitiesAreVisited) {
        return cost[pos][0];
    }

    //if already calculated
    if (dp[pos][mask] !== -1) {
        return dp[pos][mask];
    }

    let ans: number = Number.MAX_SAFE_INTEGER;

    //try to visit all cities

    for (let city: number = 0; city < cost.length; city++) {

        //condition will fail if city is already visited
        if ((mask & (1 << city)) === 0) {
            
            //new cost
            const newAns: number = cost[pos][city] + algo(city, mask | (1 << city), dp, allCitiesAreVisited, cost);
            ans = Math.min(ans, newAns);
        }
    }

    return dp[pos][mask] = ans;
}


export const cost: number[][] = [
    [0, 10, 15, 20], [10, 0, 35, 25], [15, 35, 0, 30],
    [20, 25, 30, 0]
];

export const tsp = (cost: number[][]): number => {

    const n: number = cost.length;

    // all cities are visited (base case)
    const allCitiesAreVisited: number = (1 << n) - 1;
    // dp array to store the minimum cost for each city while visiting all cities
    const dp: number[][] = new Array(n).fill(0).map(() => new Array(1 << n).fill(-1));
    // initial position is 0 and mask is 1
    return algo(0, 1, dp, allCitiesAreVisited, cost);
}
