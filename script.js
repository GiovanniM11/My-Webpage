// Cache the page elements used by the menu, image modal, and contact form.
const menuToggle = document.getElementById("menuToggle");
const navigation = document.getElementById("mainNavigation");
const navLinks = document.getElementById("navLinks");
const imageModal = document.getElementById("imageModal");
const imageModalContent = document.getElementById("imageModalContent");
const closeImageModalButton = document.getElementById("closeImageModal");
const contactForm = document.getElementById("contactForm");
const contactFields = [
    document.getElementById("contact-name"),
    document.getElementById("contact-email"),
    document.getElementById("contact-message")
];

// Toggle the mobile menu and keep its accessible state in sync.
function toggleMenu() {
    const isOpen = navigation.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
    );
}

// Close the mobile menu after a navigation link is selected.
function closeMenu() {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
}

// Attach the close behavior to each navigation link.
function addLinkCloseHandlers() {
    for (let index = 0; index < navLinks.children.length; index += 1) {
        const link = navLinks.children[index].firstElementChild;
        link.addEventListener("click", closeMenu);
    }
}

// Copy an image's source and alt text into the enlarged-image modal.
function openImageModal(image) {
    imageModalContent.src = image.src;
    imageModalContent.alt = image.alt;
    imageModal.showModal();
}

// Let keyboard users open an image with Enter or Space.
function handleImageKeydown(event) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openImageModal(event.currentTarget);
    }
}

// Close the enlarged-image modal.
function closeImageModal() {
    imageModal.close();
}

// Close the modal when the backdrop outside it is clicked.
function closeImageModalOnBackdrop(event) {
    if (event.target === imageModal) {
        closeImageModal();
    }
}

// Close the modal on Escape and prevent the default dialog handling.
function closeImageModalOnEscape(event) {
    if (event.key === "Escape") {
        event.preventDefault();
        closeImageModal();
    }
}

// Make page images keyboard accessible and connect them to the modal.
function addImageModalHandlers() {
    const images = document.getElementsByTagName("img");
    for (let index = 0; index < images.length; index += 1) {
        if (images[index] === imageModalContent) {
            continue;
        }

        images[index].setAttribute("role", "button");
        images[index].setAttribute("tabindex", "0");
        images[index].setAttribute("aria-label", "View larger image: " + images[index].alt);
        images[index].addEventListener("click", function () {
            openImageModal(this);
        });
        images[index].addEventListener("keydown", handleImageKeydown);
    }
}

// Return the required-field or email-format error for a contact field.
function getContactFieldError(field) {
    if (field.value.trim() === "") {
        return "Please fill out this field.";
    }

    if (field.type === "email" && !field.validity.valid) {
        return "Please enter a valid email address.";
    }

    return "";
}

// Show or clear a field's error and report whether it is valid.
function validateContactField(field, showFeedback) {
    const errorMessage = getContactFieldError(field);
    const errorElement = document.getElementById(field.id + "-error");

    if (showFeedback) {
        errorElement.textContent = errorMessage;
        if (errorMessage) {
            field.setAttribute("aria-invalid", "true");
        } else {
            field.removeAttribute("aria-invalid");
        }
    }

    return errorMessage === "";
}

// Revalidate a field as the user types or leaves it.
function handleContactFieldInput(event) {
    validateContactField(event.currentTarget, true);
}

// Block submission when fields are invalid and focus the first error.
function handleContactFormSubmit(event) {
    let firstInvalidField = null;

    for (let index = 0; index < contactFields.length; index += 1) {
        if (!validateContactField(contactFields[index], true) && firstInvalidField === null) {
            firstInvalidField = contactFields[index];
        }
    }

    if (firstInvalidField !== null) {
        event.preventDefault();
        firstInvalidField.focus();
    }
}

// Connect menu and image-modal controls to their event handlers.
menuToggle.addEventListener("click", toggleMenu);
addLinkCloseHandlers();
closeImageModalButton.addEventListener("click", closeImageModal);
imageModal.addEventListener("click", closeImageModalOnBackdrop);
imageModal.addEventListener("keydown", closeImageModalOnEscape);
addImageModalHandlers();

// Connect contact form submission and real-time field validation.
contactForm.addEventListener("submit", handleContactFormSubmit);

for (let index = 0; index < contactFields.length; index += 1) {
    contactFields[index].addEventListener("input", handleContactFieldInput);
    contactFields[index].addEventListener("blur", handleContactFieldInput);
}