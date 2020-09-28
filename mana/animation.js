Vue.component('shadow-zero', {
	template: '<canvas ref="screen" width=640 height=480></canvas>',
	props: {
		rate: {  // Number of zeros on screen at once
			type: Number,
			default: 128,
		}
	},
	data: function() {
		return {
			canvas: null,
			shadows: [],
			shadowImage: new Image()
		}
	},
    mounted: function () {
		// Get canvas
		this.canvas = this.$refs.screen
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		
		// Load sprite sheet
		this.shadowImage.addEventListener("load", this.mainLoop);
		this.shadowImage.src = "shadowzero.png";
    },
    methods: {
		mainLoop: function() {
		
			window.requestAnimationFrame(this.mainLoop);

			if (this.shadows.length > 0) {
				const context = this.canvas.getContext('2d');
				context.clearRect(0, 0, this.canvas.width, this.canvas.height);
				if (!toRender) {
					var toRender = this.shadows.slice(0, this.rate);
				}

				toRender.forEach(shadow => {
					if (!shadow.update()) {
						this.shadows.splice(this.shadows.indexOf(shadow), 1);
						var toRender = this.shadows.slice(0, this.rate);
						// Sort by -y
						toRender.sort((a, b) => a.y - b.y);
					};
					shadow.render();
				});
			}
		},
		sprite: function (options) {
		
			var that = {},
				frameIndex = 0,
				tickCount = 0,
				ticksPerFrame = options.ticksPerFrame || 0,
				numberOfFrames = options.numberOfFrames || 1;
			
			that.context = options.context;
			that.width = options.width;
			that.height = options.height;
			that.image = options.image;
			if (options.id < this.rate) {
				that.x = options.context.canvas.width + ((options.context.canvas.width / this.rate) * options.id );
			} else {
				that.x = options.context.canvas.width + options.width;
			}
			that.y = (options.context.canvas.height * 0.33) + (Math.random() * (options.context.canvas.height * 0.33));
			that.speed = 1.5 + (Math.random());
			
			that.update = function () {

				tickCount += 1;
				that.x -= that.speed;
				if (that.x < -(that.width / numberOfFrames)) {
					return false;
				}

				if (tickCount > ticksPerFrame) {

					tickCount = 0;
					
					// If the current frame index is in range
					if (frameIndex < numberOfFrames - 1) {	
						// Go to the next frame
						frameIndex += 1;
					} else {
						frameIndex = 0;
					}
				}
				return true
			};
			
			that.render = function () {
			// Draw the animation
			that.context.drawImage(
				that.image,
				frameIndex * that.width / numberOfFrames,
				0,
				that.width / numberOfFrames,
				that.height,
				that.x,
				that.y,
				that.width / numberOfFrames,
				that.height);
			};
			
			return that;
		},
		createShadows: function (number) {
			for (let i = 0; i < number; i++) {
				// Create sprite
				var shadow = this.sprite({
					id: i,
					context: this.canvas.getContext("2d"),
					width: 136,
					height: 36,
					image: this.shadowImage,
					numberOfFrames: 4,
					ticksPerFrame: 8
				});
				this.shadows.push(shadow)
			}
			// The straggler is last
			this.shadows[this.shadows.length - 1].x += 0.5 * this.canvas.width;
			this.shadows[this.shadows.length - 1].speed = 2;
		},
        do_alert(msg) {
			try {
				// TODO: Handle event while shadows still running
				this.createShadows(parseInt(msg.tags['msg-param-viewerCount']));
			} catch(err) {
				console.warn(err);
			}
		}
    }
});
