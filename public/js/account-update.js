const formAccountData = document.querySelector("#edit-account-form")
formAccountData.addEventListener("change", function () {
  const updateBtn = document.querySelector("#updateAccount")
  updateBtn.removeAttribute("disabled")
})

const formPassword = document.querySelector("#change-password-form")
formPassword.addEventListener("change", function () {
  const updateBtn = document.querySelector("#changePassword")
  updateBtn.removeAttribute("disabled")
})