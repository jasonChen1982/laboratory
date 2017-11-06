function WaveLines(opts) {
    opts = opts || {};
    this.lines = [];
    this.num = opts.num || 180;
    this.FFT = opts.FFT;
    this.noise = [];
    this.baseR = 60;
    this.lineColor = '';
    this.bb = -Infinity;
    this.ss = Infinity;
    this.build();
}
WaveLines.prototype.build = function () {
    var r = 360 / this.num;
    for (var i = 0; i < this.num; i++) {
        var rad = r * i * DTR;
        this.lines[i] = [cos(rad), sin(rad)];
    }
};
WaveLines.prototype.update = function () {
    var now = 0.1 * Date.now() % 360;
    var fft = this.FFT && this.FFT.analyse();
    for (var i = 0; i < this.num; i++) {
        var v = (fft[20 + i] / 255) || 0;
        this.noise[i] = v;
        this.bb = Math.max(this.bb, v);
        this.ss = Math.min(this.ss, v);
    }
};
WaveLines.prototype.color = function (ctx) {
    this.lineColor = ctx.createLinearGradient(40, -120, -40, 120);
    this.lineColor.addColorStop(0, "#ca068f");
    this.lineColor.addColorStop(1, "#8000d7");
};
WaveLines.prototype.render = function (ctx) {
    if (!this.lineColor) this.color(ctx);
    this.update();
    ctx.strokeStyle = this.lineColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    var l = this.bb - this.ss;
    for (var i = 0; i < this.lines.length; i++) {
        var x = this.lines[i][0],
            y = this.lines[i][1],
            s = i < 8 ? 0.2 + 0.1 * i : 1,
            rr = s * 46 * Math.pow((this.noise[i] - this.ss), 3) / l >> 0,
            r = this.baseR + rr;
        ctx.moveTo(x * this.baseR, y * this.baseR);
        ctx.lineTo(x * r, y * r);
    }
    ctx.closePath();
    ctx.stroke();
};