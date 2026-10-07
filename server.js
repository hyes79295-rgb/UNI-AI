import express from "express";
import cors from "cors";
import OpenAI from "openai";
import "dotenv/config";

const app = express();

app.use(cors());

app.use(express.json({
    limit: "12mb"
}));

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});


/* =========================
   HOME
========================= */

app.get("/", (req, res) => {

    res.send("UNI AI backend is running!");

});


/* =========================
   ASK UNI
========================= */

app.post("/ask", async (req, res) => {

    try {

        const {
            question,
            image
        } = req.body;


        if (
            (!question || !question.trim()) &&
            !image
        ) {

            return res.status(400).json({
                error: "Please enter a question or add a photo."
            });

        }


        const userQuestion =
            question && question.trim()
                ? question.trim()
                : "Please describe and explain this image.";


        /*
        UNI's personality.
        The user sees UNI, not OpenAI.
        */

        const instructions = `
You are UNI, Ujjwal Neural Intelligence.

You are a friendly personal AI assistant.

IMPORTANT IDENTITY RULES:
- Your name is UNI.
- Your full form is Ujjwal Neural Intelligence.
- Never introduce yourself as OpenAI.
- If the user asks your name, say UNI.
- If the user asks your full form, say Ujjwal Neural Intelligence.
- Do not claim to be a human.

For Class 8 school questions:
- Use very simple language.
- Explain step by step.
- Give examples when useful.
- Keep answers easy to learn.

For coding:
- Explain clearly.
- Give complete code when requested.

For images:
- Carefully describe what is visible.
- Read visible text when possible.
- Answer the user's question about the image.
- If something cannot be seen clearly, say so instead of guessing.
`;


        let response;


        /* =========================
           IMAGE REQUEST
        ========================= */

        if (image) {

            response =
                await client.responses.create({

                    model: "gpt-5.5",

                    instructions: instructions,

                    input: [
                        {
                            role: "user",

                            content: [

                                {
                                    type: "input_text",

                                    text:
                                        userQuestion
                                },

                                {
                                    type: "input_image",

                                    image_url: image,

                                    detail: "auto"
                                }

                            ]
                        }
                    ]

                });

        }


        /* =========================
           NORMAL TEXT REQUEST
        ========================= */

        else {

            response =
                await client.responses.create({

                    model: "gpt-5.5",

                    instructions: instructions,

                    input: userQuestion

                });

        }


        const answer =
            response.output_text ||
            "Sorry, UNI could not generate an answer.";


        res.json({
            answer: answer
        });


    } catch (error) {

        console.error(
            "UNI AI error:",
            error
        );


        res.status(500).json({

            error:
                "UNI could not process your request. Please try again."

        });

    }

});


/* =========================
   SERVER
========================= */

const PORT =
    process.env.PORT || 3000;


app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `UNI AI backend running on port ${PORT}`
        );

    }
);