import mongoose from 'mongoose'

let models = {};

main().catch(err => console.log(err))
async function main() {
    console.log('Connecting to mongodb')
    // gotta add %40 instead of 40 because it only takes in encoded strings
    await mongoose.connect('mongodb+srv://new_user_31:12345678%40abc@cluster0.vbk21.mongodb.net/a3Database?retryWrites=true&w=majority')
    console.log('success')
    const postSchema = new mongoose.Schema({
        url: String,
        description: String,
        created_date: Date,
        content_type: String
    })
    // makes a USser piece
    models.Post = mongoose.model('Post', postSchema)
    console.log('mongoose model created')
}

export default models;