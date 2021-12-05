import * as _ from 'lodash';

import { IUser } from '../interfaces/Entities';

export default class ArrayUtils {

    public static splitIntoChunks<T>(items: T[], chunkSize: number): T[][] {
        return items.reduce((chunks: T[][], item: T, index) => {
            const chunkIndex = Math.floor(index / chunkSize);
            chunks[chunkIndex] = ([] as T[]).concat(chunks[chunkIndex] || [], item);
            return chunks;
        }, []);
    }

    public static groupBy<T extends IUser, Key extends keyof T>(items: T[], groupByProperty: Key, undefinedGroup: string = 'others'): {[property: string]: T[]} {
        return items.reduce((memo, item) => {
            const group = groupByProperty in item ? String(item[groupByProperty]) : undefinedGroup;
            if (!memo[group]) {
                memo[group] = [];
            }
            memo[group].push(item);
            return memo;
        }, {} as {[property: string]: T[]});
    }

    public static filterDuplicates<T>(items: T[]): T[] {
        return _.uniqWith(items, _.isEqual);
    }
}