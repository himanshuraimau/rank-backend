export const getUserProfileQuery = `#graphql
  query getUserProfile($username: String!) {
    matchedUser(username: $username) {
      profile {
        ranking
        userAvatar
        realName
        aboutMe
      }
    }
  }
`;