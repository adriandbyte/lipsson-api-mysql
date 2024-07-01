import { validatePartialUser, validateUser } from '../schemas/user.js'
import _ from 'lodash'

export class UserController {
  constructor({ userModel }) {
    this.userModel = userModel
  }

  getAllUsers = async (req, res) => {
    const users = await this.userModel.getAllUsers()
    res.json(users)
  }

  getById = async (req, res) => {
    const user = await this.userModel.getById({ id: req.params.id })
    if (!user) {
      res.status(404).json({ message: 'User not found' })
    }
    res.json(user)
  }

  create = async (req, res) => {
    const result = validateUser(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }
    const newUser = await this.userModel.create(result.data)

    res.status(201).json(newUser)
  }

  update = async (req, res) => {
    const result = validatePartialUser(req.body)

    if (!result.success) {
      return res.status(400).json({ error: JSON.parse(result.error.message) })
    }

    const { id } = req.params
    const updatedUser = await this.userModel.update({ id, user: result.data })
    res.json(updatedUser)
  }

  delete = async (req, res) => {
    const { id } = req.params
    const deletedUser = await this.userModel.delete({ id })
    res.json({
      message: 'User deleted',
      deletedUser: _.omit(deletedUser, 'user_id')
    })
  }
}
