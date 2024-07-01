import { Router } from 'express'
import { UserController } from '../controllers/user.js'

export const createUserRouter = ({ userModel }) => {
  const userRouter = Router()
  const userController = new UserController({ userModel })

  userRouter.get('/', userController.getAllUsers)
  userRouter.get('/:id', userController.getById)
  userRouter.post('/', userController.create)
  userRouter.put('/:id', userController.update)
  userRouter.delete('/:id', userController.delete)
  return userRouter
}
