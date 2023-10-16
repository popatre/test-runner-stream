const db = require("../db/connection");

exports.fetchAllUsernames = async () => {
    const { rows } = await db.query(`SELECT username FROM users;`);

    return rows;
};

exports.fetchUsernameByName = async (username) => {
    const { rows } = await db.query(
        `SELECT username, avatar_url, name FROM users WHERE username = $1;`,
        [username]
    );
    if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "invalid username" });
    }
    return rows[0];
};
