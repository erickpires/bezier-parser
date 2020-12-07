import { BezierParser } from './bezier-parser';
import { bezierPathToUIBezier } from './bezier-to-ui-bezier';

const parser = new BezierParser();
const path = parser.parseBezierPath("M 0,0 H 230.89 V 468.04 H 0 Z m 115.44,122.67 q 50.08,0 90.68,49.85 c 50.08,0 90.68,49.85 90.68,111.35 s 0,61.5 -40.6,111.36 c 0,61.5 -40.6,111.36 -90.68,111.36 -50.07,0 -90.67,-49.86 -90.67,-111.36 0,-61.5 40.6,-111.35 90.67,-111.35 z");

console.log(bezierPathToUIBezier(path));
