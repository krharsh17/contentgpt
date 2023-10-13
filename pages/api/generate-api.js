// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
    const {
        title, purpose, length
    } = JSON.parse(req.body)

    const baseURL = "https://api.openai.com/v1"

    const endpoint = "/chat/completions"

    const apiKey = process.env.OPENAI_API_KEY

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
        max_tokens: length * 1.5
    }

    fetch(baseURL + endpoint, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
            "Authorization": "Bearer " + apiKey,
            "Content-Type": 'application/json'
        }
    }).then(r => r.json())
        .then(r => {
            console.log(r)
            res.status(200).json({content: r.choices[0].message.content})
        })
        .catch(e => {
            console.log(e)
            res.status(500).json({content: "The article could not be generated. Error: " + JSON.stringify(e)})
        })

}
