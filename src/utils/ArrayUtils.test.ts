
import ArrayUtils from "./ArrayUtils";
import { IUser } from '../interfaces/Entities';

const testArray: IUser[]  = [
    {userName: 'pippo', country: 'it'},
    {userName: 'pluto', country: 'fr'},
    {userName: 'topolino', country: 'it'},
    {userName: 'gambadilegno', country: 'uk'},
    {userName: 'clarabella', country: 'uk'},
    {userName: 'orazio', country: 'it'},
    {userName: 'paperone'},
    {userName: 'paperino'},
    {userName: 'paperoga', country: 'us'},
    {userName: 'gastone', country: 'us'},
]

test('empty array', () => {
    const chunks = ArrayUtils.splitIntoChunks([], 3);
    expect(chunks.length).toBe(0);

    const groups = ArrayUtils.groupBy([], 'country', 'others');
    expect(Object.keys(groups).length).toBe(0);

    const empty = ArrayUtils.filterDuplicates([]);
    expect(empty.length).toBe(0);
})


test('splitIntoChunks', () => {
    const chunkLength = 3;
    const chunks = ArrayUtils.splitIntoChunks(testArray, chunkLength);
    const numChunksExpected = Math.ceil(testArray.length / chunkLength);
    const expectedLastChunkLength = testArray.length % chunkLength ? testArray.length % chunkLength : chunkLength;
    expect(chunks.length).toBe(numChunksExpected);
    expect(chunks[0].length).toBe(chunkLength);
    expect(chunks[chunks.length - 1].length).toBe(expectedLastChunkLength);
});

test('groupBy', () => {
    const groups = ArrayUtils.groupBy(testArray, 'country', 'others');

    expect(Object.keys(groups).length).toBe(5);
    expect(groups['it'].length).toBe(3);
    expect(groups['uk'].length).toBe(2);
    expect(groups['fr'].length).toBe(1);
    expect(groups['others'].length).toBe(2);
});

test('filterDuplicates', () => {
    const arrayWithDuplicates = testArray.concat(testArray, testArray);

    const filtered = ArrayUtils.filterDuplicates(arrayWithDuplicates);

    expect(filtered.length).toBe(testArray.length);
    expect(filtered[0].userName).toBe(testArray[0].userName);
    expect(filtered[1].userName).toBe(testArray[1].userName);
});