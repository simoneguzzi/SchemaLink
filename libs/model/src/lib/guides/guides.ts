import { Point } from '../Point';

export const byAscendingError = (a: { error: number }, b: { error: number }) =>
  a.error - b.error;

export class Guides {
  guidelines: any[];
  naturalPosition?: Point;
  naturalRadius?: number;
  constructor(
    guidelines = [],
    naturalPosition: Point | undefined = undefined,
    naturalRadius: number | undefined = undefined
  ) {
    this.guidelines = guidelines;
    this.naturalPosition = naturalPosition;
    this.naturalRadius = naturalRadius;
  }
}
