// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

const OpenAI = require("openai")
export default function handler(req, res) {
    const {
        title, purpose, length
    } = JSON.parse(req.body)

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });


    const requestBody = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {
                "role": "system",
                "content": "You are content generation tool. After the user provides you with the topic name, article length, and pitch of the article, you will generate the article and respond with ONLY the article in Markdown format and no other extra text."
            },
            {
                "role": "user",
                "content": "Write an article on the topic \"" + title + "\". The article should be close to " + length + " words in length. Here is a pitch describing the contents of the article: " + purpose
            }
        ],
    }

    openai.chat.completions.create(requestBody)
        .then(completion => {
            console.log(completion)
            res.status(200).json({content: completion.choices[0].message.content})
        })
        .catch(e => {
            console.log(e)
            res.status(500).json({content: "The article could not be generated. Error: " + JSON.stringify(e)})
        })

}
