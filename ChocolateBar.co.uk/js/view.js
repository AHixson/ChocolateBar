/**
 * Encapsulated singelton for view.
 */
const View = (function() {
	
	function setInputName(name = "") {
		inputName.value = name;
	}
	
	function setInputPrice(price = 0) {
		inputPrice.value = price;
	}
	
	function setInputWidth(width = 0) {
		inputWidth.value = width;
	}
	
	function setInputLength(length = 0) {
		inputLength.value = length;
	}
	
	function setInputHeight(height = 0) {
		inputHeight.value = height;
	}
	
	function setWaxPaperPrice(price) {
		breakdownFields["wax-paper-price"].innerHTML = price;
	}

	function setWaxPaperDimensions(dimensions = "Not specified") {
		breakdownFields["wax-paper-dimensions"].innerHTML = dimensions;
	}

	function setName(name = "Unnamed") {
		breakdownFields["product-name"].innerHTML = name;
	}

	function setProductPrice(price = 0) {
		breakdownFields["product-price"].innerHTML = price;
	}

	function setRealDimensions(realDimensions = "Not specified") {
		breakdownFields["product-real-dimensions"].innerHTML = realDimensions;
	}

	function setTotalWrappedBars(total = 0) {
		breakdownFields["calculation-total-bars"].innerHTML = total;
	}

	function setPackersOnDuty(packers = 0) {
		breakdownFields["worker-packer-count"].innerHTML = packers;
	}

	function setManagersRequird(managers = 0) {
		breakdownFields["worker-manager-count"].innerHTML = managers;
	}

	function setTimeToWrapBars(time = 0) {
		breakdownFields["calculation-time-to-wrap-bars"].innerHTML = time;
	}

	function setTimeToRealisticallyWrapBars(time = 0) {
		breakdownFields["calculation-realistic-time-to-wrap-bars"].innerHTML = time;
	}

	function setCostToWrapBars(cost) {
		breakdownFields["cost-to-wrap-bars"].innerHTML = cost;
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
		setInputName: setInputName,
		setInputPrice: setInputPrice,
		setInputWidth: setInputWidth,
		setInputLength: setInputLength,
		setInputHeight: setInputHeight,
		setWaxPaperPrice: setWaxPaperPrice,
		setWaxPaperDimensions: setWaxPaperDimensions,
		setName: setName,
		setProductPrice: setProductPrice,
		setRealDimensions: setRealDimensions,
		setTotalWrappedBars: setTotalWrappedBars,
		setPackersOnDuty: setPackersOnDuty,
		setManagersRequird: setManagersRequird,
		setTimeToWrapBars: setTimeToWrapBars,
		setTimeToRealisticallyWrapBars: setTimeToRealisticallyWrapBars,
		setCostToWrapBars: setCostToWrapBars,
		extractUserInput: extractUserInput,
		showError: showError
	};
})();

