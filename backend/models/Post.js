const sequelize = require("../config/sequelizeDb");
const { Sequelize, DataTypes } = require("sequelize");
const PostModerated = require("./PostModerated");
const Comment = require("./Comment");
const PostDisliked = require("./PostDisliked");
const PostLiked = require("./PostLiked");
const fs = require("fs");

const Post = sequelize.define("Post", {
  post_id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
  },
  post_text: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
});

//Définition d'une relation un à plusieurs entre la table Post et Comment avec le paire d'association "hasMany" et "belongsTo"
Post.hasMany(Comment, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
Comment.belongsTo(Post, { foreignKey: "post_id" });

Post.hasMany(PostLiked, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
PostLiked.belongsTo(Post, { foreignKey: "post_id" });

Post.hasMany(PostDisliked, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
PostDisliked.belongsTo(Post, { foreignKey: "post_id" });

Post.hasOne(PostModerated, {
  foreignKey: "post_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});
PostModerated.belongsTo(Post, { foreignKey: "post_id" });

Post.afterDestroy((post, options) => {
  const filename = post.image_url.split("/images/posts/")[1];
  fs.unlink("images/posts/" + filename, () => console.log("OK"));
});

module.exports = Post;
