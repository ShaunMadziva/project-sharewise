document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("requestForm");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const schoolId = document.getElementById("schoolId").value.trim();
      const itemType = document.getElementById("itemType").value;
      const quantity = parseInt(document.getElementById("quantity").value);

      if (!schoolId || !itemType || isNaN(quantity) || quantity < 1) {
        alert("Please fill in all fields correctly.");
        return;
      }

      const requestData = {
        schoolId: schoolId,
        itemName: itemType,
        quantity: quantity,
      };

      try {
        const response = await fetch("http://localhost:3000/requests/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Request submitted successfully!");
          form.reset();
        } else {
          throw new Error(result.error || "Failed to submit request.");
        }
      } catch (error) {
        console.error("Error submitting request:", error.message);
        alert("An error occurred while submitting the request.");
      }
    });
  });
 