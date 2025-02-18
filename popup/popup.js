(function() {
	// 1. Create a toggle button (icon) in the corner of the screen
	const toggleButton = document.createElement('img');
	toggleButton.src = chrome.runtime.getURL('icons/icon128.jpg'); // Use any icon you have
	toggleButton.style.position = 'fixed';
	toggleButton.style.top = '50%';
	toggleButton.style.right = '10px'; 
	toggleButton.style.transform = 'translateY(-50%)';
	toggleButton.style.width = '48px';
	toggleButton.style.height = '48px';
	toggleButton.style.cursor = 'pointer';
	toggleButton.style.zIndex = '9999'; // Ensure it's above most elements
	document.body.appendChild(toggleButton);

	// 2. Create the popup container
	const container = document.createElement('div');
	container.id = 'draggable-popup';
	// Initial positioning; you can adjust these as needed
	container.style.position = 'fixed';
	container.style.top = '100px';
	container.style.left = '100px';
	container.style.border = '1px solid #ccc';
	container.style.backgroundColor = '#fff';
	container.style.zIndex = '9998'; // Just below the toggle button
	container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
	container.style.display = 'none'; // Initially hidden

	// 3. Create the header for dragging
	const header = document.createElement('div');
	header.id = 'popup-header';
	header.textContent = "Charlie's Email Checker";
	header.style.cursor = 'move';
	header.style.backgroundColor = '#eee';
	header.style.padding = '8px';
	header.style.fontWeight = 'bold';
	container.appendChild(header);

	// 4. Add a close button (×) to hide the overlay
	const closeButton = document.createElement('button');
	closeButton.className = 'close-btn'; // apply .close-btn styles
	closeButton.textContent = '×';
	header.appendChild(closeButton);
	header.appendChild(closeButton);
	closeButton.addEventListener('click', () => {
		container.style.display = 'none';
	});

	// 5. Create a content container where popup.html will be inserted
	const contentContainer = document.createElement('div');
	contentContainer.id = 'popup-content';
	contentContainer.style.textAlign = 'center';
	contentContainer.style.display = 'flex';
	contentContainer.style.flexDirection = 'column';
	contentContainer.style.justifyContent = 'center';
	contentContainer.style.alignItems = 'center';
	contentContainer.style.height = '100%';
	container.appendChild(contentContainer);

	// 6. Append the container to the document body
	document.body.appendChild(container);

	// 7. Toggle button logic: show/hide the popup
	toggleButton.addEventListener('click', () => {
		// If container is hidden, display it; if visible, hide it
		container.style.display = container.style.display === 'none' ? 'inline-block' : 'none';
	});

	// 8. Load popup.html content via fetch and insert into content container
	fetch(chrome.runtime.getURL('popup/popup.html'))
		.then(response => response.text())
		.then(html => {
			contentContainer.innerHTML = html;

			// Now that the HTML is in place, find the input
			const emailInput = contentContainer.querySelector('#email');
			const resultSpan = contentContainer.querySelector('#result');
			const form = contentContainer.querySelector('#email-form');

			// Define the validation function in JS (not inline in HTML)
			function validateEmail() {
				var email = emailInput.value;
				var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!regex.test(email)) {
					resultSpan.textContent = "Invalid format";
					return false;
				}
				resultSpan.textContent = "";
				return true;
			}

			// Attach keyup and form submit handlers
			emailInput.addEventListener('keyup', validateEmail);

			form.addEventListener('submit', function(event) {
				event.preventDefault();
				if (validateEmail()) {
					resultSpan.textContent = "Email might be right.";
				}
			});
		})
		.catch(err => console.error('Error loading popup.html:', err));

	// 9. Set up simple dragging using the header as the drag handle
	let offsetX = 0, offsetY = 0, startX, startY;

	header.addEventListener('mousedown', function(e) {
		startX = e.clientX;
		startY = e.clientY;
		document.addEventListener('mousemove', movePopup);
		document.addEventListener('mouseup', stopMove);
	});

	function movePopup(e) {
		offsetX = e.clientX - startX;
		offsetY = e.clientY - startY;
		container.style.top = (container.offsetTop + offsetY) + 'px';
		container.style.left = (container.offsetLeft + offsetX) + 'px';
		startX = e.clientX;
		startY = e.clientY;
	}

	function stopMove() {
		document.removeEventListener('mousemove', movePopup);
		document.removeEventListener('mouseup', stopMove);
	}
})();