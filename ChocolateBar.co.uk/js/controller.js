/**
 * Encapsulated singelton for controller.
 */
const Controller = (function() {
	
	/**
	 * Update dimension and price fields in the Product Breakdown.
	 */
	function selectPredefinedChocolateBar(e) {
		var selectedOption = e.options[e.selectedIndex];
		View.renderChocolateBarValues(selectedOption.dataset);
	}

	function clickRunCalculationsButton(e) {
		userInput = View.extractUserInput();
		if (Model.validateInput()) {
			View.renderBreakdown();
		} else {
			View.showError("Please ensure all the fields marked with * are correct.");
		}
	}
	
	return {
		selectPredefinedChocolateBar: selectPredefinedChocolateBar,
		clickRunCalculationsButton: clickRunCalculationsButton
	};
})();
