import axios from 'axios';

const API_URL = process.env.LEETCODE_API_URL || 'https://leetcode.com/graphql';

export async function queryLeetCodeAPI(query, variables) {
  try {
    const response = await axios.post(API_URL, 
      { query, variables },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      }
    );
    
    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }
    return response.data.data;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('LeetCode API timeout');
    }
    throw new Error(error.response?.data?.message || error.message);
  }
}