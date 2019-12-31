import { findSeq, arrayEquals } from "./App";

it("Finds a sequence of 3 or more consecutive numbers in an array of 8 elements", () => {
  let arr = [1, 4, 5, 6, 6, 7];
  expect(findSeq(arr)).toEqual([]);

  arr = [2, undefined, 5, 6, 6, 6, 1, 1];
  expect(findSeq(arr)).toEqual([]);

  arr = [1, 4, 5, 6, 6, 7, 3, 1];
  expect(findSeq(arr)).toEqual([]);

  arr = [2, 4, 5, 6, 6, 6, 1, 1];
  expect(findSeq(arr)).toEqual([[3, 4, 5]]);

  arr = [4, 4, 4, 4, 7, 7, 7, 7];
  expect(findSeq(arr)).toEqual([[0, 1, 2, 3], [4, 5, 6, 7]]);

  arr = [4, 4, 4, 4, 4, 7, 4, 4];
  expect(findSeq(arr)).toEqual([[0, 1, 2, 3, 4]]);

  arr = [1, 2, 2, 2, 4, 2, 2, 2];
  expect(findSeq(arr)).toEqual([[1, 2, 3], [5, 6, 7]]);

  arr = [2, 2, 2, 2, 2, 8, 8, 8];
  expect(findSeq(arr)).toEqual([[0, 1, 2, 3, 4], [5, 6, 7]]);
});

it("Returns true if two arrays contain the same elements", () => {
  let arr1 = [2, 1, 2, 2, 7, 8, 8, 8];
  let arr2 = [2, 1, 2, 2, 7, 8, 8, 8];
  expect(arrayEquals(arr1, arr2)).toEqual(true);

  arr1 = [];
  arr2 = [];
  expect(arrayEquals(arr1, arr2)).toEqual(true);
});

it("Returns false if two arrays don't contain the same elements", () => {
  let arr1 = [2, 1, 2, 2, 7, 3, 8, 8];
  let arr2 = [2, 1, 2, 3, 7, 8, 8, 8];
  expect(arrayEquals(arr1, arr2)).toEqual(false);

  arr1 = [1];
  arr2 = [];
  expect(arrayEquals(arr1, arr2)).toEqual(false);
});
