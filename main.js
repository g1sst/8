document.addEventListener("DOMContentLoaded", () => {
    const popup = document.getElementById("popup");
    const openFormBtn = document.getElementById("openFormBtn");
    const closeFormBtn = document.getElementById("closeFormBtn");
    const feedbackForm = document.getElementById("feedbackForm");
    const responseMessage = document.getElementById("responseMessage");
    const name = document.getElementById("name");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const organization = document.getElementById("organization");
    const message = document.getElementById("message");

    // LocalStorage data restoration
    const restoreFormData = () => {
        const savedData = JSON.parse(localStorage.getItem("formData")) || {};
        Object.keys(savedData).forEach(key => {
            const input = document.getElementById(key);
            if (input) input.value = savedData[key];
        });
    };

    const saveFormData = () => {
        const formData = {};
        new FormData(feedbackForm).forEach((value, key) => {
            formData[key] = value;
        });
        localStorage.setItem("formData", JSON.stringify(formData));
    };

    const clearFormData = () => {
        localStorage.removeItem("formData");
        feedbackForm.reset();
    };

    const showPopup = () => {
        popup.style.display = "flex";
        history.pushState({ popupOpen: true }, "", "#feedback-form");
    };

    const closePopup = () => {
        popup.style.display = "none";
        history.replaceState({ popupOpen: false }, "", "");
    };

    // Open/Close popup
    openFormBtn.addEventListener("click", showPopup);
    closeFormBtn.addEventListener("click", closePopup);

    // History handling
    window.addEventListener("popstate", (event) => {
        if (event.state?.popupOpen) {
            showPopup();
        } else {
            closePopup();
        }
    });

    // Submit form
    feedbackForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        saveFormData();
        try {
            const response = await fetch(
                `https://api.telegram.org/bot6377527142:AAEq1-iY3iR75wPWyTPV2ByHX7ivfHHrJhc/sendMessage`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    chat_id: 1960788585, // Замените на ID чата админа
                    text: `Новая заявка:\nИмя: ${name} \nemail: ${email}\nТелефон: ${phone}\nСообщение: ${message} \nОрганизация: ${organization} }`,
                  }),
                }
              );
            
              if (response.ok) {
                closePopup();
                clearFormData();
                alert("Форма успешно отправлена!");
              }else{
                throw new Error("Ошибка отправки сообщения в Telegram");
              }
        } catch (error) {
            responseMessage.textContent = error.message;
            responseMessage.style.color = "red";
        }
    });

    // Restore form data
    restoreFormData();
});
