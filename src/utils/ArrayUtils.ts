import * as _ from 'lodash';

import { IGenderizePrediction, IUser } from '../interfaces/Entities';

/**
 * Utility class used for handling arrays
 */
export default class ArrayUtils {

    /**
     * Split an array into chunks with max length of chunkSize
     * Eg. ArrayUtils.splitIntoChunks([1, 2, 3, 4, 5], 2) will returns [[1, 2], [3, 4], [5]]
     * @param items array to split
     * @param chunkSize maximum length of each chunk
     * @returns an array of arrays. Each element of the output array is a chunk of the input array
     */
    public static splitIntoChunks<T>(items: T[], chunkSize: number): T[][] {
        return items.reduce((chunks: T[][], item: T, index) => {
            const chunkIndex = Math.floor(index / chunkSize);
            chunks[chunkIndex] = ([] as T[]).concat(chunks[chunkIndex] || [], item);
            return chunks;
        }, []);
    }

    /**
     * Group the items of an array of objects based on the values of a field
     * eg. ArrayUtils.groupBy([
     *  {name: "pippo", country: "it"}, {name: "pluto", country: "it"}, {name: "topolino", country: "uk"}], "country")
     * returns {
     *  "it": [{name: "pippo", country: "it"}, {name: "pluto", country: "it"}],
     *  "uk": [{name: "topolino", country: "uk"}],
     * }
     * @param items array to group by
     * @param groupBy Property property used for grouping
     * @param undefinedGroup label used when the property is not defined 
     * @returns a map of groups, each group is an array
     */
    public static groupBy<T extends IUser | IGenderizePrediction, Key extends keyof T>(items: T[], groupByProperty: Key, undefinedGroup: string = 'others'): {[property: string]: T[]} {
        return items.reduce((memo, item) => {
            const group = groupByProperty in item ? String(item[groupByProperty]) : undefinedGroup;
            if (!memo[group]) {
                memo[group] = [];
            }
            memo[group].push(item);
            return memo;
        }, {} as {[property: string]: T[]});
    }

    /**
     * Removes duplicates from an input array
     * @param items input array
     * @returns an array with only the unique values from the input array
     */
    public static filterDuplicates<T>(items: T[]): T[] {
        return _.uniqWith(items, _.isEqual);
    }
}