
(function(a) {
	a(function() {
		var b = function(b, c) {
				function m(a, b, c, d) {
					this.speed = b, this.xPos = c, this.yPos = d, this.opacity = -.03 + a / 10, this.counter = 0
				}

				function n(a, b, c, d, f, g) {
					e.moveTo(a.xPos + a.counter * i * b, a.yPos + a.counter), 
					e.bezierCurveTo(a.xPos + a.counter * i * b + c * b,
									a.yPos + a.counter + d, 
									a.xPos + a.counter * i * b + f * b,
									a.yPos + a.counter + g, 
									a.xPos + a.counter * i * b, 
									a.yPos + a.counter)
					
				}

				function o() {
					for (var a = 0; h > a; a++) {
						var b = Math.round(Math.random() * f * i + f);
						"right" == c ? b *= -1 : "left" != c && (b = Math.round(Math.random() * f * i + 1));
						var d = -1 * Math.round(Math.random() * g * 2 + 50),
							e = 5 + 5 * Math.random(),
							k = Math.floor(10 * Math.random() + 1),
							b = new m(k, e, b, d);
						j.push(b)
					}
					p()
				}

				function p() {
					e.clearRect(0, 0, f, g);
					for (var a = 0; a < j.length; a++) j[a].update();
					l = k(p)
				}
				var d = a(b),
					e = d[0].getContext("2d"),
					f = 1366,
					g = 638;
				d.attr({
					width: f,
					height: g
				});
				var l, h = 5e3,
					i = 1,
					c = "left",
					j = [],
					k = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
				m.prototype.update = function() {
						this.counter += this.speed, 
						this.yPos + this.counter > g && (this.xPos = Math.round(Math.random() * f * i + f), 
						"right" == c ? this.xPos = -1 * Math.round(Math.random() * f * i + 25) : "left" != c && (this.xPos = Math.round(Math.random() * f + 1)),
						this.yPos = -1 * Math.round(Math.random() * g * 2 + 1), this.counter = 0), 
						e.beginPath(), "left" == c ? n(this, -1, 7, 10, 11, 5) : "right" == c ? n(this, 1, 7, 10, 11, 5) : (i = 0, n(this, 1, 0, 15, 3, 20)), 
						e.fillStyle = "rgba(255, 255, 255," + this.opacity.toFixed(2) + ")", 
						e.fill()
				}, o()
			};
		b("#rain_canvas", "left")
	})
}(jQuery));