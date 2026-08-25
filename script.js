const menu = document.querySelector(".menu");
const nav = document.querySelector(".site-header nav");

if (menu && nav) {
  menu.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menu.setAttribute("aria-expanded", open);
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menu.setAttribute("aria-expanded", "false");
    });
  });
}

const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const projectForm = document.getElementById("project-form");
const formStatus = document.getElementById("form-status");

if (projectForm && formStatus) {
  projectForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = projectForm.querySelector('button[type="submit"]');
    const formData = new FormData(projectForm);

    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      website: String(formData.get("website") || "").trim(),
      project: String(formData.get("project") || "").trim(),
      message: String(formData.get("message") || "").trim(),
    };

    formStatus.textContent = "Sending your inquiry…";
    formStatus.classList.remove("is-error", "is-success");

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || "The message could not be sent. Please try again."
        );
      }

      projectForm.reset();

      formStatus.textContent =
        "Thank you. Your inquiry has been sent — I'll be in touch soon.";

      formStatus.classList.add("is-success");
    } catch (error) {
      formStatus.textContent =
        error.message || "Something went wrong. Please try again.";

      formStatus.classList.add("is-error");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}
