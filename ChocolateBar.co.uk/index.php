<?php

	// Define constants and plug them into the JS
	define("EXTRA_PAPER_PERCENT", 0.05); // 5%
	define("STAFF_PRODUCTIVITY_PERCENT", 0.7); // 70%
	define("BARS_PACKED_PER_MINUTE", 4);
	define("MANAGER_PER_PACKERS", 10);
	define("WORKED_HOURS_PER_DAY", 8);

	// Include OOP for future DB integration
	require "php/class/ChocolateBar.php";
	require "php/class/WaxPaper.php";

	// Instantiate DB values manually
	$chocolateBars = array(); //         [name]    [£p]  [W] [L] [H]
	$chocolateBars[0] = new ChocolateBar("Small",   50, 13,  3, 1);
	$chocolateBars[1] = new ChocolateBar("Medium", 150, 12, 18, 1);
	$chocolateBars[2] = new ChocolateBar("Large",  240, 14, 30, 1);
	
	$waxPapers = array(); //   [ID] [£p]   [W]   [L]
	$waxPapers[0] = new WaxPaper(1, 4980, 400, 50000);

	$staffRoles = array(
		"packer" => 719,
		"manager" => 1293
	);
?>
<!doctype html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<title>Pablo's Chocolate Bar Shop</title>
	<link rel="stylesheet" href="css/styles.css">
</head>
<body>
	<section>
		<h1>Efficiency Calculator</h1>
		<form>
			<!-- Pre-defined wax paper (as potentially multiple suppliers have different sizes) -->
			<label><span>*Pick a predefined wax paper size:</span>
				<select name="wax-paper">
					<option value="" disabled selected>Select an option</option>
					<?php foreach ($waxPapers as $waxPaper) { ?>
						<option data-supplier-id="<?= $waxPaper->getSupplierID(); ?>"
								data-price="<?= $waxPaper->getPrice(); ?>"
								data-width="<?= $waxPaper->getWidth(); ?>"
								data-length="<?= $waxPaper->getLength(); ?>">Supplier [<?= $waxPaper->getSupplierID(); ?>] (<?= $waxPaper->getWidth(); ?>cm &#215; <?= $waxPaper->getLength(); ?>cm)</option>
					<?php } ?>
				</select>
			</label>
			<!-- Pre-defined chocolate bars -->
			<label><span>Pick a predefined chocolate bar:</span>
				<select name="chocolate-bar" onchange="Controller.selectPredefinedChocolateBar(this);">
					<option value="" disabled selected>Select an option</option>
					<?php foreach ($chocolateBars as $chocolateBar) { ?>
						<option data-name="<?= $chocolateBar->getName(); ?>"
								data-price="<?= $chocolateBar->getPrice(); ?>"
								data-width="<?= $chocolateBar->getWidth(); ?>"
								data-length="<?= $chocolateBar->getLength(); ?>"
								data-height="<?= $chocolateBar->getHeight(); ?>"><?= $chocolateBar->getName(); ?> (<?= $chocolateBar->getWidth(); ?>cm &#215; <?= $chocolateBar->getLength(); ?>cm &#215; <?= $chocolateBar->getHeight(); ?>cm)</option>
					<?php } ?>
				</select>
			</label>
			<label><span>*Name: </span><input type="text" name="name"></label>
			<label><span>*Price (pence):</span><input type="number" name="price" min="1" value="0" required></label>
			<label><span>*Width (cm):</span><input type="number" name="width" min="1" value="0" required></label>
			<label><span>*Length (cm):</span><input type="number" name="length" min="1" value="0" required></label>
			<label><span>*Height (cm):</span><input type="number" name="height" min="1" value="0" required></label>
			<label><span>*Packers on duty today:</span><input type="number" name="packers" min="1" value="0" required></label>
			<input type="button" value="Run Calculations" onclick="Controller.clickRunCalculationsButton(this);">
			<br>
			<table id="breakdown">
				<thead>
					<tr>
						<th colspan="2">Breakdown</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Wax paper dimensions (cm)</td>
						<td id="wax-paper-dimensions"></td>
					</tr>
					<tr>
						<td>Wax paper price (£)</td>
						<td id="wax-paper-price"></td>
					</tr>
					<tr>
						<td>Product name</td>
						<td id="product-name"></td>
					</tr>
					<tr>
						<td>Product price (£)</td>
						<td id="product-price"></td>
					</tr>
					<tr>
						<td>Real product dimensions (cm)</td>
						<td id="product-real-dimensions"></td>
					</tr>
					<tr>
						<td>Total wrapped bars</td>
						<td id="calculation-total-bars"></td>
					</tr>
					<tr>
						<td>Packers on duty</td>
						<td id="worker-packer-count"></td>
					</tr>
					<tr>
						<td>How many managers required</td>
						<td id="worker-manager-count"></td>
					</tr>
					<tr>
						<td>Total time</td>
						<td id="calculation-time-to-wrap-bars"></td>
					</tr>
					<tr>
						<td>Total time  @ <?= STAFF_PRODUCTIVITY_PERCENT * 100; ?>% efficiency)</td>
						<td id="calculation-realistic-time-to-wrap-bars"></td>
					</tr>
					<tr>
						<td>Total cost for T&amp;M (£)</td>
						<td id="cost-to-wrap-bars"></td>
					</tr>
				</tbody>
				<tfoot>
					<tr>
						<td colspan="2">Note: <?= (EXTRA_PAPER_PERCENT * 100); ?>% extra paper is used for wrapping.</td>
					</tr>
				</tfoot>
			</table>
		</form>
	</section>
	<!-- JS constants declared here -->
	<script>
	
		/*
		 * jQuery could be used to query and update input fields. However,
		 * I have chosen to use Chromium-based querySelector as it's built
		 * into most modern browsers.
		 * 
		 * Note: This won't work with older versions of IE.
		 */
	
		const inputWaxPaper = document.querySelector("select[name='wax-paper']");
		const inputChocolateBar = document.querySelector("select[name='chocolate-bar']");
		const inputName = document.querySelector("input[name='name']");
		const inputWidth = document.querySelector("input[name='width']");
		const inputLength = document.querySelector("input[name='length']");
		const inputHeight = document.querySelector("input[name='height']");
		const inputPrice = document.querySelector("input[name='price']");
		const inputPackerCount = document.querySelector("input[name='packers']");
		
		// FROM <td> array TO { <td> identifier : <td> } object
		const breakdownFields = Array.from(document.querySelectorAll("table#breakdown tbody td[id]")).reduce((obj, td) => (obj[td.id] = td, obj), {});
		
		/**
		 * These values are rendered from PHP to JS, so
		 * they can be loaded from a table in the future.
		 */
		const extraPaperPercent = <?= EXTRA_PAPER_PERCENT; ?>;
		const barsPackedPerMinute = <?= BARS_PACKED_PER_MINUTE; ?>;
		const staffProductivityPercent = <?= STAFF_PRODUCTIVITY_PERCENT; ?>;
		const managerPerPackers = <?= MANAGER_PER_PACKERS; ?>;
		const workedHoursPerDay = <?= WORKED_HOURS_PER_DAY; ?>;
		const staffRoles = <?= json_encode($staffRoles); ?>;
		
	</script>
	<!-- VMC -->
	<script src="js/view.js"></script>
	<script src="js/model.js"></script>
	<script src="js/controller.js"></script>
</body>
</html>