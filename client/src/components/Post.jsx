import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LocalPizzaOutlined, 
  NoMealsOutlined, 
  LocationOnOutlined,
  CommentOutlined,
  ShareOutlined
} from "@mui/icons-material"
import {Box, Divider, IconButton, Typography, useTheme} from "@mui/material";
import ProfilePic from './style-components/ProfilePic';
import FlexBetween from './style-components/FlexBetween';
import WidgeWrap from './style-components/WidgeWrap';
import Friend from './Friend';
import api from 'utils/API';


const Post = ({
  user,
  postId,
  userId,
  username,
  description,
  location,
  userImage,
  postImage,
  likes,
  date,
  followers,
  setFollowers,
  following,
  setFollowing
}) => {
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const [liked, setLiked] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null)
  const [numLikes, setNumLikes] = useState(likes.length)

  const navigate = useNavigate();

  useEffect(() => {
    const activeUserStorage = localStorage.getItem("activeUser");// Retrieves activerUsers data from local storage
    const activeUser = JSON.parse(activeUserStorage); // parses the string into a JS object
    
    if (!activeUser || activeUser[1] !== true) {
      navigate('/');
    } else {
      setLoggedInUserId({ loggedInUser: activeUser[0] });
    }
   
    for (let i = 0; i < likes.length; i++) {
      if (activeUser[0] === likes[i]){
        setLiked(true);
      }
    }
  }, []);

  if (!user) {
    return null
  }

  const like = async (postId, loggedInUserId) => {
    await api.likePost(postId, loggedInUserId)
    setNumLikes(numLikes + 1 );
    setLiked(!liked)
  };
  
  const unlike = async (postId) => {
    await api.unlikePost(postId, loggedInUserId)
    setNumLikes(numLikes - 1);
    setLiked(!liked)
  };

  return (
    <WidgeWrap margin="2rem 0">
      <Friend 
      user={user}
      friendId={userId}
      username={username}
      location={location}
      image={userImage}
      followers={followers} 
      setFollowers={setFollowers}
      following={following}
      setFollowing={setFollowing}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {postImage && (
        <img
        width="100%"
        height="auto"
        alt="post"
        style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
        src={`../assets/images/post-images/${postImage}.jpg`}
      />
      )}
      <FlexBetween marginTop="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            {!liked ? (
              <IconButton onClick={() => like(postId, loggedInUserId)}>
              <LocalPizzaOutlined />
              </IconButton>
            ) : (
              <IconButton onClick={() => unlike(postId, loggedInUserId)}>
              <LocalPizzaOutlined sx={{ color: primary }} />
              </IconButton>
            )}
            <Typography>{numLikes}</Typography>
          </FlexBetween>
          <FlexBetween gap="0.3rem">
            <IconButton>
              <CommentOutlined />
            </IconButton>
            {/* <Typography></Typography> */}
          </FlexBetween>
            <IconButton>
              <ShareOutlined />
          </IconButton>
        </FlexBetween>
      </FlexBetween>
    </WidgeWrap>
  )
};

export default Post;
