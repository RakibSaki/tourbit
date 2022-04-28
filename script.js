let zoom = 1 / 1e9  // 1 pixel shows 1 billion meters

document.addEventListener('DOMContentLoaded', () => {
    let orbiterElement = document.querySelector('#orbiter')

    let orbiter = {
        r: new Vector(Math.PI / 2, 1.5e11),
        draw() {
            orbiterElement.style.transform = `rotate(${this.r.th}rad) translate(${this.r.r * zoom}px, 0)`
        }
    }
    orbiter.draw()

    draw = () => {
        orbiter.r.th += 0.01
        orbiter.draw()
    }
})

class Vector {
    constructor(th, r) {
        this.th = th
        this.r = r
    }
}