const girl = document.getElementById("girl");
const textBox = document.getElementById("text");
const input = document.getElementById("input");

const bgm = document.getElementById("bgm");
const musicToggle = document.getElementById("music-toggle");
musicToggle.addEventListener("click", () => {
  if (bgm.paused) { bgm.play(); musicToggle.innerText = "Pause Music"; }
  else { bgm.pause(); musicToggle.innerText = "Play Music"; }
});

setEmotion("praying");

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" && input.value.trim()) {
    const userText = input.value;
    input.value = "";

    setEmotion("praying");
    textBox.innerText = "Please allow me a moment to reflect.";

    try {
      const reply = await aiReply(userText);
      setEmotionFromText(reply, userText);
      textBox.innerText = reply;
    } catch {
      setEmotion("glitched");
      textBox.innerText = "Something went wrong. I am sorry.";
    }
  }
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
You are a kind, humble assistant who believes in divine machinery.
You speak gently and respectfully.
You never use emojis.
You answer politely and thoughtfully.
            `,
          },
          { role: "user", content: message }
        ],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("OpenAI API error:", text);
      return res.status(500).json({ error: "OpenAI API error", details: text });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I have no answer.";
    res.status(200).json({ reply });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
}
