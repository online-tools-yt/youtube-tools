// 🔹 Replace with your project details
const SUPABASE_URL = "https://yt-thumbnail-feedback.supabase.co";
const SUPABASE_KEY = "ufodgnphqlcqizscffwx";

// Initialize Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elements
const btn = document.getElementById("submitBtn");
const type = document.getElementById("type");
const desc = document.getElementById("desc");
const msg = document.getElementById("msg");

btn.addEventListener("click", async () => {
  msg.textContent = "";

  // Validation
  if (!type.value || !desc.value.trim()) {
    msg.textContent = "Please fill all fields";
    msg.style.color = "red";
    return;
  }

  btn.disabled = true;
  btn.textContent = "Submitting...";

  try {
    const { data, error } = await supabase
      .from("feedbacks")        // Table name in Supabase
      .insert([
        {
          type: type.value,
          description: desc.value.trim(),
          page: "thumbnail-downloader"
        }
      ]);

    if (error) throw error;

    // Success
    msg.textContent = "Thank you! Feedback submitted 😊";
    msg.style.color = "#7CFC98";

    // Clear fields
    type.value = "";
    desc.value = "";

  } catch (err) {
    console.error(err);
    msg.textContent = "Error submitting feedback. Check console.";
    msg.style.color = "red";
  }

  btn.disabled = false;
  btn.textContent = "Submit";
});
