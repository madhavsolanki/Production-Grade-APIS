import mongoose from "mongoose";

const notesSchema = new mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  content:{
    type:String,
    required:true
  },
  tags:[
    {type:String},
  ],
  pinned:{
    type:Boolean,
    default:false
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }
},{timestamps:true});


export const Note = mongoose.model("Note", notesSchema);