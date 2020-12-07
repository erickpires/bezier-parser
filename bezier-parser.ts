import { Point, BezierCommand, Move, Line, QuadraticCurve, CubicCurve, ClosePath } from './model/bezier-commands';
import { BezierPath } from './model/bezier-path';
// NOTE: Using definitions from here:
// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths

const numbersForCommand = {
    "m": 2,
    "l": 2,
    "h": 1,
    "v": 1,
    "c": 6,
    "s": 4,
    "q": 4,
    "t": 2,
    "z": 0
}

export class BezierParser {
    currentPoint: Point;
    oldCubicControlPoint: any;
    oldQuadraticControlPoint: any;

    constructor() {
        this.currentPoint = new Point(0, 0);
        this.oldCubicControlPoint = undefined;
        this.oldQuadraticControlPoint = undefined;
    }

    makeBezierCommand(command: string, numbers: number[]): BezierCommand {
        let result: BezierCommand;

        let isRelative = command == command.toLowerCase();
        switch (command.toLowerCase()) {
            case "m":
                result = Move.fromNumbers(this.currentPoint, numbers, isRelative);
                break;
            case "l":
                result = Line.fromNumbers(this.currentPoint, numbers, isRelative);
                break;
            case "v":
                result = Line.vertical(this.currentPoint, numbers[0], isRelative);
                break;
            case "h":
                result = Line.horizontal(this.currentPoint, numbers[0], isRelative);
                break;
            case "c":
                result = CubicCurve.fromNumbers(this.currentPoint, numbers, isRelative);
                break;
            case "q":
                result = QuadraticCurve.fromNumbers(this.currentPoint, numbers, isRelative);
                break;
            case "s":
                result = CubicCurve.fromNumbersAndOldControlPoint2(this.currentPoint, this.oldCubicControlPoint, numbers, isRelative);
                break;
            case "t":
                result = QuadraticCurve.fromNumbersAndOldControlPoint(this.currentPoint, this.oldQuadraticControlPoint, numbers, isRelative);
                break;
            case "z":
                result = new ClosePath();
        }

        this.currentPoint = result.getEndPoint() || this.currentPoint;
        this.oldCubicControlPoint = result.getControlPoint2();
        this.oldQuadraticControlPoint = result.getControlPoint();

        return result;
    }

    parseBezierPath(bezierString: string): BezierPath {
        let result = new BezierPath();

        bezierString = bezierString.replace(/(\r\n|\n|\r)/g, " ");
        // NOTE: We don't consider the valid separators and simply ignore everything that is not a command character or a number
        let tokens = bezierString.match(/[mMlLhHvVcCsSqQtTzZ]|-?(\d+(\.\d+)?)/g);

        let currentCommand = "";
        let currentNumbers = [];

        tokens.forEach(token => {
            if (/[mMlLhHvVcCsSqQtTzZ]/.test(token)) {
                currentCommand = token;
            }
            else if (/-?(\d+(\.\d+)?)/.test(token)) {
                currentNumbers.push(parseFloat(token));
            }

            if (currentNumbers.length == numbersForCommand[currentCommand.toLowerCase()]) {
                result.add(this.makeBezierCommand(currentCommand, currentNumbers));
                currentNumbers = [];
            }
        });

        return result;
    }
}
