
const buyBtn = document.getElementById("buyBtn");
const successMessage = document.getElementById("successMessage");

buyBtn.addEventListener("click", () => {
    successMessage.classList.remove("hidden");
});
