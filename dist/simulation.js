export class Vector {
    x;
    y;
    mag;
    startAngle;
    startX;
    startY;
    rotation;
    constructor(x, y, r = 0) {
        this.x = x;
        this.y = y;
        this.mag = pythag(x, y);
        this.startAngle = radToDeg(Math.atan2(y, x));
        this.startX = x;
        this.startY = y;
        this.rotation = r;
        this.setRotation();
    }
    rotate(deg) {
        this.rotation += deg;
        this.setRotation();
        return this;
    }
    rotateTo(deg) {
        this.rotation = deg;
        this.setRotation();
        return this;
    }
    setRotation() {
        this.rotation = minimizeRotation(this.rotation);
        const deg = this.rotation * (Math.PI / 180);
        this.x = this.startX * Math.cos(deg) - this.startY * Math.sin(deg);
        this.y = this.startX * Math.sin(deg) + this.startY * Math.cos(deg);
    }
    draw(c, pos = new Point(0, 0), color = new Color(0, 0, 0), thickness = 1) {
        c.beginPath();
        c.strokeStyle = color.toHex();
        c.lineWidth = thickness;
        c.moveTo(pos.x, pos.y);
        c.lineTo(pos.x + this.x, pos.y + this.y);
        c.stroke();
        c.closePath();
    }
    normalize() {
        if (this.mag != 0) {
            this.x /= this.mag;
            this.startX /= this.mag;
            this.y /= this.mag;
            this.startY /= this.mag;
            this.mag = 1;
        }
        return this;
    }
    multiply(n) {
        this.x *= n;
        this.startX *= n;
        this.y *= n;
        this.startY *= n;
        this.mag *= n;
        return this;
    }
    sub(v) {
        this.x -= v.x;
        this.startX -= v.x;
        this.y -= v.y;
        this.startY -= v.y;
        this.updateMag();
        return this;
    }
    add(v) {
        this.x += v.x;
        this.startX += v.x;
        this.y += v.y;
        this.startY += v.y;
        this.updateMag();
        return this;
    }
    multiplyX(n) {
        this.x *= n;
        this.startX *= n;
        this.updateMag();
        return this;
    }
    multiplyY(n) {
        this.y *= n;
        this.startY *= n;
        this.updateMag();
        return this;
    }
    divide(n) {
        this.x /= n;
        this.startX /= n;
        this.y /= n;
        this.startY /= n;
        this.mag /= n;
        return this;
    }
    appendMag(value) {
        if (this.mag != 0) {
            const newMag = this.mag + value;
            this.normalize();
            this.multiply(newMag);
            this.mag = newMag;
        }
        return this;
    }
    appendX(value) {
        this.x += value;
        this.startX += value;
        this.updateMag();
        return this;
    }
    appendY(value) {
        this.y += value;
        this.startY += value;
        this.updateMag();
        return this;
    }
    setX(value) {
        this.x = value;
        this.startX = value;
        this.updateMag();
        return this;
    }
    setY(value) {
        this.y = value;
        this.startY = value;
        this.updateMag();
        return this;
    }
    updateMag() {
        this.mag = pythag(this.x, this.y);
    }
    setMag(value) {
        this.normalize();
        this.multiply(value);
        this.updateMag();
        return this;
    }
    clone() {
        return new Vector(this.x, this.y, this.rotation);
    }
    format() {
        return `(${this.x}, ${this.y})`;
    }
}
export class SimulationElement {
    pos;
    color;
    sim;
    type;
    running;
    constructor(pos, color = new Color(0, 0, 0), type = null) {
        this.pos = pos;
        this.color = color;
        this.sim = null;
        this.type = type;
        this.running = true;
    }
    end() {
        this.running = false;
    }
    draw(_) { }
    setSimulationElement(el) {
        this.sim = el;
    }
    fill(color, t = 0, f) {
        const currentColor = new Color(this.color.r, this.color.g, this.color.b);
        const colorClone = color.clone();
        const changeR = colorClone.r - this.color.r;
        const changeG = colorClone.g - this.color.g;
        const changeB = colorClone.b - this.color.b;
        const func = () => {
            this.color = colorClone;
        };
        return transitionValues(func, (p) => {
            currentColor.r += changeR * p;
            currentColor.g += changeG * p;
            currentColor.b += changeB * p;
            this.color.r = currentColor.r;
            this.color.g = currentColor.g;
            this.color.b = currentColor.b;
            return this.running;
        }, func, t, f);
    }
    moveTo(p, t = 0, f) {
        const changeX = p.x - this.pos.x;
        const changeY = p.y - this.pos.y;
        return transitionValues(() => {
            this.pos = p;
        }, (p) => {
            this.pos.x += changeX * p;
            this.pos.y += changeY * p;
            return this.running;
        }, () => {
            this.pos.x = p.x;
            this.pos.y = p.y;
        }, t, f);
    }
    move(p, t = 0, f) {
        const changeX = p.x;
        const changeY = p.y;
        const startPos = new Point(this.pos.x, this.pos.y);
        return transitionValues(() => {
            this.pos.x += p.x;
            this.pos.y += p.y;
        }, (p) => {
            this.pos.x += changeX * p;
            this.pos.y += changeY * p;
            return this.running;
        }, () => {
            this.pos.x = startPos.x + p.x;
            this.pos.y = startPos.y + p.y;
        }, t, f);
    }
}
export class Color {
    r;
    g;
    b;
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    clone() {
        return new Color(this.r, this.g, this.b);
    }
    compToHex(c) {
        const hex = Math.round(c).toString(16);
        return hex.length == 1 ? '0' + hex : hex;
    }
    toHex() {
        return '#' + this.compToHex(this.r) + this.compToHex(this.g) + this.compToHex(this.b);
    }
}
export class Point extends Vector {
    constructor(x, y) {
        super(x, y);
    }
    clone() {
        return new Point(this.x, this.y);
    }
}
// extend SimulationElement so it can be added to the
// Simulation scene
export class SceneCollection extends SimulationElement {
    name;
    scene;
    idObjs;
    constructor(name = '') {
        super(new Point(0, 0));
        this.name = name;
        this.scene = [];
        this.idObjs = {};
    }
    end() {
        super.end();
        for (let i = 0; i < this.scene.length; i++) {
            this.scene[i].end();
        }
        Object.keys(this.idObjs).forEach((key) => {
            this.idObjs[key].end();
        });
    }
    add(element, id = null) {
        if (this.sim != null) {
            element.setSimulationElement(this.sim);
        }
        if (id != null) {
            this.idObjs[id] = element;
        }
        else {
            this.scene.push(element);
        }
    }
    removeWithId(id) {
        delete this.idObjs[id];
    }
    removeWithObject(element) {
        for (const el of this.scene) {
            if (el == element) {
                this.scene.splice(this.scene.indexOf(el), 1);
                return;
            }
        }
        for (const key of Object.keys(this.idObjs)) {
            if (this.idObjs[key] == element) {
                delete this.idObjs[key];
                return;
            }
        }
    }
    setSimulationElement(sim) {
        this.sim = sim;
        for (const element of this.scene) {
            element.setSimulationElement(sim);
        }
    }
    draw(c) {
        for (const element of this.scene) {
            element.draw(c);
        }
        for (const element of Object.values(this.idObjs)) {
            element.draw(c);
        }
    }
    empty() {
        this.scene = [];
        this.idObjs = {};
    }
}
export class Line extends SimulationElement {
    startPoint;
    endPoint;
    rotation;
    thickness;
    vec;
    constructor(p1, p2, color = new Color(0, 0, 0), thickness = 1, r = 0) {
        super(p1, color, 'line');
        this.startPoint = p1;
        this.endPoint = p2;
        this.rotation = r;
        this.thickness = thickness;
        this.vec = new Vector(0, 0);
        this.setVector();
    }
    clone() {
        return new Line(this.startPoint.clone(), this.endPoint.clone(), this.color.clone(), this.thickness, this.rotation);
    }
    setStart(p, t = 0, f) {
        const xChange = p.x - this.startPoint.x;
        const yChange = p.y - this.startPoint.y;
        return transitionValues(() => {
            this.startPoint = p;
        }, (p) => {
            this.startPoint.x += xChange * p;
            this.startPoint.y += yChange * p;
            return this.running;
        }, () => {
            this.startPoint = p;
        }, t, f);
    }
    setEnd(p, t = 0, f) {
        const xChange = p.x - this.endPoint.x;
        const yChange = p.y - this.endPoint.y;
        return transitionValues(() => {
            this.endPoint = p;
            this.setVector();
        }, (p) => {
            this.endPoint.x += xChange * p;
            this.endPoint.y += yChange * p;
            this.setVector();
            return this.running;
        }, () => {
            this.endPoint = p;
            this.setVector();
        }, t, f);
    }
    setVector() {
        this.vec = new Vector(this.endPoint.x - this.startPoint.x, this.endPoint.y - this.startPoint.y);
        this.vec.rotateTo(this.rotation);
    }
    rotate(deg, t = 0, f) {
        const start = this.rotation;
        return transitionValues(() => {
            this.rotation += deg;
            this.vec.rotate(deg);
        }, (p) => {
            this.rotation += deg * p;
            this.vec.rotate(deg * p);
            return this.running;
        }, () => {
            this.rotation = start + deg;
            this.rotation = minimizeRotation(this.rotation);
        }, t, f);
    }
    rotateTo(deg, t = 0, f) {
        const rotationChange = deg - this.rotation;
        return transitionValues(() => {
            this.rotation = deg;
            this.vec.rotateTo(deg);
        }, (p) => {
            this.rotation += rotationChange * p;
            this.vec.rotateTo(this.rotation);
            return this.running;
        }, () => {
            this.rotation = deg;
            this.rotation = minimizeRotation(this.rotation);
            this.vec.rotateTo(deg);
        }, t, f);
    }
    moveTo(p, t = 0) {
        return this.setStart(p, t);
    }
    move(v, t = 0) {
        return this.moveTo(this.startPoint.add(v), t);
    }
    draw(c) {
        this.vec.draw(c, new Point(this.startPoint.x, this.startPoint.y), this.color, this.thickness);
    }
}
export class Circle extends SimulationElement {
    radius;
    startAngle;
    endAngle;
    counterClockwise;
    thickness;
    rotation;
    fillCircle;
    constructor(pos, radius, color = new Color(0, 0, 0), startAngle = 0, endAngle = 360, thickness = 1, rotation = 0, fill = true, counterClockwise = false) {
        super(pos, color, 'circle');
        this.radius = radius;
        this.startAngle = startAngle;
        this.endAngle = endAngle;
        this.counterClockwise = counterClockwise;
        this.thickness = thickness;
        this.rotation = rotation;
        this.fillCircle = fill;
    }
    setCounterClockwise(val) {
        this.counterClockwise = val;
    }
    setFillCircle(val) {
        this.fillCircle = val;
    }
    draw(c) {
        c.beginPath();
        c.strokeStyle = this.color.toHex();
        c.fillStyle = this.color.toHex();
        c.lineWidth = this.thickness;
        c.arc(this.pos.x, this.pos.y, this.radius, degToRad(this.startAngle + this.rotation), degToRad(this.endAngle + this.rotation), this.counterClockwise);
        c.lineTo(this.pos.x, this.pos.y);
        c.moveTo(this.pos.x, this.pos.y);
        c.lineTo(this.pos.x + Math.cos(degToRad(this.rotation)) * this.radius, this.pos.y + Math.sin(degToRad(this.rotation)) * this.radius);
        c.stroke();
        if (this.fillCircle) {
            c.fill();
        }
        c.closePath();
    }
    scale(value, t = 0, f) {
        const radiusChange = this.radius * value - this.radius;
        const finalValue = this.radius * value;
        return transitionValues(() => {
            this.radius = finalValue;
        }, (p) => {
            this.radius += radiusChange * p;
            return this.running;
        }, () => {
            this.radius = finalValue;
        }, t, f);
    }
    contains(p) {
        return distance(p, this.pos) < this.radius;
    }
    scaleRadius(scale, t = 0, f) {
        const initialRadius = this.radius;
        const scaleChange = this.radius * scale - this.radius;
        return transitionValues(() => {
            this.radius *= scale;
        }, (p) => {
            this.radius += scaleChange * p;
            return this.running;
        }, () => {
            this.radius = initialRadius * scale;
        }, t, f);
    }
    setRadius(value, t = 0, f) {
        const radChange = value - this.radius;
        return transitionValues(() => {
            this.radius = value;
        }, (p) => {
            this.radius += radChange * p;
            return this.running;
        }, () => {
            this.radius = value;
        }, t, f);
    }
    setThickness(val, t = 0, f) {
        const thicknessChange = val - this.thickness;
        return transitionValues(() => {
            this.thickness = val;
        }, (p) => {
            this.thickness += thicknessChange * p;
            return this.running;
        }, () => {
            this.thickness = val;
        }, t, f);
    }
    setStartAngle(angle, t = 0, f) {
        const angleChange = angle - this.startAngle;
        return transitionValues(() => {
            this.startAngle = angle;
        }, (p) => {
            this.startAngle += angleChange * p;
            return this.running;
        }, () => {
            this.startAngle = angle;
        }, t, f);
    }
    setEndAngle(angle, t = 0, f) {
        const angleChange = angle - this.endAngle;
        return transitionValues(() => {
            this.endAngle = angle;
        }, (p) => {
            this.endAngle += angleChange * p;
            return this.running;
        }, () => {
            this.endAngle = angle;
        }, t, f);
    }
    rotate(amount, t = 0, f) {
        const initialRotation = this.rotation;
        const rotationChange = this.rotation + amount - this.rotation;
        return transitionValues(() => {
            this.rotation += amount;
        }, (p) => {
            this.rotation += rotationChange * p;
            return this.running;
        }, () => {
            this.rotation = initialRotation + amount;
        }, t, f);
    }
    rotateTo(deg, t = 0, f) {
        const rotationChange = deg - this.rotation;
        return transitionValues(() => {
            this.rotation = deg;
        }, (p) => {
            this.rotation += rotationChange * p;
            return this.running;
        }, () => {
            this.rotation = deg;
        }, t, f);
    }
    clone() {
        return new Circle(this.pos.clone(), this.radius, this.color.clone(), this.startAngle, this.endAngle, this.thickness, this.rotation, this.counterClockwise);
    }
}
export class Polygon extends SimulationElement {
    offsetPoint;
    offsetX;
    offsetY;
    points;
    rotation;
    constructor(pos, points, color, r = 0, offsetPoint = new Point(0, 0)) {
        super(pos, color, 'polygon');
        this.offsetPoint = offsetPoint;
        this.offsetX = this.offsetPoint.x;
        this.offsetY = this.offsetPoint.y;
        this.points = points.map((p) => {
            return new Point(p.x + this.offsetX, p.y + this.offsetY);
        });
        this.rotation = r;
    }
    setPoints(points, t = 0, f) {
        const lastPoint = this.points.length > 0 ? this.points[this.points.length - 1] : new Point(0, 0);
        if (points.length > this.points.length) {
            while (points.length > this.points.length) {
                this.points.push(new Point(lastPoint.x, lastPoint.y));
            }
        }
        const initial = this.points.map((p) => p.clone());
        const changes = [
            ...points.map((p, i) => p.clone().sub(this.points[i])),
            ...this.points
                .slice(points.length, this.points.length)
                .map((point) => points[points.length - 1].clone().sub(point))
        ];
        return transitionValues(() => {
            this.points = points.map((p) => {
                return new Point(p.x + this.offsetX, p.y + this.offsetY);
            });
        }, (p) => {
            this.points = this.points.map((point, i) => {
                point.x += (changes[i]?.x || 0) * p;
                point.y += (changes[i]?.y || 0) * p;
                return point;
            });
            return this.running;
        }, () => {
            this.points = initial.map((p, i) => {
                p.x += changes[i].x;
                p.y += changes[i].y;
                return p.clone();
            });
            this.points.splice(points.length, this.points.length);
        }, t, f);
    }
    clone() {
        return new Polygon(this.pos.clone(), [...this.points.map((p) => p.clone())], this.color.clone(), this.rotation, this.offsetPoint.clone());
    }
    rotate(deg, t = 0, f) {
        const initial = this.rotation;
        return transitionValues(() => {
            this.rotation = initial + deg;
            this.setPointRotation();
        }, (p) => {
            this.rotation += deg * p;
            this.setPointRotation();
            return this.running;
        }, () => {
            this.rotation = initial + deg;
            this.setPointRotation();
        }, t, f);
    }
    rotateTo(deg, t = 0, f) {
        const rotationChange = deg - this.rotation;
        return transitionValues(() => {
            this.rotation = deg;
            this.setPointRotation();
        }, (p) => {
            this.rotation += rotationChange * p;
            this.setPointRotation();
            return this.running;
        }, () => {
            this.rotation = deg;
            this.setPointRotation();
        }, t, f);
    }
    setPointRotation() {
        this.rotation = minimizeRotation(this.rotation);
        this.points = this.points.map((p) => p.rotateTo(this.rotation));
    }
    draw(c) {
        c.beginPath();
        c.fillStyle = this.color.toHex();
        c.moveTo(this.points[0].x + this.pos.x, this.points[0].y + this.pos.y);
        for (let i = 1; i < this.points.length; i++) {
            c.lineTo(this.points[i].x + this.pos.x, this.points[i].y + this.pos.y);
        }
        c.fill();
        c.closePath();
    }
}
export class Square extends SimulationElement {
    width;
    height;
    rotation;
    showNodeVectors;
    showCollisionVectors;
    hovering;
    events;
    offsetPoint;
    topLeft;
    topRight;
    bottomLeft;
    bottomRight;
    v1;
    v2;
    v3;
    v4;
    v5;
    constructor(pos, width, height, color, offsetPoint = new Point(0, 0), rotation = 0) {
        super(pos, color, 'square');
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.showNodeVectors = false;
        this.showCollisionVectors = false;
        this.hovering = false;
        this.events = [];
        this.topLeft = new Vector(0, 0);
        this.topRight = new Vector(0, 0);
        this.bottomLeft = new Vector(0, 0);
        this.bottomRight = new Vector(0, 0);
        this.v1 = new Vector(0, 0);
        this.v2 = new Vector(0, 0);
        this.v3 = new Vector(0, 0);
        this.v4 = new Vector(0, 0);
        this.v5 = new Vector(0, 0);
        this.offsetPoint = offsetPoint;
        this.updateOffsetPosition(offsetPoint);
    }
    updateOffsetPosition(p) {
        this.offsetPoint = p.clone();
        this.topLeft = new Vector(-this.width / 2 - this.offsetPoint.x, -this.height / 2 - this.offsetPoint.y);
        this.topRight = new Vector(this.width / 2 - this.offsetPoint.x, -this.height / 2 - this.offsetPoint.y);
        this.bottomLeft = new Vector(-this.width / 2 - this.offsetPoint.x, this.height / 2 - this.offsetPoint.y);
        this.bottomRight = new Vector(this.width / 2 - this.offsetPoint.x, this.height / 2 - this.offsetPoint.y);
        this.setRotation();
    }
    setNodeVectors(show) {
        this.showNodeVectors = show;
    }
    setCollisionVectors(show) {
        this.showCollisionVectors = show;
    }
    setRotation() {
        this.topLeft.rotateTo(this.rotation);
        this.topRight.rotateTo(this.rotation);
        this.bottomLeft.rotateTo(this.rotation);
        this.bottomRight.rotateTo(this.rotation);
    }
    rotate(deg, t = 0, f) {
        const startRotation = this.rotation;
        const func = () => {
            this.rotation = startRotation + deg;
            this.rotation = minimizeRotation(this.rotation);
            this.setRotation();
        };
        return transitionValues(func, (p) => {
            this.rotation += deg * p;
            this.setRotation();
            return this.running;
        }, func, t, f);
    }
    rotateTo(deg, t = 0, f) {
        const rotationChange = deg - this.rotation;
        const func = () => {
            this.rotation = deg;
            this.rotation = minimizeRotation(this.rotation);
            this.setRotation();
        };
        return transitionValues(func, (p) => {
            this.rotation += rotationChange * p;
            this.setRotation();
            return this.running;
        }, func, t, f);
    }
    draw(c) {
        c.beginPath();
        c.fillStyle = this.color.toHex();
        c.moveTo(this.pos.x + this.topLeft.x + this.offsetPoint.x, this.pos.y + this.topLeft.y + this.offsetPoint.y);
        c.lineTo(this.pos.x + this.topRight.x + this.offsetPoint.x, this.pos.y + this.topRight.y + this.offsetPoint.y);
        c.lineTo(this.pos.x + this.bottomRight.x + this.offsetPoint.x, this.pos.y + this.bottomRight.y + this.offsetPoint.y);
        c.lineTo(this.pos.x + this.bottomLeft.x + this.offsetPoint.x, this.pos.y + this.bottomLeft.y + this.offsetPoint.y);
        c.fill();
        c.closePath();
        if (this.showNodeVectors) {
            this.topLeft.draw(c, new Point(this.pos.x + this.offsetPoint.x, this.pos.y + this.offsetPoint.y));
            this.topRight.draw(c, new Point(this.pos.x + this.offsetPoint.x, this.pos.y + this.offsetPoint.y));
            this.bottomLeft.draw(c, new Point(this.pos.x + this.offsetPoint.x, this.pos.y + this.offsetPoint.y));
            this.bottomRight.draw(c, new Point(this.pos.x + this.offsetPoint.x, this.pos.y + this.offsetPoint.y));
        }
        if (this.showCollisionVectors) {
            const testVecs = [this.v1, this.v2, this.v3, this.v4, this.v5];
            if (testVecs.some((el) => el)) {
                testVecs.forEach((vec) => vec.draw(c, new Point(this.pos.x, this.pos.y), new Color(0, 0, 255)));
            }
        }
    }
    scale(value, t = 0, f) {
        const topRightMag = this.topRight.mag;
        const topLeftMag = this.topLeft.mag;
        const bottomRightMag = this.bottomRight.mag;
        const bottomLeftMag = this.bottomLeft.mag;
        const topRightChange = topRightMag * value - topRightMag;
        const topLeftChange = topLeftMag * value - topLeftMag;
        const bottomRightChange = bottomRightMag * value - bottomRightMag;
        const bottomLeftChange = bottomLeftMag * value - bottomLeftMag;
        return transitionValues(() => {
            this.topRight.multiply(value);
            this.topLeft.multiply(value);
            this.bottomRight.multiply(value);
            this.bottomLeft.multiply(value);
            this.updateDimensions();
        }, (p) => {
            this.topRight.appendMag(topRightChange * p);
            this.topLeft.appendMag(topLeftChange * p);
            this.bottomRight.appendMag(bottomRightChange * p);
            this.bottomLeft.appendMag(bottomLeftChange * p);
            return this.running;
        }, () => {
            this.topRight.normalize();
            this.topRight.multiply(topRightMag * value);
            this.topLeft.normalize();
            this.topLeft.multiply(topLeftMag * value);
            this.bottomRight.normalize();
            this.bottomRight.multiply(bottomRightMag * value);
            this.bottomLeft.normalize();
            this.bottomLeft.multiply(bottomLeftMag * value);
            this.updateDimensions();
        }, t, f);
    }
    scaleWidth(value, t = 0, f) {
        const topRightClone = this.topRight.clone();
        const topLeftClone = this.topLeft.clone();
        const bottomRightClone = this.bottomRight.clone();
        const bottomLeftClone = this.bottomLeft.clone();
        const topRightMag = topRightClone.mag;
        const topLeftMag = topLeftClone.mag;
        const bottomRightMag = bottomRightClone.mag;
        const bottomLeftMag = bottomLeftClone.mag;
        const topRightChange = topRightMag * value - topRightMag;
        const topLeftChange = topLeftMag * value - topLeftMag;
        const bottomRightChange = bottomRightMag * value - bottomRightMag;
        const bottomLeftChange = bottomLeftMag * value - bottomLeftMag;
        return transitionValues(() => {
            this.topRight.multiplyX(value);
            this.topLeft.multiplyX(value);
            this.bottomRight.multiplyX(value);
            this.bottomLeft.multiplyX(value);
            this.updateDimensions();
        }, (p) => {
            this.topRight.appendX(topRightChange * p);
            this.topLeft.appendX(topLeftChange * p);
            this.bottomRight.appendX(bottomRightChange * p);
            this.bottomLeft.appendX(bottomLeftChange * p);
            return this.running;
        }, () => {
            topRightClone.setX(1);
            topRightClone.multiplyX(topRightMag * value);
            this.topRight = topRightClone.clone();
            topLeftClone.setX(1);
            topLeftClone.multiplyX(topLeftMag * value);
            this.topLeft = topLeftClone.clone();
            bottomRightClone.setX(1);
            bottomRightClone.multiplyX(bottomRightMag * value);
            this.bottomRight = bottomRightClone.clone();
            bottomLeftClone.setX(1);
            bottomLeftClone.multiplyX(bottomLeftMag * value);
            this.bottomLeft = bottomLeftClone.clone();
            this.updateDimensions();
        }, t, f);
    }
    scaleHeight(value, t = 0, f) {
        const topRightClone = this.topRight.clone();
        const topLeftClone = this.topLeft.clone();
        const bottomRightClone = this.bottomRight.clone();
        const bottomLeftClone = this.bottomLeft.clone();
        const topRightMag = topRightClone.mag;
        const topLeftMag = topLeftClone.mag;
        const bottomRightMag = bottomRightClone.mag;
        const bottomLeftMag = bottomLeftClone.mag;
        const topRightChange = topRightMag * value - topRightMag;
        const topLeftChange = topLeftMag * value - topLeftMag;
        const bottomRightChange = bottomRightMag * value - bottomRightMag;
        const bottomLeftChange = bottomLeftMag * value - bottomLeftMag;
        return transitionValues(() => {
            this.topRight.multiplyY(value);
            this.topLeft.multiplyY(value);
            this.bottomRight.multiplyY(value);
            this.bottomLeft.multiplyY(value);
            this.updateDimensions();
        }, (p) => {
            this.topRight.appendY(topRightChange * p);
            this.topLeft.appendY(topLeftChange * p);
            this.bottomRight.appendY(bottomRightChange * p);
            this.bottomLeft.appendY(bottomLeftChange * p);
            return this.running;
        }, () => {
            topRightClone.setY(1);
            topRightClone.multiplyY(topRightMag * value);
            this.topRight = topRightClone.clone();
            topLeftClone.setY(1);
            topLeftClone.multiplyY(topLeftMag * value);
            this.topLeft = topLeftClone.clone();
            bottomRightClone.setY(1);
            bottomRightClone.multiplyY(bottomRightMag * value);
            this.bottomRight = bottomRightClone.clone();
            bottomLeftClone.setY(1);
            bottomLeftClone.multiplyY(bottomLeftMag * value);
            this.bottomLeft = bottomLeftClone.clone();
            this.updateDimensions();
        }, t, f);
    }
    setWidth(value, t = 0) {
        const scale = value / this.width;
        return this.scaleWidth(scale, t);
    }
    setHeight(value, t = 0) {
        const scale = value / this.height;
        return this.scaleHeight(scale, t);
    }
    contains(p) {
        const topLeftVector = new Vector(this.topLeft.x, this.topLeft.y);
        topLeftVector.rotateTo(-this.rotation);
        this.v1 = topLeftVector;
        const topRightVector = new Vector(this.topRight.x, this.topRight.y);
        topRightVector.rotateTo(-this.rotation);
        this.v2 = topRightVector;
        const bottomLeftVector = new Vector(this.bottomLeft.x, this.bottomLeft.y);
        bottomLeftVector.rotateTo(-this.rotation);
        this.v3 = bottomLeftVector;
        const bottomRightVector = new Vector(this.bottomRight.x, this.bottomRight.y);
        bottomRightVector.rotateTo(-this.rotation);
        this.v4 = bottomRightVector;
        const cursorVector = new Vector(p.x - this.pos.x - this.offsetPoint.x, p.y - this.pos.y - this.offsetPoint.y);
        cursorVector.rotateTo(-this.rotation);
        this.v5 = cursorVector;
        if (cursorVector.x > bottomLeftVector.x &&
            cursorVector.x < topRightVector.x &&
            cursorVector.y > topLeftVector.y &&
            cursorVector.y < bottomLeftVector.y) {
            return true;
        }
        return false;
    }
    updateDimensions() {
        this.height = this.topRight.y + this.bottomRight.y;
        this.width = this.topRight.x + this.topLeft.x;
    }
    clone() {
        return new Square(this.pos.clone(), this.width, this.height, this.color.clone(), this.offsetPoint.clone(), this.rotation);
    }
}
class Event {
    event;
    callback;
    constructor(event, callback) {
        this.event = event;
        this.callback = callback;
    }
}
export class Simulation {
    scene;
    idObjs;
    fitting;
    bgColor;
    canvas;
    width = 0;
    height = 0;
    ratio;
    running;
    _prevReq;
    events;
    constructor(id) {
        this.scene = [];
        this.idObjs = {};
        this.fitting = false;
        this.bgColor = new Color(255, 255, 255);
        this.running = true;
        this._prevReq = 0;
        this.events = [];
        this.ratio = window.devicePixelRatio;
        this.canvas = document.getElementById(id);
        if (!this.canvas) {
            console.error(`Canvas with id "${id}" not found`);
            return;
        }
        window.addEventListener('resize', () => this.resizeCanvas(this.canvas));
        this.resizeCanvas(this.canvas);
        const ctx = this.canvas.getContext('2d');
        if (!ctx)
            return;
        this.render(ctx);
    }
    render(c) {
        if (!this.canvas)
            return;
        c.clearRect(0, 0, this.canvas.width, this.canvas.height);
        c.beginPath();
        c.fillStyle = this.bgColor.toHex();
        c.fillRect(0, 0, this.canvas.width, this.canvas.height);
        c.closePath();
        for (const element of this.scene) {
            element.draw(c);
        }
        Object.values(this.idObjs).forEach((element) => {
            element.draw(c);
        });
        if (this.running) {
            this._prevReq = window.requestAnimationFrame(() => this.render(c));
        }
    }
    end() {
        this.running = false;
        for (let i = 0; i < this.scene.length; i++) {
            this.scene[i].end();
        }
        Object.keys(this.idObjs).forEach((key) => {
            this.idObjs[key].end();
        });
        window.removeEventListener('resize', () => this.resizeCanvas(this.canvas));
        window.cancelAnimationFrame(this._prevReq);
    }
    add(element, id = null) {
        if (!this.canvas)
            return;
        element.setSimulationElement(this.canvas);
        if (id !== null) {
            this.idObjs[id] = element;
        }
        else {
            this.scene.push(element);
        }
    }
    removeWithId(id) {
        if (this.idObjs[id] !== undefined) {
            delete this.idObjs[id];
        }
    }
    removeWithObject(element) {
        for (const el of this.scene) {
            if (compare(el, element)) {
                this.scene.splice(this.scene.indexOf(el), 1);
                return;
            }
        }
        for (const key of Object.keys(this.idObjs)) {
            if (compare(this.idObjs[key], element)) {
                delete this.idObjs[key];
            }
        }
    }
    on(event, callback) {
        if (!this.canvas)
            return;
        this.events.push(new Event(event, callback));
        // @ts-ignore
        this.canvas.addEventListener(event, callback);
    }
    removeListener(event, callback) {
        this.events = this.events.filter((e) => {
            if (e.event === event && e.callback == callback) {
                if (this.canvas) {
                    // @ts-ignore
                    this.canvas.removeEventListener(e.event, e.callback);
                }
                return false;
            }
            return true;
        });
    }
    fitElement() {
        if (!this.canvas)
            return;
        this.fitting = true;
        this.resizeCanvas(this.canvas);
    }
    setSize(x, y) {
        if (!this.canvas)
            return;
        this.canvas.width = x;
        this.canvas.height = y;
        this.fitting = false;
    }
    setBgColor(color) {
        this.bgColor = color.clone();
    }
    resizeCanvas(c) {
        if (!c)
            return;
        if (!this.canvas)
            return;
        if (this.fitting) {
            if (c.parentElement) {
                const width = c.parentElement.clientWidth;
                const height = c.parentElement.clientHeight;
                this.canvas.width = width * this.ratio;
                this.canvas.height = height * this.ratio;
                this.canvas.style.width = width + 'px';
                this.canvas.style.height = height + 'px';
            }
        }
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
    empty() {
        this.scene = [];
        this.idObjs = {};
    }
}
export function pythag(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}
export function distance(p1, p2) {
    return pythag(p1.x - p2.x, p1.y - p2.y);
}
export function degToRad(deg) {
    return (deg * Math.PI) / 180;
}
export function radToDeg(rad) {
    return (rad * 180) / Math.PI;
}
function minimizeRotation(rotation) {
    while (rotation > 360)
        rotation -= 360;
    return rotation;
}
export function lerp(a, b, t) {
    return a + (b - a) * t;
}
export function smoothStep(t) {
    const v1 = t * t;
    const v2 = 1 - (1 - t) * (1 - t);
    return lerp(v1, v2, t);
}
export function linearStep(n) {
    return n;
}
/**
 * @param callback1 - called when t is 0
 * @param callback2 - called every frame until the animation is finished
 * @param callback3 - called after animation is finished
 * @param t - animation time (seconds)
 * @returns {Promise<void>}
 */
export function transitionValues(callback1, callback2, callback3, t, func) {
    return new Promise((resolve) => {
        if (t == 0) {
            callback1();
            resolve();
        }
        else {
            const inc = 1 / (60 * t);
            let prevPercent = 0;
            let prevFrame = 0;
            const step = (t, f) => {
                const newT = f(t);
                const canContinue = callback2(newT - prevPercent);
                if (!canContinue) {
                    window.cancelAnimationFrame(prevFrame);
                    return;
                }
                prevPercent = newT;
                if (t < 1) {
                    prevFrame = window.requestAnimationFrame(() => step(t + inc, f));
                }
                else {
                    callback3();
                    resolve();
                }
            };
            step(0, func ? func : linearStep);
        }
    });
}
export function compare(val1, val2) {
    const nullUndefArr = [null, undefined];
    if (nullUndefArr.includes(val1) || nullUndefArr.includes(val2)) {
        if (val1 === val2)
            return true;
        return false;
    }
    if (typeof val1 !== typeof val2)
        return false;
    if (Array.isArray(val1) && Array.isArray(val2)) {
        for (let i = 0; i < Math.max(val1.length, val2.length); i++) {
            if (!compare(val1[i], val2[i]))
                return false;
        }
        return true;
    }
    else if (Array.isArray(val1) || Array.isArray(val2))
        return false;
    if (typeof val1 === 'object' && typeof val2 === 'object') {
        const compareForKeys = (keys, obj1, obj2) => {
            for (let i = 0; i < keys.length; i++) {
                if (typeof obj1[keys[i]] !== typeof obj2[keys[i]]) {
                    return false;
                }
                if (typeof obj1[keys[i]] === 'object') {
                    return compare(obj1[keys[i]], obj2[keys[i]]);
                }
                if (obj1[keys[i]] !== obj2[keys[i]]) {
                    return false;
                }
            }
            return true;
        };
        const obj1Keys = Object.keys(val1);
        const obj2Keys = Object.keys(val2);
        const key1Result = compareForKeys(obj1Keys, val1, val2);
        const key2Result = compareForKeys(obj2Keys, val1, val2);
        if (key1Result && key2Result)
            return true;
        return false;
    }
    return val1 === val2;
}
export function frameLoop(cb) {
    let prevFrame = 0;
    function start(...args) {
        let res = cb(...args);
        if (res === false) {
            window.cancelAnimationFrame(prevFrame);
            return;
        }
        if (!Array.isArray(res))
            res = args;
        prevFrame = window.requestAnimationFrame(() => start(...res));
    }
    return (...p) => {
        start(...p);
    };
}
export default {
    Vector,
    SimulationElement,
    Color,
    Point,
    SceneCollection,
    Line,
    Circle,
    Polygon,
    Square,
    Simulation,
    pythag,
    distance,
    degToRad,
    radToDeg,
    transitionValues,
    compare
};
