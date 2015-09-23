function BounceCurve(time, curve) {
	this.time = time;
	this.curve = curve;
	this.elapsedTime = 0.0;
}
BounceCurve.prototype.update = function(dt) {
	this.elapsedTime = Math.min(this.time, this.elapsedTime + dt);
};
BounceCurve.prototype.getValue = function() {
	if (this.elapsedTime * 2.0 < this.time)
		return this.curve.evaluate(this.elapsedTime * 2.0 / this.time);
	else
		return this.curve.evaluate(2.0 - this.elapsedTime * 2.0 / this.time);
};
BounceCurve.prototype.isFinished = function() {
	return this.elapsedTime >= this.time;
};

function AnimationCurve(time, curve) {
	this.time = time;
	this.curve = curve;
	this.elapsedTime = 0.0;
}
AnimationCurve.prototype.update = function(dt) {
	this.elapsedTime = Math.min(this.time, this.elapsedTime + dt);
};
AnimationCurve.prototype.getValue = function() {
	return this.curve.evaluate(this.elapsedTime / this.time);
};
BounceCurve.prototype.isFinished = function() {
	return this.elapsedTime >= this.time;
};

function HalfSigmoid(k) {
	// k should range from -1 to 1
	this.k = k;
}
HalfSigmoid.prototype.evaluate = function(t) {
	return (this.k * t - t) / (2.0 * this.k * t - this.k - 1.0);
};

function Sigmoid(k) {
	// k should range from -1 to 1
	this.k = k;
}
Sigmoid.HalfSigmoid = function(x, k) {
	// x should range from 0 to 1
	return (k * x - x) / (2.0 * k * x - k - 1.0);
};
Sigmoid.prototype.evaluate = function(t) {
	if (t <= 0.5)
		return Sigmoid.HalfSigmoid(2.0 * t, this.k) * 0.5;
	else
		return Sigmoid.HalfSigmoid(2.0 * (t - 0.5), -this.k) * 0.5 + 0.5;
};
