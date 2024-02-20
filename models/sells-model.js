const pool = require("../database")

/* ************************
 * Get All Sells Buyers
 *  ******************** */

async function getSells() {
  try {
    const result = await pool.query("SELECT * FROM sells_buyers")
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* ************************
 * Get Sell by inv_id
 *  ******************** */

async function getSellByInvId(inv_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM sells_buyers WHERE inv_id = $1",
      [inv_id]
    )
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* ************************
 * Get Sells by account_id
 *  ******************** */

async function getSellsByAccountId(account_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM sells_buyers WHERE account_id = $1",
      [account_id]
    )
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* ************************
 * Get Buyers by inv_id
 *  ******************** */

async function getBuyersByInvId(inv_id) {
  try {
    const result = await pool.query(
      "SELECT * FROM sells_buyers WHERE inv_id = $1",
      [inv_id]
    )
    return result.rows
  } catch (error) {
    return error.message
  }
}

/* ************************
 * Get Sell by id
 *  ******************** */

async function getSellById(id) {
  try {
    const result = await pool.query(
      "SELECT * FROM sells_buyers WHERE sells_buyers_id = $1",
      [parseInt(id)]
    )
    return result.rows[0]
  } catch (error) {
    return error.message
  }
}

/* ************************
 * Insert Sell
 *  ******************** */

async function addSell(inv_id, account_id) {
  try {
    const sql = "INSERT INTO sells_buyers (inv_id, account_id) VALUES ($1, $2)"
    const data = await pool.query(sql, [inv_id, account_id])
    return data
  } catch (error) {
    return error.message
  }
}

/* ************************
 * Update Sell
 *  ******************** */

async function updateSell(id, inv_id, account_id) {
  try {
    const sql = "UPDATE sells_buyers SET inv_id = $1, account_id = $2 WHERE sells_buyers_id = $3"
    const data = await pool.query(sql, [inv_id, account_id, id])
    return data
  } catch (error) {
    return error.message
  }
}

/* ************************
 * Delete Sell
 *  ******************** */
async function deleteSell(id) {
  try {
    const sql = "DELETE FROM sells_buyers WHERE sells_buyers_id = $1"
    const data = await pool.query(sql, [id])
    return data
  } catch (error) {
    return error.message
  }
}


module.exports = {
  getSells,
  getSellByInvId,
  getSellsByAccountId,
  getBuyersByInvId,
  getSellById,
  addSell,
  updateSell,
  deleteSell
}