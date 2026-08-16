import { pool } from "../config/db.js";

export async function createChannel({ userId, channelName, streamKey }) {
  const result = await pool.query(
    `INSERT INTO channels (user_id, channel_name, stream_key)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [userId, channelName, streamKey]
  )
  return result.rows[0]
}
 
export async function findChannelByUserId(userId) {
  const result = await pool.query('SELECT * FROM channels WHERE user_id = $1', [userId])
  return result.rows[0]
}
 
export async function listChannels({ liveOnly = false } = {}) {
  const query = liveOnly
    ? `SELECT id, channel_name, title, description, avatar_url, is_live, created_at
       FROM channels WHERE is_live = true ORDER BY created_at DESC`
    : `SELECT id, channel_name, title, description, avatar_url, is_live, created_at
       FROM channels ORDER BY created_at DESC`
  const result = await pool.query(query)
  return result.rows
}
 
export async function findChannelByName(channelName) {
  const result = await pool.query(
    'SELECT * FROM channels WHERE channel_name = $1',
    [channelName]
  )
  return result.rows[0]
}
 
export async function clearAllLiveStatus() {
  const result = await pool.query(
    'UPDATE channels SET is_live = false WHERE is_live = true RETURNING id'
  )
  return result.rows
}
 
export async function findChannelByStreamKey(streamKey) {
  const result = await pool.query(
    'SELECT * FROM channels WHERE stream_key = $1',
    [streamKey]
  )
  return result.rows[0]
}
 
export async function updateChannelProfile(channelId, { title, description, avatarUrl }) {
  const result = await pool.query(
    `UPDATE channels
     SET title = $1, description = $2, avatar_url = $3
     WHERE id = $4
     RETURNING *`,
    [title, description, avatarUrl, channelId]
  )
  return result.rows[0]
}
 
export async function regenerateStreamKey(channelId, newKey) {
  const result = await pool.query(
    'UPDATE channels SET stream_key = $1 WHERE id = $2 RETURNING *',
    [newKey, channelId]
  )
  return result.rows[0]
}
 

export async function setLiveStatus(channelId, isLive) {
  const result = await pool.query(
    'UPDATE channels SET is_live = $1 WHERE id = $2 RETURNING *',
    [isLive, channelId]
  )
  return result.rows[0]
}