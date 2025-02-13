const express = require('express');
// const app = express();
const {app,server} = require('./socket')
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
app.use(express.json());
app.use(cors());
const connectDB = require('./config/db');
connectDB();

app.get('/', (req, res) => {
  res.json('Hello World');
   
});

app.use("/api/users", userRoutes);
app.use("/api/chats", chatRoutes); 
app.use("/api/message",messageRoutes);
// this will work if user enterd any other route
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

  //  chek if the user is already in the group or not while adding the user to the group
  // this part can be done in the frontend also