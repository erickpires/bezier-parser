export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

export interface BezierCommand {
    getEndPoint(): Point;
    getControlPoint(): Point;
    getControlPoint2(): Point
}

export class Move implements BezierCommand {
    destinationPoint: Point;

    constructor(destinationPoint: Point) {
        this.destinationPoint = destinationPoint;
    }

    getEndPoint(): Point {
        return this.destinationPoint;
    }

    getControlPoint(): Point {
        return undefined;
    }

    getControlPoint2(): Point {
        return undefined;
    }

    static fromNumbers(currentPoint: Point, numbers: number[], isRelative: boolean) {
        if (isRelative) {
            return new Move(new Point(currentPoint.x + numbers[0], currentPoint.y + numbers[1]));
        } else {
            return new Move(new Point(numbers[0], numbers[1]));
        }
    }
}

export class Line implements BezierCommand {
    // NOTE: The startPoint is usually not included on a Bezier path and is stored here for completion
    startPoint: Point;
    endPoint: Point;

    constructor(startPoint: Point, endPoint: Point) {
        this.startPoint = startPoint;
        this.endPoint = endPoint;
    }

    getEndPoint(): Point {
        return this.endPoint;
    }

    getControlPoint(): Point {
        return undefined;
    }

    getControlPoint2(): Point {
        return undefined;
    }

    static fromNumbers(currentPoint: Point, numbers: number[], isRelative: boolean): Line {
        if (isRelative) {
            return new Line(currentPoint, new Point(currentPoint.x + numbers[0], currentPoint.y + numbers[1]));
        } else {
            return new Line(currentPoint, new Point(numbers[0], numbers[1]));
        }
    }

    static vertical(currentPoint: Point, verticalValue: number, isRelative: boolean): Line {
        if (isRelative) {
            return new Line(currentPoint, new Point(currentPoint.x, currentPoint.y + verticalValue));
        } else {
            return new Line(currentPoint, new Point(currentPoint.x, verticalValue));
        }
    }

    static horizontal(currentPoint: Point, horizontalValue: number, isRelative: boolean): Line {
        if (isRelative) {
            return new Line(currentPoint, new Point(currentPoint.x + horizontalValue, currentPoint.y));
        } else {
            return new Line(currentPoint, new Point(horizontalValue, currentPoint.y));
        }
    }
}

export class QuadraticCurve implements BezierCommand {
    // NOTE: The startPoint is usually not included on a Bezier path and is stored here for completion
    startPoint: Point;
    controlPoint: Point;
    endPoint: Point;

    constructor(startPoint: Point, controlPoint: Point, endPoint: Point) {
        this.startPoint = startPoint;
        this.controlPoint = controlPoint;
        this.endPoint = endPoint;
    }

    getEndPoint(): Point {
        return this.endPoint;
    }

    getControlPoint(): Point {
        return this.controlPoint;
    }

    getControlPoint2(): Point {
        return undefined;
    }

    static fromNumbers(currentPoint: Point, numbers: number[], isRelative: boolean): QuadraticCurve {
        if (isRelative) {
            return new QuadraticCurve(
                currentPoint,
                new Point(currentPoint.x + numbers[0], currentPoint.y + numbers[1]),
                new Point(currentPoint.x + numbers[2], currentPoint.y + numbers[3])
            );
        } else {
            return new QuadraticCurve(
                currentPoint,
                new Point(numbers[0], numbers[1]),
                new Point(numbers[2], numbers[3])
            );
        }
    }

    static fromNumbersAndOldControlPoint(currentPoint: Point, oldControlPoint: Point, numbers: number[], isRelative: boolean): QuadraticCurve {
        let controlPoint: Point;
        if (oldControlPoint == undefined) {
            controlPoint = currentPoint;
        } else {
            // d = p - cp2
            // cp1' = p + d = p + p - cp2 = 2p - cp2
            controlPoint = new Point(2 * currentPoint.x - oldControlPoint.x, 2 * currentPoint.y - oldControlPoint.y);
        }

        if (isRelative) {
            return new QuadraticCurve(
                currentPoint,
                controlPoint,
                new Point(currentPoint.x + numbers[0], currentPoint.y + numbers[1])
            );
        } else {
            return new QuadraticCurve(
                currentPoint,
                controlPoint,
                new Point(numbers[0], numbers[1])
            );
        }
    }
}

export class CubicCurve implements BezierCommand {
    // NOTE: The startPoint is usually not included on a Bezier path and is stored here for completion
    startPoint: Point;
    controlPoint1: Point;
    controlPoint2: Point;
    endPoint: Point;

    constructor(startPoint: Point, controlPoint1: Point, controlPoint2: Point, endPoint: Point) {
        this.startPoint = startPoint;
        this.controlPoint1 = controlPoint1;
        this.controlPoint2 = controlPoint2;
        this.endPoint = endPoint;
    }

    getEndPoint(): Point {
        return this.endPoint;
    }

    getControlPoint(): Point {
        return undefined;
    }

    getControlPoint2(): Point {
        return this.controlPoint2;
    }

    static fromNumbers(currentPoint: Point, numbers: number[], isRelative: boolean): CubicCurve {
        if (isRelative) {
            return new CubicCurve(
                currentPoint,
                new Point(currentPoint.x + numbers[0], currentPoint.y + numbers[1]),
                new Point(currentPoint.x + numbers[2], currentPoint.y + numbers[3]),
                new Point(currentPoint.x + numbers[4], currentPoint.y + numbers[5])
            );
        } else {
            return new CubicCurve(
                currentPoint,
                new Point(numbers[0], numbers[1]),
                new Point(numbers[2], numbers[3]),
                new Point(numbers[4], numbers[5])
            );
        }
    }

    static fromNumbersAndOldControlPoint2(currentPoint: Point, oldControlPoint2: Point, numbers: number[], isRelative: boolean): CubicCurve {
        let controlPoint1: Point;
        if (oldControlPoint2 == undefined) {
            controlPoint1 = currentPoint;
        } else {
            // d = p - cp2
            // cp1' = p + d = p + p - cp2 = 2p - cp2
            controlPoint1 = new Point(2 * currentPoint.x - oldControlPoint2.x, 2 * currentPoint.y - oldControlPoint2.y);
        }

        if (isRelative) {
            return new CubicCurve(
                currentPoint,
                controlPoint1,
                new Point(currentPoint.x + numbers[0], currentPoint.y + numbers[1]),
                new Point(currentPoint.x + numbers[2], currentPoint.y + numbers[3])
            );
        } else {
            return new CubicCurve(
                currentPoint,
                controlPoint1,
                new Point(numbers[0], numbers[1]),
                new Point(numbers[2], numbers[3])
            );
        }
    }
}

// TODO: Implement ARCS

export class ClosePath implements BezierCommand {
    getEndPoint(): Point {
        return undefined;
    }

    getControlPoint(): Point {
        return undefined;
    }

    getControlPoint2(): Point {
        return undefined;
    }
}
