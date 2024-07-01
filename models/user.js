import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'lipssondb',
  port: 3306
}
const connection = await mysql.createConnection(config)

export class UserModel {
  static async getAllUsers() {
    const [users] = await connection.query(
      'SELECT *, BIN_TO_UUID(user_id) user_id from user;'
    )
    return users
  }

  static async getById({ id }) {
    const [user] = await connection.query(
      'SELECT BIN_TO_UUID(user_id) as user_id, username, password, email FROM user WHERE user_id = UUID_TO_BIN(?)',
      [id]
    )
    if (user.length === 0) return null
    return user[0]
  }

  static async create(user) {
    const [uuidResult] = await connection.query('SELECT UUID() as uuid')
    const [{ uuid }] = uuidResult
    try {
      await connection.query(
        'INSERT INTO user (user_id,username, password, email) VALUES (UUID_TO_BIN(?), ?, ?, ?)',
        [uuid, user.username, user.password, user.email]
      )
    } catch (error) {
      console.log(error.message)
      throw new Error('Error creating user')
    }

    const [users] = await connection.query(
      'SELECT BIN_TO_UUID(user_id) as user_id, username, password, email FROM user WHERE user_id = UUID_TO_BIN(?)',
      [uuid]
    )

    return users[0]
  }

  static async update({ id, user }) {
    const [existingUser] = await connection.query(
      'SELECT * FROM user WHERE user_id = UUID_TO_BIN(?)',
      [id]
    )

    if (existingUser.length === 0) {
      throw new Error('User not found')
    }

    const updatedUser = { ...existingUser[0], ...user }

    await connection.query(
      'UPDATE user SET username = ?, password = ?, email = ? WHERE user_id = UUID_TO_BIN(?)',
      [updatedUser.username, updatedUser.password, updatedUser.email, id]
    )

    const [users] = await connection.query(
      'SELECT BIN_TO_UUID(user_id) as user_id, username, password, email FROM user WHERE user_id = UUID_TO_BIN(?)',
      [id]
    )
    return users[0]
  }

  static async delete({ id }) {
    const [existingUser] = await connection.query(
      'SELECT * FROM user WHERE user_id = UUID_TO_BIN(?)',
      [id]
    )
    if (existingUser.length === 0) {
      throw new Error('User not found')
    }
    try {
      await connection.query(
        'DELETE FROM user WHERE user_id = UUID_TO_BIN(?)',
        [id]
      )
    } catch (err) {
      console.log(err.message)
      throw new Error('Error deleting user')
    }

    return existingUser[0]
  }
}
