document.addEventListener('readystatechange', function(){
	if(document.readyState === 'complete'){

		var closestTextContainer = document.querySelector('.closest-link');
		var xElementsTextContainer = document.querySelector('.number-of-elements');
		var selectedElement = null, numberOfElements = null;

		ClosestElementFinder.init(function(element, verticallyClosest){
			/**
			 * An attempt to update the DOM only when change actually made
			 */
			if(selectedElement !== "" + element.innerHTML){
				selectedElement = element.innerHTML;
				numberOfElements = verticallyClosest.length;
				requestAnimationFrame(updateDOM);
			}
			
		});

		function updateDOM(){
			closestTextContainer.innerHTML = selectedElement;
			xElementsTextContainer.innerHTML = numberOfElements;
		}
	}
});



var ClosestElementFinder = (function(){
	/**
	 * The function that initialize the script. The starting point of it all.
	 * @param  {Function} callback - A user defined function to be called each time the values get changed
	 * @param  {string}   selector - An optional selector the user can select instead of the default <a> tag
	 */
	function init(callback, selector){
		/**
		 * An optional selector to <a> tags, you can use any of the 
		 * common selectors, like classes, tag names etc. 
		 */
		selector = selector || 'a';

		/**
		 * An empty callback, in case the user did not supply one
		 * @return {[type]} [description]
		 */
		callback = callback || function(){};

		/**
		 * Get all <a> elements as nodeList object
		 */
		//var elements = document.getElementsByTagName('a');
		var elements = document.querySelectorAll('a');

		/**
		 * Convert the nodeList to array
		 */
		var elementsArr = Array.prototype.slice.call(elements);

		/**
		 * To avoid unnessercery reflows it's better to collect all elements data in advanced
		 */
		var elementsData = getElementsData(elementsArr, []);

		var debounceCallback = debounce(function(event){
			/**
			 * Find the vertically closest link to mouse cursor
			 */
			var verticallyClosestData = findClosestY([].concat(elementsData), event.clientY, 1000, []);

			/**
			 * Afther we have a list of the vertically closest elements, we want to find the most closest 
			 * element horizontally.
			 */
			var horizontalClosestData = findClosestX([].concat(verticallyClosestData), event.clientX, 1000);

			callback(horizontalClosestData, verticallyClosestData);
			
		},10);

		/**
		 * Listen to mousemove events to find the correct location of the elements
		 */
		document.addEventListener('mousemove', debounceCallback);

	}

	/**
	 * Get a list of objects, containing all the data
	 * @param  {array} rawElements  - A list of HTML elements
	 * @param  {array} elementsData - The array container for the elements data
	 * @return {array}              - A full list of elements data
	 */
	function getElementsData(rawElements,elementsData){
		elementsData = elementsData || [];
		var element = rawElements[0];
		var data = {
			element: element,
			left: element.offsetLeft,
			top: element.offsetTop,
			width: element.offsetWidth,
			height: element.offsetHeight
		}
		elementsData.push(data);
		rawElements.shift();
		if(rawElements.length < 1){
			return elementsData;
		}
		return getElementsData(rawElements, elementsData);
	}

	/**
	 * Find the vertically closest elements to the cursor
	 * @param  {array} elementsData - An array of element data.
	 * @param  {number} mouseY       - The mouse Y coordinate.
	 * @param  {number} smallestY    - The last distance of the vertically closest element to the mouse cursor.
	 * @param  {array} xElements    - An array of elements data that share the same vertical distance from the 
	 *                                mouse cursor. Used to later find the closest horizontal element to the mouse cursor.
	 * @return {array}              - An array of elements data that share the same vertical distance from the mouse cursor.
	 */
	function findClosestY(elementsData, mouseY, smallestY, xElements){
		xElements = xElements || [];
		var element = elementsData[0];
		var top = Math.abs(element.top - mouseY);
		var bottom = Math.abs((element.top + element.height) - mouseY);
		var closest = top < bottom?top:bottom;
		if(closest < smallestY){
			xElements = [];
			xElements.push(element);
			smallestY = closest;
		}else if(closest === smallestY){
			xElements.push(element);
		}
		elementsData.shift();
		if(elementsData.length < 1){
			return xElements;
		}
		return findClosestY(elementsData, mouseY, smallestY, xElements);
	}

	/**
	 * Find the horizontally closest element to the cursor
	 * @param  {array} elementsData    - An array of elements data that share the same vertical distance from the mouse cursor.
	 *                                 Those elements horizonatal positions will be compared to get the closest one to the mouse cursor.
	 * @param  {number} mouseX          - The mouse X coordinate.
	 * @param  {number} smallestX       - The last distance of the horizontally closest element to the mouse cursor.
	 * @param  {object} selectedElement - The currently most closest element data to the mouse cursor.
	 * @return {HTML element}           - The closest element to the mouse cursor.
	 */
	function findClosestX(elementsData, mouseX, smallestX, selectedElement){
		selectedElement = selectedElement || elementsData[0];
		var element = elementsData[0];
		var left = Math.abs(element.left - mouseX);
		var right = Math.abs((element.left + element.width) - mouseX);
		var closest = left < right?left:right;
		if(closest < smallestX){
			smallestX = closest;
			selectedElement = element;
		}
		elementsData.shift();
		if(elementsData.length < 1){
			return selectedElement.element;
		}
		return findClosestX(elementsData, mouseX, smallestX, selectedElement);
	}

	/**
	 * Debounce function to be used with mousemove event
	 * @param  {Function} callback - The callback function to be run
	 * @param  {number}   delay    - The number of milliseconds to wait before running the callback
	 */
	function debounce(callback, delay){
		/**
		 * A closure variable to be accessed from the returned function
		 */
		var timeout;

		return function(){
			/**
			 * Save the context for later implementation 
			 */
			var context = this;

			/**
			 * Save the argument passed to the function for latter use
			 */
			var args = arguments;

			clearTimeout(timeout);

			var laterCallback = function(){
				timeout = null;
				callback.apply(context, args);
			}
			timeout = setTimeout(laterCallback, delay);
		}

	}

	return {
		init:function(callback, selector){
			init(callback, selector);
		}
	}
}());	