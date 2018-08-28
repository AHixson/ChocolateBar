/**
 * Encapsulated singelton for controller.
 */
const Controller = (function() {
	
	/**
	 * Update dimension and price fields in the Product Breakdown.
	 */
	function selectPredefinedChocolateBar(e) {
		var selectedOption = e.options[e.selectedIndex];
		Model.updateChocolateBarInputs(selectedOption.dataset);
	}

	function clickRunCalculationsButton(e) {
		Model.runCalculations();
	}
	
	return {
		selectPredefinedChocolateBar: selectPredefinedChocolateBar,
		clickRunCalculationsButton: clickRunCalculationsButton
	};
})();
