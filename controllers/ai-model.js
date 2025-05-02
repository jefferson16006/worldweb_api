const { StatusCodes } = require('http-status-codes')
const { BadRequestError } = require('../errors')
const getTogetherResponse = require('../services/togetherService')

const handleChat = async (req, res) => {
  const { searchInput } = req.body

  if (!searchInput) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Prompt is required." })
    return
  }

  try {
    const rawReply = await getTogetherResponse(searchInput)
    const match = rawReply.match(/{[\s\S]*?}/)
    if (!match){
      throw new BadRequestError("No JSON object found in response.")
    }

    const jsonStr = match[0]
    const data = JSON.parse(jsonStr)
    res.status(StatusCodes.OK).json(data)
  } catch (err) {
    console.error("Parsing error:", err.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "Server error. Please try again very soon." })
  }
}

module.exports = handleChat
