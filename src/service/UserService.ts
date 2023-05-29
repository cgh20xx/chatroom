// 使用者資訊
type UserData = {
  id: string
  userName: string
  roomName: string
}

export default class UserService {
  // 記錄使用者的資訊
  private userMap: Map<string, UserData>

  constructor() {
    this.userMap = new Map()
  }
}