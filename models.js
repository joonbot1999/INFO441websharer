import mongoose from 'mongoose'

let models = {};

main().catch(err => console.log(err))
async function main() {
    console.log('Connecting to mongodb')
    // gotta add %40 instead of 40 because it only takes in encoded strings
    await mongoose.connect('mongodb+srv://new_user_31:12345678%40abc@cluster0.vbk21.mongodb.net/a5Database?retryWrites=true&w=majority')
    console.log('success')
    const postSchema = new mongoose.Schema({
        url: String,
        description: String,
        username: String,
        likes: Array,
        created_date: Date,
    })
    // makes a User piece
    models.Post = mongoose.model('Post', postSchema)

    const commentSchema = new mongoose.Schema({
        username: String,
        comment: String,
        post: String,
        created_date: Date
    })
    models.Comment = mongoose.model("Comment", commentSchema)

    console.log('mongoose models for post and comment created')
}

export default models;