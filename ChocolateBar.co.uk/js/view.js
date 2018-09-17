/**
 * Encapsulated singelton for view.
 */
const View = (function() {
	
	function renderChocolateBarValues(input) {
		inputName.value = input.name;
		inputPrice.value = input.price;
		inputWidth.value = input.width;
		inputLength.value = input.length;
		inputHeight.value = input.height;
	}
	
	function renderBreakdownValues(waxPaper, product, other) {
		// wax paper
		breakdownFields["wax-paper-price"].innerHTML = waxPaper.price;
		breakdownFields["wax-paper-dimensions"].innerHTML = waxPaper.dimensions;
		// Product
		breakdownFields["product-name"].innerHTML = product.name;
		breakdownFields["product-price"].innerHTML = product.price;
		breakdownFields["product-real-dimensions"].innerHTML = product.realDimensions;
		// Other
		breakdownFields["calculation-total-bars"].innerHTML = other.totalBars;
		breakdownFields["calculation-time-to-wrap-bars"].innerHTML = other.timeToWrapBars;
		breakdownFields["calculation-realistic-time-to-wrap-bars"].innerHTML = other.realisticTimeToWrapBars;
		breakdownFields["cost-to-wrap-bars"].innerHTML = other.costToWrapBars;
		breakdownFields["worker-packer-count"].innerHTML = other.workerPackerCount;
		breakdownFields["worker-manager-count"].innerHTML = other.workerManagerCount;
	}
	
	function renderBreakdown() {
		
		var totalBars = Model.calculateHowManyPiecesCanBeCut();
		
		var eta = Model.calculateETA(totalBars);
		var etaReal = Model.calculateRealisticETA(eta);
		
		var calculateTotalCost = 0;
			calculateTotalCost += userInput.waxPaper.price;
			calculateTotalCost += (staffRoles.packer * etaReal * workedHoursPerDay);
			calculateTotalCost += (staffRoles.manager * etaReal * workedHoursPerDay);

		var waxPaper = {
			price: Model.formatCurrency(userInput.waxPaper.price),
			dimensions: [ userInput.waxPaper.width, userInput.waxPaper.length ].join(" × ")
		};
		
		var product = {
			name: userInput.product.name,
			price: Model.formatCurrency(userInput.product.price),
			realDimensions: [ Model.calculateExtraPaper(userInput.product.width),
							  Model.calculateExtraPaper(userInput.product.length),
							  Model.calculateExtraPaper(userInput.product.height) ].join(" × ")
		};
		
		var other = {
			totalBars: totalBars,
			timeToWrapBars: Model.formatTime(eta * 24 * 60 * 60 * 1000),
			realisticTimeToWrapBars: Model.formatTime(etaReal * 24 * 60 * 60 * 1000),
			costToWrapBars: Model.formatCurrency(calculateTotalCost),
			workerPackerCount: userInput.packersOnDuty,
			workerManagerCount: Model.calculateManagersRequiredForPackers()
		};
		
		renderBreakdownValues(waxPaper, product, other);
	}
	
	function extractUserInput() {
		var selectedWaxPaper = inputWaxPaper.options[inputWaxPaper.selectedIndex];
		return {
			product: {
				name: inputName.value,
				price: parseInt(inputPrice.value),
				width: parseInt(inputWidth.value),
				length: parseInt(inputLength.value),
				height: parseInt(inputHeight.value)
			},
			waxPaper: {
				id: parseInt(selectedWaxPaper.dataset.supplierId),
				price: parseInt(selectedWaxPaper.dataset.price),
				width: parseInt(selectedWaxPaper.dataset.width),
				length: parseInt(selectedWaxPaper.dataset.length)
			},
			packersOnDuty: parseInt(inputPackerCount.value)
		};
	}
	
	function showError(err = "A problem has occured!") {
		alert(err);
	}
	
	return {
		renderChocolateBarValues: renderChocolateBarValues,
		renderBreakdown: renderBreakdown,
		extractUserInput: extractUserInput,
		showError: showError
	};
})();

