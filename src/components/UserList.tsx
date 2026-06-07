import type { Resource, User } from "../utils/types"


interface Props {
  resource: Resource<User[]>
}

export default function UserList({ resource }: Props) {

  const users: User[] = resource.read()

  return (
    <div className="user-list">
      {users.map((user) => (
        <div key={user.id} className="user-card">
          <div className="user-avatar">
            {user.name.charAt(0)}
          </div>
          <div className="user-info">
            <h3>{user.name}</h3>
            <p className="user-role">{user.role}</p>
            <p className="user-email">{user.email}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
