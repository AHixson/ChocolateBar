<?php
	
	class ChocolateBar {
		
		var $name;
		var $price;		// pence
		var $width;		// cm
		var $length;	// cm
		var $height;	// cm
		
		function __construct($name, $price, $width, $length, $height) {
			$this->name = $name;
			$this->price = $price;
			$this->width = $width;
			$this->length = $length;
			$this->height = $height;
		}
		
		function getName() {
			return $this->name;
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
		
		function getHeight() {
			return $this->height;
		}
		
	}
?>