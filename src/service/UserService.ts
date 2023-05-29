// 使用者資訊
type UserData = {
  id: string
  userName: string
  roomName: string
}

export default class UserService {
  // 記錄所有使用者的資訊
  private userMap: Map<string, UserData>

  constructor() {
    this.userMap = new Map()
  }

  addUser(userData: UserData) {
    this.userMap.set(userData.id, userData)
  }
  
  removeUser(id: string) {
    if (this.userMap.has(id)) {
      this.userMap.delete(id)
    }
  }

  getUser(id: string) {
    if (!this.userMap.has(id)) return null;

    const user = this.userMap.get(id)
    return user || null
  }

}