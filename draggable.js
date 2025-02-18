(function() {
  const popupId = 'email-checker-popup';

  // Create the popup container if it doesn't already exist
  if (!document.getElementById(popupId)) {
    const container = document.createElement('div');
    container.id = popupId;
    // Include an image for the icon and the header text
    container.innerHTML = `
      <div id="popup-header">
        <img src="${chrome.runtime.getURL('icon.jpg')}" alt="Icon" id="popup-icon">
        Email Checker
      </div>
      <iframe src="${chrome.runtime.getURL('index.html')}" frameborder="0"></iframe>
    `;
    document.body.appendChild(container);

    // Optional inline styles in case CSS hasn't loaded yet
    container.style.position = 'fixed';
    container.style.right = '0';
    container.style.top = '100px';
    container.style.width = '300px';
    container.style.height = '400px';
  }

  // Set up dragging using the header as the drag handle
  let posX = 0, posY = 0, mouseX = 0, mouseY = 0;
  const dragElement = document.getElementById(popupId);
  const header = document.getElementById('popup-header');

  header.style.cursor = 'move';
  header.addEventListener("mousedown", dragMouseDown);

  function dragMouseDown(e) {
    e.preventDefault();
    // Capture the current mouse position
    mouseX = e.clientX;
    mouseY = e.clientY;
    document.addEventListener("mousemove", elementDrag);
    document.addEventListener("mouseup", closeDragElement);
  }

  function elementDrag(e) {
    e.preventDefault();
    // Calculate the change in mouse movement
    posX = mouseX - e.clientX;
    posY = mouseY - e.clientY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Update the popup's position
    dragElement.style.top = (dragElement.offsetTop - posY) + "px";
    dragElement.style.left = (dragElement.offsetLeft - posX) + "px";
    // When dragging, clear the right style so the element's position
    // is controlled by top and left values.
    dragElement.style.right = 'auto';
  }

  function closeDragElement() {
    document.removeEventListener("mousemove", elementDrag);
    document.removeEventListener("mouseup", closeDragElement);
  }
})();