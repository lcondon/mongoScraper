var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true,
      unique: true
    },
    photo: {
      type: String
    },
    summary: {
        type: String
    },
    arrayOfCommentsId: [{ type : Schema.Types.Mixed, ref: 'Comment' }],
    arrayOfComments: [{ type : String }],
    saved: {
      type: Boolean,
      default: false
    }
  });
  
  var Article = mongoose.model("Article", ArticleSchema);
  
  module.exports = Article;