const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

async function getAllVehicles() {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory`
        )
        return data.rows
    } catch (error) {
        console.error("getInventory error " + error)
    }
}

async function getInventoryByCarId(carId) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.inv_id = $1`,
            [carId]
        )
        return data.rows[0];
    }
    catch (error) {
        console.error("getclassificationbyid error " + error)
    }
}

async function addClassification(classification_name) {
    try {
        const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
        const result = await pool.query(sql, [classification_name]);
        return result.rows[0];
    } catch (error) {
        console.error("Error in add classification:", error)
        return null;
    }
}
async function addInventory(classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) {
    try {
        const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
        const result = await pool.query(sql, [classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color]);
        return result.rows[0];
    } catch (error) {
        console.error("Error in add inventory:", error)
        return null;
    }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
) {
    try {
        const sql =
            "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
        const data = await pool.query(sql, [
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
            inv_id
        ])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
    try {
        const sql = 'DELETE FROM inventory WHERE inv_id = $1'
        const data = await pool.query(sql, [inv_id])
        return data
    } catch (error) {
        new Error("Delete Inventory Error")
    }
}

module.exports = { getAllVehicles, getClassifications, getInventoryByClassificationId, getInventoryByCarId, addClassification, addInventory, updateInventory, deleteInventoryItem };
