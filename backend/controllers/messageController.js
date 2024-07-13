import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";


async function sendMessage(req,res){
    try {
//         // the receipientId is the id jikso hume message bhejna hai
//         // like jane bhejna chahte hai umeshdixit ko message to recipientId = umeshDixit ke _id
        const { recipientId, message } = req.body;
        const senderId = req.user._id;                                
//         // we need to start conversation but first we need to check if we sending the first message 
//         // then we need to check conversation already exists or not
//         // if it doesn't then we need to create a new conversation
//         // but if we sending the second , or third message then we already have a conversation and add more messages in the conversation

//         // check
        let conversation = await Conversation.findOne({
            participants:{ $all: [senderId, recipientId]},
        });

//         // if we not already have a conversation create a new one
        if(!conversation)
        {
            conversation = new Conversation({
                participants: [senderId, recipientId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            })
            await conversation.save();  //save new conversation into db
        }

//         // if we have a conversation we just integrate the message into the conversation

        const newMessage = new Message({
            conversationId: conversation._id,
            sender: senderId,
            text: message
        });
        
//save the newMessage into db and then update tha last message field with this new message
        await Promise.all([
            newMessage.save(),
            conversation.updateOne({
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            })
        ])  //so when we send a new message then it updates on the your conversation message fiels below the username and also in conversation 8:26

        res.status(201).json(newMessage);
        

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

async function getMessages(req, res){
    const { otherUserId } = req.params;
    const userId = req.user._id  //get from browser session

    try {
        //first we find the conversation between userId and otherUserId
        const conversation  = await Conversation.findOne({
            participants:{ $all: [userId, otherUserId]},
        })

        // if the conversation is present then we show all messages between userId and otherUserId in descending order(-1)

        if(!conversation){
            return res.status(404).json({error:"Conversation not found"});
        }

        const messages = await Message.find({
            conversationId : conversation._id,
        }).sort({ createdAt: 1});
        //createdAt: -1 meanse in decreasing order (last message seing first)
        //createdAt: 1 meanse in ascending order (last message seing last)

        res.status(200).json(messages);

    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

// async function getConversations(req, res){

//     const userId = req.user._id;

//     try{

//         // 8:40
//         // we need to fetch all conversations ot the particular user and also we need username and profilePic
//         // but we not create model in message which provide the username and profilePic
//         // so mongooser provide the method called populate which helps to get all stuf they use reference to get all stuff

//         const conversations  = await Conversation.find({  participants: userId}).populate({
//             path: "participants",           //reference 
//             select: "username profilePic"  //we need this
//         });

//         res.status(200).json(conversations);
//     }
//     catch(error)
//     {
//         res.status(500).json({error:error.message});
//     }
// }

async function getConversations(req, res) {
	const userId = req.user._id;
	try {
		const conversations = await Conversation.find({ participants: userId }).populate({
			path: "participants",
			select: "username profilePic",
		});

		// remove the current user from the participants array
		
		res.status(200).json(conversations);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
}

export {sendMessage,getMessages,getConversations};


