const socket = require('socket.io');
const chatModel = require('../models/chat');

const initializeSocket = async (server) => {
    const io = socket(server, {
      cors: {
        origin: "http://localhost:3000",
      },
    });

    io.on("connection", (socket) => {
        
        socket.on("joinChat", ({id,name}) => {
            console.log(`${name} joined room:`, id)
            
            socket.join(id)
            
        });

        socket.on("sendMessage", async({newMessage,firstName,id}) => {
            console.log(newMessage, firstName, id);

            //save message to DB

           
            try {
                 const senderId = newMessage.senderId;
                 const receiverId = newMessage.receiverId;
                const text = newMessage.text;
                const timestamp = newMessage.timestamp;




                let chat = await chatModel.findOne({
                  participants: { $all: [senderId, receiverId] },
                });

                if (!chat) {
                    chat = new chatModel({
                      participants: [senderId, receiverId],
                      messages: [],
                    });
                }

                chat.messages.push({
                    senderId,
                   receiverId,
                  text,
                  timestamp,
                });

                await chat.save();
            }
            catch (err) {
                console.log(err.message);
            }
            
            io.to(id).emit("messageRecieved",{newMessage,firstName})

         });
        
        socket.on("disconnect", () => {
             
         });
    })
}


module.exports = initializeSocket;