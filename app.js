const express = require('express');
const app = express()
const cors = require('cors');
const connectDB = require('./db/connect')
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler')
const authenticationMiddleware = require('./middleware/auth');
const aiRoutes = require('./routes/ai-model');
const authRouter = require('./routes/auth')
require('dotenv').config();
require('express-async-errors');

app.use(express.json())
app.use(cors());
// app.use(cors({
//     origin: 'http://localhost:3000',
//     credentials: true 
// }));

//routes
app.get('/', (req, res) => {
    res.send('Home route')
})
app.use('/api/auth', authRouter)
app.use('/api', aiRoutes);

//middlewares
app.use(errorHandlerMiddleware);
app.use(notFoundMiddleware);


const port = process.env.PORT || 5000
const start = async() => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is running on port ${port}...`)
        })
    } catch (error) {
        console.log(error)
    }
}
start()