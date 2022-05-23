async function editFormHandler(event) {
  event.preventDefault();

  const text = document.querySelector('input[name="quote-text"]').value.trim();
  const id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];
  const response = await fetch(`/api/quotes/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      text,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.replace("/dashboard/");
  } else {
    alert(response.statusText);
  }
}

document
  .querySelector(".edit-quote-form")
  .addEventListener("submit", editFormHandler);
