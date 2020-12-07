import { BezierCommand } from './bezier-commands';

export class BezierPath {
    path: BezierCommand[];

    constructor() {
        this.path = [];
    }

    add(bezierElement: BezierCommand) {
        this.path.push(bezierElement);
    }
}
