<template id="color-picker-template">
    <div class="color-picker">
        <div class="color-picker-overlay" v-if="isVisible" v-on:click="hide"></div>
        <transition name="pop">
            <div class="color-picker-flyout" v-if="isVisible">
                <div class="color-chip" v-bind:style="{'background': colorHex}">
                    <div class="color-chip-inner">
                        <h1 class="color-chip-title">imgx</h1>
                    </div>
                </div>
                <div class="color-picker-inner">
                    <div class="control" v-bind:style="gradientH">
                        <input type="range" min="0" max="360" v-model="h" @input="input"/>
                    </div>
                    <div class="control" v-bind:style="gradientS">
                        <input type="range" min="0" max="100" v-model="s" @input="input"/>
                    </div>
                    <div class="control" v-bind:style="gradientL">
                        <input type="range" min="0" max="100" v-model="b" @input="input"/>
                    </div>
                </div>
            </div><!--color-picker-flyout-->
        </transition>
        <div class="swatch" v-bind:style="{'background': colorHex}" v-on:click="toggle"></div>
    </div><!--color-picker-->
</template>

<script>
export default {
    props: ['parentColor'],
    data () {
        return {
            isVisible: false,
            h: 0,
            s: 0,
            b: 100
        }
    },
    computed: {
        colorHex () {
            const hsl = hsb2hsl(parseFloat(this.h) / 360, parseFloat(this.s) / 100, parseFloat(this.b) / 100)
            const rgb = hsl2rgb(hsl.h, hsl.s, hsl.l)
            const hex = rgb2hex(rgb.r, rgb.g, rgb.b)
            return hex
        },
        backColor () {
            return `hsl(${this.color.h}, ${this.color.s}%, ${this.color.l}%)`
        },
        gradientH () {
            let stops = []
            for (let i = 0; i < 7; i++) {
                let h = i * 60
                let hsl = hsb2hsl(parseFloat(h / 360), parseFloat(this.s) / 100, parseFloat(this.b / 100))
                let c = `${hsl.h}, ${hsl.s}%, ${hsl.l}%`
                stops.push(`hsl(${c})`)
            }
            return {
                backgroundImage: `linear-gradient(to right, ${stops.join(', ')})`
            }
        },
        gradientS () {
            let stops = []
            let c
            let hsl1 = hsb2hsl(parseFloat(this.h / 360), 0, parseFloat(this.b / 100))
            c = `${hsl1.h}, ${hsl1.s}%, ${hsl1.l}%`
            stops.push(`hsl(${c})`)

            let hsl2 = hsb2hsl(parseFloat(this.h / 360), 1, parseFloat(this.b / 100))
            c = `${hsl2.h}, ${hsl2.s}%, ${hsl2.l}%`
            stops.push(`hsl(${c})`)

            return {
                backgroundImage: `linear-gradient(to right, ${stops.join(', ')})`
            }
        },
        gradientL () {
            let stops = []
            let c
            let hsl1 = hsb2hsl(parseFloat(this.h / 360), 0, 0)
            c = `${hsl1.h}, ${hsl1.s}%, ${hsl1.l}%`
            stops.push(`hsl(${c})`)

            let hsl2 = hsb2hsl(parseFloat(this.h / 360), parseFloat(this.s / 100), 1)
            c = `${hsl2.h}, ${hsl2.s}%, ${hsl2.l}%`
            stops.push(`hsl(${c})`)

            return {
                backgroundImage: `linear-gradient(to right, ${stops.join(', ')})`
            }
        }
    },
    methods: {
        show () {
            this.isVisible = true
        },
        hide () {
            this.isVisible = false
        },
        toggle () {
            this.isVisible = !this.isVisible
        },
        input () {
            this.$emit('onChange', this.colorHex)
        }
    },
    mounted: function () {
        const rgb = hex2rgb(this.parentColor)
        if (rgb !== null) {
            const hsl = rgb2hsl(rgb.r, rgb.g, rgb.b)
            const hsb = hsl2hsb(hsl.h, hsl.s, hsl.l)
            this.h = hsb.h * 360
            this.s = hsb.s * 100
            this.b = hsb.b * 100
        } else {
            this.h = 0
            this.s = 0
            this.b = 0
        }
    },
    watch: {
        'parentColor' (to, from) {
            const rgb = hex2rgb(to)
            if (rgb !== null) {
                const hsl = rgb2hsl(rgb.r, rgb.g, rgb.b)
                const hsb = hsl2hsb(hsl.h, hsl.s, hsl.l)
                this.h = hsb.h * 360
                this.s = hsb.s * 100
                this.b = hsb.b * 100
            } else {
                this.h = 0
                this.s = 0
                this.b = 0
            }
        }
    }
}
const hsb2hsl = (h, s, b) => {
    let hsl = {
        h: h
    }
    hsl.l = (2 - s) * b
    hsl.s = s * b

    if (hsl.l <= 1 && hsl.l > 0) {
        hsl.s /= hsl.l
    } else {
        hsl.s /= 2 - hsl.l
    }

    hsl.l /= 2

    if (hsl.s > 1) {
        hsl.s = 1
    }

    if (!hsl.s > 0) hsl.s = 0

    hsl.h *= 360
    hsl.s *= 100
    hsl.l *= 100

    return hsl
}

