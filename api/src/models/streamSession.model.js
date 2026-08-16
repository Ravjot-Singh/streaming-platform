import { pool } from "../config/db.js";

export async function startSession(channelId) {
  const result = await pool.query(
    `INSERT INTO stream_sessions (channel_id, started_at)
     VALUES ($1, NOW())
     RETURNING *`,
    [channelId]
  )
  return result.rows[0];
}
 

export async function endLatestSession(channelId) {
  const result = await pool.query(
    `UPDATE stream_sessions
     SET ended_at = NOW()
     WHERE id = (
       SELECT id FROM stream_sessions
       WHERE channel_id = $1 AND ended_at IS NULL
       ORDER BY started_at DESC
       LIMIT 1
     )
     RETURNING *`,
    [channelId]
  )
  return result.rows[0];
}


export async function endAllOpenSessions() {
  const result = await pool.query(
    'UPDATE stream_sessions SET ended_at = NOW() WHERE ended_at IS NULL RETURNING id'
  )
  return result.rows
}