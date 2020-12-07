import { Point, Move, Line, QuadraticCurve, CubicCurve, ClosePath } from './model/bezier-commands';
import { BezierPath } from './model/bezier-path';

function pointToCGPoint(point: Point): string {
    return `CGPoint(x: ${point.x}, y: ${point.y})`
}

function moveCommandToUIBezier(command: Move):string {
    return `path.move(to: ${pointToCGPoint(command.destinationPoint)})`;
}

function lineCommandToUIBezier(command: Line): string {
    return `path.addLine(to: ${pointToCGPoint(command.endPoint)})`
}

function quadraticCurveCommandToUIBezier(command: QuadraticCurve): string {
    return `path.addQuadCurve(to: ${pointToCGPoint(command.endPoint)}, controlPoint: ${pointToCGPoint(command.controlPoint)})`;
}

function cubicCurveCommandToUIBezier(command: CubicCurve): string {
    return `path.addCurve(to: ${pointToCGPoint(command.endPoint)}, controlPoint1: ${pointToCGPoint(command.controlPoint1)}, controlPoint2: ${pointToCGPoint(command.controlPoint2)})`;
}

export function bezierPathToUIBezier(bezierPath: BezierPath): string {
    let result = "let path = UIBezierPath()\n"

    bezierPath.path.forEach(elem => {
        if (elem instanceof Move) {
            result += `${moveCommandToUIBezier(elem)}\n`;
        }

        if (elem instanceof Line) {
            result += `${lineCommandToUIBezier(elem)}\n`;
        }

        if (elem instanceof QuadraticCurve) {
            result += `${quadraticCurveCommandToUIBezier(elem)}\n`;
        }

        if (elem instanceof CubicCurve) {
            result += `${cubicCurveCommandToUIBezier(elem)}\n`;
        }

        if (elem instanceof ClosePath) {
            result += `path.close()\n`;
        }
    });

    return result;
}