const hsl2hsb = (h, s, l) => {
    h = h / 360
    s = s / 100
    l = l / 100
    let hsb = {h: h}
    const b = ((2 * l) + (s * (1 - Math.abs(2 * l - 1)))) / 2
    hsb.s = (2 * (b - l)) / b
    hsb.b = b
    return hsb
}

const hsl2rgb = (h, s, l) => {
    let r, g, b, m, c, x

    if (!isFinite(h)) h = 0
    if (!isFinite(s)) s = 0
    if (!isFinite(l)) l = 0

    h /= 60
    if (h < 0) h = 6 - (-h % 6)
    h %= 6

    s = Math.max(0, Math.min(1, s / 100))
    l = Math.max(0, Math.min(1, l / 100))

    c = (1 - Math.abs((2 * l) - 1)) * s
    x = c * (1 - Math.abs((h % 2) - 1))

    if (h < 1) {
        r = c
        g = x
        b = 0
    } else if (h < 2) {
        r = x
        g = c
        b = 0
    } else if (h < 3) {
        r = 0
        g = c
        b = x
    } else if (h < 4) {
        r = 0
        g = x
        b = c
    } else if (h < 5) {
        r = x
        g = 0
        b = c
    } else {
        r = c
        g = 0
        b = x
    }

    m = l - c / 2
    r = Math.round((r + m) * 255)
    g = Math.round((g + m) * 255)
    b = Math.round((b + m) * 255)

    return { r: r, g: g, b: b }
}
const rgb2hsl = (r, g, b) => {
    let max, min, h, s, l, d
    r /= 255
    g /= 255
    b /= 255
    max = Math.max(r, g, b)
    min = Math.min(r, g, b)
    l = (max + min) / 2
    if (max === min) {
        h = s = 0
    } else {
        d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
        switch (max) {
        case r:
            h = (g - b) / d + (g < b ? 6 : 0)
            break
        case g:
            h = (b - r) / d + 2
            break
        case b:
            h = (r - g) / d + 4
            break
        }
        h /= 6
    }
    h = Math.floor(h * 360)
    s = Math.floor(s * 100)
    l = Math.floor(l * 100)
    return { h: h, s: s, l: l }
}

const hex2rgb = (hex) => {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
        return r + r + g + g + b + b
    })

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null
}

const component2hex = (c) => {
    let hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}

function rgb2hex (r, g, b) {
    return `#${component2hex(r)}${component2hex(g)}${component2hex(b)}`
}
</script>
<style lang="less" scoped>
body {
  background: #f8f8f8;
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.color-picker {
  position: relative;
  width: 25px;
  height:25px;
  display: inline-block;
}

.color-picker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: black;
  z-index: 0;
  opacity: 0;
}

.color-picker-flyout {
  width: 240px;
  border: 1px solid #eee;
  border-radius: 4px;
  background: white;
  box-shadow: 0px 3px 7px rgba(0, 0, 0, 0.12);
  font-family: "Roboto", "Helvetica Neue", sans-serif;
  position: absolute;
  top: 25px;
  left: -108px;
  z-index: 2;
}

.color-picker-inner {
  padding: 1.5rem 1rem;
}

.color-chip {
  height: 116px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  border-radius: 4px 4px 0 0;
}

.color-chip-inner {
  text-align: center;
}

.color-chip-subtitle {
  margin-top: 0.5rem;
  opacity: 0.7;
  font-weight: normal;
  font-size: 15px;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
}

.color-chip-title {
  color: rgba(255,255,255,0.9);
  margin: 0;
  font-size: 50px;
  letter-spacing: 4px;
  font-family: Helvetica Neue;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
}

.control {
  width: 100%;
  height: 12px;
  border-radius: 12px;
  border: 1px solid #ddd;
}

.control + .control {
  margin-top: 1rem;
}

.control input {
  width: 100%;
  margin: 0;
}

.control input[type=range] {
  -webkit-appearance: none;
  width: 100%;
  background: transparent;
}

.control input[type=range]:focus {
  outline: none;
}

.control input[type=range]::-ms-track {
  width: 100%;
  cursor: pointer;
  background: transparent;
  border-color: transparent;
  color: transparent;
}

.control input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: 1px solid #ddd;
  height: 20px;
  width: 20px;
  border-radius: 50px;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.12);
  margin-top: -4px;
}

.swatch {
  width: 22px;
  height: 22px;
  margin: 0 auto;
  border: 4px solid white;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.swatch:hover {
  border: 4px solid white;
  opacity: 0.8;
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.3);
}

.pop-enter-active,
.pop-leave-active {
  transition: transform .5s, opacity .5s;
  transition-timing-function: cubic-bezier(.8, .3, 0.25, 1.75);
  transform: scale(1);
}

.pop-enter,
.pop-leave-active {
  opacity: 0;
  transform: scale(0);
}
</style>
