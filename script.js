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

    formStatus.textContent = "Sending your inquiry…";
    formStatus.classList.remove("is-error", "is-success");

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      const keyResponse = await fetch("/api/contact-key");
      const keyData = await keyResponse.json().catch(() => ({}));

      if (!keyResponse.ok || !keyData.accessKey) {
        throw new Error(
          keyData.error || "The contact form is not configured."
        );
      }

      const payload = {
        access_key: keyData.accessKey,
        subject: `New website inquiry from ${String(formData.get("name") || "").trim()}`,
        from_name: "Painted Gate Creative Website",
        name: String(formData.get("name") || "").trim(),
        email: String(formData.get("email") || "").trim(),
        website: String(formData.get("website") || "").trim() || "Not provided",
        project: String(formData.get("project") || "").trim(),
        message: String(formData.get("message") || "").trim(),
      };

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message || "The message could not be sent. Please try again."
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
