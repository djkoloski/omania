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
