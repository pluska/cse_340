const formSellData = document.querySelector("#edit-sell-form")
formSellData.addEventListener("change", function () {
  const updateBtn = document.querySelector("#update-btn")
  updateBtn.removeAttribute("disabled")
})