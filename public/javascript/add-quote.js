async function newFormHandler(event) {
  event.preventDefault();

  const text = document.querySelector('input[name="quote-text"]').value;
  const author = document.querySelector('input[name="quote-url"]').value;

  const response = await fetch(`/api/quotes`, {
    method: "POST",
    body: JSON.stringify({
      text,
      author,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    document.location.replace("/");
  } else {
    alert(response.statusText);
  }
}

document
  .querySelector(".new-quote-form")
  .addEventListener("submit", newFormHandler);
