<?php
	
	class WaxPaper {
		
		var $supplierId;
		var $price;		// pence
		var $width;		// cm
		var $length;	// cm
		
		function __construct($supplierId, $price, $width, $length) {
			$this->supplierId = $supplierId;
			$this->price = $price;
			$this->width = $width;
			$this->length = $length;
		}
		
		function getSupplierID() {
			return $this->supplierId;
		}
		
		function getPrice() {
			return $this->price;
		}
		
		function getWidth() {
			return $this->width;
		}
		
		function getLength() {
			return $this->length;
		}
		
	}
?>