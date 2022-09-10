document.addEventListener('DOMContentLoaded', () => {
planet = document.querySelector('#planet')
orbitElement = document.querySelector('#orbit')
time = 0;
play = true;
let G = 6.6e-11
let M = 2e30
let r = new Vector(-1.5e11, -5e10)
let v = new Vector(1e4, -2.5e4)
let h = r.cross(v)
let sscale = 1e9
draw = () => {
    timeElapsed = millis() - time
    time += timeElapsed
    orbit = calculateOrbit(r, v, M * G)
    console.log(orbit)
    orbitElement.style.setProperty('--wx', `${orbit.a * 2 / sscale}px`)
    orbitElement.style.setProperty('--wy', `${orbit.b * 2 / sscale}0px`)
    orbitElement.style.top = orbitElement.style.top
    orbitElement.style.left = orbitElement.style.left
    orbitElement.style.borderRadius = orbitElement.style.borderRadius
    orbitElement.style.transform = `rotate(${orbit.inclination}rad) translateX(${orbit.a * orbit.e / sscale}px)`
    if (play) {
        r = calculateNextPosition(r, orbit)
        planet.style.transform = `translate(${r.x / sscale}px, ${r.y / sscale}px)`
    }
}
})

// returns next position r of planet timeElapsed time in future for an orbit of given period,
// semi-major-axis and eccentricity and given current phase ie time in current revolution
// and inclination of  orbit
function calculateNextPosition(r, orbit) {
    return r
}

// returns orbit (phase, period, semi-major-axis, eccentricity and inclination)
function calculateOrbit(r, v, mu) {
    let h = r.cross(v)
    E = 0.5 * v.square()
    E -= mu / r.mag()
    e2_1 = 2 * E * sq(h / mu)
    let e = sqrt(e2_1 + 1)
    hsmu = sq(h) / mu
    ecosth1 = hsmu / r.mag()
    costh = (ecosth1 - 1) / e
    costh = adjustSinCos(costh)
    console.log(costh)
    let th = acos(costh)
    if (r.dot(v) < 0) {
        th = -th
    }
    let a = hsmu / (-e2_1)
    let period = null
    if (E < 0) {
        period = sqrt(4 * PI * PI * a * a * a / mu)
    }
    cosu = (1 + costh) / (ecosth1)
    cosu = adjustSinCos(cosu)
    u = acos(cosu)
    MM = u - (e * sin(u))
    phase = (period / TAU) * MM
    currentAngle = atan(r.y / r.x)
    if (r.y > 0) {
        currentAngle += PI
    }
    inclination = currentAngle - th
    return new Orbit(phase, period, a, e, inclination)
}

class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.s = sq(this.x) + sq(this.y)
        this.m = sqrt(this.s)
    }
    cross(that) {
        return (this.x * that.y) - (this.y * that.x)
    }
    dot(that) {
        return (this.x * that.x) + (this.y * that.y)
    }
    mag() {
        if (this.m == undefined) {
            this.m = sqrt(this.square())
        }
        return this.m
    }
    square() {
        if (this.s == undefined) {
            this.s = sq(this.x) + sq(this.y)
        }
        return this.s
    }
}

class Orbit {
    constructor(phase, period, a, e, inclination) {
        this.phase = phase  // time in current revolution starting from apoapse
        this.period = period
        this.a = a
        this.e = e
        this.inclination = inclination
        this.b = sqrt(sq(a) - sq(a * e))
    }
}

function sq(a) {
    return a * a
}

function sqrt(a) {
    return Math.sqrt(a)
}

function adjustSinCos(y) {
    if (y - 1 < 0.00001 && y > 1) {
        y = 1
    } else if (-1 - y < 0.00001 && y < -1) {
        y = -1
    }
    return y
}