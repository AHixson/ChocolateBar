var userInput = {}; // Stores Aggregate input information into a single variable (singelton design)

/**
 * Encapsulated singelton for model.
 */
const Model = (function() {

	function updateChocolateBarInputs(dataset) {
		View.setInputName(dataset.name);
		View.setInputPrice(dataset.price);
		View.setInputWidth(dataset.width);
		View.setInputLength(dataset.length);
		View.setInputHeight(dataset.height);
	}

	function runCalculations() {
		userInput = View.extractUserInput();
		if (validateInput()) {
			renderBreakdown();
		} else {
			View.showError("Please ensure all the fields marked with * are correct.");
		}
	}

	function validateInput() {
		
		var validProduct = Object.keys(userInput.product).length > 0 && userInput.product.constructor === Object
			&& userInput.product.name.length > 0
			&& userInput.product.price > 0
			&& userInput.product.width > 0
			&& userInput.product.length > 0
			&& userInput.product.height > 0;
		
		var validWaxPaper = Object.keys(userInput.waxPaper).length > 0 && userInput.waxPaper.constructor === Object
			&& userInput.waxPaper.id > 0
			&& userInput.waxPaper.price > 0
			&& userInput.waxPaper.width > 0
			&& userInput.waxPaper.length > 0;
		
		return (validProduct && validWaxPaper && userInput.packersOnDuty > 0);
	}

	function renderBreakdown() {
		
		var totalBars = calculateHowManyPiecesCanBeCut();
		
		var eta = (totalBars / userInput.packersOnDuty / barsPackedPerMinute / 60 / workedHoursPerDay); // working days
		var etaReal = eta + (eta * (1.0 - staffProductivityPercent));
		
		var waxPaperDimensions = [
			userInput.waxPaper.width,
			userInput.waxPaper.length 
		];
		
		var realDimensions = [
			calculateExtraPaper(userInput.product.width),
			calculateExtraPaper(userInput.product.length),
			calculateExtraPaper(userInput.product.height)
		];
		
		var managersRequired = userInput.packersOnDuty >= managerPerPackers ?
			Math.floor(userInput.packersOnDuty / managerPerPackers) : 0;
		
		var calculateTotalCost = 0;
			calculateTotalCost += userInput.waxPaper.price;
			calculateTotalCost += (staffRoles.packer * etaReal * workedHoursPerDay);
			calculateTotalCost += (staffRoles.manager * etaReal * workedHoursPerDay);
		
		// Wax paper
		View.setWaxPaperPrice(parseFloat(userInput.waxPaper.price / 100).toFixed(2));
		View.setWaxPaperDimensions(waxPaperDimensions.join(" × "));
		// Product
		View.setName(userInput.product.name);
		View.setProductPrice(parseFloat(userInput.product.price / 100).toFixed(2));
		View.setRealDimensions(realDimensions.join(" × "));
		// Calculations
		View.setTotalWrappedBars(totalBars);
		View.setTimeToWrapBars(formatTime(eta * 24 * 60 * 60 * 1000));
		View.setTimeToRealisticallyWrapBars(formatTime(etaReal * 24 * 60 * 60 * 1000));
		View.setCostToWrapBars(parseFloat(calculateTotalCost / 100).toFixed(2));
		// Staff
		View.setPackersOnDuty(userInput.packersOnDuty);
		View.setManagersRequird(managersRequired);
		// Total cost
	}

	/*
	 * Helper functions below
	 */

	/** 
	 * Based on box model:
	 * 
	 *   #
	 *  ###
	 *   #
	 *   #
	 * 
	 * Where left-to-right = (length + width + length)
	 *       top-to-bottom = (length + height + length + height)
	 */
	function calculateHowManyPiecesCanBeCut() {
		
		var width = userInput.product.width;
		var length = userInput.product.length;
		var height = userInput.product.height;
		
		var topToBottom = (width * 2 + length);
			topToBottom = calculateExtraPaper(topToBottom);
			
		var leftToRight = ((height * 2) + (length * 2));
			leftToRight = calculateExtraPaper(leftToRight);
		
		var rows = Math.floor(userInput.waxPaper.length / leftToRight);
		var cols = Math.floor(userInput.waxPaper.width / topToBottom);
		
		return rows * cols;
	}
	 
	/**
	 * Calculate real wax paper size (cm).
	 * 
	 * To avoid JS trailing zeros, the results has been fixed to '2' decimal places.
	 */
	function calculateExtraPaper(size) {
		var extraPaper = parseFloat(size) * extraPaperPercent;
		return parseFloat(size + extraPaper).toFixed(2);
	}

	/**
	 * Convert time to HH : MM : SS
	 */
	function formatTime(time) {
		
		var seconds = (time / 1000) % 60
		var minutes = (time / (1000 * 60)) % 60
		var hours = (time / (1000 * 60 * 60)) % 24
		var days = (time / (1000 * 60 * 60 * 24));
		
		seconds = ("0" + Math.floor(seconds)).substr(-2);
		minutes = ("0" + Math.floor(minutes)).substr(-2);
		hours = ("0" + Math.floor(hours)).substr(-2);
		days = Math.floor(days);
		
		return `${days} days : ${hours} hours : ${minutes} minutes : ${seconds} seconds`;
	}

	return {
		runCalculations: runCalculations,
		updateChocolateBarInputs: updateChocolateBarInputs
	};
})();
