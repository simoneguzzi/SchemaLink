import { Point } from '../Point';
import { AnyGuide } from './AnyGuide';

export const byAscendingError = (a: { error: number }, b: { error: number }) =>
  a.error - b.error;

export class Guides {
  guidelines: AnyGuide[];
  naturalPosition?: Point;
  naturalRadius?: number;
  constructor(
    guidelines: AnyGuide[] = [],
    naturalPosition: Point | undefined = undefined,
    naturalRadius: number | undefined = undefined
  ) {
    this.guidelines = guidelines;
    this.naturalPosition = naturalPosition;
    this.naturalRadius = naturalRadius;
  }
}
